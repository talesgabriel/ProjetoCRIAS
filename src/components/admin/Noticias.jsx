import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import styles from "../../styles/Noticias.module.css";

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingNoticia, setEditingNoticia] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    titulo: "",
    conteudo: "",
    tag: "NOTÍCIA",
    data: new Date().toISOString().split('T')[0],
    imagem: null,
    arquivo: null
  });

  // Carregar notícias
  useEffect(() => {
    fetchNoticias();
  }, []);

  const fetchNoticias = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/v1/noticias");
      if (!response.ok) throw new Error("Erro ao carregar notícias");
      const data = await response.json();
      setNoticias(data);
    } catch (error) {
      console.error("Erro ao buscar notícias:", error);
      toast.error("Erro ao carregar notícias. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Você precisa estar autenticado");
      return;
    }

    try {
      setLoading(true);
      
      const formDataToSend = new FormData();
      
      // Adicionar arquivos
      if (formData.imagem) {
        formDataToSend.append("imagem", formData.imagem);
      }
      if (formData.arquivo) {
        formDataToSend.append("arquivo", formData.arquivo);
      }
      
      // Adicionar dados JSON
      const jsonData = {
        titulo: formData.titulo,
        conteudo: formData.conteudo,
        tag: formData.tag,
        data: new Date(formData.data).toISOString()
      };
      
      if (editingNoticia) {
        jsonData.id = editingNoticia.id;
      }
      
      formDataToSend.append("json", JSON.stringify(jsonData));

      const url = "http://localhost:8080/api/v1/admin/noticias";
      const method = editingNoticia ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro ao salvar notícia");
      }

      toast.success(editingNoticia ? "Notícia atualizada com sucesso!" : "Notícia criada com sucesso!");
      
      // Resetar formulário
      resetForm();
      fetchNoticias();
    } catch (error) {
      console.error("Erro ao salvar notícia:", error);
      toast.error(error.message || "Erro ao salvar notícia. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (noticia) => {
    setEditingNoticia(noticia);
    setFormData({
      titulo: noticia.titulo,
      conteudo: noticia.conteudo,
      tag: noticia.tag,
      data: new Date(noticia.data).toISOString().split('T')[0],
      imagem: null,
      arquivo: null
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    toast.warn(
      ({ closeToast }) => (
        <div>
          <p style={{ marginBottom: '15px', fontSize: '14px' }}>
            Tem certeza que deseja excluir esta notícia?
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
                deleteNoticia(id);
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

  const deleteNoticia = async (id) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Você precisa estar autenticado");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/v1/admin/noticias/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro ao excluir notícia");
      }

      toast.success("Notícia excluída com sucesso!");
      fetchNoticias();
    } catch (error) {
      console.error("Erro ao excluir notícia:", error);
      toast.error(error.message || "Erro ao excluir notícia. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: "",
      conteudo: "",
      tag: "NOTÍCIA",
      data: new Date().toISOString().split('T')[0],
      imagem: null,
      arquivo: null
    });
    setEditingNoticia(null);
    setShowForm(false);
  };

  return (
    <div className={styles.container}>
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
      
      <div className={styles.main}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Gerenciamento de Notícias</h1>
          <p className={styles.subtitle}>Crie e gerencie notícias e editais</p>
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.btnAdd}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "✕ Cancelar" : "+ Nova Notícia"}
          </button>
        </div>

        {loading && <div className={styles.loading}>Carregando...</div>}

        {showForm && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>
                  {editingNoticia ? "Editar Notícia" : "Nova Notícia"}
                </h2>
                <button 
                  type="button"
                  className={styles.closeButton}
                  onClick={resetForm}
                >
                  ×
                </button>
              </div>
              
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="titulo" className={styles.label}>Título *</label>
                  <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    className={styles.input}
                    value={formData.titulo}
                    onChange={handleInputChange}
                    required
                    placeholder="Digite o título da notícia"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="conteudo" className={styles.label}>Conteúdo *</label>
                  <textarea
                    id="conteudo"
                    name="conteudo"
                    className={styles.textarea}
                    value={formData.conteudo}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    placeholder="Digite o conteúdo da notícia"
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="tag" className={styles.label}>Tipo *</label>
                    <select
                      id="tag"
                      name="tag"
                      className={styles.select}
                      value={formData.tag}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="NOTÍCIA">NOTÍCIA</option>
                      <option value="EDITAL">EDITAL</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="data" className={styles.label}>Data *</label>
                    <input
                      type="date"
                      id="data"
                      name="data"
                      className={styles.input}
                      value={formData.data}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="imagem" className={styles.label}>
                    Imagem {editingNoticia ? "(deixe em branco para manter a atual)" : "*"}
                  </label>
                  <input
                    type="file"
                    id="imagem"
                    name="imagem"
                    className={styles.input}
                    onChange={handleFileChange}
                    accept="image/*"
                    required={!editingNoticia}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="arquivo" className={styles.label}>Arquivo (opcional)</label>
                  <input
                    type="file"
                    id="arquivo"
                    name="arquivo"
                    className={styles.input}
                    onChange={handleFileChange}
                  />
                </div>

                <div className={styles.formActions}>
                  <button type="submit" className={styles.btnSubmit} disabled={loading}>
                    {loading ? "Salvando..." : editingNoticia ? "Atualizar" : "Criar"}
                  </button>
                  <button type="button" className={styles.btnCancel} onClick={resetForm}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {!loading && noticias.length === 0 && !showForm && (
          <div className={styles.emptyState}>
            <h3>Nenhuma notícia cadastrada</h3>
            <p>Comece adicionando sua primeira notícia</p>
          </div>
        )}

        <div className={styles.grid}>
          {!loading && noticias.map((noticia) => (
            <div key={noticia.id} className={styles.card}>
              {noticia.imagem && (
                <img 
                  src={`data:image/jpeg;base64,${noticia.imagem}`} 
                  alt={noticia.titulo}
                  className={styles.cardImage}
                />
              )}
              
              <div className={styles.cardContent}>
                <span className={styles.cardTag} data-tag={noticia.tag}>
                  {noticia.tag}
                </span>
                <h3 className={styles.cardTitle}>{noticia.titulo}</h3>
                <p className={styles.cardConteudo}>{noticia.conteudo}</p>
                <p className={styles.cardData}>
                  {new Date(noticia.data).toLocaleDateString('pt-BR')}
                </p>
                
                {noticia.arquivo && (
                  <a 
                    href={`data:application/pdf;base64,${noticia.arquivo}`}
                    download={`${noticia.titulo}.pdf`}
                    className={styles.arquivoLink}
                  >
                    📎 Arquivo anexo
                  </a>
                )}
              </div>

              <div className={styles.cardActions}>
                <button 
                  className={styles.btnEdit}
                  onClick={() => handleEdit(noticia)}
                >
                  Editar
                </button>
                <button 
                  className={styles.btnDelete}
                  onClick={() => handleDelete(noticia.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
