import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../lib/api';
import type { BillingUsage, ApiKey } from '../lib/api';
import { CreditCard, DollarSign, FileText, TrendingUp, Calendar } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

export default function BillingPage() {
  const { user } = useAuth();
  const [usage, setUsage] = useState<BillingUsage | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [selectedApiKey, setSelectedApiKey] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState<'month' | 'week' | 'all'>('month');

  useEffect(() => {
    if (user) {
      loadApiKeys();
    }
  }, [user]);

  useEffect(() => {
    if (selectedApiKey) {
      loadUsage();
    }
  }, [selectedApiKey, dateRange]);

  const loadApiKeys = async () => {
    try {
      const keys = await apiClient.listApiKeys(user!.id);
      const activeKeys = keys.filter(k => k.status === 'ACTIVE');
      setApiKeys(activeKeys);
      if (activeKeys.length > 0 && !selectedApiKey) {
        setSelectedApiKey(activeKeys[0].prefix);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load API keys');
    }
  };

  const loadUsage = async () => {
    try {
      setLoading(true);
      setError('');
      
      let startDate: string | undefined;
      let endDate: string | undefined;

      if (dateRange === 'month') {
        startDate = format(startOfMonth(new Date()), 'yyyy-MM-dd');
        endDate = format(endOfMonth(new Date()), 'yyyy-MM-dd');
      } else if (dateRange === 'week') {
        startDate = format(subDays(new Date(), 7), 'yyyy-MM-dd');
        endDate = format(new Date(), 'yyyy-MM-dd');
      }

      const data = await apiClient.getBillingUsage(user!.id, startDate, endDate);
      setUsage(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load billing usage');
    } finally {
      setLoading(false);
    }
  };

  const pricePerCheck = 3.50;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Usage</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor your KYC verification usage and costs
        </p>
      </div>

      {/* API Key & Date Range Selector */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <select
              id="api-key"
              value={selectedApiKey}
              onChange={(e) => setSelectedApiKey(e.target.value)}
              className="input"
              disabled={apiKeys.length === 0}
            >
              {apiKeys.length === 0 ? (
                <option value="">No active API keys</option>
              ) : (
                apiKeys.map((key) => (
                  <option key={key.id} value={key.prefix}>
                    {key.name} ({key.prefix})
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="flex-1">
            <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              id="date-range"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as 'month' | 'week' | 'all')}
              className="input"
            >
              <option value="week">Last 7 days</option>
              <option value="month">This month</option>
              <option value="all">All time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* No API Keys Warning */}
      {apiKeys.length === 0 && !loading && (
        <div className="card p-12 text-center">
          <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No active API keys</h3>
          <p className="mt-2 text-sm text-gray-500">
            Create an API key to start using the service and view billing
          </p>
          <a href="/dashboard/api-keys" className="mt-6 btn-primary inline-block">
            Create API Key
          </a>
        </div>
      )}

      {/* Loading State */}
      {loading && apiKeys.length > 0 && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      )}

      {/* Usage Stats */}
      {!loading && usage && apiKeys.length > 0 && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-primary-50 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Verifications
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {usage?.totalVerifications ?? 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Cost
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      ${(usage?.totalCost ?? 0).toFixed(2)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Avg. Cost
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      ${(usage?.totalVerifications ?? 0) > 0 
                        ? ((usage?.totalCost ?? 0) / (usage?.totalVerifications ?? 1)).toFixed(2)
                        : '0.00'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Price per Check
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      ${pricePerCheck.toFixed(2)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Verification History */}
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Verification History</h2>
            </div>
            
            {(usage?.verifications ?? []).length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No verifications yet</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Your verification history will appear here once you start processing KYC checks
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        KYC ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(usage?.verifications ?? []).map((verification) => (
                      <tr key={verification.kycId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <code className="text-sm text-gray-900 bg-gray-50 px-2 py-1 rounded">
                            {verification.kycId.substring(0, 20)}...
                          </code>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {verification.userId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            verification.status === 'APPROVED' 
                              ? 'bg-green-100 text-green-800'
                              : verification.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {verification.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(verification.createdAt), 'MMM d, yyyy HH:mm')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                          ${verification.cost.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pricing Info */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">KYC Verification</span>
                <span className="text-sm text-gray-900">${pricePerCheck.toFixed(2)} per check</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-gray-700">Billing Frequency</span>
                <span className="text-sm text-gray-900">Pay as you go</span>
              </div>
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 You are only charged for successful KYC verifications. Test mode verifications are free.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
