import React from 'react';
import {appName} from "../../pages/_app";

export interface SeoProps {
    title: string;
    description: string;
    image?: string;
    url?: string;
}


export default function Seo(props: SeoProps) {
    return (
        <>
            <meta name={"description"} content={props.description}/>
            <meta name={"og.title"} content={props.title}/>
            <meta name={"og.description"} content={props.description}/>
            <meta name={"og:image"} content={props.image?props.image:""}/>
            <meta name={"og:image:secure_url"} content={props.image?props.image:""}/>
            <meta name="og:type" content="website"/>
            <meta name="og:image:type" content="image/jpeg,image/png"/>
            <meta name="og:image:width" content="300"/>
            <meta name="og:image:height" content="300"/>
            <meta name="og:url" content={props.url? props.url:""}/>
            <link rel="android-chrome-icon" sizes="192x192" href={props.image ? props.image : "/android-chrome-192x192.png"}/>
            <link rel="android-chrome-icon" sizes="512x512" href={props.image ? props.image : "/android-chrome-512x512.png"}/>
            <link rel="apple-touch-icon" sizes="180x180" href={props.image ? props.image : "/apple-touch-icon.png"}/>
            <link rel="apple-touch-icon" sizes="180x180" href={props.image ? props.image : "/apple-touch-icon.png"}/>
            <link rel="icon" type="image/png" sizes="32x32" href={props.image ? props.image : "/favicon-32x32.png"}/>
            <link rel="icon" type="image/png" sizes="16x16" href={props.image ? props.image : "/favicon-16x16.png"}/>
        </>
    );
}

