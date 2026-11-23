import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { Route, Navigate } from 'react-router-dom';
import { home, person } from 'ionicons/icons';
import HomePage from '../pages/cataloge/HomePage';
import ProfilePage from '../pages/profile/ProfilePage';
import TitleDetailPage from '../pages/titles/TitleDetailPage';
import DebateDetailPage from '../pages/debates/DebateDetailPage';

// Se monta en /app/* (ver App.tsx). Las rutas hijas son relativas a /app.
// Las pantallas de titulo y debate no estan en la barra de tabs: se llega
// a ellas navegando desde el catalogo, para mantener solo 2 tabs.
const AppTabs: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route path="home" element={<HomePage />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="titles/:id" element={<TitleDetailPage />} />
      <Route path="debates/:id" element={<DebateDetailPage />} />
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
