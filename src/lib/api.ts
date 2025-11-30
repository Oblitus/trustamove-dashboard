export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://trustamove-kyc.fly.dev';

export interface ApiKey {
  id: number;
  customerId: string;
  name: string;
  status: 'ACTIVE' | 'REVOKED';
  prefix: string;
  secret?: string;
  createdAt: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
}

export interface BillingUsage {
  customerId: string;
  totalVerifications: number;
  totalCost: number;
  verifications: Array<{
    kycId: string;
    userId: string;
    status: string;
    cost: number;
    createdAt: string;
  }>;
}

export interface KYCVerification {
  kycId: string;
  userId: string;
  customerId: string;
  status: string;
  verificationUrl?: string;
  createdAt: string;
  updatedAt: string;
}

class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    // Add Supabase JWT token for auth and billing endpoints
    if (this.authToken && (endpoint.includes('/auth/') || endpoint.includes('/billing/'))) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
      console.log('Sending request to:', endpoint, 'with auth token');
      console.log('Token (first 50 chars):', this.authToken.substring(0, 50) + '...');
    } else {
      console.log('Sending request to:', endpoint, 'WITHOUT auth token');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('API Error:', response.status, error);
      throw new Error(error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // API Key Management (requires Supabase JWT)
  async createApiKey(name: string, isTest: boolean = false): Promise<ApiKey> {
    return this.request<ApiKey>('/api/v1/auth/keys', {
      method: 'POST',
      body: JSON.stringify({ name, isTest }),
    });
  }

  async listApiKeys(customerId: string): Promise<ApiKey[]> {
    return this.request<ApiKey[]>(`/api/v1/auth/keys/${customerId}`);
  }

  async revokeApiKey(customerId: string, keyId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/v1/auth/keys/${customerId}/${keyId}`, {
      method: 'DELETE',
    });
  }

  // Billing (uses JWT auth, not API key)
  async getBillingUsage(customerId: string, startDate?: string, endDate?: string): Promise<BillingUsage> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    
    return this.request<BillingUsage>(`/api/v1/billing/usage/${customerId}${query}`);
  }

  // KYC Verifications
  async getKYCStatus(kycId: string, apiKey: string): Promise<KYCVerification> {
    return this.request<KYCVerification>(`/api/v1/kyc/status/${kycId}`, {
      headers: {
        'X-API-Key': apiKey,
      },
    });
  }
}

export const apiClient = new ApiClient();
