import {createClient} from "@supabase/supabase-js";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import {getCookie} from "cookies-next";


const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ? process.env.NEXT_PUBLIC_SUPABASE_URL : "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : ""
)

export const getSessionData = async (ctx: any) => {
    const supabase = createServerSupabaseClient(ctx)
    const {
        data: {session},
    } = await supabase.auth.getSession()

    if (!session)
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }

    // set current store if any
    // check whether the account is set up correctly
    const store_id = getCookie('store_id', ctx)
    const store_profile = getCookie('store_profile', ctx) || null
    const store_profile_id = getCookie('store_profile_id', ctx) || null

    let accountNeedsSetUp = false
    let currentStore = null

    const {data: profile, error: profileError} = await supabase.from("profiles")
        .select("*, stores(*)")
        .eq("user_id", session.user?.id)
        .single()

    if (profileError !== null) {
        accountNeedsSetUp = true
    } else {
        currentStore = profile?.stores.filter((x: { is_default: boolean, id: number }) => x.is_default
            || x.id === Number(store_id ? store_id : 0))[0]
    }


    return {
        initialSession: session,
        user: session.user,
        businessProfile: profile,
        currentStore,
        accountNeedsSetUp,
        store_profile,
        store_profile_id,
    }
}

export default supabase

