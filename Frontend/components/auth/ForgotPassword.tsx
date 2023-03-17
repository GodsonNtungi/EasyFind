import React, {useState} from 'react';
import {Box, Card, Group, Button, TextInput, Anchor} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import AuthNotification from "./AuthNotification";
import {showNotification} from "@mantine/notifications";
import Link from "next/link";

function ForgotPassword() {

    const supabase = useSupabaseClient()
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const p_reset_path = `${window.location.protocol}//${window.location.host}/account/reset_password`

    // console.log(p_reset_path)

    const form = useForm({
        initialValues: {
            email: '',
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    })

    if (success)
        return (
            <Box>
                <AuthNotification message={'We sent you an email with a link to reset your password.'}
                                  title={"Email Sent"} error={false}/>
                <Group position={"center"} my={50}>
                    <Anchor component={Link} href={"/login"}>
                        Go to login.
                    </Anchor>
                </Group>
            </Box>

        )


    return (
        <Box>
            <Card p={"xl"} withBorder shadow={"sm"}>
                <form onSubmit={form.onSubmit((values) => {
                    setLoading(true)
                    supabase.auth.resetPasswordForEmail(values.email, {
                        redirectTo: p_reset_path,
                    })
                        .then(({data, error}) => {
                            if (error !== null) {
                                // set error state
                                showNotification({
                                    title: "Auth Notification",
                                    message: error.message
                                })
                            }
                            if (data != null) {
                                // notify success
                                setSuccess(true)
                            }
                            setLoading(false)
                        })
                })}>
                    <TextInput
                        withAsterisk
                        label="Your Email Address"
                        placeholder="your@email.com"
                        {...form.getInputProps('email')}
                        mb={'sm'}
                        type={'email'}
                        size={"lg"}
                        variant={"filled"}
                    />

                    <Group position="center" my="xl">
                        <Button loading={loading} fullWidth size={"lg"} radius={"xl"} type="submit">Send Reset Password
                            Instructions</Button>
                    </Group>

                    <Group position={"center"} mb={"xl"}>
                        <Anchor component={Link} href={"/login"}>
                            Go to login.
                        </Anchor>
                    </Group>

                </form>
            </Card>
        </Box>
    )
}

export default ForgotPassword;