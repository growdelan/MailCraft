const TOKEN_PATTERN = /\{\{[A-Za-z0-9]+\}\}/g;

export function decorateTokensForWysiwyg(html: string): string {
  if (typeof window === 'undefined') {
    return html;
  }

  const parser = new DOMParser();
  const documentNode = parser.parseFromString(html, 'text/html');
  const walker = documentNode.createTreeWalker(documentNode.body, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];

  let currentNode = walker.nextNode();
  while (currentNode) {
    textNodes.push(currentNode as Text);
    currentNode = walker.nextNode();
  }

  textNodes.forEach((textNode) => {
    const textValue = textNode.nodeValue ?? '';
    const matches = textValue.match(TOKEN_PATTERN);

    if (!matches) {
      return;
    }

    const fragment = documentNode.createDocumentFragment();
    let cursor = 0;
    const localPattern = /\{\{[A-Za-z0-9]+\}\}/g;
    let tokenMatch = localPattern.exec(textValue);

    while (tokenMatch) {
      const token = tokenMatch[0];
      const start = tokenMatch.index;

      if (start > cursor) {
        fragment.appendChild(documentNode.createTextNode(textValue.slice(cursor, start)));
      }

      const tokenNode = documentNode.createElement('span');
      tokenNode.setAttribute('data-ee-token', token);
      tokenNode.setAttribute('class', 'ee-token');
      tokenNode.textContent = token;
      fragment.appendChild(tokenNode);

      cursor = start + token.length;
      tokenMatch = localPattern.exec(textValue);
    }

    if (cursor < textValue.length) {
      fragment.appendChild(documentNode.createTextNode(textValue.slice(cursor)));
    }

    textNode.parentNode?.replaceChild(fragment, textNode);
  });

  return documentNode.body.innerHTML;
}

export function stripTokenSpansFromWysiwyg(html: string): string {
  if (typeof window === 'undefined') {
    return html;
  }

  const parser = new DOMParser();
  const documentNode = parser.parseFromString(html, 'text/html');
  const tokenNodes = documentNode.querySelectorAll('span[data-ee-token]');

  tokenNodes.forEach((tokenNode) => {
    const token = tokenNode.getAttribute('data-ee-token') ?? tokenNode.textContent ?? '';
    tokenNode.replaceWith(documentNode.createTextNode(token));
  });

  return documentNode.body.innerHTML;
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
