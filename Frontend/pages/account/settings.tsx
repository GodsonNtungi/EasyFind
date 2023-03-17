import {useSession} from '@supabase/auth-helpers-react'
import {
    Divider,
    SimpleGrid,
    NumberInput,
    Space,
    Box,
    Paper,
    Group,
    CopyButton,
    ActionIcon,
    Button,
    Container,
    Text,
    TextInput,
    FileInput,
    Image,
    useMantineTheme,
    Tooltip
} from "@mantine/core";
import {NextPageWithLayout} from "../_app";
import React, {ReactElement, useEffect, useRef, useState} from "react";
import {useForm} from "@mantine/form";
import {getImageUrl, updateProductPic} from "../../lib/storage";
import supabase, {getSessionData} from "../../lib/supabase";
import {useEditUserProfileMutation, useGetUserProfileQuery} from "../../services/store";
import {IconArrowUpRight, IconCheck, IconCopy, IconFileImport, IconLock} from "@tabler/icons";
import {definitions} from "../../types/database";
import {useRouter} from "next/router";
import {AccountLayout, AccountProps} from "../../components/layouts/AccountLayout";
import {GetServerSidePropsContext} from "next";
import {useSetAuthSession} from "../../hooks/authSession";


const SettingsForm = ({profile, user_id}: { profile: definitions["profiles"], user_id: string | undefined }) => {
    const theme = useMantineTheme()
    const [editProfile, editResults] = useEditUserProfileMutation()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const settingsInitialValues = {} as definitions['profiles'] & { image: any }

    let protocol = useRef("http")
    let host = useRef("localhost")

    useEffect(() => {
        protocol.current = window?.location.protocol
        host.current = window?.location.host
    }, [])

    useEffect(() => {
        settingsInitialValues.username = profile.username
        settingsInitialValues.avatar_url = profile.avatar_url
        settingsInitialValues.user_id = profile.user_id
        settingsInitialValues.image = undefined
        settingsInitialValues.pin = profile.pin
        settingsInitialValues.secret = profile.secret
        form.setValues(settingsInitialValues)
    }, [profile])

    const form = useForm({
        initialValues: settingsInitialValues,
    })

    return (
        <Container py={"xl"}>
            <SimpleGrid breakpoints={[
                {minWidth: "xs", cols: 1, spacing: "xs"},
                {minWidth: "sm", cols: 2, spacing: "xl"},
            ]} p={5} style={{
                maxWidth: theme.breakpoints.sm
            }}>
                <Box>

                    <form style={{maxWidth: theme.breakpoints.sm}} onSubmit={form.onSubmit((v) => {
                        console.log(v)
                        const {image, ...prof} = v
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
                                    editProfile(prof)
                                })
                        } else {
                            editProfile(prof)
                        }
                    })}>

                        <Paper mb={"xl"} shadow={"md"} p={"xl"} radius={"md"} sx={{overflow: "hidden"}}>
                            <Image
                                alt={''}
                                radius={'md'}
                                src={getImageUrl(supabase, profile?.avatar_url ? profile?.avatar_url : "")}
                                height={theme.breakpoints.xs / 2}
                                width={"100%"}
                                withPlaceholder
                            />
                            <Group grow>
                                <FileInput
                                    style={{}}
                                    accept="image/*"
                                    capture
                                    label={settingsInitialValues.avatar_url ? "Change Business Logo" : "Upload Business Logo"}
                                    {...form.getInputProps('image')}
                                    placeholder={form.values.avatar_url ? form.values.avatar_url : "No logo"}
                                    icon={<IconFileImport size={14}/>}
                                    variant={"filled"}
                                    size={"lg"}
                                    mt={"xl"}
                                />
                            </Group>
                        </Paper>

                        <TextInput
                            {...form.getInputProps("username")}
                            label={'business name'}
                            required
                            withAsteric
                            variant={"filled"}
                            size={"lg"}
                        />

                        <NumberInput
                            hideControls
                            variant={"filled"}
                            size={"lg"}
                            placeholder="0000"
                            error={error}
                            {...form.getInputProps('pin')}
                            icon={<IconLock size={16}/>}
                            withAsterisk
                            label={"Account PIN"}
                            maxLength={4}
                        />

                        <Space p={"xl"}/>

                        <Group position="right" mt="md">
                            <Button variant={"filled"} size={"lg"} loading={loading || editResults.isLoading}
                                    type="submit">save changes</Button>
                        </Group>
                    </form>
                </Box>
                <Box>
                    <TextInput
                        {...form.getInputProps("secret")}
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
                        label={'Products Feed Url'}
                        variant={"filled"}
                        size={"lg"}
                        value={`${protocol.current}//${host.current}/products_feed?key=${profile.secret}`}
                        readOnly
                        rightSection={
                            <CopyButton
                                value={`${protocol.current}//${host.current}/products_feed?key=${profile.secret}`}
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

                    <Divider my={"xl"}/>
                    <Text my={"xl"} mb={"sm"} size={"xl"} weight={400} color={'gray.5'}>More Settings</Text>
                    <Button
                        variant={"outline"}
                        size={"lg"}
                        fullWidth
                        onClick={() => {
                            router.push("/account/reset_password").then()
                        }} rightIcon={<IconArrowUpRight size={16}/>}>
                        change account password
                    </Button>

                </Box>
            </SimpleGrid>
        </Container>
    )
}

const Settings: NextPageWithLayout = (props: AccountProps) => {

    // set session data
    useSetAuthSession(props)
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

    return (
        <>
            <SettingsForm profile={profile !== undefined ? profile : {} as definitions['profiles']}
                          user_id={session?.user.id}/>
        </>
    )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {

    return {
        props: {
            ...(await getSessionData(ctx))
        }
    }
}


Settings.getLayout = function getLayout(page: ReactElement) {
    return (
        <AccountLayout>
            {page}
        </AccountLayout>
    )
}

export default Settings