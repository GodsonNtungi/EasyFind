import React, {useState} from 'react';
import {Paper, Group, Button, TextInput, Title} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import AuthNotification from "./AuthNotification";
import {useRouter} from "next/router";

function ForgotPassword() {

    const supabase = useSupabaseClient()
    const [error, setError] = useState<string | undefined>(undefined)
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const p_reset_path = `${window.location.protocol}//${window.location.host}/account/reset_password`

    const form = useForm({
        initialValues: {
            email: '',
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    })

    if(success)
        return <AuthNotification message={'We sent you an email with a link to reset your password.'}
                                 title={"Email Sent"} error={false}/>


    return (
        <Paper>
            {error ?
                <AuthNotification message={error}
                                  title={"Reporting an Error"} error={true}/> : <></>
            }
            <form onSubmit={form.onSubmit((values) => {
                setLoading(true)
                supabase.auth.resetPasswordForEmail(values.email, {
                    redirectTo: p_reset_path,
                })
                    .then(({data, error}) => {
                        if (error !== null) {
                            // set error state
                            setError(error.message)
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
                    <Button loading={loading} fullWidth size={"lg"} radius={"xl"} type="submit">Send Reset Password Instructions</Button>
                </Group>

            </form>
        </Paper>
    )
}

export default ForgotPassword;