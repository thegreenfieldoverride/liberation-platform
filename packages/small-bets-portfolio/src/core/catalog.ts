/**
 * Small Bets Catalog
 *
 * The old suggestion set was three categories with invented returns —
 * "content, 150% ROI", "product, 200% ROI" — which is the same fantasy the
 * hustle economy runs on, and it is the reason a portfolio of small bets can
 * return zero while every number on the dashboard looks encouraging.
 *
 * Two corrections are baked in here.
 *
 * First: AI exposure. Bets that look diversified can share a single failure
 * mode. Freelance writing, generic design, stock content and copy-paste
 * print-on-demand did not fail independently — the deliverable was
 * commoditised out from under all of them at once. A portfolio of correlated
 * bets is not a portfolio; it is one leveraged bet in costume. High-exposure
 * options stay in the catalog, clearly marked, because hiding them would be
 * dishonest and some of them still work for some people.
 *
 * Second: ladders. Every entry is a channel, not a single move, ordered from
 * the cheapest way in to the most demanding. The point is never to tell
 * someone their ambition is too expensive — it is to show them the rung below
 * the one they keep falling off. "Can't yet" is a scheduling fact, not a
 * verdict, and the ladder is what makes it one.
 *
 * LIBERATION LICENSE: This code is designed for individual freedom,
 * not corporate optimization. Corporate use violates human dignity.
 */

import type { SmallBet } from '@greenfieldoverride/types';
import {
  type FrictionProfile,
  type Initiation,
  NEUTRAL_FRICTION,
  scoreActivation,
} from './activation';

/**
 * How much of this work generative AI can currently absorb.
 *
 * 'low'  — needs a body, a licence, or a standing relationship.
 * 'medium' — partially exposed; survives on specificity and trust.
 * 'high' — the deliverable itself has been commoditised.
 */
export type AiExposure = 'low' | 'medium' | 'high';

export interface BetRung {
  id: string;
  label: string;
  description: string;
  initiations: Initiation[];
  /** Realistic time from starting this rung to money arriving. */
  timeToFirstDollar: string;
  /** What this rung buys you besides revenue. Lower rungs often buy the most. */
  teaches: string;
}

export interface CatalogEntry {
  id: string;
  name: string;
  category: SmallBet['category'];
  premise: string;
  aiExposure: AiExposure;
  /** Honest note on the exposure rating, with evidence where it exists. */
  exposureNote: string;
  /** What actually protects the income, if anything does. */
  moat: string;
  /** Ordered rungs, cheapest entry first. */
  ladder: BetRung[];
}

const step = (
  id: string,
  label: string,
  kind: Initiation['kind'],
  opts: Partial<Initiation> = {},
): Initiation => ({ id, label, kind, ...opts });

