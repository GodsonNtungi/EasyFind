import React, {useState} from 'react';
import {TextInput, Card, Box, PasswordInput, Button, Group, Anchor} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import AuthNotification from "./AuthNotification";
import {showNotification} from "@mantine/notifications";
import Link from "next/link";

function SignUp() {

    const supabase = useSupabaseClient()
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
            repeat_password: ''
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            repeat_password: (value, values) => (value === values.password ? null : 'Password and Confirm password must much.'),
        },
    })

    if(success)
        return <AuthNotification message={'We sent you an email account to verify your account.'}
                           title={"Sign Up success"} error={false}/>

    return (

        <Box>
            <Card p={"xl"} withBorder shadow={"sm"}>

            <form onSubmit={form.onSubmit((values) => {
                setLoading(true)
                supabase.auth.signUp({
                    email: values.email,
                    password: values.password
                })
                    .then(({data, error}) => {
                        if (error !== null) {
                            // set error state
                            showNotification({
                                title: "Auth Notification",
                                message: error.message
                            })
                        }
                        if (data.user != null ) {
                            // console.log(data)
                            // notify success
                            setSuccess(true)
                        }
                        setLoading(false)
                    })
            })}>

                <TextInput
                    withAsterisk
                    label="Email"
                    placeholder="your@email.com"
                    {...form.getInputProps('email')}
                    mb={'sm'}
                    required
                    size={"lg"}
                    variant={"filled"}
                    type={'email'}
                />

                <PasswordInput
                    withAsterisk
                    label="Password"
                    size={"lg"}
                    variant={"filled"}
                    {...form.getInputProps('password')}
                    mb={'sm'}
                    required
                />

                <PasswordInput
                    withAsterisk
                    label="Confirm Password"
                    size={"lg"}
                    variant={"filled"}
                    placeholder=""
                    {...form.getInputProps('repeat_password')}
                    required
                />

                <Group position="center" my="xl">
                    <Button fullWidth loading={loading} size={"lg"} radius={"xl"} type="submit">sign up</Button>
                </Group>

                <Group position={"center"} mb={"xl"}>
                    <Anchor component={Link} href={"/login"}>
                        Have an account? Login here.
                    </Anchor>
                </Group>
            </form>
            </Card>
        </Box>
    );
}

export default SignUp;