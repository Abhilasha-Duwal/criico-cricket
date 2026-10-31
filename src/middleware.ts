import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/jwt";
import { safeNextPath } from "@/lib/redirect";

const AUTH_ROUTES = new Set(["/login", "/register"]);

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  const isAuthRoute = AUTH_ROUTES.has(pathname);

  if (isAuthRoute) {
    if (session) {
      const destination = safeNextPath(
        request.nextUrl.searchParams.get("next"),
      );
      return NextResponse.redirect(new URL(destination, request.url));
    }

    const response = NextResponse.next();

    if (token) {
      response.cookies.delete(SESSION_COOKIE);
    }

    return response;
  }

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);

    const response = NextResponse.redirect(loginUrl);

    if (token) {
      response.cookies.delete(SESSION_COOKIE);
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
