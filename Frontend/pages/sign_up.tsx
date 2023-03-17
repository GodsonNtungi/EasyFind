import React, {ReactElement} from 'react';
import {
    Group,
    Box
} from "@mantine/core";
import {BareLayout} from "../components/layouts/BareLayout";
import SignUp from "../components/auth/SignUp";
import DefaultLayout from "../components/layouts/DefaultLayout";


function SignUpPage() {

    return (
        <>
            <Group position="center" sx={{minHeight: "90vh"}}>
                <Box>
                    <SignUp />
                </Box>
            </Group>
        </>
    );
}

SignUpPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <DefaultLayout title={"Sign Up"} description={"Sign Up for a free tiririka account."}>
            {page}
        </DefaultLayout>
    )
}

export default SignUpPage;