import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/Login.module.css';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!senha.trim()) {
      newErrors.senha = 'Senha é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          senha: senha,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Salva o token no localStorage
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
        }
        
        setMessage('Login realizado com sucesso!');
        
        // Redireciona para o AdminPanel após 1 segundo
        setTimeout(() => {
          router.push('/admin/adminpanel');
        }, 1000);
      } else {
        setMessage(data.message || 'Erro ao fazer login. Verifique suas credenciais.');
      }
    } catch (error) {
      setMessage('Erro ao conectar com o servidor. Tente novamente.');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Implementar lógica de recuperação de senha
    alert('Funcionalidade de recuperação de senha será implementada em breve!');
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Admin</h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email *
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              placeholder="Insira o email administrativo"
              disabled={loading}
            />
            {errors.email && (
              <span className={styles.error}>{errors.email}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="senha" className={styles.label}>
              Senha *
            </label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className={`${styles.input} ${errors.senha ? styles.inputError : ''}`}
              placeholder="Insira a senha"
              disabled={loading}
            />
            {errors.senha && (
              <span className={styles.error}>{errors.senha}</span>
            )}
          </div>

          {message && (
            <div className={`${styles.message} ${message.includes('sucesso') ? styles.success : styles.errorMessage}`}>
              {message}
            </div>
          )}

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </button>

            <button
              type="button"
              onClick={handleForgotPassword}
              className={styles.forgotButton}
              disabled={loading}
            >
              Esqueci minha senha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
