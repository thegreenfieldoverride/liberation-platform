import type { Story } from '@ladle/react';
import KofiButton from './KofiButton';

export default {
  title: 'Liberation Platform / Support',
};

export const KofiButtonVariants: Story = () => (
  <div className="p-8 bg-gray-50 min-h-screen">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Ko-fi Support Button</h1>
      
      <div className="space-y-8">
        {/* Button Variant */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Button Variant</h3>
          <div className="flex flex-wrap gap-4">
            <KofiButton size="small" variant="button" />
            <KofiButton size="medium" variant="button" />
            <KofiButton size="large" variant="button" />
          </div>
        </div>

        {/* Badge Variant */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Badge Variant</h3>
          <div className="flex flex-wrap gap-4">
            <KofiButton size="small" variant="badge" />
            <KofiButton size="medium" variant="badge" />
            <KofiButton size="large" variant="badge" />
          </div>
        </div>

        {/* Minimal Variant */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Minimal Variant</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-gray-600">Enjoying the platform?</span>
            <KofiButton variant="minimal" />
            <span className="text-gray-600">helps keep it running!</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const KofiInContext: Story = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
    {/* Liberation Platform Header */}
    <header className="px-8 py-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Liberation Platform</h1>
        <KofiButton size="medium" variant="badge" className="shadow-lg" />
      </div>
    </header>
    
    {/* Hero Section */}
    <section className="px-8 py-20 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl font-bold text-white mb-6">
          Break Free from Corporate Burnout
        </h2>
        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          AI-powered tools to help you escape the hamster wheel and build a more intentional life.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-lg border border-white/30">
            Start Your Journey
          </button>
          <div className="flex items-center gap-2 text-white/70">
            <span>💜 Community-funded</span>
            <KofiButton variant="minimal" />
          </div>
        </div>
      </div>
    </section>
    
    {/* Support Section */}
    <section className="px-8 py-16">
      <div className="max-w-2xl mx-auto bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/30 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">
          💜 Support the Mission
        </h3>
        <p className="text-white/80 mb-6">
          This platform is built with love and funded by community support. 
          Every contribution helps keep the lights on and development moving forward.
        </p>
        <KofiButton size="large" variant="badge" />
        <p className="text-sm text-white/70 mt-4">
          Every coffee helps someone escape the hamster wheel ✨
        </p>
      </div>
    </section>
  </div>
);

export const KofiUsageExamples: Story = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-8 text-gray-900">Ko-fi Button Usage Examples</h1>
    
    <div className="space-y-8">
      {/* In Navigation */}
      <div className="border rounded-lg p-6">
        <h3 className="font-semibold mb-4">In Navigation Bar</h3>
        <div className="bg-white border-b shadow-sm p-4 rounded">
          <div className="flex justify-between items-center max-w-6xl mx-auto">
            <div className="flex items-center gap-6">
              <span className="font-bold">Liberation Platform</span>
              <nav className="flex gap-4 text-gray-600">
                <a href="#" className="hover:text-gray-900">Tools</a>
                <a href="#" className="hover:text-gray-900">About</a>
                <a href="#" className="hover:text-gray-900">Docs</a>
              </nav>
            </div>
            <KofiButton size="small" variant="button" />
          </div>
        </div>
      </div>
      
      {/* In Footer */}
      <div className="border rounded-lg p-6">
        <h3 className="font-semibold mb-4">In Footer</h3>
        <div className="bg-gray-900 text-white p-6 rounded">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-gray-300">© 2024 Liberation Platform</p>
                <p className="text-sm text-gray-400">Building tools for corporate escapees</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <KofiButton size="medium" variant="badge" />
                <p className="text-xs text-gray-400">Support independent development</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Inline in Content */}
      <div className="border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Inline in Content</h3>
        <div className="prose max-w-none">
          <p className="text-gray-700 mb-4">
            The Liberation Platform is designed to help you break free from corporate burnout 
            and build a more intentional way of living and working. Our AI-powered tools provide 
            clarity on your financial runway, real hourly wage, and cognitive debt.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span>This platform is community-funded.</span>
            <KofiButton variant="minimal" />
            <span>helps keep it independent & ad-free!</span>
          </div>
          <p className="text-gray-700">
            Every tool is architected with privacy as its foundation, ensuring your personal 
            data remains yours while you build your path to liberation.
          </p>
        </div>
      </div>
    </div>
  </div>
);