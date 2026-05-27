import { sql } from "@/lib/db"
import { getUserIdBySessionId } from "@/lib/session";
import { cookies } from "next/headers"
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const cookieStore = await cookies()
        const session_id = cookieStore.get("session_id")?.value
        const user_id = await getUserIdBySessionId(session_id)
        sql`UPDATE user_session SET is_active = FALSE WHERE user_id = ${user_id}`
        cookieStore.delete('session_id')
        cookieStore.delete('isGuest')
        return NextResponse.json({ success: true }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}