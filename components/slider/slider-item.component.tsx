import { CardMedia } from "@mui/material";
import Slider from "react-slick";
import { NextArrow } from "./arrow-right.component";
import { PrevArrow } from "./arrow-left.component";
import Image from "next/image";


export default function SliderItem({ images, handleImageClick }: any) {
    const sliderSettings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,

    };

    return images?.length > 1 ? (
        <Slider {...sliderSettings}  >
            {images.map((imageSafe: any, index: number) => (

                <Image
                    key={index}
                    src={imageSafe.image.url}
                    alt={`image-${index}`}
                    width={150}
                    height={150}

                />

            ))}
        </Slider>
    ) : (
        <Image
            src={images[0].image.url}
            alt={`image-0`}
            width={150}
            height={150}

        />
    )


}