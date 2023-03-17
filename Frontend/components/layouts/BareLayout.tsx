/**
 * Bare Layout => Authentication if it's used by pages in account/*.
 * - For pages needing empty space, no menus or cart
 *
 */

import Head from "next/head";
import {appName} from "../../pages/_app";
import {Box, Group} from "@mantine/core";
import {DoubleHeader} from "../landing/Header";
import useLayoutStyles from "./LayoutStyles";

export function BareLayout(props: { children: any, pageTitle: string }) {

    // helpers.
    const {classes} = useLayoutStyles()

    return (
        <>
            <Head>
                <title>{`${props.pageTitle} | ${appName}`}</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
            </Head>
            <Box className={classes.wrapper}>
                <DoubleHeader mainLinks={[]}/>
                {props.children}
            </Box>
        </>
    )
}

// this comment prevents some weird error I never understood. Remove it to replicate.