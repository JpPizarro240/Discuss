import React from 'react';
import { Navigate, Route } from 'react-router-dom';
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
import './theme/app.css';

import { AuthProvider, useAuth } from './services/auth/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import AppTabs from './routes/AppTabs';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

setupIonicReact(); // inicializa los componentes web de Ionic antes de renderizar

// Decide a donde mandar "/" segun si hay sesion o no. Se usa en vez de poner
// directamente <Navigate to="/app/home" /> porque sin esto alguien sin login
// terminaria cayendo en una ruta protegida y PrivateRoute lo rebotaria igual,
// mejor decidirlo de una vez aca.
const RootRedirect: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/app/home' : '/login'} replace />;
};

// Arbol de rutas de toda la app. PublicRoute/PrivateRoute son los que
// realmente deciden si se puede entrar o no (ver src/routes).
const AppRoutes: React.FC = () => (
  <IonReactRouter>
    <IonRouterOutlet>
      {/* Rutas públicas (si ya hay sesión, redirigen al catálogo) */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Rutas protegidas (sesión obligatoria) */}
      <Route path="/app/*" element={<PrivateRoute><AppTabs /></PrivateRoute>} />

      {/* Redirección raíz y rutas desconocidas */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </IonRouterOutlet>
  </IonReactRouter>
);

// AuthProvider envuelve TODA la app (no solo las rutas protegidas) porque
// hasta PublicRoute necesita saber si ya hay sesion para redirigir.
const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </IonApp>
);

export default App;
