import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const result = await sql`SELECT s.id, s.user_id, s.suggest, s.created_at, u.username, u.user_id FROM suggest s LEFT JOIN users u on s.user_id = u.user_id ORDER BY s.id DESC`
    return NextResponse.json(result)
}

export async function POST(req: Request) {
    const { user_id, text } = await req.json()
    
    if ( !user_id ) return NextResponse.json({ success: false, error: "Vous ne pouvez pas faire ceci !" }, { status: 400 })
    if ( !text ) return NextResponse.json({ success: false, error: "Aucune suggestion renseignée !" }, { status: 400 })

    const res = await sql`INSERT INTO suggest (user_id, suggest) VALUES (${user_id}, ${text}) RETURNING *`
    console.log(res[0]);
    
    return NextResponse.json(res[0])
}

export async function DELETE(req: Request) {
    const { suggest_id } = await req.json()
    
    if ( !suggest_id ) return NextResponse.json({ success: false, error: "Aucune suggestion renseignée !" }, { status: 400 })

    await sql`DELETE FROM suggest WHERE id = ${suggest_id}`
    return NextResponse.json({ success: true })
}