import { randomBytes } from "crypto";
import { sql } from "./db";
import { NextResponse } from "next/server";

export function generateSessionId() {
    return randomBytes(32).toString("hex")
}

export async function getUserIdBySessionId (session_id: any) {
    const result = await sql`SELECT user_id FROM user_session WHERE session_id = ${session_id}`
    return result[0].user_id
}

export async function getUserData (user_id: any) {
    return await sql`SELECT * FROM users WHERE user_id = ${user_id}`
}

export async function getRole (user_id: any) { 
    const req = await sql`SELECT role FROM users WHERE user_id = ${await user_id}`
    return req[0].role
}

export async function hasRole(role: any, user_id: any) {
    console.log((await getRole(user_id)).includes(role));
    
    return (await getRole(user_id)).includes(role)
}