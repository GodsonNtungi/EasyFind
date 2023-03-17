import React, {ReactElement} from 'react';
import DefaultLayout from "../components/layout/Default";
import Home from "./index";
import Hero from "../components/web/Hero";
import {Box, Text, Group} from "@mantine/core"
import {getBusinessProfile} from "./api/products";
import {definitions} from "../types/database";


export async function getServerSideProps() {

    const {data} = await getBusinessProfile()
    const businessProfile: definitions['profiles'] = data[0]

    return {
        props: {
            businessProfile
        }
    }
}

function AboutUs({businessProfile}: {businessProfile: definitions["profiles"]}) {
    return (
        <Box>
            <Hero image={businessProfile?.avatar_url}  title={"about us"}  />
            <Group py={"xl"} position={"left"}>
                <Text sx={{fontFamily: "Poppins"}}> some description ... </Text>
            </Group>
        </Box>
    );
}

AboutUs.getLayout = function getLayout(page: ReactElement) {
    return (
        <DefaultLayout businessProfile={page.props?.businessProfile} hideFilters title={"About Us"} description={"About " + page.props?.businessProfile?.username + ". See our vision, our story and goals" }>
            {page}
        </DefaultLayout>
    )
}

export default AboutUs;