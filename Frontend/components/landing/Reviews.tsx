import React from 'react';
import {Box, Center, Container, Group, Image, Title, useMantineTheme} from "@mantine/core";

function Reviews() {

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
                    <Center>
                        <Group position={"center"}>
                            <Title size={"h1"}> What our users say</Title>
                        </Group>
                    </Center>
                </Container>

            </Box>

        </Box>
    );
}

export default Reviews;