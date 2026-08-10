import { useMemo, useState } from 'react';
import {
  BET_CATALOG,
  EXECUTIVE_FUNCTION_FRICTION,
  NEUTRAL_FRICTION,
  scoreActivation,
  suggestBets,
  type ActivationScore,
  type BetRung,
  type CatalogEntry,
  type FrictionProfile,
} from '@greenfieldoverride/small-bets-portfolio/core';

const PROFILES = {
  neutral: { label: 'Neutral', profile: NEUTRAL_FRICTION },
  ef: { label: 'Executive function', profile: EXECUTIVE_FUNCTION_FRICTION },
} as const;

type ProfileKey = keyof typeof PROFILES;

const STORAGE_KEY = 'small-bets:friction-profile';

function loadProfileKey(): ProfileKey {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'ef' || stored === 'neutral' ? stored : 'neutral';
  } catch {
    return 'neutral';
  }
}

export default function App() {
  const [profileKey, setProfileKey] = useState<ProfileKey>(loadProfileKey);
  const [expanded, setExpanded] = useState<string | null>(null);

  const friction: FrictionProfile = PROFILES[profileKey].profile;

  const ranked = useMemo(() => suggestBets([], friction, BET_CATALOG.length), [friction]);

  function chooseProfile(key: ProfileKey) {
    setProfileKey(key);
    try {
      localStorage.setItem(STORAGE_KEY, key);
    } catch {
      /* private mode — the app still works, it just won't remember */
    }
  }

  return (
    <div className="app">
      <header className="masthead">
        <h1>Small Bets</h1>
        <p className="lede">
          Most tools ask whether a bet is a good idea. This one asks what it costs{' '}
          <em>you</em> to start — because an idea you never begin returns exactly as much
          as a bad one.
        </p>
        <p className="privacy">
          Everything stays on this device. No account, no server, works offline.
        </p>
      </header>

      <section className="profile" aria-labelledby="profile-heading">
        <h2 id="profile-heading">What's expensive for you?</h2>
        <div className="segmented" role="group" aria-label="Friction profile">
          {(Object.keys(PROFILES) as ProfileKey[]).map(key => (
            <button
              key={key}
              type="button"
              className={key === profileKey ? 'seg seg-on' : 'seg'}
              aria-pressed={key === profileKey}
              onClick={() => chooseProfile(key)}
            >
              {PROFILES[key].label}
            </button>
          ))}
        </div>
        <p className="hint">
          {profileKey === 'ef'
            ? 'Weighting novel admin, cold approach, sustained exposure and immovable deadlines much higher than the work itself.'
            : 'Every kind of step costs the same. Switch profiles and watch the order change — that reordering is the whole point.'}
        </p>
      </section>

      <ol className="catalog">
        {ranked.map(({ entry, recommendedRung, activation, rationale }) => (
          <li key={entry.id}>
            <EntryCard
              entry={entry}
              rung={recommendedRung}
              activation={activation}
              rationale={rationale}
              friction={friction}
              open={expanded === entry.id}
              onToggle={() => setExpanded(expanded === entry.id ? null : entry.id)}
            />
          </li>
        ))}
      </ol>

      <footer className="foot">
        <p>
          Ordering favours low AI exposure and a startable first rung. A modest bet you
          can begin outranks a brilliant one you can't.
        </p>
      </footer>
    </div>
  );
}

function EntryCard({
  entry,
  rung,
  activation,
  rationale,
  friction,
  open,
  onToggle,
}: {
  entry: CatalogEntry;
  rung: BetRung;
  activation: ActivationScore;
  rationale: string;
  friction: FrictionProfile;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <article className={`card exposure-${entry.aiExposure}`}>
      <div className="card-head">
        <h3>{entry.name}</h3>
        <span className={`badge badge-${entry.aiExposure}`}>
          {entry.aiExposure} AI exposure
        </span>
      </div>

      <p className="premise">{entry.premise}</p>

      <div className="recommend">
        <div className="recommend-label">Cheapest way in</div>
        <div className="recommend-rung">{rung.label}</div>
        <Meter score={activation} />
        <div className="recommend-meta">
          <span>{activation.initiationCount} starting lines</span>
          <span aria-hidden="true">·</span>
          <span>first money {rung.timeToFirstDollar}</span>
        </div>
      </div>

      <p className="rationale">{rationale}</p>

      <button type="button" className="disclose" onClick={onToggle} aria-expanded={open}>
        {open
          ? 'Hide the ladder'
          : `Show the ladder (${entry.ladder.length} ${
              entry.ladder.length === 1 ? 'rung' : 'rungs'
            })`}
      </button>

      {open && (
        <div className="ladder">
          <p className="ladder-note">
            Same channel, ordered by what it costs to enter. The point isn't that your
            ambition is too expensive — it's the rung below the one you keep falling off.
          </p>
          <ol>
            {entry.ladder.map(step => (
              <Rung
                key={step.id}
                rung={step}
                score={scoreActivation(step.initiations, friction)}
                recommended={step.id === rung.id}
              />
            ))}
          </ol>
          <p className="moat">
            <strong>What protects it:</strong> {entry.moat}
          </p>
          <p className="exposure-note">{entry.exposureNote}</p>
        </div>
      )}
    </article>
  );
}

function Rung({
  rung,
  score,
  recommended,
}: {
  rung: BetRung;
  score: ActivationScore;
  recommended: boolean;
}) {
  return (
    <li className={recommended ? 'rung rung-rec' : 'rung'}>
      <div className="rung-head">
        <h4>{rung.label}</h4>
        {recommended && <span className="rec-tag">start here</span>}
      </div>
      <p className="rung-desc">{rung.description}</p>
      <Meter score={score} />
      <p className="rung-summary">{score.summary}</p>

      {score.stallPoints.length > 0 && (
        <details className="stalls">
          <summary>Where you'll stall ({score.stallPoints.length})</summary>
          <ul>
            {score.stallPoints.map(sp => (
              <li key={sp.initiation.id}>
                <span className="stall-label">{sp.initiation.label}</span>
                <span className={`kind kind-${sp.initiation.kind}`}>
                  {sp.initiation.kind}
                </span>
                {sp.delegable ? (
                  <span className="deleg">someone else could do this</span>
                ) : (
                  <span className="must">has to be you</span>
                )}
              </li>
            ))}
          </ul>
          {score.delegableStallPoints.length > 0 && (
            <p className="circle-ask">
              {score.delegableStallPoints.length} of these are delegable — that's the ask
              you'd bring to a circle, rather than "I need help with marketing".
            </p>
          )}
        </details>
      )}

      <p className="teaches">
        <strong>Buys you:</strong> {rung.teaches}
      </p>
    </li>
  );
}

function Meter({ score }: { score: ActivationScore }) {
  return (
    <div
      className={`meter meter-${score.band}`}
      role="meter"
      aria-valuenow={score.rating}
      aria-valuemin={1}
      aria-valuemax={10}
      aria-label={`Activation energy ${score.rating} of 10, ${score.band}`}
    >
      <div className="meter-track">
        <div className="meter-fill" style={{ width: `${score.rating * 10}%` }} />
      </div>
      <span className="meter-text">
        {score.band} · {score.rating}/10
      </span>
    </div>
  );
}
