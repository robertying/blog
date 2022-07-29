import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

const redirects: any = {
  "/resume": "https://dl.ruiying.io/Resume_Rui_Ying.pdf",
};

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const url = req.nextUrl.pathname;

  if (redirects[url]) {
    const response = NextResponse.redirect(redirects[url], 301);
    response.headers.set("cache-control", "private, max-age=90");
    return response;
  }

  return NextResponse.next();
}
