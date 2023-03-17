import React, {ReactElement, useState} from 'react';
import {DateRangePicker, DateRangePickerValue} from '@mantine/dates';
import {Box, Container, Text, Paper, SegmentedControl, Table, Group, Avatar, Title, ScrollArea} from "@mantine/core"
import {useGetAllItemsInQuery, useGetAllItemsOutQuery} from "../../services/items";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import 'dayjs/locale/sw'
import {useAppSelector} from "../../store/store";
import {openConfirmModal} from "@mantine/modals";
import StyledCurrencyFormat from "../../components/dashboard/StyledCurrencyFormat";
import {AccountLayout, AccountProps} from "../../components/layouts/AccountLayout";
import {useSetAuthSession} from "../../hooks/authSession";
import {GetServerSidePropsContext} from "next";
import {getSessionData} from "../../lib/supabase"; // import locale


const showHistoryDetails = (type: string, item: any) =>  openConfirmModal({
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
                            {changeToLocalTimezone(item?.date_out ? item?.date_out : "").format('ddd DD MMM YYYY HH:mm a')}
                        </Text>
                    </td>
                </tr>
                <tr>
                    <td>item</td>
                    <td>
                        <Text lineClamp={1}>
                            {item.items?.name}
                        </Text>
                    </td>
                </tr>
                <tr>
                    <td>Count</td>
                    <td>{item.count}</td>
                </tr>
                <tr>
                    <td>Amount</td>
                    <td>
                        <StyledCurrencyFormat value={item.amount} />
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
        </Group>
    ),
    labels: {confirm: 'Refund', cancel: 'Cancel'},
    onCancel: () => console.log('Cancel'),
    onConfirm: () => console.log('Refunded'),
})

const ItemsOutList = ({from, to}: { from: Date | null, to: Date | null }) => {

    const currentStore = useAppSelector(s => s.auth.currentStore)

    const {data, isLoading, error} = useGetAllItemsOutQuery({
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
                        <th>item</th>
                        <th>count</th>
                        <th>amt</th>
                        <th>actor</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data?.map((item, index) => (
                        <tr key={index} style={{cursor: "pointer"}} onClick={() => showHistoryDetails("Sales", item)}>
                            <td>
                                <Text lineClamp={1}>
                                    {changeToLocalTimezone(item?.date_out ? item?.date_out : "").format('ddd DD MMM YYYY HH:mm a')}
                                </Text>
                            </td>
                            <td>
                                <Text lineClamp={1}>
                                    {item.items?.name}
                                </Text>
                            </td>
                            <td>{item.count}</td>
                            <td>
                                <StyledCurrencyFormat value={item.amount?item.amount:0} />
                            </td>
                            <td>
                                <Text lineClamp={1}>
                                    {item.employees?.name ? item.employees?.name : "admin"}
                                </Text>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                </ScrollArea>
            </Paper>
        </>
    )
}


const ItemsInList = ({from, to}: { from: Date | null, to: Date | null }) => {
    const currentStore = useAppSelector(s => s.auth.currentStore)

    const {data, isLoading, error} = useGetAllItemsInQuery({
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
                        <th>item</th>
                        <th>actor</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data?.map((item, index) => (
                        <tr key={index} style={{cursor: "pointer"}} onClick={() => showHistoryDetails("Stock Entries", item)}>
                            <td>
                                <Text lineClamp={1}>
                                    {changeToLocalTimezone(item?.date_in ? item?.date_in : "").format('ddd DD MMM YYYY HH:mm a')}
                                </Text>
                            </td>
                            <td>{item.items?.name}</td>
                            <td>{item.count}</td>
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


function History(props: AccountProps) {
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
                    <SegmentedControl
                        data={[
                            {label: 'sales', value: 'items_out'},
                            {label: 'stock entries', value: 'items_in'},
                        ]}
                        aria-label={"type"}
                        title={"type"}
                        value={typeValue}
                        onChange={setTypeValue}
                    />
                </Paper>
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
                {
                    typeValue === "items_out" ?
                        <ItemsOutList from={dateValue ? dateValue[0] : null} to={dateValue ? dateValue[1] : null}/>
                        : (typeValue == "items_in" ? <ItemsInList from={dateValue ? dateValue[0] : null}
                                                                  to={dateValue ? dateValue[1] : null}/> : <></>)

                }
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

History.getLayout = function getLayout(page: ReactElement) {
    return (
        <AccountLayout>
            {page}
        </AccountLayout>
    )
}

export default History;