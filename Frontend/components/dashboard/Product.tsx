import {
    Card,
    Image,
    ActionIcon,
    Paper, Button,
    Box,
    Text, Transition,
    Badge,
    Group,
    useMantineTheme, Overlay,
    Modal, Menu, Space, Avatar, createStyles, Tooltip, AspectRatio
} from '@mantine/core';
import {
    IconBasket,
    IconPencil, IconShoppingCartPlus, IconTrash,
} from "@tabler/icons";
import {addItem} from "../../store/authSlice";
import {useAppDispatch} from "../../store/store";
import {definitions} from "../../types/database";
import {useState} from "react";
import EditItemForm from "./EditItemForm";
import supabase from "../../lib/supabase";
import {getImageUrl} from "../../lib/storage";

const useStyles = createStyles(theme => ({
    card: {
        position: "relative",
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        "&:hover": {
            boxShadow: theme.shadows.sm,
            cursor: "pointer",
        }
    },
    selected: {
        backgroundColor:
            theme.colorScheme === 'dark'
                ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
                : theme.colors[theme.primaryColor][0],
    },
}))

export default function Product({product}: { product: definitions['items'] & { item_images: definitions['item_images'][], categories: definitions['categories'] } }) {

    const {classes, cx} = useStyles()
    const dispatch = useAppDispatch()
    const [selected, setSelected] = useState(false);
    const [editModalOpened, setEditModalOpened] = useState(false);
    const [hovered, setHovered] = useState(false)

    const image_url = product.item_images[0]?.image_url ? product.item_images[0]?.image_url : ""
    const image_src = getImageUrl(supabase, image_url)

    return (
        <>
            <Card onMouseOver={() => {
                setHovered(true)
            }} onMouseLeave={() => setHovered(false)} m={5} radius="md" p={0}
                  className={cx(classes.card, {[classes.selected]: selected})}
            >
                <Card.Section sx={{display: "flex", position: 'relative'}}>
                    <Avatar
                        alt={''}
                        src={image_src}
                        size={170}
                        variant={"light"}
                        color="primary"
                    >
                        <IconBasket color={"white"} size={24}/>
                    </Avatar>
                    <Paper p={"sm"} sx={{width: "100%"}}>
                        <Text transform="uppercase" color="dimmed" weight={700} size="xs">
                            {product.categories?.name ? product.categories.name : "ALL"}
                        </Text>
                        <Text transform={"capitalize"} weight={700} lineClamp={1}
                              sx={{lineHeight: 1.2, fontFamily: "Poppins"}} mt="xs"
                              mb="md">
                            {product.name}
                        </Text>
                        <Group noWrap spacing="xs">
                            <Group>
                                <Text size="xs" lineClamp={1}>{product.description}
                                </Text>
                            </Group>
                        </Group>
                        <Group py={"sm"} position={"apart"} sx={{display: "flex", alignItems: "center", width: "100%"}}>
                            <Button onClick={() => {
                                const {count, ...prod} = product;
                                dispatch(addItem({
                                    store_id: product.store_id,
                                    id: product.id, name: product.name, price: product.price, count: 1,
                                    image: image_url
                                }))
                            }} radius={"sm"} color={"accent"} leftIcon={<IconShoppingCartPlus size={24}/>}
                                    variant={"outline"}>
                                Add to cart
                            </Button>
                            <Text size="xs" color="dimmed">
                                {product.count}
                            </Text>
                        </Group>
                    </Paper>
                </Card.Section>


                <Group
                    p={"xs"} sx={theme => ({
                    position: "absolute",
                    top: 0, right: 0,
                    // zIndex: ,
                    display: "flex",
                    // flexDirection: "column"
                })}>
                    <Tooltip
                        label="edit item"
                        color="primary"
                        withArrow
                    >
                        <ActionIcon onClick={() => setEditModalOpened(true)} sx={theme => ({
                            "&:hover": {
                                backgroundColor: theme.colors.primary,
                                color: theme.white
                            }
                        })} radius={"xl"} size={30} color={"primary"} variant={"filled"}>
                            <IconPencil size={16}/>
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip
                        label="delete item"
                        color="red"
                        withArrow
                    >
                        <ActionIcon sx={theme => ({
                            "&:hover": {
                                backgroundColor: theme.colors.red,
                                color: theme.white
                            }
                        })} radius={"xl"} size={28} color={"red"} variant={"filled"}>
                            <IconTrash size={14}/>
                        </ActionIcon>
                    </Tooltip>
                </Group>

            </Card>

            <Modal
                opened={editModalOpened}
                onClose={() => setEditModalOpened(false)}
                title="Edit Item."
                fullScreen
            >
                <EditItemForm
                    product={product}
                    closeModal={() => {
                        setEditModalOpened(false)
                    }}
                />
            </Modal>
        </>
    )
        ;
}

