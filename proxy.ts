import { NextRequest, NextResponse } from "next/server";

const isPublicPath = (pathname: string): boolean => {
  return pathname.startsWith("/login") || pathname.startsWith("/signup");
};

export const proxy = (request: NextRequest) => {
  const { pathname, search } = request.nextUrl;
  const jwt = request.cookies.get("jwt")?.value;

  if (!jwt && !isPublicPath(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml|woff|woff2|ttf|eot)$).*)",
  ],
};
