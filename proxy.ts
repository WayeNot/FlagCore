import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sql } from "./lib/db";
import { getRole, getUserIdBySessionId } from "./lib/session";
import { maitenance_role, public_routes } from "./lib/config";

export async function proxy(request: NextRequest) {
    const session_id = request.cookies.get("session_id")?.value;
    const path = request.nextUrl.pathname;

    const isPublicRoute = public_routes.some(route =>
        path.startsWith(route)
    )

    const result = await sql`SELECT is_in_maintenance FROM settings LIMIT 1`;
    const is_in_maintenance = result[0]?.is_in_maintenance

    let role = null

    if (session_id) {
        const user_id = await getUserIdBySessionId(session_id) 
        if (user_id) role = await getRole(user_id)
    }

    if (is_in_maintenance) {
        const isAllowedRole = role && maitenance_role.includes(role)
        if (!isPublicRoute && !isAllowedRole) return NextResponse.redirect(new URL("/dev/maintenance", request.url));
    }

    if (!session_id && !path.startsWith("/accounts") && !isPublicRoute) return NextResponse.redirect(new URL("/accounts/login", request.url));

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}