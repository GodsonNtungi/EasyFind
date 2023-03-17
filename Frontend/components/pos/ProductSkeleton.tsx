import {
    Card,
    Group,
    SimpleGrid,
    Skeleton,
    Paper, Image, Text, Box
} from '@mantine/core';

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

                </Card.Section>
            </Card>
        </>

    }

    return (
        <>
            <SimpleGrid
                breakpoints={[
                    {maxWidth: 'xs', cols: 1},
                    {minWidth: 'sm', cols: 2},
                    {minWidth: 'md', cols: 3},
                    {minWidth: 'lg', cols: 4},
                    {minWidth: 'xl', cols: 5},
                ]}
            >
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

