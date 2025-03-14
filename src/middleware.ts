// src/middleware.ts

import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  {
    pages: {
      signIn: "/auth/login",
    },
    callbacks: {
      authorized: ({ req, token }) => {
        // Allow access to the home page without authentication
        if (req.nextUrl.pathname === "/") {
          return true;
        }
        
        // Require authentication for other routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!auth|api/auth|api/stripe/webhook|_next|favicon.ico).*)"],
};