import { NextRequest, NextResponse } from "next/server";

const isPublicPath = (pathname: string): boolean => {
  return pathname.startsWith("/login") || pathname.startsWith("/signup");
};

export const proxy = (request: NextRequest) => {
  const { pathname, search } = request.nextUrl;
  const jwt = request.cookies.get("jwt")?.value;

  if (!jwt && !isPublicPath(pathname)) {
    const loginUrl = new URL("/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    const maxAge = 60 * 10; // 10分間
    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set("next", encodeURIComponent(`${pathname}${search}`), {
      maxAge,
      path: "/",
      sameSite: "lax",
      secure: isProduction,
    });

    return response;
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml|woff|woff2|ttf|eot)$).*)",
  ],
};
