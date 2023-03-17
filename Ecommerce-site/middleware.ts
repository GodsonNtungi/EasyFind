// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const { pathname, origin } = request.nextUrl

    const response = NextResponse.next()

    const token = request.cookies.get("supabase-auth-token")

    if (token) {
        // user is logged in
    } else {
        return NextResponse.rewrite(`${origin}/account`)
    }

    return response
}

export const config = {
    matcher: '/account/:path*',
}
