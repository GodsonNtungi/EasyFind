import {
    Image,
    Container,
    Title, SimpleGrid,
    Button,
    Group,
    Text,
    Box, useMantineTheme,
} from '@mantine/core';
import {IconArrowRight, IconCertificate, IconCoin, IconMoneybag, IconPhoneCall, TablerIcon} from '@tabler/icons';
import {useRouter} from "next/router";
import {Features} from "./Features";
import React from "react";
import {node} from "prop-types";

export function Hero() {
    const router = useRouter()
    const theme = useMantineTheme()
    const items = featuresData.map((item) => <Feature {...item} key={item.title}/>);

    return (
        <Box id="home" sx={{minHeight: "80vh", display: "flex", alignItems: "center"}}>
            <Container sx={theme => ({
                [theme.fn.largerThan("sm")]:{
                    paddingTop: 80,
                    paddingBottom: 80
                }
            })}>
                <Group>
                    <Image sx={theme => ({
                        [theme.fn.smallerThan("sm")]: {
                            display: 'none',
                        }
                    })} src={theme.colorScheme === 'dark' ? "/svgs/hero-title-white.svg" : "/svgs/hero-title.svg"}
                           withPlaceholder alt={"atomatiki robot"}/>
                    <Box sx={theme => ({
                        lineHeight: 1.4, fontFamily: "Poppins",
                        [theme.fn.largerThan("sm")]: {
                            display: 'none',
                        }
                    })}>

                        <Title sx={theme => ({
                            fontFamily: "Poppins",
                            [theme.fn.smallerThan("sm")]: {
                                fontSize: 42,
                            }
                        })} weight={800} align={"center"} size={42}>
                            All your business needs.
                        </Title>
                        <Text color={"accent"} align={"center"} sx={{lineHeight: 1, fontFamily: "Poppins"}} weight={800} size={32}>
                            One platform.
                        </Text>
                    </Box>

                </Group>

                <SimpleGrid cols={3} mt={30} breakpoints={[{maxWidth: 'sm', cols: 1}]} spacing={50}>
                    {items}
                </SimpleGrid>

                <Group mt={30}>
                    <Button onClick={() => {
                        router.push("/account").then()
                    }} radius="xl" size={"lg"}>
                        Get started
                    </Button>
                    <Button rightIcon={<IconPhoneCall/>} onClick={() => {
                        router.push("/#contact-us").then()
                    }} radius="xl" variant={"default"} size={"lg"}>
                        Contact Us
                    </Button>
                </Group>
            </Container>
        </Box>
    );
}


interface FeatureProps extends React.ComponentPropsWithoutRef<'div'> {
    icon: TablerIcon;
    title: string;
    description: string;
}

function Feature({icon: Icon, title, description, className, ...others}: FeatureProps) {
    return (
        <>
            <Box sx={theme => ({
                [theme.fn.smallerThan("sm")]: {
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center"
                }
            })}>
                <Group sx={theme => ({
                    [theme.fn.smallerThan("sm")]: {
                        padding: theme.spacing.sm
                    }
                })}>
                    <Icon size={38} stroke={1.5}/>
                </Group>
                <Box>
                    <Text weight={700} size="lg" mb="xs" mt={5}>
                        {title}
                    </Text>
                    <Text color="dimmed" size="sm">
                        {description}
                    </Text>
                </Box>
            </Box>
        </>
    );
}


const featuresData = [
    {
        icon: IconMoneybag,
        title: 'No subscription fee',
        description:
            "Pay only for the services we provide now, not for the services we'll provide int the feature."
    },
    {
        icon: IconCertificate,
        title: 'Easy to use',
        description:
            'This solution is built with simplicity in mind. User experience has been taken seriously.',
    },
    {
        icon: IconCoin,
        title: 'Very Affordable Pricing',
        description:
            'The price compared to the service, is close to paying nothing at all',
    },
];