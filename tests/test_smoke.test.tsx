import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ImportPage from '../app/import/page';
import { loadDraft } from '../lib/draft-service';

const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
    replace: vi.fn()
  })
}));

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
});
