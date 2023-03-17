import {Box, Button, Card, Center, Group, Input, NumberInput, Text, TextInput, Title, useMantineTheme} from '@mantine/core';
import React, {ReactElement, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../store/store";
import CartCheckoutItem from "../../components/web/CartCheckoutItem";
import DefaultLayout from "../../components/layout/Default";
import {useForm} from "@mantine/form";
import 'react-phone-number-input/style.css'
import PhoneInput, {isPossiblePhoneNumber, isValidPhoneNumber} from 'react-phone-number-input'
import {setCartState} from "../../store/cartSlice";
import {createOrder} from "../../services/products";
import {showNotification} from "@mantine/notifications";
import {useSession} from "@supabase/auth-helpers-react";


function Checkout(props) {

    const cartState = useAppSelector(state => state.cart.cartState)
    const theme = useMantineTheme()
    const dispatch = useAppDispatch()
    const session = useSession()
    const [loading, setLoading] = useState(false)

    const form = useForm({
        initialValues: {
            mobile_number: ""
        },
        validate: {
            mobile_number: (value) => {
                console.log(isPossiblePhoneNumber(value), value)
                if (isValidPhoneNumber(value)) {
                    return null
                } else {
                    showNotification({
                        title: "Invalid phone number.",
                        message: "Please enter a valid phone number"
                    })
                    return "Invalid phone number."
                }
            }
        }
    })

    return (
        <>
            <Card mx={"Auto"} sx={theme => ({
            })}>
                <Title align={"center"} py={"xl"} sx={{fontFamily: "Poppins"}}>Your Order Status</Title>
                {
                    cartState.length == 0 ?
                        <Center><Text weight={'lighter'} p={'md'}>add products!</Text></Center> :
                        cartState.map((item, index) => (
                            <CartCheckoutItem key={item.id} item={item}/>
                        ))
                }

                <form onSubmit={form.onSubmit(({mobile_number}) => {

                    setLoading(true)
                    // inn case of discount pass it here.
                    createOrder(cartState, {user_id: session?.user.id, mobile_number: mobile_number,
                        store_id: cartState[0].store_id}).then(value => {
                            if (value === null) {
                                showNotification({
                                    title: "Order Status",
                                    message: "Failed to create order"
                                })
                            } else {
                                showNotification({
                                    title: "Order Status",
                                    message: "Your order has been sent. We will contact you soon. Karibu tena."
                                })
                                dispatch(setCartState([]))
                            }
                            setLoading(false)
                        }
                    )

                })} style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <Group>
                        <PhoneInput
                            {...form.getInputProps("mobile_number")}
                            sx={theme => ({
                                fontFamily: "Poppins",
                            })}
                            defaultCountry={"TZ"}
                            inputComponent={Input}
                            py={"xl"}
                            size={"lg"}
                            international
                            countries={["TZ"]}
                            countryCallingCodeEditable={false}
                            required
                            label={"Enter a reachable mobile number. "}
                            placeholder={"mobile number"}
                            disabled={!(cartState.length > 0)}
                        />
                    </Group>
                    <Group p={"xl"}>
                        <Button
                            loading={loading}
                            disabled={!(cartState.length > 0)}
                            variant={theme.colorScheme === "dark" ? "light" : "outline"} type={"submit"} fullWidth
                            size={"lg"}>Complete Order</Button>
                    </Group>
                </form>
            </Card>
        </>
    );
}

Checkout.getLayout = function getLayout(page: ReactElement) {
    return (
        <DefaultLayout hideFilters
                       title={"Checkout"}>
            {page}
        </DefaultLayout>
    )
}


export default Checkout;