export default function PortfolioCard({titulo, conteudo, imagem, tag, onDetalhes}) {
  return (
    <div className="card portfolio-card">
      
      <div
        className="img portfolio-img"
        style={{
          backgroundImage: `url(data:image/jpeg;base64,${imagem})`
        }}
      >
        <span className="card-tag">{tag}</span>
      </div>

      <div className="card-content portfolio-content">
        <h3>{titulo}</h3>
        <p>{conteudo}</p>
        <button className="details-link" onClick={onDetalhes}>Ver detalhes →</button>
      </div>
    </div>
  );
}
