import React, {ReactElement} from "react";
import ActivitySelection from "../../components/auth/ActivitySelection";
import {GetServerSidePropsContext} from "next";
import {Loader, Center} from "@mantine/core"
import {BareLayout} from '../../components/layouts/BareLayout';
import AccountSetup from "../../components/auth/AccountSetup";
import {AccountProps} from "../../components/layouts/AccountLayout";
import {getSessionData} from "../../lib/supabase";
import {useSetAuthSession} from "../../hooks/authSession";


const AccountHome = (props: AccountProps) => {

    // helpers
    const loading = useSetAuthSession(props)

    // setup account.
    if (props.accountNeedsSetUp) {
        return (
            <>
                <AccountSetup/>
            </>
        )
    }

    if (props.store_profile === null || props.store_profile_id === null)
        // account is already setup go to activity selection.
        return (
            <>
                <ActivitySelection/>
            </>
        )

    return (
        <Center sx={{height: "100vh"}}>
            <Loader/>
        </Center>
    )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {

    return {
        props: {
            ...(await getSessionData(ctx))
        }
    }
}

AccountHome.getLayout = function getLayout(page: ReactElement) {
    return (
        <BareLayout pageTitle={"Activity"}>
            {page}
        </BareLayout>
    )
}

export default AccountHome
