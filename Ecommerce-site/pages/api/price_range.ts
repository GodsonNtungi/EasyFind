import axios from "axios";
import getConfig from "next/config";
import type {NextApiRequest, NextApiResponse} from 'next'
import {getItems} from "../../services/products";
import {setProductFiltersMaxPriceState, setProductFiltersMinPriceState} from "../../store/productsSlice";

const {serverRuntimeConfig, publicRuntimeConfig} = getConfig()

export async function getProducts(id?: string,
                                  categories?: string[],
                                  ids?: string[],
                                  max_price?: string,
                                  min_price?: string,
                                  name?: string) {
    const key = serverRuntimeConfig.backendSecret
    return await getItems(
        key,
        id,
        categories,
        ids,
        max_price,
        min_price,
        name
    )
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    const id = req.query ? req.query.id?.toString() : undefined

    const name = req.query ? req.query.name?.toString() : undefined
    const categories = req.query ? req.query.categories?.toString().split(",") : undefined
    const ids = req.query ? req.query.ids?.toString().split(",") : undefined

    const max_price = req.query ? req.query.max_price?.toString() : undefined
    const min_price = req.query ? req.query.min_price?.toString() : undefined

    const {items, itemCount} = await getProducts(
        id,
        categories,
        ids,
        max_price,
        min_price,
        name
    )

    const prices = items?.map(x => x?.price ? x?.price : 0)

    res.status(200).json([ Math.min(...prices), Math.max(...prices)]);

};
