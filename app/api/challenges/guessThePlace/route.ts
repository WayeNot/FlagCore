'use server'
import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    const result = await sql`SELECT * FROM guess_the_place`
    return NextResponse.json(result)
}

export async function POST(req: Request) {
    try {
        const data = await req.json()
        console.log(data);

        const { title, description, difficulty, image, flag, hint, points } = data

        if (!title || !description || !difficulty || !flag) return new Response("Missing fields", { status: 400 })

        const result = await sql`INSERT INTO guess_the_place (title, description, image, difficulty, flag, hint, points) VALUES (${title}, ${description}, ${image}, ${difficulty}, ${flag}, ${hint}, ${points}) RETURNING id`
        const insertedId = result?.[0]?.id

        if (!insertedId) {
            return new Response("Insert failed", { status: 500 })
        }

        return Response.json({ success: true, id: result[0].id }, { status: 200 })
    } catch (err: any) {
        console.error(err)
        return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
    }
}