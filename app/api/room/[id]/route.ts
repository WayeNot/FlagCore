import { Permissions } from "@/lib/config";
import { sql } from "@/lib/db";
import { getUserIdBySessionId, hasPermission } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const session = cookieStore.get("session_id")?.value || "";
        const user_id = await getUserIdBySessionId(session);

        const room = await sql`SELECT * FROM rooms WHERE id = ${id} LIMIT 1`
        
        return NextResponse.json({ success: true, data: room[0] }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ success: false, error: "DB Error" }, { status: 500 })
    }
}