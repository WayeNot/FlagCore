import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const result = await sql`SELECT * FROM guess_the_place WHERE id = ${id}`
        return Response.json({ success: true, data: result }, { status: 200 })
    } catch (err: any) {
        console.error(err)
        return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
    }
}