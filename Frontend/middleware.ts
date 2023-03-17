// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import supabase from "./lib/supabase";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const { pathname, origin } = request.nextUrl

    const response = NextResponse.next()

    const token = request.cookies.get("supabase-auth-token")

    if (token) {
        // user is logged in
        // try {
        //     let json = JSON.parse(token)
        //     let user = await  supabase.auth.getUser(json.access_token)
        //     console.log(user)
        // } catch (e) {
        //     console.log(e)
        // }
    } else {
        return NextResponse.redirect(`${origin}/login`)
    }

    return response
}

export const config = {
    matcher: '/account/:path*',
}
