import { WorkOS } from '@workos-inc/node';
import { cookies } from 'next/headers';
import { GET as loginHandler } from '../api/auth/login/route';
import { GET as callbackHandler } from '../api/auth/callback/route';

// Mock WorkOS SDK
jest.mock('@workos-inc/node');
jest.mock('next/headers');

describe('WorkOS Authentication Flow', () => {
  const mockWorkOS = {
    userManagement: {
      authenticateWithCode: jest.fn(),
      getAuthorizationUrl: jest.fn()
    },
    organizations: {
      getOrganization: jest.fn()
    }
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    (WorkOS as jest.Mock).mockImplementation(() => mockWorkOS);
  });

  describe('Login Route', () => {
    it('generates correct authorization URL for employers', async () => {
      const request = new Request('http://localhost:3000/api/auth/login?type=employer');
      mockWorkOS.userManagement.getAuthorizationUrl.mockResolvedValue('https://auth.workos.com/authorize?client_id=123');

      const response = await loginHandler(request);
      const data = await response.json();

      expect(mockWorkOS.userManagement.getAuthorizationUrl).toHaveBeenCalledWith({
        clientId: process.env.WORKOS_CLIENT_ID,
        redirectUri: process.env.WORKOS_REDIRECT_URI,
        state: expect.any(String),
        organizationOptions: {
          type: 'employer'
        }
      });
      expect(data.authorization_url).toBe('https://auth.workos.com/authorize?client_id=123');
    });

    it('generates correct authorization URL for job seekers', async () => {
      const request = new Request('http://localhost:3000/api/auth/login?type=job_seeker');
      mockWorkOS.userManagement.getAuthorizationUrl.mockResolvedValue('https://auth.workos.com/authorize?client_id=123');

      const response = await loginHandler(request);
      const data = await response.json();

      expect(mockWorkOS.userManagement.getAuthorizationUrl).toHaveBeenCalledWith({
        clientId: process.env.WORKOS_CLIENT_ID,
        redirectUri: process.env.WORKOS_REDIRECT_URI,
        state: expect.any(String)
      });
      expect(data.authorization_url).toBe('https://auth.workos.com/authorize?client_id=123');
    });
  });

  describe('Callback Route', () => {
    const mockCookieStore = {
      set: jest.fn()
    };

    beforeEach(() => {
      (cookies as jest.Mock).mockReturnValue(mockCookieStore);
    });

    it('handles employer authentication correctly', async () => {
      const request = new Request('http://localhost:3000/api/auth/callback?code=123');
      const mockUser = {
        id: 'user_123',
        email: 'employer@company.com',
        firstName: 'John',
        lastName: 'Doe',
        organizationId: 'org_123'
      };

      const mockOrg = {
        id: 'org_123',
        name: 'Test Company'
      };

      mockWorkOS.userManagement.authenticateWithCode.mockResolvedValue({ user: mockUser });
      mockWorkOS.organizations.getOrganization.mockResolvedValue(mockOrg);

      const response = await callbackHandler(request);

      expect(mockWorkOS.userManagement.authenticateWithCode).toHaveBeenCalledWith({
        code: '123',
        clientId: process.env.WORKOS_CLIENT_ID
      });

      expect(mockWorkOS.organizations.getOrganization).toHaveBeenCalledWith('org_123');

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'user_session',
        expect.stringContaining('"userType":"employer"'),
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7
        })
      );

      expect(response.headers.get('location')).toBe('http://localhost:3000/employer/dashboard');
    });

    it('handles job seeker authentication correctly', async () => {
      const request = new Request('http://localhost:3000/api/auth/callback?code=456');
      const mockUser = {
        id: 'user_456',
        email: 'jobseeker@email.com',
        firstName: 'Jane',
        lastName: 'Smith'
      };

      mockWorkOS.userManagement.authenticateWithCode.mockResolvedValue({ user: mockUser });

      const response = await callbackHandler(request);

      expect(mockWorkOS.userManagement.authenticateWithCode).toHaveBeenCalledWith({
        code: '456',
        clientId: process.env.WORKOS_CLIENT_ID
      });

      expect(mockWorkOS.organizations.getOrganization).not.toHaveBeenCalled();

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'user_session',
        expect.stringContaining('"userType":"job_seeker"'),
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7
        })
      );

      expect(response.headers.get('location')).toBe('http://localhost:3000/dashboard');
    });

    it('handles missing code parameter', async () => {
      const request = new Request('http://localhost:3000/api/auth/callback');
      const response = await callbackHandler(request);

      expect(response.headers.get('location')).toBe('http://localhost:3000/login?error=missing_code');
    });

    it('handles authentication errors', async () => {
      const request = new Request('http://localhost:3000/api/auth/callback?code=invalid');
      mockWorkOS.userManagement.authenticateWithCode.mockRejectedValue(new Error('Invalid code'));

      const response = await callbackHandler(request);

      expect(response.headers.get('location')).toBe('http://localhost:3000/login?error=authentication_failed');
    });
  });
});
