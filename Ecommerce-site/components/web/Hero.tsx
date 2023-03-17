import React from 'react';
import {BackgroundImage, Anchor, Box, Text, Group, createStyles, Title, Breadcrumbs} from "@mantine/core";


const useStyles = createStyles((theme) => ({
    bgImage: {
        filter: "contrast(40%)",
        [theme.fn.largerThan('md')]: {
            height: 300,
        },
        [theme.fn.smallerThan('md')]: {
            height: 170,
        },
        [theme.fn.smallerThan('sm')]: {
            height: 120,
        },
    },

}))

const items = (title: string) => [
    {title: 'Home', href: '/'},
    {title: title, href: '#'},
].map((item, index) => (
    <Anchor href={item.href} key={index}>
        <Text transform={"uppercase"} size={"sm"} weight={500} color={"white"}>
            {item.title}
        </Text>
    </Anchor>
));

function Hero(props:{title: string, image?:string}) {

    const {classes, cx} = useStyles()

    return (
        <Box sx={{position: "relative"}}>
            <BackgroundImage className={classes.bgImage} src={props.image?props.image:"https://via.placeholder.com/1920x300"} />
            <Group sx={{
                position: "absolute",
                left: 0,
                top: "30%",
                width: "100%",
            }}>
                <Title color={"white"} transform={"capitalize"} sx={{width: "100%"}} align={"center"} order={1}> {props.title} </Title>
            </Group>
            <Group sx={{
                position: "absolute",
                left: 0,
                bottom: 0,
                width: "100%"
            }} p={"md"}>
                <Breadcrumbs>
                    {items(props.title)}
                </Breadcrumbs>
            </Group>
        </Box>
    );
}

export default Hero;