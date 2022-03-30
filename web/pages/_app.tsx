import 'rsuite/dist/rsuite.min.css';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react'
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import 'reflect-metadata';

import store from '@app/store';
import { initTranslation } from '@common/i18n';

initTranslation(i18n);

export default function App({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps) {
  const router = useRouter();
  const locale = router.locale || router.defaultLocale as string;
  const firstRender = useRef(true);

  if (pageProps.translation && firstRender.current) {
    i18n.load(locale, pageProps.translation);
    i18n.activate(locale);
    firstRender.current = false;
  }

  useEffect(() => {
    console.log(pageProps);
    if (pageProps.translation) {
      i18n.load(locale, pageProps.translation);
    }
    i18n.activate(locale);
  }, [locale, pageProps.translation]);

  return (
    <I18nProvider i18n={i18n}>
      <Provider store={store}>
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </Provider>
    </I18nProvider>
  );
};
