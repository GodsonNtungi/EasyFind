import { createStyles, ThemeIcon, Text, SimpleGrid, Box, Stack } from '@mantine/core';
import { IconSun, IconPhone, IconMapPin, IconAt } from '@tabler/icons';
import React from "react";

type ContactIconVariant = 'white' | 'gradient';

interface ContactIconStyles {
    variant: ContactIconVariant;
}

const useStyles = createStyles((theme, { variant }: ContactIconStyles) => ({
    wrapper: {
        display: 'flex',
        alignItems: 'center',
    },

    icon: {
        marginRight: theme.spacing.md,
        backgroundImage:
            variant === 'gradient'
                ? `linear-gradient(135deg, ${theme.colors[theme.primaryColor][4]} 0%, ${
                    theme.colors[theme.primaryColor][6]
                } 100%)`
                : 'none',
        backgroundColor: 'transparent',
    },
}));

interface ContactIconProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
    icon: React.FC<any>;
    title: React.ReactNode;
    description: React.ReactNode;
    variant?: ContactIconVariant;
}

function ContactIcon({
                         icon: Icon,
                         title,
                         description,
                         variant = 'gradient',
                         className,
                         ...others
                     }: ContactIconProps) {
    const { classes, cx } = useStyles({ variant });
    return (
        <div className={cx(classes.wrapper, className)} {...others}>
            {variant === 'gradient' ? (
                <ThemeIcon size={40} radius="md" className={classes.icon}>
                    <Icon size={24} />
                </ThemeIcon>
            ) : (
                <Box mr="md">
                    <Icon size={24} />
                </Box>
            )}

            <div>
                <Text size="xs" >
                    {title}
                </Text>
                <Text >{description}</Text>
            </div>
        </div>
    );
}

interface ContactIconsListProps {
    data?: ContactIconProps[];
    variant?: ContactIconVariant;
}

const MOCKDATA = [
    { title: 'Email', description: 'info@atomatiki.tech', icon: IconAt },
    { title: 'Phone', description: '+255764205701', icon: IconPhone },
    { title: 'Address', description: 'Makumbusho, Dar es salaam Tanzania.', icon: IconMapPin },
    { title: 'Working hours', description: '8 a.m. – 11 p.m.', icon: IconSun },
];

export function ContactIconsList({ data = MOCKDATA, variant }: ContactIconsListProps) {
    const items = data.map((item, index) => <ContactIcon key={index} variant={variant} {...item} />);
    return <>{items}</>;
}

export function ContactIcons() {
    return (
        <Box>
            <Box
                sx={(theme) => ({
                    padding: theme.spacing.xl,
                    borderRadius: theme.radius.md,
                    backgroundColor: theme.white,
                })}
            >
                <ContactIconsList />
            </Box>

        </Box>
    );
}