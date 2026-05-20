import { default_pp } from "@/lib/config";
import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { username, mail, bio, pp_url, status } = await req.json();

        if ( !username || !mail || !bio || !status ) return NextResponse.json({ success: false, error: "Missing field(s)" }, { status: 403 })

        await sql`UPDATE users SET username = ${username}, mail = ${mail}, bio = ${bio}, pp_url = ${pp_url || default_pp}, status = ${status} WHERE user_id = ${id}`;

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
    }
}