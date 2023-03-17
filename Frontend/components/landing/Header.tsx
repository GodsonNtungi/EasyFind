import {useState} from 'react';
import {
    createStyles,
    ActionIcon,
    Header,
    Container,
    Anchor,
    Group,
    Text,
    Burger,
    Box,
    Divider,
    NavLink,
    Drawer,
    useMantineColorScheme,
    useMantineTheme, Title, Menu, UnstyledButton, Button, Space
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {Image} from "@mantine/core"
import {
    IconSun,
    IconMoonStars,
    IconMessageCircle,
    IconChevronDown,
    IconShoppingCart,
    IconBasket,
    IconWorld,
    IconBrandWhatsapp,
    IconBrandInstagram, IconBrandFacebook
} from '@tabler/icons';
import Link from 'next/link';
import {useRouter} from "next/router";
import {appName} from "../../pages/_app";


const HEADER_HEIGHT = "";

const useStyles = createStyles((theme) => ({
    outer: {
        position: "sticky",
        top: 0,
        background: "none",
        border: "none"
    },

    burger: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    actionAction: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    links: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: "Poppins",

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
        fontFamily: "Poppins",
    },

    mainLinks: {
        marginRight: -theme.spacing.sm,
    },

    mainLink: {
        textTransform: 'uppercase',
        fontSize: theme.fontSizes.sm,
        fontFamily: "Poppins",
        color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[6],
        padding: `7px ${theme.spacing.sm}px`,
        fontWeight: 700,
        borderBottom: '2px solid transparent',
        transition: 'border-color 100ms ease, color 100ms ease',

        '&:hover': {
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
            textDecoration: 'none',
        },
    },

    secondaryLink: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
        fontSize: theme.fontSizes.xs,
        fontFamily: "Poppins",
        textTransform: 'uppercase',
        transition: 'color 100ms ease',

        '&:hover': {
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
            textDecoration: 'none',
        },
    },

    mainLinkActive: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        borderBottomColor: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 5 : 6],
    },
}));

interface LinkProps {
    label: string;
    link: string;
}

export interface DoubleHeaderProps {
    mainLinks?: LinkProps[];
    userLinks?: LinkProps[];
}

export interface SingleHeaderProps {
    mainLinks?: LinkProps[];
}

