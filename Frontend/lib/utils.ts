import supabase from "./supabase";


export function getItemImageLink(url: string) {
    return
}

export async function productWebsiteBaseLink(secret: string) {

    const {data, error} = await supabase.from("websites")
        .select('*, profiles(*)')
        .eq('profiles.secret', secret)

    if (error) {
        console.log(error)
        return null
    }

    if (data !== null) {
        if (data?.length > 0) {
            const website = data[0].fqdn.toString().trim()
            if (website.endsWith("/")) {
                return `https://${website}products/`
            } else {
                return `https://${website}/products/`
            }
        }
    }

    return null
}


export async function getItemsFromStoreId(id: any) {

    const {data, error} = await supabase.from("items")
        .select('*, stores(*)')
        .eq('stores.id', id)

    if (error) {
        console.log(error)
        return null
    }

    if (data !== null) {
        if (data?.length > 0) {
            return data[0]
        }
    }

    return null
}


export const openInNewTab = (url: string): void => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
}

export interface DataImport {
    store_id?: number;
    name: string;
    description: string;
    category: string;
    sale_price: number;
    discount_price: number;
    image_url: string;
    count: number;
    quantity?: string;
    currency?: string;
    price?: number;
    unit?: string;
}

export function downloadBlob(fileName: string, blob: Blob): void {
    if ((window.navigator as any).msSaveOrOpenBlob) {
        (window.navigator as any).msSaveBlob(blob, fileName);
    } else {
        const anchor = window.document.createElement('a');
        anchor.href = window.URL.createObjectURL(blob);
        anchor.download = fileName;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(anchor.href);
    }
}

export async function processDataImport(data: Partial<DataImport>[], store_id: any) {

    console.log(data)

    async function processColumnWithName(name: string, table: string) {
        let rid;
        let results = await supabase.from(table)
            .select("id")
            .eq('name', name)
            .eq('store_id', store_id)
            .single()
        if (results.data !== null)
            rid = results.data?.id
        else {
            rid = (await supabase.from(table)
                    .insert({name: name, store_id: store_id})
                    .select("id")
                    .single()
            ).data?.id
        }
        return rid
    }

    async function processColumnWithImage(image_url: string, item_id: number, table: string = "item_images") {
        let rid;
        let results = await supabase.from(table)
            .select("id")
            .eq('image_url', image_url)
            .eq('item_id', item_id)
            .single()
        if (results.data !== null)
            rid = results.data?.id
        else {
            rid = (await supabase.from(table)
                    .insert({item_id: item_id, image_url: image_url})
                    .select("id")
                    .single()
            ).data?.id
        }
        return rid
    }

    for (const value of data) {

        value.store_id = store_id

        value.currency = value.currency !== undefined ? value.currency : "TZS"

        // extract number and unit in quantity (just in case unit is not provided)
        let q = value.quantity?.toString().split(" ")[0].replaceAll("x", ".")
        let u = value.quantity?.toString().split(" ")[1]

        if (q !== undefined && q !== null) {
            try {
                value.count = Number(q)
            } catch (e) {
                // failed to convert to Number.
            }
        }

        if (u !== undefined && u !== null)
            value.unit = await processColumnWithName(u, "units")
        else if (value.unit !== undefined && value.unit !== null)
            value.unit = await processColumnWithName(value.unit, "units")

        if (value?.category)
            value.category = await processColumnWithName(value.category, "categories")

        supabase
            .from('items')
            .insert({
                name: value.name,
                count: value.count,
                currency: value.currency,
                store_id: value.store_id,
                category: value.category,
                unit: value.unit,
                discount_price: value.discount_price,
                price: value.price,
                sale_price: value.sale_price,
                description: value.description
            })
            .select()
            .single()
            .then(({data: rt, error: er}) => {
                if (er)
                    console.error("LoadError: ", JSON.stringify(er))
                else
                    // add image_url
                    if (value.image_url !== undefined)
                        processColumnWithImage(value.image_url, rt?.id)
                            .then()
                    console.log("Loaded: ", JSON.stringify(rt))
            })

    }

    return

}