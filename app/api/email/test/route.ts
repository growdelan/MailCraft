import { NextResponse } from 'next/server';

let lastRequestTimestamp = 0;

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function POST(request: Request) {
  let body: { to?: unknown; subject?: unknown; html?: unknown };

  try {
    body = (await request.json()) as { to?: unknown; subject?: unknown; html?: unknown };
  } catch {
    return NextResponse.json(
      {
        errorCode: 'SERVER_ERROR',
        message: 'Niepoprawne dane wejściowe.'
      },
      { status: 400 }
    );
  }

  const to = typeof body.to === 'string' ? body.to.trim() : '';
  const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
  const html = typeof body.html === 'string' ? body.html : '';

  if (!isValidEmail(to)) {
    return NextResponse.json(
      {
        errorCode: 'INVALID_EMAIL',
        message: 'Pole "to" musi zawierać poprawny adres e-mail.'
      },
      { status: 400 }
    );
  }

  if (!subject || !html) {
    return NextResponse.json(
      {
        errorCode: 'SERVER_ERROR',
        message: 'Brak wymaganych pól subject/html.'
      },
      { status: 400 }
    );
  }

  const now = Date.now();
  if (now - lastRequestTimestamp < 5000) {
    return NextResponse.json(
      {
        errorCode: 'RATE_LIMIT',
        message: 'Przekroczono limit testowych wysyłek.',
        details: {
          retryAfterMs: 5000 - (now - lastRequestTimestamp)
        }
      },
      { status: 429 }
    );
  }

  await sleep(700);

  if (Math.random() < 0.1) {
    lastRequestTimestamp = now;

    return NextResponse.json(
      {
        errorCode: 'SERVER_ERROR',
        message: 'Symulowany błąd serwera.'
      },
      { status: 500 }
    );
  }

  lastRequestTimestamp = now;

  return NextResponse.json({
    messageId: `mock-${now}`,
    accepted: [to],
    rejected: [],
    queuedAt: new Date(now).toISOString()
  });
}