export function DoubleHeader({mainLinks, userLinks}: DoubleHeaderProps) {
    const [opened, {toggle}] = useDisclosure(false);
    const {classes, cx} = useStyles();
    const [active, setActive] = useState(undefined);
    const router = useRouter()

    const mainItems = mainLinks?.map((item, index) => {

        return (
            <NavLink
                component={Link}
                variant="subtle"
                href={item.link}
                key={item.label}
                onClick={() => {
                    // @ts-ignore
                    setActive(index);
                    if (opened) toggle();
                }}
                label={item.label}
            />
        )
    });

    const secondaryItems = userLinks?.map((item) => (
        <Anchor
            component={Link}
            href={item.link}
            key={item.label}
            // onClick={(event) => event.preventDefault()}
            className={classes.secondaryLink}
        >
            {item.label}
        </Anchor>
    ));

    const {colorScheme, toggleColorScheme} = useMantineColorScheme();
    const theme = useMantineTheme();

    return (
        <Header height={""} pt={"xl"} sx={theme => ({
            position: "sticky",
            top: 0,
            left: 0,
            border: "none"
        })}>
            <Container size={"lg"} px={"xl"}
                       sx={{width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center"}}>

                <Group sx={{
                    zIndex: 200,
                }} m={"sm"}>
                    <Image sx={{cursor: "pointer"}} onClick={() => {
                        router.push("/").then()
                    }} height={25}
                           src={theme.colorScheme === 'light' ? "/brand/tiririka-long.svg" : "/brand/tiririka-long-white.svg"}
                           alt={appName}/>
                </Group>

                <Group className={classes.actionAction}>

                    {/*    business */}
                    <Menu trigger="hover" shadow="md" width={"auto"}>
                        <Menu.Target>
                            <UnstyledButton
                                sx={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                                <Text size={"lg"} weight={300}>Business</Text>
                                <Space p={3}/>
                                <IconChevronDown size={18}/>
                            </UnstyledButton>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Label>Important features for your business.</Menu.Label>
                            <Menu.Item icon={<IconBasket size={14}/>}>Inventory Management</Menu.Item>
                            <Menu.Item icon={<IconShoppingCart size={14}/>}>Point of sale</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>


                    {/*    Grow */}
                    <Menu trigger="hover" shadow="md" width={"auto"}>
                        <Menu.Target>
                            <UnstyledButton
                                sx={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                                <Text>Grow</Text>
                                <Space p={3}/>
                                <IconChevronDown size={18}/>
                            </UnstyledButton>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Label>Features to grow your business and reach more customers.</Menu.Label>
                            <Menu.Item icon={<IconWorld stroke={.5} size={18}/>}>E-commerce site</Menu.Item>
                            <Menu.Item disabled icon={<IconMessageCircle stroke={.5} size={18}/>}>Multiple payment
                                channels</Menu.Item>
                            <Menu.Item disabled icon={<IconBrandFacebook stroke={.5} size={18}/>}>Facebook
                                Adds</Menu.Item>
                            <Menu.Item disabled icon={<IconBrandInstagram stroke={.5} size={18}/>}>Instagram
                                Adds</Menu.Item>
                            <Menu.Item disabled icon={<IconBrandWhatsapp stroke={.5} size={18}/>}>Whatsapp Business
                                Integration</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>

                    {/*    more */}
                    <Menu trigger="hover" shadow="md" width={200}>
                        <Menu.Target>
                            <UnstyledButton
                                sx={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                                <Text>More</Text>
                                <Space p={3}/>
                                <IconChevronDown size={18}/>
                            </UnstyledButton>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Item component={Link} href={"/"}>Home</Menu.Item>
                            <Menu.Item component={Link} href={"/about-us"}>About US</Menu.Item>
                            <Menu.Item component={Link} href={"/#contact-us"}>Contact Us</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>

                </Group>

                <Group className={classes.actionAction} spacing={"xl"} position="right">
                    {/*{mainItems}*/}

                    <ActionIcon
                        onClick={() => toggleColorScheme()}
                        size="md"
                        // m={"xs"}
                        variant={"subtle"}
                        sx={(theme) => ({
                            backgroundColor:
                                theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                            color: theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.gray[6],
                        })}
                    >
                        {colorScheme === 'dark' ? <IconSun size={18}/> : <IconMoonStars size={18}/>}
                    </ActionIcon>

                    <Group>
                        <UnstyledButton component={Link} href={"/sign_up/"}>
                            <Text>Sign Up</Text>
                        </UnstyledButton>
                        <Divider orientation={"vertical"}/>
                        <Button component={Link} href={"/account/"} color={"accent"} radius={"xl"}>
                            Dashboard
                        </Button>
                    </Group>
                </Group>

                <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm"/>
            </Container>

            <Drawer
                overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
                overlayOpacity={0.55}
                overlayBlur={3}
                title={
                    <Group m={"sm"}>
                        <Image height={theme.fontSizes.xl}
                               src={theme.colorScheme === 'light' ? "/brand/tiririka-long.svg" : "/brand/tiririka-long-white.svg"}
                               alt={appName}/>
                    </Group>
                }
                padding={0}
                size="md"
                transitionDuration={250}
                transitionTimingFunction="ease"
                styles={{
                    header: {
                        padding: "10px"
                    }
                }}
                position="right"
                onClose={toggle}
                opened={opened}>
                <div className={classes.drawerLinks}>

                    <Group position={"apart"}>
                        <Title size={"small"} color={"dimmed"}>Menu</Title>

                        <ActionIcon
                            onClick={() => toggleColorScheme()}
                            size="md"
                            variant={"light"}
                            sx={(theme) => ({
                                backgroundColor:
                                    theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                                color: theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.blue[6],
                            })}
                        >
                            {colorScheme === 'dark' ? <IconSun size={18}/> : <IconMoonStars size={18}/>}
                        </ActionIcon>

                    </Group>
                    <Divider my="sm"/>
                    <Group spacing={"sm"} position="center" style={{
                        display: "flex", flexDirection: "column",

                    }}
                           className={classes.mainLinks}>
                        {mainItems}
                    </Group>
                    <Divider my="sm"/>
                    <Group position="center">
                        {secondaryItems}
                    </Group>
                </div>
            </Drawer>
        </Header>
    );
}


export function SingleHeader({mainLinks}: SingleHeaderProps) {
    const [opened, {toggle}] = useDisclosure(false);
    const {classes, cx} = useStyles();
    const [active, setActive] = useState(0);

    const mainItems = mainLinks?.map((item, index) => {

        return (
            <Anchor
                component={Link}
                scroll
                href={item.link}
                key={item.label}
                className={cx(classes.mainLink, {[classes.mainLinkActive]: index === active})}
                onClick={(event) => {
                    // event.preventDefault();
                    setActive(index);
                    if (opened) toggle();
                }}
            >
                {item.label}
            </Anchor>
        )
    });

    const {colorScheme, toggleColorScheme} = useMantineColorScheme();
    const theme = useMantineTheme();

    return (
        <Header height={HEADER_HEIGHT} mb={50} className={classes.outer}>
            <Container p={"xl"}>
                <Group m={"sm"}>
                    <Image width={theme.fontSizes.xl * 4}
                           src={theme.colorScheme === 'light' ? "/brand/tiririka-long.svg" : "/brand/tiririka-long-white.svg"}
                           alt={appName}/>
                </Group>
                <div className={classes.links}>
                    <Group spacing={0} position="right" className={classes.mainLinks}>
                        {mainItems}
                    </Group>
                </div>
                <ActionIcon
                    className={classes.actionAction}
                    onClick={() => toggleColorScheme()}
                    size="md"
                    variant={"light"}
                    sx={(theme) => ({
                        backgroundColor:
                            theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                        color: theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.blue[6],
                    })}
                >
                    {colorScheme === 'dark' ? <IconSun size={34}/> : <IconMoonStars size={34}/>}
                </ActionIcon>
                <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm"/>
            </Container>

            <Drawer
                overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
                overlayOpacity={0.55}
                overlayBlur={3}
                title=""
                padding="xl"
                size="md"
                // transition="rotate-right"
                transitionDuration={250}
                transitionTimingFunction="ease"

                position="right"
                onClose={toggle}
                opened={opened}>
                <div className={classes.drawerLinks}>

                    <Group position={"apart"}>
                        <ActionIcon
                            component={Link}
                            href={"/#"}
                            color={"dark"}
                            p={20}
                            title="logo"
                        >
                            <Image src={"/android-chrome-192x192.png"} width={34} alt={"logo"}/>
                        </ActionIcon>

                        <ActionIcon
                            onClick={() => toggleColorScheme()}
                            size="md"
                            variant={"light"}
                            sx={(theme) => ({
                                backgroundColor:
                                    theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                                color: theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.blue[6],
                            })}
                        >
                            {colorScheme === 'dark' ? <IconSun size={18}/> : <IconMoonStars size={18}/>}
                        </ActionIcon>

                    </Group>
                    <Divider my="sm"/>
                    <Group spacing={"sm"} position="center" style={{
                        display: "flex", flexDirection: "column",
                    }}
                           className={classes.mainLinks}>
                        {mainItems}
                    </Group>
                </div>
            </Drawer>
        </Header>
    );
}