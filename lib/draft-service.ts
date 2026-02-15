export const DRAFT_KEY = 'email-editor-draft';

export type DraftMode = 'wysiwyg' | 'html';

export interface Draft {
  html: string;
  mode: DraftMode;
  updatedAt: number;
}

export function createDraft(html: string): Draft {
  return {
    html,
    mode: 'wysiwyg',
    updatedAt: Date.now()
  };
}

export function loadDraft(): Draft | null {
  const rawDraft = localStorage.getItem(DRAFT_KEY);

  if (!rawDraft) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawDraft) as Partial<Draft>;

    if (typeof parsed?.html === 'string' && (parsed.mode === 'wysiwyg' || parsed.mode === 'html')) {
      return {
        html: parsed.html,
        mode: parsed.mode,
        updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : Date.now()
      };
    }
  } catch {
    return {
      html: rawDraft,
      mode: 'wysiwyg',
      updatedAt: Date.now()
    };
  }

  return null;
}

export function saveDraft(draft: Draft): void {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}
