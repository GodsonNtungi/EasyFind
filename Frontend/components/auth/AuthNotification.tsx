import React, {useState} from 'react';
import {Notification} from "@mantine/core";
import {IconCheck, IconX} from "@tabler/icons";

const AuthNotification = ({message, title, error}: {message: string, title: string, error: boolean}) => {

    return (
        <>
            <Notification disallowClose color={error?'red':'blue'} icon={error? <IconX size={18} />: <IconCheck size={20} />} title={title}>
                {message}
            </Notification>
        </>
    );
};

export default AuthNotification;