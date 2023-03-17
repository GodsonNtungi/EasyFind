import {useState} from 'react';
import {
    createStyles,
    Table,
    Checkbox,
    ScrollArea,
    Group,
    Avatar,
    Text,
    Tooltip,
    ActionIcon,
    Transition, Modal, Overlay
} from '@mantine/core';
import {definitions} from "../../types/database";
import {getImageUrl} from "../../lib/storage";
import supabase from "../../lib/supabase";
import {IconBasket, IconPencil, IconShoppingCartPlus, IconTrash} from "@tabler/icons";
import {addItem} from "../../store/authSlice";
import EditItemForm from "./EditItemForm";
import {useAppDispatch} from "../../store/store";

const useStyles = createStyles((theme) => ({
    header: {
        position: 'sticky',
        top: 0,
        zIndex: 2,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        transition: 'box-shadow 150ms ease',

        '&::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            borderBottom: `1px solid ${
                theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
            }`,
        },
    },
    scrolled: {
        boxShadow: theme.shadows.sm,
    },
    rowSelected: {
        backgroundColor:
            theme.colorScheme === 'dark'
                ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
                : theme.colors[theme.primaryColor][0],
    },
}));

interface TableSelectionProps {
    data: (definitions['items'] & { item_images: definitions['item_images'][], categories: definitions['categories'] })[];
}

const Row = ({
                 item,
                 selection,
                 callBack
             }: { callBack: Function, selection: string[], item: definitions['items'] & { item_images: definitions['item_images'][], categories: definitions['categories'] } }) => {

    const selected = selection.includes(item.id.toString());
    const image_url = item.item_images[0]?.image_url ? item.item_images[0]?.image_url : ""
    const image_src = getImageUrl(supabase, image_url)
    const [hovered, setHovered] = useState(false)
    const [editModalOpened, setEditModalOpened] = useState(false);

    // helpers
    const {classes, cx} = useStyles();
    const dispatch = useAppDispatch()

    return <>
        <tr style={{position: "relative"}} onMouseOver={() => {
            setHovered(true)
        }} onMouseLeave={() => setHovered(false)} key={item.id} className={cx({[classes.rowSelected]: selected})}>
            {/*{hovered && <Overlay color="gray" zIndex={5} />}*/}
            <td>
                <Checkbox
                    checked={selection.includes(item.id.toString())}
                    onChange={() => callBack(item.id.toString())}
                    transitionDuration={0}
                />
            </td>
            <td>
                <Group spacing="sm">
                    <Avatar size={50} src={image_src} radius={'md'}>
                        <IconBasket size={24}/>
                    </Avatar>
                    <Text transform={"capitalize"} size="sm" weight={500}>
                        {item.name}
                    </Text>
                </Group>
            </td>
            <td>{item.description}</td>
            <td width={45}>{item.count}</td>
            <td width={200}>
                <Group p={"xs"}>
                    <Tooltip
                        label="add to cart"
                        color="accent"
                        withArrow
                    >
                        <ActionIcon sx={theme => ({
                            "&:hover": {
                                backgroundColor: theme.colors.primary,
                                color: theme.white
                            }
                        })} onClick={() => {
                            const {count, ...prod} = item;
                            dispatch(addItem({
                                store_id: item.store_id,
                                id: item.id, name: item.name, price: item.price, count: 1,
                                image: image_url
                            }))
                        }} radius={"xl"} color={"accent"} size={32} variant={"filled"}>
                            <IconShoppingCartPlus size={20}/>
                        </ActionIcon>
                    </Tooltip>

                    <Tooltip
                        label="edit item"
                        color="primary"
                        withArrow
                    >
                        <ActionIcon onClick={() => {
                            setEditModalOpened(true)
                            setHovered(false)
                        }} sx={theme => ({
                            "&:hover": {
                                backgroundColor: theme.colors.primary,
                                color: theme.white
                            }
                        })} radius={"xl"} size={32} color={"primary"} variant={"filled"}>
                            <IconPencil size={20}/>
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
                        })} radius={"xl"} size={32} color={"red"} variant={"filled"}>
                            <IconTrash size={20}/>
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </td>

            <Modal
                opened={editModalOpened}
                onClose={() => setEditModalOpened(false)}
                title="Edit Item."
                fullScreen
            >
                <EditItemForm
                    product={item}
                    closeModal={() => {
                        setEditModalOpened(false)
                    }}
                />
            </Modal>

        </tr>
    </>
}

export function TableSelection({data}: TableSelectionProps) {

    // helpers
    const {classes, cx} = useStyles();

    // states
    const [selection, setSelection] = useState(['1']);
    const [scrolled, setScrolled] = useState(false);

    const toggleRow = (id: string) =>
        setSelection((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        );
    const toggleAll = () =>
        setSelection((current) => (current.length === data.length ? [] : data.map((item) => item.id.toString())));

    const rows = data.map((item, index) => {
        return (
            <Row key={index} selection={selection} item={item} callBack={toggleRow}/>
        );
    });

    return (
        <Table sx={{minWidth: "100%"}} verticalSpacing="sm">
            <thead className={cx(classes.header, {[classes.scrolled]: scrolled})}>
            <tr>
                <th style={{width: 40}}>
                    <Checkbox
                        onChange={toggleAll}
                        checked={selection.length === data.length}
                        indeterminate={selection.length > 0 && selection.length !== data.length}
                        transitionDuration={0}
                    />
                </th>
                <th>Item</th>
                <th>Description</th>
                <th>Count</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>{rows}</tbody>
        </Table>

    );
}