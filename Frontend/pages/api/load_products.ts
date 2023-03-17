import type {NextApiRequest, NextApiResponse} from 'next'
import supabase from "../../lib/supabase";
import NextCors from "nextjs-cors";
import {getImageUrl} from "../../lib/storage";
import {processDataImport} from "../../lib/utils";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb' // Set desired value here
        }
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {

    res.setHeader("Content-Type", "application/json")
    res.setHeader("Prefer", "return=representation")

    await NextCors(req, res, {
        // Options
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });

    const store_id = req.query ? req.query.store_id : undefined

    if (store_id === undefined) {
        res.status(404).json(JSON.stringify({
            error: {
                message: "Store not found."
            }
        }))
    }

    if (req.method === "POST") {
        // process data
        const data = req.body

        try {
            await processDataImport(data, store_id)
        } catch (e) {
            res.status(404).json(JSON.stringify({
                error: e
            }))
        }
        res.status(200)

    }
}

