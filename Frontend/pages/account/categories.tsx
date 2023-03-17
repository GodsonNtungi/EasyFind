import React, {ReactElement} from 'react';
import {Button, Paper, ActionIcon, Space, Table, TextInput, Divider, Container} from "@mantine/core";
import {
    useAddCategoryMutation, useDeleteCategoryMutation,
    useGetAllCategoriesQuery
} from "../../services/items";
import {useAppSelector} from "../../store/store";
import {useForm} from "@mantine/form";
import {IconPlus, IconTrash} from "@tabler/icons";
import {AccountLayout, AccountProps} from "../../components/layouts/AccountLayout";
import {useSetAuthSession} from "../../hooks/authSession";
import {GetServerSidePropsContext} from "next";
import {getSessionData} from "../../lib/supabase";

function Categories(props: AccountProps) {

    useSetAuthSession(props)

    const currentStore = useAppSelector(store => store.auth.currentStore)
    const {currentData} = useGetAllCategoriesQuery({store_id: currentStore.id, name: ""})
    const [addGroup] = useAddCategoryMutation()
    const [deleteGroup] = useDeleteCategoryMutation()

    const form = useForm({
        initialValues: {
            name: "",
            store_id: currentStore.id
        }
    })

    return (
        <Container>
            <form onSubmit={form.onSubmit((values) => {
                addGroup(values)
                form.reset()
            })} style={{display: 'flex'}}>
                <TextInput size={"xs"} m={5}
                    placeholder={'new group'}
                    {...form.getInputProps('name')}
                    required={true}
                />
                <Space p={'sm'} />
                <Button m={5} size={"xs"} variant={"default"} leftIcon={<IconPlus size={14} />} type="submit">add</Button>
            </form>
            <Divider />
        <Paper>
    <Table striped >
                <thead>
                <tr>
                    <th>name</th>
                    <th>delete</th>
                </tr>
                </thead>
                <tbody>{
                    currentData?.map((element) => (
                        <tr key={element.id}>
                            <td>{element.name}</td>
                            <td>
                                <ActionIcon
                                    onClick={() => {
                                        deleteGroup(element.id)
                                    }}
                                >
                                    <IconTrash size={14} color={'red'} />
                                </ActionIcon>
                            </td>
                        </tr>
                    ))
                }</tbody>
            </Table>
        </Paper>
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

Categories.getLayout = function getLayout(page: ReactElement) {
    return (
        <AccountLayout>
            {page}
        </AccountLayout>
    )
}

export default Categories;