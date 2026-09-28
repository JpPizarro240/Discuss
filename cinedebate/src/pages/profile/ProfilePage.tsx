import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/react';
import { useAuth } from '../../services/auth/AuthContext';

const ProfilePage: React.FC = () => {
  const { logout } = useAuth();
  
  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>Mi Perfil</IonTitle></IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="block" color="danger" onClick={logout}>Cerrar Sesión</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;