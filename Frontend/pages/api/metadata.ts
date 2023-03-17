import type {NextApiRequest, NextApiResponse} from 'next'
import supabase from "../../lib/supabase";
import NextCors from "nextjs-cors";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {

    const secret = req.query ? req.query.key : undefined

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
        supabase.from("websites")
            .select('*, profiles(*)')
            .eq('profiles.secret', secret)
            .then(({data, error}) => {
                res.status(200).json(data?.map(item => {
                    return item
                }))
            })

    } else {
        res.status(200).json([])
    }

}

