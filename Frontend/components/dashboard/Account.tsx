/**
 * components/dashboard/AccountLayout.tsx
 *
 * Main Account component
 * - contains the main account structure.
 * - Features implemented hear are:
 *      - product listing, filtering (by name and category.)
 *      - Add new Item button (disguised as MenuItem Component)
 */

import Products from "./Products";
import {
    Autocomplete,
    Modal,
    Paper,
    ActionIcon,
    Box,
    MediaQuery,
    CloseButton,
    Aside,
    Grid,
    Col,
    Text,
    Divider,
    Group
} from '@mantine/core'
import {
    IconLayoutRows,
    IconPlus,
    IconSearch, IconTable,
    IconLayoutGrid, IconFileImport
} from '@tabler/icons'
import {useForm} from "@mantine/form";
import React, {useState} from "react";
import NewItemForm from "./NewItemForm";
import {
    useGetAllCategoriesQuery,
    useGetAllItemsQuery
} from "../../services/items";
import ProductSkeleton from "./productSkeleton";
import {useAppDispatch, useAppSelector} from "../../store/store";
import Cart from "./Cart";
import {setCartOpened, setStockItemsArrangement} from "../../store/authSlice";
import ItemCategoriesFilter from "./ItemCategoriesFilter";
import ImportItemsForm from "./ImportItemsForm";

// productFilter interface.
interface productFilterState {
    name: string
    category: number
}

export default function Account() {

    // top search form
    const form = useForm({
        initialValues: {
            search: '',
        },
    });

    // get the current store form state
    const currentStore = useAppSelector(state => state.auth.currentStore)

    // get ItemsData from API
    const {
        currentData: itemsData,
        error: itemsDataError,
        isLoading: itemsDataIsLoading
    } = useGetAllItemsQuery({store_id: currentStore?.id, name: ""})

    // get categoriesData from API
    const {
        currentData: categoriesData,
        error: categoriesDataError,
        isLoading: categoriesDataLoading
    } = useGetAllCategoriesQuery({store_id: currentStore.id, name: ""})

    // state to control opening and closing of the 'Add new item modal' .
    const [newModalOpened, setNewModalOpened] = useState(false);
    const [importModalOpened, setImportModalOpened] = useState(false);

    // products filter state
    const [productsFilter, setProductsFilter] = useState<productFilterState>({} as productFilterState)

    // get catOpened state from state
    const cartOpened = useAppSelector(s => s.auth.layout.cartOpened)
    const stockItemsArrangement = useAppSelector(s => s.auth.layout.stockItemsArrangement)

    // app Dispatch for updating state
    const dispatch = useAppDispatch()

    // use regex to convert the search string to a more reasonable value.
    // by removing unwanted characters -> \s
    const filter = (f: string) => {
        let r = RegExp("\\s+")
        const result = r.exec(f.trim())
        const searchValue = result ? result[0] ? result[0] : " " : " "
        f = f.trim().replaceAll(searchValue, "|")
        setProductsFilter({
            name: f, category: productsFilter.category ? productsFilter.category : 0
        })
    }

    // menu items component.
    const MenuItems = () => {
        return (
            <Group>
                <ActionIcon radius={"xl"} variant={'filled'} size={'lg'} color={"accent"}
                            onClick={() => setNewModalOpened(true)}
                            title={'add item'}>
                    <IconPlus size={16}/>
                </ActionIcon>
                <ActionIcon radius={"xl"} variant={'filled'} size={'lg'}
                            onClick={() => setImportModalOpened(true)}
                            title={'import products csv'}>
                    <IconFileImport size={16}/>
                </ActionIcon>
                <ActionIcon size={"lg"} variant={stockItemsArrangement === "table" ? "filled" : "transparent"}
                            color={stockItemsArrangement === "table" ? "primary" : "gray"} onClick={() => {
                    dispatch(setStockItemsArrangement("table"))
                }}>
                    <IconLayoutRows stroke={2}/>
                </ActionIcon>
                <ActionIcon size={"lg"} variant={stockItemsArrangement === "blocks" ? "filled" : "transparent"}
                            color={stockItemsArrangement === "blocks" ? "primary" : "gray"} onClick={() => {
                    dispatch(setStockItemsArrangement("blocks"))
                }}>
                    <IconLayoutGrid stroke={2}/>
                </ActionIcon>

            </Group>
        )
    }

    return (
        <>
            <Box style={{display: 'flex', width: "100%", flexDirection: 'column'}}>
                <Paper style={{position: 'sticky', top: 50, overflow: "hidden", 'right': 0, zIndex: 200}}>
                    <Grid px={5} align={'center'}>
                        <Col span={'auto'}>
                            {/*the items search bar*/}
                            <Autocomplete
                                variant={"unstyled"}
                                size={'md'}
                                rightSection={
                                    <div>
                                        <CloseButton onClick={() => {
                                            setProductsFilter({} as productFilterState);
                                            form.reset()
                                        }} hidden={productsFilter.name?.length === 0} size={18}
                                                     style={{display: 'block', opacity: 0.5}}/>
                                    </div>
                                }
                                onItemSubmit={(v) => filter(v.value)}
                                onKeyUp={(v) => filter(v.currentTarget.value)}
                                {...form.getInputProps('search')}
                                icon={<IconSearch/>}
                                placeholder="search"
                                data={itemsData ? itemsData?.map(p => p.name) : []}
                            />
                        </Col>
                        <Col span={'content'}>
                            {/* Add new Item button */}
                            <MenuItems/>
                        </Col>
                    </Grid>
                    <Divider/>
                    <Group px={"sm"} position={"apart"}>

                        {/* Category filters */}
                        <ItemCategoriesFilter callback={(id: number) => {
                            setProductsFilter({
                                name: productsFilter.name,
                                category: id
                            })
                        }} categories={categoriesData ? categoriesData : []}/>
                    </Group>
                </Paper>
                {
                    // Does not handle errors by showing on UI but loading due to UX
                    // both loading and error fetching are shown by the products' skeleton.
                    (itemsDataIsLoading || categoriesDataLoading || itemsDataError || categoriesDataError) ?
                        <>
                            <ProductSkeleton/>
                        </>
                        :
                        <Products categoryFilter={productsFilter.category} nameFilter={productsFilter.name}/>
                }
            </Box>

            <MediaQuery smallerThan="sm" styles={{display: 'none'}}>
                <Aside style={{zIndex: 1}} width={{sm: 300, base: cartOpened ? 300 : undefined, lg: 300}}>
                    <Cart/>
                </Aside>
            </MediaQuery>

            {/*<MediaQuery largerThan="sm" styles={{display: 'none'}}>*/}
            <Modal
                opened={cartOpened}
                fullScreen
                onClose={() => dispatch(setCartOpened(false))}
                title="Cart"
            >
                <Cart/>
            </Modal>

            <Modal
                opened={newModalOpened}
                onClose={() => setNewModalOpened(false)}
                title="Add new item."
                fullScreen
            >
                <NewItemForm
                    closeModal={() => {
                        setNewModalOpened(false)
                    }}
                />
            </Modal>

            <Modal
                opened={importModalOpened}
                onClose={() => setImportModalOpened(false)}
                title="Import items from Excel."
                fullScreen
            >
                <ImportItemsForm
                    closeModal={() => {
                        setImportModalOpened(false)
                    }}
                    currentStore={currentStore}/>
            </Modal>

        </>
    )

}
