import React, {useRef, useState} from 'react';
import {
    Group,
    Paper,
    Box,
    Divider,
    ActionIcon,
    NumberInput,
    Text,
    useMantineTheme,
    NumberInputHandlers,
} from "@mantine/core";
import {useForm} from "@mantine/form";
import {CartItem, removeItem, editItem} from "../../store/authSlice";
import {useAppDispatch} from "../../store/store";
import {IconMinus, IconPlus, IconX} from "@tabler/icons";
import {definitions} from "../../types/database";
import StyledCurrencyFormat from "./StyledCurrencyFormat";


const CartItem = ({item, currentData}: { item: CartItem, currentData: definitions['items'][] }) => {

    // helpers
    const dispatch = useAppDispatch()
    const theme = useMantineTheme();

    // item number state
    const [countValue, setCountValue] = useState(item.count);
    const handlers = useRef<NumberInputHandlers>();

    const findProduct = (id: number) => {
        return currentData?.find(x => x.id === id)
    }

    const form = useForm({
        initialValues: {
            count: 1
        }
    })

    return (
        <>
            <Paper
                style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <ActionIcon variant={'subtle'} size={48} onClick={() => {
                    dispatch(removeItem(item))
                }} title="remove product">
                    <IconX size={24} color={theme.colors.gray[5]}/>
                </ActionIcon>

                <Box sx={{width: "100%"}}>
                    <Group position={"apart"} py={"sm"} px={"sm"} grow>
                        <StyledCurrencyFormat value={item.price}/>
                    </Group>
                    <Text size={'sm'} transform={"capitalize"} sx={{fontFamily: "Poppins"}} px={"sm"} style={{flexGrow: 1}} align={"left"}
                          weight={700} lineClamp={1}>
                        {item.name}
                    </Text>

                    <Group p={"sm"}>
                        <ActionIcon<'button'>
                            size={28}
                            variant="transparent"
                            onClick={() => handlers.current?.decrement()}
                            disabled={countValue === 1}
                            onMouseDown={(event) => event.preventDefault()}
                        >
                            <IconMinus size={16} stroke={1.5}/>
                        </ActionIcon>

                        <NumberInput
                            hideControls
                            size={"xs"}
                            value={countValue}
                            onChange={(val) => {
                                if (val) setCountValue(val);
                                const {count, ...i} = item
                                dispatch(editItem({...i, count: val}))
                            }}
                            onKeyUp={(e) => {
                                setCountValue(Number(e.currentTarget.value));
                                const {count, ...i} = item
                                dispatch(editItem({...i, count: Number(e.currentTarget.value)}))
                            }}
                            handlersRef={handlers}
                            max={10}
                            min={0}
                            variant="unstyled"
                            step={1}
                            styles={{input: {width: 22, textAlign: 'center'}}}
                        />
                        <Text size={"xs"}>
                            out of
                        </Text>

                        <Text size={"xs"}>
                            {findProduct(item.id)?.count}
                        </Text>

                        <ActionIcon<'button'>
                            size={28}
                            variant="transparent"
                            onClick={() => handlers.current?.increment()}
                            disabled={countValue === findProduct(item.id)?.count}
                            onMouseDown={(event) => event.preventDefault()}
                        >
                            <IconPlus size={16} stroke={1.5}/>
                        </ActionIcon>

                    </Group>

                </Box>

            </Paper>
            <Divider/>
        </>
    );
};

export default CartItem;

