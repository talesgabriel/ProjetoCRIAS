import NoticiasCard from "@/components/NoticiasCard";

export default function Noticias() {
  return (
    <section id="noticias" className="noticias-section">
      <div className="container-noticias">

        <span className="tag-topo">Novidades</span>

        <h2 className="titulo-noticias">
          <span className="azul">Notícias</span> e Editais
        </h2>

        <p className="subtitulo-noticias">Fique por dentro das últimas atualizações e oportunidades da CRIAS</p>

        <div className="cards2">
          <NoticiasCard />
          <NoticiasCard />
          <NoticiasCard />
        </div>

      </div>
    </section>
  );
}
