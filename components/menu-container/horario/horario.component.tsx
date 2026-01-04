import { useTranslations } from "next-intl";
import styles from "./horario.module.scss"
export default function Horario() {
    const t = useTranslations('static');
    return (
        <div className={styles.container_horario}>
            <h2 className="text">{t('time_open')} 08:00 ÀS 23:59</h2>
        </div>
    )
}