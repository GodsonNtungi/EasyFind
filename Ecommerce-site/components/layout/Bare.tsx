import {useSession, useSupabaseClient} from "@supabase/auth-helpers-react";
import Head from 'next/head'
import {
    createStyles,
    Box,
    Group,
} from "@mantine/core";
import Auth from "../auth/Auth";
import {SingleHeader} from "../web/TopHeader";
import {definitions} from "../../types/database";
import Footer from "../web/Footer";
import React from "react";


const useStyles = createStyles((theme) => ({
    wrapper: {
        minHeight: "100vh",
        width: "100%"
    },
    main: {
        minHeight: "300px",
    },
    link: {
        width: 40,
        height: 40,
        borderRadius: theme.radius.sm,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
        },
    },
    active: {
        '&, &:hover': {
            // boxShadow: ".1px .1px 3px .1px ",
            backgroundColor: theme.fn.variant({variant: 'light', color: theme.primaryColor}).background,
            color: theme.fn.variant({variant: 'light', color: theme.primaryColor}).color,
        },
    },
}));

export default function BareLayout({children, pageTitle, description, loginRequired,
                                       businessProfile,
                                   }: { businessProfile?: definitions['profiles'], loginRequired?: boolean,  description: string, children: any, pageTitle: string }) {

    const session = useSession()
    const {classes} = useStyles()
    const supabase = useSupabaseClient()

    if (!session && (loginRequired !== false))
        return (
            <>
                <Head>
                    <title>{`${pageTitle} | ${businessProfile?.username}`}</title>
                    <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
                    <meta name="description" content={description?description:""}/>
                </Head>
                <Box className={classes.wrapper}>
                    <SingleHeader businessProfile={businessProfile} mainLinks={[]}/>
                    <Group position="center">
                            <Auth
                                supabaseClient={supabase}
                            />
                    </Group>
                    <Footer businessProfile={businessProfile}/>
                </Box>
            </>

        )

    else {
        return (
            <>
                <Head>
                    <title>{`${pageTitle} | ${businessProfile?.username}`}</title>
                    <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
                    <meta name="description" content={description?description:""}/>
                </Head>
                <Box className={classes.wrapper}>
                    <SingleHeader businessProfile={businessProfile} mainLinks={[]}/>
                    {children}
                    <Footer businessProfile={businessProfile}/>
                </Box>
            </>
        )
    }


}
