import { describe, expect, it } from 'vitest';

import { getWysiwygContentFromSource, isStructuredEmailHtml } from '../lib/html-sync-policy';

describe('html-sync-policy', () => {
  it('detects structured email html documents', () => {
    const fullHtml = '<!doctype html><html><head><title>x</title></head><body><table><tr><td>x</td></tr></table></body></html>';
    const simpleHtml = '<p>Hello {{FirstName}}</p>';

    expect(isStructuredEmailHtml(fullHtml)).toBe(true);
    expect(isStructuredEmailHtml(simpleHtml)).toBe(false);
  });

  it('extracts body content for wysiwyg from structured html', () => {
    const fullHtml =
      '<!doctype html><html><head><title>x</title></head><body><table role="presentation"><tr><td>Hello</td></tr></table></body></html>';

    const content = getWysiwygContentFromSource(fullHtml);

    expect(content).toContain('<table role="presentation">');
    expect(content).not.toContain('<head>');
    expect(content).not.toContain('<title>');
  });

  it('returns raw html for non-structured fragments', () => {
    const fragment = '<p>A</p><p>B</p>';
    expect(getWysiwygContentFromSource(fragment)).toBe(fragment);
  });
});
