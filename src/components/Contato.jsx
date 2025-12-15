export default function Contato() {
  return (
    <section id="contato" className="contato">
      <div className="container-contato">
        
        <div className="titulo-contato">
          <span className="tag">Entre em contato</span>
          <h2>Vamos Conversar?</h2>
          <p>Tem um projeto em mente? Fale com a gente e descubra como podemos ajudar sua marca a se comunicar melhor.</p>
        </div>

        <div className="conteudo-contato">
          
          <form className="formulario">
            <label>Nome completo</label>
            <input type="text" placeholder="Seu nome" required />

            <label>Email</label>
            <input type="email" placeholder="Seu@email.com" required />

            <label>Mensagem</label>
            <textarea placeholder="Conte-nos sobre sua ideia..." required />

            <button type="submit">Enviar mensagem</button>
          </form>

          <div className="info-contato">
            
            <div className="card-info">
              <img src="/img/icon4.png" alt="Email" />
              <div>
                <p className="titulo-info"><b>E-mail</b></p>
                <p>contato@crias.com</p>
              </div>
            </div>

            <div className="card-info">
              <img src="/img/icon5.png" alt="Telefone" />
              <div>
                <p className="titulo-info"><b>Telefone</b></p>
                <p>(00) 0000-0000</p>
              </div>
            </div>

            <div className="card-info">
              <img src="/img/icon6.png" alt="Endereço" />
              <div>
                <p className="titulo-info"><b>Endereço</b></p>
                <p>Campus Universitário – Curso de Comunicação</p>
              </div>
            </div>

            <div className="redes">
              <p className="titulo-redes">Redes sociais</p>
              <div className="icones-redes">
                <a href="https://shre.ink/instacrias"><i className="fa-brands fa-instagram"></i></a>
                <a href="#"><i className="fa-brands fa-linkedin"></i></a>
                <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
              </div>
            </div>

            <div className="mapa-container">
              <iframe
                className="mapa-uern"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.548005226525!2d-37.32461082417985!3d-5.206221599988042!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ba079fd8db485d%3A0x3dbd28d6a7ea297f!2sUERN%20-%20Campus%20Universit%C3%A1rio%20Central!5e0!3m2!1spt-BR!2sbr!4v1700799999999!5m2!1spt-BR!2sbr"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
