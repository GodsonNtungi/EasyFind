import React, {useEffect, useState} from 'react';
import {
    IconUserCheck,
    IconMailOpened,
    IconShieldCheck,
    IconCircleCheck,
    IconLock,
    IconArrowRight,
    IconFileImport
} from '@tabler/icons';
import {
    ActionIcon,
    Button,
    Container,
    FileInput,
    Group,
    Header, Image, NumberInput,
    Stepper,
    TextInput,
    Title,
    useMantineTheme
} from '@mantine/core';
import Head from "next/head";
import {useForm} from "@mantine/form";
import {updateProductPic} from "../../lib/storage";
import supabase from "../../lib/supabase";
import {
    useAddProfileMutation,
    useAddStoreMutation,
    useEditStoreMutation,
    useEditUserProfileMutation, useGetAllUserStoresQuery, useGetUserProfileQuery
} from "../../services/store";
import Employees from "../../pages/account/employees";
import {useSession, useSupabaseClient} from "@supabase/auth-helpers-react";
import {definitions} from "../../types/database";
import {setCurrentStore} from "../../store/authSlice";
import {useAppDispatch, useAppSelector} from "../../store/store";
import {useRouter} from "next/router";
import Link from 'next/link';


const BusinessAccountForm = ({next, profile}: {profile: definitions['profiles'], next: Function}) => {

    const theme = useMantineTheme()
    const [loading, setLoading] = useState(false)
    const [editProfile, editResults] = useEditUserProfileMutation()
    const [addProfile, addResults] = useAddProfileMutation()
    const supabase = useSupabaseClient()
    const session = useSession()

    const checkEditProfile = async (prof: Partial<definitions["profiles"]>) => {
        // check if profile exists
        let {data: checking_profiles, error} = await supabase
            .from('profiles')
            .select("*")
            // Filters
            .eq('user_id', session?.user.id)

        if (error) return error

        if ( checking_profiles?.length === 0) {
            // NO? create one!
            addProfile(prof)
        } else {
            // YES? edit it.
            editProfile(prof)
        }
    }

    const form = useForm({
        initialValues: {
            username: profile?.username?profile?.username:"",
            avatar_url: profile?.avatar_url?profile?.avatar_url:"",
            user_id: session?.user.id?session?.user.id:"",
            image: undefined,
            pin: profile?.pin?profile?.pin:Math.floor(Math.random() * 999) + 1000,
        },
        validate: {
            pin: (value) => {
                console.log(value)
                return isNaN(Number(value))? "Pin must be numbers.": null
            }
        }
    })

    useEffect(() => {
        if (profile === {}  as definitions["profiles"]) {

        } else {
            form.setValues({
                username: profile?.username,
                avatar_url: profile?.avatar_url,
                pin: profile?.pin
            })
        }
    }, [profile])

    return (
        <>
            <Group grow position={'center'}>

                <form style={{maxWidth: theme.breakpoints.sm}} onSubmit={form.onSubmit((v) => {
                    // console.log(v)
                    const {image, ...prof} = v
                    setLoading(true)
                    if (image !== undefined) {
                        setLoading(true)
                        updateProductPic(supabase, prof.username ? prof.username : "", image)
                            .then(({data, error}: { data: any, error: any }) => {
                                if (data) prof.avatar_url = data.path || undefined
                                if (error) {
                                    console.error(error)
                                }
                                setLoading(false)
                            })
                            .finally(() => {
                                // console.log(prod)
                                checkEditProfile(prof).then((error) => {
                                    if (error) {
                                        console.log(error)
                                    } else {
                                        next()
                                    }
                                    setLoading(false)
                                })
                            })
                    } else {
                        checkEditProfile(prof).then((error) => {
                            if (error) {
                                console.log(error)
                            } else {
                                next()
                            }
                            setLoading(false)
                        })
                    }
                })}>

                    <FileInput
                        style={{}}
                        accept="image/*"
                        capture
                        size={"lg"}
                        {...form.getInputProps('image')}
                        label={"upload business logo"}
                        placeholder={form.values.avatar_url}
                        icon={<IconFileImport size={14}/>}/>

                    <TextInput
                        {...form.getInputProps("username")}
                        label={'business name'}
                        required
                        size={"lg"}
                    />

                    <NumberInput
                        hideControls
                        placeholder="0000"
                        icon={<IconLock size={16}/>}
                        variant={"filled"}
                        {...form.getInputProps("pin")}
                        withAsterisk
                        size={"lg"}
                        label={"Account PIN"}
                        maxLength={4}
                        style={{
                            width: "100%"
                        }}
                        description={"Remember this PIN, You will need it to login into your management console."}
                    />

                    <Group position="right" mt="md">
                        <Button loading={loading || editResults.isLoading || addResults.isLoading} type="submit">save changes</Button>
                    </Group>
                </form>
            </Group>
        </>
    )
}


