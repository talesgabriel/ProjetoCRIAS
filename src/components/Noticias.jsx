import { useEffect, useState } from "react";
import NoticiasCard from "@/components/NoticiasCard";

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/noticias")
      .then((res) => res.json())
      .then(setNoticias)
      .catch(console.error);
  }, []);

  if (noticias.length === 0) return null;

  return (
    <section id="noticias" className="noticias-section">
      <div className="container-noticias">

        <span className="tag-topo">Novidades</span>

        <h2 className="titulo-noticias">
          <span className="azul">Notícias</span> e Editais</h2>

        <p className="subtitulo-noticias">Fique por dentro das últimas atualizações e oportunidades da CRIAS</p>

        <div className="cards2">
          {noticias.map((noticia) => (
            <NoticiasCard key={noticia.id} {...noticia} />
          ))}
        </div>

      </div>
    </section>
  );
}
