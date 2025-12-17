import { useEffect, useState } from "react";
import PortfolioCard from "@/components/PortfolioCard";
import PortfolioModal from "@/components/PortfolioModal";

export default function Portfolio() {
  const [projetos, setProjetos] = useState([]);
  const [projetoSelecionado, setProjetoSelecionado] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/projetos")
      .then(res => res.json())
      .then(setProjetos)
      .catch(console.error);
  }, []);

  return (
    <section id="portfolio" className="portfolio">
      <span className="tag-portfolio">Portfólio</span>

      <h2>Projetos que <span>Transformam</span></h2>

      <p className="subtitulo-portfolio">Conheça alguns dos trabalhos que realizamos com dedicação e criatividade</p>

      {projetos.length === 0 ? (
        <p>Nenhum projeto cadastrado no momento :(</p>
      ) : (
        <div className="cards2">
          {projetos.map(projeto => (
            <PortfolioCard
              key={projeto.id}
              {...projeto}
              onDetalhes={() => setProjetoSelecionado(projeto)}
            />
          ))}
        </div>
      )}

      {projetoSelecionado && (
        <PortfolioModal
          projeto={projetoSelecionado}
          onClose={() => setProjetoSelecionado(null)}
        />
      )}
    </section>
  );
}