const StoreSetup = ({next, profile}: {profile: definitions['profiles'],next: Function}) => {
    const [loading, setLoading] = useState(false)
    const theme = useMantineTheme()
    const [addStore, addResults] = useAddStoreMutation()
    const [editStore, editResults] = useEditStoreMutation()

    const form = useForm({
        initialValues: {
            name: "default store",
            is_default: true,
            profile_id: profile?.id
        }
    })

    const checkEditStore = async (store: Partial<definitions["stores"]>) => {
        // check if store exists
        let {data: checking_default_store, error: checking_default_store_error} = await supabase
            .from('stores')
            .select("*")

            // Filters
            .eq('profile_id', profile?.id)
            .eq('is_default', true)
            .single()

        // console.log(checking_default_store)

        if (checking_default_store_error !== null) {
            addStore(store)
            return
        } else {
            editStore({id: checking_default_store.id, ...store})
        }
        return
    }

    return (
        <Group grow position={'center'}>
            <form style={{maxWidth: theme.breakpoints.sm}} onSubmit={form.onSubmit(values => {
                setLoading(true)
                // console.log(values)
                checkEditStore(values).then(() => {
                    next()
                    setLoading(false)
                })
            })}>
                <TextInput
                    {...form.getInputProps("name")}
                    label={'Store name'}
                    required
                />
                <Group position="right" mt="md">
                    <Button loading={ loading || addResults.isLoading || editResults.isLoading } type="submit">save changes</Button>
                </Group>
            </form>
        </Group>
    )
}

const SetupEmployees = ({profile}:{profile: definitions['profiles']}) => {
    const [loading, setLoading] = useState(false)
    const dispatch = useAppDispatch()
    const router = useRouter()
    const currentStore = useAppSelector(state => state.auth.currentStore)

    const { store } = useGetAllUserStoresQuery({profile_id: profile?.id}, {
        selectFromResult: ({data, isFetching, error}) => {
            // console.log(data)
            return ({
                store: data ? data.filter(x => x.is_default)[0] : {} as definitions["stores"],
                error: error,
                isFetching: isFetching
            })
        }
    })

    useEffect(() => {
        // console.log(store === {} as definitions["stores"])
        if (store === {} as definitions["stores"]) {
            // pass
        } else if (store?.id !== undefined) {
            if (currentStore.id === undefined) {
                dispatch(setCurrentStore(store))
            }
        }
    },[store])

    return (
        <>
            <Employees />
            <Group position="center" p={"xl"} mt="md">
                <Button loading={loading} onClick={() => {
                    setLoading(true)
                    router.replace("/account/stock").then().finally(() => setLoading(false))
                }} size={"md"} rightIcon={<IconArrowRight />} type="button">FINISH</Button>
            </Group>
        </>
    )
}


export default function AccountSetup() {
    const [active, setActive] = useState(1);
    const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));
    const theme = useMantineTheme()
    const session = useSession()

    const {profile} = useGetUserProfileQuery({user_id: session?.user.id}, {
        selectFromResult: ({data, isFetching, error}) => {
            // console.log(data)
            return ({
                profile: data ? data[0] : {} as definitions["profiles"],
                error: error,
                isFetching: isFetching
            })
        }
    })

    // console.log(profile)

    return (
        <Container pb={"xl"}>
            <Head>
                <title>Account Setup</title>
            </Head>
            <Header fixed style={{display: "flex", alignItems: 'center'}} height={""} p={"lg"}>
                <ActionIcon
                    component={Link}
                    href={"/account"}
                    color={"dark"}
                    p={15}
                    mr={15}
                    title="logo"
                >
                    <Image src={"/android-chrome-192x192.png"} width={30} alt={"logo"}/>
                </ActionIcon>
                <Title order={1} transform={"capitalize"} color={theme.primaryColor} size={14} weight={700}>You need to setup your account.</Title>
            </Header>
            <Stepper mt={80} p={"md"} active={active} onStepClick={setActive} breakpoint="sm" completedIcon={<IconCircleCheck />}>
                <Stepper.Step icon={<IconUserCheck size={18} />} allowStepSelect={false} label="Done here" description="Account creation." >
                    You created an account successfully
                </Stepper.Step>
                <Stepper.Step icon={<IconUserCheck size={18} />} allowStepSelect={active > 1} label="Start here" description="Business Information" >
                    <BusinessAccountForm profile={profile} next={nextStep} />
                </Stepper.Step>
                <Stepper.Step icon={<IconMailOpened size={18} />} allowStepSelect={active > 2} label="Important!" description="Store Information." >
                    <StoreSetup profile={profile} next={nextStep} />
                </Stepper.Step>
                <Stepper.Step icon={<IconShieldCheck size={18} />} allowStepSelect={active > 3} label="Finish here!" description="Employees" >
                    <SetupEmployees profile={profile} />
                </Stepper.Step>
            </Stepper>

        </Container>
    );
}