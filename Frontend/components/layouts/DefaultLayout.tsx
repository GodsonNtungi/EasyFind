/**
 *
 * Default Layout
 * - mostly used for the website's public pages.
 * - SEO optimized layout.
 *
 */



import Seo, {SeoProps} from "./Seo";
import useLayoutStyles from "./LayoutStyles";
import data from "../../lib/data";
import Head from "next/head";
import {appName} from "../../pages/_app";
import {
    Box
} from "@mantine/core";
import {DoubleHeader} from "../landing/Header";
import {Footer} from "../landing/Footer";
import React from "react";

export default function DefaultLayout(props: { children: any } & SeoProps) {

    const {classes} = useLayoutStyles();
    let {headerLinks, footerLinks} = data

    return (
        <>
            <Head>
                <title>{`${props.title? props.title + " | "  : ""} ${appName} `}</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
                <Seo title={props.title} description={props.description} image={props.image} url={props.url} />
            </Head>
            <Box className={classes.wrapper}>
                <DoubleHeader mainLinks={headerLinks.mainLinks} userLinks={headerLinks.userLinks}/>
                {props.children}
                <Footer data={footerLinks.data}/>
            </Box>
        </>
    )
}
