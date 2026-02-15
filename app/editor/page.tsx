'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const DRAFT_KEY = 'email-editor-draft';

export default function EditorPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<string | null>(null);

  useEffect(() => {
    const storedDraft = localStorage.getItem(DRAFT_KEY);

    if (!storedDraft) {
      router.replace('/import');
      return;
    }

    setDraft(storedDraft);
  }, [router]);

  if (!draft) {
    return <main>Przekierowanie...</main>;
  }

  return (
    <main>
      <h1>Editor</h1>
      <p>Minimalny widok milestone 0.5.</p>
      <pre data-testid="draft-content">{draft}</pre>
    </main>
  );
}
