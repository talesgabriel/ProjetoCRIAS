import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Contatos() {
  const [contatos, setContatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedContato, setSelectedContato] = useState(null);

  useEffect(() => {
    fetchContatos();
  }, []);

  const fetchContatos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:8080/api/v1/contato/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar contatos");
      }

      const data = await response.json();
      setContatos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Erro ao carregar contatos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    toast.warn(
      ({ closeToast }) => (
        <div>
          <p style={{ marginBottom: '15px', fontSize: '14px' }}>
            Tem certeza que deseja excluir este contato?
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                closeToast();
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: '#fff',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                closeToast();
                handleDelete(id);
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#d32f2f',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Excluir
            </button>
          </div>
        </div>
      ),
      {
        position: 'bottom-center',
        autoClose: false,
        closeButton: false,
        draggable: false,
      }
    );
  };

  const handleRowClick = (contato) => {
    setSelectedContato(contato);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedContato(null);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:8080/api/v1/contato/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar contato");
      }

      // Atualiza a lista removendo o contato deletado
      setContatos(contatos.filter((contato) => contato.id !== id));
      toast.success('Contato deletado com sucesso!');
    } catch (err) {
      toast.error(`Erro ao deletar contato. Tente novamente.`);
      console.error(err);
    }
  };

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", color: "red" }}>
        Erro: {error}
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <ToastContainer 
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <h2 style={{ marginBottom: "2rem", color: "#333" }}>Gerenciar Contatos</h2>
      
      {contatos.length === 0 ? (
        <p style={{ color: "#666" }}>Nenhum contato encontrado.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            overflow: "hidden"
          }}>
            <thead>
              <tr style={{ backgroundColor: "#2196F3", color: "white" }}>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>ID</th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Nome</th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Email</th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Mensagem</th>
                <th style={{ padding: "1rem", textAlign: "center", fontWeight: "600" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {contatos.map((contato, index) => (
                <tr 
                  key={contato.id}
                  onClick={() => handleRowClick(contato)}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                    borderBottom: "1px solid #e0e0e0",
                    cursor: "pointer",
                    transition: "background-color 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e3f2fd"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#f9f9f9" : "white"}
                >
                  <td style={{ padding: "1rem" }}>{contato.id}</td>
                  <td style={{ padding: "1rem" }}>{contato.nome}</td>
                  <td style={{ padding: "1rem" }}>{contato.email}</td>
                  <td style={{ 
                    padding: "1rem",
                    maxWidth: "300px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>
                    {contato.mensagem}
                  </td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDelete(contato.id);
                      }}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "600",
                        transition: "background-color 0.2s"
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = "#d32f2f"}
                      onMouseLeave={(e) => e.target.style.backgroundColor = "#f44336"}
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Detalhes do Contato */}
      {showModal && selectedContato && (
        <div 
          onClick={closeModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem"
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "80vh",
              overflow: "auto",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)"
            }}
          >
            {/* Header do Modal */}
            <div style={{
              padding: "1.5rem",
              borderBottom: "1px solid #e0e0e0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#2196F3",
              color: "white",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px"
            }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                Detalhes do Contato
              </h3>
              <button
                onClick={closeModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "2rem",
                  cursor: "pointer",
                  color: "white",
                  lineHeight: 1,
                  padding: 0,
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                ×
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div style={{ padding: "1.5rem" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ 
                  display: "block",
                  fontWeight: "600",
                  color: "#333",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  ID
                </label>
                <p style={{ 
                  margin: 0,
                  padding: "0.75rem",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                  color: "#666"
                }}>
                  {selectedContato.id}
                </p>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ 
                  display: "block",
                  fontWeight: "600",
                  color: "#333",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Nome
                </label>
                <p style={{ 
                  margin: 0,
                  padding: "0.75rem",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                  color: "#333",
                  fontWeight: "500"
                }}>
                  {selectedContato.nome}
                </p>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ 
                  display: "block",
                  fontWeight: "600",
                  color: "#333",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Email
                </label>
                <p style={{ 
                  margin: 0,
                  padding: "0.75rem",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                  color: "#2196F3",
                  fontWeight: "500"
                }}>
                  <a 
                    href={`mailto:${selectedContato.email}`}
                    style={{ color: "#2196F3", textDecoration: "none" }}
                  >
                    {selectedContato.email}
                  </a>
                </p>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ 
                  display: "block",
                  fontWeight: "600",
                  color: "#333",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Mensagem
                </label>
                <p style={{ 
                  margin: 0,
                  padding: "1rem",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                  color: "#333",
                  lineHeight: "1.6",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  minHeight: "100px"
                }}>
                  {selectedContato.mensagem}
                </p>
              </div>
            </div>

            {/* Footer do Modal */}
            <div style={{
              padding: "1rem 1.5rem",
              borderTop: "1px solid #e0e0e0",
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.5rem"
            }}>
              <button
                onClick={closeModal}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#e0e0e0",
                  color: "#333",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "background-color 0.2s"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#d0d0d0"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#e0e0e0"}
              >
                Fechar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeModal();
                  confirmDelete(selectedContato.id);
                }}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "background-color 0.2s"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#d32f2f"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#f44336"}
              >
                Deletar Contato
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
