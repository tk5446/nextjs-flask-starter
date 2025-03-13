import { NextResponse } from 'next/server';
import { WorkOS } from '@workos-inc/node';
import { cookies } from 'next/headers';
import type { User } from '@/app/types/index';

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    return NextResponse.redirect('/login?error=missing_code');
  }

  try {
    const { profile } = await workos.sso.getProfileAndToken({
      code,
      clientId: process.env.WORKOS_CLIENT_ID!,
    });

    // Get organization details if user is part of one
    let organizationData = null;
    if (profile.organizationId) {
      const organization = await workos.organizations.getOrganization(profile.organizationId);
      organizationData = {
        id: organization.id,
        name: organization.name
      };
    }

    // Create our user object matching our type definition exactly
    const userData: User = {
      id: profile.id,
      email: profile.email || '',
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      userType: state === 'employer' ? 'employer' : 'job_seeker',
      profileCompleted: false,
      profileImage: undefined,
      organizationId: profile.organizationId,
      organizationName: organizationData?.name,
      companyData: organizationData ? {
        logo: undefined,
        industry: undefined,
        size: undefined,
        description: undefined,
        website: undefined,
        locations: []
      } : undefined
    };

    // Set user data in an HTTP-only cookie
    const cookieStore = cookies();
    cookieStore.set('user_session', JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    // Redirect based on user type
    const redirectPath = userData.userType === 'employer' 
      ? '/employer/dashboard'
      : '/dashboard';

    return NextResponse.redirect(new URL(redirectPath, request.url));
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.redirect('/login?error=authentication_failed');
  }
}
