// pages/sitemap.xml.tsx


import {definitions} from "../types/database";
import supabase from "../lib/supabase";
import {getImageUrl} from "../lib/storage";
import { productWebsiteBaseLink} from "../lib/utils";
import {getItems} from "../services/supabase";

function generateFeed(products: (definitions['items'] & {item_images: definitions['item_images'][], categories: definitions['categories']})[], prodBaseLink: string | null ) {

    return `<?xml version="1.0"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>

    ${products
        .map((item, index) => {
            if (item.item_images.length === 0) 
                return ""
            else
                return `
    <item>
        <id>${item.id?item.id:""}</id>
        <title>${item.name?item.name:""}</title>
        <description>${item.description?item.description:""}</description>
        <availability>${item.availability?item.availability:""}</availability>
        <condition>${item.condition?item.condition:""}</condition>
        <price>${item.price?item.price:""}</price>
        <currency>${item.currency?item.currency:""}</currency>
        <link>${prodBaseLink?prodBaseLink + item.id :""}</link>
        <image_link>${getImageUrl(supabase, item?.item_images[0] ? item.item_images[0].image_url ? item.item_images[0].image_url : "" : "")}</image_link>
        <brand>${item.brand?item.brand:""}</brand>
        <quantity_to_sell_on_facebook>${item.count?item.count:""}</quantity_to_sell_on_facebook>
        <google_product_category>${item.google_product_category?item.google_product_category:""}</google_product_category>
        <sale_price>${item.price?item.price:""}</sale_price>
        <item_group_id>${item.category?item.category:""}</item_group_id>
        <gender>${item.gender?item.gender:""}</gender>
        <color>${item.color?item.color:""}</color>
        <size>${item.size?item.size:""}</size>
        <age_group>${item.age_group?item.age_group:""}</age_group>
        <material>${item.material?item.material:""}</material>
        <expiration_date>${item.expiration_date?item.expiration_date:""}</expiration_date>
    </item>
    `;
        })
        .join('')}
</channel>
</rss>
        `;
}

function Feed() {
    // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({res, query}: {res: any, query: any}) {
    const secret = query?query.key:undefined
    if (secret !== undefined) {

        const itemsData = await getItems(secret)

        if (itemsData !== null ) {
            const {items, itemCount} = itemsData
            const prodBaseLink = await productWebsiteBaseLink(secret)

            // console.log(prodBaseLink)
            // console.log(items)

            // We generate the XML sitemap with the posts data
            const feed = generateFeed(items?items:[], prodBaseLink);

            res.setHeader('Content-Type', 'text/xml');
            // we send the XML to the browser
            res.write(feed);
            res.end();
        }


    } else {
        const feed = generateFeed([], null);

        res.setHeader('Content-Type', 'text/xml');
        // we send the XML to the browser
        res.write(feed);
        res.end();
    }

    return {
        props: {},
    };
}

export default Feed;

