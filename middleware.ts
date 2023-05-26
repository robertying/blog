import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const redirects: Record<string, string> = {
  "/resume": "https://dl.ruiying.io/Resume_Rui_Ying.pdf",
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname;

  if (redirects[url]) {
    const response = NextResponse.redirect(redirects[url], 301);
    response.headers.set("cache-control", "private, max-age=90");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
