import type { Metadata } from "next";

import "../../public/css/global.css"
import "../../public/css/globals.scss";
import "../../public/css/style.css"
import Header from "../../components/header/header.component";
import Banner from "../../components/banner/banner.component";
import MenuContainer from "../../components/menu-container/menu-container.component";
import SubMenu from "../../components/sub-menu/sub-menu.component";
import { fetchMenus } from "../lib/menu"
import ReduxProvider from "@/store/provider";
import CarrinhoFlutuante from "@/components/carrinho/carrinho-flutuante";
import Footer from "@/components/footer/footer.component";

//INTL
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";


export const metadata: Metadata = {
  title: 'Azevedo Store',
  description: 'kks, KKS, ragnarok, Ragnarok, venda kks, venda KKS, venda Itens',
};

export default async function RootLayout({
  params,
  children,
}: Readonly<{
  children: React.ReactNode,
  params: Promise<{ locale: string }>;
}>) {
  const menus = await fetchMenus()
  const messages = await getMessages();
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <main>
            <ReduxProvider>
              <Header />
              <Banner />
              <MenuContainer />
              {menus && menus.length > 0 ? <SubMenu menus={menus} /> : null}

              <div style={{ minHeight: 350 }}>
                {children}
              </div>
              <CarrinhoFlutuante />
              <Footer />
            </ReduxProvider>

          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
