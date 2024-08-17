import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from 'next-i18next';
import nextI18nConfig from './i18n';
import { Noto_Sans_Thai } from 'next/font/google';

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['400', '700'], // Specify the weights you want to use
});

function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <div className={notoSansThai.className}>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}

export default appWithTranslation(App, nextI18nConfig);
