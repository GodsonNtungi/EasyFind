import React, {ReactElement} from 'react';
import POSLayout from '../../../components/layouts/POSLayout';
import PosIndex from "../../../components/pos/PosIndex";
import {GetServerSidePropsContext} from "next";
import {getSessionData} from "../../../lib/supabase";
import {AccountProps} from "../../../components/layouts/AccountLayout";
import {useSetAuthSession} from "../../../hooks/authSession";

function Index(props: AccountProps) {
    useSetAuthSession(props)
    return (
        <div>
            <PosIndex />
        </div>
    );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {

    return {
        props: {
            ...(await getSessionData(ctx))
        }
    }
}

Index.getLayout = function getLayout(page: ReactElement) {
    return (
        <POSLayout>
            {page}
        </POSLayout>
    )
}

export default Index;

