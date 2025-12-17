export default function PessoaEquipe({nome, imagem}) {
  return (
    <div className="pessoa-equipe">
      <div
        className="pessoa-foto"
        style={{
          backgroundImage: `url(data:image/jpeg;base64,${imagem})`
        }}
      />
      <span className="pessoa-nome">{nome}</span>
    </div>
  );
}
