import "../styles/globals.css";
import type { AppProps } from "next/app";
import { GlobalStateProvider } from "../components/GlobalState";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GlobalStateProvider>
      <Component {...pageProps} />
    </GlobalStateProvider>
  );
}

export default MyApp;
