import {
    Container,
    Center, Title, Group
} from '@mantine/core';
import React from 'react';

function Customers() {
    return (
        <Container py={120}
                   sx={{minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center"}}
                   id={"about-us"}>

            <Center>
                <Group position={"center"}>
                    <Title size={"h1"}> +1</Title>
                    <Title size={"h1"}>customers</Title>
                </Group>
            </Center>

        </Container>
    );
}

export default Customers;