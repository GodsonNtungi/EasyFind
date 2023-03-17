import Head from 'next/head'
import {
    Box,
    Affix,
    Paper,
    Transition,
    Button,
    Container,
    Group,
    TextInput,
    Card,
    Text,
    Title,
    Divider,
    Aside,
    HoverCard,
    Anchor, Checkbox, RangeSlider, useMantineTheme, ActionIcon, Loader
} from "@mantine/core";
import React, {useState} from "react";
import {TopHeader} from "../web/TopHeader";
import data from "../../utils/data"
import {useWindowScroll} from "@mantine/hooks";
import {IconArrowRight, IconArrowUp, IconChevronDown, IconChevronRight, IconSearch, IconSend} from "@tabler/icons";
import Footer from "../web/Footer";
import {definitions} from "../../types/database";
import {useAppDispatch, useAppSelector} from "../../store/store";
import {
    setProductFiltersCategoriesState, setProductFiltersIdsState,
    setProductFiltersMaxPriceState,
    setProductFiltersMinPriceState, setSemanticSearchStringState
} from "../../store/productsSlice";
import {useGetAllItemsPriceRangeQuery, useGetAllItemsQuery} from "../../store/productsApi";
import axios from "axios";
import {showNotification} from "@mantine/notifications";


const Filters = ({categories}: { categories: definitions["categories"][] }) => {

    const dispatch = useAppDispatch()
    const productFilters = useAppSelector(s => s.productFilters.filters)
    const {currentData: itemsPriceRange, isFetching: isFetchingPriceRange} = useGetAllItemsPriceRangeQuery(undefined)
    const theme = useMantineTheme()

    function valueLabelFormat(value: number) {
        const units = ['', 'K', 'M'];

        let unitIndex = 0;
        let scaledValue = value;

        while (scaledValue >= 1000 && unitIndex < units.length - 1) {
            unitIndex += 1;
            scaledValue /= 1000;
        }
        return `${Math.round(scaledValue).toFixed(2)} ${units[unitIndex]}`;
    }

    return (

        <>
            <Card radius={"md"} withBorder bg={theme.colorScheme === 'dark' ? "" : "gray.1"}>
                {!itemsPriceRange ?
                    <></> :
                    <Card.Section p={"sm"}>
                        <Title size={"h4"} sx={{fontFamily: "Poppins"}}> Price </Title>
                        <Box p={"sm"}>
                            <RangeSlider
                                labelAlwaysOn
                                size={2}
                                label={valueLabelFormat}
                                thumbSize={14}
                                min={itemsPriceRange[0]}
                                max={itemsPriceRange[1]}
                                mt="xl"
                                onChangeEnd={value => {
                                    dispatch(setProductFiltersMinPriceState(value ? value[0].toString() : 0))
                                    dispatch(setProductFiltersMaxPriceState(value ? value[1].toString() : 0))
                                }}
                                defaultValue={[
                                    itemsPriceRange[0],
                                    itemsPriceRange[1]
                                ]}
                            />
                        </Box>
                    </Card.Section>
                }
                <Card.Section p={"sm"}>
                    <Title size={"h4"} sx={{fontFamily: "Poppins"}}> Categories </Title>
                    <Box p={"sm"}>
                        {categories ?
                            categories.map((category, index) => (
                                <Group key={index} py={2} position={"apart"}>

                                    <Checkbox label={
                                        <>
                                            {' '} <Text component={"span"}
                                                        sx={{fontFamily: "Outfit"}}> {category.name} </Text>
                                        </>
                                    } onInput={(event) => {
                                        if (event.currentTarget.checked) {
                                            dispatch(setProductFiltersCategoriesState([category.id.toString(), ...productFilters.categories]))
                                        } else {
                                            dispatch(setProductFiltersCategoriesState(productFilters.categories.filter(x => x !== category.id.toString())))
                                        }
                                    }}/>
                                </Group>
                            ))

                            : <></>
                        }
                    </Box>

                </Card.Section>
            </Card>
        </>
    )
}

const HoverFilters = ({
                          label,
                          width,
                          categories
                      }: { width?: string, label?: string, categories: definitions["categories"][] }) => (
    <>
        <HoverCard width={width ? width : '100vw'} shadow="md" withArrow openDelay={200} closeDelay={400}>
            <HoverCard.Target>
                <Button variant={"white"} size={"sm"} rightIcon={<IconChevronDown size={20}/>}>
                    <Text weight={600} transform={"capitalize"}>
                        {label ? label : "filters"}
                    </Text>
                </Button>
            </HoverCard.Target>
            <HoverCard.Dropdown sx={{
                maxHeight: "350px",
                overflow: "auto"
            }}>
                <Filters categories={categories}/>
            </HoverCard.Dropdown>
        </HoverCard>
    </>
)

