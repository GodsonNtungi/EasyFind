/**
 * StoreBadge component
 * - Top dropdown menu
 * - shows current store
 * - show options in the dropdown
 *      - logout
 *      - change profile
 *      - current logged in profile details.
 */

import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {useAppDispatch, useAppSelector} from "../../store/store";
import {setCurrentProfile, setCurrentStore} from "../../store/authSlice";
import {
    Menu,
    Button,
    Text,
    Loader,
    UnstyledButton, Group, Avatar
} from "@mantine/core";
import {
    IconBuildingStore,
    IconCaretDown,
    IconChevronRight,
    IconLogout,
    IconUser
} from "@tabler/icons";
import {useRouter} from "next/router";
import {deleteCookie} from "cookies-next";
import {definitions} from "../../types/database";
import {getImageUrl} from "../../lib/storage";


export default function StoreBadge({businessProfile}:{businessProfile?: definitions['profiles']}) {

    // helpers
    const dispatch = useAppDispatch()
    const supabase = useSupabaseClient()
    const route = useRouter()

    // get current store from state.
    const currentStore = useAppSelector(state => state.auth.currentStore)

    // get current profile from state.
    const currentProfile = useAppSelector(s => s.auth.profile)

    // decides profile label
    const ProfileBadge = () => {
        if (currentProfile.owner) {
            return (
                <>
                    <Text>Admin</Text>
                </>
            )
        }

        if (currentProfile.employee) {
            return (
                <>
                <Text>employee</Text>
                <Text>{currentProfile.employee.name}</Text>
                </>
            )
        }

        // This should never happen
        // means no profiles and redirections failed.
        return <Text>a bug</Text>
    }

    return (
        <>
            {/* The dropdown menu. */}
            <Menu shadow="md" width={200} styles={{
                dropdown: {
                    zIndex: 1
                }
            }}>
                <Menu.Target>
                    <UnstyledButton>
                        <Group>
                            <Avatar size={35} src={getImageUrl(supabase, businessProfile?.avatar_url?businessProfile.avatar_url:"")} alt={"business avatar"} radius="xl" >
                                <IconBuildingStore />
                            </Avatar>

                            <div style={{ flex: 1 }}>
                                <Text size="sm" weight={500}>
                                    {currentStore?.name}
                                </Text>

                                <Text color="dimmed" size="xs">
                                    {currentStore?.description}
                                </Text>
                            </div>
                            <IconChevronRight size={14} stroke={1.5} />
                        </Group>
                    </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item>
                        <ProfileBadge />
                    </Menu.Item>
                    <Menu.Item component={'button'} onClick={() => {
                        dispatch(setCurrentProfile({
                            owner: undefined,
                            employee: undefined
                        }))
                        deleteCookie('store_profile');
                        deleteCookie('store_profile_id');

                        route.push("/account").then()
                    }} icon={<IconUser size={14} />}>
                        Change Profile
                    </Menu.Item>
                    <Menu.Item component={'button'} onClick={() => {
                        supabase.auth.signOut().then()
                    }} icon={<IconLogout size={14} />}>
                        Logout
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </>
    )
}