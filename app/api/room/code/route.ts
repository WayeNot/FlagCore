import { Permissions } from "@/lib/config";
import { sql } from "@/lib/db";
import { getUserIdBySessionId, hasPermission } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server"
import { randomUUID } from 'crypto'

export async function GET() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("session_id")?.value || "";
        const user_id = await getUserIdBySessionId(session);

        if (!user_id) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

        if ((!await hasPermission(Permissions.advanced.administrator, user_id) && (!await hasPermission(Permissions.room.canManageUser, user_id)))) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

        const req = await sql`SELECT code FROM temp_code WHERE staff_id = ${user_id} AND type = 'room' AND is_active = TRUE LIMIT 1`

        // if (!req.length) 

        return NextResponse.json({ success: true, data: req[0]?.code || "" }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ success: false, error: "DB Error" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("session_id")?.value || "";
        const user_id = await getUserIdBySessionId(session);

        if (!user_id) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

        if ((!await hasPermission(Permissions.advanced.administrator, user_id) && (!await hasPermission(Permissions.room.canCreateRoom, user_id)))) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

        const { room_id } = await req.json()

        const code = randomUUID()

        await sql`DELETE FROM temp_code WHERE type = 'room' AND is_active = TRUE AND staff_id = ${user_id}`
        await sql`INSERT INTO temp_code (code, type, setter_id, staff_id) VALUES (${code}, 'room', ${room_id}, ${user_id})`;

        return NextResponse.json({ success: true, data: code });
    } catch (err: any) {
        console.error(err)
        if (err.code === '23505') return NextResponse.json({ success: false, error: "Title of the challenge already exists !" }, { status: 400 })
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}