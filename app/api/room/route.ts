import { Permissions } from "@/lib/config";
import { sql } from "@/lib/db";
import { getUserIdBySessionId, hasPermission } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("session_id")?.value || "";
        const user_id = await getUserIdBySessionId(session);

        const createdRoom = await sql`SELECT * FROM rooms WHERE created_by = ${user_id} ORDER BY id ASC`
        const activeRoom = await sql`SELECT rooms.id, rooms.name, rooms.description, rooms.administrators, rooms.max_person, rooms.created_at, rooms.created_by, rooms_relation.id AS room_relation_id, rooms_relation.room_id, rooms_relation.user_id, rooms_relation.can_access FROM rooms JOIN rooms_relation ON rooms_relation.room_id = rooms.id AND rooms_relation.user_id = ${user_id} AND rooms_relation.can_access = TRUE ORDER BY rooms_relation.id ASC`
        const inactiveRoom = await sql`SELECT rooms.id, rooms.name, rooms.description, rooms.administrators, rooms.max_person, rooms.created_at, rooms.created_by, rooms_relation.id AS room_relation_id, rooms_relation.room_id, rooms_relation.user_id, rooms_relation.can_access FROM rooms JOIN rooms_relation ON rooms_relation.room_id = rooms.id AND rooms_relation.user_id = ${user_id} AND rooms_relation.can_access = FALSE ORDER BY rooms_relation.id ASC`
        
        return NextResponse.json({ success: true, createdRoom: createdRoom, activeRoom: activeRoom, inactiveRoom: inactiveRoom }, { status: 200 })
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

        if ((!await hasPermission(Permissions.advanced.administrator, user_id) && ( !await hasPermission(Permissions.room.canCreateRoom, user_id)) )) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

        const { newRoom } = await req.json()

        const result = await sql`INSERT INTO rooms (name, description, administrators, max_person, created_by) VALUES (${newRoom.name || ""}, ${newRoom.description || ""}, ${newRoom.administrators || []}, ${newRoom.max_person}, ${user_id}) RETURNING id`;

        return NextResponse.json({ success: true, id: result[0].id });
    } catch (err: any) {
        console.error(err)
        if (err.code === '23505') return NextResponse.json({ success: false, error: "Title of the challenge already exists !" }, { status: 400 })
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("session_id")?.value || "";
        const user_id = await getUserIdBySessionId(session);

        if (!user_id) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

        if ((!await hasPermission(Permissions.advanced.administrator, user_id) && ( !await hasPermission(Permissions.room.canCreateRoom, user_id)) )) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

        const { id, editRoom } = await req.json()

        const administrators = editRoom.administrators.map((a: any) => a.user_id)

        await sql`UPDATE rooms SET name = ${editRoom.name || ""}, description = ${editRoom.description || ""}, administrators = ${administrators}, max_person = ${editRoom.max_person} WHERE id = ${id} RETURNING id`;

        return NextResponse.json({ success: true });
        // return NextResponse.json({ success: true, id: result[0].id });
    } catch (err: any) {
        console.error(err)
        if (err.code === '23505') return NextResponse.json({ success: false, error: "Title of the challenge already exists !" }, { status: 400 })
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("session_id")?.value || "";
        const user_id = await getUserIdBySessionId(session);

        if (!user_id) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

        if ((!await hasPermission(Permissions.advanced.administrator, user_id) && ( !await hasPermission(Permissions.room.canEditRoom, user_id)) )) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

        const { id } = await req.json()

        await sql`DELETE FROM rooms WHERE id = ${id}`;
        await sql`DELETE FROM rooms_relation WHERE room_id = ${id}`;
        await sql`DELETE FROM temp_code WHERE setter_id = ${id}`;

        return NextResponse.json({ success: true });
        // return NextResponse.json({ success: true, id: result[0].id });
    } catch (err: any) {
        console.error(err)
        if (err.code === '23505') return NextResponse.json({ success: false, error: "Title of the challenge already exists !" }, { status: 400 })
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}