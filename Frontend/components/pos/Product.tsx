import {
    Card,
    Image,
    ActionIcon,
    Paper,
    Box,
    Text,
    Badge,
    Group,
    useMantineTheme,
    Modal, Menu, Space, Avatar
} from '@mantine/core';
import {
    IconBasket,
    IconPencil,
} from "@tabler/icons";
import {addItem} from "../../store/authSlice";
import {useAppDispatch} from "../../store/store";
import {definitions} from "../../types/database";
import {useState} from "react";
import supabase from "../../lib/supabase";
import {getImageUrl} from "../../lib/storage";

export default function Product({product}: { product: definitions['items'] & { item_images: definitions['item_images'][], categories: definitions['categories'] } }) {

    const theme = useMantineTheme();
    const dispatch = useAppDispatch()

    const image_url = product.item_images[0]?.image_url ? product.item_images[0]?.image_url : ""

    return (
        <>
            <Card m={5} shadow={"xs"}>
                <Card.Section style={{display: 'flex', alignItems: 'center',}}>
                    <Avatar
                        alt={''}
                        src={getImageUrl(supabase, image_url)}
                        size={"xl"}
                        p={4}
                        variant={"light"}
                        radius={"md"}
                        color="primary"
                    >
                        <IconBasket color={"white"} size={24} />
                    </Avatar>
                    <Box style={{
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: "left", width: '100%'
                    }} component="a" onClick={() => {
                        const {count, ...prod} = product;
                        dispatch(addItem({
                            store_id: product.store_id,
                            id: product.id, name: product.name, price: product.price, count: 1,
                            image: image_url
                        }))
                    }}>
                        <Group p={"xs"}
                               style={{
                                   display: 'flex',
                                   flexDirection: "column-reverse",
                                   width: '100%',
                                   justifyContent: 'left',
                                   alignItems: 'start'
                               }}>
                            <Text sx={{fontFamily: "Poppins"}} align={'start'} lineClamp={1} size={'sm'} weight={500}>
                                {product.name}
                            </Text>
                            {product.category ?
                                <Badge size={'xs'} variant="outline"
                                       color={'accent'}>{product.categories.name}</Badge> :
                                <></>
                            }
                        </Group>
                    </Box>

                    <Box px={"md"} style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <ActionIcon>
                            <Text size={"lg"} weight={"500"} color={"gray.6"} style={{fontFamily: "Poppins"}}>{product.count}</Text>
                        </ActionIcon>
                    </Box>

                </Card.Section>
            </Card>
        </>
    );
}

