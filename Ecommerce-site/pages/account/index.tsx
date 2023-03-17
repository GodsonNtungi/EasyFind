import React, {ReactElement} from 'react';
import AccountLayout from "../../components/layout/Account";
import {getBusinessProfile, getProductsCategories} from "../api/products";
import {definitions} from "../../types/database";

function AccountHome(props) {
    return (
        <>
            Your orders
        </>
    );
}

export async function getServerSideProps() {

    const {categories} = await getProductsCategories()
    const {data} = await getBusinessProfile()
    const businessProfile = data[0]

    return {
        props: {
            categories,
            businessProfile
        }
    }
}

AccountHome.getLayout = function getLayout(page: ReactElement) {
    return (
        <AccountLayout categories={page.props.categories} businessProfile={page.props.businessProfile} title={"Account Home"} description={"Account Home" }>
            {page}
        </AccountLayout>
    )
}

export default AccountHome;