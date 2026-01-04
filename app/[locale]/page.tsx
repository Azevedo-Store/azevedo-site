'use client'
import CurrencyKksInput from "@/components/currency-kks-input/currency-kks-input.component";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Russo_One } from 'next/font/google';
const russoOne = Russo_One({ subsets: ['latin'], weight: '400', display: 'swap' });
import { use, useEffect, useState } from "react";


export default function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);

  const DEFAULT_PERCENTAGE = 1.16;

  const [vendas, setVendas] = useState<Array<any>>([])
  const [cotacao, setCotacao] = useState<any>(null)
  const [configZeny, setConfigZeny] = useState<any>([])
  const DEFAULT_ZENY = 1_000_000;
  const t_buy_without_limit = useTranslations('buy_without_limit');
  const t_home = useTranslations('home');
  const [zenyObj, setZenyObj] = useState<any>({})
  const intlFormat: any = {
    "pt": {
      pais: "pt-BR",
      moeda: "BRL"
    },
    "en": {
      pais: "en-US",
      moeda: "USD"
    },
    "es": {
      pais: "en-US",
      moeda: "USD"
    },
  }

  function formatNumber(value: number): string {
    if (value >= 1_000_000_000) return `${value / 1_000_000_000} B`;
    if (value >= 1_000_000) return `${value / 1_000_000} kk`;
    return value.toString();
  }
  const increment = (amount: number) => {
    const valor = (zenyObj.zeny + amount);
    setZenyObj((prev: any) => ({ ...prev, zeny: valor }));
    atualizarValor(valor)


  }
  const decrement = (amount: number) => {
    let valor = zenyObj.zeny - amount;
    if (valor < DEFAULT_ZENY) valor = DEFAULT_ZENY
    setZenyObj((prev: any) => ({ ...prev, zeny: valor }));
    atualizarValor(valor)

  }
  const carregarCotacao = async () => {
    const res = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL,ARS-BRL');
    const converted = await res.json() || [];
    setCotacao(converted)
  }
  const calcServer = (server: string) => {
    const srv = configZeny[server];
    const vlr = formatPrice(srv['v']);
    setZenyObj({ zeny: DEFAULT_ZENY, valor: vlr, balanco: `${srv['k']} - ${vlr}`, server, valor_balanco: srv['v'] })
  }


  const carregarConfigZeny = async () => {
    const rest = await fetch('/api/configuracoes/listar');
    const converted = await rest.json() || [];
    if (!converted || converted.length < 1) {
      return;
    }
    const obj: any = {}
    converted.forEach((re: any) => {
      obj[re.key] = { k: re.key.replace("_", " "), v: calcCurrencyByLocale(re.value), org_srv: re.key, name: re.key.replaceAll("ZENY_", "") }
    });
    const freya = obj['ZENY_FREYA'];
    if (freya) {
      const vlr = formatPrice(freya['v']);
      setZenyObj({ zeny: DEFAULT_ZENY, valor: vlr, balanco: `${freya['k']} - ${vlr}`, server: "ZENY_FREYA", valor_balanco: freya['v'] })
    } else {
      const key = Object.keys(obj)[0];
      const ob = obj[key]
      const vlr = formatPrice(ob['v']);
      setZenyObj({ zeny: DEFAULT_ZENY, valor: vlr, balanco: `${ob['k']} - ${vlr}`, server: key, valor_balanco: ob['v'] })

    }

    setConfigZeny(obj)
  }

  const atualizarValor = (zeny: number) => {
    const calc = (Number(zenyObj.valor_balanco) / 1000000)
    const vlr = Number(zeny * calc);



    setZenyObj((prev: any) => ({ ...prev, valor: `${formatPriceUnlimited(Number(vlr))}` }));
  }


  const carregarVendas = async () => {
    const rest = await fetch('/api/venda/todos');
    const converted = await rest.json() || [];
    setVendas(converted)
  }
  const formatPriceUnlimited = (price: number) => {
    return new Intl.NumberFormat(intlFormat[locale].pais, { style: "currency", currency: intlFormat[locale].moeda, minimumFractionDigits: 2 }).format(price)
  }
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(intlFormat[locale].pais, { style: "currency", currency: intlFormat[locale].moeda }).format(price)
  }
  const checkClassPrice = (price: number, server: string) => {
    const resp = formatPrice(price).length
    if (server === 'history') {
      if (resp > 10)
        return `price-position-history-11`;
      else if (resp < 10 && resp > 8) {
        return 'price-position-history-8'
      }else{
        return 'price-position-history';
      }
    }
    if (resp > 10)
      return `price-position-11`;
    else if (resp < 10 && resp > 8) {
      return 'price-position-8'
    }
    return 'price-position';
  }

  const checkClassDescription = (description: string) => {
    const resp = description.length
    if (resp > 10)
      return `position-desc-11`;
    else if (resp < 10 && resp > 8) {
      return 'position-desc-8'
    }
    return 'position-desc';
  }

  useEffect(() => {
    carregarCotacao()
  }, [])
  useEffect(() => {
    carregarVendas();
    carregarConfigZeny();
  }, [cotacao])

  const calcCurrencyByLocale = (valor: number) => {
    const ctc = {
      dolar: parseFloat(cotacao?.USDBRL.bid),
      peso: parseFloat(cotacao?.ARSBRL.bid)
    }
    const dolarCalc = (valor / ctc.dolar)
    const ct: any = {
      'pt': valor,
      'en': (dolarCalc * DEFAULT_PERCENTAGE).toFixed(2),
      'es': dolarCalc * DEFAULT_PERCENTAGE
    }
    return ct[locale as string]
  }

  return (
    <>

      <main className={russoOne.className}>

        <div className="container_precos">
          {(configZeny && Object.keys(configZeny).length > 0) ? (
            <div className={`unlimite_buy max-layout-400`}>
              <div className="">
                <span className="warning">Obs:.{t_buy_without_limit("obs")} 1kk = 1.000.000 Zenys</span>
              </div>
              <div className="flex justify-items-center justify-center flex-col px-5">
                <span className="texto-dourado zeny">{t_buy_without_limit("buy_no_limit")}</span>
                <CurrencyKksInput decrement={decrement} increment={increment} value={zenyObj.zeny || ''} />
                <div className="form-button">

                  <div className="flex flex-col sm:flex-row justify-items-center justify-center space-y-2 space-x-2  w-full ">
                    <div className="flex flex-col w-full justify-items-center justify-center">
                      <label className="text-sm font-medium text-gray-700">{t_buy_without_limit("total_amount")}</label>
                      <span className="w-full text-center text-lg font-semibold space-x-2 border rounded-md px-3 py-2">{zenyObj.valor || ''}</span>
                    </div>
                    <div className="flex flex-col w-full justify-items-center justify-center">
                      <label className="text-sm font-medium text-gray-700">{t_buy_without_limit("actual_amount_server")}</label>
                      <span className="w-full text-center text-lg font-semibold  space-x-2 border rounded-md px-3 py-2">{zenyObj.balanco || ''}</span>
                    </div>
                    <div className="flex flex-col w-full justify-items-center justify-center">
                      <label className="text-sm font-medium text-gray-700">{t_buy_without_limit("server_want_buy")}</label>
                      <select onChange={(e) => calcServer(e.target.value)}
                        className="border rounded-md px-3 py-2"
                        defaultValue={configZeny['ZENY_FREYA']?.org_srv || configZeny['ZENY_NIDHOGG']?.org_srv || configZeny['ZENY_YGGDRASIL']?.org_srv}>
                        {Object.keys(configZeny)?.map((zn: any, index: number) => (
                          <option value={`${configZeny[zn].org_srv}`} key={index}>{configZeny[zn].name}</option>

                        ))}

                      </select>
                    </div>
                    <div className="flex flex-col w-full justify-items-center justify-center">
                      <button className="btt">
                        <a target="_blank"
                          href={`https://wa.me/554588403532?text=Olá!%20Desejo%20adquirir%20${formatNumber(zenyObj.zeny)}%20por%20${zenyObj.valor}%20${t_home("zeny_seller.currency_desc")}%20no%20${zenyObj.server?.replaceAll("ZENY_", "")},%20vim%20pelo%20site.`}
                        >
                          <span className="btn_vd">{t_buy_without_limit("btn_finish_whatsapp")}</span></a>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="itens-venda max-layout-400" style={{ minHeight: '400px' }}>
            {vendas.length === 0 ? (
              <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>Carregando ofertas...</div>
            ) : (
              vendas.map((venda, index) => (
                <div className="preco-image" key={index}>
                  <div className={`${checkClassPrice(venda.value, venda.server.toLowerCase())} texto-dourado`}>{formatPrice(calcCurrencyByLocale(venda.value))}</div>
                  <div><Image src={`/assets/Precos/${venda.server.toLowerCase()}.png`} width={350} height={350} alt="" /></div>
                  <div className={`${checkClassDescription(venda.description)} texto-dourado`}>{venda.description}</div>
                  <div className="btn-venda">
                    <button className="btt">
                      <a href={`https://wa.me/554588403532?text=Olá!%20Desejo%20adquirir%20${venda.description}%20por%20${formatPrice(calcCurrencyByLocale(venda.value))}%20${t_home("zeny_seller.currency_desc")}%20no%20${venda.server},%20vim%20pelo%20site.`} target="_blank"><span className="button_top">{t_home("zeny_seller.btn_buy")}</span></a>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>


        </div>

        <div className="container-quit">
          <a href="/venda-seus-itens" className="link_quit">
            <Image src="/assets/Quit/@QUIT-mobile.png" alt="quit-mobile" className="quit-mobile" width={356} height={198} style={{ width: '356px', height: '198px' }} quality={70} priority />
          </a>
          <a href="/venda-seus-itens" className="link_quit">
            <Image src="/assets/Quit/@QUIT-desktop.png" alt="quit-desktop" className="quit-desktop" width={1114} height={356} style={{ width: '1114px', height: '356px' }} quality={70} priority />
          </a>
        </div>




        <div className="container_pag" style={{ minHeight: '180px' }}>
          <Image src="/assets/Pagamento/Banner-Pagamentos.png" alt="FormasDePagemento" className="img_pag_desk" id="desktop" width={1292} height={342} style={{ width: '1292px', height: '342px' }} quality={70} priority />
          <Image src="/assets/Pagamento/Banner-Pagamentos-mobile.png" alt="FormasDePagemento" className="img_pag_mobile" id="mobile" width={743} height={400} style={{ width: '743px', height: '400px' }} quality={70} priority />
        </div>


        <div className="container_grupo referencias">
          <a href="https://www.facebook.com/groups/referencias.ragnarok/permalink/2557545274460134/" target="blank" id="desktop" className="link_ref">
            <Image src="/assets/Banners/Banner_Referencias.jpg" alt="referencias" id="desktop" className="img_grupo_desktop" width={1466} height={323} style={{ width: '1466px', height: '323px' }} quality={70} priority />
          </a>

          <div className="grupo_mobile">
            <a href="https://www.facebook.com/groups/referencias.ragnarok/permalink/2557545274460134/" target="blank" className="link_ref">
              <Image src="/assets/Banners/Banner_Referencias.jpg" alt="referencias" id="mobile" className="img_grupo_mobile" width={400} height={180} style={{ width: '400px', height: '180px' }} quality={70} priority />
            </a>
          </div>
        </div>



      </main >



    </>
  );
}
