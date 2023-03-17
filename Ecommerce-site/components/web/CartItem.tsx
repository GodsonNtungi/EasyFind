import React, {useRef, useState} from 'react';
import {Group, Paper, Badge, Divider, Avatar, ActionIcon, NumberInput, Text, useMantineTheme, Kbd, Image, NumberInputHandlers} from "@mantine/core";
import {useForm} from "@mantine/form";
import {CartItem, removeItem, editItem} from "../../store/cartSlice";
import {useAppDispatch} from "../../store/store";
import {IconShoppingCartX, IconX} from "@tabler/icons";
import {definitions} from "../../types/database";

const CartItem = ({item}: { item: CartItem}) => {

    const dispatch = useAppDispatch()
    const theme = useMantineTheme();
    const [value, setValue] = useState(item.count);
    const handlers = useRef<NumberInputHandlers>();

    const form = useForm({
        initialValues: {
            count: 1
        }
    })

    return (
        <Paper mt={"sm"} p={"xs"}
               style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <ActionIcon mr={"sm"} variant={'subtle'} onClick={() => {
                dispatch(removeItem(item))
            }} title="remove product" size="sm">
                <IconX size={18} color={theme.colors.gray[5]}/>
            </ActionIcon>
            <Avatar src={item.image} />
            <Text sx={{fontFamily: "Poppins"}} weight={600} size={'sm'} px={"sm"} style={{flexGrow: 1}} align={"left"} color={"gray.7"} lineClamp={1}>
                {item.name}
            </Text>
            <Group style={{display: 'inline-flex'}}>

                <Group spacing={5}>
                    <ActionIcon size={24} variant="default" onClick={() => handlers.current.decrement()}>
                        –
                    </ActionIcon>

                    <NumberInput
                        hideControls
                        value={value}
                        handlersRef={handlers}
                        max={100}
                        min={1}
                        step={1}
                        styles={{ input: { width: 54, textAlign: 'center' } }}
                        variant={'filled'}
                        onKeyUp={(e) => {
                            // console.log(e)
                            const {count, ...i} = item
                            dispatch(editItem({...i, count: Number(e.currentTarget.value)}))
                        }}
                        onChange={(e) => {
                            setValue(e)
                            const {count, ...i} = item
                            dispatch(editItem({...i, count: e}))
                        }}
                        {...form.getInputProps}
                    />

                    <ActionIcon size={24} variant="default" onClick={() => handlers.current.increment()}>
                        +
                    </ActionIcon>
                </Group>
            </Group>
        </Paper>
    );
};

export default CartItem;

