'use client'

import styles from "./carrinho.module.scss"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { limparCarrinho, removerItem } from "@/store/cartSlice";
import { Button, Card, Dialog, DialogContent, IconButton } from "@mui/material";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import SliderItem from "@/components/slider/slider-item.component";
import Image from "next/image";

const types = {
    PIX: "PIX",
    MERCADO_PAGO: "MERCADO_PAGO",
    PICPAY: "PICPAY"
}
const typesDesc :any = {
    PIX: "PIX",
    MERCADO_PAGO: "MERCADO PAGO",
    PICPAY: "PICPAY"
}

export default function Cart() {
    const itens: any = useSelector((state: RootState) => state.cart.itens);
    const dispatch = useDispatch();
    const [payment, setPayment] = useState<string>("");
    const [error, setErrors] = useState<string | null>(null)




    const total = itens.reduce((acc: any, item: any) => acc + item.preco * item.quantidade, 0);
    const enviarMetodo = (method: string) => {
        setPayment(method)
        setErrors("")
    }
    const handleWhatsCart = () => {
        if (payment == "") {
            setErrors("* Selecione um método ao menos.")
            return;
        }
        const itemsText = itens.map((item: any) => `${item.nome} - ${item.quantidade}x R$ ${Number(item.preco).toFixed(2)}`).join("\n");
        const text = `Desejo adquirir os seguintes itens:\n${itemsText}\nTotal: R$ ${total.toFixed(2)}\nMétodo de pagamento: ${typesDesc[payment]}`;
        dispatch(limparCarrinho())
        return window.open(`http://api.whatsapp.com/send/?phone=554588403532&text=${encodeURIComponent(text)}&type=phone_number&app_absent=`, "_blank");
    };
    return (
        <div className={`${styles.content} ${styles.d_center}`}>
            <title>Carrinho</title>
            <div className={`max-layout ${styles.content} ${styles.d_btw}`}>
                <div className={styles.cart_items}>
                    <div className={`${styles.title_cart} title`}>Seu carrinho</div>
                    <ul className={styles.items}>
                        {itens.map((item: any, index: number) => (
                            <li key={item.id} className={styles.cart_item}>

                                <div className={styles.item_info}>
                                    <div className={styles.image_content}>
                                        {item.images != null && item.images.length > 0 ? (
                                            <SliderItem images={item.images} key={index} />
                                        ) : null}
                                    </div>
                                    <div className={styles.item_description}>
                                        <div className={styles.item_title}>
                                            {item.nome}
                                        </div>
                                        <div>
                                            {item.quantidade} x R$ {Number(item.preco).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.btn_delete} >
                                    <IconButton onClick={() => dispatch(removerItem(item.id))}>
                                        <FontAwesomeIcon icon={faTrash} size={"sm"} color="#fff" />
                                    </IconButton>

                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={`${styles.sub_total}`}>
                    <div className={`${styles.title_cart} title`}>Subtotal</div>
                    <div className={`${styles.items_sub}`}>
                        <div className={styles.total_price}>
                            <h2>Total: R$ {total.toFixed(2)}</h2>
                            <div className={styles.total_price_desc}>
                                {itens.map((item: any, index: number) => (
                                    <p key={index}>{item.nome} - {item.quantidade}x {Number(item.preco).toFixed(2)}</p>
                                ))}
                            </div>
                        </div>
                        <div>
                            {itens.length > 0 && (
                                <div className={styles.buttons_cart}>
                                    <div className={styles.payment_form}>
                                        <div>
                                            Selecione a froma de pagamento:

                                        </div>
                                        <div className={styles.error}>
                                            {error}
                                        </div>
                                        <div className={styles.method}>
                                            <Button onClick={() => enviarMetodo(types.PIX)} className={`${payment == types.PIX ? styles.selected : ''}`}>
                                                <Image
                                                    src={`/assets/Pagamento/${types.PIX}.png`}
                                                    width={70}
                                                    height={35}
                                                    alt="Pagar com Pix"

                                                />
                                            </Button>
                                            <Button onClick={() => enviarMetodo(types.MERCADO_PAGO)} className={`${payment == types.MERCADO_PAGO ? styles.selected : ''}`}>
                                                <Image
                                                    src={`/assets/Pagamento/${types.MERCADO_PAGO}.png`}
                                                    width={90}
                                                    height={35}
                                                    alt="Pagar com Mercado pago"

                                                />
                                            </Button>
                                            <Button onClick={() => enviarMetodo(types.PICPAY)} className={`${payment == types.PICPAY ? styles.selected : ''}`}>
                                                <Image
                                                    src={`/assets/Pagamento/${types.PICPAY}.png`}
                                                    width={90}
                                                    height={35}
                                                    alt="Pagar com Mercado pago"

                                                />
                                            </Button>
                                        </div>

                                    </div>
                                    <Button variant="outlined" onClick={() => dispatch(limparCarrinho())}>Limpar Carrinho</Button>
                                    <Button variant="outlined" className={styles.btn_buy} onClick={() => handleWhatsCart()}>
                                        Solicitar compra
                                    </Button>
                                </div>
                            )}

                        </div>
                    </div>
                </div>


            </div>
        </div>
    )

}