import { describe, expect, it, vi } from 'vitest';

import { sendTestEmail } from '../lib/email-api';

describe('email-api client', () => {
  it('returns parsed response on success', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          messageId: 'abc',
          accepted: ['user@example.com'],
          rejected: [],
          queuedAt: '2026-02-15T10:15:30.000Z'
        }),
        { status: 200 }
      )
    );

    const result = await sendTestEmail({
      to: 'user@example.com',
      subject: '[TEST] Podgląd maila',
      html: '<p>x</p>'
    });

    expect(result.messageId).toBe('abc');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('throws error payload on non-200 response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          errorCode: 'INVALID_EMAIL',
          message: 'Pole to niepoprawne'
        }),
        { status: 400 }
      )
    );

    await expect(
      sendTestEmail({
        to: 'bad',
        subject: 'x',
        html: '<p>x</p>'
      })
    ).rejects.toMatchObject({
      status: 400,
      errorCode: 'INVALID_EMAIL'
    });
  });
});
