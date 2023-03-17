import {AppProps} from 'next/app';
import {GetServerSidePropsContext, NextPage} from 'next';
import {useState} from 'react';
import {
    MantineProvider,
    ColorSchemeProvider,
    ColorScheme, useMantineTheme
} from '@mantine/core';
import {useHotkeys} from '@mantine/hooks';
import {useColorScheme} from '@mantine/hooks';
import {getCookie, setCookie} from 'cookies-next';
import {NotificationsProvider} from '@mantine/notifications';
import type {ReactElement, ReactNode} from 'react'
import {RouterTransition} from "../components/RouterTransition";
import {ModalsProvider} from '@mantine/modals';
import {Provider} from "react-redux";
import {store} from "../store/store";
import Head from "next/head";
import * as React from "react";
import {rtlCache} from '../utils/rtl-cache';
import {createBrowserSupabaseClient} from "@supabase/auth-helpers-nextjs";
import {useRouter} from "next/router";
import {SessionContextProvider, Session} from "@supabase/auth-helpers-react";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps<{ initialSession: Session }> & {
    Component: NextPageWithLayout,
    colorScheme: ColorScheme
}

function App(props: AppPropsWithLayout & { colorScheme: ColorScheme }) {
    const {Component, pageProps} = props;

    const [supabaseClient] = useState(() => createBrowserSupabaseClient())

    const router = useRouter()

    supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
            // delete cookies on sign out
            const expires = new Date(0).toUTCString()
            document.cookie = `my-access-token=; path=/; expires=${expires}; SameSite=Lax; secure`
            document.cookie = `my-refresh-token=; path=/; expires=${expires}; SameSite=Lax; secure`
            // redirect
            router.push(`/account`).then()
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            const maxAge = 100 * 365 * 24 * 60 * 60 // 100 years, never expires
            document.cookie = `my-access-token=${session?.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`
            document.cookie = `my-refresh-token=${session?.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`
        }
    })

    const preferredColorScheme = useColorScheme();
    const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme == null ? preferredColorScheme : props.colorScheme);
    const toggleColorScheme = (value?: ColorScheme) => {
        const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
        setColorScheme(nextColorScheme);
        // when color scheme is updated save it to cookie
        setCookie('mantine-color-scheme', nextColorScheme, {maxAge: 60 * 60 * 24 * 30});
    };
    useHotkeys([['mod+J', () => toggleColorScheme()]]);

    const getLayout = Component.getLayout ?? ((page) => page)
    const theme = useMantineTheme()
    const dynamicColorList = (dynamicColor: string): [string, string, string, string, string, string, string, string, string] => [...Array(9)].map(x => dynamicColor) as [string, string, string, string, string, string, string, string, string]

    return (
        <div>
            <Head>
                <title>{"ecommerce"}</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
            </Head>
            <Provider store={store}>
                <SessionContextProvider
                    supabaseClient={supabaseClient}
                    initialSession={pageProps?.initialSession}
                >
                    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
                        <MantineProvider theme={{
                            colorScheme,
                            colors: {
                                // primary: dynamicColor?dynamicColorList: theme.colors.orange
                                primary: dynamicColorList("#8080D7"),
                                secondary: dynamicColorList("#023047"),
                                accent: dynamicColorList("#E87810")
                            },
                            primaryColor: "primary"
                        }}
                                         withGlobalStyles
                                         withNormalizeCSS
                                         emotionCache={rtlCache}
                        >
                            <ModalsProvider>
                                <NotificationsProvider>

                                    <RouterTransition/>
                                    {/*// @ts-ignore*/}
                                    {getLayout(<Component {...pageProps} />)}
                                </NotificationsProvider>
                            </ModalsProvider>
                        </MantineProvider>
                    </ColorSchemeProvider>
                </SessionContextProvider>
            </Provider>
        </div>
    );
}


App.getInitialProps = ({ctx}: {
    ctx: GetServerSidePropsContext
}) => ({
    // get color scheme from cookie
    colorScheme: getCookie('tiririka-ecommerce-mantine-color-scheme', ctx) || null,
});

export default App;

