import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/react';
import { useAuth } from '../../services/auth/AuthContext';
import { useHistory } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const history = useHistory();

  const handleLogin = () => {
    login({ id: '1', username: 'Admin', role: 'moderador' });
    history.push('/app/home');
  };

  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>Iniciar Sesión</IonTitle></IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="block" onClick={handleLogin}>Ingresar a CineDebate</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;