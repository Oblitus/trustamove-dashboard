import { useAuth } from '../hooks/useAuth';
import { Key, CreditCard, FileCheck, TrendingUp } from 'lucide-react';

export default function OverviewPage() {
  const { user } = useAuth();

  const stats = [
    {
      name: 'Total Verifications',
      value: '0',
      icon: FileCheck,
      change: '+0%',
      changeType: 'neutral',
    },
    {
      name: 'Active API Keys',
      value: '0',
      icon: Key,
      change: 'No keys',
      changeType: 'neutral',
    },
    {
      name: 'This Month Cost',
      value: '$0.00',
      icon: CreditCard,
      change: '+0%',
      changeType: 'neutral',
    },
    {
      name: 'Success Rate',
      value: '0%',
      icon: TrendingUp,
      change: 'No data',
      changeType: 'neutral',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your KYC service
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-primary-50 p-3 rounded-lg">
                  <stat.icon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-gray-500">
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <a
            href="/dashboard/api-keys"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-primary-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 transition-all"
          >
            <div className="flex-shrink-0">
              <Key className="h-10 w-10 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">Create API Key</p>
              <p className="text-sm text-gray-500 truncate">Generate a new API key</p>
            </div>
          </a>

          <a
            href="/dashboard/billing"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-primary-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 transition-all"
          >
            <div className="flex-shrink-0">
              <CreditCard className="h-10 w-10 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">View Billing</p>
              <p className="text-sm text-gray-500 truncate">Check usage and costs</p>
            </div>
          </a>

          <a
            href="/dashboard/verifications"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-primary-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 transition-all"
          >
            <div className="flex-shrink-0">
              <FileCheck className="h-10 w-10 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">Verifications</p>
              <p className="text-sm text-gray-500 truncate">View KYC status</p>
            </div>
          </a>
        </div>
      </div>

      {/* Getting Started */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Getting Started</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-600 font-semibold">
                1
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Create an API Key</h3>
              <p className="mt-1 text-sm text-gray-500">
                Generate your first API key to start integrating with the KYC service
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-600 font-semibold">
                2
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Integrate the SDK</h3>
              <p className="mt-1 text-sm text-gray-500">
                Use our generated SDKs for Android, iOS, or Web to integrate KYC verification
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-600 font-semibold">
                3
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Monitor & Manage</h3>
              <p className="mt-1 text-sm text-gray-500">
                Track verifications, monitor billing, and manage your API keys from this dashboard
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
        <dl className="space-y-3">
          <div className="flex justify-between">
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="text-sm text-gray-900">{user?.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm font-medium text-gray-500">Customer ID</dt>
            <dd className="text-sm text-gray-900 font-mono">{user?.id}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm font-medium text-gray-500">Account Created</dt>
            <dd className="text-sm text-gray-900">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
