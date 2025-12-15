export default function EstruturaOrganizacional() {
  return (
    <section id="estrutura" className="estrutura-section">
      <div className="estrutura-container">
        <div className="estrutura-header">
          <span className="tag">Nossa equipe</span>
          <h2>Estrutura Organizacional</h2>
          <p>Nossa equipe é formada por estudantes dedicados, organizados em diferentes áreas para garantir excelência em todos os projetos.</p>
        </div>

        <div className="estrutura-quadro">
          <div className="presidencia">
            <button className="bt-azul">Presidência</button>
            <p>Gestão estratégica e representação</p>
          </div>

          <div className="diretorias">
            <div className="diretoria">
              <button className="bt-laranja2">Diretoria de Projetos</button>
              <p>Gestão e execução de projetos de comunicação</p>
            </div>

            <div className="diretoria">
              <button className="bt-azul">Diretoria Administrativa</button>
              <p>Gestão financeira e administrativa</p>
            </div>

            <div className="diretoria">
              <button className="bt-laranja2">Diretoria de Marketing</button>
              <p>Comunicação institucional e relacionamento</p>
            </div>
          </div>

          <hr className="linha-divisao"/>

          <div className="membros">
            <button className="bt-bege">Membros Associados</button>
            <p>Equipe executora dos projetos</p>
          </div>
        </div>
      </div>
    </section>
  );
}
