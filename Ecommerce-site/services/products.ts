import supabase, {getPagination} from "../utils/supabase";
import product from "../components/web/Product";
import {getImageUrl} from "../utils/storage";
import {definitions} from "../types/database";
import {showNotification} from "@mantine/notifications";
import {CartItem} from "../store/cartSlice";

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


export const getCategories = async (secret: string) => {
    //    current business profile
    const {data: profiles, count} = await getProfile(secret)

    if (profiles === null) return null
    if (count === 0) return null

    const profile = profiles[0]

    const {data: stores, error: storesError, count: storesCount} = await supabase.from("stores")
        .select("*")
        .eq("profile_id", profile.id)

    if (stores === null) return null
    if (storesCount === 0) return null

    const query = supabase.from("categories")
        .select("*")
        .in("store_id", stores.map(x => x.id))

    const {data: categories, error, count: categoryCount} = await query

    return {categories, categoryCount}
}


export const getItems = async (secret: string, id?: string, categories?: string[], ids?: string[], max_price?: string, min_price?: string, name?: string, limit?: string) => {

    const {data: profiles, count} = await getProfile(secret)

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
    // console.log(ids)

    if (categories && categories.join(",").length > 0) query = query.in("category", categories)
    if (ids && ids.join(",").length > 0) query = query.in("id", ids)
    if (name) query = query.textSearch("name", `${name}`)
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
        item.item_images.map(im => {
            im.image_url = getImageUrl(supabase, im.image_url ? im.image_url : "")
            return im;
        })
        return item
    })

    return {items, itemCount}
}

export const createOrder = async (orderItems: CartItem[], orderDetails: Partial<definitions['orders']>) => {
    const {data: order, error: orderErrors} = await supabase.from("orders")
        .insert(orderDetails)
        .select("id")

    if (orderErrors) {
        console.log(orderErrors)
        showNotification({
            title: "Order Errors",
            message: `${orderErrors.message}`
        })
        return null
    }
    console.log(order)
    if (order !== undefined) {
        console.log(order)

        const {data, count, error} = await supabase.from("order_items")
            .insert(orderItems.map(item => {
                return {
                    item_id: item.id,
                    qty: item.count,
                    order_id: order[0]?.id
                }
            }))
            .select("*")

        if (error) {
            console.log(error)
            showNotification({
                title: "Order Errors",
                message: `${error.message}`
            })
            return null
        }

        return {data, count}

    }

    return null
}