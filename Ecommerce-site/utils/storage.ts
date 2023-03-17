import {SupabaseClient} from "@supabase/supabase-js";

export function convertToSlug(Text: string) {
    return Text.toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
}

export async function uploadProductPic(supabase: SupabaseClient, filename: string, file: File) {
    const {data, error} = await supabase.storage
        .from('products')
        .upload(convertToSlug(filename) + "." + file.name.split('.').pop(), file)
    return {data: data, error: error}
}


export async function updateProductPic(supabase: SupabaseClient, filename: string, file: File) {

    const update = await supabase.storage
        .from('products')
        .update(convertToSlug(filename) + "." + file.name.split('.').pop(), file)
    if (update.error) {
        // console.log(update)
        const upload = await supabase.storage
            .from('products')
            .upload(convertToSlug(filename) + "." + file.name.split('.').pop(), file)
        return {data: upload.data, error: upload.error}
    }
    return {data: update.data, error: update.error}
}


export function getImageUrl(supabase: SupabaseClient, filename: string, height?: number, width?: number) {
    if (filename.indexOf('http') === 0)
        return filename
    return supabase.storage.from("products")
        .getPublicUrl(filename, {
            download: false,
            // transform: {
            //     width: 512,
            //     height: 512,
            //     resize: 'contain',
            // },
        }).data.publicUrl
}
