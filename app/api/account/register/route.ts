'use server'

import { sql } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { generateSessionId } from '@/lib/session'

export async function POST(req: Request) {
    try {
        const { username, mail, password } = await req.json()

        if (!username || !mail || !password || typeof username !== "string" || typeof mail !== "string" || typeof password !== "string") return new Response("Missing fields", { status: 400 })

        const hashedPassword = await bcrypt.hash(password, 6)
        const sessionId = generateSessionId()

        const user = await sql`INSERT INTO users ( username, email, password ) VALUES ( ${username}, ${mail}, ${hashedPassword} ) RETURNING user_id`
        await sql`INSERT INTO user_session ( session_id, user_id ) VALUES ( ${sessionId}, ${user[0].user_id} )`

        const res = NextResponse.json({ success: true })

        res.cookies.set('session_id', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7
        })

        return res
    } catch (err: any) {
        console.error(err)

        if (err.code === '23505') {
            return new Response("Email / Nom d'utilisateur déjà pris !", { status: 400 })
        }

        return new Response("DB Error", { status: 500 })
    }
}