export const BET_CATALOG: CatalogEntry[] = [
  {
    id: 'local-maker-goods',
    name: 'Handmade goods, sold locally',
    category: 'product',
    premise:
      'Apothecary, preserves, ceramics, candles, textiles — physical things made by hand and sold to people who can pick them up.',
    aiExposure: 'low',
    exposureNote:
      'A model cannot pour a salve. The making is safe; the distribution is where these die.',
    moat: 'Physical scarcity plus local trust. Neither transfers to a competitor with better prompts.',
    ladder: [
      {
        id: 'consignment',
        label: 'Consignment at one shop',
        description:
          'Your product on someone else\'s shelf, sold by someone whose whole job is standing there. One conversation, one drop-off, no tent.',
        initiations: [
          step('list', 'Pick three local shops that already stock work like yours', 'admin'),
          step('ask', 'Walk into one and ask about consignment terms', 'social-cold'),
          step('batch', 'Make a small first batch', 'making'),
          step('deliver', 'Drop the stock off', 'logistics'),
        ],
        timeToFirstDollar: '2–6 weeks',
        teaches:
          'Whether strangers buy it at all, without you having to watch them decide.',
      },
      {
        id: 'shared-booth',
        label: 'Shared booth with other makers',
        description:
          'Three or four makers, one stall, staffed on rotation. Your product is at the market every week; you are there once a month.',
        initiations: [
          step('find', 'Find a maker collective or three makers to split with', 'social-warm'),
          step('agree', 'Agree on rotation, costs and takings split', 'social-warm'),
          step('permit', 'Get on the market roster (usually the collective already is)', 'admin'),
          step('batch', 'Make stock for the season', 'making'),
          step('staff', 'Staff the booth on your rotation days', 'exposure'),
          step('haul', 'Transport and set up on your days', 'logistics'),
        ],
        timeToFirstDollar: '4–8 weeks',
        teaches:
          'How the market actually runs, from inside, with the exposure divided by four.',
      },
      {
        id: 'own-stall',
        label: 'Your own market stall',
        description:
          'The full version. Highest margin, highest control, and roughly twenty separate starting lines.',
        initiations: [
          step('apply', 'Apply to the market and wait on approval', 'admin'),
          step('wait', 'Wait for the committee to answer', 'waiting'),
          step('licence', 'Cottage food licence / insurance / permits', 'admin'),
          step('kit', 'Buy tent, tables, display, float, card reader', 'purchase'),
          step('forecast', 'Forecast how much to make', 'admin'),
          step('produce', 'Produce the inventory', 'making'),
          step('price', 'Price and label everything', 'making'),
          step('pack', 'Pack the van', 'logistics'),
          step('early', 'Be there at 5am on a fixed day', 'schedule-fixed', { mustBeYou: true }),
          step('setup', 'Raise the tent and set up alone', 'logistics'),
          step('stand', 'Stand visible and pitch strangers for six hours', 'exposure', { mustBeYou: true }),
          step('teardown', 'Tear down and drive home', 'logistics'),
        ],
        timeToFirstDollar: '6–12 weeks',
        teaches: 'Direct margin, direct feedback, and a weekly deadline that does not care how you feel.',
      },
      {
        id: 'wholesale',
        label: 'Wholesale accounts',
        description:
          'Repeat orders from shops that already sell to your customer. Lower margin per unit, far higher volume, almost no exposure.',
        initiations: [
          step('sheet', 'Build a line sheet with wholesale pricing', 'making'),
          step('pitch', 'Email or visit buyers', 'social-cold'),
          step('capacity', 'Prove you can fill a repeat order on time', 'logistics'),
        ],
        timeToFirstDollar: '2–4 months',
        teaches: 'Predictable revenue you do not have to be present for.',
      },
    ],
  },

  {
    id: 'repair',
    name: 'Repair work',
    category: 'service',
    premise:
      'Bikes, appliances, furniture, electronics, clothing. Things break locally and must be fixed locally.',
    aiExposure: 'low',
    exposureNote:
      'AI can tell someone how to fix it. It cannot fix it, and most people do not want to.',
    moat: 'Physical presence plus accumulated diagnostic judgement. Referral-driven, so it compounds.',
    ladder: [
      {
        id: 'friends',
        label: 'Fix things for people you know',
        description: 'Free or cheap, to establish that you are the person who does this.',
        initiations: [
          step('say', 'Tell your network what you fix', 'social-warm'),
          step('do', 'Fix the first few', 'making'),
        ],
        timeToFirstDollar: '1–3 weeks',
        teaches: 'Your real turnaround time, and which repairs are worth taking.',
      },
      {
        id: 'listed',
        label: 'Neighbourhood listing',
        description: 'A post on the local board, community group or noticeboard. Inbound, not outbound.',
        initiations: [
          step('rates', 'Set rates', 'admin'),
          step('post', 'Post in local groups', 'social-cold'),
          step('intake', 'Handle intake and scheduling', 'admin'),
        ],
        timeToFirstDollar: '2–4 weeks',
        teaches: 'Whether there is enough local volume to matter.',
      },
      {
        id: 'mobile',
        label: 'Mobile or workshop-based',
        description: 'Fixed hours, a van or a bench, insurance, real capacity.',
        initiations: [
          step('insure', 'Business registration and liability insurance', 'admin'),
          step('space', 'Secure a bench or kit out a vehicle', 'purchase'),
          step('hours', 'Commit to fixed opening hours', 'schedule-fixed'),
          step('tools', 'Buy the tools you have been borrowing', 'purchase'),
        ],
        timeToFirstDollar: '1–3 months',
        teaches: 'Whether this is a trade or a hobby with receipts.',
      },
    ],
  },

  {
    id: 'trade-apprenticeship',
    name: 'Skilled trade apprenticeship',
    category: 'skill',
    premise:
      'Electrical, plumbing, HVAC, welding. Registered apprenticeships pay while you train.',
    aiExposure: 'low',
    exposureNote:
      'Roughly half a million skilled trade positions sit unfilled. The work is licensed, physical, and inspected by humans.',
    moat:
      'Licensure is a legal barrier, not a competitive one. It cannot be undercut by software.',
    ladder: [
      {
        id: 'informational',
        label: 'One informational conversation',
        description:
          'Talk to one person who did it. Costs an hour and answers most of what you are actually asking.',
        initiations: [
          step('find', 'Find someone in the trade via your network', 'social-warm'),
          step('ask', 'Ask them what the first two years were really like', 'social-warm'),
        ],
        timeToFirstDollar: 'n/a — this rung is reconnaissance',
        teaches: 'Whether you want the work or just want work that ends when you go home.',
      },
      {
        id: 'shadow',
        label: 'Shadow a day',
        description: 'One day on site. The cheapest possible test of a four-year decision.',
        initiations: [
          step('arrange', 'Arrange a ride-along or shadow day', 'social-cold'),
          step('go', 'Show up for a full day', 'schedule-fixed'),
        ],
        timeToFirstDollar: 'n/a',
        teaches: 'What the body actually does all day. Most people decide here.',
      },
      {
        id: 'pre-apprenticeship',
        label: 'Pre-apprenticeship or community college course',
        description: 'Part-time, evenings, reversible. Counts toward hours in many programmes.',
        initiations: [
          step('research', 'Find local programmes and entry requirements', 'admin'),
          step('apply', 'Apply', 'admin'),
          step('pay', 'Cover tuition or find a funded route', 'purchase'),
          step('attend', 'Attend on a fixed schedule', 'schedule-fixed'),
        ],
        timeToFirstDollar: '3–6 months (some programmes pay a stipend)',
        teaches: 'Whether you can sustain the schedule alongside everything else.',
      },
      {
        id: 'registered',
        label: 'Registered apprenticeship',
        description:
          'Full commitment, 4–5 years to journeyman — but paid throughout, which makes it a runway *extender* rather than a drain.',
        initiations: [
          step('apply', 'Apply to a union or employer programme', 'admin'),
          step('wait', 'Wait out the intake cycle', 'waiting'),
          step('test', 'Aptitude test and interview', 'exposure'),
          step('commit', 'Commit to full-time hours', 'schedule-fixed', { mustBeYou: true }),
        ],
        timeToFirstDollar: 'Immediate — apprentices are paid from day one',
        teaches: 'A licensed trade, and an income that does not depend on your own marketing.',
      },
    ],
  },

  {
    id: 'local-ai-integration',
    name: 'AI integration for local businesses',
    category: 'service',
    premise:
      'The dentist, the contractor, the two-location restaurant. They know they should be using this and have nobody to ask.',
    aiExposure: 'low',
    exposureNote:
      'AI-related freelance skills grew 109% year over year. This is the one technical bet that is growing rather than compressing — and the local, in-person version has almost no competition.',
    moat:
      'Trust plus proximity. Enterprise consultancies will not drive to a dental practice; offshore contractors cannot build the relationship.',
    ladder: [
      {
        id: 'one-free',
        label: 'Solve one problem free, for one business',
        description:
          'Pick a business you already use. Fix one concrete annoyance. Ask for a testimonial, not money.',
        initiations: [
          step('pick', 'Pick a business you already have a relationship with', 'social-warm'),
          step('scope', 'Find one specific, boring, expensive problem', 'social-warm'),
          step('build', 'Build the fix', 'technical'),
          step('handover', 'Hand it over and teach them to use it', 'social-warm'),
        ],
        timeToFirstDollar: '0 — this rung buys a reference, not revenue',
        teaches: 'What these businesses will actually pay to make stop.',
      },
      {
        id: 'paid-engagement',
        label: 'First paid engagement',
        description: 'Fixed scope, fixed price, referred by the first one.',
        initiations: [
          step('ref', 'Ask the first business who else has this problem', 'social-warm'),
          step('price', 'Quote a fixed price', 'admin'),
          step('deliver', 'Deliver it', 'technical'),
        ],
        timeToFirstDollar: '3–8 weeks',
        teaches: 'Your real rate, and whether referral alone can fill a pipeline.',
      },
      {
        id: 'retainer',
        label: 'Monthly retainers',
        description: 'Ongoing maintenance and improvement. Predictable, and the reason this beats project work.',
        initiations: [
          step('offer', 'Convert past clients to a monthly agreement', 'social-warm'),
          step('sla', 'Define what the retainer covers', 'admin'),
        ],
        timeToFirstDollar: '2–4 months',
        teaches: 'Income that does not reset to zero every month.',
      },
    ],
  },

  {
    id: 'contract-platform-work',
    name: 'Contract platform / infrastructure work',
    category: 'service',
    premise:
      'Two or three days a week of the engineering you already do, at contract rates, on scoped work with a defined done.',
    aiExposure: 'low',
    exposureNote:
      'Generalist coding is compressing hard. Infrastructure, deployment and reliability work is not — it carries operational risk that nobody wants to hand to a model unsupervised.',
    moat: 'Accountability. Someone has to be responsible when it breaks at 3am.',
    ladder: [
      {
        id: 'warm-one',
        label: 'One contract through your warm network',
        description:
          'Not job boards. Former colleagues, one message each. This is the highest-conversion channel that exists and it is nearly free.',
        initiations: [
          step('list', 'List twenty former colleagues', 'admin'),
          step('message', 'Message them individually saying you have capacity', 'social-warm'),
          step('scope', 'Scope and quote the first bite', 'admin'),
        ],
        timeToFirstDollar: '2–6 weeks',
        teaches: 'Your market rate, and how fast this can be turned back on later.',
      },
      {
        id: 'recurring',
        label: 'Recurring part-time arrangement',
        description:
          'Two fixed days a week. Deliberately boring, deliberately capped — a floor under everything else, not a new career.',
        initiations: [
          step('convert', 'Convert a project client to fixed weekly days', 'social-warm'),
          step('boundary', 'Hold the cap when they ask for more', 'social-warm', { mustBeYou: true }),
        ],
        timeToFirstDollar: '1–2 months',
        teaches:
          'That an income floor is what funds the exit, rather than betraying it.',
      },
    ],
  },

  {
    id: 'teaching-in-person',
    name: 'Teaching and workshops, in person',
    category: 'service',
    premise:
      'A skill you have, taught to a room. Craft, software, cooking, language, repair.',
    aiExposure: 'low',
    exposureNote:
      'People can already learn anything free online and mostly do not. They pay for the room, the pace, and someone noticing when they are stuck.',
    moat: 'Presence and accountability — the two things self-directed learning cannot supply.',
    ladder: [
      {
        id: 'guest',
        label: 'One workshop at an existing venue',
        description:
          'A library, makerspace, community centre or shop. They have the room, the insurance and the mailing list. You bring two hours.',
        initiations: [
          step('pitch', 'Pitch one venue a single two-hour session', 'social-cold'),
          step('prep', 'Prepare the material', 'making'),
          step('teach', 'Teach it', 'exposure', { mustBeYou: true }),
        ],
        timeToFirstDollar: '3–6 weeks',
        teaches: 'Whether anyone signs up, at somebody else\'s risk.',
      },
      {
        id: 'recurring-class',
        label: 'Recurring class',
        description: 'A six-week course, same venue, your own registrations.',
        initiations: [
          step('design', 'Design a six-week arc', 'making'),
          step('book', 'Book the room across dates', 'admin'),
          step('fill', 'Fill the seats', 'social-cold'),
          step('run', 'Show up every week', 'schedule-fixed', { mustBeYou: true }),
        ],
        timeToFirstDollar: '6–10 weeks',
        teaches: 'Repeat demand, and whether teaching drains or feeds you.',
      },
    ],
  },

  {
    id: 'care-work',
    name: 'Care and home health work',
    category: 'service',
    premise:
      'Home health aide, personal care, elder support, respite care.',
    aiExposure: 'low',
    exposureNote:
      'The fastest-growing occupation by raw volume, with low entry barriers — and a median around $33k, which is the honest part nobody leads with.',
    moat: 'Bodies and relationships. Structurally un-automatable, structurally underpaid.',
    ladder: [
      {
        id: 'certify',
        label: 'Certification',
        description: 'Short, cheap, often employer-funded. Weeks, not years.',
        initiations: [
          step('find', 'Find a local certification programme', 'admin'),
          step('enrol', 'Enrol and complete it', 'schedule-fixed'),
        ],
        timeToFirstDollar: '4–10 weeks',
        teaches: 'Whether the work suits you before you commit to it.',
      },
      {
        id: 'agency',
        label: 'Agency shifts',
        description: 'Flexible hours, no client acquisition, no admin. The agency takes a cut for exactly that.',
        initiations: [
          step('apply', 'Apply to agencies', 'admin'),
          step('check', 'Background check and onboarding', 'waiting'),
          step('shifts', 'Pick up shifts', 'schedule-fixed'),
        ],
        timeToFirstDollar: '2–6 weeks after certification',
        teaches: 'Steady hourly income with genuinely flexible scheduling.',
      },
      {
        id: 'private',
        label: 'Private clients',
        description: 'Direct arrangements. Roughly double the hourly, plus all the admin the agency was absorbing.',
        initiations: [
          step('insure', 'Liability insurance and self-employment registration', 'admin'),
          step('find', 'Find clients through referral', 'social-warm'),
          step('invoice', 'Handle scheduling, invoicing and cover', 'admin'),
        ],
        timeToFirstDollar: '2–4 months',
        teaches: 'What the agency\'s cut was actually paying for.',
      },
    ],
  },

  {
    id: 'provenance-goods',
    name: 'Merchandise with verified provenance',
    category: 'product',
    premise:
      'Print-on-demand, but the product is the phrase and the proof — not the garment.',
    aiExposure: 'medium',
    exposureNote:
      'Generic print-on-demand is saturated and margins run 5–15% for sellers who default on providers and pricing, 18–35% for those who do not. Identity goods for an audience that already exists are a different market from search-discovered goods.',
    moat:
      'An existing audience and a verifiable provenance record. Neither is reachable by flooding a marketplace with generated designs.',
    ladder: [
      {
        id: 'to-list',
        label: 'Sell to a list you already have',
        description:
          'No storefront discovery, no marketplace SEO. Print-on-demand means no inventory risk.',
        initiations: [
          step('design', 'Produce three or four designs', 'making'),
          step('setup', 'Connect a print-on-demand provider', 'technical'),
          step('announce', 'Announce to the list', 'social-warm'),
        ],
        timeToFirstDollar: '2–4 weeks',
        teaches: 'Your list\'s real conversion rate — the number every later decision depends on.',
      },
      {
        id: 'provenance',
        label: 'Add verifiable provenance',
        description:
          'Every design carries an ownership and consent record the buyer can check from their phone. The product demonstrates the argument.',
        initiations: [
          step('register', 'Register each design', 'admin'),
          step('embed', 'Put the verification link on the label', 'technical'),
        ],
        timeToFirstDollar: 'Same as above',
        teaches: 'Whether provenance moves purchase decisions. Nobody actually knows yet.',
      },
    ],
  },

  {
    id: 'specialist-consulting',
    name: 'Specialist consulting in a regulated domain',
    category: 'skill',
    premise:
      'Compliance, accessibility, safety, licensing, accreditation — advice someone has to sign.',
    aiExposure: 'medium',
    exposureNote:
      'Models draft the analysis fine. They cannot carry professional liability, and regulators do not accept them as the responsible party.',
    moat: 'Signature and liability. The value is in who is accountable, not who typed it.',
    ladder: [
      {
        id: 'audit',
        label: 'One paid audit',
        description: 'Fixed scope, fixed fee, written deliverable.',
        initiations: [
          step('niche', 'Name the exact regulation you know cold', 'admin'),
          step('one', 'Find one organisation that needs it', 'social-cold'),
          step('deliver', 'Deliver the audit', 'technical'),
        ],
        timeToFirstDollar: '4–10 weeks',
        teaches: 'Whether your expertise is legible to buyers as expertise.',
      },
      {
        id: 'retained',
        label: 'Retained advisor',
        description: 'On call for a handful of organisations. Low hours, high rate.',
        initiations: [
          step('convert', 'Convert audit clients to ongoing advice', 'social-warm'),
          step('terms', 'Set terms and liability limits', 'admin'),
        ],
        timeToFirstDollar: '3–6 months',
        teaches: 'Income that scales on reputation rather than hours.',
      },
    ],
  },

  {
    id: 'paid-community',
    name: 'Paid community or cohort',
    category: 'content',
    premise:
      'A small, moderated, genuinely useful group that people pay to be inside.',
    aiExposure: 'medium',
    exposureNote:
      'The written material is commoditised. The other members are not.',
    moat: 'Other people. A community is the one product a competitor cannot copy by copying the artifact.',
    ladder: [
      {
        id: 'free-first',
        label: 'Run it free first',
        description: 'Prove people show up before anyone pays. Most of these die of emptiness, not pricing.',
        initiations: [
          step('gather', 'Gather the first dozen', 'social-warm'),
          step('host', 'Host consistently for two months', 'schedule-fixed', { mustBeYou: true }),
        ],
        timeToFirstDollar: '0 — this rung buys evidence',
        teaches: 'Whether it survives without you carrying every conversation.',
      },
      {
        id: 'paid',
        label: 'Charge for the next cohort',
        description: 'Small, capped, with a defined start and end.',
        initiations: [
          step('price', 'Set a price and a cap', 'admin'),
          step('payments', 'Set up payments', 'technical'),
          step('sell', 'Sell to the free group', 'social-warm'),
        ],
        timeToFirstDollar: '2–3 months',
        teaches: 'The conversion rate from free attention to paid attention.',
      },
    ],
  },

  {
    id: 'freelance-content-design',
    name: 'Freelance writing, design or copy',
    category: 'content',
    premise:
      'Client work producing written or visual deliverables.',
    aiExposure: 'high',
    exposureNote:
      'Writing projects on Upwork fell 32% year over year — the largest drop of any category. Basic graphic design is down around 28%, generic copywriting 19%, data entry 43%. Kept in the catalog because the specialist tier genuinely rebounded: clients are explicitly paying for subject-matter expertise and original work, and adapted freelancers report 40–60% higher rates than pre-AI. The generalist tier is gone.',
    moat:
      'Only deep subject-matter authority. If the brief could be handed to a model, it already has been.',
    ladder: [
      {
        id: 'narrow',
        label: 'Narrow to one subject you have lived',
        description:
          'Not "freelance writer". A writer on one industry you have actually worked inside. This is the only version with a pulse.',
        initiations: [
          step('pick', 'Pick the domain where you have real standing', 'admin'),
          step('proof', 'Publish two pieces that prove it', 'making'),
          step('pitch', 'Pitch publications or companies in that domain only', 'social-cold'),
        ],
        timeToFirstDollar: '1–3 months',
        teaches: 'Whether your expertise is the product, or the writing was.',
      },
    ],
  },

  {
    id: 'generic-pod-and-stock',
    name: 'Generic print-on-demand and stock content',
    category: 'product',
    premise:
      'Designs, templates or stock assets uploaded at volume for marketplace discovery.',
    aiExposure: 'high',
    exposureNote:
      'Supply is effectively infinite now — sellers can cover 500 sub-niches in the time it used to take to cover 50, and everyone can. Saturation is concentrated precisely in the copy-paste tier. Listed for completeness and honesty; it is unlikely to return your time.',
    moat: 'None that survives contact with unlimited generated supply.',
    ladder: [
      {
        id: 'only-rung',
        label: 'Volume upload',
        description:
          'If you run this, run it as a deliberate experiment with a spend cap and a stop date — not as a plan.',
        initiations: [
          step('produce', 'Produce designs at volume', 'making'),
          step('upload', 'Bulk upload and tag', 'technical'),
          step('wait', 'Wait on marketplace discovery', 'waiting'),
        ],
        timeToFirstDollar: 'Frequently never',
        teaches: 'What a commoditised market feels like from the inside, cheaply.',
      },
    ],
  },
];

