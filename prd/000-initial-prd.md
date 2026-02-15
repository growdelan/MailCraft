# PRD — Edytor E-maili (MVP)

**Produkt:** Edytor E-maili (Email HTML Editor)  
**Cel:** Web app do importu i edycji pojedynczego HTML emaila z tokenami (placeholderami), live preview, heurystycznymi ostrzeżeniami i wysyłką testową przez API (mock w dev).  
**Stack:** React + Next.js (App Router) + TypeScript (strict) + shadcn/ui + Tailwind + TipTap + dnd-kit + Zustand (lub React Context) + Zod + React Hook Form.

## 1) Cele i zakres

### 1.1 Cele (MVP)
- **Single-template workflow**: edycja jednego maila na raz (bez listy szablonów).
- **Import**: wklejenie HTML lub upload `.html/.htm` → wejście do edytora.
- **Tagi (50)**: lista tokenów z wyszukiwaniem, kategoriami, klik-to-insert, copy-to-clipboard, drag&drop do edytora.
- **Edytor**: tryb WYSIWYG + tryb HTML source.
- **Live preview**: iframe `srcDoc`, presety urządzeń + zoom.
- **Send test**: modal wysyłki testowej przez `POST /api/email/test` (w dev mockowane).
- **Warnings**: heurystyczne ostrzeżenia (ogólne + zależne od client mode), nieblokujące.
- **Persist draft**: localStorage autosave (debounce) + manual “Zapisz szkic”.
- **Export**: pobranie `email.html`.

### 1.2 Poza zakresem (MVP)
- Zarządzanie biblioteką template’ów, wersjonowanie, historia zmian, współdzielenie.
- Autentykacja/użytkownicy.
- Serwerowa sanitacja/transformacje HTML (tylko bezpieczny preview; HTML nie jest “naprawiany”).
- Wysyłka produkcyjna (w MVP tylko dev-mock; kontrakt API udaje backend).

## 2) Użytkownicy i use-case

**Użytkownik:** osoba przygotowująca e-maile (marketing/obsługa klienta/płatności).  

**Główne scenariusze:**
1. Wkleja HTML / uploaduje plik → otwiera edytor.
2. Dodaje tokeny do treści (klik, drag&drop).
3. Przełącza WYSIWYG ↔ HTML.
4. Sprawdza podgląd w Gmail/Outlook i w różnych rozmiarach + zoom.
5. Czyta ostrzeżenia kompatybilności.
6. Wysyła test (mock) na wskazany adres.
7. Eksportuje finalny HTML.

## 3) Informacje architektoniczne

### 3.1 Struktura routingu (Next.js App Router)
- `/import` → ImportPage
- `/editor` → EditorPage (gdy brak draftu: redirect do `/import`)
- (opcjonalnie) `/api/email/test` → route handler (dev mock lub always mock w MVP)

### 3.2 Stan aplikacji (Draft)
Wspólny store (Zustand rekomendowane):
- `draft.html: string`
- `draft.mode: 'wysiwyg' | 'html'`
- `draft.updatedAt: number`
- `draft.subject?: string`
- `isDirty: boolean` (porównanie do ostatniego zapisu)
- `clientModeId: string`
- `devicePresetId: string`
- `zoom: 80 | 100 | 125`

### 3.3 Persist w localStorage
Klucz: `email-editor-draft`  
- autosave debounced **500ms**
- manual “Zapisz szkic”
- clear draft (np. przy “Nowy import” / wejściu na import)

## 4) Modele danych (TypeScript)

```ts
export type TagCategory = 'Personalizacja'|'Płatności'|'Sprawa'|'Linki'|'Meta';

export interface TagItem {
  key: string;
  label: string;
  category: TagCategory;
  token: string; // e.g. {{FirstName}}
}

export interface DevicePreset {
  id: string;
  label: string;
  width: number;
  height?: number;
  mode: 'fixed'|'email600';
}

export interface ClientMode {
  id: string;
  label: string;
  description?: string;
}

export interface Draft {
  html: string;
  mode: 'wysiwyg'|'html';
  updatedAt: number;
  subject?: string;
}

export interface SendTestRequest {
  to: string;
  subject: string;
  html: string;
}
export interface SendTestResponse {
  messageId: string;
  accepted: string[];
  rejected: string[];
  queuedAt: string; // ISO
}
export type SendTestErrorCode = 'INVALID_EMAIL' | 'RATE_LIMIT' | 'SERVER_ERROR';
export interface SendTestError {
  errorCode: SendTestErrorCode;
  message: string;
  details?: Record<string, unknown>;
}
```

## 5) Dane statyczne

### 5.1 Tagi placeholder (50)
Format tokenu: `{{TagName}}`. Kategoriami zarządza UI (accordion).  

