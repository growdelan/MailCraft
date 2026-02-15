# Aktualny stan projektu

## Co działa
- Uruchomienie aplikacji przez `pnpm dev`.
- Routing minimalnego przepływu: `/` -> `/import` -> `/editor`.
- Import HTML przez wklejenie treści oraz akcję „Wstaw przykładowy HTML”.
- Edytor z trybami `WYSIWYG` oraz `HTML source` i przełączaniem trybów.
- Panel tagów: 50 tokenów, kategorie, wyszukiwanie, klik-to-insert, copy, drag&drop.
- Wizualne wyróżnienie tokenów (`.ee-token`) w trybie WYSIWYG.
- Zapis draftu w `localStorage` (autosave 500 ms + zapis ręczny) i wskaźnik zapisano/niezapisano.
- Redirect z `/editor` do `/import`, gdy draft nie istnieje.
- Smoke testy dla przepływu importu i warstwy draft service.

## Co jest skończone
- Milestone 0.5: Minimal end-to-end slice.
- Milestone 1.0: Editor Core + Tokens.
- Integracja TipTap i minimalnej konfiguracji edytora tokenów.
- Minimalna konfiguracja projektu Next.js + TypeScript + Vitest.
- Dokumentacja uruchomienia i testów w `README.md`.

## Co jest w trakcie
- Brak aktywnego milestone’u w statusie `in_progress`.

## Co jest następne
- Milestone 1.5: Preview + Warnings + Responsywność.

## Blokery i ryzyka
- Brak blockerów krytycznych na ten moment.
- Ryzyko techniczne na kolejny etap: zachowanie responsywności przy docelowym układzie paneli i live preview.

## Ostatnie aktualizacje
- 2026-02-15: Zakończono Milestone 0.5 i oznaczono go jako `done` w `ROADMAP.md`.
- 2026-02-15: Zakończono Milestone 1.0 i oznaczono go jako `done` w `ROADMAP.md`.
