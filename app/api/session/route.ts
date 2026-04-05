'use server'
import { cookies } from 'next/headers'
import { sql } from '@/lib/db';

export async function GET() {
    const cookie = await cookies()
    const session = cookie.get('session_id')?.value || ""
    const user = await sql`SELECT u.* FROM user_session s JOIN users u ON u.user_id = s.user_id WHERE s.session_id = ${session} LIMIT 1`
    return Response.json({ user })
}

export async function DELETE() {
    const cookie = await cookies()
    cookie.set('session_id', '', { maxAge: 0 })
    return Response.json({ success: true })
}