'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './carrinho-flutuante.module.scss';
import useExibirCarrinho from '@/app/util/helper.util';

export default function CarrinhoFlutuante() {
    const exibirCarrinho = useExibirCarrinho(); // hook chamado no topo!
    const itens = useSelector((state: RootState) => state.cart?.itens || []);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Agora podemos condicionar o retorno
    if (!exibirCarrinho || !isClient) return null;

    const total = itens.reduce((sum, item) => sum + item.quantidade, 0);
    if (total === 0) return null;

    return (
        <>
            <Link href="/carrinho">
                <div className={styles.link_carrinho}>
                    <div className={styles.icon_div}>
                        <ShoppingCartIcon className={styles.icon} />
                    </div>
                    <div className={styles.counter}>
                        {total} item{total > 1 ? 's' : ''}
                    </div>
                </div>
            </Link>

        </>
    );
}
