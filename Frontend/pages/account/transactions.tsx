import React, {ReactElement, useState} from 'react';
import {DateRangePicker, DateRangePickerValue} from "@mantine/dates";
import {Box, Container, Paper, Text, ScrollArea, SegmentedControl, Table, Group, Title} from "@mantine/core";
import {useGetAllItemsInQuery, useGetAllTransactionQuery} from "../../services/items";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {useAppSelector} from "../../store/store";
import {openConfirmModal} from "@mantine/modals";
import StyledCurrencyFormat from "../../components/dashboard/StyledCurrencyFormat";
import {AccountLayout, AccountProps} from '../../components/layouts/AccountLayout';
import {GetServerSidePropsContext} from "next";
import {getSessionData} from "../../lib/supabase";
import {useSetAuthSession} from "../../hooks/authSession";


const showTransactionDetails = (type: string, item: any) => openConfirmModal({
    title: "Details",
    children: (
        <Group>
            <Title order={2} size={"h2"} weight={500} sx={{fontFamily: "Poppins"}}>{type}</Title>
            <Table verticalSpacing="xs"
                   striped
                   captionSide="top">
                <caption>summary</caption>
                <tbody>
                <tr>
                    <td>Date</td>
                    <td>
                        <Text lineClamp={1}>
                            {changeToLocalTimezone(item?.created_at ? item?.created_at : "").format('ddd DD MMM YYYY HH:mm a')}
                        </Text>
                    </td>
                </tr>
                <tr>
                    <td>Customer</td>
                    <td>{item.customers?.unique_name ? item.customers?.unique_name : "walk in"}</td>
                </tr>
                <tr>
                    <td>Discount</td>
                    <td>
                        <StyledCurrencyFormat value={item.discount}/>
                    </td>
                </tr>
                <tr>
                    <td>Actor</td>
                    <td>
                        <Text lineClamp={1}>
                            {item.employees?.name ? item.employees?.name : "admin"}
                        </Text>
                    </td>
                </tr>
                </tbody>
            </Table>

            <Group sx={{width: "100%"}} position={"apart"}>
                <Title order={3} size={"h3"} weight={500} sx={{fontFamily: "Poppins"}}>Items</Title>
                <StyledCurrencyFormat value={item.items_out?.reduce((a: any, b: any) => a + b.amount, 0)}/>
            </Group>

            <Table highlightOnHover verticalSpacing="md" withBorder>
                <thead>
                <tr>
                    <th>item</th>
                    <th>count</th>
                    <th>amt</th>
                    <th>actor</th>
                </tr>
                </thead>
                <tbody>
                {item.items_out?.map((item_out: any, index: any) => (
                    <tr key={index}>
                        <td>
                            <Text lineClamp={1}>
                                {item_out.items?.name}
                            </Text>
                        </td>
                        <td>{item_out.count}</td>
                        <td>
                            <StyledCurrencyFormat value={item_out.amount ? item_out.amount : 0}/>
                        </td>
                        <td>
                            <Text lineClamp={1}>
                                {item_out.employees?.name ? item_out.employees?.name : "admin"}
                            </Text>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Group>
    ),
    labels: {confirm: 'Refund', cancel: 'Cancel'},
    onCancel: () => console.log('Cancel'),
    onConfirm: () => console.log('Refunded'),
})


const TransactionsList = ({from, to}: { from: Date | null, to: Date | null }) => {

    const currentStore = useAppSelector(s => s.auth.currentStore)

    const {data, isLoading, error} = useGetAllTransactionQuery({
        from: from ? from.toISOString() : "",
        to: to ? to.toISOString() : "",
        store_id: currentStore?.id
    })

    console.log(data)
    return (
        <>
            <Paper>
                <ScrollArea>
                    <Table highlightOnHover verticalSpacing="md" withBorder>
                        <thead>
                        <tr>
                            <th>date</th>
                            <th>customer</th>
                            <th>payment</th>
                            <th>discount</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data?.map((item, index) => (
                            <tr key={index} style={{cursor: "pointer"}}
                                onClick={() => showTransactionDetails("Transaction", item)}>
                                <td>
                                    <Text lineClamp={1}>
                                        {changeToLocalTimezone(item?.created_at ? item?.created_at : "").format('ddd DD MMM YYYY HH:mm a')}
                                    </Text>
                                </td>
                                <td>{item.customers?.unique_name ? item.customers?.unique_name : "walk in"}</td>
                                <td>{item.payment_method}</td>
                                <td>{item.discount}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </ScrollArea>
            </Paper>
        </>
    )
}

const changeToLocalTimezone = (d: string) => {
    dayjs.extend(utc)
    dayjs.extend(timezone)
    const tz = "Africa/Dar_es_salaam"
    return dayjs(d).tz(tz)
}


function Transactions(props: AccountProps) {

    // set session data
    useSetAuthSession(props)
    let earlyToday = new Date();
    let lateToday = new Date();
    earlyToday.setHours(0, 0, 0, 0);
    lateToday.setHours(24, 0, 0, 0);
    const [dateValue, setDateValue] = useState<DateRangePickerValue>([
        earlyToday,
        lateToday,
    ]);
    const [typeValue, setTypeValue] = useState("items_out")

    return (
        <Box>
            {/*filters*/}
            <Container style={{
                display: "flex",
                justifyContent: "left",
                alignItems: "center",
            }}>
                <Paper p={5} m={5} style={{
                    display: "flex",
                    alignItems: "center"
                }}>
                    <DateRangePicker
                        // label="Date filter"
                        placeholder="Pick dates range"
                        value={dateValue}
                        locale="sw"
                        size={"sm"}
                        onChange={setDateValue}
                    />
                </Paper>
            </Container>
            <Container>
                <TransactionsList from={dateValue ? dateValue[0] : null} to={dateValue ? dateValue[1] : null}/>
            </Container>

        </Box>
    );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {

    return {
        props: {
            ...(await getSessionData(ctx))
        }
    }
}

Transactions.getLayout = function getLayout(page: ReactElement) {
    return (
        <AccountLayout>
            {page}
        </AccountLayout>
    )
}

export default Transactions;