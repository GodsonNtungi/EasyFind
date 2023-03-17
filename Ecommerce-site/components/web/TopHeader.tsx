import React, {useEffect, useState} from 'react';
import {
    createStyles,
    ActionIcon,
    Header,
    Text,
    Box,
    HoverCard, Avatar,
    Button,
    Menu,
    Anchor,
    Paper,
    Group,
    Burger,
    Switch,
    Divider,
    Indicator,
    Accordion,
    Drawer,
    useMantineColorScheme,
    useMantineTheme, TextInput, SimpleGrid, Title, Container, ScrollArea
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {Image} from "@mantine/core"
import {
    IconSun,
    IconMoonStars,
    IconShoppingCart,
    IconSearch,
    IconNotification,
    IconBellRinging,
    IconBellRinging2,
    IconLineHeight,
    IconHeart,
    IconArrowRight,
    IconChevronDown,
    IconLogout,
    IconArrowUpRight,
    IconPhoneCall,
    IconCaretDown, IconUser, IconBasket
} from '@tabler/icons';
import {NextLink} from '@mantine/next';
import {useRouter} from "next/router";
import {useAppDispatch, useAppSelector} from "../../store/store";
import {useSession, useSupabaseClient} from "@supabase/auth-helpers-react";
import Cart from "./Cart";
import {setCartOpened} from "../../store/cartSlice";
import {definitions} from "../../types/database";
import Footer from "./Footer";


const HEADER_HEIGHT = "";

const useStyles = createStyles((theme) => ({
    outer: {
        position: "sticky",
        top: 0,
    },
    outer1: {
        position: "sticky",
        top: 0,
    },
    outer2: {
        position: "sticky",
        top: 0,
    },
    inner: {
        height: HEADER_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    primary: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    actionAction: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },


    burger: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    logo: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    links: {
        paddingTop: theme.spacing.lg,
        height: HEADER_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',

        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },
    drawerLinks: {
        padding: theme.spacing.md,
        height: HEADER_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },

    mainLinks: {
        marginRight: -theme.spacing.sm,
    },

    mainLink: {
        textTransform: 'uppercase',
        fontSize: theme.fontSizes.xs, fontFamily: "Poppins",
        // color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[6],
        color: theme.colors.gray[0],
        // padding: `7px ${theme.spacing.sm}px`,
        fontWeight: 700,
        borderBottom: '2px solid transparent',
        transition: 'border-color 100ms ease, color 100ms ease',

        '&:hover': {
            color: theme.colors.gray[4],
            textDecoration: 'none',
        },
    },

    primaryLink: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
        fontSize: theme.fontSizes.xs,
        textTransform: 'uppercase',
        transition: 'color 100ms ease',

        '&:hover': {
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
            textDecoration: 'none',
        },
    },

    mainLinkActive: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.white,
        background: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 5 : 6],
    },
}));

interface LinkProps {
    label: string;
    link: string;
}

export interface DoubleHeaderProps {
    mainLinks: LinkProps[];
    businessProfile: definitions['profiles'];
    hideSearchArea?: boolean
}

export interface SingleHeaderProps {
    mainLinks?: LinkProps[];
    businessProfile: definitions['profiles'];
    hideSearchArea?: boolean
}

