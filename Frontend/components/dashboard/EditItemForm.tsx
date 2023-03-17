import React, {useEffect, useState} from 'react';
import {
    NumberInput,
    TextInput,
    Paper,
    Title,
    Group,
    Button,
    FileInput,
    Image,
    Badge,
    Card,
    useMantineTheme,
    Textarea,
    SimpleGrid,
    Select, Box, Checkbox,
} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useAddItemImageMutation, useDeleteItemMutation, useEditItemMutation} from "../../services/items";
import {definitions} from "../../types/database";
import {useAppSelector} from "../../store/store";
import {FilteredGroupsSelect, FilteredUnitsSelect} from "./NewItemForm";
import ProductImageSlider from "./productImageSlider";

const EditItemForm = ({
                          product,
                          closeModal = () => {
                          }
                      }: { product: (definitions['items'] & {item_images: definitions['item_images'][],categories: definitions['categories']}), closeModal: Function }) => {

    const [editProduct, editProductResult] = useEditItemMutation()
    const [deleteProduct, deleteProductResult] = useDeleteItemMutation()

    const currentStore = useAppSelector(state => state.auth.currentStore)

    const productInitialValue = {} as definitions["items"]

    // initialize values
    productInitialValue.id = product.id
    productInitialValue.description = product.description
    productInitialValue.name = product.name
    productInitialValue.count = product.count
    productInitialValue.currency = product.currency
    productInitialValue.condition = product.condition
    productInitialValue.availability = product.availability
    productInitialValue.category = product.category
    productInitialValue.price = product.price
    productInitialValue.list_in_catalog = product.list_in_catalog
    productInitialValue.buying_price = product.buying_price
    productInitialValue.unit = product.unit

    const form = useForm({
        initialValues: productInitialValue
    })

    const theme = useMantineTheme()
    const [loading, setLoading] = useState(false)

    return (
        <Paper>
            <Group position={'center'} grow>
                <Box style={{maxWidth: theme.breakpoints.sm}}>
                    <ProductImageSlider product={product} />
                </Box>
            </Group>

            <Group grow position={'center'}>

                <form style={{maxWidth: theme.breakpoints.sm}} onSubmit={form.onSubmit((values) => {
                    console.log(values)
                    setLoading(true)
                    const prod = values
                    editProduct(prod)
                    closeModal(prod)
                    setLoading(false)
                })}>

                    <Textarea
                        size={"lg"}
                        {...form.getInputProps('description')}
                        label={'description'}
                        placeholder={'product description'}
                        withAsterisk
                        required
                    />

                    <TextInput
                        size={"lg"}
                        {...form.getInputProps('name')}
                        label={'name'}
                        placeholder={'product unique name'}
                        withAsterisk
                        required
                    />

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
                            {...form.getInputProps('condition')} />

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

                        {product.list_in_catalog === true?
                            <Checkbox
                                size={"lg"}
                                label={
                                    <>
                                        Do not list in catalog{' '}
                                        <Badge>
                                            (Is listed.)
                                        </Badge>
                                    </>
                                }
                                value={false}
                                description={"This product will not be listed in WhatsApp and facebook product catalogs. "}
                                {...form.getInputProps('list_in_catalog')}
                            />:

                            <Checkbox
                                size={"lg"}
                                label={
                                    <>
                                        List in catalog{' '}
                                        <Badge color={"red"}>
                                            (Is not listed.)
                                        </Badge>
                                    </>
                                }
                                value={true}
                                description={"This product will not be listed in WhatsApp and facebook product catalogs. "}
                                {...form.getInputProps('list_in_catalog')}
                            />
                        }

                    </SimpleGrid>

                    <Group position="apart" mt="md">
                        <Button loading={deleteProductResult.isLoading} size={"lg"} color={"red"} onClick={(e: any) => {
                            e.preventDefault()
                            deleteProduct(product.id)
                            closeModal()
                        }}>Delete</Button>
                        <Button loading={loading || editProductResult.isLoading} size={"lg"} type="submit">Save</Button>
                    </Group>

                </form>
            </Group>
        </Paper>
    );
};

export default EditItemForm;

