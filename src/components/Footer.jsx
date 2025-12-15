import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container-footer">
        <div className="footer-logo">
          <Image src="/img/logo2.png" alt="Logo CRIAS" width={160} height={120}/>
        </div>

        <div className="footer-links">
          <div>
            <h4>Links Rápidos</h4>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#sobre">Quem somos</a></li>
              <li><a href="#portfolio">Portfólio</a></li>
              <li><a href="#noticias">Notícias</a></li>
              <li><a href="#contato">Contato</a></li>
            </ul>
          </div>

          <div>
            <h4>Institucional</h4>
            <ul>
              <li><a href="#">CRIAS</a></li>
              <li><a href="#">Empresa Júnior</a></li>
              <li><a href="#">Curso de Comunicação</a></li>
              <li><a href="#">Campus Universitário</a></li>
              <li><a href="/login">Acesso Restrito</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        © 2025 CRIAS - Empresa Júnior.
      </div>
    </footer>
  );
}