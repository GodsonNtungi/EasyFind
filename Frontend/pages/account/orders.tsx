import React, {ReactElement, useState} from 'react';
import {DateRangePicker, DateRangePickerValue} from "@mantine/dates";
import {Box, Container, Paper, Avatar, Text, ScrollArea, Table, Group} from "@mantine/core";
import {useGetAllOrdersQuery} from "../../services/items";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {useAppSelector} from "../../store/store";
import {openConfirmModal} from "@mantine/modals";
import {getImageUrl} from "../../lib/storage";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {AccountLayout, AccountProps} from "../../components/layouts/AccountLayout";
import {GetServerSidePropsContext} from "next";
import {getSessionData} from "../../lib/supabase";
import {useSetAuthSession} from "../../hooks/authSession";


const OrdersList = ({from, to}: { from: Date | null, to: Date | null }) => {

    const currentStore = useAppSelector(s => s.auth.currentStore)
    const supabase = useSupabaseClient()

    const {data, isLoading, error} = useGetAllOrdersQuery({
        from: from ? from.toISOString() : "",
        to: to ? to.toISOString() : "",
        store_id: currentStore?.id
    })

    // console.log(data)
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
                            <th>status</th>
                            <th>action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data?.map((item, index) => (
                            <tr key={index} style={{
                                cursor: "pointer"
                            }} onClick={() => openConfirmModal({
                                title: "Confirm Order",
                                children: (
                                    <Group>
                                        <Table verticalSpacing="xs"
                                               striped
                                               captionSide="top">
                                            <caption>summary</caption>
                                            <tbody>
                                            <tr>
                                                <td>Customer</td>
                                                <td>{item.mobile_number}</td>
                                            </tr>
                                            <tr>
                                                <td>Total Items</td>
                                                <td>{item.order_items.length}</td>
                                            </tr>
                                            <tr>
                                                <td>Total Amount</td>
                                                <td>{item.order_items.reduce((a, b) => a + (b.items.price?b.items.price:0), 0)} TZS</td>
                                            </tr>
                                            <tr>
                                                <td>Payment type</td>
                                                <td>cash</td>
                                            </tr>
                                            </tbody>
                                        </Table>

                                        {item.order_items.map((o, index) => (
                                                <Paper key={index} mt={"sm"} p={"xs"}
                                                       style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                                    <Avatar src={getImageUrl(supabase, o.items.item_images[0]?.image_url?o.items.item_images[0]?.image_url:"")} />
                                                    <Text sx={{fontFamily: "Poppins"}} weight={600} size={'sm'} px={"sm"} style={{flexGrow: 1}} align={"left"} color={"gray.7"} lineClamp={1}>
                                                        {o.items.name}
                                                    </Text>
                                                    <Text sx={{fontFamily: "Poppins"}} weight={600} size={'sm'} px={"sm"} style={{flexGrow: 1}} align={"left"} color={"gray.7"} lineClamp={1}>
                                                        {o.qty}
                                                    </Text>

                                                </Paper>
                                        ))}
                                    </Group>
                                ),
                                labels: {confirm: 'Confirm', cancel: 'Cancel'},
                                onCancel: () => console.log('Cancel'),
                                onConfirm: () => console.log('Confirmed'),
                            })}>
                                <td>
                                    <Text lineClamp={1}>
                                        {changeToLocalTimezone(item?.created_at ? item?.created_at : "").format('ddd DD MMM YYYY HH:mm a')}
                                    </Text>
                                </td>
                                <td>{item.mobile_number}</td>
                                <td>-</td>
                                <td>{item.discount}</td>
                                <td>{item.fullfiled ? "fulfilled" : "pending"}</td>
                                <td>action</td>
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


function Orders(props: AccountProps) {

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
                <OrdersList from={dateValue ? dateValue[0] : null} to={dateValue ? dateValue[1] : null}/>
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

Orders.getLayout = function getLayout(page: ReactElement) {
    return (
        <AccountLayout>
            {page}
        </AccountLayout>
    )
}

export default Orders;