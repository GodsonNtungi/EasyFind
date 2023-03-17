import React from 'react';
import {
    Box,
    Container,
    Text,
    Button,
    Group,
    Anchor,
    SimpleGrid,
    Divider,
    Title,
    TextInput,
    useMantineColorScheme, Image
} from "@mantine/core"
import data from "../../utils/data";
import {ActionIcon} from "@mantine/core";
import {
    IconBrandFacebook,
    IconBrandLinkedin,
    IconBrandTiktok,
    IconBrandTwitter,
    IconBrandYoutube,
    IconYoga
} from "@tabler/icons";
import {definitions} from "../../types/database";

function Footer({businessProfile}: { businessProfile: definitions['profiles'] }) {

    const {colorScheme, toggleColorScheme} = useMantineColorScheme();

    return (
        <>
            <Divider my={"xl"} color={colorScheme !== 'dark' ? "primary" : "gray.8"}/>
            <Box pt={0}>
                <Container py={"xl"} size={"lg"}>
                    <Group>

                        <Box mb={"md"}>
                            <Text mb={"sm"} size={"lg"} color={'gray.7'} sx={{fontFamily: "Outfit"}}>Find Us on social
                                media.</Text>
                            <Divider py={"xs"} color={"gray.5"} size={"md"} sx={{width: "50px"}}/>
                            <Group>
                                <ActionIcon variant={"filled"} size={42}>
                                    <IconBrandLinkedin/>
                                </ActionIcon>
                                <ActionIcon variant={"filled"} size={42}>
                                    <IconBrandFacebook/>
                                </ActionIcon>
                                <ActionIcon variant={"filled"} size={42}>
                                    <IconBrandYoutube/>
                                </ActionIcon>
                                <ActionIcon variant={"filled"} size={42}>
                                    <IconBrandTiktok/>
                                </ActionIcon>
                            </Group>
                        </Box>
                    </Group>

                    <Group py={"xl"} bg={colorScheme !== 'dark' ? "white" : "gray.8"} pt={"xl"} position={"apart"}>
                        <Text sx={{fontFamily: "Outfit"}} size={"lg"}>
                            © {businessProfile?.username} 2022. All Rights Reserved.
                        </Text>
                        <Anchor href={"/privacy-policy"}>
                            <Text sx={{fontFamily: "Outfit"}} size={"md"}>Privacy Policy</Text>
                        </Anchor>
                        <Anchor href={"/terms-of-service"}>
                            <Text sx={{fontFamily: "Outfit"}} size={"md"}>Terms of Service</Text>
                        </Anchor>
                    </Group>

                    <Group p={"xl"} position={"center"}>
                        <Image pt={"xl"} width={"120px"} src={colorScheme==='light'?"/brand/tiririka-long.svg":"/brand/tiririka-long-white.svg"}/>
                    </Group>

                </Container>

            </Box>
        </>
    );
}

export default Footer;

