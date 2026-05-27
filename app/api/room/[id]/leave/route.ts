import { Permissions } from "@/lib/config";
import { sql } from "@/lib/db";
import { getUserIdBySessionId, hasPermission } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const session = cookieStore.get("session_id")?.value || "";
        const user_id = await getUserIdBySessionId(session);

        if (!user_id) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });     
        
        console.log(id, user_id);
        
        await sql`UPDATE rooms_relation SET can_access = FALSE WHERE room_id = ${id} AND user_id = ${user_id}`;

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error(err)
        if (err.code === '23505') return NextResponse.json({ success: false, error: "Title of the challenge already exists !" }, { status: 400 })
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}