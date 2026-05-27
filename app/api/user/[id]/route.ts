import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {    
    try {
        const { id } = await params;
        
        const result = await sql`SELECT user_id, username, bio, role, mail, created_at, coins, points, pp_url, status, is_anonymous, banner, social_media FROM users WHERE user_id = ${id} LIMIT 1`;
        
        return NextResponse.json({ success: true, data: result[0] }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ success: false, error: "DB Error" }, { status: 500 })
    }
}