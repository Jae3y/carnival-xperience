const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    status: 'success' | 'failed' | 'abandoned';
    reference: string;
    amount: number;
    currency: string;
    channel: string;
    paid_at: string;
    customer: {
      email: string;
      first_name: string | null;
      last_name: string | null;
    };
    metadata: Record<string, unknown>;
  };
}

interface InitializePaymentParams {
  email: string;
  amount: number; // Amount in kobo (NGN * 100)
  reference: string;
  metadata?: Record<string, unknown>;
  subaccount?: string;
  transaction_charge?: number;
  callback_url?: string;
}

export async function initializePayment(
  params: InitializePaymentParams
): Promise<{ success: boolean; data?: PaystackInitializeResponse['data']; error?: string }> {
  // DEMO MODE: Skip actual payment for hackathon demo
  // In production, remove this block and use real Paystack integration
  const isDemoMode = !PAYSTACK_SECRET_KEY || PAYSTACK_SECRET_KEY === 'demo';
  
  if (isDemoMode) {
    // Return mock success response for demo
    return {
      success: true,
      data: {
        authorization_url: `${process.env.NEXT_PUBLIC_APP_URL}/demo-payment-success`,
        access_code: 'demo_access_code',
        reference: params.reference,
      },
    };
  }

  try {
    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: params.email,
        amount: params.amount,
        reference: params.reference,
        metadata: params.metadata,
        subaccount: params.subaccount,
        transaction_charge: params.transaction_charge,
        callback_url: params.callback_url || `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/verify`,
      }),
    });

    const result: PaystackInitializeResponse = await response.json();

    if (!result.status) {
      return { success: false, error: result.message };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('Paystack initialize error:', error);
    return { success: false, error: 'Payment initialization failed' };
  }
}

export async function verifyPayment(
  reference: string
): Promise<{ success: boolean; data?: PaystackVerifyResponse['data']; error?: string }> {
  try {
    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const result: PaystackVerifyResponse = await response.json();

    if (!result.status || result.data.status !== 'success') {
      return { success: false, error: result.message || 'Payment verification failed' };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('Paystack verify error:', error);
    return { success: false, error: 'Payment verification failed' };
  }
}

export function generatePaymentReference(prefix: string = 'CX'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function convertToKobo(nairaAmount: number): number {
  return Math.round(nairaAmount * 100);
}

export function convertFromKobo(koboAmount: number): number {
  return koboAmount / 100;
}

