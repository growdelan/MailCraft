# Aktualny stan projektu

## Co działa
- Uruchomienie aplikacji przez `pnpm dev`.
- Routing przepływu: `/` -> `/import` -> `/editor`.
- Import HTML przez wklejenie treści oraz akcję „Wstaw przykładowy HTML”.
- Edytor z trybami `WYSIWYG` oraz `HTML source` i przełączaniem trybów.
- Panel tagów: 50 tokenów, kategorie, wyszukiwanie, klik-to-insert, copy, drag&drop.
- Wizualne wyróżnienie tokenów (`.ee-token`) w trybie WYSIWYG.
- Zapis draftu w `localStorage` (autosave 500 ms + zapis ręczny) i wskaźnik zapisano/niezapisano.
- Podgląd przez `iframe srcDoc` z blokadą skryptów i komunikatem o blokadzie.
- Presety urządzeń i zoom (`80/100/125`) w panelu podglądu.
- Warnings zależne od `client mode` (ogólne + reguły `outlook`, `gmail`, `strict`).
- Responsywny układ: 3 kolumny na desktop/tablet + mobilne zakładki `Edytor/Podgląd/Tagi`.

## Co jest skończone
- Milestone 0.5: Minimal end-to-end slice.
- Milestone 1.0: Editor Core + Tokens.
- Milestone 1.5: Preview + Warnings + Responsywność.
- Minimalna konfiguracja projektu Next.js + TypeScript + Vitest.
- Dokumentacja uruchomienia i testów w `README.md`.

## Co jest w trakcie
- Brak aktywnego milestone’u w statusie `in_progress`.

## Co jest następne
- Milestone 2.0: Send Test + Export + Domknięcie MVP.

## Blokery i ryzyka
- Brak blockerów krytycznych na ten moment.
- Ryzyko na kolejny etap: domknięcie kontraktu wysyłki testowej i obsługa błędów API w UX bez regresji bieżącego edytora.

## Ostatnie aktualizacje
- 2026-02-15: Zakończono Milestone 0.5 i oznaczono go jako `done` w `ROADMAP.md`.
- 2026-02-15: Zakończono Milestone 1.0 i oznaczono go jako `done` w `ROADMAP.md`.
- 2026-02-15: Zakończono Milestone 1.5 i oznaczono go jako `done` w `ROADMAP.md`.
