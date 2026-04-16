import { sql } from "@/lib/db"
import { cookies } from "next/headers"

export async function POST() {
    const cookie = await cookies()
    const session_id = cookie.get("session_id")
    if (!session_id) return Response.json({ success: false, error: "Aucun cookie !" }, { status: 403 })
    sql`UPDATE user_session SET is_active = FALSE WHERE session_id = ${session_id}`
    cookie.delete('session_id')
    return Response.json({ success: true })
}