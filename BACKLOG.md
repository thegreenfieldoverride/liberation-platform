# Backlog

Standing list of things to address. Items carry enough context to be picked up
cold, because most of them will be.

**Decided-against items stay here on purpose.** The reasoning is the value — it
stops a settled question from being re-opened every time the advisory count
gets looked at.

Last reviewed: 2026-09-21

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

- [x] **GitHub Actions Node 20 deprecation** — done 2026-09-21 for this repo
      and liberation-analytics, five days past the deadline. Worth recording
      why it was worse than written above: `actions/cache@v3`,
      `pnpm/action-setup@v2` and `webfactory/ssh-agent@v0.8.0` declare
      `node16`, not node20. Bumped to the lowest major declaring node24
      (checkout v5, setup-node v5, cache v5, action-setup v5, ssh-agent
      v0.10.0, setup-go v6) rather than to latest, to clear the deadline
      without three majors of unrelated behaviour change.

- [x] **Clear the dead `next@` overrides** — done 2026-09-21. Regenerating the
      lockfile afterwards changed those six lines and nothing else, which is
      the proof they were inert.

- [x] **Every toolchain install must be pinned — no exceptions.** Recorded
      because this one cost three weeks. `platform.Dockerfile` ran a bare
      `npm install -g pnpm` while `packageManager` and all three workflows
      pinned 10.18.0. pnpm shipped a major that made `--prod` a valueless
      flag, so `pnpm install --frozen-lockfile --production=false` failed on
      every pull request from 2026-09-03. Because `✅ CI Success` requires the
      Docker job, *all* merges were blocked, not just Docker builds — which is
      why nothing landed for three weeks and the Node 20 deadline slipped.
      The same class already burned listmonk and analytics. The rule is not
      "pin pnpm"; it is that a floating version anywhere in a build is a
      scheduled outage. Fixed 2026-09-21, along with `node:20-alpine` (EOL
      April 2026) which the image never got bumped to 24 with everything else.

- [ ] **Guardian: floating version refs (latent, not currently breaking).**
      An earlier revision of this entry claimed guardian's CI was broken the
      same way this repo's was, inferred from config because the January run
      logs had expired. That inference was wrong and is corrected here:
      guardian/#2 was cut from `main` and every check passed — Build, Test,
      Lint, Format, Security Scan, gosec. `main` is not red; its last run is
      simply 8 months old and nothing has exercised CI since.

      The floating refs are still real and still worth pinning:

      - `golangci/golangci-lint-action@v4` with `version: latest`, against a
        config that guardian's own history says is v1 format
        (`fix: revert golangci config to v1 format (CI uses v1.64.8)`).
      - `securego/gosec@master` — wholly unpinned.

      Both happen to resolve to something compatible today. That is luck with
      an expiry date, and it is the same shape as the pnpm float that froze
      this repo's merges for three weeks.

      Separately: `2787e65` — "fix: resolve all 15 gosec security issues",
      January 2026 — still sits unmerged on
      `feat/auto-fix-execution-and-snyk-fast-path`. Same shape as the
      audit-gate commit orphaned by #28. Since CI is not in fact broken, there
      is no longer an obvious reason it cannot land. This repo's working tree
      already carries the submodule pointer bumped to it, uncommitted.

- [ ] **Guardian's auto-fix executor has a command-injection bypass.**
      `internal/autofix/command_handler.go`: `Validate()` checks
      `step.Parameters["command"]` against a prefix allowlist, but `Execute()`
      runs `command + " " + args` through `sh -c` and `args` is never
      validated. The allowlist being a *prefix* match means anything chained
      after an allowed prefix with `;` or `&&` also rides along, and the
      dangerous-pattern list only scans `command` (and misses `rm -rf ~`,
      since its regex requires `/`). Above the exec sits
      `// #nosec G204 - Command is validated against allowlist and dangerous
      patterns in handler.Validate()` — gosec flagged this correctly and the
      suppression asserts a guarantee the code does not provide. That
      annotation is part of `2787e65` above.

      Fix plans originate from model output: `internal/ai/triage.go` parses the
      LLM's JSON into `AutoFixPlan.Steps` → `FixStep.Parameters`. The threat
      model once this is wired is indirect prompt injection — an attacker
      causes an error whose text reaches Sentry, the triage model reads it and
      emits a fix plan, and `args` lands in `sh -c`.

      **Not urgent: the executor is dead code.** `internal/events/processor.go`
      has the call commented out behind a TODO and publishes events with
      `"status": "ready_for_execution"`. This is a landmine for whoever
      uncomments those two lines — which is exactly what
      `feat/auto-fix-execution-and-snyk-fast-path` exists to do. Fix it before
      that branch lands, not after.

