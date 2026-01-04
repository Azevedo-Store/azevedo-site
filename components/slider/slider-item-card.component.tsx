import { CardMedia } from "@mui/material";
import Slider from "react-slick";
import { NextArrow } from "./arrow-right.component";
import { PrevArrow } from "./arrow-left.component";
import styles from './slider.module.scss'

export default function SliderItemCard({ images, handleImageClick }: any) {
    const sliderSettings = {
        dots: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,

    };

    return images?.length > 1 ? (
        <Slider {...sliderSettings}  >
            {images.map((imageSafe: any, index: number) => (
                <CardMedia sx={{ cursor: "pointer" }} onClick={() => handleImageClick(imageSafe.image.url)} key={index} className={styles.min_image}>
                    <img
                        src={imageSafe.image.url}
                        alt={`image-${index}`}
                        height="100px"
                        style={{ width: "75px" }}
                    />
                </CardMedia>
            ))}
        </Slider>
    ) : (
        <CardMedia sx={{ cursor: "pointer" }} onClick={() => handleImageClick(images[0].image.url)} className={styles.min_image}>
            <img
                src={images[0].image.url}
                alt={`image-principal`}
                height="100px"
                style={{ width: "75px" }}
            />
        </CardMedia>
    )


}