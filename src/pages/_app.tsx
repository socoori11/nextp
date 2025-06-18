import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import NavBar from "@/com/NavBar";

export default function App({ Component, pageProps }: AppProps) {
  return (
  <>
   <NavBar />
   <Component {...pageProps} />
   </>
   );
}
