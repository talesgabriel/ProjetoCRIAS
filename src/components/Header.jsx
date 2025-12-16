import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header>
      <Image src="/img/logo.png" alt="Logo CRIAS" width={64} height={47} />

      <nav>
        <ul>
          <li><Link href="/home">Home</Link></li>
          <li><Link href="#sobre">Quem somos</Link></li>
          <li><Link href="#portfolio">Portfólio</Link></li>
          <li><Link href="#noticias">Notícias</Link></li>
          <li><Link href="#contato">Contato</Link></li>
        </ul>
      </nav>

      <Link href="#contato" className="bt-laranja link-botao">Fale com a CRIAS</Link>
    </header>
  );
}
