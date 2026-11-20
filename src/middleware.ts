import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes for users
const userProtectedRoutes = ["/dashboard", "/home"];
const USER_SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "user_session_token";

// Define protected routes for admin
const adminProtectedRoutes = ["/spr-admin"];
const ADMIN_SESSION_COOKIE_NAME = process.env.SPR_ADMIN_SESSION_COOKIE_NAME || "admin_session_token";

// Define public routes (no auth required)
const publicRoutes = ["/login", "/spr-admin/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public routes
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check if the current path is a user protected route
  const isUserProtectedRoute = userProtectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the current path is an admin protected route
  const isAdminProtectedRoute = adminProtectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If it's a user protected route, check for user session cookie
  if (isUserProtectedRoute) {
    const sessionCookie = request.cookies.get(USER_SESSION_COOKIE_NAME);

    if (!sessionCookie) {
      // No session found, redirect to login
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If it's an admin protected route, check for admin session cookie
  if (isAdminProtectedRoute) {
    const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE_NAME);

    if (!sessionCookie) {
      // No session found, redirect to admin login
      const loginUrl = new URL("/spr-admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
