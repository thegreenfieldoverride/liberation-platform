import type { Story } from '@ladle/react';
import { LiberationJourneyWidget } from './LiberationJourneyWidget';

export default {
  title: 'Liberation Platform / Widgets',
};

export const JourneyWidgetSidebar: Story = () => (
  <div className="min-h-screen bg-gray-900 flex">
    <LiberationJourneyWidget variant="sidebar" />
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Your Liberation Journey</h1>
        <p className="text-gray-300 mb-4">
          Track your progress as you transition from corporate burnout to liberation.
        </p>
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold text-white">Journey Phases</h2>
          <ul className="text-gray-300 space-y-2">
            <li>🔍 Discovery - Recognizing the need for change</li>
            <li>📋 Planning - Charting your path forward</li>
            <li>🔨 Building - Creating your new reality</li>
            <li>🚀 Transitioning - Making the leap</li>
            <li>🌟 Liberated - Living your values</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export const JourneyWidgetInline: Story = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <LiberationJourneyWidget variant="inline" className="mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Recent Activity</h3>
          <p className="text-gray-600">Your recent liberation milestones appear here</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Next Steps</h3>
          <p className="text-gray-600">Recommended actions for your journey</p>
        </div>
      </div>
    </div>
  </div>
);

export const JourneyWidgetMobileDrawer: Story = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Mobile View</h1>
      <p className="text-white/80 mb-6">
        The journey widget adapts to mobile screens with a drawer interface
      </p>
      <LiberationJourneyWidget variant="mobile-drawer" />
    </div>
  </div>
);