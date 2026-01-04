import styles from "./venda.module.scss"
export default function VendaSeusItens(){
    return <div className={`${styles.content} ${styles.d_center}`} style={{padding: 15}}>
        <a href="https://wa.me/554588403532?text=Quero%20vender%20zenys%20ou%20itens." target="_blank">
            <img src={'/assets/Quit/venda_aqui.jpg'} className={styles.desktop}/>
            <img src={'/assets/Quit/venda_mobile.jpg'} className={styles.mobile} />
        </a>
    </div>
}