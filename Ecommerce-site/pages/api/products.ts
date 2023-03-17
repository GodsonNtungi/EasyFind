import axios from "axios";
import getConfig from "next/config";
import type {NextApiRequest, NextApiResponse} from 'next'
import {getCategories, getItems, getProfile} from "../../services/products";

const {serverRuntimeConfig, publicRuntimeConfig} = getConfig()

export async function getProductsCategories() {
    const key = serverRuntimeConfig.backendSecret
    return await getCategories(key)
}

export async function getBusinessProfile() {
    const key = serverRuntimeConfig.backendSecret
    return await getProfile(key)
}

export async function getProducts(id?: string,
                                  categories?: string[],
                                  ids?: string[],
                                  max_price?: string,
                                  min_price?: string,
                                  name?: string,
                                  limit?: string) {
    const key = serverRuntimeConfig.backendSecret
    return await getItems(
        key,
        id,
        categories,
        ids,
        max_price,
        min_price,
        name,
        limit
    )
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    const id = req.query ? req.query.id?.toString() : undefined

    const name = req.query ? req.query.name?.toString() : undefined
    const limit = req.query ? req.query.limit?.toString() : undefined
    const categories = req.query ? req.query.categories?.toString().split(",") : undefined
    const ids = req.query ? req.query.ids?.toString().split(",") : undefined

    const max_price = req.query ? req.query.max_price?.toString() : undefined
    const min_price = req.query ? req.query.min_price?.toString() : undefined

    const data = await getProducts(
        id,
        categories,
        ids,
        max_price,
        min_price,
        name,
        limit
    )

    if (data === null) {
        res.status(200).json([]);
    } else {
        const {items, itemCount} = data
        res.status(200).json(items);
    }

};
