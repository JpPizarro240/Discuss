import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonList, IonItem, IonLabel,
} from '@ionic/react';
import { useAuth } from '../../services/auth/AuthContext';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mi Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel>
              <p>Usuario</p>
              <h2>{user?.username}</h2>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <p>Rol</p>
              <h2>{user?.role === 'admin' ? 'Moderador (admin)' : 'Crítico (usuario)'}</h2>
            </IonLabel>
          </IonItem>
        </IonList>
        <IonButton expand="block" color="danger" className="ion-margin-top" onClick={logout}>
          Cerrar Sesión
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
