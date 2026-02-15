import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ImportPage from '../app/import/page';
import EditorPage from '../app/editor/page';

const pushMock = vi.fn();
const replaceMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
    replace: replaceMock
  })
}));

describe('smoke', () => {
  it('import sample html and open editor flow', () => {
    localStorage.clear();
    pushMock.mockReset();
    replaceMock.mockReset();

    render(<ImportPage />);

    const openButton = screen.getByTestId('open-button');
    expect(openButton).toBeDisabled();

    fireEvent.click(screen.getByTestId('sample-button'));
    expect(openButton).not.toBeDisabled();

    fireEvent.click(openButton);

    expect(localStorage.getItem('email-editor-draft')).toContain('<!doctype html>');
    expect(pushMock).toHaveBeenCalledWith('/editor');

    render(<EditorPage />);

    expect(replaceMock).not.toHaveBeenCalled();
    expect(screen.getByTestId('draft-content')).toHaveTextContent('MailCraft');
  });

  it('redirects from editor when draft is missing', () => {
    localStorage.clear();
    replaceMock.mockReset();

    render(<EditorPage />);

    expect(replaceMock).toHaveBeenCalledWith('/import');
  });
});
