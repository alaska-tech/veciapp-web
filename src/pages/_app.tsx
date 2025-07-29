import React, { ReactElement, ReactNode } from "react";
import { ConfigProvider } from "antd";
import type { AppProps } from "next/app";
import theme from "@/theme/themeConfig";
import { NextPage } from "next";
import "@ant-design/v5-patch-for-react-19";
import es_ES from "antd/locale/es_ES";
import "leaflet/dist/leaflet.css";
import { App as AntdAppProvider } from "antd";
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { addJWTInterceptor } from "@/services/axios.interceptor";
import { apiClient } from "@/services/clients";
import { AnimatePresence, motion } from "framer-motion";
export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  addJWTInterceptor(apiClient);
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <ConfigProvider theme={theme} locale={es_ES}>
      <AntdAppProvider>
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={pageProps.dehydratedState}>
            <ReactQueryDevtools initialIsOpen={false} />
            <AnimatePresence mode="wait">
              <motion.div
                key={
                  Component.displayName ||
                  Component.name ||
                  pageProps?.key ||
                  "page"
                }
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                style={{ height: "100%" }}
              >
                {getLayout(<Component {...pageProps} />)}
              </motion.div>
            </AnimatePresence>
          </HydrationBoundary>
        </QueryClientProvider>
      </AntdAppProvider>
    </ConfigProvider>
  );
};

export default App;
