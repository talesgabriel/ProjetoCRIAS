import "./globals.css";
import { Poppins } from "next/font/google";
import '@fortawesome/fontawesome-free/css/all.min.css';


export const metadata = {
  title: "CRIAS - Empresa Júnior",
  description: "Empresa Júnior de Comunicação da UERN",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-poppins",
});

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="{poppins.className">
        {children}
      </body>
    </html>
  );
}