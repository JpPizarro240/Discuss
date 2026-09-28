import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';

import { AuthProvider, useAuth } from './services/auth/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import AppTabs from './routes/AppTabs';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

setupIonicReact();

const RootRedirect: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return <Redirect to={isAuthenticated ? '/app/home' : '/login'} />;
};

const AppRoutes: React.FC = () => (
  <IonReactRouter>
    <IonRouterOutlet>
      {/* Rutas públicas */}
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/register" component={RegisterPage} />

      {/* Rutas protegidas (sesión obligatoria) */}
      <PrivateRoute path="/app">
        <AppTabs />
      </PrivateRoute>

      {/* Redirección raíz */}
      <Route exact path="/">
        <RootRedirect />
      </Route>

      <Route render={() => <Redirect to="/" />} />
    </IonRouterOutlet>
  </IonReactRouter>
);

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </IonApp>
);

export default App;