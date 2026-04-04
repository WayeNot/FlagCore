import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const result = await sql`SELECT user_id, username, email, role, created_at FROM users`
    return NextResponse.json(result)
}