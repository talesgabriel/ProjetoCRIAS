import Header from "@/components/Header";
import HomeSection from "@/components/HomeSection";
import Metricas from "@/components/Metricas";
import NossaHistoria from "@/components/NossaHistoria";
import NossosPilares from "@/components/NossosPilares";
import EstruturaOrganizacional from "@/components/EstruturaOrganizacional";
import Portfolio from "@/components/Portfolio";
import Noticias from "@/components/Noticias";
import Contato from "@/components/Contato";
import Footer from "@/components/Footer";

export default function AdminPanel() {
  return (
    <>
      <Header />
      <HomeSection />
      <Metricas />
      <NossaHistoria />
      <NossosPilares />
      <EstruturaOrganizacional />
      <Portfolio />
      <Noticias />
      <Contato />
      <Footer />
    </>
  );
}