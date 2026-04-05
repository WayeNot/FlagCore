import { sql } from "@/lib/db"

export async function GET() {
    const [features, suggest, patchnote] = await Promise.all([
        sql`SELECT id, feature FROM features ORDER BY id DESC`,
        sql`SELECT s.id, s.user_id, s.suggest, s.created_at, u.username 
            FROM suggest s 
            LEFT JOIN users u ON s.user_id = u.user_id 
            ORDER BY s.id DESC`,
        sql`SELECT * FROM patchnote`
    ])

    return Response.json({
        features,
        suggest,
        patchnote
    })
}