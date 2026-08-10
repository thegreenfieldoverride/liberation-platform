/**
 * Activation Energy Scoring
 *
 * Most tools ask whether a bet is a good idea. This one asks whether *you*
 * can actually start it — because an idea you never begin returns exactly
 * as much as a bad one.
 *
 * A "small bet" is almost never one task. A farmer's market stall is twenty
 * distinct initiations wearing a single name: apply, get approved, forecast
 * inventory, produce it, price it, pack it, wake at 5, drive, raise a tent
 * alone, stand visible for six hours, pitch strangers, handle cash, tear down.
 * Counting that as "one bet" is how people conclude they are lazy when what
 * they actually hit was twenty separate starting lines.
 *
 * So we count the initiations, weight them by the friction *this* person
 * carries, and name the specific steps where they will stall.
 *
 * LIBERATION LICENSE: This code is designed for individual freedom,
 * not corporate optimization. Corporate use violates human dignity.
 */

/**
 * The kinds of starting-line a step can be. These are deliberately about the
 * *shape* of the demand, not the skill involved — two steps can both be
 * "hard" and stall completely different people.
 */
export type InitiationKind =
  /** Forms, licensing, registration, applications. Unbounded, opaque, often waiting. */
  | 'admin'
  /** Committing money you may not get back. */
  | 'purchase'
  /** Producing the thing. For most makers this is the part that isn't the problem. */
  | 'making'
  /** Approaching strangers who did not ask to hear from you. */
  | 'social-cold'
  /** Asking people who already know you. */
  | 'social-warm'
  /** Being visibly perceived, continuously, for a sustained stretch. */
  | 'exposure'
  /** Packing, hauling, setup, teardown. Physical and sequential. */
  | 'logistics'
  /** An externally fixed time you must hit. 5am Saturday does not negotiate. */
  | 'schedule-fixed'
  /** Build, configure, debug. */
  | 'technical'
  /** Blocked on someone else's reply, with no way to advance it. */
  | 'waiting';

export interface Initiation {
  id: string;
  label: string;
  kind: InitiationKind;
  /** Roughly how long the step itself takes once begun, in hours. */
  estimatedHours?: number;
  /**
   * True when the step cannot be handed to anyone else. Steps that *can* be
   * delegated are the ones a Sovereign Circle can absorb.
   */
  mustBeYou?: boolean;
}

/**
 * Per-person friction multipliers, 0–3, where 1 is neutral.
 *
 * This is the whole point. Generic difficulty ratings are useless: an
 * engineer with social anxiety and an extrovert who has never opened a
 * terminal face inverted versions of the same ladder. Nobody's profile is
 * wrong — it's just theirs.
 */
export type FrictionProfile = Record<InitiationKind, number>;

/** Neutral baseline. Every kind costs the same until the user says otherwise. */
export const NEUTRAL_FRICTION: FrictionProfile = {
  admin: 1,
  purchase: 1,
  making: 1,
  'social-cold': 1,
  'social-warm': 1,
  exposure: 1,
  logistics: 1,
  'schedule-fixed': 1,
  technical: 1,
  waiting: 1,
};

/**
 * A starting point for people whose blocker is executive function rather than
 * capability: novel admin, cold approach, sustained exposure and immovable
 * external deadlines cost far more than the work itself.
 */
export const EXECUTIVE_FUNCTION_FRICTION: FrictionProfile = {
  ...NEUTRAL_FRICTION,
  admin: 2.5,
  'social-cold': 2.5,
  exposure: 2.5,
  'schedule-fixed': 2,
  waiting: 1.8,
  logistics: 1.5,
  making: 0.7,
};

/** Base cost per kind before the personal multiplier is applied. */
const BASE_COST: Record<InitiationKind, number> = {
  admin: 3,
  purchase: 2,
  making: 1,
  'social-cold': 4,
  'social-warm': 2,
  exposure: 4,
  logistics: 2,
  'schedule-fixed': 3,
  technical: 2,
  waiting: 2,
};

export interface StallPoint {
  initiation: Initiation;
  /** Weighted cost of this single step. */
  cost: number;
  /** Whether someone else could take this step for you. */
  delegable: boolean;
}

export interface ActivationScore {
  /** Number of distinct starting lines between here and the first dollar. */
  initiationCount: number;
  /** Total weighted activation energy. Comparable across bets for one person. */
  score: number;
  /** 1–10, normalised for display. */
  rating: number;
  band: 'low' | 'moderate' | 'high' | 'severe';
  /**
   * The steps most likely to stop you, worst first. This is the useful
   * output — not the number. Naming the specific rung you fall off is what
   * turns "I couldn't do it" into "I stall at step 9, and step 9 is
   * delegable."
   */
  stallPoints: StallPoint[];
  /** Stall points someone else could absorb. The ask you bring to a circle. */
  delegableStallPoints: StallPoint[];
  /** Plain-language read of the score. */
  summary: string;
}

export function scoreActivation(
  initiations: Initiation[],
  friction: FrictionProfile = NEUTRAL_FRICTION,
): ActivationScore {
  const scored: StallPoint[] = initiations.map(initiation => ({
    initiation,
    cost: BASE_COST[initiation.kind] * (friction[initiation.kind] ?? 1),
    delegable: initiation.mustBeYou !== true,
  }));

  const score = scored.reduce((sum, s) => sum + s.cost, 0);

  // ~40 weighted points is a genuinely heavy lift for one person; clamp there.
  const rating = Math.max(1, Math.min(10, Math.round((score / 40) * 10)));

  const band: ActivationScore['band'] =
    rating <= 3 ? 'low' : rating <= 5 ? 'moderate' : rating <= 7 ? 'high' : 'severe';

  const stallPoints = [...scored].sort((a, b) => b.cost - a.cost).slice(0, 5);

  return {
    initiationCount: initiations.length,
    score,
    rating,
    band,
    stallPoints,
    delegableStallPoints: stallPoints.filter(s => s.delegable),
    summary: describeActivation(initiations.length, band, stallPoints),
  };
}

function describeActivation(
  count: number,
  band: ActivationScore['band'],
  stallPoints: StallPoint[],
): string {
  const worst = stallPoints[0];
  const where = worst ? ` The step most likely to stop you is "${worst.initiation.label}".` : '';

  switch (band) {
    case 'low':
      return `${count} starting lines, most of them small. This one is startable on a bad week.${where}`;
    case 'moderate':
      return `${count} starting lines. Doable, but not on a bad week — give it a good one.${where}`;
    case 'high':
      return `${count} separate starting lines. This is not one task, and treating it as one is why it keeps not happening.${where}`;
    case 'severe':
      return `${count} separate starting lines, several of them heavy. If this has stalled repeatedly, that is the design of the bet, not a verdict on you.${where}`;
  }
}

/**
 * Compare two rungs of the same ladder — e.g. dropping stock at one shop
 * versus running your own market stall. Same channel, different cost of entry.
 */
export function compareActivation(
  from: ActivationScore,
  to: ActivationScore,
): { delta: number; initiationsSaved: number; easier: boolean } {
  return {
    delta: Number((from.score - to.score).toFixed(1)),
    initiationsSaved: from.initiationCount - to.initiationCount,
    easier: to.score < from.score,
  };
}
