import Account from "../../components/dashboard/Account";
import {NextPageWithLayout} from "../_app";
import React, {ReactElement, useEffect} from "react";
import {AccountLayout, AccountProps} from "../../components/layouts/AccountLayout";
import {useSetAuthSession} from "../../hooks/authSession";
import {GetServerSidePropsContext} from "next";
import {getSessionData} from "../../lib/supabase";

const Stock: NextPageWithLayout = (props: AccountProps) => {

    // set session data
    useSetAuthSession(props)

    return (
        <>
            <Account/>
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

Stock.getLayout = function getLayout(page: ReactElement) {
    return (
        <AccountLayout>
            {page}
        </AccountLayout>
    )
}

export default Stock
