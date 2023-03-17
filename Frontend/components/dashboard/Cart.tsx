import React, {useEffect, useState} from 'react';
import CartItemComponent from "./CartItem";
import {CartItem, setCartState, setCurrentCustomer} from "../../store/authSlice";
import {
    ActionIcon,
    Center,
    Divider,
    Box,
    Paper,
    Text,
    Button,
    Group,
    Title, Aside, ScrollArea, useMantineTheme, Select, Table, Menu, Checkbox, TextInput, Space
} from "@mantine/core";
import {useAppDispatch, useAppSelector} from "../../store/store";
import {
    IconArrowUp, IconAt, IconCash, IconChevronDown, IconFileInvoice, IconQuote,
    IconTrash,
    IconUserPlus,
} from "@tabler/icons";
import {DecreaseProductCountByN, IncreaseProductCountByN} from "../../lib/math.inventory";
import {
    useAddItemInMutation,
    useAddItemOutMutation,
    useEditItemMutation,
    useGetAllItemsQuery
} from "../../services/items";
import {setCartOpened} from "../../store/authSlice";
import {openModal, closeAllModals, openConfirmModal} from '@mantine/modals';
import {useGetAllStoreCustomersQuery} from "../../services/store";
import {definitions} from "../../types/database";
import NewCustomer from "./NewCustomer";
import {SupabaseClient} from "@supabase/supabase-js";
import supabase from "../../lib/supabase";
import StyledCurrencyFormat from "./StyledCurrencyFormat";
import {showNotification} from "@mantine/notifications";
import ReactPDF, {
    Page,
    Text as PdfText,
    Image as PdfImage,
    usePDF,
    View,
    Document,
    StyleSheet, pdf
} from '@react-pdf/renderer';
import {getImageUrl} from "../../lib/storage";
import {sendEmail} from "../../lib/mail";
import axios from "axios";
import {render} from "@react-email/render";
import cartItem from "./CartItem";

const createTransaction = async (supabase: SupabaseClient, body: Partial<definitions["transactions"]>) => {
    const {data, error} = await supabase.from('transactions')
        .insert(body)
        .select()
    return {
        data: data,
        error: error
    }
}

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        position: "relative",
    },
    row: {
        display: "flex",
        fontSize: 14,
        flexDirection: "row",
        borderBottom: "0.5px solid gray",
        padding: 8,
        justifyContent: "space-between"
    },
    subHeading: {
        display: "flex",
        fontSize: 14,
        padding: 8,
    },
    description: {
        width: "40%"
    },
    content: {
        width: "60%"
    },
    logo: {
        position: "absolute",
        right: 0, top: 0,
        width: 145,
    }
});

