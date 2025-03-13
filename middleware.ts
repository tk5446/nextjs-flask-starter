import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected paths and their access rules
const protectedPaths = {
  employer: [
    '/employer/dashboard',
    '/employer/jobs',
    '/employer/profile',
  ],
  jobSeeker: [
    '/dashboard',
    '/jobs/saved',
    '/profile',
  ],
  authenticated: [
    '/jobs/apply',
    '/messages',
    '/settings',
  ]
};

// Helper to check if path matches any of the patterns
const matchesPath = (path: string, patterns: string[]) => {
  return patterns.some(pattern => 
    path.startsWith(pattern) || 
    path === pattern
  );
};

export async function middleware(request: NextRequest) {
  const userSession = request.cookies.get('user_session');
  const path = request.nextUrl.pathname;

  // If no session and trying to access protected route, redirect to login
  if (!userSession && (
    matchesPath(path, protectedPaths.employer) ||
    matchesPath(path, protectedPaths.jobSeeker) ||
    matchesPath(path, protectedPaths.authenticated)
  )) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If has session, parse user data
  if (userSession) {
    try {
      const user = JSON.parse(userSession.value);
      const isEmployer = user.userType === 'employer';
      const isJobSeeker = user.userType === 'job_seeker';

      // Employer trying to access job seeker routes
      if (isEmployer && matchesPath(path, protectedPaths.jobSeeker)) {
        return NextResponse.redirect(new URL('/employer/dashboard', request.url));
      }

      // Job seeker trying to access employer routes
      if (isJobSeeker && matchesPath(path, protectedPaths.employer)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // Check profile completion for certain routes
      if (!user.profileCompleted && !path.endsWith('/profile')) {
        const profilePath = isEmployer ? '/employer/profile' : '/profile';
        if (
          matchesPath(path, protectedPaths.employer) ||
          matchesPath(path, protectedPaths.jobSeeker)
        ) {
          return NextResponse.redirect(new URL(profilePath, request.url));
        }
      }
    } catch (error) {
      console.error('Failed to parse user session:', error);
      // Invalid session, clear it
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('user_session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};
