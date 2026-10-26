import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { Route, Navigate } from 'react-router-dom';
import { home, person } from 'ionicons/icons';
import HomePage from '../pages/cataloge/HomePage';
import ProfilePage from '../pages/profile/ProfilePage';

// Se monta en /app/* (ver App.tsx). Las rutas hijas son relativas a /app.
const AppTabs: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route path="home" element={<HomePage />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route index element={<Navigate to="home" replace />} />
    </IonRouterOutlet>
    <IonTabBar slot="bottom">
      <IonTabButton tab="home" href="/app/home">
        <IonIcon icon={home} />
        <IonLabel>Catálogo</IonLabel>
      </IonTabButton>
      <IonTabButton tab="profile" href="/app/profile">
        <IonIcon icon={person} />
        <IonLabel>Perfil</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

export default AppTabs;
