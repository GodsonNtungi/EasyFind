import Products from "./Products";
import {
    Autocomplete,
    Paper,
    Drawer,
    MediaQuery,
    CloseButton,
    Box,
    Aside,
    Grid,
    Space,
    useMantineTheme, Col, Text, Skeleton, Divider
} from '@mantine/core'
import {
    IconSearch,
} from '@tabler/icons'
import {useForm} from "@mantine/form";
import React, {useState} from "react";
import {useGetAllItemsQuery} from "../../services/items";
import ProductSkeleton from "../dashboard/productSkeleton";
import {useAppDispatch, useAppSelector} from "../../store/store";
import Cart from "../dashboard/Cart";
import {setCartOpened} from "../../store/authSlice";


export default function PosIndex() {

    const theme = useMantineTheme();

    const form = useForm({
        initialValues: {
            search: '',
        },
    });

    const currentStore = useAppSelector(state => state.auth.currentStore)

    const {currentData, error, isLoading} = useGetAllItemsQuery({store_id: currentStore?.id, name: ""})

    const [productsFilter, setProductsFilter] = useState("")
    const cartOpened = useAppSelector(s => s.auth.layout.cartOpened)

    const dispatch = useAppDispatch()

    const filter = (f: string) => {
        let r = RegExp("\\s+")
        const result = r.exec(f.trim())
        const searchValue = result ? result[0] ? result[0] : " " : " "
        f = f.trim().replaceAll(searchValue, "|")
        setProductsFilter(f)
    }


    const MenuItems = () => {
        return (
            <></>
        )
    }

    if (isLoading) {
        return (
            <>
                <Skeleton height={45} mb={'sm'} mt={6} width="100%" radius="md"/>
                <ProductSkeleton/>
            </>
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
            <Box style={{display: 'flex', width:"100%", flexDirection: 'column'}}>
                <Paper style={{position: 'sticky', top: 50, overflow:"hidden", 'right':0, zIndex: 1}}>
                    <Grid px={5} align={'center'}>
                        <Col span={'auto'}>
                            <Autocomplete
                                variant={"unstyled"}
                                size={'md'}
                                rightSection={
                                    <div>
                                        <CloseButton onClick={() => {
                                            setProductsFilter("");
                                            form.reset()
                                        }} hidden={productsFilter.length === 0} size={18}
                                                     style={{display: 'block', opacity: 0.5}}/>
                                    </div>
                                }
                                onItemSubmit={(v) => filter(v.value)}
                                onKeyUp={(v) => filter(v.currentTarget.value)}
                                {...form.getInputProps('search')}
                                icon={<IconSearch/>}
                                placeholder="search"
                                data={currentData ? currentData?.map(p => p.name) : []}
                            />
                        </Col>
                    </Grid>
                    <Divider/>
                </Paper>
                <Products filter={productsFilter}/>
            </Box>

            <MediaQuery smallerThan="sm" styles={{display: 'none'}}>
                <Aside style={{ zIndex:1 }} width={{sm: 300, base: cartOpened ? 300 : undefined, lg: 400}}>
                    <Cart/>
                </Aside>
            </MediaQuery>

            <MediaQuery largerThan="sm" styles={{display: 'none'}}>
                <>
                    <Drawer
                        opened={cartOpened}
                        onClose={() => dispatch(setCartOpened(false))}
                        position={"right"}
                        size="90%"
                        overlayOpacity={0.55}
                        overlayBlur={3}
                        styles={{
                            // drawer: {borderTopLeftRadius: '20px', borderTopRightRadius: '20px'},
                            closeButton: {marginRight: '15px', marginTop: '10px'}
                        }}
                        overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
                    >
                        {/* Drawer content */}
                        <Cart/>
                    </Drawer>
                </>
            </MediaQuery>

        </>
    )
}
