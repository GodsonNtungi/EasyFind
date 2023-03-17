import {
    SimpleGrid,
    Avatar,
    Group,
    Rating,
    Paper,
    Text,
    Box,
    Image,
    Title,
    Divider,
    Button, Space, NumberInput, Skeleton, createStyles, ActionIcon, NumberInputHandlers
} from "@mantine/core";
import React, {MutableRefObject, ReactElement, useRef, useState} from "react";
import DefaultLayout from "../../components/layout/Default";
import {definitions} from "../../types/database";
import 'keen-slider/keen-slider.min.css'
import {KeenSliderInstance, KeenSliderPlugin, useKeenSlider} from "keen-slider/react";
import {addItem, editItem} from "../../store/cartSlice";
import {IconShoppingCartPlus} from "@tabler/icons";
import {useAppDispatch} from "../../store/store";
import {useForm} from "@mantine/form";
import {showNotification} from "@mantine/notifications";
import * as CurrencyFormat from 'react-currency-format';
import {getProducts} from "../api/products";

const useStyles = createStyles({
    img: {
        display: "flex",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
    }
})

function ProductPage({product}: { product: definitions['items'] & { item_images: definitions['item_images'][], categories: definitions['categories'] } }) {
    const {classes, cx} = useStyles()
    const dispatch = useAppDispatch()
    const [value, setValue] = useState(1);
    const handlers = useRef<NumberInputHandlers>();

    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
        initial: 0,
    })
    const [thumbnailRef] = useKeenSlider<HTMLDivElement>(
        {
            initial: 0,
            slides: {
                perView: 4,
                spacing: 10,
            },
        },
        [ThumbnailPlugin(instanceRef)]
    )

    const productCount = useRef(1)

    return (
        <Box>
            <SimpleGrid breakpoints={[
                {minWidth: "sm", cols: 2, spacing: "sm"}
            ]}>
                <Group position={"apart"}
                       sx={{
                           justifyContent: "center",
                           position: "relative",
                           display: "flex",
                           width: "100%",
                           overflow: "hidden"
                       }}>
                    <Box sx={theme => ({
                        [theme.fn.smallerThan("sm")]: {
                            height: 400,
                        },
                        [theme.fn.largerThan("sm")]: {
                            height: 500,
                        },
                    })} top={60} p={"sm"} ref={sliderRef} className="keen-slider">
                        {product.item_images.map((image, index) => (
                            <Box key={index} className="keen-slider__slide">
                                <Image className={classes.img} placeholder alt={product.name}
                                       src={image.image_url ? image.image_url : ""}/>
                            </Box>
                        ))}
                    </Box>

                    {/*    thumbnails    */}
                    <Paper withBorder
                           sx={theme => ({
                               [theme.fn.smallerThan("sm")]: {
                                 height: 75,
                               },
                               [theme.fn.largerThan("sm")]: {
                                 height: 90,
                               }, alignItems: "center"  ,
                               justifyContent: "center", display: "flex", width: "100%", overflow: "hidden", height: "100%", position: "absolute", top: 0})}
                           ref={thumbnailRef} >
                        {product.item_images.map((image, index) => (
                            <Avatar key={index} className="keen-slider__slide" size={"lg"} alt={product.name}
                                    src={image.image_url ? image.image_url : ""}/>
                        ))}
                    </Paper>
                </Group>
                <Box sx={theme => ({display: "flex", flexDirection: "column"})}>
                    <Box>
                        <Title order={1} opacity={.9} weight={600} sx={{fontFamily: "Poppins"}} size={"h1"}
                               lineClamp={3}> {product.name} </Title>
                        <Group py={"xs"}>
                            <CurrencyFormat value={product.price} displayType={'text'} thousandSeparator={true}
                                            prefix={'TZS'} renderText={value => (
                                <Text sx={{fontFamily: "Poppins"}} size={"xl"} weight={700}
                                      opacity={.6}> {value} </Text>
                            )}/>
                        </Group>

                    </Box>
                    <Group py={"xs"}>
                        <Rating value={3.5} fractions={2} readOnly/>
                        <small style={{fontFamily: "Poppins"}}>(27 Rating)</small>
                    </Group>
                    <Divider my={"sm"}/>
                    <Group>
                        <Text sx={{fontFamily: "Poppins"}} size={"lg"} weight={500} opacity={1}>
                            {product.description}
                        </Text>
                    </Group>
                    <Space p={"xl"}/>

                    {/* checkout */}
                    <Group grow position={"center"}>
                        <Group spacing={5}>
                            <ActionIcon size={42} variant="default" onClick={() => handlers.current.decrement()}>
                                –
                            </ActionIcon>

                            <NumberInput
                                hideControls
                                size={"lg"}
                                value={value}
                                onChange={(val) => {
                                    setValue(val);
                                    productCount.current = val
                                }}
                                handlersRef={handlers}
                                max={10}
                                min={0}
                                step={1}
                                styles={{ input: { width: 54, textAlign: 'center' } }}
                            />

                            <ActionIcon size={42} variant="default" onClick={() => handlers.current.increment()}>
                                +
                            </ActionIcon>
                        </Group>
                        <Button onClick={(values) => {
                            dispatch(addItem({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                count: productCount.current,
                                image: product.item_images[0]?.image_url ? product.item_images[0]?.image_url : ""
                            }))
                            showNotification({
                                title: "Cart",
                                message: `You added to cart ${productCount.current} of ${product.name} .`,
                            })
                        }} radius={0} size={"lg"} variant={"filled"}
                                color={"accent"}
                                leftIcon={<IconShoppingCartPlus size={24}/>}>
                            <Text> Add to cart </Text>
                        </Button>
                    </Group>
                </Box>
            </SimpleGrid>

            <Box py={"xl"} bg={"inherit"} sx={theme => ({
                width: "100%"
            })}>
                <Title mb={"md"} order={2} size={"h3"} sx={{ fontFamily: "Poppins"}} weight={400} opacity={.7}> Related Products </Title>
            </Box>
        </Box>

    )
}


