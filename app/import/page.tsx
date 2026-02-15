'use client';

import React from 'react';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { createDraft, saveDraft } from '../../lib/draft-service';

const SAMPLE_HTML = `<!doctype html>
<html>
  <head><title>Sample</title></head>
  <body>
    <table role="presentation" width="100%"><tr><td>
      <h1>MailCraft</h1>
      <p>Cześć {{FirstName}}, to przykładowy mail.</p>
    </td></tr></table>
  </body>
</html>`;

export default function ImportPage() {
  const router = useRouter();
  const [html, setHtml] = useState('');
  const isDisabled = useMemo(() => html.trim().length === 0, [html]);

  const openEditor = () => {
    if (isDisabled) {
      return;
    }

    saveDraft(createDraft(html));
    router.push('/editor');
  };

  return (
    <main>
      <h1>Edytor E-maili</h1>
      <p>Wklej kod HTML lub użyj przykładowego szablonu.</p>
      <label htmlFor="html-input">HTML</label>
      <textarea
        id="html-input"
        data-testid="html-input"
        placeholder="Wklej tutaj kod HTML..."
        value={html}
        onChange={(event) => setHtml(event.target.value)}
      />
      <div>
        <button type="button" data-testid="sample-button" onClick={() => setHtml(SAMPLE_HTML)}>
          Wstaw przykładowy HTML
        </button>
        <button type="button" data-testid="open-button" disabled={isDisabled} onClick={openEditor}>
          Otwórz w edytorze
        </button>
      </div>
    </main>
  );
}
