import React, {ReactElement, useState} from 'react';
import {useForm} from "@mantine/form";
import Head from "next/head";
import AuthNotification from "../../components/auth/AuthNotification";
import {
    Button, Container, Group,
    PasswordInput, Title
} from "@mantine/core";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {useRouter} from "next/router";
import { BareLayout } from '../../components/layouts/BareLayout';
import {GetServerSidePropsContext} from "next";
import {getSessionData} from "../../lib/supabase";

const ResetPassword = () => {

    const [error, setError] = useState<string | undefined>(undefined)
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const supabase = useSupabaseClient()
    const router = useRouter()

    const form = useForm({
        initialValues: {
            password: '',
            repeat_password: ''
        },
        validate: {
            repeat_password: (value, values) => (value === values.password ? null : 'Password and Confirm password must much.'),
        },
    })

    if (success)
        return (
            <>
                <Head>
                    <title>Password reset</title>
                </Head>

                <Container sx={(theme) => ({
                    maxWidth: theme.breakpoints.xs
                })}>
                <AuthNotification message={'You can now login using your new password.'}
                                  title={"Password reset was successful"} error={false}/>

                <Button my={"xl"} type={"button"} onClick={() => {
                    router.push("/account").then()
                }}>
                    Proceed to your account.
                </Button>
                </Container>
            </>
        )

    return (
        <>
            <Head>
                <title>Password reset</title>
            </Head>

            <Container sx={(theme) => ({
                maxWidth: theme.breakpoints.xs
            })}>

                <Title py={"md"} order={2}>
                    Password recovery
                </Title>

                {error ?
                    <AuthNotification message={error}
                                      title={"Reporting an Error"} error={true}/> : <></>
                }

                <form onSubmit={form.onSubmit((values) => {
                    setLoading(true)
                    supabase.auth.updateUser({
                        password: values.password
                    })
                        .then(({data, error}) => {
                            if (error !== null) {
                                // set error state
                                setError(error.message)
                            }
                            if (data.user != null) {
                                console.log(data)
                                // notify success
                                setSuccess(true)
                            }
                            setLoading(false)
                        })
                })}>

                    <PasswordInput
                        withAsterisk
                        label="New Password"
                        placeholder=""
                        {...form.getInputProps('password')}
                        mb={'sm'}
                        required
                    />

                    <PasswordInput
                        withAsterisk
                        label="Confirm New Password"
                        placeholder=""
                        {...form.getInputProps('repeat_password')}
                        required
                    />

                    <Group position="right" mt="md">
                        <Button loading={loading} type="submit">reset password.</Button>
                    </Group>
                </form>
            </Container>
        </>
    );
};

ResetPassword.getLayout = function getLayout(page: ReactElement) {
    return (
        <BareLayout pageTitle={"Activity"}>
            {page}
        </BareLayout>
    )
}

export default ResetPassword;