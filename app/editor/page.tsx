'use client';

import React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { Draft, DraftMode, loadDraft, saveDraft } from '../../lib/draft-service';
import { EmailToken } from '../../lib/email-token-extension';
import { TAG_CATEGORIES, TAGS } from '../../lib/tag-service';
import {
  decorateTokensForWysiwyg,
  insertTokenAtSelection,
  stripTokenSpansFromWysiwyg
} from '../../lib/token-helpers';

export default function EditorPage() {
  const router = useRouter();
  const htmlTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const [isReady, setIsReady] = useState(false);
  const [mode, setMode] = useState<DraftMode>('wysiwyg');
  const [html, setHtml] = useState('');
  const [search, setSearch] = useState('');
  const [lastSavedDraft, setLastSavedDraft] = useState<Draft | null>(null);

  const editor = useEditor({
    extensions: [StarterKit, EmailToken],
    content: '',
    immediatelyRender: false,
    onUpdate: ({ editor: nextEditor }) => {
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

    setHtml(storedDraft.html);
    setMode(storedDraft.mode);
    setLastSavedDraft(storedDraft);
    setIsReady(true);
  }, [router]);

  useEffect(() => {
    if (!editor || !isReady) {
      return;
    }

    editor.commands.setContent(decorateTokensForWysiwyg(html), false);
  }, [editor, isReady]);

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
    if (editor) {
      setHtml(stripTokenSpansFromWysiwyg(editor.getHTML()));
    }

    setMode('html');
  };

  const switchToWysiwygMode = () => {
    if (editor) {
      editor.commands.setContent(decorateTokensForWysiwyg(html), false);
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
        <div className="toolbar-actions">
          <button type="button" onClick={saveNow} data-testid="manual-save-button">
            Zapisz szkic
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

      <div className="editor-layout">
        <aside className="tags-panel">
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
                    <li key={tag.key}>
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

        <section className="editor-panel" onDragOver={(event) => event.preventDefault()} onDrop={onDropToken}>
          {mode === 'wysiwyg' ? (
            <div className="wysiwyg-container" data-testid="wysiwyg-editor">
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
      </div>
    </main>
  );
}
