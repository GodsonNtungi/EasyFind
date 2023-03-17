import React, {useEffect, useState} from 'react';
import {
    NumberInput,
    Paper,
    TextInput,
    Title,
    Group,
    Button,
    Text,
    MultiSelect,
    Select,
    FileInput,
    useMantineTheme,
    Textarea,
    SimpleGrid, Checkbox,
} from "@mantine/core";
import {useForm} from "@mantine/form";
import {
    useAddCategoryMutation,
    useAddItemImageMutation,
    useAddItemMutation, useAddUnitMutation,
    useGetAllCategoriesQuery, useGetAllUnitsQuery
} from "../../services/items";
import {definitions} from "../../types/database";
import {useAppSelector} from "../../store/store";
import {updateProductPic, uploadProductPic} from "../../lib/storage";
import supabase from "../../lib/supabase";
import {IconFileImport} from "@tabler/icons";


export const FilteredGroupsSelect = ({currentStore, form}: { form: any, currentStore: definitions['stores'] }) => {

    const {data} = useGetAllCategoriesQuery({store_id: currentStore.id, name: ""})
    const [addCategory] = useAddCategoryMutation()
    // const currentStore = useAppSelector(s => s.auth.currentStore)

    const [sValue, setSValue] = useState("")

    return (
        <>
            <Select
                size={"lg"}
                data={data ? data.map((x) => ({label: x.name, value: x.id})) : []}
                label="Item groups"
                placeholder="select category"
                onKeyUp={(v) => {
                    setSValue(v.currentTarget.value)
                }}
                searchable
                nothingFound={sValue.length > 0 ? <>
                    <Button onClick={() => {
                        const cat = {
                            name: sValue,
                            store_id: currentStore.id
                        }
                        addCategory(cat)
                    }} variant={'subtle'} size={'xs'}>create category {sValue} </Button>
                </> : <>
                    <Text>Type a new group name.</Text>
                </>
                }
                {...form.getInputProps('category')}
            />
        </>
    )
}


export const FilteredUnitsSelect = ({currentStore, form}: { form: any, currentStore: definitions['stores'] }) => {

    const {data} = useGetAllUnitsQuery({store_id: currentStore.id, name: ""})
    const [addUnit] = useAddUnitMutation()
    // const currentStore = useAppSelector(s => s.auth.currentStore)

    const [sValue, setSValue] = useState("")

    return (
        <>
            <Select
                size={"lg"}
                data={data ? data.map((x) => ({label: x.name, value: x.id})) : []}
                label="Unit"
                placeholder="select unit"
                onKeyUp={(v) => {
                    setSValue(v.currentTarget.value)
                }}
                searchable
                nothingFound={sValue.length > 0 ? <>
                    <Button onClick={() => {
                        const uni = {
                            name: sValue,
                            store_id: currentStore.id
                        }
                        addUnit(uni)
                    }} variant={'subtle'} size={'xs'}>create unit {sValue} </Button>
                </> : <>
                    <Text>Type a new unit.</Text>
                </>
                }
                {...form.getInputProps('unit')}
            />
        </>
    )
}

const NewItemForm = ({
                         closeModal = () => {
                         }
                     }: { closeModal: Function }) => {

    const [addItem, result] = useAddItemMutation()

    const currentStore = useAppSelector(state => state.auth.currentStore)

    const productInitialValue = {} as definitions["items"] & { image: any }

    productInitialValue.store_id = currentStore.id
    productInitialValue.image = null
    productInitialValue.description = ''
    productInitialValue.name = ''
    productInitialValue.count = 0
    productInitialValue.currency = 'TZS'
    productInitialValue.condition = 'new'
    productInitialValue.availability = 'in stock'
    productInitialValue.category = undefined
    productInitialValue.price = 0
    productInitialValue.buying_price = 0
    productInitialValue.unit = undefined
    productInitialValue.list_in_catalog = true

    const form = useForm({
        initialValues: productInitialValue
    })

    const theme = useMantineTheme()
    const [loading, setLoading] = useState(false)
    const [addProductImage, productImageResult] = useAddItemImageMutation()


    return (
        <Paper>
            <Group grow position={'center'}>

                <form style={{maxWidth: theme.breakpoints.sm}} onSubmit={form.onSubmit((values) => {
                    console.log(values)
                    setLoading(true)
                    const {image, ...prod} = values
                    if (image !== null) {
                        uploadProductPic(supabase, prod.name, image)
                            .then(async ({data, error}: { data: any, error: any }) => {
                                if (data) {
                                    const retProd = await addItem(prod)
                                    console.log(retProd)
                                    await addProductImage({
                                        image_url: data.path,
                                        // @ts-ignore
                                        item_id: retProd.data[0].id
                                    })
                                    setLoading(false)
                                    closeModal(prod)
                                }
                                if (error) console.error(error)
                            })
                    } else {
                        addItem(prod)
                        closeModal(prod)
                    }
                })}>

                    <TextInput
                        size={"lg"}
                        {...form.getInputProps('name')}
                        label={'name'}
                        placeholder={'product unique name'}
                        withAsterisk
                        required
                    />

                    <Textarea
                        size={"lg"}
                        {...form.getInputProps('description')}
                        label={'description'}
                        placeholder={'product description'}
                        withAsterisk
                        required
                    />

                    <FileInput
                        style={{}}
                        accept="image/*"
                        capture size={"lg"}
                        {...form.getInputProps('image')}
                        label={"upload product image"}
                        placeholder={"product image"}
                        icon={<IconFileImport size={14}/>}/>

                    <SimpleGrid breakpoints={[
                        {minWidth: "lg", cols: 2, spacing: "lg"}
                    ]}>
                        <FilteredGroupsSelect currentStore={currentStore} form={form}/>

                        <NumberInput
                            size={"lg"}
                            {...form.getInputProps('count')}
                            label={'count'}
                        />

                        <Select
                            size={"lg"}
                            defaultValue={"in stock"}
                            data={["in stock", "out of stock"]}
                            label="availability"
                            placeholder="availability"
                            required
                            withAsterisk
                            {...form.getInputProps('availability')}
                        />

                        <Select
                            size={"lg"}
                            required
                            withAsterisk
                            defaultValue={"new"}
                            data={["new", "used", "refurbished"]}
                            label="condition"
                            placeholder="condition"
                            {...form.getInputProps('condition')}
                        />

                        <NumberInput
                            size={"lg"}
                            {...form.getInputProps('buying_price')}
                            label={'buying price'}
                        />

                        <NumberInput
                            size={"lg"}
                            {...form.getInputProps('price')}
                            label={'selling price'}
                        />

                        <Select
                            size={"lg"}
                            defaultValue={"new"}
                            data={["TZS", "UDS"]}
                            label="currency"
                            placeholder="currency"
                            {...form.getInputProps('currency')}
                        />

                        <FilteredUnitsSelect currentStore={currentStore} form={form}/>

                        <Checkbox
                            size={"lg"}
                            label="list in catalog"
                            checked={true}
                            description={"This product will be listed in WhatsApp and facebook product catalogs. "}
                            {...form.getInputProps('list_in_catalog')}
                        />

                    </SimpleGrid>


                    <Group position="right" mt="md">
                        <Button loading={loading} size={"lg"} type="submit">Submit</Button>
                    </Group>
                </form>
            </Group>
        </Paper>
    );
};

export default NewItemForm;
