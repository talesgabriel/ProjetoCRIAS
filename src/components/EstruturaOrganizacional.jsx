import { useEffect, useState } from "react";
import PessoaEquipe from "@/components/PessoaEquipe";

export default function EstruturaOrganizacional() {
  const [equipe, setEquipe] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/equipe")
      .then(res => res.json())
      .then(setEquipe)
      .catch(console.error);
  }, []);

  const porCargo = (cargo) =>
    equipe.filter(pessoa => pessoa.cargo === cargo);

  return (
    <section id="estrutura" className="estrutura">
      <div className="estrutura-container">
        <div className="estrutura-header">
          <span className="tag-estrutura">Nossa equipe</span>
          <h2>Estrutura Organizacional</h2>
          <p>Nossa equipe é formada por estudantes dedicados, organizados em diferentes áreas para garantir excelência em todos os projetos.</p>
        </div>

        <div className="estrutura-quadro">

          {/* PRESIDÊNCIA */}
          <div className="bloco-cargo">
            <div className="pessoas-cargo">
              {porCargo("PRESIDENTE").map(pessoa => (
                <PessoaEquipe key={pessoa.id} {...pessoa} />
              ))}
            </div>

            <button className="bt-azul">Presidência</button>
            <p>Gestão estratégica e representação</p>
          </div>

          {/* DIRETORIAS */}
          <div className="diretorias">

            <div className="diretoria bloco-cargo">
              <div className="pessoas-cargo">
                {porCargo("DIR_PROJETOS").map(pessoa => (
                  <PessoaEquipe key={pessoa.id} {...pessoa} />
                ))}
              </div>
              <button className="bt-laranja2">Diretoria de Projetos</button>
              <p>Gestão e execução de projetos de comunicação</p>
            </div>

            <div className="diretoria bloco-cargo">
              <div className="pessoas-cargo">
                {porCargo("DIR_ADMINSTRATIVA").map(pessoa => (
                  <PessoaEquipe key={pessoa.id} {...pessoa} />
                ))}
              </div>
              <button className="bt-azul">Diretoria Administrativa</button>
              <p>Gestão financeira e administrativa</p>
            </div>

            <div className="diretoria bloco-cargo">
              <div className="pessoas-cargo">
                {porCargo("DIR_MARKETING").map(pessoa => (
                  <PessoaEquipe key={pessoa.id} {...pessoa} />
                ))}
              </div>
              <button className="bt-laranja2">Diretoria de Marketing</button>
              <p>Comunicação institucional e relacionamento</p>
            </div>

          </div>

          <hr className="linha-divisao" />

          {/* MEMBROS */}
          <div className="bloco-cargo">
            <div className="pessoas-cargo">
              {porCargo("MEMBRO").map(pessoa => (
                <PessoaEquipe key={pessoa.id} {...pessoa} />
              ))}
            </div>

            <button className="bt-bege">Membros Associados</button>
            <p>Equipe executora dos projetos</p>
          </div>

        </div>
      </div>
    </section>
  );
}
