import React, {ReactElement} from 'react';
import {
    Group,
    Box
} from "@mantine/core";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {BareLayout} from "../components/layouts/BareLayout";
import Login from '../components/auth/Login';
import ForgotPassword from '../components/auth/ForgotPassword';
import DefaultLayout from "../components/layouts/DefaultLayout";


function ForgotPasswordPage() {

    const supabase = useSupabaseClient()

    return (
        <>
            <Group position="center" sx={{minHeight: "90vh"}}>
                <Box>
                    <ForgotPassword />
                </Box>
            </Group>
        </>
    );
}

ForgotPasswordPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <DefaultLayout title={"Login"} description={"Forgot password page."}>
            {page}
        </DefaultLayout>
    )
}

export default ForgotPasswordPage;