import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSpinner, IonText,
  IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonCardContent, IonIcon, IonBadge,
} from '@ionic/react';
import { star, film, tv } from 'ionicons/icons';
import { getTitles, Title } from '../../services/titleService';
import { getRatingSummary, RatingSummary } from '../../services/ratingService';

// Catálogo: carga las películas y series desde la API (GET /api/titles)
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [titles, setTitles] = useState<Title[]>([]);
  const [ratings, setRatings] = useState<Record<number, RatingSummary>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getTitles()
      .then(async (data) => {
        if (!active) return;
        setTitles(data);
        // Trae el promedio de cada titulo en paralelo (catalogo chico, no hay problema de rendimiento)
        const entries = await Promise.all(
          data.map(async (t) => [t.id, await getRatingSummary(t.id)] as const)
        );
        if (active) setRatings(Object.fromEntries(entries));
      })
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
        <div className="page-wrap">
          {loading && <IonSpinner name="dots" />}

          {error && (
            <IonText color="danger" role="alert">
              <p>{error}</p>
            </IonText>
          )}

          {!loading && !error && titles.length === 0 && <p>Aún no hay títulos en el catálogo.</p>}

          <IonGrid>
            <IonRow>
              {titles.map((t) => {
                const summary = ratings[t.id];
                return (
                  <IonCol key={t.id} sizeXs="12" sizeSm="6" sizeMd="4">
                    <IonCard className="title-card-grid" button onClick={() => navigate(`/app/titles/${t.id}`)}>
                      <div className="poster-placeholder">
                        <IonIcon icon={t.type === 'serie' ? tv : film} />
                      </div>
                      <IonCardHeader>
                        <IonCardTitle>{t.name}</IonCardTitle>
                        <IonCardSubtitle>
                          {t.type === 'serie' ? 'Serie' : 'Película'}
                          {t.genre ? ` · ${t.genre}` : ''}
                          {t.release_year ? ` · ${t.release_year}` : ''}
                        </IonCardSubtitle>
                      </IonCardHeader>
                      <IonCardContent>
                        {summary && summary.count > 0 && (
                          <IonBadge color="warning" className="rating-badge">
                            <IonIcon icon={star} /> {summary.average} ({summary.count})
                          </IonBadge>
                        )}
                        {t.synopsis && <p className="synopsis-clamp">{t.synopsis}</p>}
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                );
              })}
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
