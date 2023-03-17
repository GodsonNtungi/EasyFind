import {
    Badge,
    Box,
    Button,
    Card,
    Center,
    Grid,
    Group,
    Anchor,
    Image,
    Text,
    Title,
    useMantineTheme,
    SimpleGrid,
    Kbd
} from '@mantine/core';
import React, {useRef} from 'react';
import {Carousel} from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import {IconArrowRight} from "@tabler/icons";

interface DiscountProduct {
    name: string;
    image: string;
    description: string;
}

const DiscountedProducts = ({products}: { products: DiscountProduct[] }) => {
    const theme = useMantineTheme()
    const autoplay = useRef(Autoplay({ delay: 10000, jump: true }));

    return (
        <Carousel plugins={[autoplay.current]}
                  onMouseEnter={autoplay.current.stop}
                  onMouseLeave={autoplay.current.reset}
                  sx={{ mainWidth: "100%" }}
                  mx="auto" loop
                  withIndicators speed={15}>
            {products.map((product, index) => (
                <Carousel.Slide key={index}>
                <SimpleGrid breakpoints={[
                    {minWidth: "sm", cols: 2, spacing: "sm"}
                ]} px={"xl"} py={42} bg={"white"}>
                    <Image alt={"product image"} width={300} src={product.image}/>
                    <Group position={"left"}>
                        <Box opacity={.6}>
                            <Title weight={700} size={"xxx-large"} align={"left"} lineClamp={2} order={2}>{product.name}</Title>
                            <Text weight={400} size={"sm"} align={"left"}>{product.description}</Text>
                            <Anchor py={"sm"} color={"dark"} sx={{display: "flex", alignItems: "Center"}} weight={400} align={"left"}>
                                <Text pr={"sm"} weight={400}>GET DISCOUNT </Text>
                                <IconArrowRight size={14} />
                            </Anchor>
                        </Box>
                    </Group>
                </SimpleGrid>
                </Carousel.Slide>
            ))}
        </Carousel>
    )
}


const CountDownProducts = () => (
    <Card>
        <Card.Section sx={{display: "flex", flexDirection: "column", justifyContent: "Center", alignItems: "center"}}>
            <Image alt={"product image"} width={200} src={"/img/shop/pr-7.png"} />
            <Text opacity={.6} mt={0} size={"xl"} weight={500}>Product 1</Text>
            <Text size={"xl"} opacity={.6} weight={500}>2300 Tsh</Text>
            <Group grow opacity={.6} p={"xl"}>
                <Box>
                    <Center>
                        <Text weight={500} size={36}>0</Text>
                    </Center>
                    <Text size={"xs"}>days</Text>
                </Box>
                <Box>
                    <Center>
                        <Text weight={500} size={36}>0</Text>
                    </Center>
                    <Text size={"xs"}>Hours</Text>
                </Box>
                <Box>
                    <Center>
                        <Text weight={500} size={36}>0</Text>
                    </Center>
                    <Text size={"xs"}>min</Text>
                </Box>
            </Group>
        </Card.Section>
    </Card>
)

function Discount() {
    return (
        <Box>
            <Grid p={"xl"} sx={{
                display: "flex",
                width: "100%"
            }}>
                <Grid.Col sm={"auto"} md={8}>
                    <DiscountedProducts products={discounted_products_data}/>
                </Grid.Col>
                <Grid.Col sm={"auto"} md={4}>
                    <CountDownProducts/>
                </Grid.Col>
            </Grid>
        </Box>
    );
}

export default Discount;


const discounted_products_data = [
    {
        name: "Discount 50%",
        image: "/img/shop/pr-7.png",
        description: "simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled"
    },
    {
        name: "Discount 20%",
        image: "/img/shop/pr-8.png",
        description: "simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown"
    },
]