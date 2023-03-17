// pages/site.web-manifest.xml.tsx

import {getBusinessProfile} from "./api/products";
import {definitions} from "../types/database";


function SiteManifest() {
    // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({res}) {

    const {data} = await getBusinessProfile()
    const businessProfile: definitions['profiles'] = data[0]

    const manifest = `{
        "name": "${businessProfile.username}",
        "short_name": "${businessProfile.username}",
        "icons": [
            {
                "src": "${businessProfile?.avatar_url}",
                "sizes": "192x192",
                "type": "image/png"
            },
            {
                "src": "${businessProfile?.avatar_url}",
                "sizes": "512x512",
                "type": "image/png"
            }
        ],
        "theme_color": "#ffffff",
        "background_color": "#ffffff",
        "display": "standalone"
    }`

    res.setHeader('Content-Type', 'application/json');
    // we send the XML to the browser
    res.write(manifest);
    res.end();

    return {
        props: {},
    };
}

export default SiteManifest;