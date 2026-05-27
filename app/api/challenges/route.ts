import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import { getUserIdBySessionId, hasPermission } from "@/lib/session";
import { cookies } from 'next/headers'
import { Permissions } from "@/lib/config";
import { categoryReward, difficultyReward, flagDifficultyMultiplier, hintDifficultyMultiplier } from "@/lib/types";

export const runtime = "nodejs";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const challengeType = searchParams.get("type");

        const result = await sql`SELECT id, title, difficulty FROM challenges WHERE type = ${challengeType} AND status = 'active'`;

        return NextResponse.json(result)
    } catch (err) {
        return NextResponse.json({ success: false, error: "DB Error" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const challenge_type = searchParams.get("type");
        const cookieStore = await cookies();
        const session = cookieStore.get("session_id")?.value || "";
        const user_id = await getUserIdBySessionId(session);

        if (!user_id) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

        if ((challenge_type === "ctf" && !await hasPermission(Permissions.advanced.administrator, user_id) && (!await hasPermission(Permissions.contributor.canCreate.ctf, user_id)) || (challenge_type === "geoint" && !await hasPermission(Permissions.advanced.administrator, user_id)) && !await hasPermission(Permissions.contributor.canCreate.geoint, user_id))) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

        const { challenge, flags, files } = await req.json()

        type Difficulty = keyof typeof difficultyReward;
        type Category = keyof typeof categoryReward;

        const categories = challenge.category as Category[];
        const difficulty = challenge.difficulty as Difficulty;

        const averageCategoryReward = categories.reduce((acc, cat) => { return acc + (categoryReward[cat] ?? 0); }, 0) / Math.max(categories.length, 1);

        const baseReward = difficultyReward[difficulty] ?? 0;

        const challengeCoins = Math.floor(baseReward + averageCategoryReward);

        const challengePoints = Math.floor((baseReward * 1.5) + (averageCategoryReward * 2));

        const result = await sql`INSERT INTO challenges (title, description, difficulty, category, flag_format, files, creator_id, coins, points, images, type) VALUES (${challenge.title || ""}, ${challenge.description || ""}, ${challenge.difficulty || ""}, ${challenge.category || []}, ${challenge.flag_format || ""}, ${files || []}, ${challenge.creators || [user_id]}, ${challengeCoins || 0}, ${challengePoints || 0}, ${challenge.images || null}, ${challenge_type}) RETURNING id`;
        for (const flag of flags) {
            const flagDifficulty = flag.difficulty as Difficulty;
            const multiplier = flagDifficultyMultiplier[flagDifficulty] ?? 1;
            const finalFlagCoins = Math.floor((challengeCoins / flags.length) * multiplier);
            const finalFlagPoints = Math.floor(challengePoints / flags.length * multiplier);

            const hintCost = finalFlagCoins * 2;
            
            await sql`INSERT INTO flags (challenge_id, challenge_type, title, flag, flag_format, description, hint, hint_cost, coins, points, difficulty) VALUES (${result[0].id}, ${challenge_type}, ${flag.title}, ${flag.flag}, ${flag.flag_format || "x"}, ${flag.description}, ${flag.hint}, ${hintCost || 0}, ${finalFlagCoins || 0}, ${finalFlagPoints || 0}, ${flag.difficulty} )`
        }

        return NextResponse.json({ success: true, id: result[0].id });
    } catch (err: any) {
        console.error(err)
        if (err.code === '23505') return NextResponse.json({ success: false, error: "Title of the challenge already exists !" }, { status: 400 })
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}