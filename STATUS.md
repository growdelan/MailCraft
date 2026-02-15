# Aktualny stan projektu

## Co działa
- Uruchomienie aplikacji przez `pnpm dev`.
- Routing minimalnego przepływu: `/` -> `/import` -> `/editor`.
- Import HTML przez wklejenie treści oraz akcję „Wstaw przykładowy HTML”.
- Zapis draftu w `localStorage` i odczyt draftu na ekranie edytora.
- Redirect z `/editor` do `/import`, gdy draft nie istnieje.
- Smoke testy dla przepływu import -> editor oraz redirectu przy braku draftu.

## Co jest skończone
- Milestone 0.5: Minimal end-to-end slice.
- Minimalna konfiguracja projektu Next.js + TypeScript + Vitest.
- Dokumentacja uruchomienia i testów w `README.md`.

## Co jest w trakcie
- Brak aktywnego milestone’u w statusie `in_progress`.

## Co jest następne
- Milestone 1.0: Editor Core + Tokens (tryby WYSIWYG/HTML source, panel tagów, insert/copy/drag&drop, zapis draftu zgodnie z roadmapą).

## Blokery i ryzyka
- Brak blockerów krytycznych na ten moment.
- Ryzyko techniczne na kolejny etap: synchronizacja WYSIWYG <-> HTML source bez utraty treści.

## Ostatnie aktualizacje
- 2026-02-15: Zakończono Milestone 0.5 i oznaczono go jako `done` w `ROADMAP.md`.
