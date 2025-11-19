'use client';

import { Shield, Server, Cpu, Heart, ArrowRight } from 'lucide-react';
import { KofiButton } from '@greenfieldoverride/liberation-ui';
import { CampaignCard } from '../../components/funding/CampaignCard';
import { GoalCard } from '../../components/funding/GoalCard';

export default function FundingPage() {
  // TODO: Replace with actual Ko-fi API data or manual updates
  const currentFunding = {
    sprint: {
      current: 0,
      goal: 1500,
    },
    marathon: {
      builderStipend: 0,
      infrastructure: 0,
      rnd: 0,
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100">
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
          The Greenfield Development Fund
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed mb-8">
          A new blueprint for public good. <br />
          <span className="font-medium text-emerald-700">
            Sustainable. Transparent. Independent.
          </span>
        </p>
        <div className="h-1 w-20 bg-emerald-500 rounded-full"></div>
      </div>

      {/* The Principle Section */}
      <section className="max-w-3xl mx-auto px-6 mb-20">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Shield className="w-6 h-6 text-emerald-600" />
          Our Principle: Radical Transparency
        </h2>
        <div className="prose prose-slate prose-lg max-w-none">
          <p className="text-slate-700 mb-4">
            The traditional blueprint for public good projects is broken. It
            relies on two models: venture capital, which corrupts the mission,
            or builder burnout, which is unsustainable.
          </p>
          <p className="text-slate-700 mb-4">
            We are building a new, sustainable-cost model.{' '}
            <strong>Our evidence is radical transparency.</strong> We are not a
            black box. We are a public ledger. We are building our tools in the
            open, and we are funding them in the open.
          </p>
          <div className="bg-white p-6 border-l-4 border-emerald-500 shadow-sm my-8 rounded-r-lg">
            <p className="italic text-slate-700 m-0">
              "Public good cannot mean the builder works for free. That is the
              old, exploitative blueprint."
            </p>
          </div>
        </div>
      </section>

      {/* The Marathon Section */}
      <section className="max-w-3xl mx-auto px-6 mb-20">
        <div className="flex items-baseline justify-between mb-8 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-slate-900">The Marathon</h2>
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            Monthly Sustainability Goals
          </span>
        </div>

        <div className="grid gap-6">
          {/* Goal 1: Builder's Stipend */}
          <GoalCard
            icon={Cpu}
            iconColor="blue"
            title="1. The Builder's Stipend"
            goal={9800}
            current={currentFunding.marathon.builderStipend}
            description="This funds my dedicated labor as lead architect. It is a sustainable, defensible salary set far below market average for a Principal Engineer. It prevents burnout and ensures the work continues."
          />

          {/* Goal 2: Infrastructure */}
          <GoalCard
            icon={Server}
            iconColor="amber"
            title="2. Infrastructure & Tools"
            goal={600}
            current={currentFunding.marathon.infrastructure}
            description='Pays for our "disciplined" infrastructure: green-powered Hetzner servers (Germany/Finland/US) that run our tools "at cost" and respect user privacy.'
          />

          {/* Goal 3: R&D Fund */}
          <GoalCard
            icon={Shield}
            iconColor="purple"
            title="3. R&D Fund"
            goal={500}
            current={currentFunding.marathon.rnd}
            description='Our "Future Build Fund." A modest budget to prototype new tools (like the Collective Strategist) and analyze emerging threats.'
          />

          <div className="text-right text-sm text-slate-400 font-mono mt-2">
            Monthly Marathon Total: $10,900
          </div>
        </div>
      </section>

      {/* The Sprint Section */}
      <section className="max-w-3xl mx-auto px-6 mb-24">
        <div className="flex items-baseline justify-between mb-8 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-slate-900">The Sprint</h2>
          <span className="text-sm font-medium text-emerald-600 uppercase tracking-wider">
            Current Active Goal
          </span>
        </div>

        <CampaignCard
          title="The Artisan's LLM Training Fund"
          status="Fundraising"
          statusColor="emerald"
          glowColor="emerald"
          description={
            <>
              This is our "Frugal Override." Traditional models cost millions.
              This <strong>$1,500</strong> is the real cost to fine-tune 5
              specialist, ethical models on DAON-verified data using LoRA.
            </>
          }
          progress={{
            current: currentFunding.sprint.current,
            goal: currentFunding.sprint.goal,
          }}
          action={{
            label: 'Fund the New Blueprint on Ko-fi',
            href: 'https://ko-fi.com/greenfieldoverride',
            icon: Heart,
          }}
          footer={
            <p className="text-xs text-slate-400 m-0">
              <Shield className="w-3 h-3 inline mr-1 text-emerald-400" />
              <strong className="text-slate-300">Why Ko-fi?</strong> They
              actively block AI scrapers. We use Stripe/PayPal as a temporary
              bridge to build new infrastructure.
            </p>
          }
        />
      </section>

      {/* How to Fund Section */}
      <section className="max-w-3xl mx-auto px-6 mb-20">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Fund the New Blueprint
        </h2>
        <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
          <p className="text-slate-700 leading-relaxed mb-6">
            Your contribution, one-time or monthly, is allocated to our ledger
            to sustain this work. All Marathon goals are funded first, in order
            of priority. Any surplus goes to Sprint projects.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <KofiButton variant="button" size="large" />
            <a
              href="/ledger"
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
            >
              View Full Transparency Ledger <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="bg-slate-50 border-l-4 border-slate-400 p-4 rounded-r">
            <p className="text-sm text-slate-600 italic m-0">
              <strong>A note on our tools:</strong> We know Ko-fi uses
              Stripe/PayPal, which are part of the old system. We are
              pragmatic, using these tools as a temporary bridge to build the
              new infrastructure (like DAON) that will one day make them
              obsolete.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="max-w-3xl mx-auto px-6 pb-20 text-center text-slate-600 text-sm">
        <p>
          Questions about our funding model?{' '}
          <a
            href="mailto:support@greenfieldoverride.com"
            className="text-emerald-600 hover:text-emerald-700 underline"
          >
            Get in touch
          </a>
        </p>
      </section>
    </div>
  );
}
