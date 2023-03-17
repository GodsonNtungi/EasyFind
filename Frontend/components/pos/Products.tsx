import {Center, SimpleGrid, Text} from "@mantine/core";
import {definitions} from "../../types/database";
import Product from "./Product";
import {useGetAllItemsQuery} from "../../services/items";
import ProductSkeleton from "./ProductSkeleton";
import {useAppSelector} from "../../store/store";


export default function Products({filter}: { filter: string }) {

    const currentStore = useAppSelector(state => state.auth.currentStore)

    const {currentData, error, isLoading, isFetching} = useGetAllItemsQuery({
        store_id: currentStore.id,
        name: filter
    })

    if (isLoading || isFetching) {
        return (
            <ProductSkeleton/>
        )
    }

    if (error) {
        console.error(error)
        return (
            <Text> Sorry! an error occurred!</Text>
        )
    }

    return (
        <>
            {currentData?.length == 0 ?
                <Center><Text weight={'lighter'} p={'md'}>No products added!</Text></Center> :
                <SimpleGrid
                    spacing={0}
                    breakpoints={[
                        {maxWidth: 'xs', cols: 1},
                        {minWidth: 'sm', cols: 2},
                        {minWidth: 'md', cols: 3},
                    ]}
                >
                    {currentData?.map(product => <Product key={product.id} product={product}/>)}
                </SimpleGrid>
            }
        </>
    );
}
