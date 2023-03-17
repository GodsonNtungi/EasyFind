import {definitions} from "../types/database";

export function IncreaseProductCountByN(product: Partial<definitions['items']>, n: number) {
    const {count, ...p} = product
    return {...p, count: count?count + n:n}
}

export function DecreaseProductCountByN(product: Partial<definitions['items']>, n: number) {
    const {count, ...p} = product

    if (count) {
        if (count >= n) return {
            product: {...p, count: count - n},
            changed: true
        }
    }

    return {
        product: product,
        changed: false
    }
}

