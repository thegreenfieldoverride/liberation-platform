import { RealHourlyWageCalculator } from '@greenfield/real-hourly-wage/react';
import Link from 'next/link';

export default function RealHourlyWagePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/tools" className="text-gray-500 hover:text-gray-700 transition-all duration-300 font-light">
            ← Back to Tools
          </Link>
        </nav>

        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">💊</span>
          </div>
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Real Hourly Wage Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            This is your red pill moment. Discover what you're actually being paid 
            for each hour of your life after accounting for real working time and hidden costs.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-8">
          <RealHourlyWageCalculator />
        </div>

        {/* What This Means */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-light text-gray-800 mb-4 text-center">
            Understanding Your Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">If your real wage is significantly lower:</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Your hidden costs are eating into your compensation</li>
                <li>• Consider negotiating remote work to reduce commute costs</li>
                <li>• Look for ways to minimize work-related expenses</li>
                <li>• Factor this into your runway calculations</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Next steps for liberation:</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Use the Runway Calculator to plan your escape timeline</li>
                <li>• Consider the true value of time vs. money trade-offs</li>
                <li>• Explore ways to reduce hidden costs</li>
                <li>• Build skills that command higher real wages</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-light text-gray-800 mb-4">
            Now Calculate Your Runway
          </h2>
          <p className="text-gray-600 mb-6">
            Armed with knowledge of your real wage, see how long your savings will last.
          </p>
          <Link 
            href="/tools/runway-calculator"
            className="inline-flex items-center bg-gray-700 text-white px-8 py-4 rounded-2xl hover:bg-gray-600 transition-all duration-300 font-light shadow-sm hover:shadow-md"
          >
            Calculate Your Runway →
          </Link>
        </div>
      </div>
    </div>
  );
}