export default function DefaultLayout({
                                          children,
                                          url,
                                          title,
                                          description,
                                          hideFilters,
                                          image,
                                          hideSearchArea,
                                          categories,
                                          businessProfile,
                                      }: { businessProfile?: definitions['profiles'], categories?: definitions["categories"][], hideFilters?: boolean, url?: string, image?: string, description?: string, title?: string, children: any, hideSearchArea?: boolean }) {

    const [scroll, scrollTo] = useWindowScroll();
    const [searching, setSearching] = useState(false);

    // const productFilters = useAppSelector(s => s.productFilters.filters)
    // const {currentData: items, isFetching: isFetchingItems} = useGetAllItemsQuery(productFilters)
    const dispatch = useAppDispatch()

    const semanticSearchString = useAppSelector(s => s.productFilters.semanticSearch.searchString)
    const searchCategories = useAppSelector(s => s.productFilters.filters.categories)

    const semanticSearchEndpoint = "/api/semantic_search"
    const semanticSearch = async () => {
        // do a semantic search
        setSearching(true)
        let endpoint = semanticSearchEndpoint
        endpoint += "?search=" + encodeURIComponent(semanticSearchString)
        endpoint += "&categories=" + searchCategories.join(",")
        const response = await axios.get(endpoint)
        setSearching(false)
        if (response.data?.length > 0) {
            const ids = response.data.map(value => value.id)
            dispatch(setProductFiltersIdsState(ids))
            // console.log(ids, response.data)
        } else {
            showNotification({
                title: "Search Results",
                message: "Failed to find items matching your description."
            })
        }
    }

    return (
        <>
            <Head>
                <title>{`${title} | ${businessProfile?.username}`}</title>
                <meta name={"description"} content={description}/>
                <meta name={"og.title"} content={title}/>
                <meta name={"og.description"} content={description}/>
                <meta name={"og:image"} content={image}/>
                <meta name={"og:image:secure_url"} content={image}/>
                <meta name="og:type" content="website"/>
                <meta name="og:image:type" content="image/jpeg,image/png"/>
                <meta name="og:image:width" content="300"/>
                <meta name="og:image:height" content="300"/>
                <meta name="og:url" content={url}/>
                <link rel="android-chrome-icon" sizes="192x192" href={image ? image : "/android-chrome-192x192.png"}/>
                <link rel="android-chrome-icon" sizes="512x512" href={image ? image : "/android-chrome-512x512.png"}/>
                <link rel="apple-touch-icon" sizes="180x180" href={image ? image : "/apple-touch-icon.png"}/>
                <link rel="apple-touch-icon" sizes="180x180" href={image ? image : "/apple-touch-icon.png"}/>
                <link rel="icon" type="image/png" sizes="32x32" href={image ? image : "/favicon-32x32.png"}/>
                <link rel="icon" type="image/png" sizes="16x16" href={image ? image : "/favicon-16x16.png"}/>
            </Head>

            <Box>
                <TopHeader businessProfile={businessProfile} hideSearchArea={hideSearchArea}
                           mainLinks={data.headerLinks.mainLinks}/>

                <Box p={"sm"} sx={theme => ({
                    display: "flex", position: "relative"
                })}>
                    {hideFilters ? <></> :
                        <Group sx={theme => ({
                            position: "sticky",
                            top: 0,
                            [theme.fn.smallerThan('sm')]: {
                                display: 'none'
                            }
                        })}>
                            <Aside zIndex={1} height={"100%"} p={"sm"} width={{base: 'sm', sm: undefined, md: 300}}>
                                <Filters categories={categories}/>
                                <Footer businessProfile={businessProfile}/>
                            </Aside>
                        </Group>
                    }
                    <Box py={"xl"} sx={{display: "flex", flexDirection: "column", width: "100%"}}>
                        {hideFilters ? <></> :
                            <Paper sx={{display: "flex"}}>
                                <Box sx={theme => ({
                                    [theme.fn.largerThan("sm")]: {
                                        display: "none"
                                    },
                                    display: "flex",
                                    justifyContent: "canter",
                                    alignItems: "center"
                                })}>
                                    <HoverFilters categories={categories} width={"200px"}/>
                                </Box>
                                <Group grow sx={theme => ({
                                    width: "100%",
                                    [theme.fn.largerThan("sm")]: {
                                        width: "100%"
                                    }
                                })}>
                                    <TextInput onChange={(event) => {
                                        const newValue = event.currentTarget.value;
                                        dispatch(setSemanticSearchStringState(newValue))
                                    }} mx={"auto"} radius={"xl"} variant={"filled"}
                                               icon={<IconSearch color={"orange"} size={20}/>}
                                               rightSection={
                                                   searching ?
                                                       <Loader/>
                                                       :
                                                       <ActionIcon disabled={semanticSearchString.length === 0}
                                                                   onClick={() => semanticSearch()} size={'lg'}
                                                                   radius={'lg'} color={'accent'}
                                                                   variant={'filled'}>
                                                           <IconSend/>
                                                       </ActionIcon>
                                               }
                                               size={"md"}
                                               placeholder={"describe what your need"}/>
                                </Group>
                            </Paper>
                        }
                        {children}
                    </Box>

                </Box>
            </Box>

            <Affix position={{bottom: 20, right: 20}}>
                <Transition transition="slide-up" mounted={scroll.y > 0}>
                    {(transitionStyles) => (
                        <Button
                            variant={"filled"}
                            sx={{fontFamily: "Poppins"}}
                            leftIcon={<IconArrowUp size={16}/>}
                            style={transitionStyles}
                            radius={"md"}
                            onClick={() => scrollTo({y: 0})}
                        >
                            top
                        </Button>
                    )}
                </Transition>
            </Affix>

        </>
    )
}
