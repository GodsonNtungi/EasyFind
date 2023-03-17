import {Affix, Button, ThemeIcon, Transition, useMantineTheme} from '@mantine/core';
import {IconArrowUp} from '@tabler/icons';
import {useWindowScroll} from '@mantine/hooks';
import {Hero} from "../components/landing/Hero";
import ContactUs from "../components/landing/ContactUs";
import {Features} from "../components/landing/Features";
import {ReactElement} from "react";
import { NextPageWithLayout } from './_app';
import {Box, Image} from "@mantine/core"
import DefaultLayout from '../components/layouts/DefaultLayout';
import Customers from "../components/landing/Customers";
import Reviews from "../components/landing/Reviews";

const HomePage: NextPageWithLayout = () => {

    const [scroll, scrollTo] = useWindowScroll();
    const theme = useMantineTheme()
    return (
        <Box>
            <Hero/>
            {/*<Features />*/}
            {/*<Customers />*/}
            {/*<Reviews />*/}
            <ContactUs/>

            <Affix position={{bottom: 20, right: 20}}>
                <Transition transition="slide-up" mounted={scroll.y > 0}>
                    {(transitionStyles) => (
                        <ThemeIcon
                            size={"xl"}
                            radius={"xl"}
                            sx={{cursor: "pointer"}}
                            style={transitionStyles}
                            onClick={() => scrollTo({y: 0})}
                        >
                            <IconArrowUp size={24}/>
                        </ThemeIcon>
                    )}
                </Transition>
            </Affix>
        </Box>
    )
}


HomePage.getLayout = function getLayout(page: ReactElement) {
    return (
        <DefaultLayout title={"Home"} description={"Tiririka simplifies online consumer goods business management by connecting" +
            " inventory management, ecommerce and advertisement."}>
            {page}
        </DefaultLayout>
    )
}


export default HomePage
