import Link from 'next/link';
import { LibIcon } from '../../components/icons/LiberationIcons';

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <LibIcon icon="Settings" size="xl" className="text-blue-600" />
          </div>
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Developer Resources
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Build liberation tools yourself. All our components are open source and designed for embedding anywhere.
          </p>
        </div>

        {/* NPM Packages */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-light text-gray-800 mb-6">Published NPM Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">@greenfieldoverride/runway-calculator</h3>
              <p className="text-sm text-gray-600 mb-3">Complete runway calculator component with React hooks</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                npm install @greenfieldoverride/runway-calculator
              </code>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">@greenfieldoverride/real-hourly-wage</h3>
              <p className="text-sm text-gray-600 mb-3">Real hourly wage calculator with privacy-first design</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                npm install @greenfieldoverride/real-hourly-wage
              </code>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">@greenfieldoverride/cognitive-debt-assessment</h3>
              <p className="text-sm text-gray-600 mb-3">Burnout assessment tool with scientific backing</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                npm install @greenfieldoverride/cognitive-debt-assessment
              </code>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">@greenfieldoverride/values-vocation-matcher</h3>
              <p className="text-sm text-gray-600 mb-3">Values-based career matching system</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                npm install @greenfieldoverride/values-vocation-matcher
              </code>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">@greenfieldoverride/user-context</h3>
              <p className="text-sm text-gray-600 mb-3">Privacy-first user data persistence</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                npm install @greenfieldoverride/user-context
              </code>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">@greenfieldoverride/ai-copilot</h3>
              <p className="text-sm text-gray-600 mb-3">AI-powered liberation planning assistant</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                npm install @greenfieldoverride/ai-copilot
              </code>
            </div>
          </div>
        </div>

        {/* Usage Example */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-light text-gray-800 mb-6">Quick Start Example</h2>
          <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`import { RunwayCalculator } from '@greenfieldoverride/runway-calculator';
import { RealHourlyWageCalculator } from '@greenfieldoverride/real-hourly-wage';

function MyLiberationApp() {
  return (
    <div>
      <h1>Your Path to Freedom</h1>
      <RunwayCalculator />
      <RealHourlyWageCalculator />
    </div>
  );
}`}</pre>
          </div>
        </div>

        {/* Design Principles */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-light text-gray-800 mb-6">Design Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <LibIcon icon="Privacy" size="md" className="text-green-600 mr-2" />
                Privacy-First
              </h3>
              <ul className="text-gray-600 space-y-2">
                <li>• All calculations happen in-browser</li>
                <li>• No data ever leaves your device</li>
                <li>• No tracking, analytics, or cookies</li>
                <li>• No server-side data storage</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <LibIcon icon="Settings" size="md" className="text-blue-600 mr-2" />
                Developer-Friendly
              </h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Fully typed TypeScript components</li>
                <li>• Headless design for easy styling</li>
                <li>• React hooks for state management</li>
                <li>• Embeddable anywhere</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Source Code */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-light text-gray-800 mb-6">Source Code & Contributions</h2>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1">
              <p className="text-gray-600 mb-4">
                All liberation tools are open source and available on GitHub. 
                Contributions, issues, and feature requests are welcome.
              </p>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <LibIcon icon="Settings" size="sm" className="text-gray-400 mr-2" />
                <span>Licensed under Liberation License - use freely for liberation purposes</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a 
                href="https://github.com/thegreenfieldoverride/liberation-platform" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <LibIcon icon="Direction" size="sm" className="mr-2" />
                View Source Code
              </a>
              <Link 
                href="/tools"
                className="inline-flex items-center border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Try the Tools
              </Link>
            </div>
          </div>
        </div>

        {/* API Documentation */}
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-light text-gray-800 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-6">
            Check the README files in each package for detailed API documentation and examples.
          </p>
          <div className="text-sm text-gray-500">
            Building tools for liberation, by liberation seekers, for liberation seekers.
          </div>
        </div>
      </div>
    </div>
  );
}