// This also gets called at build time
export async function getServerSideProps({params, req}) {
    const baseUrl = req.headers?.referer?.split('://')[0] + "://" + req.headers.host
    const {items} = await getProducts(params.id)
    const product = items[0]

    return {
        props: {
            product,
            baseUrl
        }
    }
}

ProductPage.getLayout = function getLayout(page: ReactElement) {
    const img = page.props.baseUrl + page.props.product.image
    return (
        <DefaultLayout hideFilters url={`${page.props.baseUrl}/products/${page.props.product.id}`} image={img}
                       title={page.props.product.name} description={page.props.product.description}>
            {page}
        </DefaultLayout>
    )
}


function ThumbnailPlugin(
    mainRef: MutableRefObject<KeenSliderInstance | null>
): KeenSliderPlugin {
    return (slider) => {
        function removeActive() {
            slider.slides.forEach((slide) => {
                slide.classList.remove("active")
            })
        }

        function addActive(idx: number) {
            slider.slides[idx].classList.add("active")
            console.log("Adding active", idx, slider.slides[idx].classList)
        }

        function addClickEvents() {
            slider.slides.forEach((slide, idx) => {
                slide.addEventListener("click", () => {
                    if (mainRef.current) mainRef.current.moveToIdx(idx)
                })
            })
        }

        slider.on("created", () => {
            if (!mainRef.current) return
            addActive(slider.track.details.rel)
            addClickEvents()
            mainRef.current.on("animationStarted", (main) => {
                removeActive()
                const next = main.animator.targetIdx || 0
                addActive(main.track.absToRel(next))
                slider.moveToIdx(Math.min(slider.track.details.maxIdx, next))
            })
        })
    }
}

export default ProductPage;