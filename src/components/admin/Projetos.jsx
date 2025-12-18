import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../styles/Equipe.module.css';

// Função para converter base64 em data URI se necessário
const getImageSrc = (imagem) => {
  if (!imagem) return 'https://via.placeholder.com/300x200?text=Sem+Imagem';
  
  // Se já é uma URL completa ou data URI, retorna como está
  if (imagem.startsWith('http') || imagem.startsWith('data:image')) {
    return imagem;
  }
  
  // Se é apenas base64 puro, adiciona o prefixo data URI
  return `data:image/jpeg;base64,${imagem}`;
};

export default function Projetos() {
  const router = useRouter();
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProjeto, setEditingProjeto] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    conteudo: '',
    tag: '',
    imagem: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchProjetos();
  }, []);

  const fetchProjetos = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:8080/api/v1/projetos/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar projetos');
      }

      const data = await response.json();
      setProjetos(data);
    } catch (err) {
      toast.error('Erro ao carregar projetos. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (projeto = null) => {
    if (projeto) {
      setEditingProjeto(projeto);
      setFormData({
        titulo: projeto.titulo,
        conteudo: projeto.conteudo,
        tag: projeto.tag,
        imagem: projeto.imagem
      });
      // Converte a imagem base64 para exibição
      setImagePreview(getImageSrc(projeto.imagem));
      setImageFile(null);
    } else {
      setEditingProjeto(null);
      setFormData({
        titulo: '',
        conteudo: '',
        tag: '',
        imagem: ''
      });
      setImagePreview('');
      setImageFile(null);
    }
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProjeto(null);
    setFormData({
      titulo: '',
      conteudo: '',
      tag: '',
      imagem: ''
    });
    setImageFile(null);
    setImagePreview('');
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.titulo.trim()) {
      errors.titulo = 'Título é obrigatório';
    }
    
    if (!formData.conteudo.trim()) {
      errors.conteudo = 'Conteúdo é obrigatório';
    }
    
    if (!formData.tag.trim()) {
      errors.tag = 'Tag é obrigatória';
    }
    
    // Se está editando e não tem novo arquivo, não precisa validar
    // Se está criando ou tem novo arquivo, precisa validar
    if (!editingProjeto && !imageFile) {
      errors.imagem = 'Imagem é obrigatória';
    } else if (imageFile && !imageFile.type.startsWith('image/')) {
      errors.imagem = 'Arquivo deve ser uma imagem';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Limpar erro de imagem se existir
      if (formErrors.imagem) {
        setFormErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.imagem;
          return newErrors;
        });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo quando usuário digitar
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        toast.error('Token não encontrado. Faça login novamente.');
        router.push('/admin/login');
        return;
      }

      const formDataToSend = new FormData();
      
      // Adicionar a imagem se houver um novo arquivo
      if (imageFile) {
        formDataToSend.append('imagem', imageFile);
      }
      
      // Criar o objeto JSON com os dados do projeto
      const jsonData = {
        titulo: formData.titulo,
        conteudo: formData.conteudo,
        tag: formData.tag
      };
      
      // Se está editando, adicionar o ID
      if (editingProjeto) {
        jsonData.id = editingProjeto.id;
      }
      
      // Adicionar o JSON como string no campo 'json'
      formDataToSend.append('json', JSON.stringify(jsonData));

      const url = editingProjeto
        ? 'http://localhost:8080/api/v1/admin/projetos'
        : 'http://localhost:8080/api/v1/admin/projetos';
      
      const method = editingProjeto ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao salvar projeto');
      }

      toast.success(editingProjeto ? 'Projeto atualizado com sucesso!' : 'Projeto criado com sucesso!');
      closeModal();
      fetchProjetos();
    } catch (err) {
      toast.error(err.message || 'Erro ao salvar projeto. Tente novamente.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        toast.error('Token não encontrado. Faça login novamente.');
        router.push('/admin/login');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/v1/admin/projetos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao excluir projeto');
      }

      toast.success('Projeto excluído com sucesso!');
      fetchProjetos();
    } catch (err) {
      toast.error(err.message || 'Erro ao excluir projeto. Tente novamente.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Carregando projetos...</div>;
  }

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <main className={styles.main}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Gerenciamento de Projetos</h1>
          <p className={styles.subtitle}>Adicione, edite ou remova projetos</p>
        </div>

        <div className={styles.actions}>
          <button className={styles.addButton} onClick={() => openModal()}>
            + Adicionar Projeto
          </button>
        </div>

        {projetos.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>Nenhum projeto cadastrado</h3>
            <p>Clique no botão acima para adicionar o primeiro projeto.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {projetos.map((projeto) => (
              <div key={projeto.id} className={styles.card}>
                <img 
                  src={getImageSrc(projeto.imagem)} 
                  alt={projeto.titulo}
                  className={styles.cardImage}
                />
                <h3 className={styles.cardName}>{projeto.titulo}</h3>
                <span className={`${styles.cardCargo} ${styles.membro}`}>
                  {projeto.tag}
                </span>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px', lineHeight: '1.5' }}>
                  {projeto.conteudo.length > 100 
                    ? `${projeto.conteudo.substring(0, 100)}...` 
                    : projeto.conteudo}
                </p>
                <div className={styles.cardActions}>
                  <button 
                    className={styles.editButton}
                    onClick={() => openModal(projeto)}
                  >
                    Editar
                  </button>
                  <button 
                    className={styles.deleteButton}
                    onClick={() => handleDelete(projeto.id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className={styles.modal} onClick={closeModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>
                  {editingProjeto ? 'Editar Projeto' : 'Novo Projeto'}
                </h2>
                <button className={styles.closeButton} onClick={closeModal}>
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Título *</label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    className={`${styles.input} ${formErrors.titulo ? styles.inputError : ''}`}
                    placeholder="Digite o título do projeto"
                  />
                  {formErrors.titulo && (
                    <span className={styles.errorText}>{formErrors.titulo}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Conteúdo *</label>
                  <textarea
                    name="conteudo"
                    value={formData.conteudo}
                    onChange={handleInputChange}
                    className={`${styles.input} ${formErrors.conteudo ? styles.inputError : ''}`}
                    placeholder="Digite o conteúdo do projeto"
                    rows="5"
                    style={{ resize: 'vertical', fontFamily: 'Poppins, sans-serif' }}
                  />
                  {formErrors.conteudo && (
                    <span className={styles.errorText}>{formErrors.conteudo}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Tag *</label>
                  <input
                    type="text"
                    name="tag"
                    value={formData.tag}
                    onChange={handleInputChange}
                    className={`${styles.input} ${formErrors.tag ? styles.inputError : ''}`}
                    placeholder="Digite a tag do projeto"
                  />
                  {formErrors.tag && (
                    <span className={styles.errorText}>{formErrors.tag}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Imagem * {editingProjeto && '(deixe em branco para manter a atual)'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={`${styles.input} ${formErrors.imagem ? styles.inputError : ''}`}
                  />
                  {formErrors.imagem && (
                    <span className={styles.errorText}>{formErrors.imagem}</span>
                  )}
                  
                  {imagePreview && (
                    <div style={{ marginTop: '12px' }}>
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        style={{
                          maxWidth: '100%',
                          maxHeight: '200px',
                          borderRadius: '8px',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={closeModal}
                    disabled={submitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={submitting}
                  >
                    {submitting 
                      ? 'Salvando...' 
                      : editingProjeto 
                        ? 'Atualizar Projeto' 
                        : 'Criar Projeto'
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
