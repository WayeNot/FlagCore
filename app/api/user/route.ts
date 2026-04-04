'use server'

import { sql } from '@/lib/db'
import { cookies } from 'next/headers'
import { randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function getUserIdBySessionId (session_id: any) {
    const result = await sql`SELECT user_id FROM user_session WHERE session_id = ${session_id}`
    return result[0].user_id
}

export async function getUserData (user_id: any) {
    return await sql`SELECT * FROM users WHERE user_id = ${user_id}`
}

export async function GET(user_id: any) {
    try {
        const users = await getUserData(user_id)
        return new Response(JSON.stringify(users), { status: 200 })
    } catch (err) {
        console.error(err)
        return new Response("DB Error", { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const { username, mail, password } = await req.json()

        if (!username || !mail || !password) {
            return new Response("Missing fields", { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 15);
        const sessionId = randomBytes(32).toString('hex')

        const user = await sql`INSERT INTO users ( username, email, password ) VALUES ( ${username}, ${mail}, ${hashedPassword} ) RETURNING user_id`
        await sql`INSERT INTO user_session ( session_id, user_id ) VALUES ( ${sessionId}, ${user[0].user_id} )`

        const res = NextResponse.json({ success: true })

        res.cookies.set('session_id', sessionId, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/',
        })

        return res
    } catch (err: any) {
        console.error(err)

        if (err.code === '23505') {
            return new Response("Email déjà pris !", { status: 400 })
        }

        return new Response("DB Error", { status: 500 })
    }
}