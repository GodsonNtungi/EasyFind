import Head from 'next/head'
import {
    Center, Container,
} from "@mantine/core";
import React from "react";
import {SingleHeader, TopHeader} from "../web/TopHeader";
import {useWindowScroll} from "@mantine/hooks";
import {useSession, useSupabaseClient} from "@supabase/auth-helpers-react";
import Auth from "../auth/Auth";
import {definitions} from "../../types/database";
import DefaultLayout from "./Default";

export default function AccountLayout({
                                          children,
                                          url,
                                          title,
                                          description,
                                          image,
                                          hideSearchArea,
                                          businessProfile,
                                          categories,
                                      }: { categories?: definitions["categories"][], businessProfile?: definitions['profiles'], url?: string, image?: string, description?: string, title?: string, children: any, hideSearchArea?: boolean }) {
    const [scroll, scrollTo] = useWindowScroll();
    const supabaseClient = useSupabaseClient()
    const session = useSession()

    const AppHead = () => (
        <>
            <Head>
                <title>{`${title} | ${businessProfile?.username}`}</title>
                <meta name={"description"} content={description}/>
                <meta name={"og.title"} content={title}/>
                <meta name={"og.description"} content={description}/>
                <meta name={"og:image"} content={image}/>
                <meta name={"og:image:secure_url"} content={image}/>

                <meta name="og:type" content="website"/>
                <meta name="og:image:type" content="image/jpeg,image/png"/>

                <meta name="og:image:width" content="300"/>
                <meta name="og:image:height" content="300"/>

                <meta name="og:url" content={url}/>

                <link rel="android-chrome-icon" sizes="192x192" href={image ? image : "/android-chrome.png"}/>
                <link rel="android-chrome-icon" sizes="512x512" href={image ? image : "/android-chrome.png"}/>
                <link rel="apple-touch-icon" sizes="180x180" href={image ? image : "/apple-touch-icon.png"}/>
                <link rel="apple-touch-icon" sizes="180x180" href={image ? image : "/apple-touch-icon.png"}/>
                <link rel="icon" type="image/png" sizes="32x32" href={image ? image : "/favicon-32x32.png"}/>
                <link rel="icon" type="image/png" sizes="16x16" href={image ? image : "/favicon-16x16.png"}/>

            </Head>
        </>
    )

    if (!session) {
        return (
            <>
                <AppHead/>
                <SingleHeader businessProfile={businessProfile} mainLinks={[]} hideSearchArea/>
                <Container py={"xl"}>
                    <Center>
                        <Auth supabaseClient={supabaseClient}/>
                    </Center>
                </Container>
            </>
        )
    } else {
        return (
            <DefaultLayout
                businessProfile={businessProfile}
                hideSearchArea={hideSearchArea}
                image={image}
                url={url}
                title={title}
                description={description}
                categories={categories}
            >
                {children}
            </DefaultLayout>
        )
    }
}
