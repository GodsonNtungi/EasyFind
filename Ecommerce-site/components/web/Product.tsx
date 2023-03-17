import React from 'react';
import {
    Badge,
    Box, Avatar,
    Button, Anchor,
    Card,
    createStyles, ActionIcon,
    Image,
    Group,
    Text,
    Title,
    useMantineTheme,
    useMantineColorScheme, Rating, Space
} from "@mantine/core"
import {IconArrowUpRight, IconBasket, IconBookmark, IconShoppingCart, IconShoppingCartPlus} from "@tabler/icons";
import {NextLink} from "@mantine/next";
import {definitions} from "../../types/database";
import {useAppDispatch} from "../../store/store";
import {addItem} from "../../store/cartSlice";
import * as CurrencyFormat from 'react-currency-format';


const useStyles = createStyles({
    prod: {
        cursor: "pointer",
        "&:hover": {
            // boxShadow: "0 1px 13px rgb(0, 0, 0, 15%)"
        },
    },
    controls: {
        display: "none"
    }
})

function Product({product}: { product: definitions['items'] & { item_images: definitions['item_images'][], categories: definitions['categories'] } }) {
    const theme = useMantineTheme()
    const {classes, cx} = useStyles()
    const dispatch = useAppDispatch()
    const {colorScheme} = useMantineColorScheme()

    const image_url = product.item_images[0]?.image_url ? product.item_images[0]?.image_url : ""

    return (
        <Card bg={"inherit"} radius={"lg"} shadow={"xs"} className={classes.prod}>
            <Card.Section px={"sm"}>
                <Text my={"sm"} lineClamp={1} color={"gray.7"} weight={500} align={"left"}>{product.description}</Text>
            </Card.Section>
            <Card.Section component={NextLink} href={`/shop/${product.id}`}>
                <Avatar alt={"product image"} radius={"md"} sx={{width: "100%", height: 250}} src={image_url}>
                    <IconBasket size={24}/>
                </Avatar>
            </Card.Section>
            <Card.Section px={"sm"}>
                <Box py={"sm"} sx={{zIndex: 1}}>
                    <Title color={colorScheme === "dark" ? "gray.0" : "gray.9"} size={"inherit"}
                           align={"left"} lineClamp={1}
                           order={2} sx={{fontFamily: "Poppins", zIndex: 1}}>{product.name}</Title>
                    <Group py={"sm"}>
                        <Rating value={3.5} fractions={2} readOnly/>
                        <small style={{fontFamily: "Outfit"}}>(27)</small>
                    </Group>
                    <CurrencyFormat value={product.price} displayType={'text'} thousandSeparator={true}
                                    prefix={'TZS '} renderText={value => (
                        <Text sx={{fontFamily: "Outfit"}} size={24} weight={400}
                              opacity={1}> {value} </Text>
                    )}/>
                    <CurrencyFormat value={product.price} displayType={'text'} thousandSeparator={true}
                                    prefix={'TZS '} renderText={value => (
                        <Text sx={{fontFamily: "Outfit", textDecoration: "line-through"}} size={17} weight={400}
                              opacity={1}> {value} </Text>
                    )}/>
                </Box>
                <Box py={"sm"} sx={{width: "100%"}}>
                    <Group position={"apart"}>
                        <Button size={"sm"} radius={"md"} component={NextLink} href={"#"} variant={"outline"} color={"accent"}>
                            BUY NOW!
                        </Button>
                        <ActionIcon size={"lg"} title={"save"} variant={"default"} radius={"md"} color={"primary"}>
                            <IconBookmark size={24} />
                        </ActionIcon>
                    </Group>
                    <Space pb={"sm"} />
                    <Button fullWidth radius={"md"} onClick={() => {
                        dispatch(addItem({
                            store_id: product.store_id,
                            id: product.id, name: product.name, price: product.price, count: 1, image: image_url
                        }))
                    }} size={"md"} variant={"filled"} color={"primary.6 "} leftIcon={<IconShoppingCartPlus size={24}/>}>
                        <Text> Add to cart </Text>
                    </Button>
                </Box>
            </Card.Section>
        </Card>
    );
}

export default Product;