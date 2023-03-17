import React from 'react';
import {SimpleGrid} from "@mantine/core";
import Product from "./Product";
import {definitions} from "../../types/database";

function Products(props: {
    onScroll?: any, ref?: any,
    products: (definitions['items'] & { item_images: definitions['item_images'][], categories: definitions['categories'] })[]}) {
    return (
        <SimpleGrid onScroll={props.onScroll} ref={props.ref} py={"xl"} breakpoints={[
            {minWidth: "sm", cols: 2, spacing:"sm"},
            {minWidth: "lg", cols: 3, spacing:"lg"},
            {minWidth: "xl", cols: 3, spacing:"xl"}
        ]} mx={"auto"}>
            {props.products?.map((product, index) => (
                <Product key={index} product={product} />
            ))}
        </SimpleGrid>
    );
}

export default Products;