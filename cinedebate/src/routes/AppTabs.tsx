import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
import { home, person } from 'ionicons/icons';
import HomePage from '../pages/catalog/HomePage';
import ProfilePage from '../pages/profile/ProfilePage';

const AppTabs: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route exact path="/app/home" component={HomePage} />
      <Route exact path="/app/profile" component={ProfilePage} />
      <Route exact path="/app" render={() => <Redirect to="/app/home" />} />
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