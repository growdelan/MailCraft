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
- Eksport aktualnego HTML do pliku `email.html`.
- Modal „Wyślij test” z walidacją e-mail i obsługą success/error.
- Mock endpoint `POST /api/email/test` z opóźnieniem, rate limit i losowym błędem serwera.
- Testy kontraktu API oraz klienta wysyłki testowej.
- Dla pełnego HTML e-mail podgląd zachowuje kluczowy layout i inline style (nagłówek, treść, CTA, stopka).
- Dla pełnych szablonów HTML źródłowy dokument (`head/title/body`) pozostaje spójny, a podgląd i warnings bazują na aktualnym draftcie.
- WYSIWYG pozostaje edytowalny dla pełnego HTML; zmiany treści są synchronizowane live do preview bez niszczenia struktury maila.
- Warning `<title>` nie pojawia się, jeśli `<title>` istnieje w źródłowym dokumencie HTML.
- Import na `/import` działa dwiema metodami: wklejenie kodu i drag&drop pliku `.html/.htm`.
- Dla drag&drop działa walidacja pojedynczego pliku HTML oraz komunikaty błędów bez nadpisywania aktualnej treści importu.
- Globalna warstwa UI ma foundation premium SaaS: gradient lawenda -> błękit, szkliste powierzchnie i subtelny blur.
- Podstawowe komponenty interakcyjne (`button`, `input`, `select`, `textarea`, panele, toolbar, modal) mają spójne stany hover/focus/disabled.
- Widok `/import` jest wizualnie spójny z nowym foundation (`import-page`, panel drop-zone, sekcja akcji).
- Widok `/editor` i panel tagów mają domknięty polish premium UI; układ pozycji tagu jest stabilny (nazwa tagu nad przyciskami akcji), bez rozjeżdżania na węższych szerokościach.

## Co jest skończone
- Milestone 0.5: Minimal end-to-end slice.
- Milestone 1.0: Editor Core + Tokens.
- Milestone 1.5: Preview + Warnings + Responsywność.
- Milestone 2.0: Send Test + Export + Domknięcie MVP.
- Milestone 2.5: HTML Rendering Parity — Stabilizacja podglądu.
- Milestone 3.0: Dokument HTML i warning parity.
- Milestone 3.5: Import Dual Input — UI + Walidacja.
- Milestone 4.5: Premium UI Foundation.
- Milestone 5.0: Premium UI Polish + Consistency.
- Minimalna konfiguracja projektu Next.js + TypeScript + Vitest.
- Dokumentacja uruchomienia i testów w `README.md`.

## Co jest w trakcie
- Brak aktywnego milestone’u w statusie `in_progress`.

## Co jest następne
- TODO: Brak kolejnego milestone’u w `ROADMAP.md` po 5.0. Należy zdefiniować następny etap.

## Blokery i ryzyka
- Brak blockerów krytycznych na ten moment.
- Ryzyko utrzymaniowe: mock API i heurystyki preview/warnings wymagają dopasowania przy przejściu na backend produkcyjny.
- Ryzyko UX/UI: przy dalszym polishu trzeba utrzymać balans efektów glass/blur, żeby nie pogorszyć czytelności.

## Ostatnie aktualizacje
- 2026-02-15: Zakończono Milestone 0.5 i oznaczono go jako `done` w `ROADMAP.md`.
- 2026-02-15: Zakończono Milestone 1.0 i oznaczono go jako `done` w `ROADMAP.md`.
- 2026-02-15: Zakończono Milestone 1.5 i oznaczono go jako `done` w `ROADMAP.md`.
- 2026-02-15: Zakończono Milestone 2.0 i oznaczono go jako `done` w `ROADMAP.md`.
- 2026-02-15: Zakończono Milestone 2.5 i oznaczono go jako `done` w `ROADMAP.md`.
- 2026-02-15: Zakończono Milestone 3.0 i oznaczono go jako `done` w `ROADMAP.md`.
- 2026-02-15: Zakończono Milestone 3.5 i oznaczono go jako `done` w `ROADMAP.md`.
- 2026-02-15: Zakończono Milestone 4.5 i oznaczono go jako `done` w `ROADMAP.md`.
- 2026-02-15: Zakończono Milestone 5.0 i oznaczono go jako `done` w `ROADMAP.md`.
