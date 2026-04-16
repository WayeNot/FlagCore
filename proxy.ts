import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const session_id = request.cookies.get("session_id")?.value;
    const path = request.nextUrl.pathname;

    const isAuthPage = path.startsWith("/accounts");

    if (!session_id && !isAuthPage) {
        return NextResponse.redirect(new URL("/accounts/login", request.url));
    }

    if (session_id && isAuthPage) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next|favicon.ico).*)"],
};