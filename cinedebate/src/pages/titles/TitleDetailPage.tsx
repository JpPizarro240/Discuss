import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent,
  IonSpinner, IonText, IonButton, IonInput, IonSelect, IonSelectOption, IonIcon,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonChip, IonLabel,
} from '@ionic/react';
import { star, starOutline, film, tv } from 'ionicons/icons';
import { getTitleById, Title } from '../../services/titleService';
import { createDebate, getDebatesByTitle, Debate } from '../../services/debateService';
import { getRatingSummary, rateTitle, RatingSummary } from '../../services/ratingService';
import { ApiError } from '../../services/api';

const CATEGORIES = [
  { value: 'interpretacion', label: 'Interpretacion' },
  { value: 'guion', label: 'Guion' },
  { value: 'actuacion', label: 'Actuacion' },
  { value: 'comparacion', label: 'Comparacion' },
  { value: 'otro', label: 'Otro' },
];

// Fila de 5 estrellas clickeables para calificar un titulo (1 a 5)
const StarRating: React.FC<{ value: number; onRate: (v: number) => void }> = ({ value, onRate }) => (
  <div className="star-rating">
    {[1, 2, 3, 4, 5].map((n) => (
      <IonIcon
        key={n}
        icon={n <= value ? star : starOutline}
        color="warning"
        onClick={() => onRate(n)}
        style={{ fontSize: '28px', cursor: 'pointer', marginRight: 4 }}
      />
    ))}
  </div>
);

// Detalle de un titulo del catalogo: calificacion, debates y abrir uno nuevo (RF-03)
const TitleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const titleId = Number(id);

  const [title, setTitle] = useState<Title | null>(null);
  const [debates, setDebates] = useState<Debate[]>([]);
  const [rating, setRating] = useState<RatingSummary>({ average: 0, count: 0 });
  const [myRating, setMyRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ratingError, setRatingError] = useState('');

  const [thesis, setThesis] = useState('');
  const [category, setCategory] = useState('otro');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Funcion aparte (no solo dentro del useEffect) porque tambien se llama
  // despues de crear un debate nuevo, para refrescar la lista sin recargar
  // toda la pagina ni volver a pedir el titulo y la calificacion otra vez.
  const loadDebates = async () => {
    const data = await getDebatesByTitle(titleId);
    setDebates(data);
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([getTitleById(titleId), getDebatesByTitle(titleId), getRatingSummary(titleId)])
      .then(([t, d, r]) => {
        if (!active) return;
        setTitle(t);
        setDebates(d);
        setRating(r);
      })
      .catch((err: Error) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [titleId]);

  const handleRate = async (value: number) => {
    setRatingError('');
    setMyRating(value); // se pinta la estrella al toque, no se espera la respuesta del server
    try {
      const summary = await rateTitle(titleId, value);
      setRating(summary); // promedio/cantidad actualizados que devuelve la API
    } catch (err) {
      setRatingError(err instanceof ApiError ? err.message : 'No se pudo registrar la calificacion');
    }
  };

  const handleCreateDebate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (thesis.trim().length === 0) {
      setFormError('La tesis del debate es obligatoria');
      return;
    }

    setSubmitting(true);
    try {
      await createDebate(titleId, thesis.trim(), category);
      setThesis('');
      setCategory('otro');
      await loadDebates();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'No se pudo crear el debate');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/home" />
          </IonButtons>
          <IonTitle>{title?.name ?? 'Titulo'}</IonTitle>
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

          {!loading && !error && title && (
            <>
              <IonCard>
                <div className="poster-placeholder" style={{ height: 120 }}>
                  <IonIcon icon={title.type === 'serie' ? tv : film} />
                </div>
                <IonCardHeader>
                  <IonCardTitle>{title.name}</IonCardTitle>
                  <IonCardSubtitle>
                    {title.type === 'serie' ? 'Serie' : 'Película'}
                    {title.genre ? ` · ${title.genre}` : ''}
                    {title.release_year ? ` · ${title.release_year}` : ''}
                  </IonCardSubtitle>
                </IonCardHeader>
                {title.synopsis && (
                  <IonCardContent>
                    <p>{title.synopsis}</p>
                  </IonCardContent>
                )}
              </IonCard>

              <IonCard>
                <IonCardHeader>
                  <IonCardTitle style={{ fontSize: '1.1rem' }}>Calificación</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>
                    {rating.count > 0
                      ? `${rating.average} / 5 (${rating.count} voto${rating.count === 1 ? '' : 's'})`
                      : 'Todavía sin calificaciones'}
                  </p>
                  <StarRating value={myRating} onRate={handleRate} />
                  {ratingError && (
                    <IonText color="danger" role="alert">
                      <p>{ratingError}</p>
                    </IonText>
                  )}
                </IonCardContent>
              </IonCard>

              <h2 style={{ marginTop: '24px' }}>Debates</h2>

              {debates.length === 0 && <p>Todavía no hay debates sobre este título. Sé el primero en abrir uno.</p>}

              {debates.map((d) => (
                <IonCard
                  key={d.id}
                  button
                  className="debate-card"
                  onClick={() => navigate(`/app/debates/${d.id}`)}
                >
                  <IonCardHeader>
                    <IonCardTitle style={{ fontSize: '1.05rem' }}>{d.thesis}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonChip color="primary" outline>
                      {d.category}
                    </IonChip>
                    <IonChip color={d.status === 'abierto' ? 'success' : 'medium'}>{d.status}</IonChip>
                  </IonCardContent>
                </IonCard>
              ))}

              <IonCard>
                <IonCardHeader>
                  <IonCardTitle style={{ fontSize: '1.1rem' }}>Abrir un nuevo debate</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <form onSubmit={handleCreateDebate}>
                    <IonInput
                      label="Tesis del debate"
                      labelPlacement="stacked"
                      fill="outline"
                      value={thesis}
                      maxlength={255}
                      onIonInput={(e) => setThesis(e.detail.value ?? '')}
                      placeholder="Ej: El final de la serie traiciona a su protagonista"
                    />
                    <br />
                    <IonLabel>Categoría</IonLabel>
                    <IonSelect value={category} onIonChange={(e) => setCategory(e.detail.value)} interface="popover">
                      {CATEGORIES.map((c) => (
                        <IonSelectOption key={c.value} value={c.value}>
                          {c.label}
                        </IonSelectOption>
                      ))}
                    </IonSelect>

                    {formError && (
                      <IonText color="danger" role="alert">
                        <p>{formError}</p>
                      </IonText>
                    )}

                    <IonButton expand="block" type="submit" className="ion-margin-top" disabled={submitting}>
                      {submitting ? 'Creando...' : 'Crear debate'}
                    </IonButton>
                  </form>
                </IonCardContent>
              </IonCard>
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TitleDetailPage;
