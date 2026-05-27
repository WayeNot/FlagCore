import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const cookieStore = await cookies()
        const session_id = cookieStore.get("session_id")?.value

        await sql`UPDATE users SET is_disabled = TRUE WHERE user_id = ${id}`;
        sql`UPDATE user_session SET is_active = FALSE WHERE session_id = ${session_id}`
        cookieStore.delete('session_id')
        cookieStore.delete('isGuest')
        return NextResponse.json({ success: true }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
    }
}