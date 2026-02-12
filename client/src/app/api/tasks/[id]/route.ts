import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

function getToken(req: NextRequest) {
    return req.headers.get("Authorization")?.split(" ")[1] || "";
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const token = getToken(req);

    const result = await backendFetch(`/api/task/${id}`, {
        method: "GET",
        token,
    });

    if (result.error) {
        return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data, { status: result.status });
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const token = getToken(req);
    const body = await req.json();

    const result = await backendFetch(`/api/task/${id}`, {
        method: "PUT",
        token,
        body: JSON.stringify(body),
    });

    if (result.error) {
        return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data, { status: result.status });
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const token = getToken(req);

    const result = await backendFetch(`/api/task/${id}`, {
        method: "DELETE",
        token,
    });

    if (result.error) {
        return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data, { status: result.status });
}
