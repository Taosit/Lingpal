import "@/styles/global.css";
import Layout from "../components/Layout";
import { SocketContextProvider } from "@/contexts/SocketContext";
import { AppProps } from "next/app";
import PrivateRoute from "@/components/PrivateRoute";

type Props = AppProps & {
  Component: {
    requireAuth?: boolean;
  };
};

export default function App({ Component, pageProps }: Props) {
  return (
    <SocketContextProvider>
      <Layout>
        {Component.requireAuth ? (
          <PrivateRoute>
            <Component {...pageProps} />
          </PrivateRoute>
        ) : (
          // public page
          <Component {...pageProps} />
        )}
      </Layout>
    </SocketContextProvider>
  );
}
