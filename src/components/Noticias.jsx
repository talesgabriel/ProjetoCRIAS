import { useEffect, useState } from "react";
import NoticiasCard from "@/components/NoticiasCard";
import NoticiasModal from "@/components/NoticiasModal";

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [noticiaSelecionada, setNoticiaSelecionada] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/noticias")
      .then(res => res.json())
      .then(setNoticias)
      .catch(console.error);
  }, []);

  return (
    <section id="noticias" className="noticias">

      <span className="tag-noticias">Novidades</span>

      <h2><span>Notícias</span> e Editais</h2>

      <p className="subtitulo-noticias">Fique por dentro das últimas atualizações e oportunidades da CRIAS</p>

      {noticias.length === 0 ? (
        <p>Nenhuma notícia cadastrada no momento :(</p>
      ) : (
        <div className="cards2">
          {noticias.map(noticia => (
            <NoticiasCard
              key={noticia.id}
              noticia={noticia}
              onDetalhes={() => setNoticiaSelecionada(noticia)}
            />
          ))}
        </div>
      )}

      {noticiaSelecionada && (
        <NoticiasModal
          noticia={noticiaSelecionada}
          onClose={() => setNoticiaSelecionada(null)}
        />
      )}

    </section>
  );
}
