import { KofiButton } from '@greenfieldoverride/liberation-ui';

export const metadata = {
  title: 'Funding Transparency - The Greenfield Development Fund',
  description: 'Radical transparency in funding public good software. See exactly how your contributions sustain ethical tool development.',
};

export default function FundingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            The Greenfield Development Fund
          </h1>
          <p className="text-2xl text-gray-600 mb-12 font-light">
            A New Blueprint for Public Good
          </p>

          <section className="mb-16 prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Principle: Radical Transparency</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              The traditional blueprint for public good projects is broken. It relies on two models: venture capital, which corrupts the mission, or builder burnout, which is unsustainable.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              We are building a new, sustainable-cost model. This is our vision.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our evidence is radical transparency. We are not a black box. We are a public ledger. We are building our tools in the open, and we are funding them in the open.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
              <p className="text-gray-800 font-medium mb-2">
                This fund is not a tip jar.
              </p>
              <p className="text-gray-700">
                It is the "Full Ledger" for a new, sustainable creative economy. "Public good" cannot mean "the builder works for free." That is the old, exploitative blueprint. This fund is how we sustainably compensate the builder (me) and pay for the infrastructure to keep our tools available "at cost" for the community.
              </p>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">The Marathon: Our Monthly Sustainability Goals</h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              This is our long-term stewardship model. It's the operational focus that sustains the entire mission. All contributions are allocated to these goals first, in this order of priority.
            </p>

            <div className="space-y-8">
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">The Builder's Stipend</h3>
                    <p className="text-xl text-blue-600 font-semibold mb-4">Monthly Goal: $9,800</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Purpose:</strong> This is the most critical component. It is an incredibly lean, sustainable, defensible salary for a lead architect in California, set far below the market average. It helps fund my dedicated labor to manage DAON, the Insight Engine, Greenfield Override, and our LLMs. After taxes, this will pay my rent. My wife thanks you for your help.
                </p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-purple-600">2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">The Infrastructure & Tools Fund</h3>
                    <p className="text-xl text-purple-600 font-semibold mb-4">Current Monthly Goal: $700</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Purpose:</strong> This pays for our focused infrastructure. It covers our 5+ servers (dev, prod, backups across Germany, Finland, and the US), our domain costs, and our core builder tools (like Claude and Gemini — yes, we know. See the note below). Budgeting for this allows us to upgrade servers as needed to keep our tools fast and reliable, and utilize the intelligence we have available now to act on threats and issues in real-time.
                </p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-green-600">3</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">The R&D Fund</h3>
                    <p className="text-xl text-green-600 font-semibold mb-4">Monthly Goal: $500</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Purpose:</strong> This is our "Sustainability & Future Build Fund." It's the modest, recurring budget that allows us to test new ideas (like the Collective Strategist), analyze new threats, and ensure we have the resources to build the next tool the community needs.
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 shadow-lg mt-8">
                <h3 className="text-3xl font-bold mb-2">Monthly Marathon Total</h3>
                <p className="text-5xl font-bold">$11,000</p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">The Sprint: Our Current Project Goal</h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              Any funds received after our Monthly Marathon goals are met are allocated directly to our one-time Sprint projects.
            </p>

            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Current Sprint: The Artisan's LLM Training Fund</h3>
              <p className="text-xl text-orange-600 font-semibold mb-6">Project Goal: $1,500</p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                <strong>Purpose:</strong> This is our lean, focused approach. Traditional models cost millions and are trained on stolen data. This $1,500 is the real, frugal cost to fine-tune 5 specialist, ethical LLMs (using LoRA) on an ethical data corpus. Our long-term goal is to release DAON and train exclusively on fully-consented, DAON-verified data.
              </p>

              <div className="bg-white rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-600">Status</span>
                  <span className="text-sm font-semibold text-gray-600">$0 / $1,500</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="bg-gradient-to-r from-orange-500 to-yellow-500 h-4 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">How to Fund the New Blueprint</h2>
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm">
              <p className="text-gray-700 leading-relaxed mb-6">
                We are using Ko-fi as our payment processor. It's a pragmatic choice: they are the only platform that actively blocks AI scraping bots, aligning with our DAON mission.
              </p>
              <div className="bg-gray-50 border-l-4 border-gray-400 p-6 mb-8">
                <p className="text-sm text-gray-600 italic">
                  A note on our tools: We know Ko-fi uses Stripe/PayPal, which are part of the old system. We are pragmatic, using these tools as a temporary bridge to build the new infrastructure (like DAON) that will one day make them obsolete.
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed mb-8">
                Your contribution, one-time or monthly, is allocated to our ledger to sustain this work.
              </p>
              
              <div className="flex justify-center">
                <KofiButton variant="button" size="large" className="text-lg" />
              </div>
            </div>
          </section>

          <section className="text-center text-gray-600 text-sm">
            <p>Questions about our funding model? <a href="mailto:support@greenfieldoverride.com" className="text-blue-600 hover:text-blue-700 underline">Get in touch</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
