import React, { ReactElement, ReactNode } from "react";
import { ConfigProvider } from "antd";
import type { AppProps } from "next/app";
import theme from "@/theme/themeConfig";
import { NextPage } from "next";
import "@ant-design/v5-patch-for-react-19";
import es_ES from "antd/locale/es_ES";
import "leaflet/dist/leaflet.css";
import { App as AntdAppProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { addJWTInterceptor } from "@/services/axios.interceptor";
import { apiClient } from "@/services/clients";
export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  const queryClient = new QueryClient();
  addJWTInterceptor(apiClient);
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={theme} locale={es_ES}>
        <AntdAppProvider>
          {getLayout(<Component {...pageProps} />)}
        </AntdAppProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
