import {createClient} from "@supabase/supabase-js";


export const getPagination = (page: number, size: number) => {
        const limit = size ? size : 3;
        const from = page ? page * limit : 0;
        const to =  (from + size) - 1
        console.log(from, to, size)
        return { from, to };
};

const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL?process.env.NEXT_PUBLIC_SUPABASE_URL:"",
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY:""
        )

export default supabase