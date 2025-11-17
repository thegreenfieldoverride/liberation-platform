import Link from 'next/link';
import { LibIcon } from '../../components/icons/LiberationIcons';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-gray-900 mb-6">
            Our Mission: Liberation from the Hamster Wheel
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            We're building tools and community to help people escape corporate burnout 
            and reconstruct a more humane, intentional way of living and working.
          </p>
        </div>

        {/* Core Mission */}
        <div className="mb-16">
          <h2 className="text-2xl font-light text-gray-900 mb-6">The Problem We're Solving</h2>
          <div className="prose prose-lg text-gray-600 max-w-none">
            <p>
              Millions of people are trapped in what we call the "Hamster Wheel" - a cycle of 
              corporate burnout where they trade increasing amounts of their life energy for 
              diminishing returns. They feel anxious about money but don't have clear data. 
              They want to escape but don't know how to plan their route.
            </p>
            <p>
              Our goal is to move individuals from a state of being "burned down" by the system 
              to a place where they can "rise from the ashes." We provide the tools, data, and 
              community needed for this transformation.
            </p>
          </div>
        </div>

        {/* Core Principles */}
        <div className="mb-16">
          <h2 className="text-2xl font-light text-gray-900 mb-8">Our Non-Negotiable Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-green-50 rounded-lg p-6">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <LibIcon icon="Privacy" size="lg" className="text-white" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Privacy is a Human Right</h3>
              <p className="text-gray-600">
                Every tool we build is architected with privacy as its absolute foundation. 
                We default to client-side processing and ephemeral data. We're building a 
                sanctuary, not a surveillance tool.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl">🤝</span>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">AI is a Partner, Not a Replacement</h3>
              <p className="text-gray-600">
                Our use of AI is always in service of augmenting human creativity and 
                liberating people from toil. We demonstrate positive-sum collaboration 
                between humans and AI.
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl">💝</span>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Radical Empathy in a Cold World</h3>
              <p className="text-gray-600">
                The tone of our tools and community is fiercely validating, non-judgmental, 
                and empowering. Users are in crisis; our platform is a source of calm, 
                clarity, and hope.
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-6">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                <LibIcon icon="Growth" size="lg" className="text-white" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Open and Replicable</h3>
              <p className="text-gray-600">
                The tools and frameworks we build are designed to be replicated and spread freely. 
                We're not building a walled garden; we're planting a forest and giving away the seeds.
              </p>
            </div>
          </div>
        </div>

        {/* The Three Tiers */}
        <div className="mb-16">
          <h2 className="text-2xl font-light text-gray-900 mb-8">Our Three-Tier Architecture</h2>
          
          <div className="space-y-8">
            <div className="bg-blue-50 rounded-lg p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-xl">🪞</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-800">Tier 1: The Mirror</h3>
                  <p className="text-sm text-gray-600">Tools for Self-Awareness</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Diagnostic tools designed to replace vague anxiety with hard, undeniable data 
                about your situation. This is the "red pill" - helping you see your reality clearly.
              </p>
              <div className="text-sm text-gray-500">
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2">Available Now</span>
                Runway Calculator, Real Hourly Wage Calculator
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                  <LibIcon icon="Settings" size="lg" className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-800">Tier 2: The Toolkit</h3>
                  <p className="text-sm text-gray-600">Tools for Action</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                AI-powered tools that help you build your escape route and design your new life. 
                This is the "how-to" guide for the rebellion against the hamster wheel.
              </p>
              <div className="text-sm text-gray-500">
                <span className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded mr-2">Coming Soon</span>
                AI Co-Pilot, Small Bets Portfolio Builder
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <LibIcon icon="Growth" size="lg" className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-800">Tier 3: The Colony</h3>
                  <p className="text-sm text-gray-600">Platform for Growth</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Community layer designed to foster collaboration, mutual support, and inspiration. 
                This is where we model the Abundance Mindset and build sustainable alternatives.
              </p>
              <div className="text-sm text-gray-500">
                <span className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded mr-2">Coming Soon</span>
                Skills Barter System, Sovereign Circles
              </div>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="text-center bg-gray-50 rounded-lg p-8 mb-16">
          <blockquote className="text-2xl font-light text-gray-800 italic mb-4">
            "The master's tools will never dismantle the master's house. 
            But we can build better tools."
          </blockquote>
          <p className="text-gray-600">
            Our adaptation of Audre Lorde's wisdom for the digital liberation age
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-light text-gray-900 mb-6">
            Ready to Join the Liberation Movement?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Start with our diagnostic tools to see your situation clearly, 
            then begin building your path to freedom.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/tools/runway-calculator"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Calculate Your Runway
            </Link>
            <Link 
              href="/real-hourly-wage"
              className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Take the Red Pill
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}