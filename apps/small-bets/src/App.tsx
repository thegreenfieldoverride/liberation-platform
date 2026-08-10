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

/** Exposure styling, kept in the site's muted register rather than alarm colours. */
const EXPOSURE = {
  low: { chip: 'bg-green-50 text-green-800 border-green-200', rail: 'border-l-green-500' },
  medium: { chip: 'bg-amber-50 text-amber-800 border-amber-200', rail: 'border-l-amber-500' },
  high: { chip: 'bg-red-50 text-red-800 border-red-200', rail: 'border-l-red-400' },
} as const;

const BAND = {
  low: 'bg-green-500',
  moderate: 'bg-amber-500',
  high: 'bg-orange-500',
  severe: 'bg-red-500',
} as const;

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
    <div className="min-h-screen bg-gray-50 pb-16 pt-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="mb-2 text-3xl font-light text-gray-800">Small Bets</h1>
          <p className="max-w-2xl leading-relaxed text-gray-600">
            Most tools ask whether a bet is a good idea. This one asks what it costs{' '}
            <em>you</em> to start — because an idea you never begin returns exactly as much
            as a bad one.
          </p>
        </header>

        <div className="mb-8 rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-800">
            🔒 <strong className="font-medium">Your data is yours.</strong> Everything stays
            in your browser. We don&rsquo;t store, track, or share anything.
          </p>
        </div>

        <section className="mb-8" aria-labelledby="profile-heading">
          <h2 id="profile-heading" className="mb-4 text-xl font-light text-gray-700">
            What&rsquo;s expensive for you?
          </h2>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Friction profile">
            {(Object.keys(PROFILES) as ProfileKey[]).map(key => {
              const on = key === profileKey;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => chooseProfile(key)}
                  className={`focus-liberation rounded-lg border px-4 py-2 text-sm font-light transition-all duration-300 ${
                    on
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-800'
                  }`}
                >
                  {PROFILES[key].label}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            {profileKey === 'ef'
              ? 'Weighting novel admin, cold approach, sustained exposure and immovable deadlines much higher than the work itself.'
              : 'Every kind of step costs the same. Switch profiles and watch the order change — that reordering is the whole point.'}
          </p>
        </section>

        <ol className="space-y-4">
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

        <footer className="mt-12 border-t border-gray-200 pt-6">
          <p className="text-sm leading-relaxed text-gray-500">
            Ordering favours low AI exposure and a startable first rung. A modest bet you can
            begin outranks a brilliant one you can&rsquo;t.
          </p>
        </footer>
      </div>
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
  const ex = EXPOSURE[entry.aiExposure];

  return (
    <article className={`rounded-lg border border-gray-200 border-l-4 bg-white p-6 ${ex.rail}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-xl font-light text-gray-800">{entry.name}</h3>
        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${ex.chip}`}>
          {entry.aiExposure} AI exposure
        </span>
      </div>

      <p className="mt-2 leading-relaxed text-gray-600">{entry.premise}</p>

      <div className="mt-4 rounded-lg bg-gray-50 p-4">
        <div className="text-xs uppercase tracking-widest text-gray-500">Cheapest way in</div>
        <div className="mb-3 mt-1 text-gray-800">{rung.label}</div>
        <Meter score={activation} />
        <div className="mt-2 flex flex-wrap gap-x-2 text-sm text-gray-500">
          <span>{activation.initiationCount} starting lines</span>
          <span aria-hidden="true">·</span>
          <span>first money {rung.timeToFirstDollar}</span>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-gray-600">{rationale}</p>

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="focus-liberation mt-4 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-light text-gray-600 transition-all duration-300 hover:border-gray-400 hover:text-gray-800"
      >
        {open
          ? 'Hide the ladder'
          : `Show the ladder (${entry.ladder.length} ${
              entry.ladder.length === 1 ? 'rung' : 'rungs'
            })`}
      </button>

      {open && (
        <div className="mt-5 border-t border-gray-200 pt-5">
          <p className="text-sm leading-relaxed text-gray-500">
            Same channel, ordered by what it costs to enter. The point isn&rsquo;t that your
            ambition is too expensive — it&rsquo;s the rung below the one you keep falling
            off.
          </p>
          <ol className="mt-4 space-y-3">
            {entry.ladder.map(step => (
              <Rung
                key={step.id}
                rung={step}
                score={scoreActivation(step.initiations, friction)}
                recommended={step.id === rung.id}
              />
            ))}
          </ol>
          <p className="mt-4 text-sm leading-relaxed text-gray-500">
            <strong className="font-medium text-gray-700">What protects it:</strong>{' '}
            {entry.moat}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">{entry.exposureNote}</p>
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
    <li
      className={`rounded-lg border p-4 ${
        recommended ? 'border-green-300 bg-green-50/40' : 'border-gray-200 bg-gray-50'
      }`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="text-gray-800">{rung.label}</h4>
        {recommended && (
          <span className="text-xs font-medium uppercase tracking-widest text-green-700">
            start here
          </span>
        )}
      </div>

      <p className="mb-3 mt-1 text-sm leading-relaxed text-gray-600">{rung.description}</p>
      <Meter score={score} />
      <p className="mt-2 text-sm leading-relaxed text-gray-500">{score.summary}</p>

      {score.stallPoints.length > 0 && (
        <details className="mt-3">
          <summary className="focus-liberation cursor-pointer text-sm text-gray-600 hover:text-gray-800">
            Where you&rsquo;ll stall ({score.stallPoints.length})
          </summary>
          <ul className="mt-2 space-y-1.5">
            {score.stallPoints.map(sp => (
              <li key={sp.initiation.id} className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-gray-700">{sp.initiation.label}</span>
                <span className="rounded bg-gray-200 px-1.5 py-0.5 font-mono text-xs text-gray-600">
                  {sp.initiation.kind}
                </span>
                {sp.delegable ? (
                  <span className="text-xs text-green-700">someone else could do this</span>
                ) : (
                  <span className="text-xs text-red-700">has to be you</span>
                )}
              </li>
            ))}
          </ul>
          {score.delegableStallPoints.length > 0 && (
            <p className="mt-3 rounded-lg bg-blue-50 p-3 text-sm leading-relaxed text-blue-900">
              {score.delegableStallPoints.length} of these are delegable — that&rsquo;s the
              ask you&rsquo;d bring to a circle, rather than &ldquo;I need help with
              marketing&rdquo;.
            </p>
          )}
        </details>
      )}

      <p className="mt-3 text-sm leading-relaxed text-gray-600">
        <strong className="font-medium text-gray-700">Buys you:</strong> {rung.teaches}
      </p>
    </li>
  );
}

function Meter({ score }: { score: ActivationScore }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200"
        role="meter"
        aria-valuenow={score.rating}
        aria-valuemin={1}
        aria-valuemax={10}
        aria-label={`Activation energy ${score.rating} of 10, ${score.band}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${BAND[score.band]}`}
          style={{ width: `${score.rating * 10}%` }}
        />
      </div>
      <span className="whitespace-nowrap text-xs tabular-nums text-gray-500">
        {score.band} · {score.rating}/10
      </span>
    </div>
  );
}
