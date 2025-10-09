/**
 * Icon Showcase Component
 * For development and documentation of the Liberation Icons system
 */

import React from 'react';
import { LiberationIcons, LibIcon, IconSizes } from './LiberationIcons';

export const IconShowcase: React.FC = () => {
  const iconNames = Object.keys(LiberationIcons) as Array<keyof typeof LiberationIcons>;
  const sizeNames = Object.keys(IconSizes) as Array<keyof typeof IconSizes>;

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Liberation Icons System</h1>
        <p className="text-gray-600 mb-8">
          Lucide-based icon system aligned with our liberation values. 
          All icons are semantic, accessible, and consistent.
        </p>

        {/* Size Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Icon Sizes</h2>
          <div className="flex items-center gap-8 p-6 bg-gray-50 rounded-lg">
            {sizeNames.map(size => (
              <div key={size} className="text-center">
                <LibIcon icon="Growth" size={size} className="text-green-600 mb-2" />
                <div className="text-xs text-gray-500">{size}</div>
                <div className="text-xs text-gray-400">{IconSizes[size]}px</div>
              </div>
            ))}
          </div>
        </section>

        {/* Core Liberation Icons */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Core Liberation Concepts</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              'Direction', 'NewBeginning', 'Growth', 'Progress', 'Focus', 'Freedom',
              'Privacy', 'Wellbeing', 'Mind', 'Energy'
            ].map(iconName => (
              <div key={iconName} className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <LibIcon 
                  icon={iconName as keyof typeof LiberationIcons} 
                  size="xl" 
                  className="text-blue-600 mb-3 mx-auto" 
                />
                <div className="text-xs font-medium text-gray-700">{iconName}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Tool Icons */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tool Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              'RunwayCalculator', 'WageAnalysis', 'CognitiveDebt', 'TimeTracking',
              'DataVisualization', 'Analytics', 'AICopilot'
            ].map(iconName => (
              <div key={iconName} className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <LibIcon 
                  icon={iconName as keyof typeof LiberationIcons} 
                  size="xl" 
                  className="text-purple-600 mb-3 mx-auto" 
                />
                <div className="text-xs font-medium text-gray-700">{iconName}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Status Icons */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Status & Feedback</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              'Success', 'Warning', 'Error', 'Info', 'Alert', 'Loading'
            ].map(iconName => (
              <div key={iconName} className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <LibIcon 
                  icon={iconName as keyof typeof LiberationIcons} 
                  size="xl" 
                  className={`mb-3 mx-auto ${
                    iconName === 'Success' ? 'text-green-600' :
                    iconName === 'Warning' ? 'text-yellow-600' :
                    iconName === 'Error' ? 'text-red-600' :
                    iconName === 'Loading' ? 'text-blue-600 animate-spin' :
                    'text-gray-600'
                  }`}
                />
                <div className="text-xs font-medium text-gray-700">{iconName}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Animation Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Animation Examples</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <LibIcon icon="Growth" size="2xl" animation="float" className="text-green-600 mb-3" />
              <div className="text-sm font-medium text-gray-700">Float</div>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <LibIcon icon="Loading" size="2xl" animation="spin" className="text-blue-600 mb-3" />
              <div className="text-sm font-medium text-gray-700">Spin</div>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <LibIcon icon="Privacy" size="2xl" animation="pulse" className="text-green-600 mb-3" />
              <div className="text-sm font-medium text-gray-700">Pulse</div>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <LibIcon icon="Energy" size="2xl" animation="bounce" className="text-yellow-600 mb-3" />
              <div className="text-sm font-medium text-gray-700">Bounce</div>
            </div>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Usage Examples</h2>
          <div className="space-y-6">
            {/* Button with icon */}
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Button with Icon</h3>
              <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <LibIcon icon="Direction" size="sm" />
                Find Your Path
                <LibIcon icon="Arrow" size="sm" />
              </button>
            </div>

            {/* Status indicator */}
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Status Indicator</h3>
              <div className="flex items-center gap-2 text-green-600">
                <LibIcon icon="Privacy" size="sm" animation="pulse" />
                <span className="text-sm">Privacy-First Processing Active</span>
              </div>
            </div>

            {/* Navigation item */}
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Navigation Item</h3>
              <div className="flex items-center gap-3 text-gray-700 hover:text-blue-600 cursor-pointer transition-colors">
                <LibIcon icon="AICopilot" size="md" />
                <span>AI Co-Pilot</span>
                <LibIcon icon="Arrow" size="sm" className="ml-auto" />
              </div>
            </div>
          </div>
        </section>

        {/* All Icons Grid */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">All Available Icons</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {iconNames.map(iconName => (
              <div key={iconName} className="text-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 group">
                <LibIcon 
                  icon={iconName} 
                  size="lg" 
                  className="text-gray-600 group-hover:text-blue-600 mb-2 mx-auto transition-colors" 
                />
                <div className="text-xs text-gray-700 font-mono break-all">{iconName}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};