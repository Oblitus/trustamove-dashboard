import { useState } from 'react';
import { FileCheck, Search, AlertCircle } from 'lucide-react';

export default function VerificationsPage() {
  const [kycId, setKycId] = useState('');
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kycId.trim()) return;
    
    setSearching(true);
    // TODO: Implement KYC status lookup
    setTimeout(() => setSearching(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">KYC Verifications</h1>
        <p className="mt-1 text-sm text-gray-500">
          Search and monitor KYC verification statuses
        </p>
      </div>

      {/* Search */}
      <div className="card p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label htmlFor="kyc-id" className="block text-sm font-medium text-gray-700">
              Search by KYC ID
            </label>
            <div className="mt-1 flex gap-2">
              <input
                id="kyc-id"
                type="text"
                value={kycId}
                onChange={(e) => setKycId(e.target.value)}
                placeholder="kyc-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="flex-1 input"
              />
              <button
                type="submit"
                disabled={searching || !kycId.trim()}
                className="btn-primary px-6 disabled:opacity-50"
              >
                {searching ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Search
                  </div>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Info Banner */}
      <div className="card p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">How to use verifications</h3>
            <div className="mt-2 text-sm text-gray-600 space-y-2">
              <p>
                • Use the search bar above to look up a specific KYC verification by its ID
              </p>
              <p>
                • KYC IDs are returned when you initiate a verification via the API
              </p>
              <p>
                • You can also access verification details programmatically via the{' '}
                <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                  GET /api/v1/kyc/status/:kycId
                </code>{' '}
                endpoint
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="card p-12 text-center">
        <FileCheck className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No recent verifications</h3>
        <p className="mt-2 text-sm text-gray-500">
          Start by initiating a KYC verification via the API or SDK
        </p>
        <div className="mt-6">
          <a
            href="https://trustamove-kyc.fly.dev/q/swagger-ui"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-block"
          >
            View API Documentation
          </a>
        </div>
      </div>
    </div>
  );
}
