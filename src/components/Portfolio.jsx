import PortfolioCard from "@/components/PortfolioCard";

export default function Portfolio() {
  return (
    <section id="portfolio" className="portfolio">
      <span className="tag">Portfólio</span>

      <h2>Projetos que <span className="laranja">Transformam</span></h2>

      <p>Conheça alguns dos trabalhos que realizamos com dedicação e criatividade</p>

      <div className="cards2">
        <PortfolioCard />
        <PortfolioCard />
        <PortfolioCard />
      </div>
    </section>
  );
}
