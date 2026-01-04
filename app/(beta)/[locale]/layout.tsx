import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from "next-intl/server";
import ReduxProvider from "@/store/provider";
import { hasLocale } from 'next-intl';
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import './../css/globalBeta.scss';
import './../css/reset.css';

export default async function BetaRootLayout({
  params,
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ReduxProvider>
            <main>
              <div>
                {children}
              </div>
            </main>
          
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}