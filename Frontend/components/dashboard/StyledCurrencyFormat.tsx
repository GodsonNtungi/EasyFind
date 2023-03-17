import React from 'react';
import {Text} from "@mantine/core"
import CurrencyFormat from 'react-currency-format';

export default function StyledCurrencyFormat(props: { value: number, prefix?: string }) {
    return (
        <CurrencyFormat value={props.value} displayType={'text'} thousandSeparator={true}
                        prefix={props.prefix ? props.prefix : "TZS "} renderText={(value: any) => (
            <Text sx={{fontFamily: "Poppins"}} size={"md"} weight={400} opacity={.6}> {value} </Text>
        )}/>
    );
}
