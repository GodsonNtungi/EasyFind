import React, {useState} from 'react';
import {useForm} from "@mantine/form";
import {Button, Box, PasswordInput, Group, Center, Loader} from "@mantine/core";
import {IconLock} from "@tabler/icons";
import {NextRouter, useRouter} from "next/router";
import {closeAllModals} from "@mantine/modals";
import {AppDispatch, useAppDispatch, useAppSelector} from "../../store/store";
import {setBusinessProfile, setCurrentProfile, setCurrentStore} from "../../store/authSlice";
import {useSession, useSupabaseClient} from "@supabase/auth-helpers-react";
import {definitions} from "../../types/database";
import {SupabaseClient} from "@supabase/supabase-js";
import {showNotification} from "@mantine/notifications";
import {getCookie, setCookie} from "cookies-next";

// Function to log in using PIN or admin Password
export async function innerLogin(
    supabase: SupabaseClient,
    currentStore: definitions['stores'],
    profile: string | null,
    router: NextRouter,
    path: string,
    dispatch: AppDispatch,
    user_id: string,
    pin?: number,
    id?: number,
    callback?: Function
) {

    const filterString = () => {
        if (pin !== undefined) {
            return `pin.eq.${pin}`
        }
        if (id !== undefined) {
            return `id.eq.${id}`
        }
    }

    const login = async () => {

        switch (profile) {

            case "pos" : {
                let {data: employee, error} = await supabase
                    .from('employees')
                    .select("*")

                    // Filters
                    .eq('store_id', currentStore?.id)
                    .or(`${filterString()}`)
                    .single()

                // console.log(employees, error)
                if (error) {
                    showNotification({
                        title: "Auth Notification",
                        message: "PIN is wrong. Please try again"
                    })
                    break
                }

                if (employee) {
                    // set employee as the profile.
                    dispatch(setCurrentProfile({
                        employee: employee,
                        owner: undefined
                    }))
                    setCookie('store_profile', "pos", {maxAge: 60 * 60 * 24 * 30});
                    setCookie('store_profile_id', employee.id, {maxAge: 60 * 60 * 24 * 30});
                    router.push(path)
                        .then()
                        .finally(() => {
                            if (callback) callback()
                        })
                    break
                }

                break
            }

            case "stock": {
                let {data: profile, error} = await supabase
                    .from('profiles')
                    .select("*, stores(*)")

                    // Filters
                    .eq('user_id', user_id)
                    .or(`${filterString()}`)
                    .single()

                if (error) {
                    showNotification({
                        title: "Auth Notification",
                        message: "PIN is wrong. Please try again"
                    })
                    if (callback) callback()
                    break
                }

                if (profile) {
                    // get stored store_id from cookies
                    // set current store state to the profile store with the store_id from cookies
                    const store_id = getCookie("store_id") ?? null

                    let storeFilter = (id?: any) => {
                        if (id !== null) {
                            return profile?.stores.filter((x: { id: number; }) => x.id === Number(id))[0]
                        }
                        return profile?.stores.filter((x: { is_default: boolean }) => x.is_default)[0]
                    }

                    const store = storeFilter(store_id?store_id: null)

                    // set the current store with profile data from API
                    // get the store from profile data
                    if (store !== undefined && store !== null)
                        // set current store state
                        dispatch(setCurrentStore(store))

                    // set business profile
                    dispatch(setBusinessProfile(profile))

                    // set user as the profile.
                    dispatch(setCurrentProfile({
                        employee: undefined,
                        owner: profile
                    }))
                    setCookie('store_profile', "stock", {maxAge: 60 * 60 * 24 * 30});
                    setCookie('store_profile_id', profile.id, {maxAge: 60 * 60 * 24 * 30});
                    router.push(path)
                        .then()
                        .finally(() => {
                            if (callback) callback()
                        })
                    break
                }

                if (callback) callback()
                break
            }

            default: {
                if (callback) callback()
            }
        }

    }

    login().then()
}


