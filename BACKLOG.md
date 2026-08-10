# Backlog

Standing list of things to address. Items carry enough context to be picked up
cold, because most of them will be.

**Decided-against items stay here on purpose.** The reasoning is the value — it
stops a settled question from being re-opened every time the advisory count
gets looked at.

Last reviewed: 2026-08-10

---

## Decisions taken — do not re-litigate

### `@xenova/transformers` → `@huggingface/transformers` — NOT NOW

**Status:** rejected on security grounds 2026-08-10. Revisit only as a
maintenance decision.

It looks like the obvious fix for the `ai-copilot` advisories. It isn't. The
dependency lists:

```
@xenova/transformers@2.17.2      @huggingface/transformers@4.2.0
  onnxruntime-web  1.14.0          onnxruntime-web  1.26.0-dev
  sharp            ^0.32.0         onnxruntime-node 1.24.3    <- ADDED
  @huggingface/jinja ^0.2.2        sharp            ^0.34.5   <- still vulnerable
                                   @huggingface/tokenizers ^0.1.3
```

- It **adds** `onnxruntime-node`, pulling `adm-zip`, `global-agent` and native
  binaries. More surface, not less.
- `sharp ^0.34.5` is still below the `>=0.35.0` patch line for the libvips
  CVEs, so the advisory would have survived the migration.
- Cost is real: 9 files import it, `quantized: true` → `dtype: 'q8'` in 9
  places, and in-browser inference is a working feature with genuine
  regression risk.

Both advisories are instead handled by overrides in `pnpm-workspace.yaml`
(`protobufjs@<7.5.5`, `sharp@<0.35.0`), which cover the whole subtree.

**The remaining argument is maintenance, not security** — v2 is frozen and the
ecosystem has moved on. That is a product question about whether the AI
Co-Pilot's in-browser inference earns its dependency weight. Worth its own
session; not something to do under security pressure.

---

## Security & dependencies

- [ ] **Ratchet the audit gate to `--audit-level high`.** Currently
      `--prod --audit-level critical` in `.github/workflows/ci.yml`. Of the 12
      remaining production highs, most are Next and its transitive
      `postcss`/`nanoid` — they disappear with the framework rather than
      needing individual triage. Tighten once the PWA migration lands.

- [ ] **GitHub Actions Node 20 deprecation — hard deadline 2026-09-16.**
      `actions/checkout@v4`, `actions/setup-node@v4`, `actions/cache@v3` and
      `pnpm/action-setup@v2` are already being force-migrated to Node 24 and
      leave the runners entirely on that date. Small PR; should not wait until
      it is urgent.

- [ ] **Clear the dead `next@` overrides** in `pnpm-workspace.yaml`. All six
      target versions below 14.2.35, which is what is pinned, so they are
      no-ops accumulated from Dependabot. Noise that obscures the two
      deliberate overrides.

- [ ] **Guardian has a stranded security commit.** `2787e65` — "fix: resolve
      all 15 gosec security issues", January 2026 — sits on
      `feat/auto-fix-execution-and-snyk-fast-path` and was never merged to
      guardian's `main`. Same shape as the audit-gate commit orphaned by #28.
      Check whether guardian's CI is broken the same way this repo's was
      (floating `pnpm: latest` against a pinned Node).

- [ ] **`production` GitHub Environment has zero protection rules.** No
      required reviewer, no wait timer, no branch restriction — and
      `git_ref` accepts arbitrary refs, so an unreviewed branch can reach
      production without touching main. One required reviewer is cheap
      insurance.

## Platform migration

- [ ] **Next.js → per-tool Vite PWAs, incrementally.** `apps/small-bets` is
      the probe (#38). Rationale: the tools are client-side calculators over
      localStorage and get nothing from App Router while paying RSC
      boundaries, hydration semantics and a recurring security surface. See
      also the advisory ratchet above — most remaining production highs are
      Next itself.

- [ ] **Static-generate the content pages** (manifesto, credits, projects,
      about). They need SEO, not a framework. Should not become PWAs.

- [ ] **Do not take Dependabot's Next 15 bumps.** #30/#31 were closed for this
      reason. Staying pinned at 14.2.35; individual 14.x advisories still get
      taken.

## Product

- [ ] **Runway Calculator is a depletion clock and needs to model re-entry.**
      `savings ÷ essential expenses` answers "how long until zero", which is
      the wrong question when re-entry to the old market may take 9–18 months
      or never. Add: partial-income scenarios, per-path time-to-first-dollar,
      health insurance broken out from the generic "Insurance" row (frequently
      the binding constraint), and support for paid apprenticeships, which are
      a runway *extender* the current model cannot represent.

- [ ] **Add "The Ballast" to the lexicon.** A deliberately boring income floor
      that funds the exit rather than betraying it. Right now the ideology
      codes taking a job as re-entering the hamster wheel, which is the
      platform's largest ethical exposure: it tells people with five months of
      runway to bet it on correlated gigs.

- [ ] **Sovereign Circles — capacities, not skills.** The unit of trade is the
      thing you cannot make yourself do, not the thing you are good at.
      `scoreActivation().delegableStallPoints` is already the matching input:
      "I stall at steps 8–14, who here doesn't." Design against the failure
      mode that kills these groups — unequal contribution nobody will name —
      with a circle-level ledger.

- [ ] **Make `/ledger` real.** It currently promises "exactly where every
      dollar goes" and shows a Coming Soon panel. First entry should be the
      honest small-bets P&L. Separate market-compression failures from
      execution failures — they are different diagnoses with opposite fixes.

- [ ] **Friction profile editor.** `apps/small-bets` ships two presets
      (`NEUTRAL_FRICTION`, `EXECUTIVE_FUNCTION_FRICTION`). Let people set their
      own weights per `InitiationKind`.

- [ ] **Port a second tool to the PWA pattern** to prove it generalises.
      Runway Calculator is the natural candidate.

## Housekeeping

- [ ] **`SESSION_STATE.md` is from November 2025** and describes a deployment
      that finished long ago. Either delete it or make it a live document.

- [ ] **Generated `*_COMPLETE.md` docs assert status they don't observe.**
      Both repos carry several. Git is the only non-editorialising record —
      treat those files as claims, not evidence.
