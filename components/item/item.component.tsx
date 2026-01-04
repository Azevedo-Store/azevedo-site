import { Box, Button, Card, CardActionArea, CardContent, CardMedia, Dialog, DialogContent, Typography } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";
import SliderItemCard from "../slider/slider-item-card.component";
export default function Item({ item, handleAdd }: any) {

    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string>("");
    const [openText, setOpenText] = useState(false);
    const [selectedText, setSelectedText] = useState<string>("");

    const handleImageClick = (url: string) => {
        setSelectedImage(url);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedImage("");
    };
    const handleTextClick = (text: string) => {
        setSelectedText(text);
        setOpenText(true);
    };

    const handleCloseText = () => {
        setOpenText(false);
        setSelectedText("");
    };


    return (
        <>
            <Card sx={{ width: 345, minHeight: 500 }}>

                {item?.image_itens?.length > 0 ?
                    (
                        <SliderItemCard images={item.image_itens} handleImageClick={handleImageClick} />

                    )
                    : null}



                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {item.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.value)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        <div style={{overflow: 'auto', maxHeight: 100}}  dangerouslySetInnerHTML={{ __html: item.description  }}></div>
                        {/* {(item.description != null && item.description != "" ? (item.description.length > 80) ? (
                            item.description.slice(0, 80).replaceAll(/(<[^>]*>)|(&[a-zA-Z0-9#];)|([\u007F-\uFFFF])/g, "")
                            + " ..."

                        ) : item.description : null)} */}
                    </Typography>

                    <div className="button-itens">
                        {/* {item.description != null && item.description != "" && item.description.length > 80 ? (
                            <Button variant="contained" onClick={() => handleTextClick(item.description)}>Continuar lendo texto</Button>

                        ) : null} */}
                        <Button variant="contained" onClick={() => handleAdd(item)}>Adicionar ao carrinho.</Button>
                    </div>


                </CardContent>
            </Card>

            {/* Modal de imagem expandida */}
            <Dialog open={open} onClose={handleClose} maxWidth="md">
                <DialogContent sx={{ p: 0 }}>
                    <img
                        src={selectedImage}
                        alt="Imagem expandida"
                        style={{ width: "100%", height: "auto", display: "block" }}
                    />
                </DialogContent>
            </Dialog>
            <Dialog open={openText} onClose={handleCloseText} maxWidth="md">
                <DialogContent sx={{ p: 0 }}>
                    <div className="text-expanded" dangerouslySetInnerHTML={{ __html: selectedText }} />
                </DialogContent>
            </Dialog>
        </>
    );
}