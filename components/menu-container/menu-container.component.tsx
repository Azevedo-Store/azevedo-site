import { IconButton, MenuItem } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Menu from "../../components/menu-container/menu/menu.component";
import Horario from "./horario/horario.component";
import styles from './menu-container.module.scss'
import { BarChartSharp } from "@mui/icons-material";
export default function MenuContainer() {

    return (
        <div className={styles.container}>
       
            <Menu />
            <Horario />
        </div>
    )
}