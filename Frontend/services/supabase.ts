import supabase from "../lib/supabase";
import {definitions} from "../types/database";
import {showNotification} from "@mantine/notifications";
import {getImageUrl} from "../lib/storage";

export const getProfile = async (secret: string) => {
    //    current business profile
    const {data, error, count} = await supabase.from("profiles")
        .select("*")
        .eq("secret", secret)

    if (error) {
        console.log(error)
        return null
    }

    data.map(item => {
        item.avatar_url = getImageUrl(supabase, item.avatar_url ? item.avatar_url : "")
        return item
    })

    return {data, count}
}


export const getItems = async (secret: string, id?: string, categories?: string[], max_price?: string, min_price?: string, name?: string, limit?: string) => {

    const profilesData = await getProfile(secret)
    if (profilesData === null ) return null

    const {data: profiles, count} = profilesData

    if (profiles === null) return null
    if (count === 0) return null

    const profile = profiles[0]

    const {data: stores, error: storesError, count: storesCount} = await supabase.from("stores")
        .select("*")
        .eq("profile_id", profile.id)

    if (stores === null) return null
    if (storesCount === 0) return null

    let query = supabase.from("items")
        .select("*, categories(*), item_images(*)", {count: "exact"})
        .order("id", {ascending: true})
        .in("store_id", stores.map(x => x.id))

    if (id) query = query.eq("id", id)

    if (categories && categories.join().length > 0) query = query.in("category", categories)
    if (name) query = query.textSearch("id", `${name}`)
    if (max_price) query = query.lte("price", max_price)
    if (min_price) query = query.gte("price", min_price)

    let numberLimit: number;
    try {
        numberLimit = Number(limit)
        if (limit) query.limit(numberLimit)
    } catch (e) {
        console.error("Failed to convert limit to number. ", e)
    }

    //    current business profile
    const {data: items, error, count: itemCount} = await query

    if (items === null) return null
    if (itemCount === 0) return null

    if (error) {
        console.log(error)
        return null
    }

    // create image urls
    items.map(item => {
        item.item_images.map((im: definitions["item_images"]) => {
            im.image_url = getImageUrl(supabase, im.image_url ? im.image_url : "")
            return im;
        })
        return item
    })

    return {items, itemCount}
}


// get e-commerce websites
export const getWebsites = async (limit?: number) => {
    let query = supabase.from("websites")
        .select("*, profiles(*)")

    if (limit) query = query.limit(limit)

    const {data, error, count} = await query

    if (error) return null

    return {data, count}
}
