export default function NoticiasModal({ noticia, onClose }) {
  const isEdital = noticia.tag?.toUpperCase() === "EDITAL";

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>

        <h2>{noticia.titulo}</h2>

        {noticia.imagem && (
          <div
            className="modal-img"
            style={{
              backgroundImage: `url(data:image/jpeg;base64,${noticia.imagem})`
            }}
          />
        )}

        <p className="modal-texto">{noticia.conteudo}</p>

        {isEdital && noticia.arquivo && (
          <a
            href={`data:application/pdf;base64,${noticia.arquivo}`}
            download={`${noticia.titulo}.pdf`}
            className="details-link modal-download"
          >
            Baixar edital
          </a>
        )}

        {noticia.data && (
          <p className="modal-data">
            {new Date(noticia.data).toLocaleDateString("pt-BR")}
          </p>
        )}

      </div>
    </div>
  );
}
