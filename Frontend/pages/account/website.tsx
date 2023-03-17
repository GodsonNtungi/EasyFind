import React, {ReactElement, useEffect, useRef, useState} from 'react';
import {useForm} from "@mantine/form";
import {definitions} from "../../types/database";
import {
    ActionIcon,
    Button,
    Container,
    CopyButton, Divider, Text,
    Box,
    Group,
    SimpleGrid,
    Space,
    Textarea,
    TextInput,
    Title, Tooltip,
    useMantineTheme
} from "@mantine/core";
import {
    useEditWebsiteMutation,
    useAddWebsiteMutation, useAddProfileMutation, useGetWebsiteQuery, useGetUserProfileQuery
} from "../../services/store";
import {useRouter} from "next/router";
import {useSession, useSupabaseClient} from "@supabase/auth-helpers-react";
import {createRepoWorkFlowDispatch, encrypt} from "../../lib/ghapi";
import {IconArrowUpRight, IconCheck, IconCopy, IconDeviceFloppy} from "@tabler/icons";
import {showNotification} from "@mantine/notifications";
import {openInNewTab} from "../../lib/utils";
import {useAppSelector} from "../../store/store";
import {AccountLayout, AccountProps} from '../../components/layouts/AccountLayout';
import {GetServerSidePropsContext} from "next";
import {getSessionData} from "../../lib/supabase";
import {useSetAuthSession} from "../../hooks/authSession";


interface WebMetadataInterface {
    metadata?: {
        description?: string,
        about_us?: string,
        address?: string
    }
}

type Initials = definitions["websites"] & WebMetadataInterface

const FormComponent = ({initials, action, website_id, loading, profile}: {
    profile: definitions["profiles"],
    loading: boolean,
    action: Function,
    website_id: number,
    initials?: Initials
}) => {

    // console.log(initials)

    const form = useForm({
        initialValues: initials
    })

    return <>
        <form onSubmit={form.onSubmit((async values => {
            const {...site} = values
            site.profile_id = profile?.id
            site.id = website_id
            action(site, !website_id)
            if (site.fqdn !== undefined) {
                if (profile?.secret !== undefined) {
                    await createRepoWorkFlowDispatch(
                        `main`,
                        site.fqdn.replaceAll(".", "_"),
                        site.fqdn,
                        profile?.secret
                    )
                    showNotification({
                        title: "Info",
                        message: "e-commerce site updating ... It will take a few minutes. "
                    })
                } else {
                    showNotification({title: "Error", message: "Failed to update site. "})
                }
            } else {
                showNotification({title: "Error", message: "Failed to update site. "})
            }
        }))}>

            <Group p={"xl"} sx={{
                position: "sticky", top: 60, zIndex: 1,
            }} position="right" mt="md">
                {initials?.fqdn ?
                    <Button onClick={() => {
                        openInNewTab(`https://${initials?.fqdn}`)
                    }} radius={"xl"} variant={"default"} rightIcon={<IconArrowUpRight/>} size={"md"}
                            type="button"> view
                    </Button> :
                    <></>
                }
                <Button radius={"xl"} variant={"filled"} rightIcon={<IconDeviceFloppy/>} size={"md"} loading={loading}
                        type="submit">save
                </Button>
            </Group>

            <TextInput
                {...form.getInputProps("fqdn")}
                label={'Website url (FQDN)'}
                placeholder={"example.com"}
                description={"Do not end in a slash."}
                withAsteric
                variant={"filled"}
                size={"lg"}
            />
            <Space p={"lg"}/>

            <Title weight={400} color={'gray.6'} order={3}> Metadata </Title>

            <Textarea
                {...form.getInputProps("metadata.description")}
                label={'Description'}
                description={"A short description about your business"}
                variant={"filled"}
                size={"lg"}
            />

            <Textarea
                {...form.getInputProps("metadata.about_us")}
                label={'About Us'}
                description={"Detailed description about your business"}
                variant={"filled"}
                size={"lg"}
            />

            <TextInput
                {...form.getInputProps("metadata.address")}
                label={'Address'}
                description={"Your business address"}
                variant={"filled"}
                size={"lg"}
            />

        </form>
    </>
}

