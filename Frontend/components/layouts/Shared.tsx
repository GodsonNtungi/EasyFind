import {
    IconBox, IconHistory,
    IconLayoutGrid,
    IconReceipt, IconSettings,
    IconShoppingCart,
    IconUserPlus,
    IconUsers, IconWorld,
    TablerIcon
} from "@tabler/icons";
import {Tooltip, UnstyledButton} from "@mantine/core";
import React from "react";
import useLayoutStyles from "./LayoutStyles";

export interface NavbarLinkProps {
    icon: TablerIcon;
    label: string;
    active?: boolean;
    onClick?(): void;
}

export const NavbarLink = ({icon: Icon, label, active, onClick}: NavbarLinkProps) => {
    const {classes, cx} = useLayoutStyles();
    return (
        <Tooltip label={label} position="right" transitionDuration={0}>
            <UnstyledButton onClick={onClick} className={cx(classes.link, {[classes.active]: active})}>
                <Icon stroke={active ? 1.5 : .6}/>
            </UnstyledButton>
        </Tooltip>
    );
}

export const mock_data = [
    {icon: IconLayoutGrid, label: 'Stock', link: '/account/stock'},
    {icon: IconBox, label: 'Categories', link: '/account/categories'},
    {icon: IconUserPlus, label: 'Customers', link: '/account/customers'},
    {icon: IconUsers, label: 'Employees', link: '/account/employees'},
    {icon: IconReceipt, label: 'Transactions', link: '/account/transactions'},
    {icon: IconShoppingCart, label: 'Orders', link: '/account/orders'},
    {icon: IconHistory, label: 'History', link: '/account/history'},
    {icon: IconSettings, label: 'Settings', link: '/account/settings'},
    {icon: IconWorld, label: 'Website', link: '/account/website'},
];