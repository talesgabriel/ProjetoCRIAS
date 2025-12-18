export default function NoticiasCard({noticia, onDetalhes}) {
  const { titulo, conteudo, imagem, data, tag } = noticia;

  return (
    <div className="card portfolio-card">

      <div
        className="portfolio-img"
        style={{
          backgroundImage: imagem
            ? `url(data:image/jpeg;base64,${imagem})`
            : "none"
        }}
      >
        <span 
          className="card-tag-not"
          style={{ backgroundColor: tag === "EDITAL" ? "#F75F1C" : "#021DA2" }}
        >
          {tag === "EDITAL" ? " 🏷️ Editais" : " 🏷️ Notícias"}
        </span>
      </div>

      <div className="portfolio-content">

        {data && (
          <p>{new Date(data).toLocaleDateString("pt-BR")}</p>
        )}

        <h3>{titulo}</h3>

        <p className="card-content">{conteudo}</p>

        <button className="details-link" onClick={onDetalhes}>Ler mais →</button>

      </div>

    </div>
  );
}
