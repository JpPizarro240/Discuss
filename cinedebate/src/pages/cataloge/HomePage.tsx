import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';

const HomePage: React.FC = () => (
  <IonPage>
    <IonHeader><IonToolbar><IonTitle>Catálogo</IonTitle></IonToolbar></IonHeader>
    <IonContent className="ion-padding">
      <h2>Películas y Series</h2>
      <p>Aquí irá la lista de títulos.</p>
    </IonContent>
  </IonPage>
);

export default HomePage;