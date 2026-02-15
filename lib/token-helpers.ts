const TOKEN_PATTERN = /\{\{[A-Za-z0-9]+\}\}/g;
const TOKEN_SPAN_PATTERN = /<span[^>]*data-ee-token=(?:"([^"]+)"|'([^']+)')[^>]*>.*?<\/span>/g;

export function decorateTokensForWysiwyg(html: string): string {
  return html.replace(TOKEN_PATTERN, (token) => {
    return `<span data-ee-token="${token}" class="ee-token">${token}</span>`;
  });
}

export function stripTokenSpansFromWysiwyg(html: string): string {
  return html.replace(TOKEN_SPAN_PATTERN, (_fullMatch, doubleQuotedToken, singleQuotedToken) => {
    return (doubleQuotedToken ?? singleQuotedToken ?? '').toString();
  });
}

export function insertTokenAtSelection(html: string, token: string, start: number, end: number): {
  nextHtml: string;
  nextCaret: number;
} {
  const normalizedStart = Number.isInteger(start) ? start : html.length;
  const normalizedEnd = Number.isInteger(end) ? end : html.length;

  const nextHtml = `${html.slice(0, normalizedStart)}${token}${html.slice(normalizedEnd)}`;

  return {
    nextHtml,
    nextCaret: normalizedStart + token.length
  };
}
