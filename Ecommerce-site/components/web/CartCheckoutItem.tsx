import React from 'react';
import {
    Group,
    Paper,
    Avatar,
    ActionIcon,
    NumberInput,
    Text,
    useMantineTheme,
} from "@mantine/core";
import {useForm} from "@mantine/form";
import {CartItem, removeItem, editItem} from "../../store/cartSlice";
import {useAppDispatch} from "../../store/store";
import {IconShoppingCartX, IconX} from "@tabler/icons";
import {definitions} from "../../types/database";

const CartCheckoutItem = ({item}: { item: CartItem }) => {

    const dispatch = useAppDispatch()
    const theme = useMantineTheme();

    const form = useForm({
        initialValues: {
            count: 1
        }
    })

    return (
        <Paper mt={"sm"} withBorder p={"xs"}
               style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Avatar src={item.image}/>
            <Text sx={{fontFamily: "Poppins"}} weight={600} size={'sm'} px={"sm"} style={{flexGrow: 1}} align={"left"}
                  color={"gray.7"} lineClamp={1}>
                {item.name}
            </Text>
            <Group style={{display: 'flex', justifyContent:"center", alignItems:"center"}}>
                <Text sx={{fontFamily: "Poppins"}}>qty:</Text>
                <Text sx={{fontFamily: "Poppins"}} weight={600}> {item.count}</Text>
            </Group>

        </Paper>
    );
};

export default CartCheckoutItem;

