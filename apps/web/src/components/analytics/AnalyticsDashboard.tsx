'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, Globe, DollarSign, Activity, RefreshCw } from 'lucide-react';

interface UsageInsight {
  app: string;
  action: string;
  count: number;
  unique_sessions: number;
  hour: string;
}

interface GeographicInsight {
  country: string;
  app: string;
  usage_count: number;
  unique_users: number;
}

interface FinancialInsight {
  app: string;
  salary_band: string | null;
  runway_months: number | null;
  real_wage_diff: number | null;
  count: number;
}

export function AnalyticsDashboard() {
  const [usageData, setUsageData] = useState<UsageInsight[]>([]);
  const [geoData, setGeoData] = useState<GeographicInsight[]>([]);
  const [financialData, setFinancialData] = useState<FinancialInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [usageResponse, geoResponse, financialResponse] = await Promise.all([
        fetch('/api/analytics/insights?type=usage'),
        fetch('/api/analytics/insights?type=geographic'),
        fetch('/api/analytics/insights?type=financial'),
      ]);

      if (usageResponse.ok) {
        const usage = await usageResponse.json();
        setUsageData(usage);
      }

      if (geoResponse.ok) {
        const geo = await geoResponse.json();
        setGeoData(geo);
      }

      if (financialResponse.ok) {
        const financial = await financialResponse.json();
        setFinancialData(financial);
      }
    } catch (err) {
      setError('Failed to fetch analytics data. Analytics service may be unavailable.');
      console.warn('Analytics dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const totalEvents = usageData.reduce((sum, item) => sum + item.count, 0);
  const totalUsers = usageData.reduce((sum, item) => sum + item.unique_sessions, 0);
  const topCountries = geoData.slice(0, 5);
  const popularTools = usageData
    .filter(item => item.action === 'calculate' || item.action === 'complete')
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Liberation Analytics</h2>
          <p className="text-gray-600">Privacy-first insights into liberation tool usage</p>
        </div>
        <button
          onClick={fetchInsights}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-liberation-600 text-white rounded-lg hover:bg-liberation-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">{error}</p>
          <p className="text-sm text-yellow-600 mt-1">
            Analytics data will be available once the analytics service is running and collecting data.
          </p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center">
            <Activity className="w-8 h-8 mr-3" />
            <div>
              <p className="text-blue-100">Total Events (24h)</p>
              <p className="text-2xl font-bold">{totalEvents.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center">
            <Users className="w-8 h-8 mr-3" />
            <div>
              <p className="text-green-100">Unique Users (24h)</p>
              <p className="text-2xl font-bold">{totalUsers.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center">
            <Globe className="w-8 h-8 mr-3" />
            <div>
              <p className="text-purple-100">Countries</p>
              <p className="text-2xl font-bold">{geoData.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 mr-3" />
            <div>
              <p className="text-orange-100">Active Tools</p>
              <p className="text-2xl font-bold">{popularTools.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Tools */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Popular Liberation Tools</h3>
          {popularTools.length > 0 ? (
            <div className="space-y-2">
              {popularTools.map((tool, index) => (
                <div key={`${tool.app}-${tool.action}`} className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-liberation-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-liberation-600 font-semibold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{tool.app.replace(/-/g, ' ')}</p>
                      <p className="text-sm text-gray-500">{tool.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{tool.count}</p>
                    <p className="text-sm text-gray-500">{tool.unique_sessions} users</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No tool usage data available yet.</p>
          )}
        </div>

        {/* Geographic Distribution */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Global Liberation Movement</h3>
          {topCountries.length > 0 ? (
            <div className="space-y-2">
              {topCountries.map((country, index) => (
                <div key={country.country} className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Globe className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{country.country || 'Unknown'}</p>
                      <p className="text-sm text-gray-500">{country.app.replace(/-/g, ' ')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{country.usage_count}</p>
                    <p className="text-sm text-gray-500">{country.unique_users} users</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No geographic data available yet.</p>
          )}
        </div>

        {/* Financial Liberation Insights */}
        <div className="bg-gray-50 rounded-lg p-4 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Financial Liberation Insights</h3>
          {financialData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {financialData.slice(0, 6).map((insight, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center mb-2">
                    <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-medium text-gray-900">{insight.app.replace(/-/g, ' ')}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    {insight.salary_band && (
                      <p className="text-gray-600">Salary: {insight.salary_band}</p>
                    )}
                    {insight.runway_months && (
                      <p className="text-gray-600">Runway: {insight.runway_months} months</p>
                    )}
                    {insight.real_wage_diff && (
                      <p className="text-gray-600">Wage diff: {insight.real_wage_diff.toFixed(1)}%</p>
                    )}
                    <p className="text-liberation-600 font-medium">{insight.count} calculations</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No financial insights available yet.</p>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Privacy First</h4>
        <p className="text-blue-800 text-sm">
          All analytics are completely anonymous and privacy-preserving. We track only aggregated usage patterns 
          to improve liberation tools - no personal data, no tracking cookies, no individual user identification.
        </p>
      </div>
    </div>
  );
}