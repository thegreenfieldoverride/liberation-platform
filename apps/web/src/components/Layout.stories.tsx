import type { Story } from '@ladle/react';
import { KofiButton } from '@greenfieldoverride/liberation-ui';

export default {
  title: 'Liberation Platform / Layout',
};

export const FullPageLayout: Story = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
    
    {/* Hero Section */}
    <section className="px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          Break Free from Corporate Burnout
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          AI-powered tools to help you escape the hamster wheel and build a more intentional life.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="px-8 py-4 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Start Your Journey
          </button>
          <KofiButton variant="badge" size="medium" />
        </div>
      </div>
    </section>

    {/* Feature Cards */}
    <section className="px-6 py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-3">Runway Calculator</h3>
          <p className="text-white/80">
            Calculate how long you can sustain yourself before needing income
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-3">Real Hourly Wage</h3>
          <p className="text-white/80">
            Discover what you're actually earning when you factor in all costs
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-3">Cognitive Debt</h3>
          <p className="text-white/80">
            Assess the mental toll of your current obligations
          </p>
        </div>
      </div>
    </section>

  </div>
);

export const LightPageLayout: Story = () => (
  <div className="min-h-screen bg-gray-50">
    
    {/* Content Section */}
    <section className="px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          About the Platform
        </h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-8">
            The Liberation Platform is designed to help knowledge workers escape corporate burnout 
            and build more intentional lives.
          </p>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-6">
            We believe that AI should empower individuals to make better decisions about their work 
            and life, not replace human agency. Every tool on this platform is built with privacy 
            as a foundational principle.
          </p>
          
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 my-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">🦋 Community-Funded</h3>
            <p className="text-gray-700 mb-4">
              This platform is independently built and maintained. Your support helps keep it 
              ad-free and aligned with liberation values.
            </p>
            <KofiButton variant="button" size="medium" />
          </div>
        </div>
      </div>
    </section>
  </div>
);