import Link from 'next/link';
import { LibIcon } from '../../components/icons/LiberationIcons';

export default function CreditsPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-gray-900 mb-6">
            The Shoulders We Stand On
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            The Greenfield Override was not built in a vacuum. It is a synthesis of decades of digital activism, 
            brilliant theory, and the collective labor of the open-source community.
          </p>
          <p className="text-lg text-gray-600 mt-4">
            We acknowledge these debts not as a formality, but as a statement of our lineage. 
            These are the architects of the "pull" that led to our "proof."
          </p>
        </div>

        {/* Section 1: Theoretical Architects */}
        <div className="mb-16">
          <h2 className="text-3xl font-light text-gray-900 mb-8">1. The Theoretical Architects</h2>
          <p className="text-lg text-gray-600 mb-8">
            We stand on the work of those who gave us the language to describe the systems of extraction.
          </p>
          
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                <a 
                  href="https://pluralistic.net" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 inline-flex items-center gap-2"
                >
                  Cory Doctorow
                  <LibIcon icon="ExternalLink" size="xs" />
                </a>
              </h3>
              <p className="text-gray-700">
                For defining Surveillance Capitalism, coining "enshittification," and providing the tactical 
                framework of "adversarial interoperability" that DAON is built upon.
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                <a 
                  href="https://shoshanazuboff.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-600 inline-flex items-center gap-2"
                >
                  Shoshana Zuboff
                  <LibIcon icon="ExternalLink" size="xs" />
                </a>
              </h3>
              <p className="text-gray-700">
                For giving us the language to describe the extraction of human experience as raw material 
                for algorithmic power in <em>The Age of Surveillance Capitalism</em>.
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-medium text-gray-900 mb-3">The Open Source Maintainers</h3>
              <p className="text-gray-700">
                For the thankless, unpaid labor that powers 90% of the modern web. We build to ensure 
                they—and we—can finally own the pyramids we build.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Philosophical Foundation */}
        <div className="mb-16">
          <h2 className="text-3xl font-light text-gray-900 mb-8">2. The Philosophical Foundation</h2>
          <p className="text-lg text-gray-600 mb-8">
            We believe in giving credit and honoring the work of those who lit the path. This is our library of allies.
          </p>

          <div className="space-y-8">
            {/* Herbert A. Simon */}
            <div className="border-l-4 border-blue-500 pl-6 py-4">
              <h3 className="text-2xl font-medium text-gray-900 mb-2">Herbert A. Simon - The Attention Economy</h3>
              <div className="mb-3">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-medium">
                  Core Concept: The "Attention Economy"
                </span>
              </div>
              <p className="text-gray-700 mb-4">
                <strong>Our Take:</strong> Long before the first smartphone, Nobel Prize-winning economist Herbert A. Simon 
                recognized a fundamental truth of the information age: when information becomes abundant, human attention 
                becomes the scarce and valuable resource. His work is the key to understanding the entire business model 
                of the modern internet. Every time you doomscroll, you are paying with the currency Simon first identified. 
                We stand against the exploitation of the Attention Economy.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Go Deeper:</strong>{' '}
                <a 
                  href="https://archive.org/details/sim_public-administration-review_march-april-1971_31_2/page/40/mode/2up"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  "Designing Organizations for an Information-Rich World" (1971)
                </a>
              </p>
            </div>

            {/* Daniel Goleman */}
            <div className="border-l-4 border-purple-500 pl-6 py-4">
              <h3 className="text-2xl font-medium text-gray-900 mb-2">
                <a 
                  href="https://www.danielgoleman.info"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-600 inline-flex items-center gap-2"
                >
                  Daniel Goleman - Emotional Intelligence
                  <LibIcon icon="ExternalLink" size="xs" />
                </a>
              </h3>
              <div className="mb-3">
                <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm font-medium">
                  Core Concept: The "Amygdala Hijack"
                </span>
              </div>
              <p className="text-gray-700 mb-4">
                <strong>Our Take:</strong> The term "amygdala hijack" is the key to understanding the biology of burnout. 
                It describes the moment your ancient, emotional brain takes over from your rational mind in response to 
                a perceived threat—like a stressful email. Goleman's work proves that our feelings of being overwhelmed 
                are a sane, biological reaction to an insane system.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Go Deeper:</strong> <em>Emotional Intelligence: Why It Can Matter More Than IQ</em> (1995)
              </p>
            </div>

            {/* Stephen Covey */}
            <div className="border-l-4 border-green-500 pl-6 py-4">
              <h3 className="text-2xl font-medium text-gray-900 mb-2">Stephen Covey - The 7 Habits of Highly Effective People</h3>
              <div className="mb-3">
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-medium">
                  Core Concept: The "Scarcity Mindset"
                </span>
              </div>
              <p className="text-gray-700 mb-4">
                <strong>Our Take:</strong> Stephen Covey gave the world the vocabulary to describe two fundamentally 
                different ways of seeing the world. He defined the Scarcity Mindset as the zero-sum belief that for 
                you to win, someone else must lose. We are actively working to build a world that operates on the 
                principles of the Abundance Mentality, the belief that there is plenty for everyone.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Go Deeper:</strong> <em>The 7 Habits of Highly Effective People</em> (1989)
              </p>
            </div>

            {/* John Stuart Mill */}
            <div className="border-l-4 border-orange-500 pl-6 py-4">
              <h3 className="text-2xl font-medium text-gray-900 mb-2">John Stuart Mill - On Liberty</h3>
              <div className="mb-3">
                <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded text-sm font-medium">
                  Core Concept: The "Harm Principle"
                </span>
              </div>
              <p className="text-gray-700 mb-4">
                <strong>Our Take:</strong> The Harm Principle states that your individual rights and sovereignty are 
                absolute, right up to the point where they begin to impede on the rights and sovereignty of others. 
                This is the foundation of our principle of Mutual Sovereignty. Your right to exist as you are is 
                non-negotiable; that right only frays when it is used to actively impose upon or harm another.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Go Deeper:</strong>{' '}
                <a 
                  href="https://www.gutenberg.org/ebooks/34901"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:text-orange-700 underline"
                >
                  <em>On Liberty</em> (1859) - Read free at Project Gutenberg
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Institutional Stewards */}
        <div className="mb-16">
          <h2 className="text-3xl font-light text-gray-900 mb-8">3. The Institutional Stewards</h2>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                <a 
                  href="https://www.eff.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 inline-flex items-center gap-2"
                >
                  The Electronic Frontier Foundation (EFF)
                  <LibIcon icon="ExternalLink" size="xs" />
                </a>
              </h3>
              <p className="text-gray-700">
                For fighting the legal battles for digital privacy and liberty long before we arrived.
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                <a 
                  href="https://www.transformativeworks.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-purple-600 inline-flex items-center gap-2"
                >
                  The Organization for Transformative Works (OTW)
                  <LibIcon icon="ExternalLink" size="xs" />
                </a>
              </h3>
              <p className="text-gray-700">
                For proving that a non-profit, volunteer-run platform (AO3) can outperform billion-dollar 
                corporations by serving creators, not algorithms.
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-6">
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                <a 
                  href="https://archive.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-green-600 inline-flex items-center gap-2"
                >
                  The Internet Archive
                  <LibIcon icon="ExternalLink" size="xs" />
                </a>
              </h3>
              <p className="text-gray-700">
                For preserving the digital memory that the "Status Quo" tries to delete.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Our Lexicon */}
        <div className="mb-16">
          <h2 className="text-3xl font-light text-gray-900 mb-8">Our Lexicon: The Language of Liberation</h2>
          <p className="text-lg text-gray-600 mb-8">
            As we've built this movement, we've found it necessary to coin new terms to describe the patterns 
            we are fighting against and the new world we are trying to build.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Burn Down */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">The Burn Down</h3>
              <p className="text-sm text-gray-700">
                <strong>Definition:</strong> The systemic state often mislabeled as "burnout." It is not a 
                personal failure of grit or resilience; it is the predictable result of a system designed to 
                extract maximum life force from human workers. You aren't burning out; you are being burned 
                down by design.
              </p>
            </div>

            {/* Performance Poverty */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Poverty</h3>
              <p className="text-sm text-gray-700">
                <strong>Definition:</strong> The act of a highly profitable corporation publicly complaining 
                about high costs to justify exorbitant prices, suppress wages, and lobby for corporate welfare. 
                It is a form of gaslighting that frames the "pharaohs" as struggling innovators.
              </p>
            </div>

            {/* Sovereign Professional */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sovereign Professional</h3>
              <p className="text-sm text-gray-700">
                <strong>Definition:</strong> A new class of worker defined by their skills and mission, not 
                their employer. They are not "unemployed" or "freelancers"; they are the architects of their 
                own work life, operating with agency outside the corporate hamster wheel.
              </p>
            </div>

            {/* Dual-Wielder */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Dual-Wielder</h3>
              <p className="text-sm text-gray-700">
                <strong>Definition:</strong> A creator who refuses the binary choice between "logic" and "magic." 
                The Dual-Wielder balances the Builder (engineering, proof, discipline) with the Pilgrim 
                (intuition, pull, art), using technical mastery to protect spiritual truth.
              </p>
            </div>

            {/* The Full Ledger */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">The Full Ledger</h3>
              <p className="text-sm text-gray-700">
                <strong>Definition:</strong> Our principle of radical transparency. It refuses to hide costs 
                or debts. In finance, it means showing the real cost of a builder's labor (stipend) and 
                infrastructure. In history, it means acknowledging the ancestral erasure and privilege that 
                paved the way for our current access.
              </p>
            </div>

            {/* Artisan Model */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Artisan Model</h3>
              <p className="text-sm text-gray-700">
                <strong>Definition:</strong> A small, specialist AI model trained only on fully-consented, 
                DAON-verified data. It is the "Frugal Override" alternative to the "God-Models" of Big 
                Tech—ecologically efficient, ethically pure, and designed to be a tool for creators, not 
                a replacement.
              </p>
            </div>

            {/* Liberation Source */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Liberation Source</h3>
              <p className="text-sm text-gray-700">
                <strong>Definition:</strong> Our evolution of "open source." Software released under a license 
                (like our Liberation License) that makes code accessible but legally protects it from being 
                used for exploitation, surveillance capitalism, or systemic subjugation.
              </p>
            </div>

            {/* Mission-Driven Collective */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mission-Driven Collective</h3>
              <p className="text-sm text-gray-700">
                <strong>Definition:</strong> The future state of the company. A fluid, purpose-focused entity 
                that forms around a specific mission, attracts the right talent, and measures its success in 
                impact, not just profit. They are the "pyramids for the builders."
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
          <h2 className="text-2xl font-light text-gray-900 mb-4">
            Join the Movement
          </h2>
          <p className="text-gray-700 mb-6">
            Standing on these shoulders, we continue to build tools for liberation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/about"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Learn About Our Mission
            </Link>
            <Link 
              href="/tools"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Explore Liberation Tools
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
