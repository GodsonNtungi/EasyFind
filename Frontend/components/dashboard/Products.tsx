import {Box, Center, createStyles, Loader, ScrollArea, SimpleGrid, Text} from "@mantine/core";
import InfiniteScroll from 'react-infinite-scroll-component';
import Product from "./Product";
import {useGetAllItemsQuery} from "../../services/items";
import ProductSkeleton from "./productSkeleton";
import {useAppDispatch, useAppSelector} from "../../store/store";
import {TableSelection} from "./TableSelection";
import {useEffect, useState} from "react";
import {definitions} from "../../types/database";
import {setProductLimit} from "../../store/authSlice";


export default function Products({nameFilter, categoryFilter}: { nameFilter: string, categoryFilter?: number }) {

    // arrangement
    const arrangement = useAppSelector(x => x.auth.layout.stockItemsArrangement)
    const productLimit = useAppSelector(x => x.auth.layout.productLimit)

    const currentStore = useAppSelector(state => state.auth.currentStore)

    const {currentData, error, isLoading, isFetching} = useGetAllItemsQuery({
        store_id: currentStore.id,
        name: nameFilter,
        category: categoryFilter,
        limit: productLimit
    })
    const [itemList, setItemList] = useState<(definitions['items'] & { item_images: definitions['item_images'][], categories: definitions['categories'] })[]>([])
    const [hasMore, setHasMore] = useState(true)
    const [prevLimit, setPrevLimit] = useState(0)
    const dispatch = useAppDispatch()

    const fetchData = () => {
        setPrevLimit(Number(productLimit))
        const nextLimit = (Number(productLimit)) * 2;
        dispatch(setProductLimit(nextLimit))
        console.log(productLimit)
    }

    // pagination stuff

    useEffect(() => {
        if (currentData?.length && !isFetching) {
            setItemList(currentData)
            if (itemList?.length < prevLimit) {
                setHasMore(false)
            }
            console.log(itemList?.length, Number(productLimit), prevLimit)
        }
    }, [currentData, productLimit, prevLimit]);


    if (isLoading || isFetching) {
        return (
            <ProductSkeleton />
        )
    }

    if (error) {
        console.error(error)
        return (
            <Text> Sorry! an error occurred!</Text>
        )
    }


    return <Box>
        {currentData?.length == 0 ?
            <Center><Text weight={'lighter'} p={'md'}>No products added!</Text></Center> :
            <InfiniteScroll
                dataLength={itemList?.length} //This is important field to render the next data
                next={fetchData}
                hasMore={hasMore}
                loader={<Center p={'xl'}>
                    <Loader/>
                </Center>}
                endMessage={
                    <Center p={'xl'}>
                        <Text component={"small"} sx={{fontFamily: "Poppins"}}> No more items</Text>
                    </Center>
                }
            >

                {arrangement !== 'blocks' ?
                    <TableSelection data={itemList ? itemList : []}/> :
                    <SimpleGrid
                        spacing={0}
                        breakpoints={[
                            {maxWidth: 'sm', cols: 1},
                            {minWidth: 'lg', cols: 2},
                            {minWidth: 'xl', cols: 3},
                        ]} mx={'auto'}>
                        {itemList?.map((product, index) => (
                            <Product key={index} product={product}/>
                        ))}
                    </SimpleGrid>
                }
            </InfiniteScroll>
        }
    </Box>
}
