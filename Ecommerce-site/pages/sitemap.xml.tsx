// pages/sitemap.xml.tsx

import {getProducts} from "./api/products";


function generateSiteMap(products, baseUrl) {

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}</loc>
        <priority>1</priority>
        <changefreq>always</changefreq>
    </url>
    <url>
        <loc>${baseUrl}/about-us</loc>
        <priority>0.8</priority>
        <changefreq>always</changefreq>
    </url>
    ${products
        .map(({id}) => {
            return `
    <url>
        <loc>${`${baseUrl}/${id}`}</loc>
        <priority>0.8</priority>
        <changefreq>always</changefreq>
    </url>
    `;
        })
        .join('')}
</urlset>
        `;
}

function SiteMap() {
    // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({req, res}) {

    const baseUrl = req.headers?.referer?.split('://')[0] + "://" + req.headers.host

    // We generate the XML sitemap with the posts data
    const {items, itemCount} = await getProducts()
    const sitemap = generateSiteMap(items, baseUrl);

    res.setHeader('Content-Type', 'text/xml');
    // we send the XML to the browser
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
}

export default SiteMap;