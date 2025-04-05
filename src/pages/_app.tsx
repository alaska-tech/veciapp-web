import React, { ReactElement, ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import theme from '@/theme/themeConfig';
import { NextPage } from 'next';
import '@ant-design/v5-patch-for-react-19';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ConfigProvider theme={theme}>
      {getLayout(<Component {...pageProps} />)}
    </ConfigProvider>
  )
};

export default App;
