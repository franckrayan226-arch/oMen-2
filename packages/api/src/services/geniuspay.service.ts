import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';

interface GeniusPayConfig {
  apiKey: string;
  apiSecret: string;
  baseUrl: string;
  webhookSecret: string;
}

interface CreatePaymentParams {
  amount: number;
  currency?: string;
  description?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  metadata?: Record<string, string>;
  successUrl?: string;
  errorUrl?: string;
  paymentMethod?: string; // "wave" | "orange_money" | "mtn" | "pawapay"
}

interface GeniusPayResponse {
  success: boolean;
  data: {
    id: number;
    reference: string;
    amount: number;
    currency: string;
    status: string;
    checkout_url?: string;
    payment_url?: string;
    payment_method?: string;
    metadata?: Record<string, string>;
    expires_at?: string;
  };
}

class GeniusPayService {
  private client: AxiosInstance;
  private webhookSecret: string;

  constructor(config: GeniusPayConfig) {
    this.webhookSecret = config.webhookSecret;
    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'X-API-Key': config.apiKey,
        'X-API-Secret': config.apiSecret,
        'Content-Type': 'application/json',
      },
    });
  }

  async createPayment(params: CreatePaymentParams): Promise<GeniusPayResponse> {
    const payload: Record<string, unknown> = {
      amount: params.amount,
      currency: params.currency || 'XOF',
      description: params.description,
    };

    if (params.customer) payload.customer = params.customer;
    if (params.metadata) payload.metadata = params.metadata;
    if (params.paymentMethod) payload.payment_method = params.paymentMethod;
    if (params.successUrl) payload.success_url = params.successUrl;
    if (params.errorUrl) payload.error_url = params.errorUrl;

    const { data } = await this.client.post<GeniusPayResponse>(
      '/api/v1/merchant/payments',
      payload
    );

    return data;
  }

  async getPayment(reference: string): Promise<GeniusPayResponse> {
    const { data } = await this.client.get<GeniusPayResponse>(
      `/api/v1/merchant/payments/${reference}`
    );
    return data;
  }

  async listPayments(params?: {
    page?: number;
    per_page?: number;
    status?: string;
  }): Promise<{ data: GeniusPayResponse['data'][]; meta: Record<string, number> }> {
    const { data } = await this.client.get('/api/v1/merchant/payments', {
      params,
    });
    return data;
  }

  verifyWebhookSignature(
    timestamp: string,
    payload: string,
    signature: string
  ): boolean {
    const data = `${timestamp}.${payload}`;
    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(data)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );
  }

  isWebhookTimestampValid(timestamp: string, maxAgeSeconds = 300): boolean {
    const now = Math.floor(Date.now() / 1000);
    const ts = parseInt(timestamp, 10);
    return Math.abs(now - ts) <= maxAgeSeconds;
  }
}

// Singleton
let geniusPayInstance: GeniusPayService | null = null;

export function getGeniusPay(): GeniusPayService {
  if (!geniusPayInstance) {
    geniusPayInstance = new GeniusPayService({
      apiKey: process.env.GENIUSPAY_API_KEY!,
      apiSecret: process.env.GENIUSPAY_API_SECRET!,
      baseUrl: process.env.GENIUSPAY_BASE_URL || 'https://pay.genius.ci',
      webhookSecret: process.env.GENIUSPAY_WEBHOOK_SECRET!,
    });
  }
  return geniusPayInstance;
}

export type { CreatePaymentParams, GeniusPayResponse };
