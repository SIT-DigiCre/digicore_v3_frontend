import { NextRequest, NextResponse } from "next/server";

import { createServerApiClientWithToken } from "@/utils/fetch/client";

const isPublicPath = (pathname: string): boolean => {
  return pathname.startsWith("/login") || pathname.startsWith("/signup");
};

const isValidToken = async (token: string): Promise<boolean> => {
  try {
    const client = createServerApiClientWithToken(token);
    const res = await client.GET("/user/me");
    return res.response.status == 200;
  } catch {
    return false;
  }
};

export const proxy = async (request: NextRequest) => {
  const { pathname, search } = request.nextUrl;
  const jwt = request.cookies.get("jwt")?.value;
  const existingNext = request.cookies.get("next")?.value;

  if (!isPublicPath(pathname)) {
    const isAuthenticated = jwt != null && (await isValidToken(jwt));

    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      const response = NextResponse.redirect(loginUrl);
      const maxAge = 60 * 10; // 10分間
      const isProduction = process.env.NODE_ENV === "production";

      if (!existingNext) {
        response.cookies.set("next", `${pathname}${search}`, {
          httpOnly: true,
          maxAge,
          path: "/",
          sameSite: "lax",
          secure: isProduction,
        });
      }

      // 期限切れ等の無効なトークンのCookieをクリア
      if (jwt) {
        response.cookies.delete("jwt");
      }

      return response;
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml|woff|woff2|ttf|eot)$).*)",
  ],
};
