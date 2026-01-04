'use client'
import { IconButton } from "@mui/material"
import styles from "./menu.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import { useTranslations } from "next-intl"

export default function Menu() {
      const t = useTranslations('home.navBar');
    
    const [opned,setOpned] = useState<boolean>(false)
    const handleMenu = () => setOpned(!opned)
    return <nav className={styles.sidebar}>
        <div className={styles.menu_icon}>
            <IconButton onClick={() => handleMenu()}>
                {opned ?  <FontAwesomeIcon icon={faClose} size={"sm"} color="#fff" />:  <FontAwesomeIcon icon={faBars}  color="#fff" />}
            </IconButton>
        </div>
        <ul className={opned ? styles.menu_open : styles.menu_closed}>
            <li><a href="/">{t("home")}</a></li>

            <li><a href="/venda-seus-itens">{t("seller_your_itens")}</a></li>
            <li><a href="https://www.facebook.com/groups/referencias.ragnarok/permalink/2557545274460134/" target="_blank">{t("our_references")}</a></li>
            <li><a href="https://wa.me/554588403532?text=Olá,%20poderia%20me%20tirar%20algumas%20dúvidas?" target="_blank">{t("contact")}</a></li>
        </ul >
    </nav >
}