'use client'
import style from "./header.module.scss"
import { usePathname, useRouter } from "next/navigation";
export default function Header() {
    const DEFAULT_PATH_IMAGES = "/assets/i18n/";
    const pathName = usePathname()


    const select_language = (lang: string) => {
        const path = pathName.split('/').slice(2).join("/");

        location.href = `/${lang.toLocaleLowerCase()}/${path}`
    }
    const bands = [
        {
            country: 'Idioma português do Brasil - Português - Portuguese',
            slug: "PT",
            band_src: DEFAULT_PATH_IMAGES + "BR.png"
        },
        {
            country: 'Idioma dos Estados Unidos - Inglês - English',
            slug: "EN",
            band_src: DEFAULT_PATH_IMAGES + "USA.png"
        },
        {
            country: 'Idioma da Argentina - Espanhõl - Spanish',
            slug: "ES",
            band_src: DEFAULT_PATH_IMAGES + "ESP.png"
        }
    ]
    return (
        <header >
            <link rel="shortcut icon" type="image/jpg" href="/assets/Icones/ragIco2.png" />

            <meta name="description" content="Zenys Ragnarok @Quit, zenys ragnarok @quit Compre e venda Zenys para Ragnarok Online no servidor Thor. Preços competitivos, pagamento instantâneo e atendimento 24/7. Zenys, KKs e equipamentos com a melhor cotação do mercado."></meta>
            <div className={style.top_header}>
                <a href="/" >
                    <img src="/assets/Logo/LOGOTIPO_HORIZONTAL.svg" alt="Logotipo" className={style.header_img} />
                </a>
                <div className={style.bands}>
                    {bands.map((band, index) => (
                        <button key={index} className="flex flex-col items-center" onClick={() => select_language(band.slug)}>
                            <span className="icon">
                                <img src={band.band_src} width={32} height={32} alt="" />
                            </span>
                            <span className="flex items-center">
                                {band.slug}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </header>
    )
}