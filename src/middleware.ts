console.log("Middleware NextAuth lancé");

import { withAuth } from "next-auth/middleware";

export default withAuth(
  {
    pages: {
      signIn: "/auth/login",
    },
    callbacks: {
      authorized: ({ token }) => {
        console.log("Token dans middleware :", token);
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!auth|api/auth|_next|favicon.ico).*)"],
};
