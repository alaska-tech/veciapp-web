import React, { ReactElement, ReactNode } from "react";
import { ConfigProvider } from "antd";
import type { AppProps } from "next/app";
import theme from "@/theme/themeConfig";
import { NextPage } from "next";
import "@ant-design/v5-patch-for-react-19";
import es_ES from "antd/locale/es_ES";
import "leaflet/dist/leaflet.css";
import { App as AntdAppProvider } from "antd";
export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ConfigProvider theme={theme} locale={es_ES}>
      <AntdAppProvider>
        {getLayout(<Component {...pageProps} />)}
      </AntdAppProvider>
    </ConfigProvider>
  );
};

export default App;
