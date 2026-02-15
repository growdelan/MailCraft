const SCRIPT_TAG_PATTERN = /<script\b[^>]*>[\s\S]*?<\/script>/gi;
const SCRIPT_DETECT_PATTERN = /<script\b[^>]*>[\s\S]*?<\/script>/i;

export function sanitizePreviewHtml(html: string): { html: string; hasBlockedScripts: boolean } {
  const sanitizedHtml = html.replace(SCRIPT_TAG_PATTERN, '');

  return {
    html: sanitizedHtml,
    hasBlockedScripts: SCRIPT_DETECT_PATTERN.test(html)
  };
}
