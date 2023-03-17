import React, {ReactElement, useState} from 'react';
import {
    ActionIcon,
    Button,
    Divider,
    Modal,
    Paper,
    Table, Container,
} from "@mantine/core";
import {useAppSelector} from "../../store/store";
import {useDeleteCustomerMutation, useGetAllStoreCustomersQuery} from "../../services/store";
import {IconPlus, IconTrash} from "@tabler/icons";
import NewCustomer from "../../components/dashboard/NewCustomer";
import {AccountLayout, AccountProps} from "../../components/layouts/AccountLayout";
import {GetServerSidePropsContext} from "next";
import {getSessionData} from "../../lib/supabase";
import {useSetAuthSession} from "../../hooks/authSession";

function Customers(props: AccountProps) {
    useSetAuthSession(props)
    const currentStore = useAppSelector(store => store.auth.currentStore)
    const {currentData} = useGetAllStoreCustomersQuery({store_id: currentStore.id})
    const [deleteCustomer] = useDeleteCustomerMutation()
    const [newModalOpened, setNewModalOpened] = useState(false);

    return (
        <Container>
            <Button leftIcon={<IconPlus size={14}/>} m={5} size={"xs"} variant={"default"} onClick={() => {
                setNewModalOpened(true)
            }} type="submit">new customer</Button>
            <Divider/>
            <Paper>
                <Table>
                    <thead>
                    <tr>
                        <th>unique name</th>
                        <th>delete</th>
                    </tr>
                    </thead>
                    <tbody>{
                        currentData?.map((element) => (
                            <tr key={element.id}>
                                <td>{element.unique_name}</td>
                                <td>
                                    <ActionIcon
                                        onClick={() => {
                                            deleteCustomer(element.id)
                                        }}
                                    >
                                        <IconTrash size={14} color={'red'}/>
                                    </ActionIcon>
                                </td>
                            </tr>
                        ))
                    }</tbody>
                </Table>
            </Paper>

            <Modal
                opened={newModalOpened}
                onClose={() => setNewModalOpened(false)}
                title="Add new item."
                fullScreen
            >
                <NewCustomer closeModal={() => {
                    setNewModalOpened(false)
                }}/>
            </Modal>
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

Customers.getLayout = function getLayout(page: ReactElement) {
    return (
        <AccountLayout>
            {page}
        </AccountLayout>
    )
}

export default Customers;