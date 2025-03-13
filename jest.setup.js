import '@testing-library/jest-dom';

// Mock environment variables
process.env.WORKOS_API_KEY = 'test_api_key';
process.env.WORKOS_CLIENT_ID = 'test_client_id';
process.env.WORKOS_REDIRECT_URI = 'http://localhost:3000/api/auth/callback';
