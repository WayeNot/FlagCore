import { sql } from "@/lib/db";
import { getUserIdBySessionId, hasRole } from "@/lib/session";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers'

export async function GET() {
    const req = await sql`SELECT * FROM ctf`;
    return NextResponse.json(req)
}

export async function POST(req: Request) {
    try {
        const { name, description, difficulty, category, flag_format, max_attempt, file_to_download } = await req.json()

        const cookieStore = await cookies()
        const session = cookieStore.get('session_id')?.value || ""
        const user_id = getUserIdBySessionId(session)
        
        if (!await hasRole("owner", user_id)) return NextResponse.json({ success: false }, { status: 403 })
        
        sql`INSERT INTO ctf (name, description, difficulty, category, flag_format, max_attempt, file_to_download, creatord_id) VALUES (${name}, ${description}, ${difficulty}, ${category}, ${flag_format}, ${max_attempt}, ${file_to_download}, ${user_id} )`
        return NextResponse.json({ success: true })
    } catch (err: any) {
        console.error(err)
        return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
    }
}