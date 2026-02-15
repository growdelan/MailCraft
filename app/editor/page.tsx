'use client';

import React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { CLIENT_MODES } from '../../lib/client-modes';
import { DEVICE_PRESETS, ZOOM_PRESETS, ZoomPreset } from '../../lib/devices';
import { Draft, DraftMode, loadDraft, saveDraft } from '../../lib/draft-service';
import { SendTestError, SendTestResponse, sendTestEmail } from '../../lib/email-api';
import { EmailToken } from '../../lib/email-token-extension';
import { getWysiwygContentFromSource, isStructuredEmailHtml } from '../../lib/html-sync-policy';
import { sanitizePreviewHtml } from '../../lib/preview-service';
import { TAG_CATEGORIES, TAGS } from '../../lib/tag-service';
import {
  decorateTokensForWysiwyg,
  insertTokenAtSelection,
  stripTokenSpansFromWysiwyg
} from '../../lib/token-helpers';
import { getWarnings } from '../../lib/warnings-service';

type MobileTab = 'editor' | 'preview' | 'tags';

export default function EditorPage() {
  const router = useRouter();
  const htmlTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const modeRef = useRef<DraftMode>('wysiwyg');
  const isStructuredHtmlRef = useRef(false);

  const [isReady, setIsReady] = useState(false);
  const [mode, setMode] = useState<DraftMode>('wysiwyg');
  const [html, setHtml] = useState('');
  const [search, setSearch] = useState('');
  const [lastSavedDraft, setLastSavedDraft] = useState<Draft | null>(null);
  const [clientModeId, setClientModeId] = useState('gmail');
  const [devicePresetId, setDevicePresetId] = useState('email600');
  const [zoom, setZoom] = useState<ZoomPreset>(100);
  const [mobileTab, setMobileTab] = useState<MobileTab>('editor');
  const [previewHtml, setPreviewHtml] = useState('');
  const [hasBlockedScripts, setHasBlockedScripts] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [testTo, setTestTo] = useState('');
  const [testSubject, setTestSubject] = useState('[TEST] Podgląd maila');
  const [testError, setTestError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<SendTestResponse | null>(null);
  const [isSending, setIsSending] = useState(false);
  const isStructuredHtml = useMemo(() => isStructuredEmailHtml(html), [html]);
  const isWysiwygSourceLocked = mode === 'wysiwyg' && isStructuredHtml;

  const editor = useEditor({
    extensions: [StarterKit, EmailToken],
    content: '',
    immediatelyRender: false,
    onUpdate: ({ editor: nextEditor }) => {
      if (modeRef.current !== 'wysiwyg' || isStructuredHtmlRef.current) {
        return;
      }

      const rawHtml = nextEditor.getHTML();
      setHtml(stripTokenSpansFromWysiwyg(rawHtml));
    }
  });

  useEffect(() => {
    const storedDraft = loadDraft();

    if (!storedDraft) {
      router.replace('/import');
      return;
    }

    modeRef.current = storedDraft.mode;
    isStructuredHtmlRef.current = isStructuredEmailHtml(storedDraft.html);
    setHtml(storedDraft.html);
    setMode(storedDraft.mode);
    setLastSavedDraft(storedDraft);
    setIsReady(true);
  }, [router]);

  useEffect(() => {
    if (!editor || !isReady) {
      return;
    }

    modeRef.current = mode;
    isStructuredHtmlRef.current = isStructuredEmailHtml(html);
    editor.commands.setContent(decorateTokensForWysiwyg(getWysiwygContentFromSource(html)), false);
  }, [editor, isReady]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    isStructuredHtmlRef.current = isStructuredHtml;
  }, [isStructuredHtml]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    editor.setEditable(!isWysiwygSourceLocked);
  }, [editor, isWysiwygSourceLocked]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const sanitized = sanitizePreviewHtml(html);
      setPreviewHtml(sanitized.html);
      setHasBlockedScripts(sanitized.hasBlockedScripts);
    }, 180);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [html]);

  const isDirty = useMemo(() => {
    if (!lastSavedDraft) {
      return false;
    }

    return lastSavedDraft.html !== html || lastSavedDraft.mode !== mode;
  }, [html, lastSavedDraft, mode]);

  useEffect(() => {
    if (!isReady || !isDirty) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const nextDraft: Draft = {
        html,
        mode,
        updatedAt: Date.now()
      };

      saveDraft(nextDraft);
      setLastSavedDraft(nextDraft);
    }, 500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [html, isDirty, isReady, mode]);

  const warnings = useMemo(() => {
    return getWarnings(html, clientModeId);
  }, [clientModeId, html]);

  const selectedClientMode = useMemo(() => {
    return CLIENT_MODES.find((item) => item.id === clientModeId) ?? CLIENT_MODES[0];
  }, [clientModeId]);

  const selectedDevice = useMemo(() => {
    return DEVICE_PRESETS.find((item) => item.id === devicePresetId) ?? DEVICE_PRESETS[0];
  }, [devicePresetId]);

  const filteredTags = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return TAGS;
    }

    return TAGS.filter((tag) => {
      return (
        tag.label.toLowerCase().includes(query) ||
        tag.key.toLowerCase().includes(query) ||
        tag.token.toLowerCase().includes(query)
      );
    });
  }, [search]);

  const tagsByCategory = useMemo(() => {
    return TAG_CATEGORIES.map((category) => ({
      category,
      items: filteredTags.filter((tag) => tag.category === category)
    }));
  }, [filteredTags]);

  const saveNow = () => {
    const nextDraft: Draft = {
      html,
      mode,
      updatedAt: Date.now()
    };

    saveDraft(nextDraft);
    setLastSavedDraft(nextDraft);
  };

  const exportHtml = () => {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = 'email.html';
    anchor.click();

    window.URL.revokeObjectURL(url);
  };

  const openSendModal = () => {
    setTestError(null);
    setTestResult(null);
    setIsSendModalOpen(true);
  };

  const closeSendModal = () => {
    if (isSending) {
      return;
    }

    setIsSendModalOpen(false);
  };

  const submitSendTest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = testTo.trim();
    const normalizedSubject = testSubject.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setTestError('Wprowadź poprawny adres e-mail.');
      return;
    }

    if (!normalizedSubject) {
      setTestError('Temat wiadomości jest wymagany.');
      return;
    }

    setIsSending(true);
    setTestError(null);
    setTestResult(null);

    try {
      const response = await sendTestEmail({
        to: normalizedEmail,
        subject: normalizedSubject,
        html
      });

      setTestResult(response);
    } catch (error) {
      const apiError = error as SendTestError & { status?: number };
      const errorMessage = apiError.message ?? 'Nie udało się wysłać wiadomości testowej.';
      const statusPart = apiError.status ? `HTTP ${apiError.status}: ` : '';
      const detailsPart =
        apiError.details && Object.keys(apiError.details).length > 0
          ? ` | details: ${JSON.stringify(apiError.details)}`
          : '';
      setTestError(`${statusPart}${errorMessage}${detailsPart}`);
    } finally {
      setIsSending(false);
    }
  };

  const insertToken = (token: string) => {
    if (mode === 'html') {
      const textArea = htmlTextAreaRef.current;

      if (!textArea) {
        setHtml((previousHtml) => `${previousHtml}${token}`);
        return;
      }

      const selectionStart = textArea.selectionStart ?? html.length;
      const selectionEnd = textArea.selectionEnd ?? html.length;

      const { nextCaret, nextHtml } = insertTokenAtSelection(html, token, selectionStart, selectionEnd);
      setHtml(nextHtml);

      window.requestAnimationFrame(() => {
        textArea.focus();
        textArea.setSelectionRange(nextCaret, nextCaret);
      });

      return;
    }

    if (isStructuredHtml) {
      return;
    }

    if (!editor) {
      setHtml((previousHtml) => `${previousHtml}${token}`);
      return;
    }

    editor.chain().focus().insertEmailToken(token).run();
  };

  const copyToken = async (token: string) => {
    if (!navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(token);
  };

  const onTagDragStart = (event: React.DragEvent<HTMLButtonElement>, token: string) => {
    event.dataTransfer.setData('text/plain', token);
    event.dataTransfer.effectAllowed = 'copy';
  };

  const onDropToken = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();

    const token = event.dataTransfer.getData('text/plain');

    if (!token) {
      return;
    }

    insertToken(token);
  };

  const switchToHtmlMode = () => {
    if (editor && !isStructuredHtml) {
      setHtml(stripTokenSpansFromWysiwyg(editor.getHTML()));
    }

    setMode('html');
  };

  const switchToWysiwygMode = () => {
    if (editor) {
      editor.commands.setContent(decorateTokensForWysiwyg(getWysiwygContentFromSource(html)), false);
    }

    setMode('wysiwyg');
  };

  if (!isReady) {
    return <main>Przekierowanie...</main>;
  }

  return (
    <main className="editor-page">
      <header className="toolbar">
        <div>
          <h1>Editor</h1>
          <p data-testid="save-indicator">{isDirty ? 'Niezapisany szkic' : 'Zapisano'}</p>
        </div>

        <div className="toolbar-selects">
          <label>
            Client mode
            <select value={clientModeId} onChange={(event) => setClientModeId(event.target.value)}>
              {CLIENT_MODES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Device
            <select value={devicePresetId} onChange={(event) => setDevicePresetId(event.target.value)}>
              {DEVICE_PRESETS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Zoom
            <select
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value) as ZoomPreset)}
              data-testid="zoom-select"
            >
              {ZOOM_PRESETS.map((value) => (
                <option key={value} value={value}>
                  {value}%
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="toolbar-actions">
          <button type="button" onClick={exportHtml} data-testid="export-button">
            Eksportuj HTML
          </button>
          <button type="button" onClick={saveNow} data-testid="manual-save-button">
            Zapisz szkic
          </button>
          <button type="button" onClick={openSendModal} data-testid="send-test-button">
            Wyślij test
          </button>
        </div>
      </header>

      <section className="mode-switch">
        <button
          type="button"
          className={mode === 'wysiwyg' ? 'active' : ''}
          onClick={switchToWysiwygMode}
          data-testid="mode-wysiwyg"
        >
          WYSIWYG
        </button>
        <button
          type="button"
          className={mode === 'html' ? 'active' : ''}
          onClick={switchToHtmlMode}
          data-testid="mode-html"
        >
          HTML source
        </button>
      </section>

      <section className="mobile-tabs">
        <button
          type="button"
          className={mobileTab === 'editor' ? 'active' : ''}
          onClick={() => setMobileTab('editor')}
        >
          Edytor
        </button>
        <button
          type="button"
          className={mobileTab === 'preview' ? 'active' : ''}
          onClick={() => setMobileTab('preview')}
        >
          Podgląd
        </button>
        <button type="button" className={mobileTab === 'tags' ? 'active' : ''} onClick={() => setMobileTab('tags')}>
          Tagi
        </button>
      </section>

      <div className="editor-layout">
        <aside className={`tags-panel panel ${mobileTab === 'tags' ? 'mobile-active' : ''}`}>
          <h2>Tagi</h2>
          <input
            type="search"
            placeholder="Szukaj tagu..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          {tagsByCategory.map(({ category, items }) => {
            if (items.length === 0) {
              return null;
            }

            return (
              <details key={category} open>
                <summary>{category}</summary>
                <ul>
                  {items.map((tag) => (
                    <li key={tag.key} className="ee-tag-item">
                      <span>{tag.token}</span>
                      <button
                        type="button"
                        draggable
                        onDragStart={(event) => onTagDragStart(event, tag.token)}
                        onClick={() => insertToken(tag.token)}
                      >
                        Wstaw
                      </button>
                      <button type="button" onClick={() => copyToken(tag.token)}>
                        Kopiuj
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            );
          })}
        </aside>

        <section
          className={`editor-panel panel ee-drop-target ${mobileTab === 'editor' ? 'mobile-active' : ''}`}
          onDragOver={(event) => event.preventDefault()}
          onDrop={onDropToken}
        >
          <details className="warnings-strip" open>
            <summary>Ostrzeżenia ({warnings.length})</summary>
            {warnings.length === 0 ? (
              <p>Brak ostrzeżeń dla trybu: {selectedClientMode.label}.</p>
            ) : (
              <ul>
                {warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            )}
          </details>

          {mode === 'wysiwyg' ? (
            <div className="wysiwyg-container" data-testid="wysiwyg-editor">
              {isWysiwygSourceLocked ? (
                <p className="preview-banner" data-testid="wysiwyg-lock-notice">
                  Ten szablon zawiera pełny HTML e-mail. Źródłem prawdy pozostaje tryb HTML source.
                </p>
              ) : null}
              <EditorContent editor={editor} />
            </div>
          ) : (
            <textarea
              ref={htmlTextAreaRef}
              value={html}
              data-testid="html-source"
              onChange={(event) => setHtml(event.target.value)}
            />
          )}
        </section>

        <section className={`preview-panel panel ${mobileTab === 'preview' ? 'mobile-active' : ''}`}>
          <h2>Podgląd</h2>
          <div className={`ee-preview-shell client-${clientModeId}`}>
            {hasBlockedScripts ? <p className="preview-banner">Skrypty są blokowane w podglądzie</p> : null}

            <div className="ee-email-canvas">
              <div className="preview-scale" style={{ transform: `scale(${zoom / 100})` }}>
                <div
                  className={`ee-email-container ${selectedDevice.mode}`}
                  style={{ width: selectedDevice.width, height: selectedDevice.height ?? 900 }}
                >
                  <iframe
                    title="email-preview"
                    srcDoc={previewHtml}
                    sandbox=""
                    data-testid="preview-iframe"
                    style={{ width: '100%', height: '100%', border: 0, background: '#fff' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {isSendModalOpen ? (
        <div className="modal-backdrop" data-testid="send-test-modal">
          <div className="modal-content">
            <h3>Wyślij test</h3>
            <form onSubmit={submitSendTest}>
              <label>
                To
                <input
                  type="email"
                  required
                  value={testTo}
                  onChange={(event) => setTestTo(event.target.value)}
                  placeholder="user@example.com"
                />
              </label>
              <label>
                Subject
                <input
                  type="text"
                  required
                  value={testSubject}
                  onChange={(event) => setTestSubject(event.target.value)}
                />
              </label>

              {testError ? <p className="modal-error">{testError}</p> : null}
              {testResult ? (
                <p className="modal-success">
                  Wysłano test. Message ID: <strong>{testResult.messageId}</strong>
                </p>
              ) : null}

              <div className="modal-actions">
                <button type="submit" disabled={isSending}>
                  {isSending ? 'Wysyłanie...' : 'Wyślij'}
                </button>
                <button type="button" onClick={closeSendModal} disabled={isSending}>
                  Zamknij
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}
