import "@/styles/globals.css";import Header from "@/components/Header";

import "@/styles/globals.css"; // ou "../styles/globals.css"
import "@fortawesome/fontawesome-free/css/all.min.css";

import { Poppins } from "next/font/google";
import Head from "next/head";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export default function MyApp({ Component, pageProps }) {
  const title = Component.title ?? "CRIAS - Empresa Júnior";
  const description =
    Component.description ?? "Empresa Júnior de Comunicação da UERN";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={poppins.className}>
        <Component {...pageProps} />
      </main>
    </>
  );
}
