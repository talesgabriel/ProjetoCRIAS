export default function HomeSection() {
  return (
    <section className="home">
      <div className="titulo-home">
        <h1>
          <span className="azul">Comunicação</span> que transforma{" "}
          <span className="laranja">ideias</span> em <br />
          <span className="azul">experiência</span>
        </h1>
      </div>

      <p>A Empresa Júnior do curso de Comunicação da UERN que conecta estudantes e mercado.</p>

      <div className="botoes">
        <a className="bt-azul link-botao" href="#sobre">Conheça a CRIAS →</a>
        <a className="bt-borda-laranja link-botao" href="#portfolio">Ver Portfólio</a>
      </div>
    </section>
  );
}
