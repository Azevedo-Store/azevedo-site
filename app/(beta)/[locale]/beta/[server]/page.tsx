import Image from 'next/image';
import style from './server.module.scss';
import Link from 'next/link';
import React from 'react';
export default function ServerPage() {

  // Configuração da ordem das seções
  const sectionsOrder = [
    { type: "ZENY", title: "Zeny", ordem: 1 },
    { type: "ITEM", title: "Items", ordem: 2 }
  ];

  const items = [
    {
      name: "Katar do Desespero",
      desc: "ATQ +120 • Crítico +10% • Dano em MVP +20%",
      price: "150.00",
      type_seller: "ITEM",
      item_icon: "https://game.ragnaplace.com/ro/bro/collection/13027.webp",
      promotion: {
        after: "120.00",
        before: "150.00",
        off: "20%"
      },
      ordem: 1
    },
    {
      name: "100.000.000 Zeny",
      desc: "",
      price: "0.79",
      type_seller: "ZENY",
      ordem: 3,
      promotion: {
        after: "120.00",
        before: "150.00",
        off: "20%"
      },
    },
    {
      name: "100.000.000 Zeny",
      desc: "",
      price: "0.79",
      type_seller: "ZENY",
      ordem: 5
    },
    {
      name: "100.000 Zenys",
      desc: "",
      price: "1.50",
      type_seller: "ZENY",
      ordem: 1
    },
    {
      name: "100.000.000 Zeny",
      desc: "",
      price: "0.79",
      type_seller: "ZENY",
      ordem: 4
    },
    {
      name: "100.000 Zenys",
      desc: "",
      price: "1.50",
      type_seller: "ZENY",
      ordem: 2
    },
    {
      name: "100.000.000 Zeny",
      desc: "",
      price: "0.79",
      type_seller: "ZENY",
      ordem: 6
    },
    {
      name: "100.000 Zenys",
      desc: "",
      price: "1.50",
      type_seller: "ZENY",
      ordem: 7
    }
  ]
  return (
    <>
      <div className='max-width-container'>
        <div className={style.content}>
          <div>
            <Link href="/beta">
              <Image
                src="/assets/beta/temp3.png"
                alt="Beta Warning"
                width={300}
                height={300} />
            </Link>
          </div>
          <div className={`${style.title_main} ${style.center}`}> <h1>Loja - Rargnarok Latam</h1></div>

          {sectionsOrder.sort((a, b) => a.ordem - b.ordem).map((section, sectionIndex) => {
            if (section.type === "ZENY") {
              return (
                <React.Fragment key={`zeny-${sectionIndex}`}>
                  <div className={`${style.title} ${style.center}`}> <h2>Zeny</h2></div>

                  <div className={style.items}>
                    {items
                      .filter(item => item.type_seller === "ZENY")
                      .sort((a, b) => a.ordem - b.ordem)
                      .map((item, index) => {
                        return (
                          <div className={style.item_card} key={index}>
                            <img className={style.item_icon} src="/assets/beta/zeny_icon.png" />
                            <h3 className={style.item_name}>{item.name}</h3>
                            <p className={style.item_desc}>{item.desc}</p>

                            <div className={style.item_price}>
                              {item.promotion != null ? (
                                <div className={style.promotion_price}>
                                  <span className={style.price_before}>R$ {item.promotion.before}</span>
                                  <span className={style.price_after}>R$ {item.promotion.after}</span>
                                </div>
                              ) : (<span>R$ {item.price}</span>)}

                            </div>


                            <div className={style.btn_space}>
                              <button className={style.buy_btn}>Comprar</button>
                            </div>
                            {item.promotion != null && (
                              <div className={style.promotion_badge}>
                                {item.promotion.off} OFF
                              </div>
                            )}
                          </div>
                        )
                      })}
                  </div>
                </React.Fragment>
              );
            } else if (section.type === "ITEM") {
              return (
                <React.Fragment key={`item-${sectionIndex}`}>
                  <div className={`${style.title} ${style.center}`}>
                    <h2>Items</h2>
                  </div>
                  <div className={style.items}>
                    {items
                      .filter(item => item.type_seller === "ITEM")
                      .sort((a, b) => a.ordem - b.ordem)
                      .map((item, index) => {
                        return (
                          <div className={style.item_card} key={index}>

                            <img className={style.item_icon} src={item.item_icon} />
                            <h3 className={style.item_name}>{item.name}</h3>
                            <p className={style.item_desc}>{item.desc}</p>

                            <div className={style.item_price}>
                              {item.promotion != null ? (
                                <div className={style.promotion_price}>
                                  <span className={style.price_before}>R$ {item.promotion.before}</span>
                                  <span className={style.price_after}>R$ {item.promotion.after}</span>
                                </div>
                              ) : (<span>R$ {item.price}</span>)}

                            </div>

                            <div className={style.btn_space}>
                              <button className={style.buy_btn}>Comprar</button>
                            </div>
                            {item.promotion != null && (
                              <div className={style.promotion_badge}>
                                {item.promotion.off} OFF
                              </div>
                            )}
                          </div>
                        )
                      })}
                  </div>
                </React.Fragment>
              );
            }
            return null;
          })}

        </div>

      </div>
      <footer>
        <div className='footer-section one max-width-container'>
          <Link href="/beta">
            <Image
              src="/assets/beta/temp3.png"
              alt="Beta Warning"
              width={300}
              height={300} />
          </Link>
          <div className='footer-links'>
            <div>
              <h2>Formas de Pagamento</h2>
              <div>
                PIX
              </div>
                <div>
                Mercado Pago 5% de taxa
              </div>
              <div>
                PicPay
              </div>
            </div>
            <div>
              <h2>Formas de Pagamento</h2>
              <div>
                bla
                bla
                bla
                bla
              </div>
            </div>
          </div>
        </div>
        <div className='footer-section two max-width-container'>
          Azevedo Store 2026 © Todos os direitos reservados.
        </div>
      </footer>
    </>

  );
}   