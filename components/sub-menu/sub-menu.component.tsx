'use client'
import useExibirCarrinho from "@/app/util/helper.util";
import styles from "./sub-menu.module.scss"
import { DoubleArrow } from "@mui/icons-material";
export default function SubMenu({ menus }: { menus: any[] }) {
    if(!useExibirCarrinho()) return;
    return (
        <nav className={styles.menu_lateral}>
            <ul>
                {menus.map((menu: any) => (
                    <li key={menu.id}
                    ><a href={`/itens/${menu.slug}`} className={`${styles.multi_arrow}`}><span>{menu.title}</span> { (menu?.sub_menus && menu?.sub_menus.length > 0) ? <DoubleArrow /> : null}</a>
                        {menu?.sub_menus ? (
                            <ul className={styles.submenu}>

                                {menu.sub_menus.map((sub: any) => (
                                    <li key={sub?.id}>
                                        <a href={`/itens/${menu.slug}/${sub?.slug}`}>{sub?.title} </a>
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </li>
                ))}

            </ul>
        </nav>
    )
}