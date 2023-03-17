import React, {useEffect, useState} from 'react';
import {Button, Group, Paper, PasswordInput, TextInput, Title} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import AuthNotification from "./AuthNotification";
import Head from "next/head";
import {useAppDispatch} from "../../store/store";
import {showNotification} from "@mantine/notifications";

function Login() {

    const supabase = useSupabaseClient()
    const [error, setError] = useState<string | undefined>(undefined)
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const dispatch = useAppDispatch()


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
        <Paper>
            <Head>
                <title>Login</title>
            </Head>
            {error ?
                <AuthNotification message={error}
                                  title={"Reporting an Error"} error={true}/> : <></>
            }
            <form onSubmit={form.onSubmit((values) => {
                setLoading(true)
                supabase.auth.signInWithPassword({
                    email: values.email,
                    password: values.password
                })
                    .then(({data, error}) => {
                        if (error !== null) {
                            // set error state
                            showNotification({
                                title: "Authentication Error",
                                message: error.message,
                            })
                        }
                        if (data.user != null ) {
                            // notify success
                            showNotification({
                                title: "Authentication Info",
                                message: "Login was Successful",
                            })

                            supabase.from("stores")
                                .select("*, profiles(*)")
                                .eq("profiles.user_id", data.user.id)
                                .then(({data, error}) => {
                                    if (error) {
                                        console.log(error)
                                    }
                                    // console.log(data)
                                    // set states
                                    if ((data !== null) && (data.length > 0)) {
                                        const {profiles, ...store} = data[0]
                                    }
                                })

                        }
                        setLoading(false)
                    })
            })}>

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
            </form>
        </Paper>
    )
}

export default Login;