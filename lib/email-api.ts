export interface SendTestRequest {
  to: string;
  subject: string;
  html: string;
}

export interface SendTestResponse {
  messageId: string;
  accepted: string[];
  rejected: string[];
  queuedAt: string;
}

export interface SendTestError {
  errorCode: 'INVALID_EMAIL' | 'RATE_LIMIT' | 'SERVER_ERROR';
  message: string;
  details?: Record<string, unknown>;
}

export async function sendTestEmail(payload: SendTestRequest): Promise<SendTestResponse> {
  const response = await fetch('/api/email/test', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = (await response.json()) as SendTestError;
    throw {
      status: response.status,
      ...errorBody
    };
  }

  return (await response.json()) as SendTestResponse;
}
