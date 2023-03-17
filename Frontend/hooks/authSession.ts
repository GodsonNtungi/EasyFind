import {useEffect, useState} from "react";
import {setBusinessProfile, setCurrentStore} from "../store/authSlice";
import {innerLogin} from "../components/auth/LoginPrompt";
import {AccountProps} from "../components/layouts/AccountLayout";
import supabase from "../lib/supabase";
import {useRouter} from "next/router";
import {useAppDispatch} from "../store/store";

export function useSetAuthSession(props: AccountProps) {
    // console.log(props)
    const router = useRouter()
    const dispatch = useAppDispatch()

    const [loading, setLoading] = useState(false)

    useEffect(() => {

        if (props.store_profile !== null && props.store_profile_id !== null) {
            const toPath = router.asPath === "/account" ? "/account/stock" : router.asPath;
            // use cookies to login if present.
            (async () => {
                    if (props.currentStore && props.store_profile && props.store_profile_id)
                        await innerLogin(
                            supabase,
                            props.currentStore,
                            props.store_profile,
                            router,
                            props.store_profile ? props.store_profile.toString() == "pos" ? "/account/pos" : toPath : "/account",
                            dispatch,
                            props.user?.id ? props.user.id : "",
                            undefined,
                            props.store_profile_id
                        )
                }
            )().then()
                .finally(() => {
                    setLoading(false)
                })
        }

    }, [])

    return loading
}