// Create Document Component
const InvoicePdf = ({
                        paymentMethod,
                        cart,
                        customer,
                        businessProfile
                    }: { paymentMethod: string, businessProfile: definitions['profiles'], cart: CartItem[], customer: definitions["customers"] }) => {
    return (
        <Document>
            <Page size="A4" wrap>

                <View style={styles.section}>
                    <PdfText style={{fontSize: 12, right: 0, marginBottom: 12}} render={({pageNumber, totalPages}) => (
                        `page ${pageNumber} / ${totalPages}`
                    )} fixed/>
                    <PdfText>Invoice #...</PdfText>

                    <PdfText style={{marginTop: 8, fontSize: 10}}>From</PdfText>
                    <PdfText
                        style={{fontSize: 12}}>{businessProfile?.username}</PdfText>

                    <PdfText style={{marginTop: 8, fontSize: 10}}>To</PdfText>
                    <PdfText
                        style={{fontSize: 12}}>{customer.unique_name ? customer.unique_name : "Walk in Customer"}</PdfText>

                    <PdfImage style={styles.logo}
                              src={getImageUrl(supabase, businessProfile?.avatar_url ? businessProfile?.avatar_url : "")}/>
                </View>

                <View style={styles.section}>

                    <View style={styles.subHeading}>
                        <PdfText style={{fontSize: 14}}>summary</PdfText>
                    </View>

                    <View>
                        <View style={styles.row}>
                            <PdfText style={styles.description}>item</PdfText>
                            <PdfText style={styles.description}>Qty</PdfText>
                            <PdfText style={styles.content}>Amount</PdfText>
                        </View>
                        {cart.map((item, index) => (
                            <View key={index} style={styles.row}>
                                <PdfText style={styles.description}>{item.name}</PdfText>
                                <PdfText style={styles.description}>{item.count}</PdfText>
                                <PdfText style={styles.content}>{item.price}</PdfText>
                            </View>
                        ))}

                    </View>

                    <View>
                        <View style={styles.row}>
                            <PdfText style={styles.description}>.</PdfText>
                            <PdfText style={styles.description}>Total Amount</PdfText>
                            <PdfText style={styles.content}>{cart.reduce((a, b) => a + b.price, 0)} TZS</PdfText>
                        </View>
                        <View style={styles.row}>
                            <PdfText style={styles.description}>.</PdfText>
                            <PdfText style={styles.description}>Payment type</PdfText>
                            <PdfText style={styles.content}>{paymentMethod}</PdfText>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
}

const InvoiceDownloadPdf = ({
                                paymentMethod,
                                cart,
                                customer,
                                businessProfile
                            }: { paymentMethod: string, cart: CartItem[], customer: definitions["customers"], businessProfile: definitions['profiles'] }) => {

    const [instance, updateInstance] = usePDF({
        document: InvoicePdf({
            paymentMethod,
            cart, customer,
            businessProfile
        })
    });

    if (instance.loading) return <div>Loading ...</div>;

    if (instance.error) return <div>Something went wrong: {instance.error}</div>;

    return (
        <a rel={"noreferrer"} href={instance.url !== null ? instance.url : ""} target={"_blank"}>
            Download Invoice
        </a>
    );
}

const saleConfirmationModal = (pdfData: any, setEmail: Function, email: string, cart: CartItem[], paymentMethod: string, customer: definitions["customers"], businessProfile: definitions['profiles'], confirm: Function) => openConfirmModal({
    title: "Confirm Sale",
    children: (
        <Paper p={"sm"}>
            <Table verticalSpacing="xs"
                   striped
                   captionSide="top">
                <caption>summary</caption>
                <tbody>
                <tr>
                    <td>Customer</td>
                    <td>{customer.unique_name ? customer.unique_name : "Walk in customer"}</td>
                </tr>
                <tr>
                    <td>Total Items</td>
                    <td>{cart.length}</td>
                </tr>
                <tr>
                    <td>Total Amount</td>
                    <td>{cart.reduce((a, b) => a + b.price, 0)} TZS</td>
                </tr>
                <tr>
                    <td>Payment type</td>
                    <td>{paymentMethod}</td>
                </tr>
                </tbody>
            </Table>
            <Space p={"xs"}/>
            <Paper>
                {/*<Checkbox*/}
                {/*    label="Print Invoice"*/}
                {/*/>*/}
                <InvoiceDownloadPdf paymentMethod={paymentMethod} cart={cart} customer={customer} businessProfile={businessProfile}/>
                <Space p={"xs"}/>
                <TextInput onChange={(v) => {
                    setEmail(v.currentTarget.value)
                    console.log(email, " - email")
                }} label="Send a copy to this email" placeholder="Email" icon={<IconAt size={14}/>}/>
            </Paper>
        </Paper>
    ),
    labels: {confirm: 'Confirm', cancel: 'Cancel'},
    onCancel: async () => {
        console.log(email)

        const data = {
            from: "Tiririka <no-reply@tiririka.com>",
            to: email,
            subject: "Hello",
            emailHtml: render(<Box>Some Content</Box>),
            attachments: [
                {
                    path: pdfData,
                }
            ]
        }

        axios.post("/api/send_email/",
            JSON.stringify(data),
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
            .then((response) => {
                // console.log(response.data)
            })
            .finally()
    },
    onConfirm: () => {
        confirm()
        // console.log('Confirmed')
    },
})

export const SelectCustomer = () => {

    const currentStore = useAppSelector(s => s.auth.currentStore)
    const customers = useGetAllStoreCustomersQuery({store_id: currentStore.id})
    const dispatch = useAppDispatch()
    const currentCustomer = useAppSelector(s => s.auth.currentCustomer)

    return (
        <Box sx={{display: "flex", width: "100%"}}>
            <Group title={"customer"} p={"xs"}>
                <IconUserPlus opacity={.3} size={20}/>
            </Group>
            <Select
                sx={{width: "100%"}}
                variant={"unstyled"}
                size={"sm"}
                clearable
                onEmptied={(v) => {
                    dispatch(setCurrentCustomer({} as definitions["customers"]))
                }}
                data={customers.currentData ? customers.currentData.map((x) => ({
                    label: x.unique_name,
                    value: JSON.stringify(x)
                })) : []}
                // label="customer"
                placeholder="walk in customer"
                onChange={(value) => {
                    if (value != null) {
                        dispatch(setCurrentCustomer(JSON.parse(value)))
                    } else {
                        dispatch(setCurrentCustomer({} as definitions["customers"]))
                    }
                    // console.log(value)
                }}
                searchable
                nothingFound={<>
                    <Button onClick={() => {
                        openModal({
                            title: "New Customer",
                            children: (
                                <NewCustomer closeModal={() => {
                                    closeAllModals()
                                }}/>
                            )
                        })
                    }} variant={'subtle'} size={'xs'}> add new customer </Button>
                </>
                }
            />
        </Box>
    )
}


const Cart = () => {

    const theme = useMantineTheme()
    const cartState = useAppSelector(state => state.auth.cartState)
    const [cartErrors, setCartErrors] = useState<string[]>([])
    const [pdfData, setPdfData] = useState<string>();
    const [paymentMethod, setPaymentMethod] = useState("cash")
    const [email, setEmail] = useState("")

    // products in or out methods
    const [addProductsIn] = useAddItemInMutation()
    const [addProductsOut] = useAddItemOutMutation()

    const dispatch = useAppDispatch()
    const currentStore = useAppSelector(s => s.auth.currentStore)
    const {currentData, error, isLoading} = useGetAllItemsQuery({store_id: currentStore.id, name: ''})
    const currentProfile = useAppSelector(s => s.auth.profile)
    const currentCustomer = useAppSelector(s => s.auth.currentCustomer)
    const businessProfile = useAppSelector(s => s.auth.businessProfile)

    useEffect(() => {
        const fetchData = async () => {
            const result = pdf(InvoicePdf({
                paymentMethod,
                cart: cartState, customer: currentCustomer, businessProfile
            }));
            const pdfBlob = await result.toBlob()

            const reader = new FileReader();
            reader.readAsDataURL(pdfBlob);
            reader.onloadend = async () => {
                const base64data = reader.result as string;
                setPdfData(base64data);
            };
        };

        fetchData().then();
    }, [])

    const findProduct = (prod_id: number): Partial<definitions["items"]> => {
        const prod = currentData?.find(x => x.id === prod_id)
        return {
            id: prod?.id,
            count: prod?.count,
            price: prod?.price
        }
    }

    const [editProduct] = useEditItemMutation({
        fixedCacheKey: 'shared-update-product',
    })


    return (
        <Paper
            style={{height: "100%", backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : 'inherit'}}>
            <Group p={"sm"} position={'apart'} style={{display: 'flex', alignItems: 'center'}}>
                <Title p={1} order={2} sx={{fontFamily: "Poppins"}} size={"h4"} color={"dimmed"}>Cart
                    (<span>{cartState?.length}</span>)</Title>
                <Group>
                    <StyledCurrencyFormat value={cartState.reduce((a, b) => a + b.price, 0)}/>
                    <ActionIcon variant={'subtle'} color={'red'} title={'clear cart'} onClick={() => {
                        dispatch(setCartState([]))
                    }} disabled={cartState.length == 0}>
                        <IconTrash size={22}/>
                    </ActionIcon>
                </Group>
            </Group>
            {/*<Divider />*/}
            <Group grow p={"sm"}>
                <SelectCustomer/>
            </Group>

            <Divider/>
            <Aside.Section grow component={ScrollArea.Autosize} maxHeight={"60vh"} sx={{maxWidth: "100%"}} mx="auto"
                           px="xs">
                {/* scrollable content here */}
                <Box mb={5} style={{overflowX: 'hidden', height: '100%', overflowY: 'hidden', background: 'inherit'}}>
                    {
                        cartState.length == 0 ?
                            <Center><Text weight={'lighter'} p={'md'}>add products!</Text></Center> :
                            cartState.map((item, index) => (
                                <CartItemComponent key={item.id} item={item}
                                                   currentData={currentData ? currentData : []}/>
                            ))
                    }
                </Box>
            </Aside.Section>
            <Aside.Section px={"xs"}>
                {/*<Divider/>*/}
                <Group noWrap spacing={0}>
                    <Select
                        size={'lg'}
                        value={paymentMethod}
                        onChange={(v) => {
                            setPaymentMethod(v !== null ? v : "cash")
                        }}
                        variant={"filled"}
                        icon={<IconCash/>}
                        sx={{
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                            width: "100%"
                        }}
                        data={["cash", "credit"]}
                    />
                </Group>
                <Group noWrap spacing={0}>
                    <Button
                        sx={{
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                        }}
                        fullWidth
                        rightIcon={<IconArrowUp
                            size={'14px'}/>}
                        size={'lg'}
                        disabled={cartState.length == 0}
                        variant={'filled'}
                        onClick={() => {
                            dispatch(setCartOpened(false))
                            saleConfirmationModal(pdfData, setEmail, email, cartState, paymentMethod, currentCustomer, businessProfile,
                                () => {
                                    let errorMsg: string[] = []
                                    // create a transaction
                                    createTransaction(supabase, {
                                        store_id: currentStore?.id,
                                        customer: currentCustomer?.id,
                                        payment_method: paymentMethod
                                    }).then(({data, error}) => {
                                        if (error != null) {
                                            // handle error
                                            console.log(error)
                                        } else {
                                            const transaction: definitions["transactions"] = data !== null ? data[0] : undefined
                                            // console.log(data, transaction.id)
                                            if (transaction) {
                                                cartState.forEach(p => {
                                                    // @ts-ignore
                                                    const initial_p = findProduct(p.id)
                                                    if (initial_p) {
                                                        const {
                                                            product,
                                                            changed
                                                        } = DecreaseProductCountByN(initial_p, p.count)
                                                        // console.log(initial_p, changed, product)
                                                        if (!changed) {
                                                            // show error
                                                            errorMsg.push(`${p.name} checkout count higher than available`)
                                                        } else {
                                                            setCartErrors([])
                                                            addProductsOut({
                                                                item_id: p.id,
                                                                store_id: currentStore?.id,
                                                                employee_id: currentProfile?.employee?.id,
                                                                count: p.count,
                                                                transaction: transaction.id,
                                                                amount: p.price
                                                            })
                                                            editProduct(product)
                                                            dispatch(setCurrentCustomer({} as definitions["customers"]))
                                                        }
                                                    }
                                                })
                                            } else {
                                                console.error("Transaction not found.")
                                            }
                                        }
                                    })
                                    if (errorMsg.length === 0) {
                                        dispatch(setCartState([]))
                                        dispatch(setCartOpened(false))
                                    } else {
                                        showNotification({
                                            title: "Cart Errors",
                                            message: errorMsg.join(", ")
                                        })
                                    }
                                })
                        }}>
                        <span>create Sale</span>
                    </Button>

                    <Menu transition="pop" position="bottom-end">
                        <Menu.Target>
                            <ActionIcon
                                variant="filled"
                                color={theme.primaryColor}
                                size={50}
                                disabled={cartState.length == 0}
                                sx={{
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0,
                                    border: 0,
                                    borderLeft: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white}`,
                                }}
                            >
                                <IconChevronDown size={26} stroke={1.5}/>
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item icon={<IconFileInvoice size={16} stroke={1.5}/>}>
                                <Text>
                                    create quotation
                                </Text>
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>

                    {/*{currentProfile.owner ?*/}
                    {/*    <Button radius={"xl"} fullWidth leftIcon={<IconArrowDown size={'14px'}/>} size={'lg'}*/}
                    {/*            disabled={cartState.length == 0} variant={'default'} onClick={() => {*/}
                    {/*        cartState.forEach(p => {*/}
                    {/*            // @ts-ignore*/}
                    {/*            const {stores, product_groups, ...initial_p} = findProduct(p.id)*/}
                    {/*            if (initial_p) {*/}
                    {/*                addProductsIn({*/}
                    {/*                    item_id: p.id,*/}
                    {/*                    store_id: currentStore?.id,*/}
                    {/*                    count: p.count*/}
                    {/*                })*/}
                    {/*                editProduct(IncreaseProductCountByN(initial_p, p.count))*/}
                    {/*            }*/}
                    {/*        })*/}
                    {/*        if (cartErrors.length === 0) {*/}
                    {/*            dispatch(setCartState([]))*/}
                    {/*            dispatch(setCartOpened(false))*/}
                    {/*        }*/}
                    {/*    }}>*/}
                    {/*        <span> add stock</span>*/}
                    {/*    </Button> :*/}
                    {/*    <></>*/}
                    {/*}*/}
                </Group>

            </Aside.Section>
        </Paper>
    );
};

export default Cart;