import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent,
  IonSpinner, IonText, IonButton, IonTextarea, IonSelect, IonSelectOption, IonIcon,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonChip, IonLabel,
  IonCheckbox, IonItem,
} from '@ionic/react';
import { thumbsUpOutline, thumbsDownOutline, eyeOffOutline, warningOutline } from 'ionicons/icons';
import { getDebate, Debate } from '../../services/debateService';
import { createArgument, getArgumentsByDebate, voteArgument, Argument } from '../../services/argumentService';
import { ApiError } from '../../services/api';
import { useAuth } from '../../services/auth/AuthContext';

const STANCES = [
  { value: 'a_favor', label: 'A favor' },
  { value: 'en_contra', label: 'En contra' },
  { value: 'neutral', label: 'Neutral' },
];

const STANCE_LABEL: Record<string, string> = {
  a_favor: 'A favor',
  en_contra: 'En contra',
  neutral: 'Neutral',
};

// Color del chip de postura: verde a favor, rojo en contra, gris neutral
const STANCE_COLOR: Record<string, string> = {
  a_favor: 'success',
  en_contra: 'danger',
  neutral: 'medium',
};

// Detalle de un debate: argumentos con postura declarada, voto de utilidad
// (RF-04, RF-05) y ocultamiento de spoilers hasta que el lector los pide ver.
const DebateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const debateId = Number(id);
  const { user } = useAuth();

  const [debate, setDebate] = useState<Debate | null>(null);
  const [args, setArgs] = useState<Argument[]>([]);
  // Guarda que argumentos con spoiler el usuario ya decidio mostrar en esta
  // visita (se resetea si recarga la pagina; no se guarda en el backend
  // porque es solo una preferencia de lectura, no un dato del argumento)
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [content, setContent] = useState('');
  const [stance, setStance] = useState('a_favor');
  const [hasSpoilers, setHasSpoilers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [voteError, setVoteError] = useState('');

  const loadArguments = async () => {
    const data = await getArgumentsByDebate(debateId);
    setArgs(data);
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([getDebate(debateId), getArgumentsByDebate(debateId)])
      .then(([d, a]) => {
        if (!active) return;
        setDebate(d);
        setArgs(a);
      })
      .catch((err: Error) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [debateId]);

  const handleCreateArgument = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (content.trim().length < 10) {
      setFormError('El argumento debe tener al menos 10 caracteres');
      return;
    }

    setSubmitting(true);
    try {
      await createArgument(debateId, stance, content.trim(), hasSpoilers);
      setContent('');
      setHasSpoilers(false);
      await loadArguments();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'No se pudo publicar el argumento');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (argumentId: number, value: 1 | -1) => {
    setVoteError('');
    try {
      await voteArgument(argumentId, value);
      await loadArguments();
    } catch (err) {
      setVoteError(err instanceof ApiError ? err.message : 'No se pudo registrar el voto');
    }
  };

  const debateClosed = debate?.status === 'cerrado';

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/home" />
          </IonButtons>
          <IonTitle>Debate</IonTitle>
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

          {!loading && !error && debate && (
            <>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>{debate.thesis}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonChip color="primary" outline>{debate.category}</IonChip>
                  <IonChip color={debateClosed ? 'medium' : 'success'}>{debate.status}</IonChip>
                </IonCardContent>
              </IonCard>

              <h2 style={{ marginTop: '24px' }}>Argumentos</h2>

              {args.length === 0 && <p>Todavía no hay argumentos. Sé el primero en participar.</p>}

              {voteError && (
                <IonText color="danger" role="alert">
                  <p>{voteError}</p>
                </IonText>
              )}

              {args.map((a) => {
                const isOwn = a.user_id === user?.id; // controla el boton de voto deshabilitado
                const isHidden = a.has_spoilers && !revealed[a.id]; // funcion anti-spoiler
                return (
                  <IonCard key={a.id} className={`argument-card ${isOwn ? 'own-argument' : ''}`}>
                    <IonCardContent>
                      <IonChip color={STANCE_COLOR[a.stance]} className="stance-chip">
                        {STANCE_LABEL[a.stance] ?? a.stance}
                      </IonChip>
                      {a.has_spoilers && (
                        <IonChip color="warning">
                          <IonIcon icon={warningOutline} />
                          &nbsp;Spoiler
                        </IonChip>
                      )}

                      {isHidden ? (
                        <div className="spoiler-hidden">
                          <IonIcon icon={eyeOffOutline} />
                          <span>Este argumento contiene spoilers.</span>
                          <IonButton
                            size="small"
                            fill="outline"
                            onClick={() => setRevealed((prev) => ({ ...prev, [a.id]: true }))}
                          >
                            Mostrar de todas formas
                          </IonButton>
                        </div>
                      ) : (
                        <p>{a.content}</p>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <IonButton fill="clear" size="small" disabled={isOwn} onClick={() => handleVote(a.id, 1)}>
                          <IonIcon icon={thumbsUpOutline} slot="start" />
                          {a.votes.useful}
                        </IonButton>
                        <IonButton fill="clear" size="small" disabled={isOwn} onClick={() => handleVote(a.id, -1)}>
                          <IonIcon icon={thumbsDownOutline} slot="start" />
                          {a.votes.not_useful}
                        </IonButton>
                        {isOwn && (
                          <IonText color="medium">
                            <small>tu argumento</small>
                          </IonText>
                        )}
                      </div>
                    </IonCardContent>
                  </IonCard>
                );
              })}

              {debateClosed ? (
                <IonCard>
                  <IonCardContent>
                    <em>Este debate está cerrado, ya no se pueden agregar argumentos.</em>
                  </IonCardContent>
                </IonCard>
              ) : (
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle style={{ fontSize: '1.1rem' }}>Agregar un argumento</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <form onSubmit={handleCreateArgument}>
                      <IonLabel>Tu postura</IonLabel>
                      <IonSelect value={stance} onIonChange={(e) => setStance(e.detail.value)} interface="popover">
                        {STANCES.map((s) => (
                          <IonSelectOption key={s.value} value={s.value}>
                            {s.label}
                          </IonSelectOption>
                        ))}
                      </IonSelect>
                      <br />
                      <br />
                      <IonTextarea
                        label="Argumento"
                        labelPlacement="stacked"
                        fill="outline"
                        value={content}
                        maxlength={2000}
                        autoGrow
                        onIonInput={(e) => setContent(e.detail.value ?? '')}
                        placeholder="Explica tu postura con al menos 10 caracteres..."
                      />

                      <IonItem lines="none" style={{ marginTop: '8px' }}>
                        <IonCheckbox
                          checked={hasSpoilers}
                          onIonChange={(e) => setHasSpoilers(e.detail.checked)}
                          labelPlacement="end"
                        >
                          Este argumento contiene spoilers
                        </IonCheckbox>
                      </IonItem>

                      {formError && (
                        <IonText color="danger" role="alert">
                          <p>{formError}</p>
                        </IonText>
                      )}

                      <IonButton expand="block" type="submit" className="ion-margin-top" disabled={submitting}>
                        {submitting ? 'Publicando...' : 'Publicar argumento'}
                      </IonButton>
                    </form>
                  </IonCardContent>
                </IonCard>
              )}
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DebateDetailPage;
