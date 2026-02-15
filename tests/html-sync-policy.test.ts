import { describe, expect, it } from 'vitest';

import {
  getWysiwygContentFromSource,
  isStructuredEmailHtml,
  mergeWysiwygContentIntoSource
} from '../lib/html-sync-policy';

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

  it('merges wysiwyg text content into structured html without removing head/title', () => {
    const source =
      '<!doctype html><html><head><title>Przypomnienie</title></head><body><p>Old one</p><p>Old two</p></body></html>';
    const nextBody = '<p>New one</p><p>New two</p>';

    const merged = mergeWysiwygContentIntoSource(source, nextBody);

    expect(merged).toContain('<head><title>Przypomnienie</title></head>');
    expect(merged).toContain('<body><p>New one</p><p>New two</p></body>');
  });

  it('keeps source html unchanged when text mapping is ambiguous', () => {
    const source =
      '<!doctype html><html><head><title>Przypomnienie</title></head><body><table><tr><td>Old</td></tr></table></body></html>';
    const nextBody = '<p>Only one node</p><p>Extra node</p>';

    const merged = mergeWysiwygContentIntoSource(source, nextBody);

    expect(merged).toContain('<table><tr><td>Old</td></tr></table>');
    expect(merged).toContain('<head><title>Przypomnienie</title></head>');
  });

  it('updates structured source by leaf text mapping for live wysiwyg changes', () => {
    const source = `
      <!doctype html>
      <html>
        <head><title>Przypomnienie</title></head>
        <body>
          <table role="presentation">
            <tr><td><h1>MailCraft Demo</h1></td></tr>
            <tr><td><p>Cześć {{FirstName}},</p><p>To jest test.</p><a href="{{PaymentLink}}">Opłać teraz</a></td></tr>
          </table>
        </body>
      </html>
    `;
    const updatedBody = `
      <h1>MailCraft Demo</h1>
      <p>Cześć {{LastName}},</p>
      <p>To jest test.</p>
      <a href="{{PaymentLink}}">Opłać teraz</a>
    `;

    const merged = mergeWysiwygContentIntoSource(source, updatedBody);

    expect(merged).toContain('Cześć {{LastName}},');
    expect(merged).toContain('<a href="{{PaymentLink}}">Opłać teraz</a>');
    expect(merged).toContain('<head><title>Przypomnienie</title></head>');
    expect(merged).toContain('<table role="presentation">');
  });
});
