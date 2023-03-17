import {
    createStyles,
    Badge,
    Box,
    Text,
    Group,
    Title,
    SimpleGrid,
    Container,
    ThemeIcon,
    List,
    Timeline, Image, useMantineTheme
} from '@mantine/core';
import {IconMoneybag, IconCertificate, IconCoin, TablerIcon, IconCheck} from '@tabler/icons';
import React from "react";


export function Features() {

    const theme = useMantineTheme()

    return (
        <Box
             sx={{minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center"}}
             id={"about-us"}>
            <Image src={theme.colorScheme === 'dark' ? "/svgs/wave-1-dark.svg" : "/svgs/wave-1.svg"}
                   withPlaceholder alt={"wave-1"}/>
            <Box sx={theme => ({
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            })}>

                <Container py={120}>

                    <Title sx={{fontFamily: "Poppins"}} mb={"xl"} weight={800} size={52}>
                        Your path.
                    </Title>

                    <Timeline active={3} bulletSize={24} lineWidth={3}>
                        {featureData.map((item, index) => (
                            <Timeline.Item key={index} bullet={<IconCheck size={32}/>} title={
                                <Text weight={600} transform={"capitalize"} size={"xl"}>{item.title}</Text>
                            }>
                                <Text sx={{fontFamily: "Poppins"}} color={"dimmed"} size={"xl"}>
                                    {item.description}
                                </Text>
                            </Timeline.Item>
                        ))}

                    </Timeline>

                </Container>
            </Box>
        </Box>

    );
}


const featureData = [
    {
        title: "Inventory manager",
        description: "Manage your inventory and stores."
    },
    {
        title: "Free ecommerce site.",
        description: "Own an e-commerce site right away. Take orders and auction your products online."
    },
    {
        title: "Advertise.",
        description: "Advertise your products on facebook and Instagram without hassle."
    },
]