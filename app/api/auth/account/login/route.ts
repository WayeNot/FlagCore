import { sql } from '@/lib/db'
import { generateSessionId } from '@/lib/session'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json()

        if (!username || !password || typeof username !== "string" || typeof password !== "string") return NextResponse.json({ success: false, error: "Champ(s) manquant(s) !" }, { status: 400 })

        const user = await sql`SELECT user_id, password FROM users WHERE username = ${username} LIMIT 1`

        const hash = user[0]?.password ?? "$2a$10$invalidhashinvalidhashinvalidhashinv"
        const isGoodPassword = await bcrypt.compare(password, hash)

        if (!user[0] || !isGoodPassword) return NextResponse.json({ success: false, error: "Erreur d'identification" }, { status: 401 })

        const sessionId = generateSessionId()

        await sql`WITH disabled AS (UPDATE user_session SET is_active = FALSE WHERE user_id = ${user[0].user_id}) INSERT INTO user_session (session_id, user_id) VALUES (${sessionId}, ${user[0].user_id})`
        
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
        return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
    }
}