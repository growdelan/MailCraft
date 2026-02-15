import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ImportPage from '../app/import/page';
import { loadDraft } from '../lib/draft-service';

const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
    replace: vi.fn()
  })
}));

afterEach(() => {
  cleanup();
});

describe('smoke', () => {
  it('import sample html and open editor flow', () => {
    localStorage.clear();
    pushMock.mockReset();

    render(<ImportPage />);

    const openButton = screen.getByTestId('open-button');
    expect(openButton).toBeDisabled();

    fireEvent.click(screen.getByTestId('sample-button'));
    expect(openButton).not.toBeDisabled();

    fireEvent.click(openButton);

    const stored = localStorage.getItem('email-editor-draft');
    expect(stored).not.toBeNull();

    const parsed = JSON.parse(stored ?? '{}') as { html?: string; mode?: string };
    expect(parsed.html).toContain('<!doctype html>');
    expect(parsed.mode).toBe('wysiwyg');
    expect(pushMock).toHaveBeenCalledWith('/editor');
  });

  it('draft service loads stored draft from json format', () => {
    localStorage.clear();
    localStorage.setItem(
      'email-editor-draft',
      JSON.stringify({
        html: '<p>abc</p>',
        mode: 'html',
        updatedAt: 10
      })
    );

    const draft = loadDraft();

    expect(draft).not.toBeNull();
    expect(draft?.html).toBe('<p>abc</p>');
    expect(draft?.mode).toBe('html');
  });

  it('draft service supports legacy plain string draft', () => {
    localStorage.clear();
    localStorage.setItem('email-editor-draft', '<p>legacy</p>');

    const draft = loadDraft();

    expect(draft).not.toBeNull();
    expect(draft?.html).toBe('<p>legacy</p>');
    expect(draft?.mode).toBe('wysiwyg');
  });

  it('loads html from dropped file into import textarea', async () => {
    render(<ImportPage />);

    const dropZone = screen.getByTestId('drop-zone');
    const htmlFile = new File(['<p>from-file</p>'], 'template.html', { type: 'text/html' });

    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [htmlFile]
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId('html-input')).toHaveValue('<p>from-file</p>');
    });

    expect(screen.getByTestId('open-button')).not.toBeDisabled();
  });

  it('shows validation error for non-html dropped file and keeps current input', async () => {
    render(<ImportPage />);

    fireEvent.change(screen.getByTestId('html-input'), { target: { value: '<p>keep</p>' } });

    const dropZone = screen.getByTestId('drop-zone');
    const invalidFile = new File(['not html'], 'notes.txt', { type: 'text/plain' });

    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [invalidFile]
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId('import-error')).toBeInTheDocument();
    });

    expect(screen.getByTestId('html-input')).toHaveValue('<p>keep</p>');
  });
});
