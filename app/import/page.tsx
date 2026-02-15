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
  const [importError, setImportError] = useState<string | null>(null);
  const [isDropActive, setIsDropActive] = useState(false);
  const isDisabled = useMemo(() => html.trim().length === 0, [html]);

  const validateFile = (file: File): boolean => {
    const hasHtmlExtension = /\.(html?|HTML?)$/.test(file.name);
    const hasHtmlMime = file.type === 'text/html';
    return hasHtmlExtension || hasHtmlMime;
  };

  const loadHtmlFromFile = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    if (files.length > 1) {
      setImportError('Obsługiwany jest tylko jeden plik HTML na raz.');
      return;
    }

    const file = files[0];
    if (!validateFile(file)) {
      setImportError('Niepoprawny typ pliku. Wybierz plik .html lub .htm.');
      return;
    }

    try {
      const content = await readFileAsText(file);
      setHtml(content);
      setImportError(null);
    } catch {
      setImportError('Nie udało się odczytać pliku HTML.');
    }
  };

  const openEditor = () => {
    if (isDisabled) {
      return;
    }

    saveDraft(createDraft(html));
    router.push('/editor');
  };

  return (
    <main className="import-page">
      <header className="import-hero">
        <h1>Edytor E-maili</h1>
        <p>Wklej kod HTML lub użyj przykładowego szablonu.</p>
      </header>

      <section className="import-grid">
        <article className="import-card">
          <h2>Kod HTML</h2>
          <label htmlFor="html-input">Wklej treść szablonu</label>
          <textarea
            id="html-input"
            data-testid="html-input"
            placeholder="Wklej tutaj kod HTML..."
            value={html}
            onChange={(event) => setHtml(event.target.value)}
          />
        </article>

        <article className="import-card">
          <h2>Plik HTML</h2>
          <p className="import-card-copy">Przeciągnij plik z dysku, aby szybko rozpocząć edycję.</p>
          <div
            className={`drop-zone ${isDropActive ? 'is-active' : ''}`}
            data-testid="drop-zone"
            onDragOver={(event) => {
              event.preventDefault();
              setIsDropActive(true);
            }}
            onDragLeave={() => setIsDropActive(false)}
            onDrop={async (event) => {
              event.preventDefault();
              setIsDropActive(false);
              await loadHtmlFromFile(event.dataTransfer.files);
            }}
          >
            Przeciągnij plik `.html` lub `.htm` i upuść tutaj.
          </div>
          {importError ? (
            <p data-testid="import-error" role="alert">
              {importError}
            </p>
          ) : null}
        </article>
      </section>

      <div className="import-actions">
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

function readFileAsText(file: File): Promise<string> {
  if (typeof file.text === 'function') {
    return file.text();
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read_error'));
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.readAsText(file);
  });
}
