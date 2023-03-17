/**
 * Account Layout.
 * - Business owner's (admin) default layout.
 * - Encapsulates most authenticated pages.
 * - Features
 *      - Shows current store
 *      - Shows current profile and option to change it.
 *      - Full pages' menu.
 *
 */

import React, {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import {useAppDispatch, useAppSelector} from "../../store/store";
import {
    ActionIcon,
    AppShell,
    Box, Burger,
    Group, Header, Image, Indicator,
    MediaQuery,
    Navbar, Stack, Title,
    useMantineColorScheme,
    useMantineTheme
} from "@mantine/core";
import {setCartOpened} from "../../store/authSlice";
import Head from "next/head";
import {appName} from "../../pages/_app";
import Link from "next/link";
import {
    IconLogout,
    IconMoonStars,
    IconShoppingCart,
    IconShoppingCartOff,
    IconSun
} from "@tabler/icons";
import StoreBadge from "../dashboard/StoreBadge";
import useLayoutStyles from "./LayoutStyles";
import {mock_data, NavbarLink} from "./Shared";
import {User, useSupabaseClient} from "@supabase/auth-helpers-react";
import {definitions} from "../../types/database";

export interface AccountProps {
    user?: User;
    businessProfile?: definitions['profiles'];
    currentStore?: definitions['stores'];
    accountNeedsSetUp?: boolean;
    store_profile?: string | null;
    store_profile_id?: number | null;
}

export function AccountLayout(props: { children: any } & AccountProps) {

    // helpers
    const router = useRouter()
    const dispatch = useAppDispatch()
    const theme = useMantineTheme();
    const supabase = useSupabaseClient()

    // styles
    const {classes} = useLayoutStyles()

    // active page and menu item state
    const [activePage, setActivePage] = useState(0);

    // colorscheme state
    const {colorScheme, toggleColorScheme} = useMantineColorScheme();

    // side menu opened state
    const [opened, setOpened] = useState(false);

    // links component.
    // Creates and returns a list of navbar links.
    const links = mock_data.map((link, index) => (
        <NavbarLink
            icon={link.icon}
            label={link.label}
            key={link.label}
            active={index === activePage}
            onClick={() => {
                setActivePage(index)
                router.push(link.link).then()
                setPageTitle(link.label)
            }}
        />
    ));

    // get cart state
    const cartState = useAppSelector(state => state.auth.cartState)

    // get cart opened state
    const cartOpened = useAppSelector(s => s.auth.layout?.cartOpened)

    const businessProfile = useAppSelector(s => s.auth.businessProfile)

    // get page title state.
    const [pageTitle, setPageTitle] = useState("stock")

    useEffect(() => {
        // determines the active page menu on router changes.
        const ind = mock_data.findIndex(x => x.link === router.asPath)
        if (ind >= 0) {
            setActivePage(ind)
            setPageTitle(mock_data[ind].label)
        }
    }, [router])

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
                    navbar={<Navbar width={{base: opened ? 60 : undefined, sm: 60, lg: 60}} p={'xs'}
                                    hiddenBreakpoint="sm"
                                    hidden={!opened}>
                        <Navbar.Section grow>
                            <Group position={'center'}>
                                <MediaQuery largerThan="sm" styles={{display: 'none'}}>
                                    <ActionIcon
                                        component={Link}
                                        href={"/account"}
                                        color={"dark"}
                                        // p={15}
                                        title="logo"
                                    >
                                        <Image
                                            src={theme.colorScheme === 'light' ? "/brand/tiririka.svg" : "/brand/tiririka-white.svg"}
                                            width={30} alt={"logo"}/>
                                    </ActionIcon>
                                </MediaQuery>
                                <ActionIcon
                                    onClick={() => toggleColorScheme()}
                                    size="lg"
                                    variant={"light"}
                                    sx={(theme) => ({
                                        backgroundColor:
                                            theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                                        color: theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.gray[6],
                                    })}
                                >
                                    {colorScheme === 'dark' ? <IconSun size={18}/> : <IconMoonStars size={18}/>}
                                </ActionIcon>
                                <Stack justify="center" spacing={2}>
                                    {links}
                                </Stack>
                            </Group>
                        </Navbar.Section>
                        <Navbar.Section>
                            <Stack justify="center" spacing={0}>
                                <NavbarLink icon={IconLogout} label="Logout" onClick={() => {
                                    supabase.auth.signOut().then()
                                    // router.push('/').then()
                                }}/>
                            </Stack>
                        </Navbar.Section>
                    </Navbar>}
                    header={
                        <Header fixed={true} height={50} p="md" zIndex={100}>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                height: '100%',
                                zIndex: 100
                            }}>
                                <Group position={"left"}>
                                    <MediaQuery largerThan="sm" styles={{display: 'none'}}>
                                        <Burger
                                            opened={opened}
                                            onClick={() => setOpened((o) => !o)}
                                            size="xs"
                                            color={theme.colors.gray[6]}
                                        />
                                    </MediaQuery>
                                    <MediaQuery smallerThan="sm" styles={{display: 'none'}}>

                                        <ActionIcon
                                            component={Link}
                                            href={"/account"}
                                            color={"dark"}
                                            p={15}
                                            title="logo"
                                        >
                                            <Image
                                                src={theme.colorScheme === 'light' ? "/brand/tiririka.svg" : "/brand/tiririka-white.svg"}
                                                width={30} alt={"logo"}/>
                                        </ActionIcon>
                                    </MediaQuery>
                                    <Title order={1} sx={{fontFamily: "Poppins"}} transform={"capitalize"}
                                           color={"dimmed"} size={"h4"}
                                           weight={500}>{pageTitle}</Title>
                                </Group>
                                <StoreBadge businessProfile={businessProfile}/>
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
                    {props.children}
                </AppShell>
            </Box>
        </>
    )

}