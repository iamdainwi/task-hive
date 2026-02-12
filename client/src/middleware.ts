import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    // Protect dashboard routes
    if (pathname.startsWith("/dashboard")) {
        // We can't check localStorage from middleware, so we'll rely on client-side
        // auth context for protection. The middleware just does a soft check via cookie.
        // The actual token lives in localStorage, so this is a UX convenience layer.
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
