import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonText, IonSpinner,
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/auth/AuthContext';
import { ApiError } from '../../services/api';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones en el cliente (el servidor las vuelve a validar)
    const found: string[] = [];
    if (!EMAIL_RE.test(email.trim())) found.push('Ingresa un correo válido.');
    if (!password) found.push('Ingresa tu contraseña.');
    setErrors(found);
    if (found.length > 0) return;

    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/app/home', { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors([err.status === 401 ? 'Correo o contraseña incorrectos.' : err.message]);
      } else {
        setErrors(['Ocurrió un error inesperado.']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Iniciar Sesión</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit} noValidate>
          <IonInput
            label="Correo electrónico"
            labelPlacement="floating"
            fill="outline"
            type="email"
            autocomplete="email"
            value={email}
            onIonInput={(e) => setEmail(e.detail.value ?? '')}
          />
          <br />
          <IonInput
            label="Contraseña"
            labelPlacement="floating"
            fill="outline"
            type="password"
            autocomplete="current-password"
            value={password}
            onIonInput={(e) => setPassword(e.detail.value ?? '')}
          />

          {errors.length > 0 && (
            <IonText color="danger" role="alert">
              <ul>
                {errors.map((msg) => (
                  <li key={msg}>{msg}</li>
                ))}
              </ul>
            </IonText>
          )}

          <IonButton type="submit" expand="block" className="ion-margin-top" disabled={loading}>
            {loading ? <IonSpinner name="dots" /> : 'Ingresar a CineDebate'}
          </IonButton>
          <IonButton fill="clear" expand="block" routerLink="/register">
            ¿No tienes cuenta? Regístrate
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