- [ ] **Two critical `next` advisories are suppressed, and that is a standing
      liability.** `GHSA-p293-qw3h-jr36` and `GHSA-2xp9-vwfh-vxw4` are both
      patched only in `>=15.5.24`, which the Next 15 decision below rules out.
      Suppressed in `pnpm.auditConfig.ignoreGhsas` on reachability grounds —
      the first is Windows-only and production is Linux; the second needed
      `/_next/image`, which the docker target now disables outright rather than
      arguing around. Rationale is recorded per-GHSA in `package.json`.

      This is the first time the "stay on 14.2.35" decision has cost a
      *critical* rather than a high, and the mitigation is deployment-shaped:
      it holds only while production stays Linux and image optimization stays
      off. If either changes, or a third critical lands with no reachability
      argument, the PWA migration stops being a roadmap item and becomes the
      remediation. Re-read this before adding a third entry to that list.

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

## Build & release integrity

- [ ] **`liberation-analytics/` is a separate git repo, and this repo also
      tracks copies of its files.** It is not a submodule — `.gitmodules` lists
      only `liberation-guardian`. The parent's copies are frozen at pre-fix
      versions, so `git status` here reports work that is already committed,
      merged and deployed over there as "modified". A `git restore` or a
      branch switch in the parent would overwrite the nested repo's working
      tree with stale code. Either `git rm -r --cached liberation-analytics`
      plus a `.gitignore` entry, or convert it to a real submodule like
      guardian. Until then, never `git add liberation-analytics/`.

- [ ] **Drop the analytics stash.** `stash@{0}`, "stale working tree reverting
      DUCKDB_PATH and known_hosts fixes". Applying it would undo shipped
      fixes. It is kept only because nobody has looked at it.

- [ ] **`js-yaml` override no longer covers the advisory.**
      `js-yaml@<4.1.1: '>=4.1.1'` in `pnpm-workspace.yaml` was written for an
      earlier advisory. Dependabot now reports the lowest non-vulnerable
      version as 4.3.2 while the tree resolves no higher than 4.1.1, so the
      security update fails on `main` every time it runs. Same for `sharp` and
      `baseline-browser-mapping` — all three are `security_update_not_possible`
      rather than broken CI. Needs the override pattern extended, or a
      documented decision that it is unreachable.

## Housekeeping

- [x] **`SESSION_STATE.md`** — deleted 2026-09-21. It was untracked and
      described a November 2025 deployment as in progress.

- [ ] **Untracked cruft in the working tree.** `.playwright-mcp/`,
      `now-section.png`, `optin.html`, and two Finder-duplicated files
      (`apps/web/.ladle/components 2.tsx`, `config 2.mjs`). Also
      `apps/web/src/hooks/useAnalytics.ts`, untracked at 183 lines, though the
      analytics simplification in #22 deleted that hook — check whether it is a
      resurrected copy before anything imports it.

- [ ] **Guardian's `internal/events` is not testable as written, and that
      hides the routing that matters.** `Processor` holds `*redis.Client` and
      `*ai.TriageEngine` as concrete types constructed inside `NewProcessor`,
      so there is no seam for a fake and every `ProcessEvent` branch reaches
      `redisClient.XAdd`. guardian/#2 got the package to 1.1% and stopped
      there deliberately. The consequence worth stating plainly: the triage
      decision routing — auto-fix vs escalate-to-human vs ignore — is
      unverified, and that routing decides whether an incident reaches a
      person. Accepting interfaces for both collaborators is a small refactor
      and unlocks the whole package.

- [ ] **Generated `*_COMPLETE.md` docs assert status they don't observe.**
      Both repos carry several. Git is the only non-editorialising record —
      treat those files as claims, not evidence.
