import { useTranslations } from "next-intl"

export default function Footer() {
    const t = useTranslations("footer")
    return (
        <>
            <footer className="footer">
                <div className="container_footer">
                    <div className="footer_left">
                        <div>
                            <h2 className="footer_text">{t('payment_method')}</h2>
                            <img src="/assets/Pagamento/payment_methods.png" alt="MetodosPag" className="img_footer" />
                        </div>
                        <div className="footer_contato">
                            <h2 className="footer_text">{t('contact')}</h2>
                            <p>+55 (45) 9 8840-3532</p>
                        </div>
                    </div>

                </div>
                <div className="footer_right">
                    <img src="/assets/Logo/LOGOTIPO_RODAPÉ.svg" alt="logo-rodapé" className="img_footer_logo" />
                </div>
            </footer>
            <div className="link_portfolio">
                <a href="https://linktr.ee/RudMon?utm_source=linktree_admin_share" target="_blank">
                    <h5>Azevedo Store @2024 by RudMon</h5>
                </a>
            </div>
        </>
    )
}