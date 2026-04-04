'use server'
import { cookies } from 'next/headers'
import { getUserData, getUserIdBySessionId } from '../user/route'
import { sql } from '@/lib/db'

export async function GET() {
    const cookie = await cookies()
    const session = cookie.get('session_id')?.value || ""
    if (!session) return Response.json("")
    const user_id = await getUserIdBySessionId(session)
    if (!user_id) return Response.json({ userData: null })
    const userData = await getUserData(user_id)
    return Response.json({ userData })
}

export async function DELETE() {
    const cookie = await cookies()
    const session = cookie.get('session_id')?.value

    if (!session) return Response.json({ success: false })

    await sql`UPDATE user_session SET is_active = FALSE WHERE session_id = ${session}`

    cookie.set('session_id', '', { maxAge: 0 })

    return Response.json({ success: true })
}