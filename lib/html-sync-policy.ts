const STRUCTURED_EMAIL_HTML_PATTERN = /<!doctype|<html\b|<head\b|<body\b/i;

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

export function mergeWysiwygContentIntoSource(sourceHtml: string, bodyHtml: string): string {
  if (!isStructuredEmailHtml(sourceHtml)) {
    return bodyHtml;
  }

  if (typeof DOMParser === 'undefined' || typeof XMLSerializer === 'undefined') {
    return sourceHtml;
  }

  const parser = new DOMParser();
  const sourceDocument = parser.parseFromString(sourceHtml, 'text/html');
  const updatedBodyDocument = parser.parseFromString(`<body>${bodyHtml}</body>`, 'text/html');

  const sourceLeafElements = collectLeafTextElements(sourceDocument.body);
  const updatedLeafElements = collectLeafTextElements(updatedBodyDocument.body);

  if (sourceLeafElements.length > 0 && sourceLeafElements.length === updatedLeafElements.length) {
    for (let index = 0; index < sourceLeafElements.length; index += 1) {
      sourceLeafElements[index].textContent = updatedLeafElements[index].textContent;
    }

    return serializeDocument(sourceDocument);
  }

  const sourceTextNodes = collectMeaningfulTextNodes(sourceDocument.body);
  const updatedTextNodes = collectMeaningfulTextNodes(updatedBodyDocument.body);

  if (sourceTextNodes.length === 0 || sourceTextNodes.length !== updatedTextNodes.length) {
    return sourceHtml;
  }

  for (let index = 0; index < sourceTextNodes.length; index += 1) {
    sourceTextNodes[index].nodeValue = updatedTextNodes[index].nodeValue;
  }

  return serializeDocument(sourceDocument);
}

function collectMeaningfulTextNodes(root: HTMLElement): Text[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let current = walker.nextNode();

  while (current) {
    const textNode = current as Text;
    const parentTag = textNode.parentElement?.tagName.toLowerCase() ?? '';
    const isIgnoredParent = parentTag === 'script' || parentTag === 'style';
    const hasMeaningfulText = /\S/.test(textNode.nodeValue ?? '');

    if (!isIgnoredParent && hasMeaningfulText) {
      nodes.push(textNode);
    }

    current = walker.nextNode();
  }

  return nodes;
}

function collectLeafTextElements(root: HTMLElement): HTMLElement[] {
  const elements = Array.from(root.querySelectorAll<HTMLElement>('*'));

  return elements.filter((element) => {
    const tag = element.tagName.toLowerCase();
    if (tag === 'script' || tag === 'style') {
      return false;
    }

    if (!/\S/.test(element.textContent ?? '')) {
      return false;
    }

    const hasChildElements = element.querySelector('*') !== null;
    return !hasChildElements;
  });
}

function serializeDocument(documentNode: Document): string {
  const serializer = new XMLSerializer();
  const doctype = documentNode.doctype
    ? `<!DOCTYPE ${documentNode.doctype.name}${
        documentNode.doctype.publicId ? ` PUBLIC "${documentNode.doctype.publicId}"` : ''
      }${documentNode.doctype.systemId ? ` "${documentNode.doctype.systemId}"` : ''}>`
    : '';

  return `${doctype}${serializer.serializeToString(documentNode.documentElement)}`;
}
