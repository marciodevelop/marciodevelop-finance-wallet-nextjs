import { NextResponse } from "next/server";
import { auth } from "../auth";
import { authRoutes, apiAuthPrefix, DEFAULT_LOGIN_REDIRECT } from "../routes";

export default auth((request: any) => {
  const { nextUrl } = request;
  const isLoggedIn = !!request.auth;
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

  if (isApiAuthRoute) {
    return NextResponse.next();
}

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }
  if (!isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
