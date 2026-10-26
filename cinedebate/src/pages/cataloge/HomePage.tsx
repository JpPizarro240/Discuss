import React, { useEffect, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonSpinner, IonText,
} from '@ionic/react';
import { getTitles, Title } from '../../services/titleService';

// Catálogo: carga las películas y series desde la API (GET /api/titles)
const HomePage: React.FC = () => {
  const [titles, setTitles] = useState<Title[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getTitles()
      .then((data) => active && setTitles(data))
      .catch((err: Error) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Catálogo</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {loading && <IonSpinner name="dots" />}

        {error && (
          <IonText color="danger" role="alert">
            <p>{error}</p>
          </IonText>
        )}

        {!loading && !error && titles.length === 0 && <p>Aún no hay títulos en el catálogo.</p>}

        <IonList>
          {titles.map((t) => (
            <IonItem key={t.id}>
              <IonLabel>
                <h2>{t.name}</h2>
                <p>
                  {t.type === 'serie' ? 'Serie' : 'Película'}
                  {t.genre ? ` · ${t.genre}` : ''}
                  {t.release_year ? ` · ${t.release_year}` : ''}
                </p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
