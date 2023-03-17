import axios from "axios";
import getConfig from "next/config";
import type {NextApiRequest, NextApiResponse} from 'next'
import {getCategories, getItems, getProfile} from "../../services/products";

const {serverRuntimeConfig, publicRuntimeConfig} = getConfig()
const semanticSearchEndpoint = "https://semantic-search.site.atomatiki.tech"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    const semanticSearchString = req.query ? req.query.search?.toString() : undefined
    const searchCategories = req.query ? req.query.categories?.toString() : undefined
    let endpoint = semanticSearchEndpoint
    endpoint += "?search=" + encodeURIComponent(semanticSearchString)
    if (searchCategories?.length > 0)
        endpoint += "&categories=" + searchCategories
    const response = await axios.get(endpoint)

    if (response.data === null || response.data === undefined) {
        res.status(200).json([]);
    } else {
        res.status(200).json(response.data);
    }

};

