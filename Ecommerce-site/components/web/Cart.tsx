import React, {useState} from 'react';
import CartItemComponent from "./CartItem";
import {
    ActionIcon,
    Center,
    Divider,
    Box,
    Paper,
    Text,
    Button,
    Group,
    Title, Notification, Aside, ScrollArea, useMantineTheme, Select, Table
} from "@mantine/core";
import {useAppDispatch, useAppSelector} from "../../store/store";
import {
    IconTrash,
    IconX
} from "@tabler/icons";
import {useSession} from "@supabase/auth-helpers-react";
import {setCartOpened, setCartState} from "../../store/cartSlice";
import * as CurrencyFormat from 'react-currency-format';
import {useRouter} from "next/router";

const Cart = () => {
    const session = useSession()
    const theme = useMantineTheme()
    const cartState = useAppSelector(state => state.cart.cartState)
    const [cartErrors, setCartErrors] = useState<string[]>([])
    const router = useRouter()
    // products in or out methods

    const dispatch = useAppDispatch()

    return (
        <Paper
            style={{height: "100%", backgroundColor: 'inherit'}}>
            <Group p={5} position={'apart'} style={{display: 'flex', alignItems: 'center'}}>
                <Title sx={{fontFamily: "Poppins"}} p={5} weight={400} order={6}>Cart (<span>{cartState?.length}</span>)</Title>
                <Group>
                    <CurrencyFormat value={cartState.reduce((a, b) => a + b.price, 0)} displayType={'text'} thousandSeparator={true}
                                    prefix={'TZS'} renderText={value => (
                        <Text sx={{fontFamily: "Poppins"}} size={"md"} weight={400} opacity={.6}> {value} </Text>
                    )}/>
                    <ActionIcon variant={'subtle'} color={'red'} title={'clear cart'} onClick={() => {
                        dispatch(setCartState([]))
                    }} disabled={cartState.length == 0}>
                        <IconTrash size={20}/>
                    </ActionIcon>
                </Group>
            </Group>
            <Divider/>

            <Notification hidden={cartErrors.length === 0} onClose={() => {
                setCartErrors([]);
            }} icon={<IconX size={18}/>} color="red">
                {cartErrors.map((e, index) => <p key={index}><small>{e}</small></p>)}
            </Notification>

            <Aside.Section grow component={ScrollArea} px="-xs">
                {/* scrollable content here */}
                <Box mb={5} style={{overflowX: 'hidden', height: '100%', overflowY: 'hidden', background: 'inherit'}}>
                    {
                        cartState.length == 0 ?
                            <Center><Text weight={'lighter'} p={'md'}>add products!</Text></Center> :
                            cartState.map((item, index) => (
                                <CartItemComponent key={item.id} item={item}/>
                            ))
                    }
                </Box>
            </Aside.Section>
            <Aside.Section>
                {/*<Divider/>*/}
                <Group grow p={"sm"}>
                    <Button onClick={()=>{
                        router.push("/shop/checkout").then();
                        dispatch(setCartOpened(false))
                    }} fullWidth disabled={cartState.length === 0} size={"lg"} variant={"outline"}>
                        <Text sx={{fontFamily: "Poppins"}} weight={700} transform={"uppercase"}> Checkout </Text>
                    </Button>
                </Group>
            </Aside.Section>
        </Paper>
    );
};

export default Cart;