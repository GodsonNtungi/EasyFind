import React from 'react';
import {
    NumberInput, TextInput, Title, Group, Button, Select,
} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useAppDispatch} from "../../store/store";

const InviteMember = ({
                            closeModal = () => {
                            }
                        }: { closeModal: Function }) => {

    const dispatch = useAppDispatch()

    const form = useForm({
        initialValues: {
            email: '',
            role: '',
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    })
    return (
        <>
            <form onSubmit={form.onSubmit((values) => {
                // console.log(values)
                // dispatch(addProduct(values))
                closeModal(values)
            })}>

                <TextInput
                    {...form.getInputProps('email')}
                    label={'Email Address'}
                    placeholder={'member\'s email address'}
                    withAsterisk
                    required
                />
                <Select
                    {...form.getInputProps('role')}
                    label={'Role'}
                    placeholder={'member role'}
                    withAsterisk
                    required
                    data={[
                        { value: 'employee', label: 'employee' },
                        { value: 'owner', label: 'owner' },
                    ]}
                />

                <Group position="right" mt="md">
                    <Button type="submit">invite</Button>
                </Group>
            </form>
        </>
    );
};

export default InviteMember;
