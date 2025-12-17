// filepath: /home/regidev/github/ProjetoCRIAS/src/pages/admin/AdminPanel.jsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../styles/Equipe.module.css';

const CARGOS = {
  PRESIDENTE: 'Presidente',
  DIR_PROJETOS: 'Diretor de Projetos',
  DIR_ADMINSTRATIVA: 'Diretor Administrativo',
  DIR_MARKETING: 'Diretor de Marketing',
  MEMBRO: 'Membro'
};

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

export default function AdminPanel() {
  const router = useRouter();
  const [equipe, setEquipe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    cargo: 'MEMBRO',
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
    fetchEquipe();
  }, []);

  const fetchEquipe = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch('http://localhost:8080/api/v1/equipe', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar equipe');
      }

      const data = await response.json();
      setEquipe(data);
    } catch (err) {
      toast.error('Erro ao carregar membros da equipe. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/admin/login');
  };

  const openModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        nome: member.nome,
        cargo: member.cargo,
        imagem: member.imagem
      });
      // Converte a imagem base64 para exibição
      setImagePreview(getImageSrc(member.imagem));
      setImageFile(null);
    } else {
      setEditingMember(null);
      setFormData({
        nome: '',
        cargo: 'MEMBRO',
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
    setEditingMember(null);
    setFormData({
      nome: '',
      cargo: 'MEMBRO',
      imagem: ''
    });
    setImageFile(null);
    setImagePreview('');
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.nome.trim()) {
      errors.nome = 'Nome é obrigatório';
    }
    
    if (!formData.cargo) {
      errors.cargo = 'Cargo é obrigatório';
    }
    
    // Se está editando e não tem novo arquivo, não precisa validar
    // Se está criando ou tem novo arquivo, precisa validar
    if (!editingMember && !imageFile) {
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('accessToken');
      const url = 'http://localhost:8080/api/v1/admin/equipe';

      let response;

      // CRIAÇÃO: envia multipart/form-data com arquivo de imagem
      if (!editingMember) {
        const method = 'POST';
        const formDataToSend = new FormData();
        
        // Adicionar dados JSON
        const jsonData = {
          nome: formData.nome,
          cargo: formData.cargo
        };
        formDataToSend.append('json', JSON.stringify(jsonData));
        
        // Adicionar arquivo de imagem (obrigatório na criação)
        if (imageFile) {
          formDataToSend.append('imagem', imageFile);
        }

        response = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
            // NÃO definir Content-Type, o browser fará isso automaticamente com o boundary correto
          },
          body: formDataToSend
        });
      } 
      // EDIÇÃO: envia multipart/form-data com ID no JSON
      else {
        const method = 'PATCH';
        const formDataToSend = new FormData();
        
        // Adicionar dados JSON com ID
        const jsonData = {
          id: editingMember.id,
          nome: formData.nome,
          cargo: formData.cargo
        };
        formDataToSend.append('json', JSON.stringify(jsonData));
        
        // Adicionar arquivo de imagem se houver (opcional na edição)
        if (imageFile) {
          formDataToSend.append('imagem', imageFile);
        }

        response = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
            // NÃO definir Content-Type, o browser fará isso automaticamente com o boundary correto
          },
          body: formDataToSend
        });
      }

      if (response.status === 403 || response.status === 401) {
        localStorage.removeItem('accessToken');
        toast.error('Sessão expirada. Faça login novamente.');
        router.push('/admin/login');
        return;
      } 

      if (!response.ok) {
        throw new Error('Erro ao salvar membro');
      }

      toast.success(editingMember ? 'Membro atualizado com sucesso!' : 'Membro adicionado com sucesso!');
      closeModal();
      fetchEquipe();
    } catch (err) {
      toast.error('Erro ao salvar membro. Tente novamente.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (id) => {
    toast.warn(
      ({ closeToast }) => (
        <div>
          <p style={{ marginBottom: '15px', fontSize: '14px' }}>
            Tem certeza que deseja excluir este membro?
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

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`http://localhost:8080/api/v1/admin/equipe/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('accessToken');
        toast.error('Sessão expirada. Faça login novamente.');
        router.push('/admin/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Erro ao deletar membro');
      }

      toast.success('Membro excluído com sucesso!');
      fetchEquipe();
    } catch (err) {
      toast.error('Erro ao excluir membro. Tente novamente.');
      console.error(err);
    }
  };

  const getCargoClass = (cargo) => {
    const cargoMap = {
      PRESIDENTE: styles.presidente,
      DIR_PROJETOS: styles.dirProjetos,
      DIR_ADMINSTRATIVA: styles.dirAdministrativa,
      DIR_MARKETING: styles.dirMarketing,
      MEMBRO: styles.membro
    };
    return cargoMap[cargo] || styles.membro;
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

      <main className={styles.main}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>Gerenciar Equipe</h2>
          <p className={styles.subtitle}>Adicione, edite ou remova membros da equipe</p>
        </div>

        <div className={styles.actions}>
          <button onClick={() => openModal()} className={styles.addButton}>
            <span>+</span> Adicionar Membro
          </button>
        </div>

        {loading ? (
          <div className={styles.loading}>Carregando...</div>
        ) : equipe.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>Nenhum membro cadastrado</h3>
            <p>Clique em "Adicionar Membro" para começar</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {equipe.map((member) => (
              <div key={member.id} className={styles.card}>
                <img 
                  src={getImageSrc(member.imagem)} 
                  alt={member.nome}
                  className={styles.cardImage}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Sem+Imagem';
                  }}
                />
                <h3 className={styles.cardName}>{member.nome}</h3>
                <span className={`${styles.cardCargo} ${getCargoClass(member.cargo)}`}>
                  {CARGOS[member.cargo]}
                </span>
                <div className={styles.cardActions}>
                  <button 
                    onClick={() => openModal(member)} 
                    className={styles.editButton}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => confirmDelete(member.id)} 
                    className={styles.deleteButton}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingMember ? 'Editar Membro' : 'Adicionar Membro'}
              </h3>
              <button onClick={closeModal} className={styles.closeButton}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="nome" className={styles.label}>
                  Nome *
                </label>
                <input
                  type="text"
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className={`${styles.input} ${formErrors.nome ? styles.inputError : ''}`}
                  placeholder="Digite o nome completo"
                  disabled={submitting}
                />
                {formErrors.nome && (
                  <span className={styles.errorText}>{formErrors.nome}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="cargo" className={styles.label}>
                  Cargo *
                </label>
                <select
                  id="cargo"
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  className={`${styles.select} ${formErrors.cargo ? styles.inputError : ''}`}
                  disabled={submitting}
                >
                  {Object.entries(CARGOS).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
                {formErrors.cargo && (
                  <span className={styles.errorText}>{formErrors.cargo}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="imagem" className={styles.label}>
                  Imagem *
                </label>
                <input
                  type="file"
                  id="imagem"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={`${styles.input} ${formErrors.imagem ? styles.inputError : ''}`}
                  disabled={submitting}
                />
                {formErrors.imagem && (
                  <span className={styles.errorText}>{formErrors.imagem}</span>
                )}
                {editingMember && !imageFile && (
                  <small style={{ color: 'var(--roxo)', fontSize: '13px' }}>
                    Deixe em branco para manter a imagem atual
                  </small>
                )}
              </div>

              {imagePreview && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>Preview da Imagem</label>
                  <img 
                    src={imagePreview} 
                    alt="Preview"
                    className={styles.cardImage}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=Erro+ao+Carregar';
                    }}
                  />
                </div>
              )}

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={closeModal}
                  className={styles.cancelButton}
                  disabled={submitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={submitting}
                >
                  {submitting ? 'Salvando...' : (editingMember ? 'Atualizar' : 'Adicionar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
