import React from 'react';
import {useAppSelector} from "../../store/store";
import {useAddCustomerMutation, useDeleteCustomerMutation, useGetAllStoreCustomersQuery} from "../../services/store";
import {useForm} from "@mantine/form";
import {Button, Group, Paper, Textarea, TextInput, useMantineTheme} from "@mantine/core";

function NewCustomer({closeModal}: {
    closeModal: Function
}) {

    const currentStore = useAppSelector(store => store.auth.currentStore)
    const [addCustomer] = useAddCustomerMutation()
    const theme = useMantineTheme()

    const addForm = useForm({
        initialValues: {
            unique_name: "",
            first_name: "",
            last_name: "",
            email: "",
            phone_number1: "",
            phone_number2: "",
            address1: "",
            address2: "",
            company: "",
            note: "",
            store_id: currentStore.id
        }
    })


    return (
        <div>
            <Paper>
                <Group grow position={'center'}>

                    <form style={{maxWidth: theme.breakpoints.sm}} onSubmit={
                        addForm.onSubmit((values) => {
                                addCustomer(values)
                                closeModal()
                            }
                        )
                    }>
                        <TextInput
                            {...addForm.getInputProps('unique_name')}
                            label={'unique name'}
                            placeholder={'customer unique name'}
                            withAsterisk
                            required
                        />
                        <TextInput
                            {...addForm.getInputProps('first_name')}
                            label={'First name'}
                            placeholder={'first name'}
                        />
                        <TextInput
                            {...addForm.getInputProps('last_name')}
                            label={'Last name'}
                            placeholder={'last_name'}
                        />
                        <TextInput
                            {...addForm.getInputProps('email')}
                            label={'Email'}
                            placeholder={'username@domain'}
                        />
                        <TextInput
                            {...addForm.getInputProps('phone_number1')}
                            label={'Phone Number 1'}
                            placeholder={'first phone number'}
                        />
                        <TextInput
                            {...addForm.getInputProps('phone_number2')}
                            label={'Phone number 2'}
                            placeholder={'phone number 2'}
                        />
                        <TextInput
                            {...addForm.getInputProps('address1')}
                            label={'Address 1'}
                            placeholder={'first address'}
                        />
                        <TextInput
                            {...addForm.getInputProps('address2')}
                            label={'Address 2'}
                            placeholder={'second address'}
                        />
                        <TextInput
                            {...addForm.getInputProps('company')}
                            label={'Company'}
                            placeholder={'company'}
                        />
                        <Textarea
                            {...addForm.getInputProps('note')}
                            label={'Note'}
                            placeholder={'some notes'}
                        />
                        <Group position="right" mt="md">
                            <Button type="submit">Submit</Button>
                        </Group>
                    </form>
                </Group>
            </Paper>
        </div>
    );
}

export default NewCustomer;