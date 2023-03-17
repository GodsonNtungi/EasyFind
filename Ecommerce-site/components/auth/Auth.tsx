import React, {useState} from 'react';
import {Card, Box, Group, Paper, Button, useMantineTheme} from "@mantine/core";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import SignUp from "./SignUp";
import {SupabaseClient} from "@supabase/supabase-js";

export enum AuthState {
    LOGIN = 'LOGIN',
    SIGN_UP = 'SIGN_UP',
    FORGOT_PASSWORD = 'FORGOT_PASSWORD'
}


const ShowForm = ({authState}: { authState: AuthState }) => {
    if (authState === AuthState.LOGIN) return <Login/>
    if (authState === AuthState.SIGN_UP) return <SignUp/>
    if (authState === AuthState.FORGOT_PASSWORD) return <ForgotPassword/>
    return <Login/>
}


function Auth({supabaseClient}: { supabaseClient: SupabaseClient }) {

    const [authState, setAuthState] = useState(AuthState.LOGIN)

    return (
        <>
            <Card>
                <Card.Section>
                    <Paper withBorder p={"xl"} sx={(theme) => ({
                        maxWidth: `${theme.breakpoints.xs}px`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    })}>

                        <Box mb={'md'}>

                            <ShowForm authState={authState}/>

                            <Button fullWidth variant={'subtle'} size={'md'}
                                    hidden={authState === AuthState.SIGN_UP || authState === AuthState.FORGOT_PASSWORD}
                                    onClick={() => setAuthState(AuthState.FORGOT_PASSWORD)}>
                                <a>Forgot password?</a>
                            </Button>

                            <Button fullWidth variant={'subtle'} size={'md'} hidden={authState === AuthState.SIGN_UP}
                                    onClick={() => setAuthState(AuthState.SIGN_UP)}>
                                <a>Need an account? SignUp here. </a>
                            </Button>

                            <Button fullWidth variant={'subtle'} size={'md'} hidden={authState === AuthState.LOGIN}
                                    onClick={() => setAuthState(AuthState.LOGIN)}>
                                <a>Have an account? Login here.</a>
                            </Button>
                        </Box>
                    </Paper>
                </Card.Section>
            </Card>

        </>
    );
}

export default Auth;