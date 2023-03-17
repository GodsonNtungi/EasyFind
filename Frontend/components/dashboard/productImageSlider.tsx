import 'keen-slider/keen-slider.min.css'
import {KeenSliderInstance, KeenSliderPlugin, useKeenSlider} from "keen-slider/react";
import {
    createStyles,
    FileInput,
    Group,
    NumberInput,
    NumberInputHandlers,
    Rating, Avatar,
    SimpleGrid,
    Title
} from "@mantine/core";
import {definitions} from "../../types/database";
import React, {MutableRefObject, useRef, useState} from "react";
import {
    Box, Image, Paper
} from "@mantine/core"
import {getImageUrl, updateProductPic} from "../../lib/storage";
import supabase from "../../lib/supabase";
import {useAddItemImageMutation} from "../../services/items";
import {useAppDispatch} from "../../store/store";
import uuid4 from "uuid4";
import {showNotification} from "@mantine/notifications";
import {IconFileImport} from "@tabler/icons";

const useStyles = createStyles({
    img: {
        display: "flex",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
    }
})

function ProductImageSlider({product}: { product: definitions['items'] & {item_images: definitions['item_images'][],categories: definitions['categories']} }) {
    const {classes, cx} = useStyles()
    const handlers = useRef<NumberInputHandlers>();

    const [addProductImage, productImageResult] = useAddItemImageMutation()
    const [deleteProductImage, deleteProductImageResult] = useAddItemImageMutation()
    const dispatch = useAppDispatch()

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
                <Group position={"apart"}
                       sx={{
                           justifyContent: "center",
                           position: "relative",
                           display: "flex",
                           width: "100%",
                           overflow: "hidden"
                       }}>

                        {product.item_images.length > 0 ?
                            (
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
                                                   src={getImageUrl(supabase, image.image_url ? image.image_url : "")}/>
                                        </Box>
                                    ))}
                                </Box>

                            )
                            :<></>}

                    {/*    thumbnails    */}
                    {product.item_images.length > 0?
                    <Paper withBorder
                           sx={theme => ({
                               [theme.fn.smallerThan("sm")]: {
                                   height: 75,
                               },
                               [theme.fn.largerThan("sm")]: {
                                   height: 90,
                               }, alignItems: "center"  ,
                               justifyContent: "center", display: "flex", width: "100%", overflow: "hidden", height: "100%", position: "absolute", right: 0, left: 0, top: 0})}
                           ref={thumbnailRef} >
                        {product.item_images.map((image, index) => (
                                <Avatar key={index} className="keen-slider__slide" size={"lg"} alt={product.name}
                                        src={getImageUrl(supabase, image.image_url ? image.image_url : "")}/>
                        ))}
                    </Paper>
                        :<></>
                    }
                    <Box>
                        <FileInput
                            style={{}}
                            accept="image/*"
                            size={"lg"}
                            label={"add a product image"}
                            onChange={(v) => {

                                // check if image is null
                                if (v === null) {
                                    return
                                }

                                // generate a random product name.
                                const prod_name = product.name + " " + uuid4()

                                // upload image to supabase.
                                updateProductPic(supabase, prod_name, v)
                                    .then(({data, error}: { data: any, error: any }) => {
                                    if (data) {
                                        // add product image
                                        addProductImage({
                                            image_url: data.path,
                                            item_id: product.id
                                        })
                                    }
                                    if (error) {
                                        console.error(error)
                                        showNotification({
                                            title: "Image Upload Error",
                                            message: `${error}`
                                        })
                                    }
                                })
                                    .finally(() => {
                                        // console.log(prod)
                                    })
                            }}
                            icon={<IconFileImport size={14}/>}
                        />
                    </Box>
                </Group>
        </Box>

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

export default ProductImageSlider