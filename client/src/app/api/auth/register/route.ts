import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const result = await backendFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
    });

    if (result.error) {
        return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data, { status: result.status });
}
