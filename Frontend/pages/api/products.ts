import type {NextApiRequest, NextApiResponse} from 'next'
import supabase from "../../lib/supabase";
import NextCors from "nextjs-cors";
import {getImageUrl} from "../../lib/storage";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {

    const secret = req.query ? req.query.key : undefined
    const id = req.query ? req.query.id : undefined

    // console.log(req.query, secret)

    res.setHeader("Content-Type", "application/json")
    res.setHeader("Prefer", "return=representation")

    await NextCors(req, res, {
        // Options
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });


    if (secret !== undefined) {

        const {data: profilesData, error: profilesError} = await supabase
            .from("profiles")
            .select('*, stores(*)')
            .eq('secret', secret)

        if (profilesData !== null) {
            if (profilesData?.length > 0) {
                const profile = profilesData[0];
                const store = profile.stores[0]
                // console.log(profile, store)

                const query = supabase.from("items")
                    .select('*, categories(id, name)')
                    .eq('store_id', store?.id)

                if (id !== undefined) {
                    query.eq('id', id)
                        .then(({data, error}) => {
                            res.status(200).json(data?.map(item => {
                                item.image_url = `${getImageUrl(supabase, item.image_url ? item.image_url : "")}`
                                return item
                            }))
                        })
                } else {
                    supabase.from("items")
                    query.then(({data, error}) => {
                        res.status(200).json(data?.map(item => {
                            item.image_url = `${getImageUrl(supabase, item.image_url ? item.image_url : "")}`
                            return item
                        }))
                    })
                }
            }
        }
    } else {
        res.status(200).json([])
    }

}

