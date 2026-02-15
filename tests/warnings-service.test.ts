import { describe, expect, it } from 'vitest';

import { sanitizePreviewHtml } from '../lib/preview-service';
import { getWarnings } from '../lib/warnings-service';

describe('warnings-service', () => {
  it('returns general warnings for title, img alt and script', () => {
    const html = '<html><body><img src="x.png"><script>alert(1)</script></body></html>';

    const warnings = getWarnings(html, 'gmail');

    expect(warnings.some((item) => item.includes('<title>'))).toBe(true);
    expect(warnings.some((item) => item.includes('alt'))).toBe(true);
    expect(warnings.some((item) => item.includes('<script>'))).toBe(true);
  });

  it('returns outlook-specific warning when unsupported styles are detected', () => {
    const html = '<html><head><title>x</title></head><body><div style="display:flex">x</div></body></html>';

    const warnings = getWarnings(html, 'outlook');

    expect(warnings.some((item) => item.includes('Outlook'))).toBe(true);
  });

  it('returns strict warnings for form, iframe and inline events', () => {
    const html = '<html><head><title>x</title></head><body><form></form><iframe></iframe><div onload="x"></div></body></html>';

    const warnings = getWarnings(html, 'strict');

    expect(warnings.some((item) => item.includes('formularze'))).toBe(true);
    expect(warnings.some((item) => item.includes('iframe'))).toBe(true);
    expect(warnings.some((item) => item.includes('JS inline'))).toBe(true);
  });

  it('does not return missing title warning when title exists in full html document', () => {
    const html =
      '<!doctype html><html><head><meta charset="UTF-8"><title>Przypomnienie</title></head><body><p>Treść</p></body></html>';

    const warnings = getWarnings(html, 'gmail');

    expect(warnings.some((item) => item.includes('<title>'))).toBe(false);
  });

  it('returns missing title warning for full html document without title', () => {
    const html = '<!doctype html><html><head><meta charset="UTF-8"></head><body><p>Treść</p></body></html>';

    const warnings = getWarnings(html, 'gmail');

    expect(warnings.some((item) => item.includes('<title>'))).toBe(true);
  });
});

describe('preview-service', () => {
  it('removes script tags and marks blocked scripts', () => {
    const html = '<p>A</p><script>alert(1)</script><p>B</p>';
    const result = sanitizePreviewHtml(html);

    expect(result.html).toBe('<p>A</p><p>B</p>');
    expect(result.hasBlockedScripts).toBe(true);
  });
});
