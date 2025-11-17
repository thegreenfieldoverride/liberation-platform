import type { Story } from '@ladle/react';
import { RunwayCalculator } from '@greenfieldoverride/runway-calculator';
import { RealHourlyWageCalculator } from '@greenfieldoverride/real-hourly-wage';
import { CognitiveDebtAssessment } from '@greenfieldoverride/cognitive-debt-assessment';

export default {
  title: 'Liberation Platform / Tools',
};

export const RunwayCalculatorTool: Story = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Runway Calculator</h1>
      <p className="text-gray-600 mb-8">
        Calculate how long you can sustain yourself before needing income. This helps you plan your escape from corporate burnout.
      </p>
      <RunwayCalculator />
    </div>
  </div>
);

export const RealWageTool: Story = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Real Hourly Wage Calculator</h1>
      <p className="text-gray-600 mb-8">
        Discover what you're actually earning when you factor in commute time, work-related expenses, and stress costs.
      </p>
      <RealHourlyWageCalculator />
    </div>
  </div>
);

export const CognitiveDebtTool: Story = () => (
  <div className="min-h-screen bg-gray-900 p-8">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-4">Cognitive Debt Assessment</h1>
      <p className="text-gray-300 mb-8">
        Assess the mental toll of your current work obligations and commitments.
      </p>
      <CognitiveDebtAssessment />
    </div>
  </div>
);

export const ToolComparison: Story = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-8">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Liberation Tools Suite</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-3">💰 Runway Calculator</h3>
          <p className="text-white/80 text-sm mb-4">
            Calculate your financial runway to freedom
          </p>
          <ul className="text-white/70 text-sm space-y-2">
            <li>• Track savings & expenses</li>
            <li>• Model scenarios</li>
            <li>• Plan your escape</li>
          </ul>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-3">⏰ Real Hourly Wage</h3>
          <p className="text-white/80 text-sm mb-4">
            Your true cost of employment
          </p>
          <ul className="text-white/70 text-sm space-y-2">
            <li>• Factor in commute time</li>
            <li>• Account for expenses</li>
            <li>• See true hourly rate</li>
          </ul>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-3">🧠 Cognitive Debt</h3>
          <p className="text-white/80 text-sm mb-4">
            Measure your mental burden
          </p>
          <ul className="text-white/70 text-sm space-y-2">
            <li>• Assess obligations</li>
            <li>• Identify drains</li>
            <li>• Plan reduction</li>
          </ul>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Start Your Liberation Journey</h2>
        <p className="text-white/80 mb-6">
          Use these tools together to build a comprehensive picture of your path to freedom
        </p>
        <button className="px-6 py-3 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
          Try All Tools
        </button>
      </div>
    </div>
  </div>
);