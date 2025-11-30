import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../lib/api';
import type { ApiKey } from '../lib/api';
import { Key, Plus, Trash2, Eye, EyeOff, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

export default function ApiKeysPage() {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [isTestKey, setIsTestKey] = useState(false);
  const [creatingKey, setCreatingKey] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<ApiKey | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    if (user) {
      loadApiKeys();
    }
  }, [user]);

  const loadApiKeys = async () => {
    try {
      setLoading(true);
      setError('');
      const keys = await apiClient.listApiKeys(user!.id);
      setApiKeys(keys);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load API keys');
      setApiKeys([]); // Show empty state on error
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      setError('Please enter a key name');
      return;
    }

    try {
      setCreatingKey(true);
      setError('');
      const newKey = await apiClient.createApiKey(newKeyName, isTestKey);
      setNewlyCreatedKey(newKey);
      setNewKeyName('');
      setIsTestKey(false);
      await loadApiKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create API key');
    } finally {
      setCreatingKey(false);
    }
  };

  const handleRevokeKey = async (keyId: number) => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return;
    }

    try {
      await apiClient.revokeApiKey(user!.id, keyId);
      await loadApiKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke API key');
    }
  };

  const handleCopySecret = async (secret: string) => {
    await navigator.clipboard.writeText(secret);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const closeNewKeyModal = () => {
    setNewlyCreatedKey(null);
    setShowSecret(false);
    setCopiedKey(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your API keys for authenticating requests to the TrustAMove KYC API
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create API Key
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* API Keys List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : apiKeys.length === 0 ? (
        <div className="card p-12 text-center">
          <Key className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No API keys</h3>
          <p className="mt-2 text-sm text-gray-500">
            Get started by creating your first API key
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-6 btn-primary inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create API Key
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prefix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Used
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {apiKeys.map((key) => (
                <tr key={key.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Key className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{key.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-sm text-gray-900 bg-gray-50 px-2 py-1 rounded">
                      {key.prefix}
                    </code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {key.status === 'ACTIVE' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Revoked
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {key.createdAt ? format(new Date(key.createdAt), 'MMM d, yyyy') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {key.lastUsedAt ? format(new Date(key.lastUsedAt), 'MMM d, yyyy') : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {key.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleRevokeKey(key.id)}
                        className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-900/75 transition-opacity" onClick={() => setShowCreateModal(false)} />
            <div className="relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New API Key</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="key-name" className="block text-sm font-medium text-gray-700">
                    Key Name
                  </label>
                  <input
                    id="key-name"
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="Production Key"
                    className="mt-1 input"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    A descriptive name to help you identify this key
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    id="is-test"
                    type="checkbox"
                    checked={isTestKey}
                    onChange={(e) => setIsTestKey(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is-test" className="ml-2 block text-sm text-gray-700">
                    Test key (starts with tm_test_)
                  </label>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    ⚠️ The API key will only be shown once. Make sure to copy and store it securely.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateKey}
                  disabled={creatingKey}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {creatingKey ? 'Creating...' : 'Create Key'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Key Created Modal */}
      {newlyCreatedKey && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-900/75 transition-opacity" />
            <div className="relative bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">API Key Created Successfully!</h3>
              </div>
              
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-semibold text-red-900 mb-2">
                  ⚠️ Important: Copy your API key now
                </p>
                <p className="text-sm text-red-800">
                  This is the only time you'll be able to see the full key. Store it securely!
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key Name
                  </label>
                  <div className="text-sm text-gray-900">{newlyCreatedKey.name}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key Secret
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm break-all">
                      {showSecret ? newlyCreatedKey.secret : '•'.repeat(50)}
                    </div>
                    <button
                      onClick={() => setShowSecret(!showSecret)}
                      className="btn-secondary px-3"
                      title={showSecret ? 'Hide' : 'Show'}
                    >
                      {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleCopySecret(newlyCreatedKey.secret!)}
                      className="btn-primary px-3"
                      title="Copy to clipboard"
                    >
                      {copiedKey ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  {copiedKey && (
                    <p className="mt-1 text-sm text-green-600">✓ Copied to clipboard!</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={closeNewKeyModal}
                  className="w-full btn-primary"
                >
                  I've saved my API key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
