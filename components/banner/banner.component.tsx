import styles from "./banner.module.scss"
import Script from "next/script"
export default function Banner() {
    return (
        <div className={`swiper`}>
            <div className={` swiper-wrapper`}>
                <div className={`swiper-slide`}>
                    <a href="/"><img src="/assets/Banners/Banner1-FachadaV2_DESKTOP.jpg" alt="Imagem-KK"
                        id={styles.cr_desktop} /></a>
                    <a href="/"><img src="/assets/Banners/Banner1-FachadaV2_MOBILE.jpg" alt="Imagem-KK M"
                        id={styles.cr_mobile} /></a>

                </div>
                <div className={`swiper-slide`}>
                    <a href="/"><img src="/assets/Banners/Banner2-Fachada_Desktop.jpg" alt="Imagem-Quit"
                        id={styles.cr_desktop} /></a>
                    <a href="/"><img src="/assets/Banners/Banner2-Fachada_Mobile.png" alt="imagem-Quit M"
                        id={styles.cr_mobile} /></a>
                </div>

            </div>

            <div className={`swiper-button-prev`}><img src="/assets/Icones/seta.svg" alt="seta" className={`${styles.button_nav} ${styles.prev}`} /></div>
            <div className={`swiper-button-next`}><img src="/assets/Icones/seta.svg" alt="seta" className={`${styles.button_nav} ${styles.next}`} /></div>
            <Script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js" />
            <Script src="/scripts/swiper-init.js" />
        </div>
    )
}