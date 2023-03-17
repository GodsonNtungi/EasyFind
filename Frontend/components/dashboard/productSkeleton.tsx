import {
    Card,
    Group,
    Kbd,
    Center,
    SimpleGrid,
    Skeleton,
    Text,
    Image,
    Badge,
    Menu,
    ActionIcon,
    Paper, Box
} from '@mantine/core';
import {addItem} from "../../store/authSlice";
import {getImageUrl} from "../../lib/storage";
import supabase from "../../lib/supabase";
import {IconDotsVertical, IconEdit, IconHash, IconInfoCircle, IconPencil} from "@tabler/icons";

export default function ProductSkeleton() {

    const SKItem = () => {
        return <>
                <Card m={5} shadow={"xs"}>
                    <Card.Section style={{display: 'flex', alignItems: 'center',}}>
                        <Image
                            alt={''}
                            src={""}
                            height={65}
                            width={65}
                            withPlaceholder
                            placeholder={<Text weight={500} transform={"uppercase"}>
                                <Skeleton width={20} />
                            </Text>}
                        />
                        <Box style={{
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: "left", width: '100%'
                        }} >
                            <Group p={"xs"}
                                   style={{
                                       display: 'flex',
                                       flexDirection: "column-reverse",
                                       width: '100%',
                                       justifyContent: 'left',
                                       alignItems: 'start'
                                   }}>
                                <Text sx={{fontFamily: "Poppins"}} align={'start'} lineClamp={1} size={'sm'} weight={500}>
                                    <Skeleton width={100} height={15} />
                                </Text>
                                <Skeleton width={60} height={15} />
                            </Group>
                        </Box>

                        <Box px={"md"} style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>

                            <Skeleton width={20} height={20} mb={"xs"} />
                            <Skeleton width={20} height={20} />
                        </Box>

                    </Card.Section>
                </Card>
        </>

    }

    return (
        <>
            <SimpleGrid
                spacing={0}
                breakpoints={[
                    {maxWidth: 'xs', cols: 1},
                    {minWidth: 'sm', cols: 2},
                    {minWidth: 'md', cols: 4},
                ]}
            >
                <SKItem/>
                <SKItem/>
                <SKItem/>
                <SKItem/>
                <SKItem/>
                <SKItem/>
                <SKItem/>
            </SimpleGrid>
        </>
    );
}

