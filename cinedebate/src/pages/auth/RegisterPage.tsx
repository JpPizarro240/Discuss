import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonText, IonSpinner,
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/auth/AuthContext';
import { ApiError } from '../../services/api';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[A-Za-z0-9_]{3,30}$/;

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mismas reglas que valida el backend
    const found: string[] = [];
    if (!USERNAME_RE.test(username.trim())) {
      found.push('El usuario debe tener 3 a 30 caracteres (letras, números o guion bajo).');
    }
    if (!EMAIL_RE.test(email.trim())) found.push('Ingresa un correo válido.');
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      found.push('La contraseña debe tener al menos 8 caracteres, con letras y números.');
    }
    if (password !== confirm) found.push('Las contraseñas no coinciden.');
    setErrors(found);
    if (found.length > 0) return;

    setLoading(true);
    try {
      await register(username.trim(), email.trim(), password);
      navigate('/app/home', { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.details.length > 0 ? err.details : [err.message]);
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
          <IonTitle>Registro</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit} noValidate>
          <IonInput
            label="Nombre de usuario"
            labelPlacement="floating"
            fill="outline"
            autocomplete="username"
            helperText="3 a 30 caracteres: letras, números o _"
            value={username}
            onIonInput={(e) => setUsername(e.detail.value ?? '')}
          />
          <br />
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
            autocomplete="new-password"
            helperText="Mínimo 8 caracteres, con letras y números"
            value={password}
            onIonInput={(e) => setPassword(e.detail.value ?? '')}
          />
          <br />
          <IonInput
            label="Confirmar contraseña"
            labelPlacement="floating"
            fill="outline"
            type="password"
            autocomplete="new-password"
            value={confirm}
            onIonInput={(e) => setConfirm(e.detail.value ?? '')}
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
            {loading ? <IonSpinner name="dots" /> : 'Crear cuenta'}
          </IonButton>
          <IonButton fill="clear" expand="block" routerLink="/login">
            ¿Ya tienes cuenta? Inicia sesión
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
