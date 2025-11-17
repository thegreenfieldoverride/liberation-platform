import type { Story } from '@ladle/react';
import { LibIcon } from './LiberationIcons';

export default {
  title: 'Liberation Platform / Icons',
};

export const AllIcons: Story = () => (
  <div className="p-8 bg-gray-50 min-h-screen">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Liberation Icon System</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Navigation & Actions */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Navigation & Actions</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-3 rounded border">
              <LibIcon icon="Direction" size="lg" className="text-blue-600 mb-2" />
              <span className="text-xs text-gray-600">Direction</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded border">
              <LibIcon icon="Arrow" size="lg" className="text-blue-600 mb-2" />
              <span className="text-xs text-gray-600">Arrow</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded border">
              <LibIcon icon="ExternalLink" size="lg" className="text-blue-600 mb-2" />
              <span className="text-xs text-gray-600">External Link</span>
            </div>
          </div>
        </div>

        {/* Liberation Theme */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Liberation Theme</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-3 rounded border">
              <LibIcon icon="Growth" size="lg" className="text-green-600 mb-2" />
              <span className="text-xs text-gray-600">Growth</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded border">
              <LibIcon icon="Energy" size="lg" className="text-yellow-600 mb-2" />
              <span className="text-xs text-gray-600">Energy</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded border">
              <LibIcon icon="Focus" size="lg" className="text-purple-600 mb-2" />
              <span className="text-xs text-gray-600">Focus</span>
            </div>
          </div>
        </div>

        {/* Tools */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Liberation Tools</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-3 rounded border">
              <LibIcon icon="RunwayCalculator" size="lg" className="text-blue-600 mb-2" />
              <span className="text-xs text-gray-600">Runway Calculator</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded border">
              <LibIcon icon="WageAnalysis" size="lg" className="text-red-600 mb-2" />
              <span className="text-xs text-gray-600">Wage Analysis</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded border">
              <LibIcon icon="Mind" size="lg" className="text-purple-600 mb-2" />
              <span className="text-xs text-gray-600">Mind</span>
            </div>
          </div>
        </div>

        {/* System */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">System</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-3 rounded border">
              <LibIcon icon="Privacy" size="lg" className="text-green-600 mb-2" />
              <span className="text-xs text-gray-600">Privacy</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded border">
              <LibIcon icon="Settings" size="lg" className="text-gray-600 mb-2" />
              <span className="text-xs text-gray-600">Settings</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded border">
              <LibIcon icon="Success" size="lg" className="text-green-600 mb-2" />
              <span className="text-xs text-gray-600">Success</span>
            </div>
          </div>
        </div>
      </div>

      {/* Size Examples */}
      <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Icon Sizes</h3>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center">
            <LibIcon icon="Privacy" size="xs" className="text-green-600 mb-1" />
            <span className="text-xs text-gray-600">xs</span>
          </div>
          <div className="flex flex-col items-center">
            <LibIcon icon="Privacy" size="sm" className="text-green-600 mb-1" />
            <span className="text-xs text-gray-600">sm</span>
          </div>
          <div className="flex flex-col items-center">
            <LibIcon icon="Privacy" size="md" className="text-green-600 mb-1" />
            <span className="text-xs text-gray-600">md</span>
          </div>
          <div className="flex flex-col items-center">
            <LibIcon icon="Privacy" size="lg" className="text-green-600 mb-1" />
            <span className="text-xs text-gray-600">lg</span>
          </div>
          <div className="flex flex-col items-center">
            <LibIcon icon="Privacy" size="xl" className="text-green-600 mb-1" />
            <span className="text-xs text-gray-600">xl</span>
          </div>
          <div className="flex flex-col items-center">
            <LibIcon icon="Privacy" size="2xl" className="text-green-600 mb-1" />
            <span className="text-xs text-gray-600">2xl</span>
          </div>
          <div className="flex flex-col items-center">
            <LibIcon icon="Privacy" size="3xl" className="text-green-600 mb-1" />
            <span className="text-xs text-gray-600">3xl</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const LibrationTheme: Story = () => (
  <div className="p-8 bg-gradient-to-br from-blue-900 to-purple-900 min-h-screen">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-white">Liberation Theme Icons</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
          <LibIcon icon="Growth" size="2xl" className="text-green-400 mx-auto mb-3" />
          <h3 className="text-white font-medium">Growth</h3>
          <p className="text-white/70 text-sm mt-1">Personal development</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
          <LibIcon icon="Energy" size="2xl" className="text-yellow-400 mx-auto mb-3" />
          <h3 className="text-white font-medium">Energy</h3>
          <p className="text-white/70 text-sm mt-1">Vitality & power</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
          <LibIcon icon="Focus" size="2xl" className="text-purple-400 mx-auto mb-3" />
          <h3 className="text-white font-medium">Focus</h3>
          <p className="text-white/70 text-sm mt-1">Clarity & direction</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
          <LibIcon icon="Privacy" size="2xl" className="text-green-400 mx-auto mb-3" />
          <h3 className="text-white font-medium">Privacy</h3>
          <p className="text-white/70 text-sm mt-1">Digital freedom</p>
        </div>
      </div>
    </div>
  </div>
);

export const InteractiveStates: Story = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-8 text-gray-900">Interactive Icon States</h1>
    
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <LibIcon icon="Direction" size="sm" />
          <span>Primary Button</span>
          <LibIcon icon="Arrow" size="sm" />
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <LibIcon icon="Settings" size="sm" />
          <span>Secondary Button</span>
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-700 transition-colors">
          <LibIcon icon="Privacy" size="sm" />
          <span>Text Button</span>
        </button>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-green-600">
          <LibIcon icon="Success" size="sm" className="animate-pulse" />
          <span>Success State</span>
        </div>
        
        <div className="flex items-center gap-2 text-red-600">
          <LibIcon icon="Warning" size="sm" />
          <span>Warning State</span>
        </div>
        
        <div className="flex items-center gap-2 text-blue-600">
          <LibIcon icon="Analytics" size="sm" />
          <span>Info State</span>
        </div>
      </div>
    </div>
  </div>
);