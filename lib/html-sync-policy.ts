const STRUCTURED_EMAIL_HTML_PATTERN = /<!doctype|<html\b|<head\b|<body\b|<table\b/i;

export function isStructuredEmailHtml(html: string): boolean {
  return STRUCTURED_EMAIL_HTML_PATTERN.test(html);
}

export function getWysiwygContentFromSource(html: string): string {
  if (!isStructuredEmailHtml(html)) {
    return html;
  }

  if (typeof DOMParser === 'undefined') {
    return html;
  }

  const parser = new DOMParser();
  const documentNode = parser.parseFromString(html, 'text/html');
  const bodyHtml = documentNode.body?.innerHTML?.trim();

  return bodyHtml && bodyHtml.length > 0 ? bodyHtml : html;
}