Lista kluczy (dokładnie 50):  
FirstName, LastName, FullName, Email, Phone, CustomerId, CaseId, ContractNumber, InvoiceNumber,  
AmountDue, AmountPaid, Currency, DueDate, PaymentDate, InstallmentNumber, InstallmentAmount,  
TotalInstallments, DaysOverdue, InterestAmount, PenaltyAmount, Balance, PaymentLink, BLIKCode,  
BankAccountNumber, BankName, SupportPhone, SupportEmail, AgentName, AgentEmail, AgentPhone,  
CompanyName, CompanyAddress, City, PostalCode, Country, PreferredLanguage, GreetingLine, Signature,  
UnsubscribeLink, ViewInBrowserLink, PrivacyPolicyLink, TermsLink, TodayDate, NextPaymentDate,  
NextPaymentAmount, CaseStatus, SettlementProposal, DiscountPercent, DiscountDeadline, QRCodePayment

### 5.2 Presety urządzeń
- `email600`: Email 600px (mode email600, width 600)
- `mobile360`: Mobile 360×800 (fixed)
- `iphone390`: iPhone 390×844 (fixed)
- `tablet768`: Tablet 768×1024 (fixed)
- `desktop1280`: Desktop 1280×800 (fixed)

Zoom: 80, 100, 125 (transform scale; origin top center)

### 5.3 Client modes
- gmail: Gmail (Web)
- outlook: Outlook (Windows)
- apple: Apple Mail
- yahoo: Yahoo Mail
- strict: Strict / Sanitized  

Wpływ: **tylko label + styl ramki preview + warnings**, bez modyfikacji HTML.

## 6) Wymagania UI/UX

### 6.1 Design
- Clean, airy, jasne powierzchnie.
- Primary: niebieski, Success CTA: zielony, border: szary.
- CSS variables jako tokeny designu (globalnie), minimalne override’y.

**Design tokens (global CSS):**
- `--color-primary: #1F6FB2;`
- `--color-primary-hover: #185C93;`
- `--color-success: #26A65B;`
- `--color-success-hover: #1E8A4B;`
- `--color-bg: #F6F8FB;`
- `--color-surface: #FFFFFF;`
- `--color-text: #0F172A;`
- `--color-text-muted: #475569;`
- `--color-border: #D9E2EC;`
- `--color-danger: #E11D48;`
- `--radius: 12px;`
- `--shadow-sm: 0 2px 10px rgba(15, 23, 42, .06);`

### 6.2 ImportPage (`/import`)
Layout: card max 720, 2 kolumny desktop, stacked mobile.
- Title: “Edytor E-maili”
- Subtitle: “Wklej kod HTML lub wgraj plik i rozpocznij edycję.”

Lewo:
- textarea rows ~10, placeholder “Wklej tutaj kod HTML…”

Prawo:
- drag&drop upload + button “Wybierz plik”, accept `.html/.htm`

Dół:
- primary button “Otwórz w edytorze” (disabled jeśli brak HTML)
- link/button: “Wstaw przykładowy HTML” → wypełnia textarea

**Behavior:**
- upload czyta plik jako tekst i wstawia do textarea
- open: zapis draft + navigate `/editor`

**Sample HTML** musi zawierać:
- wrapper na tabelach
- header
- paragraf z `{{FirstName}}`
- primary button “Opłać teraz”
- footer z `{{CompanyName}}` i `{{UnsubscribeLink}}`

### 6.3 EditorPage (`/editor`)
Top toolbar (sticky):
- Left: nazwa + indicator zapisany/niezapisany
- Center: dropdowny: client mode, device preset, zoom
- Right: “Zapisz szkic”, “Eksportuj HTML”, zielony CTA “Wyślij test”

Responsywność:
- Desktop/tablet: 3 kolumny (Tags | Editor | Preview) z resizable splitterem (np. CSS grid + drag handle)
- Mobile ≤ 900px: TabView: “Edytor”, “Podgląd”, “Tagi” (toolbar zawsze na górze)

#### 6.3.1 Tags panel
- Search input “Szukaj tagu…”
- Accordion: kategorie
- Każdy tag: “chip row” + ikony: drag, copy

Interakcje:
- klik: insert token w aktualnym trybie edytora
- copy: kopiuje token do clipboard
- drag&drop do edytora: insert token w caret lub append jeśli caret nieznany

Drag visuals:
- `.ee-tag-item` cursor grab
- `.ee-drop-target` outline dashed

#### 6.3.2 Editor panel
- Toggle mode: `WYSIWYG` / `HTML source`
- Warnings strip (collapsible) z licznikiem i listą
- WYSIWYG: TipTap editor (basic toolbar)
- HTML: textarea monospace

**Wstawianie tokenów (wspólna metoda `insertToken(token)`):**
- jeśli mode == `html`: insert w textarea wg selectionStart/End
- jeśli mode == `wysiwyg`: insert w miejscu kursora TipTap, jako span `.ee-token` (inline node/mark)
  - fallback: append na koniec, jeśli brak selection

**Highlight style tokenów:**
CSS `.ee-token` zgodnie ze spec (chip-like, monospace, niebieski tint).  
Preferencja: token w WYSIWYG jako element trudny do przypadkowej edycji (np. inline node atom) — ale jeśli będzie problematyczne, dopuszczalne jest stylowanie bez blokady edycji.