function ConfigurationForm(props: { action: Function, loading: boolean, profile: definitions['profiles'] }) {

    const {website, isFetching, error} = useGetWebsiteQuery({profile_id: props.profile?.id}, {
        selectFromResult: ({data, isFetching, error}) => {
            // console.log(data)
            return ({
                website: data ? data[0] : {} as definitions["websites"],
                error: error,
                isFetching: isFetching
            })
        }
    })
    const initialValues = {} as Initials
    initialValues.metadata = {}

    // @ts-ignore
    return <>
        {isFetching ?
            <> <Text> loading ... </Text></>
            : <>
                {/*@ts-ignore*/}
                <FormComponent profile={props.profile} initials={website ? website : initialValues}
                               action={props.action} website_id={website?.id}
                               loading={props.loading || isFetching}/>
            </>
        }
    </>
}

function Website(props: AccountProps) {

    // set session
    const loading = useSetAuthSession(props)

    const [editWebsite, editResults] = useEditWebsiteMutation()
    const [addWebsite, addResults] = useAddWebsiteMutation()
    const router = useRouter()
    const session = useSession()
    let protocol = useRef("http")
    let host = useRef("localhost")

    useEffect(() => {
        protocol.current = window?.location.protocol
        host.current = window?.location.host
    }, [])

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

    const currentStore = useAppSelector( x => x.auth.currentStore)

    const websiteAction = (payload: any, create: boolean) => {
        if ( create ) {
            addWebsite(payload)
        } else {
            editWebsite(payload)
        }
    }


    return (
        <Container py={"xl"}>

            <Title sx={{fontFamily: "Poppins"}} color={'gray.6'} order={2}> Configure e-commerce site </Title>
            <Space p={"lg"}/>

            <ConfigurationForm loading={editResults.isLoading || addResults.isLoading} action={(v: any, c: boolean) => {
                websiteAction(v, c)
            }} profile={profile}/>

            <Divider my={"xl"}/>

            <Title sx={{fontFamily: "Poppins"}} color={'gray.6'} order={2}> Metadata </Title>
            <Space p={"lg"}/>

            <Box>
                <TextInput
                    value={profile?.secret}
                    label={'Business Secret'}
                    variant={"filled"}
                    size={"lg"}
                    readOnly
                    rightSection={
                        <CopyButton value={profile?.secret ? profile?.secret : ""} timeout={2000}>
                            {({copied, copy}) => (
                                <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                                    <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                                        {copied ? <IconCheck size={18}/> : <IconCopy size={18}/>}
                                    </ActionIcon>
                                </Tooltip>
                            )}
                        </CopyButton>
                    }
                />

                <TextInput
                    value={currentStore?.secret}
                    label={'Store Secret'}
                    variant={"filled"}
                    size={"lg"}
                    readOnly
                    rightSection={
                        <CopyButton value={currentStore?.secret ? currentStore?.secret : ""} timeout={2000}>
                            {({copied, copy}) => (
                                <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                                    <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                                        {copied ? <IconCheck size={18}/> : <IconCopy size={18}/>}
                                    </ActionIcon>
                                </Tooltip>
                            )}
                        </CopyButton>
                    }
                />

                <TextInput
                    label={'Products Feed Url'}
                    variant={"filled"}
                    size={"lg"}
                    value={`${protocol.current}//${host.current}/products_feed?key=${profile?.secret}`}
                    readOnly
                    rightSection={
                        <CopyButton
                            value={`${protocol.current}//${host.current}/products_feed?key=${profile?.secret}`}
                            timeout={2000}>
                            {({copied, copy}) => (
                                <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                                    <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                                        {copied ? <IconCheck size={18}/> : <IconCopy size={18}/>}
                                    </ActionIcon>
                                </Tooltip>
                            )}
                        </CopyButton>
                    }
                />

            </Box>

        </Container>
    );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {

    return {
        props: {
            ...(await getSessionData(ctx))
        }
    }
}

Website.getLayout = function getLayout(page: ReactElement) {
    return (
        <AccountLayout>
            {page}
        </AccountLayout>
    )
}

export default Website;