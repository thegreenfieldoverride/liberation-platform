import Link from 'next/link';
import { LibIcon } from '@greenfieldoverride/liberation-ui';

export const metadata = {
  title: 'Projects - Building Ethical Infrastructure',
  description: 'Our current initiatives: DAON Network for ethical data verification, Collective Strategist for liberation planning, and ethical LLM training.',
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Building Ethical Infrastructure
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              We're not just building tools — we're building the foundation for a more ethical internet. Here's what we're working on.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-blue-100 overflow-hidden">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                  <LibIcon icon="ExternalLink" size="xl" className="text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">DAON Network</h2>
                <p className="text-blue-100 font-medium">Public Good Project</p>
              </div>
              
              <div className="p-8">
                <p className="text-gray-700 leading-relaxed mb-6">
                  The <strong>Data Attribution and Origin Network</strong> is our flagship infrastructure project. DAON provides cryptographic verification of data ownership and consent — the foundation for ethical AI training.
                </p>
                
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">What DAON Does:</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <LibIcon icon="Success" size="sm" className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Cryptographic proof of data ownership</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <LibIcon icon="Success" size="sm" className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Explicit consent tracking for AI training</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <LibIcon icon="Success" size="sm" className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Transparent attribution chain</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <LibIcon icon="Success" size="sm" className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Anti-scraping bot protection</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                  <p className="text-sm text-gray-700">
                    <strong>Greenfield's Role:</strong> We are sponsoring and developing DAON as a public good. We're hosting the infrastructure and building the initial implementation.
                  </p>
                </div>

                <a 
                  href="https://daon.network" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  Visit DAON Network
                  <LibIcon icon="ExternalLink" size="sm" />
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-purple-100 overflow-hidden">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-8">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                  <LibIcon icon="Magic" size="xl" className="text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Collective Strategist</h2>
                <p className="text-purple-100 font-medium">In Development</p>
              </div>
              
              <div className="p-8">
                <p className="text-gray-700 leading-relaxed mb-6">
                  An AI-powered strategic planning tool designed to help you navigate complex liberation decisions using collective intelligence and ethical frameworks.
                </p>
                
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">Features in Development:</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <LibIcon icon="Progress" size="sm" className="text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Multi-scenario planning with AI assistance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <LibIcon icon="Progress" size="sm" className="text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Collaborative decision-making framework</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <LibIcon icon="Progress" size="sm" className="text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Value-aligned recommendation engine</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <LibIcon icon="Progress" size="sm" className="text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Long-term impact analysis</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6">
                  <p className="text-sm text-gray-700">
                    <strong>Status:</strong> Currently deployed internally for testing and refinement. We're burning in Tier 3 functionality before public launch.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-600 rounded-xl font-medium cursor-not-allowed">
                  Coming Soon
                  <LibIcon icon="Info" size="sm" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-green-100 overflow-hidden">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                  <LibIcon icon="AICopilot" size="xl" className="text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Ethical LLM Training</h2>
                <p className="text-green-100 font-medium">Future Sprint</p>
              </div>
              
              <div className="p-8">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Training specialized AI models on ethical, fully-consented data. No stolen content. No scraped websites. Just honest, transparent machine learning.
                </p>
                
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">Our Approach:</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <LibIcon icon="Success" size="sm" className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>LoRA fine-tuning:</strong> Lean, cost-effective training ($1,500 vs millions)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <LibIcon icon="Success" size="sm" className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>DAON-verified data:</strong> Only fully consented, attributed content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <LibIcon icon="Success" size="sm" className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>5 specialist models:</strong> Purpose-built for liberation use cases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <LibIcon icon="Success" size="sm" className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Environmentally conscious:</strong> Optimized training for minimal power use</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Goal:</strong> $1,500 to train 5 ethical LLMs
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">$0 / $1,500 funded</p>
                </div>

                <Link 
                  href="/funding"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                >
                  Support This Sprint
                  <LibIcon icon="Arrow" size="sm" />
                </Link>
              </div>
            </div>
          </div>

          <section className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Future Vision</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                These projects aren't isolated experiments — they're the building blocks of a more ethical internet infrastructure.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <LibIcon icon="Privacy" size="md" className="text-blue-600" />
                    Ethical Training Data
                  </h3>
                  <p className="text-gray-700">
                    DAON provides the foundation for LLM training that respects creators. No more stolen content, no more unethical scraping.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <LibIcon icon="Energy" size="md" className="text-green-600" />
                    Environmental Responsibility
                  </h3>
                  <p className="text-gray-700">
                    We're committed to energy-efficient AI infrastructure. Green power, optimized training, and minimal waste.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 p-6 rounded-r-xl">
                <p className="text-gray-800 font-medium mb-2">
                  Want to contribute to the future of ethical AI?
                </p>
                <p className="text-gray-700 mb-4">
                  Your support helps us build infrastructure that puts people over profits, consent over convenience, and transparency over exploitation.
                </p>
                <Link 
                  href="/funding" 
                  className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold"
                >
                  See How Funds Are Used
                  <LibIcon icon="Arrow" size="sm" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
