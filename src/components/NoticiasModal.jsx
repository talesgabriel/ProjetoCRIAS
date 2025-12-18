import { useState } from "react";

function getMimeType(nomeArquivo) {
  if (!nomeArquivo) return "application/octet-stream";

  const ext = nomeArquivo.split(".").pop().toLowerCase();

  const mimeMap = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    zip: "application/zip",
    rar: "application/vnd.rar",
    "7z": "application/x-7z-compressed",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp"
  };

  return mimeMap[ext] || "application/octet-stream";
}

export default function NoticiasModal({ noticia, onClose }) {
  const [showToast, setShowToast] = useState(false);
  const isEdital = noticia.tag?.toUpperCase() === "EDITAL";

  function handleDownload() {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  const mimeType = getMimeType(noticia.nomeArquivo);

  return (
    <>
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

          {noticia.arquivo && noticia.nomeArquivo && (
            <a
              href={`data:${mimeType};base64,${noticia.arquivo}`}
              download={noticia.nomeArquivo}
              className="details-link modal-download"
              onClick={handleDownload}
            >
              Baixar {noticia.nomeArquivo}
            </a>
          )}

          {noticia.data && (
            <p className="modal-data">
              {new Date(noticia.data).toLocaleDateString("pt-BR")}
            </p>
          )}
        </div>
      </div>

      {showToast && (
        <div className="toast-success">
          <div className="toast-content">
            <span>✅ Download iniciado com sucesso!</span>
          </div>
          <div className="toast-progress" />
        </div>
      )}
    </>
  );
}