export function TopHeader({businessProfile, mainLinks, hideSearchArea}: DoubleHeaderProps) {
    const [opened, {toggle}] = useDisclosure(false);
    const {classes, cx} = useStyles();
    const router = useRouter()
    const session = useSession()
    const supabase = useSupabaseClient()
    const dispatch = useAppDispatch()

    const cartState = useAppSelector(s => s.cart.cartState)
    const cartOpened = useAppSelector(state => state.cart.layout.cartOpened)

    const mainItems = mainLinks.map((item, index) => {
        return (
            <Anchor
                component={NextLink}
                className={classes.mainLink}
                p={"sm"}
                href={item.link}
                key={item.label}
                onClick={(event) => {
                    if (opened) toggle();
                }}
            >
                {item.label}
            </Anchor>
        )
    });

    const UserBadge = () => {
        return (
            <>
                <Menu shadow="md" width={200} styles={{
                    dropdown: {
                        zIndex: 1
                    }
                }}>
                    <Menu.Target>
                        <Avatar radius={"xl"} src={""}>
                            <IconUser/>
                        </Avatar>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item>
                            {session?.user?.email}
                        </Menu.Item>
                        <Menu.Item component={'button'} onClick={() => {
                            supabase.auth.signOut().then()
                        }} icon={<IconLogout size={14}/>}>Logout
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>

            </>
        )
    }

    const {colorScheme, toggleColorScheme} = useMantineColorScheme();
    const theme = useMantineTheme();

    return (
        <>
            <Header bg={"primary"} height={""} className={classes.outer1}>
                <Box px={"sm"} className={classes.inner}>
                    <ActionIcon
                        onClick={() => toggleColorScheme()}
                        size="md"
                        my={"xs"}
                        variant={"light"}
                        sx={(theme) => ({
                            backgroundColor:
                                theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                            color: theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.blue[6],
                        })}
                    >
                        {colorScheme === 'dark' ? <IconSun size={18}/> : <IconMoonStars size={18}/>}
                    </ActionIcon>
                    {cartState.length > 0 ?
                        <Group className={classes.burger} p={"sm"}>
                            <Button radius={"md"} onClick={() => {
                                router.push("/shop/checkout").then();
                            }} fullWidth disabled={cartState.length === 0} size={"sm"} color={"accent"}
                                    variant={"filled"}>
                                <Text sx={{fontFamily: "Poppins"}} weight={700}
                                      transform={"uppercase"}> Checkout ({cartState.length}) </Text>
                            </Button>
                        </Group> : <></>
                    }
                    <Group>
                        <ActionIcon
                            py={5}
                            title={businessProfile?.username}
                            color={"green.9"}
                            variant={"filled"} radius={"md"}
                        >
                            <IconPhoneCall color={"white"} size={16}/>
                        </ActionIcon>
                        <Text size={"sm"} className={classes.logo} transform={"uppercase"} color={"gray.0"}
                              sx={{fontFamily: "Poppins"}}
                              weight={700}>Call us: 0765142714</Text>
                    </Group>

                    <Group className={classes.mainLink} sx={theme => ({
                        [theme.fn.smallerThan('sm')]: {
                            display: 'none'
                        }
                    })}>
                        {mainItems}
                    </Group>
                </Box>
            </Header>

            <Header height={""} className={classes.outer2}>

                <Group className={classes.inner} px={"sm"}>
                    <Group>
                        <Burger opened={opened} className={classes.burger} onClick={toggle} size="sm"/>
                        <ActionIcon
                            component={NextLink}
                            className={classes.logo}
                            href={"/"}
                            color={"primary"}
                            title={businessProfile?.username}
                        >
                            <Avatar src={businessProfile?.avatar_url} alt={"logo"}>
                                <IconBasket color={"primary"} size={14}/>
                            </Avatar>
                        </ActionIcon>
                    </Group>

                    <Group>
                        <Anchor
                            transform={"uppercase"}
                            component={NextLink}
                            p={"sm"}
                            href={"/"}
                            // className={cx(classes.mainLink, {[classes.mainLinkActive]: index === active})}
                            onClick={(event) => {
                                // event.preventDefault();
                                // setActive(index);
                                if (opened) toggle();
                            }}
                        >
                            <Text sx={{fontFamily: "Poppins"}} transform={"uppercase"} weight={600}>
                                Home
                            </Text>
                        </Anchor>
                        {/*<Anchor*/}
                        {/*    transform={"uppercase"}*/}
                        {/*    component={NextLink}*/}
                        {/*    p={"sm"}*/}
                        {/*    href={"/"}*/}
                        {/*    // className={cx(classes.mainLink, {[classes.mainLinkActive]: index === active})}*/}
                        {/*    onClick={(event) => {*/}
                        {/*        // event.preventDefault();*/}
                        {/*        // setActive(index);*/}
                        {/*        if (opened) toggle();*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    <Text sx={{fontFamily: "Poppins"}} transform={"uppercase"} weight={600}>*/}
                        {/*        shop*/}
                        {/*    </Text>*/}
                        {/*</Anchor>*/}
                    </Group>

                    <Group>
                        {cartState.length > 0 ?
                            <Group className={classes.logo} p={"sm"}>
                                <Button radius={"md"} onClick={() => {
                                    router.push("/shop/checkout").then();
                                }} fullWidth disabled={cartState.length === 0} size={"sm"} color={"accent"}
                                        variant={"filled"}>
                                    <Text sx={{fontFamily: "Poppins"}} weight={700}
                                          transform={"uppercase"}> Checkout ({cartState.length}) </Text>
                                </Button>
                            </Group> : <></>
                        }
                        <Group sx={theme => ({})}>
                            <Indicator overflowCount={999}
                                       dot={false}
                                       showZero={false}
                                       inline
                                       size={18}>
                                <ActionIcon size="md" variant="light">
                                    <IconHeart
                                        onClick={() => {
                                            // ...
                                        }}
                                    />
                                </ActionIcon>
                            </Indicator>

                            <Indicator overflowCount={999}
                                       label={cartState?.length}
                                       inline
                                       showZero={true}
                                       color={"accent"}
                                       size={18}
                            >
                                <ActionIcon size="md" color={"primary"}>
                                    <IconShoppingCart
                                        onClick={() => {
                                            // ...
                                            dispatch(setCartOpened(true))
                                            console.log(cartOpened)
                                        }}
                                    />
                                </ActionIcon>
                            </Indicator>

                            {session ? <UserBadge/> : <></>}

                        </Group>
                    </Group>
                </Group>
            </Header>

            {/*sidebar drawer */}
            <Drawer
                overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
                overlayOpacity={0.55}
                overlayBlur={3}
                styles={theme => ({
                    header: {
                        padding: "10px",
                    },
                    closeButton: {
                        padding: "0px",
                        fontSize: "32px"
                    }
                })}
                title={<Title order={1} size={"small"} transform={"uppercase"} color={"dimmed"}
                              sx={{fontFamily: "Poppins"}}>{businessProfile?.username}</Title>}
                padding={0}
                size="md"
                transitionDuration={250}
                transitionTimingFunction="ease"
                position="left"
                onClose={toggle}
                opened={opened}>
                <Box component={ScrollArea.Autosize} maxHeight={"90vh"}>
                    <Group p={"xl"} position={"center"}>
                        <Avatar src={businessProfile?.avatar_url} size={120} alt={"logo"}>
                            <IconBasket color={"accent"} size={32}/>
                        </Avatar>
                    </Group>
                    <Box p={"sm"} bg={"primary"} style={{
                        display: "flex", flexDirection: "column",
                    }}>
                        {mainItems}
                        <Footer businessProfile={businessProfile} />
                    </Box>
                </Box>
            </Drawer>


            {/*cart drawer*/}

            <Drawer
                overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
                overlayOpacity={0.55}
                overlayBlur={3}
                styles={theme => ({
                    header: {
                        padding: "10px",
                        background: theme.colors.primary
                    },
                    closeButton: {
                        padding: "0px",
                        fontSize: "32px"
                    }
                })}
                title={<Title order={1} size={"small"} transform={"uppercase"} color={"dimmed"}
                              sx={{fontFamily: "Poppins"}}>{businessProfile?.username}</Title>}
                padding={0}
                size="lg"
                transitionDuration={250}
                transitionTimingFunction="ease-in"
                position="right"
                onClose={() => dispatch(setCartOpened(false))}
                opened={cartOpened}>
                <Box style={{
                    display: "flex", flexDirection: "column",
                }}>
                    <Cart/>
                </Box>
            </Drawer>
        </>
    );
}


export function SingleHeader({mainLinks, hideSearchArea, businessProfile}: SingleHeaderProps) {
    return <TopHeader mainLinks={mainLinks ? mainLinks : []} businessProfile={businessProfile} hideSearchArea/>
}
