
import {createStyles} from "@mantine/core";

const useLayoutStyles = createStyles((theme) => ({
    wrapper: {
        height: "100vh",
        overflowX: "hidden",
        position: "relative"
    },
    main: {
        minHeight: "300px",
    },
    link: {
        width: 40,
        height: 40,
        borderRadius: theme.radius.sm,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
        },
    },
    active: {
        '&, &:hover': {
            // boxShadow: ".1px .1px 3px .1px ",
            backgroundColor: theme.fn.variant({variant: 'light', color: theme.colors.gray[2]}).background,
            color: theme.white,
        },
    },
}));

export default useLayoutStyles;