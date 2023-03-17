import {NextApiRequest, NextApiResponse} from "next";
import {sendEmail} from "../../lib/mail";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // console.log(req.body)
    try {

        await sendEmail(req.body, (err, info) => {
            if (err) {
                console.log(err)
                res.status(400)
            } else
                console.log(info)
        })
        res.status(200)
    } catch (e) {
        res.json(e);
        res.status(405).end();
    }
}