import { Permissions } from "@/lib/config";
import { sql } from "@/lib/db";
import { getUserIdBySessionId, hasPermission } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {        
        const { id } = await params;
        const data = await sql`SELECT * FROM sanctions WHERE type = 'warn' AND user_id = ${id} AND show_notif = TRUE ORDER BY id DESC LIMIT 1`;
        return NextResponse.json({ success: true, data: data[0] || null }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ success: false, error: "DB Error" }, { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { warn_id } = await req.json();
        const cookieStore = await cookies()
        const staff_id = await getUserIdBySessionId(cookieStore.get('session_id')?.value)
        
        if (!await hasPermission(Permissions.advanced.administrator, staff_id) && !await hasPermission(Permissions.panelAdmin.user.sanctions, staff_id)) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

        const data = await sql`UPDATE sanctions SET show_notif = FALSE WHERE id = ${warn_id} AND user_id = ${id}`;
        return NextResponse.json({ success: true, data: data[0] }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ success: false, error: "DB Error" }, { status: 500 })
    }
}