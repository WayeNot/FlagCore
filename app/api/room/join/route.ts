import { Permissions } from "@/lib/config";
import { sql } from "@/lib/db";
import { getUserIdBySessionId, hasPermission } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server"
import { randomUUID } from 'crypto'

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("session_id")?.value || "";
        const user_id = await getUserIdBySessionId(session);

        if (!user_id) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

        const { code } = await req.json()

        const isCodeExist = await sql`SELECT setter_id, staff_id FROM temp_code WHERE code = ${code} AND type = 'room' AND is_active = TRUE LIMIT 1`;

        if (!isCodeExist.length) return NextResponse.json({ success: false, error: "This code is not available !" }, { status: 400 })

        const room_id = isCodeExist[0].setter_id

        const alreadyJoin = await sql`SELECT id, can_access FROM rooms_relation WHERE room_id = ${room_id} AND user_id = ${user_id} LIMIT 1`

        if (alreadyJoin[0] && alreadyJoin[0].can_access === true) return NextResponse.json({ success: false, error: "You are already in this room !" }, { status: 400 })

        const max_user = await sql`SELECT * FROM rooms WHERE id = ${room_id} LIMIT 1`;
        const current_users = await sql`SELECT COUNT(id) FROM rooms_relation WHERE room_id = ${room_id} LIMIT 1`;        

        if (max_user[0].max_person !== 0 && Number(current_users[0].count) + 1 > max_user[0].max_person) return NextResponse.json({ success: false, error: "This room is already full !" }, { status: 400 })

        if (alreadyJoin.length) {
            alreadyJoin[0].can_access === true && await sql`UPDATE rooms_relation SET can_access = FALSE WHERE room_id = ${room_id} AND user_id = ${user_id}`
            alreadyJoin[0].can_access === false && await sql`UPDATE rooms_relation SET can_access = TRUE WHERE room_id = ${room_id} AND user_id = ${user_id}`
        } else await sql`INSERT INTO rooms_relation (room_id, user_id) VALUES (${room_id || ""}, ${user_id})`

        await sql`UPDATE temp_code SET is_active = FALSE, user_get_code = ${user_id} WHERE code = ${code} AND type = 'room' AND is_active = TRUE`;
        await sql`INSERT INTO temp_code (code, type, setter_id, staff_id) VALUES (${randomUUID()}, 'room', ${room_id}, ${isCodeExist[0].staff_id})`;

        return NextResponse.json({ success: true, room: max_user[0], data: code });
    } catch (err: any) {
        console.error(err)
        if (err.code === '23505') return NextResponse.json({ success: false, error: "Title of the challenge already exists !" }, { status: 400 })
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}