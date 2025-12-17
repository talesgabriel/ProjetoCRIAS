export default function PortfolioModal({ projeto, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>

        <h2>{projeto.titulo}</h2>
        <span className="tag-portfolio">{projeto.tag}</span>

        <div
          className="modal-img"
          style={{
            backgroundImage: `url(data:image/jpeg;base64,${projeto.imagem})`
          }}
        />

        <h4>Sobre o projeto</h4>
        <p>{projeto.conteudo}</p>
      </div>
    </div>
  );
}
