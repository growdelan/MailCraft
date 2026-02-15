# AGENTS.md — Zasady nadrzędne
- Komunikacja wyłącznie po polsku.  
- Ten plik definiuje nadrzędne zasady projektu.  
- Hierarchia ważności: `AGENTS.md` → `spec.md` → `ROADMAP.md` → `STATUS.md`.  
- W przypadku niejasności doprecyzuj w dokumentacji, nie zgaduj w kodzie.

## Środowisko i Uruchamianie
- Runtime: **Node.js (LTS)**. Menedżer pakietów: **pnpm** (preferowany).  
- Instalacja: `pnpm install`.  
- Uruchamianie (dev): `pnpm dev` (Next.js App Router).  
- Build: `pnpm build` ; start: `pnpm start`.  
- Komendy uruchomienia muszą być w `README.md`.  
- Zależności: `pnpm add <pakiet>`; każda nowa musi być uzasadniona w `spec.md` (sekcja *Decyzje techniczne*).  
- UI: **shadcn/ui + Tailwind**. Edytor: **TipTap**. DnD: **dnd-kit**.  
- Lint/format: ESLint + Prettier (jeśli skonfigurowane w repo — przestrzegaj).

## Styl i Konwencje
- TypeScript **strict**. Nie wyciszaj błędów `any` bez uzasadnienia.  
- Indentacja: 2 spacje (standard JS/TS).  
- Nazwy:
  - komponenty: `PascalCase` (np. `EmailPreview.tsx`)
  - pliki/route’y: zgodnie z Next.js (`app/import/page.tsx`, itd.)
  - funkcje/zmienne: `camelCase`
  - typy/interfejsy: `PascalCase`
- Kod prosty, bez „magii”; komentarze tylko przy nieoczywistej logice.  
- Refaktory tylko w ramach aktualnego milestone’u.

## Testowanie
- Jednostkowe/UI: **Vitest** + **React Testing Library** (preferowane).  
- E2E (opcjonalnie w MVP): **Playwright**.  
- Każdy milestone musi przechodzić testy.  
- **Smoke testy:** bez zewnętrznego IO (sieć poza lokalnym `/api`, realne SMTP itp.), używaj mocków; sprawdzają start i kluczowy przepływ end-to-end:
  - import HTML → editor → wstaw token → preview → export → send test (mock).

## Struktura Repozytorium
- App: `app/` (Next.js App Router).  
- Komponenty: `components/`.  
- Logika/usługi/stor’y: `lib/` (np. store Zustand, draft-service, warnings-service, email-api).  
- Style: `styles/` lub `app/globals.css` (zgodnie z repo).  
- Testy: `tests/` lub kolokacja `__tests__/` (zgodnie z repo – trzymaj jeden standard).  
- Dozwolone pliki główne: `README.md`, `AGENTS.md`, `spec.md`, `ROADMAP.md`, `STATUS.md`, pliki konfiguracyjne.

## Konfiguracja i Sekrety
- Nie przechowuj sekretów w repo.  
- Używaj zmiennych środowiskowych i dokumentuj je w `README.md`.  
- Brak kluczy domyślnych i fallbacków.  
- W MVP endpoint testowy jest mockowany (dev) zgodnie z PRD; nie wymagaj realnych kluczy SMTP.

## Commity i Pull Requesty
- Styl: *Conventional Commits* (`feat:`, `fix:`, `test:` itd.).  
- Każdy commit = jeden logiczny krok, testy muszą przejść.  
- PR: porównaj z `main`, opisz zmiany, powód i testy.  
- Jeśli dostępne narzędzie `git-diff-narrator`, użyj go.

## Architektura
- Obejmuje strukturę katalogów, routing, stan aplikacji, logikę domenową, dane i API.  
- Nie zmieniaj architektury bez wyraźnej potrzeby.  
- Zmiany opisuj i uzasadniaj w `spec.md` przed wdrożeniem.  
- Źródłem prawdy dla wymagań MVP jest PRD (historycznie) oraz `spec.md` (bieżące decyzje).

## Źródła prawdy
- Główne źródło: `spec.md` (decyzje, zakres, architektura).  
- Roadmapa: `ROADMAP.md`; stan projektu: `STATUS.md`.  
- W konflikcie kod ↔ dokumentacja — wygrywa dokumentacja.

## PRD
- Pliki PRD w katalogu `prd/`; są niemutowalne i służą jako kontekst historyczny.  
- Po aktualizacji `spec.md` lub `ROADMAP.md` → PRD traci pierwszeństwo.  
- W konflikcie zawsze wygrywa `spec.md`.