#### 6.3.3 Preview panel
- iframe `srcDoc` renderuje aktualny HTML
- sandbox bez `allow-scripts`
- dodatkowo usuwanie `<script>` z HTML przed preview
- jeśli wykryto skrypty: banner “Skrypty są blokowane w podglądzie”
- shell:
  - `.ee-preview-shell`, `.ee-email-canvas`, `.ee-email-container`

Device sizing:
- email600: container width 600, height auto, scroll pionowy jeśli trzeba
- fixed: width/height wg presetu; scrollbars w środku jeśli overflow

Zoom: skala na containerze (origin top center)

**Performance:**
- debounce preview updates 150–200ms
- autosave debounce 500ms

## 7) Heurystyczne ostrzeżenia (WarningsService)

`getWarnings(html: string, clientModeId: string): string[]` — nieblokujące.

Ogólne:
- Missing `<title>`
- `<img>` bez `alt`
- Zawiera `<script>` (blocked)
- Podejrzane szerokości > 600 (string check: `width: 900`, `width="900"`, itp.)

Specyficzne:
- outlook: jeśli zawiera: `display:flex`, `position:fixed`, `background-image`, `vh`, `grid`
- gmail: `<style>` w body, `<link rel="stylesheet">`, selektory `:has`, `@layer` (contains checks)
- strict: forms, iframes, external CSS links, JS events `onload=` itp.

## 8) Send Test Email — kontrakt API

**POST** `/api/email/test`

Request:
```json
{ "to":"user@example.com", "subject":"[TEST] Podgląd maila", "html":"<!doctype html>..." }
```

Success response:
```json
{ "messageId":"abc123", "accepted":["user@example.com"], "rejected":[], "queuedAt":"2026-02-14T10:15:30.000Z" }
```

Error response:
```json
{ "errorCode":"INVALID_EMAIL|RATE_LIMIT|SERVER_ERROR", "message":"...", "details":{} }
```

Modal:
- `To` (required, email validation)
- `Subject` default `[TEST] Podgląd maila`
- spinner podczas wysyłki
- success toast, error view z HTTP status + message + details

## 9) Dev mock

MVP musi działać end-to-end bez backendu.

Implementacja (preferowana):
- Next.js route handler `/api/email/test` jako mock w dev
  - 700ms delay
  - 10% random failure
  - opcjonalny rate limit: jeśli wysyłka częściej niż np. 1/5s → RATE_LIMIT

## 10) Struktura projektu (proponowana)

```
app/
  layout.tsx
  page.tsx (redirect to /import)
  import/page.tsx
  editor/page.tsx
  api/email/test/route.ts (mock)
components/
  top-toolbar.tsx
  tags-panel.tsx
  email-editor.tsx
  email-preview.tsx
  send-test-dialog.tsx
  warnings-strip.tsx
lib/
  store.ts (zustand)
  draft-service.ts (localStorage)
  tag-service.ts (mock data)
  warnings-service.ts
  email-api.ts (client fetch wrapper)
  devices.ts
  client-modes.ts
  sample-html.ts
styles/
  globals.css (tokens + ee-* classes)
```

## 11) Kryteria akceptacji (Definition of Done)

1. `/import`: wklejenie HTML lub upload pliku działa; sample HTML działa; przycisk disabled bez HTML; po open przechodzi do `/editor`.
2. `/editor`: jeśli brak draftu → redirect do `/import`.
3. Tag list: 50 tagów, kategorie, search, klik insert, copy działa, drag&drop insert działa (lub append fallback).
4. Edytor: działa WYSIWYG (TipTap) i HTML source; przełączanie trybów zachowuje treść.
5. Tokeny w WYSIWYG są wizualnie wyróżnione `.ee-token`.
6. Preview: iframe srcDoc działa, sandbox bez skryptów, `<script>` usuwane; banner gdy wykryto skrypt.
7. Presety urządzeń i zoom działają zgodnie z opisem.
8. Warnings: generują się i są nieblokujące; zależą od client mode.
9. Autosave działa (debounce 500ms) + manual save; indicator saved/unsaved działa.
10. Export: pobiera `email.html` z aktualnym HTML.
11. Send test modal: walidacja email, wysyłka przez `/api/email/test` mock, toast success/error z detalami.

## 12) Ryzyka i uwagi implementacyjne

- Synchronizacja WYSIWYG ↔ HTML: TipTap operuje na dokumencie; MVP dopuszcza prostą strategię:
  - WYSIWYG edytuje “HTML-ish” (getHTML),
  - HTML mode edytuje surowy string,
  - przy przełączeniu: aktualny tryb zapisuje źródło do draft.html.
- Token jako inline node (atom) jest najlepszy dla stabilności (mniej przypadkowych edycji).
- Drag&drop do edytora: w MVP wystarczy drop na panel edytora (nie precyzyjnie w punkt), insert przy aktualnym selection.

