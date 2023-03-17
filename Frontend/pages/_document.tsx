import Document, {Html, Head, DocumentContext, Main, NextScript} from 'next/document'
import * as React from 'react';
import {ServerStyles, createStylesServer, createGetInitialProps} from '@mantine/next';
import {rtlCache} from '../lib/cache';
import {appName} from "./_app";

const getInitialProps = createGetInitialProps();
const stylesServer = createStylesServer(rtlCache);

export default class MyDocument extends Document {

    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);

        return {
            ...initialProps,
            styles: [
                initialProps.styles,
                <ServerStyles html={initialProps.html} server={stylesServer} key="styles"/>,
            ],
        };
    }

    render() {
        return (
            <Html lang={"en"}>
                <Head>
                    <meta charSet="utf-8"/>
                    <meta name="theme-color" content="#000000"/>
                    <link rel="manifest" href="/site.webmanifest"/>
                    <link rel="preconnect" href="https://fonts.googleapis.com"/>
                    <link rel="preconnect" href="https://fonts.gstatic.com"/>
                    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
                          rel="stylesheet"/>
                    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
                </Head>
                <body>
                <Main/>
                <NextScript/>
                </body>
            </Html>
        )
    }
}

