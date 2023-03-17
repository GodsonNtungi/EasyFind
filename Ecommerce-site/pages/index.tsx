import React, {ReactElement, useEffect, useRef, useState} from 'react';
import DefaultLayout from "../components/layout/Default";
import {
    Box, Loader, Center,
    Button, Text,
    SimpleGrid, ScrollArea, Group,
} from "@mantine/core";
import InfiniteScroll from 'react-infinite-scroll-component';
import {getBusinessProfile, getProducts, getProductsCategories} from "./api/products";
import {useGetAllItemsQuery, useGetAllItemsPriceRangeQuery} from "../store/productsApi";
import {useAppDispatch, useAppSelector} from "../store/store";
import {
    setProductFiltersLimitState,
} from "../store/productsSlice";
import Product from "../components/web/Product";
import product from "../components/web/Product";

function ProductsPage() {

    const productFilters = useAppSelector(s => s.productFilters.filters)
    const dispatch = useAppDispatch()
    const {currentData: items, isFetching: isFetchingItems} = useGetAllItemsQuery(productFilters)
    const [itemList, setItemList] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [prevLimit, setPrevLimit] = useState(0)

    const fetchData = () => {
        setPrevLimit(Number(productFilters.limit))
        const nextLimit = (Number(productFilters.limit)) * 2;
        dispatch(setProductFiltersLimitState(`${nextLimit}`))
    }

    // pagination stuff

    useEffect(() => {
        if (productFilters.ids.length > 0) {
            if (items?.length && !isFetchingItems) {
                setItemList(items)
                setHasMore(false)
                console.log(items?.length)
            }
        } else {
            if (items?.length && !isFetchingItems) {
                setItemList(items)
                if (itemList?.length < prevLimit) {
                    setHasMore(false)
                }
                console.log(itemList?.length, Number(productFilters.limit), prevLimit)
            }
        }
    }, [items, productFilters, prevLimit]);


    return (
        <Box sx={{width: "100%"}}>

            <InfiniteScroll
                dataLength={itemList?.length} //This is important field to render the next data
                next={fetchData}
                hasMore={hasMore}
                loader={<Center>
                    <Loader/>
                </Center>}
                endMessage={isFetchingItems ? <></> :
                    <Center>
                        <Text component={"small"} sx={{fontFamily: "Poppins"}}> No more items</Text>
                    </Center>
                }
            >
                <SimpleGrid px={"xs"} py={"xl"} breakpoints={[
                    {minWidth: "xs", cols: 2, spacing: "xs"},
                    {minWidth: "sm", cols: 2, spacing: "sm"},
                    {minWidth: "md", cols: 3, spacing: "md"},
                    {minWidth: "lg", cols: 4, spacing: "md"},
                    {minWidth: "xl", cols: 5, spacing: "xl"}
                ]} mx={"auto"}>
                    {isFetchingItems ?
                        <Center p={'xl'} sx={{width: "100%"}}>
                            <Loader variant={"dots"}/>
                        </Center>
                        : itemList?.map((product, index) => (
                            <Product key={index} product={product}/>
                        ))}
                </SimpleGrid>
            </InfiniteScroll>
        </Box>
    );
}

export async function getServerSideProps({params, req, res, query: {page = 1}}) {

    const {categories} = await getProductsCategories()
    const {data} = await getBusinessProfile()
    const businessProfile = data[0]

    return {
        props: {
            categories,
            businessProfile
        }
    }
}

ProductsPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <DefaultLayout image={page.props.businessProfile?.avatar_url} title={"Home"}
                       businessProfile={page.props.businessProfile} categories={page.props.categories}
                       description={"Shop Products from " + page.props?.businessProfile.username + "'s vast shop list."}>
            {page}
        </DefaultLayout>
    )
}

export default ProductsPage;
