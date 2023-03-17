import React, {useEffect, useState} from 'react';
import {
    Center,
    Card,
    Button,
    Box,
    Group,
    Text,
    Title,
} from "@mantine/core";
import {IconShoppingCart, IconBuildingStore, IconLogout} from "@tabler/icons";
import LoginPrompt, {innerLogin} from "./LoginPrompt";
import {openModal} from "@mantine/modals";
import {useSession, useSupabaseClient} from "@supabase/auth-helpers-react";


const openPinModal = ({path, profile}: { profile: string, path: string }) => openModal({
    title: "Login",
    centered: true,
    children: (
        <>
            <LoginPrompt profile={profile} path={path}/>
        </>
    )
})

const toNext = [
    {
        name: "Stock",
        action: () => {
            openPinModal({path: "/account/stock", profile: "stock"})
        },
        icon: <IconBuildingStore size={48} stroke={1.5}/>,
    },
    {
        name: "POS",
        action: () => {
            openPinModal({path: "/account/pos", profile: "pos"})
        },
        icon: <IconShoppingCart size={48} stroke={1.5}/>,
    }
]


function ActivitySelection() {

    // helpers
    const supabase = useSupabaseClient()

    return (
        <Center sx={{minHeight: "80vh"}}>
            <Box>

                <Title style={{width: "100%", fontFamily: "Poppins"}} py={"xl"} align={"center"} order={1}
                       weight={400}>Where to next ?</Title>

                <Group style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "start",
                    width: "100%"
                }}>

                    {toNext.map((item, index) => (
                        <Group key={index} style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <Card withBorder radius={"sm"} sx={theme => ({
                                width: "sm",
                            })}>
                                <Card.Section onClick={() => {
                                    item.action()
                                }} p={"xl"} sx={(theme) => ({
                                    display: "flex",
                                    cursor: "pointer",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: theme.colors.accent
                                })}>
                                    {item.icon}
                                </Card.Section>
                            </Card>
                            <Text sx={{fontFamily: "Poppins"}} transform={"uppercase"} size={"md"} align={"center"}
                                  weight={600}>
                                {item.name}
                            </Text>
                        </Group>
                    ))}

                </Group>

                <Group position={"center"} mt={50}>
                    <Button variant={"default"} onClick={() => {
                        supabase.auth.signOut().then()
                    }} rightIcon={<IconLogout size={14}/>}>
                        Logout
                    </Button>
                </Group>

            </Box>


        </Center>
    );

}

export default ActivitySelection;

