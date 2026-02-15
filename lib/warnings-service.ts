function containsAny(text: string, patterns: string[]): boolean {
  return patterns.some((pattern) => text.includes(pattern));
}

function hasTitleTag(html: string): boolean {
  if (typeof DOMParser !== 'undefined') {
    const parser = new DOMParser();
    const documentNode = parser.parseFromString(html, 'text/html');

    if (documentNode.querySelector('head title')) {
      return true;
    }

    const htmlTagExists = /<html\b/i.test(html) || /<!doctype/i.test(html);
    if (htmlTagExists) {
      return false;
    }
  }

  return /<title\b[^>]*>/i.test(html);
}

export function getWarnings(html: string, clientModeId: string): string[] {
  const normalizedHtml = html.toLowerCase();
  const warnings: string[] = [];

  if (!hasTitleTag(html)) {
    warnings.push('Brak znacznika <title>.');
  }

  if (/<img\b(?![^>]*\balt=)[^>]*>/i.test(html)) {
    warnings.push('Wykryto <img> bez atrybutu alt.');
  }

  if (normalizedHtml.includes('<script')) {
    warnings.push('Wykryto <script>; skrypty są blokowane w podglądzie.');
  }

  if (/width\s*[:=]\s*["']?(?:[6-9]\d\d|\d{4,})/i.test(html)) {
    warnings.push('Wykryto podejrzaną szerokość większą niż 600px.');
  }

  if (
    clientModeId === 'outlook' &&
    containsAny(normalizedHtml, ['display:flex', 'position:fixed', 'background-image', 'vh', 'grid'])
  ) {
    warnings.push('Outlook może mieć problemy z flex/fixed/background-image/vh/grid.');
  }

  if (clientModeId === 'gmail') {
    if (/<body[^>]*>[\s\S]*<style/i.test(html)) {
      warnings.push('Gmail może ignorować <style> umieszczone w body.');
    }

    if (/<link[^>]*rel=["']stylesheet["']/i.test(html)) {
      warnings.push('Gmail może blokować zewnętrzne arkusze stylów.');
    }

    if (containsAny(normalizedHtml, [':has', '@layer'])) {
      warnings.push('Gmail może nie wspierać :has lub @layer.');
    }
  }

  if (clientModeId === 'strict') {
    if (/<form\b/i.test(html)) {
      warnings.push('Tryb strict: formularze mogą zostać usunięte.');
    }

    if (/<iframe\b/i.test(html)) {
      warnings.push('Tryb strict: iframe może zostać usunięty.');
    }

    if (/<link[^>]*rel=["']stylesheet["']/i.test(html)) {
      warnings.push('Tryb strict: zewnętrzny CSS może zostać zablokowany.');
    }

    if (/\son[a-z]+\s*=\s*/i.test(html)) {
      warnings.push('Tryb strict: zdarzenia JS inline mogą zostać usunięte.');
    }
  }

  return warnings;
}
