import React, {useEffect, useState} from 'react';
import {
    Anchor,
    Button,
    Group,
    PasswordInput,
    TextInput, Box,
    Card
} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {showNotification} from "@mantine/notifications";
import {useRouter} from "next/router";
import Link from 'next/link';

function Login() {

    // helpers
    const supabase = useSupabaseClient()
    const router = useRouter()

    // loading state
    const [loading, setLoading] = useState(false)


    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    })

    return (
        <Box>

            <Card p={"xl"} withBorder shadow={"sm"}>
                <form onSubmit={
                    form.onSubmit((values) => {
                        setLoading(true)
                        supabase.auth.signInWithPassword({
                            email: values.email,
                            password: values.password
                        })
                            .then(async ({data, error}) => {
                                if (error !== null) {
                                    // set error state
                                    showNotification({
                                        title: "Authentication Error",
                                        message: error.message,
                                    })
                                    setLoading(false)
                                }
                                if (data.user != null) {
                                    await router.replace("/account")
                                    // notify success
                                    showNotification({
                                        title: "Authentication Info",
                                        message: "Login was Successful",
                                    })
                                    setLoading(false)
                                }
                                // return false to indicate synchronous response
                                return false
                            })
                            .catch(() => {
                                setLoading(false)
                                showNotification({
                                    title: "Error",
                                    message: "An error has occurred, please try again later",
                                })
                            })
                    })
                }>

                    <TextInput
                        withAsterisk
                        required
                        label="Email"
                        placeholder="your@email.com"
                        {...form.getInputProps('email')}
                        mb={'sm'}
                        type={"email"}
                        variant={"filled"}
                        size={"lg"}
                    />

                    <PasswordInput
                        withAsterisk
                        label="Password"
                        placeholder=""
                        required
                        variant={"filled"}
                        size={"lg"}
                        {...form.getInputProps('password')}
                        mb={'sm'}
                    />

                    <Group position="center" my="xl">
                        <Button radius={"xl"} size={"lg"} fullWidth loading={loading} type="submit">login</Button>
                    </Group>

                    <Box>
                        <Group position={"center"} mb={"xl"}>
                            <Anchor component={Link} href={"/forgot_password"}>
                                Forgot password?
                            </Anchor>
                        </Group>
                        <Group position={"center"}>
                            <Anchor component={Link} href={"/sign_up"}>
                                Need an account? SignUp here.
                            </Anchor>
                        </Group>
                    </Box>

                </form>
            </Card>
        </Box>
    )
}

export default Login;