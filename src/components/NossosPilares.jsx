export default function NossosPilares() {
  return (
    <section className="pilares">
      <h2 className="titulo-pilares">Nossos Pilares</h2>

      <div className="cards">
        <div className="card">
          <div className="icone">
            <img src="/img/icon1.png" alt="Missão" />
          </div>
          <h3>Missão</h3>
          <p>
            Conectar estudantes ao mercado de trabalho através de projetos reais
            de comunicação, desenvolvendo competências práticas e gerando valor
            para nossos clientes.
          </p>
        </div>

        <div className="card">
          <div className="icone">
            <img src="/img/icon2.png" alt="Visão" />
          </div>
          <h3>Visão</h3>
          <p>
            Ser referência em soluções de comunicação criativas e inovadoras,
            formando profissionais qualificados e transformando o cenário da
            comunicação universitária.
          </p>
        </div>

        <div className="card">
          <div className="icone">
            <img src="/img/icon3.png" alt="Valores" />
          </div>
          <h3>Valores</h3>
          <p>
            Criatividade, profissionalismo, ética, trabalho em equipe, inovação
            e comprometimento com a excelência em cada projeto que realizamos.
          </p>
        </div>
      </div>
    </section>
  );
}
