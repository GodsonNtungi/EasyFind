import React, {ReactElement, useState} from 'react';
import {
    ActionIcon,
    Paper,
    Button,
    Modal,
    Divider,
    Table,
    Text,
    Switch,
    Container
} from "@mantine/core";
import {useAppSelector} from "../../store/store";
import {
    useDeleteEmployeeMutation,
    useGetAllStoreEmployeesQuery
} from "../../services/store";
import {IconPlus, IconTrash} from "@tabler/icons";
import NewEmployee from "../../components/dashboard/NewEmployee";
import {AccountLayout, AccountProps} from "../../components/layouts/AccountLayout";
import {useSetAuthSession} from "../../hooks/authSession";
import {GetServerSidePropsContext} from "next";
import {getSessionData} from "../../lib/supabase";

function Employees(props: AccountProps) {
    useSetAuthSession(props)
    const currentStore = useAppSelector(store => store.auth.currentStore)
    const {currentData} = useGetAllStoreEmployeesQuery({store_id: currentStore.id})
    const [deleteEmployee] = useDeleteEmployeeMutation()
    const [newModalOpened, setNewModalOpened] = useState(false);

    return (
        <Container>
            <Button leftIcon={<IconPlus size={14}/>} m={5} size={"xs"} variant={"default"} onClick={() => {
                setNewModalOpened(true)
            }} type="submit">new employee</Button>
            <Divider/>
            <Paper>
                <Table>
                    <thead>
                    <tr>
                        <th>name</th>
                        <th>pin</th>
                        <th>is active</th>
                        <th>delete</th>
                    </tr>
                    </thead>
                    <tbody>{
                        currentData?.map((element) => (
                            <tr key={element.id}>
                                <td>
                                    <Text lineClamp={1}>
                                        {element.name}
                                    </Text>
                                </td>
                                <td>{element.pin}</td>
                                <td>
                                    <Switch
                                        styles={{
                                            root: {
                                                display: "flex",
                                                justifyContent: "left",
                                                alignItems: "center"
                                            }
                                        }}
                                        size={"xs"}
                                        checked={element.is_active}
                                    />
                                </td>
                                <td>
                                    <ActionIcon
                                        onClick={() => {
                                            deleteEmployee(element.id)
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
                title="New Employee."
            >
                <NewEmployee callback={() => {
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

Employees.getLayout = function getLayout(page: ReactElement) {
    return (
        <AccountLayout>
            {page}
        </AccountLayout>
    )
}

export default Employees;