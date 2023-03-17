import {
    Paper,
    Text,
    TextInput,
    Textarea,
    Button,
    Box,
    Group,
    SimpleGrid,
    FocusTrap,
    createStyles, Container, Image, Title,
} from '@mantine/core';
import {ContactIconsList} from './contact-icons';


const useStyles = createStyles((theme) => {
    const BREAKPOINT = theme.fn.smallerThan('sm');

    return {
        outer: {
            paddingTop: theme.spacing.xl * 4,
            paddingBottom: theme.spacing.xl * 4,
        },
        wrapper: {
            display: 'flex',
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
            borderRadius: theme.radius.lg,
            border: `1px solid ${
                theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[2]
            }`,

            [BREAKPOINT]: {
                flexDirection: 'column',
            },
        },

        form: {
            boxSizing: 'border-box',
            flex: 1,
            padding: theme.spacing.xl,
            paddingLeft: theme.spacing.xl * 2,
            borderLeft: 0,

            [BREAKPOINT]: {
                padding: theme.spacing.md,
                paddingLeft: theme.spacing.md,
            },
        },

        fields: {
            marginTop: -12,
        },

        fieldInput: {
            flex: 1,

            '& + &': {
                marginLeft: theme.spacing.md,

                [BREAKPOINT]: {
                    marginLeft: 0,
                    marginTop: theme.spacing.md,
                },
            },
        },

        fieldsGroup: {
            display: 'flex',

            [BREAKPOINT]: {
                flexDirection: 'column',
            },
        },

        contacts: {
            boxSizing: 'border-box',
            position: 'relative',
            borderRadius: theme.radius.lg - 2,
            border: '1px solid transparent',
            padding: theme.spacing.xl,
            flex: '0 0 280px',

            [BREAKPOINT]: {
                marginBottom: theme.spacing.sm,
                paddingLeft: theme.spacing.md,
            },
        },

        title: {
            marginBottom: theme.spacing.xl * 1.5,
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,

            [BREAKPOINT]: {
                marginBottom: theme.spacing.xl,
            },
        },

        control: {
            [BREAKPOINT]: {
                flex: 1,
            },
        },
    };
});

export default function ContactUs() {
    const {classes} = useStyles();

    return (
        <Container id={"contact-us"}
                   sx={{minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <Paper shadow="xs" withBorder radius="md" p={"xl"}>
                <Box>
                    <Title order={2} size="h1" weight={700} className={classes.title}>
                        Contact information
                    </Title>
                    <Group spacing={"xl"}>
                        <ContactIconsList variant="white"/>
                    </Group>
                </Box>

            </Paper>
        </Container>
    );
}