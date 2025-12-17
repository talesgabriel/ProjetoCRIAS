export default function NoticiasCard({ titulo, conteudo, imagem, data }) {
  return (
    <div className="card">

      <div
        className="img"
        style={{
          backgroundImage: imagem
            ? `url(data:image/jpeg;base64,${imagem})`
            : "none",
        }}
      />

      <div className="card-content">
        <h3>{titulo}</h3>

        <p>{conteudo}</p>

        {data && (
          <span className="data">
            {new Date(data).toLocaleDateString("pt-BR")}
          </span>
        )}
      </div>

    </div>
  );
}
