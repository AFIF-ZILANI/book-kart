import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    // const path = request.nextUrl.pathname;

    // // Define public paths that don't require authentication
    // const isPublicPath = path === "/books/*" || path === "/";

    // // Get the session using auth()
    // const session = await auth();

    // // Redirect logic for public paths
    // // if (isPublicPath && session) {
    // //     return NextResponse.redirect(new URL('/dashboard', request.url))
    // // }

    // // Redirect logic for protected paths
    // if (!isPublicPath && !session) {
    //     return NextResponse.redirect(new URL("/api/auth/callback/google", request.url));
    // }

    return NextResponse.next();
}

// Configure which routes to protect
export const config = {
    matcher: [
        "/",
        "/profile",
        "/history",
        "/add-book",
        "/profile",
        "/cart",
        "/checkout",
        "/orders",
    ],
};
