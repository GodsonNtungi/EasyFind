import React, {useEffect, useState} from 'react';
import {Chip, Box, Group, ScrollArea} from "@mantine/core"
import {definitions} from "../../types/database";


function ItemCategoriesFilter(props: { callback?: Function, categories: definitions['categories'][] }) {

    const [categoryId, setCategoryId] = useState(0)

    return (
        <>
            {
                props.categories ?
                    <ScrollArea
                        type="never"
                        offsetScrollbars
                        style={{width: "auto", display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <Chip.Group noWrap spacing={"xs"} position="left" onChange={(value) => {
                            setCategoryId(Number(value))
                            // console.log(Number(value))
                            if (props.callback !== undefined) {
                                props.callback(Number(value))
                            }
                        }
                        } sx={{width: "max-content"}} mt={"sm"}>
                            <Chip size={"xs"} value={"0"}>all</Chip>
                            {props.categories?.map((item, index) => (
                                <Chip size={"xs"} key={index} value={item.id?.toString()}>{item.name}</Chip>
                            ))}
                        </Chip.Group>
                    </ScrollArea>
                    : <></>
            }
        </>
    );
}

export default ItemCategoriesFilter;