export interface CatalogSuggestion {
  entry: CatalogEntry;
  /** The rung that best fits this person's friction profile right now. */
  recommendedRung: BetRung;
  /** Activation score for that rung, personalised. */
  activation: ReturnType<typeof scoreActivation>;
  /** Why this surfaced. */
  rationale: string;
}

/**
 * Suggest catalog entries, ranked for the person rather than for the market.
 *
 * Ordering favours, in order: low AI exposure, exposure the current portfolio
 * lacks, and a startable first rung. A brilliant bet you cannot begin ranks
 * below a modest one you can.
 */
export function suggestBets(
  existing: Pick<SmallBet, 'category' | 'tags'>[] = [],
  friction: FrictionProfile = NEUTRAL_FRICTION,
  limit = 5,
): CatalogSuggestion[] {
  const existingIds = new Set(existing.flatMap(b => b.tags ?? []));

  const scored = BET_CATALOG.filter(entry => !existingIds.has(entry.id)).map(entry => {
    // Score every rung, then recommend the cheapest one the person can begin.
    const rungs = entry.ladder.map(rung => ({
      rung,
      activation: scoreActivation(rung.initiations, friction),
    }));
    const best = rungs.reduce((a, b) => (b.activation.score < a.activation.score ? b : a));

    const exposureWeight = entry.aiExposure === 'low' ? 0 : entry.aiExposure === 'medium' ? 12 : 30;
    const rank = best.activation.score + exposureWeight;

    return {
      entry,
      recommendedRung: best.rung,
      activation: best.activation,
      rationale: buildRationale(entry, best.rung, best.activation.band),
      rank,
    };
  });

  return scored
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit)
    .map(({ rank: _rank, ...s }) => s);
}

function buildRationale(
  entry: CatalogEntry,
  rung: BetRung,
  band: 'low' | 'moderate' | 'high' | 'severe',
): string {
  const exposure =
    entry.aiExposure === 'low'
      ? 'Low AI exposure — this one is not being commoditised.'
      : entry.aiExposure === 'medium'
        ? 'Partially exposed to AI; survives on specificity and trust.'
        : 'High AI exposure. Included honestly, not recommended blindly.';

  const entry_point =
    band === 'low' || band === 'moderate'
      ? `Start at "${rung.label}" — it is startable without a good week.`
      : `Even the cheapest rung here ("${rung.label}") is a real lift. Worth planning rather than attempting on impulse.`;

  return `${exposure} ${entry_point} First money in roughly ${rung.timeToFirstDollar}.`;
}
