import React, {ReactElement} from 'react';
import {
    Group,
    Box
} from "@mantine/core";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {BareLayout} from "../components/layouts/BareLayout";
import Login from '../components/auth/Login';
import DefaultLayout from "../components/layouts/DefaultLayout";


function LoginPage() {

    const supabase = useSupabaseClient()

    return (
        <>
            <Group position="center" sx={{minHeight: "90vh"}}>
                <Box>
                    <Login />
                </Box>
            </Group>
        </>
    );
}

LoginPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <DefaultLayout title={"Login"} description={"Login to your tiririka account"}>
            {page}
        </DefaultLayout>
    )
}

export default LoginPage;