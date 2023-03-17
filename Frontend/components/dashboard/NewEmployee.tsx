import React, {useState} from 'react';
import {Button, Group, NumberInput, Paper, Switch, TextInput, useMantineTheme} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useAddEmployeeMutation, useGetAllStoreEmployeesQuery} from "../../services/store";
import {useAppSelector} from "../../store/store";
import {closeAllModals} from "@mantine/modals";

function NewEmployee({callback}: {callback: Function }) {
    const theme = useMantineTheme()
    const [addEmployee, addResults] = useAddEmployeeMutation()
    const currentStore = useAppSelector(store => store.auth.currentStore)
    const {currentData} = useGetAllStoreEmployeesQuery({store_id: currentStore.id})
    const [loading, setLoading] = useState(false)

    const findByPin = (pin: number) => {
        return currentData?.find(x => x.pin === pin)
    }

    const findByName = (name: string) => {
        return currentData?.find(x => x.name === name)
    }

    const addForm = useForm({
        initialValues: {
            is_active: true,
            name: "",
            pin: undefined,
            store_id: currentStore.id,
        },
        validate: {
            pin: (value) => (value === findByPin(value?value:0)?.pin?"PIN already taken by another employee.":null),
            name: (value) => (value === findByName(value)?.name?"Name already taken by another employee.":null)
        }
    })


    return (
        <div>
            <Paper>
                <Group grow position={'center'}>

                    <form style={{maxWidth: theme.breakpoints.sm}} onSubmit={
                        addForm.onSubmit((values) => {
                                if (values.pin) addEmployee(values)
                                // console.log(values)
                            callback()
                            }
                        )
                    }>
                        <TextInput
                            {...addForm.getInputProps('name')}
                            label={'Name'}
                            placeholder={'employee name'}
                        />
                        <NumberInput
                            maxLength={4}
                            hideControls
                            {...addForm.getInputProps('pin')}
                            label={'PIN'}
                            required
                            description={"PIN employee will use to login to POS."}
                            placeholder={'pin'}
                        />
                        <Switch
                            {...addForm.getInputProps('is_active')}
                            label={'is active'}
                            description={"Active means employee can login."}
                            checked
                        />
                        <Group position="right" mt="md">
                            <Button loading={loading || addResults?.isLoading} type="submit">Submit</Button>
                        </Group>
                    </form>
                </Group>
            </Paper>
        </div>
    );
}

export default NewEmployee;
