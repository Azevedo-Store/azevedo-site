'use client';
import styles from "./itens.module.scss"
import Item from '../../../../components/item/item.component';


import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { adicionarItem } from "@/store/cartSlice";

export default function Page() {
  const params: any = useParams<{ tag: string; item: string }>();
  const [itens, setItens] = useState<Array<any>>();
  const [carregando, setCarregando] = useState(true);
  const [prm, setPrm] = useState("")
  const dispatch = useDispatch();
  const handleAdd = (item: any) => {
    const it = {
      id: item.id,
      nome: item.name,
      preco: item.value,
      images: item.image_itens
    }
    dispatch(adicionarItem({ ...it, quantidade: 1 }));
  };

  useEffect(() => {
    const vendas = params['itens'];
    if (!vendas) return;

    const consultar = async () => {
      let mn = "";
      try {
        let res;
        if (vendas.length > 1) {
          res = await fetch(`/api/itens/consultar/por-sub-menu/${vendas[0]}/${vendas[1]}`);
          const menuRes: any = await fetch(`/api/menu/consultar/por/menu/${vendas[0]}`);
          const subMenuRes: any = await fetch(`/api/menu/consultar/por/sub-menu/${vendas[1]}`);
          const mnt = await menuRes.json();
          const sbmn = await subMenuRes.json();
          mn = `${mnt?.title} - ${sbmn?.title}`
        } else {
          res = await fetch(`/api/itens/consultar/por-menu/${vendas[0]}`);
          const menuRes: any = await fetch(`/api/menu/consultar/por/menu/${vendas[0]}`);
          const mnt = await menuRes.json();
          mn = `${mnt.title}`
        }

        if (!res.ok) {
          console.error("Erro ao buscar itens:", res.status);
          return;
        }

        const data = await res.json();
        setPrm(mn)
        setItens(data);

      } catch (error) {
        console.error("Erro na requisição:", error);
      } finally {
        setCarregando(false);
      }
    };

    consultar();
  }, [params]);

  if (carregando) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={`${styles.content} ${styles.d_center}`}>
      <title>{prm}</title>
      <div className=" max-layout-400 ">

        <div className={styles.itens_content}>
          {itens && itens.length > 0 ? (
            itens.map((item: any, index) => (
              <Item item={item} key={index} handleAdd={handleAdd} />
            ))
          ) : (
            <p>Nenhum item encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}
