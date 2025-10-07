import Link from 'next/link';

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Liberation Tools
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Privacy-first tools to help you escape the corporate hamster wheel. 
            All calculations happen in your browser - we never see your data.
          </p>
        </div>

        {/* Tier 1: The Mirror */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🪞</span>
            </div>
            <h2 className="text-2xl font-light text-gray-900 mb-2">
              Tier 1: The Mirror
            </h2>
            <p className="text-gray-600">
              Replace vague anxiety with hard, undeniable data about your situation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Runway Calculator */}
            <div className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🛣️</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-800">Runway Calculator</h3>
                  <p className="text-sm text-gray-600">Your path to freedom starts here</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Transform overwhelming financial anxiety into a single, clear number. 
                Calculate exactly how long your savings will last with your essential expenses.
              </p>
              <div className="mb-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  All calculations stay in your browser
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Real-time updates as you type
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Embeddable in any website
                </div>
              </div>
              <Link 
                href="/tools/runway-calculator"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Calculate Your Runway →
              </Link>
            </div>

            {/* Real Hourly Wage */}
            <div className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">💊</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-800">Real Hourly Wage Calculator</h3>
                  <p className="text-sm text-gray-600">The red pill moment</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Shatter the salary illusion. Discover what you're actually earning per hour 
                after accounting for real working time and hidden costs like commuting and stress spending.
              </p>
              <div className="mb-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Includes commute time in calculations
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Accounts for work-related expenses
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Eye-opening percentage comparisons
                </div>
              </div>
              <Link 
                href="/tools/real-hourly-wage"
                className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                Take the Red Pill →
              </Link>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="text-center">
          <h2 className="text-2xl font-light text-gray-900 mb-8">
            More Tools Coming Soon
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Tier 2: The Toolkit */}
            <div className="bg-white rounded-xl shadow-sm p-6 opacity-75">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛠️</span>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">The Toolkit</h3>
              <p className="text-sm text-gray-600 mb-4">
                AI-powered tools to build your escape route and design your new life
              </p>
               <ul className="text-sm text-gray-500 space-y-1">
                 <li>• AI Co-Pilot for personalized planning</li>
                 <li>• Small Bets Portfolio Builder</li>
                 <li>• Exit Strategy Planner</li>
               </ul>
            </div>

            {/* Tier 3: The Colony */}
            <div className="bg-white rounded-xl shadow-sm p-6 opacity-75">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">The Colony</h3>
              <p className="text-sm text-gray-600 mb-4">
                Community platform for collaboration and mutual support
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Skills Barter System</li>
                <li>• Sovereign Circles</li>
                <li>• Liberation Community</li>
              </ul>
            </div>
            </div>

            {/* Cognitive Debt Assessment */}
            <div className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🧠</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-800">Cognitive Debt Assessment</h3>
                  <p className="text-sm text-gray-600">Measure the mental cost</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Uncover the hidden psychological toll of corporate burnout. This comprehensive assessment 
                reveals how deeply your work environment has affected your cognitive function and well-being.
              </p>
              <div className="mb-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  18 scientifically-grounded questions
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Detailed breakdown by category
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Personalized recommendations
                </div>
              </div>
              <Link 
                href="/cognitive-debt-assessment"
                className="inline-flex items-center bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Begin Assessment →
              </Link>
            </div>
          </div>
        </div>
    </div>
  );
}