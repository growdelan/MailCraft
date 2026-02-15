export interface ClientMode {
  id: string;
  label: string;
}

export const CLIENT_MODES: ClientMode[] = [
  { id: 'gmail', label: 'Gmail (Web)' },
  { id: 'outlook', label: 'Outlook (Windows)' },
  { id: 'apple', label: 'Apple Mail' },
  { id: 'yahoo', label: 'Yahoo Mail' },
  { id: 'strict', label: 'Strict / Sanitized' }
];