function LoginPrompt({path, profile}: { path: string, profile: string }) {
    const [error, setError] = useState("")
    const session = useSession()
    const dispatch = useAppDispatch()
    const supabase = useSupabaseClient()
    const [usePassword, setUsePassword] = useState(false)

    const router = useRouter()
    const currentStore = useAppSelector(s => s.auth.currentStore)

    // loading state for password login
    const [loading, setLoading] = useState(false)

    // loading state for PIN login
    const [pinLoading, setPinLoading] = useState(false)

    // password form
    const pForm = useForm({
        initialValues: {
            password: '',
        },
    })

    if (pinLoading)
        return (
            <Center p={"xl"}>
                <Loader/>
            </Center>
        )


    if (usePassword && profile.toLowerCase() === "stock") {
        return (
            <>
                <Box style={{
                    display: "flex",
                    width: "100%",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "inherit"
                }}>
                    <form style={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }} onSubmit={pForm.onSubmit((values) => {
                        setLoading(true)
                        console.log(session?.user.email)
                        supabase.auth.signInWithPassword({
                            email: session?.user.email ? session?.user.email : "",
                            password: values.password
                        })
                            .then(({data, error}) => {
                                if (error !== null) {
                                    // set error state
                                    setError(error.message)
                                }
                                if (data.user != null) {
                                    // look for profile
                                    supabase
                                        .from('profiles')
                                        .select("*")

                                        // Filters
                                        .eq('user_id', session?.user.id)
                                        .single()
                                        .then(({data: prof, error: profErr}) => {
                                            console.log(profErr, prof)
                                            if (prof) {
                                                dispatch(setCurrentProfile({
                                                    employee: undefined,
                                                    owner: prof
                                                }))
                                                setCookie('store_profile', "stock", {maxAge: 60 * 60 * 24 * 30});
                                                setCookie('store_profile_id', prof.id, {maxAge: 60 * 60 * 24 * 30});
                                                router.push(path).then()
                                                closeAllModals()
                                            }

                                            if (profErr) {
                                                showNotification({
                                                    title: "Auth Notification",
                                                    message: profErr.message
                                                })
                                            }
                                        })
                                }
                                setLoading(false)
                            })
                    })}>
                        <PasswordInput
                            placeholder="account password"
                            error={error}
                            icon={<IconLock size={16}/>}
                            variant={"filled"}
                            {...pForm.getInputProps('password')}
                            withAsterisk
                            size={"xl"}
                            style={{
                                width: "100%"
                            }}
                        />
                        <Group position="right" mt="md">
                            <Button loading={loading} type="submit">login</Button>
                        </Group>

                        <Button my={"md"} size={"sm"} variant={"subtle"} type={"button"} onClick={() => {
                            setUsePassword(false)
                        }}>use PIN</Button>
                    </form>
                </Box>
            </>
        )
    } else {
        return (
            <>
                <Box style={{
                    display: "flex",
                    width: "100%",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "inherit"
                }}>
                    <PasswordInput
                        onKeyUp={(v) => {
                            setError("")
                            const pin = v.currentTarget.value
                            let npin: number;
                            npin = Number(pin)
                            if (pin.length == 4) {
                                setPinLoading(true)
                                if (!isNaN(npin)) {
                                    innerLogin(
                                        supabase,
                                        currentStore,
                                        profile,
                                        router,
                                        path,
                                        dispatch,
                                        session?.user.id ? session?.user.id : "",
                                        npin,
                                        undefined,
                                        () => {
                                            setPinLoading(false)
                                            closeAllModals()
                                        }
                                    ).then()
                                        .finally()
                                } else {
                                    setError("Pin contains numbers only.")
                                }
                            }
                        }}
                        placeholder="0000"
                        error={error}
                        icon={<IconLock size={16}/>}
                        variant={"filled"}
                        withAsterisk
                        size={"xl"}
                        maxLength={4}
                        style={{
                            width: "100%"
                        }}
                    />
                    {profile.toLowerCase() === "stock" ?
                        <>
                            <Button my={"md"} size={"sm"} variant={"subtle"} type={"button"} onClick={() => {
                                setUsePassword(true)
                            }
                            }>forgot PIN</Button>
                        </>
                        :
                        <></>
                    }
                </Box>
            </>
        );
    }
}

export default LoginPrompt;