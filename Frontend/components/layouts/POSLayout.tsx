import React, {useEffect, useState} from 'react';
import {useSession, useSupabaseClient} from "@supabase/auth-helpers-react";
import {useRouter} from "next/router";
import {
    ActionIcon,
    AppShell,
    Box, Burger, createStyles,
    Group, Header, Image, Indicator,
    MediaQuery,
    Title,
    useMantineTheme
} from "@mantine/core";
import {useAppDispatch, useAppSelector} from "../../store/store";
import Head from "next/head";
import {appName} from "../../pages/_app";
import Link from "next/link";
import {IconShoppingCart, IconShoppingCartOff} from "@tabler/icons";
import StoreBadge from "../dashboard/StoreBadge";
import {setCartOpened, setCurrentStore} from "../../store/authSlice";
import {definitions} from "../../types/database";
import {getCookie} from "cookies-next";
import {useGetAllUserStoresQuery, useGetUserProfileQuery} from "../../services/store";
import {innerLogin} from "../auth/LoginPrompt";


const useStyles = createStyles((theme) => ({
    wrapper: {
        minHeight: "100vh",
    },
    main: {
        minHeight: "300px",
    },
}))


function POSLayout({children}: { children: any }) {
    const session = useSession()
    const {classes} = useStyles()
    const supabase = useSupabaseClient()
    const router = useRouter()
    const theme = useMantineTheme();
    const dispatch = useAppDispatch()

    const cartState = useAppSelector(state => state.auth.cartState)
    const cartOpened = useAppSelector(s => s.auth.layout?.cartOpened)
    const currentProfile = useAppSelector(s => s.auth.profile)
    const currentStore = useAppSelector(s => s.auth.currentStore)
    const store_profile = getCookie('store_profile')
    const store_profile_id = getCookie('store_profile_id')

    const {profile} = useGetUserProfileQuery({user_id: session?.user.id}, {
        selectFromResult: ({data, isFetching, error}) => {
            // console.log(data)
            return ({
                profile: data ? data[0] : {} as definitions["profiles"],
                error: error,
                isFetching: isFetching
            })
        }
    })

    const {store} = useGetAllUserStoresQuery({profile_id: profile?.id}, {
        selectFromResult: ({data, isFetching, error}) => {
            // console.log(data)
            return ({
                store: data ? data.filter(x => x.is_default)[0] : {} as definitions["stores"],
                error: error,
                isFetching: isFetching
            })
        }
    })

    useEffect(() => {
        if (store === {} as definitions["stores"]) {
            // pass
        } else if (store?.id !== undefined) {
            if (currentStore.id === undefined) {
                dispatch(setCurrentStore(store))
            }
        }
    }, [store])

    useEffect(() => {

        if (!currentProfile.owner && !currentProfile.employee) {

            if (!store_profile && !store_profile_id) {
                // no profile found
                console.log("No profile found ...")
                router.replace("/account").then();
            } else {
                if ((session === null) || (currentStore === null)) {
                    // no session and currentStore
                } else {
                    innerLogin(
                        supabase,
                        currentStore,
                        store_profile ? store_profile.toString() : null,
                        router,
                        store_profile ? store_profile.toString() == "pos" ? "/account/pos" : "/account/stock" : "/account",
                        dispatch,
                        session?.user.id ? session?.user.id : "",
                        undefined,
                        store_profile_id ? Number(store_profile_id.toString()) : undefined
                    ).then()
                }
            }
        }

    }, [session, currentStore])

    const [pageTitle, setPageTitle] = useState("POS")


    return (
        <>
            <Head>
                <title>{`${pageTitle} | ${appName}`} </title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
            </Head>
            <Box className={classes.wrapper}>
                <AppShell
                    navbarOffsetBreakpoint="sm"
                    asideOffsetBreakpoint="sm"
                    padding={0}
                    navbar={<></>}
                    header={
                        <Header fixed={true} height={50} p="md" zIndex={100}>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                height: '100%',
                                zIndex: 100
                            }}>
                                <Group position={"apart"}>
                                    {/*<MediaQuery largerThan="sm" styles={{display: 'none'}}>*/}
                                    {/*    <Burger*/}
                                    {/*        opened={opened}*/}
                                    {/*        onClick={() => setOpened((o) => !o)}*/}
                                    {/*        size="sm"*/}
                                    {/*        color={theme.colors.gray[6]}*/}
                                    {/*        mr="xl"*/}
                                    {/*    />*/}
                                    {/*</MediaQuery>*/}
                                    <MediaQuery smallerThan="sm" styles={{display: 'none'}}>

                                        <ActionIcon
                                            component={Link}
                                            href={"/account"}
                                            color={"dark"}
                                            p={15}
                                            title="logo"
                                        >
                                            <Image src={theme.colorScheme === 'light'?"/brand/tiririka.svg":"/brand/tiririka-white.svg"} width={30} alt={"logo"}/>
                                        </ActionIcon>
                                    </MediaQuery>
                                    <Title order={1} sx={{fontFamily: "Poppins"}} transform={"capitalize"}
                                           opacity={.6}
                                           color={"dimmed"} size={"h4"}
                                           weight={500}>{pageTitle}</Title>
                                </Group>
                                <StoreBadge />
                                <MediaQuery largerThan="sm" styles={{display: 'none'}}>
                                    <Indicator label={cartState?.length} showZero={false} dot={false}
                                               overflowCount={999}
                                               inline
                                               size={15}>

                                        <ActionIcon size="md" variant="light">

                                            {
                                                !cartOpened ?
                                                    <IconShoppingCart
                                                        onClick={() => {
                                                            dispatch(setCartOpened(!cartOpened));
                                                        }}
                                                    />
                                                    :
                                                    <IconShoppingCartOff
                                                        onClick={() => dispatch(setCartOpened(!cartOpened))}
                                                    />
                                            }
                                        </ActionIcon>
                                    </Indicator>
                                </MediaQuery>
                            </div>

                        </Header>
                    }
                    styles={(theme) => ({
                        main: {
                            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                        },
                    })}
                >
                    {children}
                </AppShell>
            </Box>
        </>
    )
}

export default POSLayout;