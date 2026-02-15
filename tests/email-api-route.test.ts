/* @vitest-environment node */

import { afterEach, describe, expect, it, vi } from 'vitest';

async function loadPost() {
  vi.resetModules();
  const route = await import('../app/api/email/test/route');
  return route.POST;
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('api/email/test route', () => {
  it('returns success response for valid request', async () => {
    const POST = await loadPost();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-15T10:15:30.000Z'));
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const request = new Request('http://localhost/api/email/test', {
      method: 'POST',
      body: JSON.stringify({
        to: 'user@example.com',
        subject: '[TEST] Podgląd maila',
        html: '<!doctype html><html><head><title>x</title></head><body>x</body></html>'
      })
    });

    const promise = POST(request);
    await vi.runAllTimersAsync();
    const response = await promise;

    expect(response.status).toBe(200);
    const json = (await response.json()) as { accepted: string[]; rejected: string[]; queuedAt: string };
    expect(json.accepted).toEqual(['user@example.com']);
    expect(json.rejected).toEqual([]);
    expect(json.queuedAt).toBe('2026-02-15T10:15:30.000Z');
  });

  it('returns INVALID_EMAIL for wrong email', async () => {
    const POST = await loadPost();

    const request = new Request('http://localhost/api/email/test', {
      method: 'POST',
      body: JSON.stringify({
        to: 'wrong-email',
        subject: 'x',
        html: '<p>x</p>'
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const json = (await response.json()) as { errorCode: string };
    expect(json.errorCode).toBe('INVALID_EMAIL');
  });

  it('returns RATE_LIMIT when requests are too frequent', async () => {
    const POST = await loadPost();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-15T10:00:00.000Z'));
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const first = new Request('http://localhost/api/email/test', {
      method: 'POST',
      body: JSON.stringify({
        to: 'user@example.com',
        subject: 'x',
        html: '<p>x</p>'
      })
    });

    const firstPromise = POST(first);
    await vi.runAllTimersAsync();
    await firstPromise;

    vi.setSystemTime(new Date('2026-02-15T10:00:01.000Z'));

    const second = new Request('http://localhost/api/email/test', {
      method: 'POST',
      body: JSON.stringify({
        to: 'user@example.com',
        subject: 'x',
        html: '<p>x</p>'
      })
    });

    const secondResponse = await POST(second);
    expect(secondResponse.status).toBe(429);
    const json = (await secondResponse.json()) as { errorCode: string };
    expect(json.errorCode).toBe('RATE_LIMIT');
  });
});
