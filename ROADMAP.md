# Roadmapa (milestones)

## Statusy milestone’ów
Dozwolone statusy:
- planned
- in_progress
- done
- blocked

---

## Milestone 0.5: Minimal end-to-end slice (done)

Cel:
- aplikacja uruchamia się i prowadzi użytkownika do rozpoczęcia pracy nad draftem
- działa minimalny przepływ importu HTML do wejścia w edytor
- istnieje bazowy szkielet UI dla dalszych etapów MVP

Definition of Done:
- aplikację da się uruchomić jednym poleceniem (opisanym w README.md)
- istnieje co najmniej jeden smoke test
- testy przechodzą lokalnie
- import przez wklejenie lub sample HTML przechodzi do `/editor`
- redirect z pustego `/editor` do `/import` działa

Zakres:
- routing aplikacji i podstawowy layout stron `/import` oraz `/editor`
- minimalny stan draftu i przekazanie HTML między ekranami
- podstawowa walidacja wejścia importu (brak pustego otwarcia)
- smoke test dla najkrótszego przepływu startowego

---

## Milestone 1.0: Editor Core + Tokens (done)

Cel:
- dostarczenie pełnego rdzenia edytora w dwóch trybach (WYSIWYG i HTML source)
- umożliwienie pracy na 50 tagach personalizacji
- zapewnienie zapisu draftu lokalnie

Definition of Done:
- działa przełączanie trybów edycji bez utraty treści
- panel tagów obsługuje wyszukiwanie, kategorie, klik-to-insert, copy i drag&drop
- tokeny są wizualnie wyróżnione w trybie WYSIWYG
- autosave (debounce) i ręczny zapis szkicu działają

Zakres:
- integracja TipTap i trybu HTML source
- implementacja wspólnej logiki `insertToken` dla obu trybów
- dane statyczne tagów (50) oraz kategorie w panelu tagów
- persist draftu przez localStorage z mechanizmem isDirty/saved indicator

Uwagi:
- TODO: PRD nie określa priorytetu między pełną blokadą edycji tokenu a wersją uproszczoną; przyjąć wariant MVP zgodny z kryteriami akceptacji.

---

## Milestone 1.5: Preview + Warnings + Responsywność (done)

Cel:
- dostarczenie wiarygodnego podglądu maila dla kluczowych presetów i trybów klienta
- wdrożenie heurystycznych ostrzeżeń kompatybilności
- zapewnienie używalności układu na desktopie i mobile

Definition of Done:
- preview iframe renderuje aktualny HTML i blokuje skrypty
- device presets i zoom działają zgodnie z PRD
- warnings generują się zależnie od client mode i są nieblokujące
- układ 3-kolumnowy oraz mobilny TabView działają zgodnie z założeniami

Zakres:
- implementacja panelu preview z bezpiecznym renderingiem `srcDoc`
- obsługa client modes, device presets i zoom
- implementacja `WarningsService` (ogólne + specyficzne reguły)
- responsywny układ edytora z toolbar i sekcjami roboczymi

Uwagi:
- TODO: PRD nie precyzuje metody pomiaru jakości ostrzeżeń (np. precision/recall), tylko ich zakres heurystyczny.

---

## Milestone 2.0: Send Test + Export + Domknięcie MVP (done)

Cel:
- zamknięcie pełnego przepływu MVP od importu do testowej wysyłki i eksportu
- dostarczenie spójnego doświadczenia walidacji, komunikatów i obsługi błędów
- przygotowanie projektu do stabilnego użycia lokalnego bez backendu produkcyjnego

Definition of Done:
- modal „Wyślij test” waliduje dane i obsługuje success/error response
- endpoint `/api/email/test` działa jako mock zgodny z kontraktem PRD
- eksport pobiera aktualny HTML jako `email.html`
- kryteria akceptacji MVP z PRD są spełnione i testy przechodzą lokalnie

Zakres:
- implementacja mock route handlera dla testowej wysyłki
- integracja formularza wysyłki testowej i prezentacji błędów
- implementacja eksportu HTML i finalnych akcji toolbaru
- domknięcie testów smoke/regresji dla kluczowego przepływu

Uwagi:
- TODO: PRD nie określa docelowego poziomu pokrycia testami, jedynie konieczność przejścia kryteriów akceptacji.

---

## Milestone 2.5: HTML Rendering Parity — Stabilizacja podglądu (done)

Cel:
- przywrócenie spójności między importowanym HTML a panelem preview
- usunięcie widocznej degradacji layoutu mailowego po przejściu przez edytor
- zwiększenie wiarygodności podglądu jako źródła decyzji przed eksportem/wysyłką testową

Definition of Done:
- dla referencyjnego HTML mailowego podgląd zachowuje kluczowe elementy wizualne (nagłówek, treść, CTA, stopka)
- przełączanie `WYSIWYG` ↔ `HTML source` nie degraduje kluczowego layoutu/stylów maila
- tokeny `{{...}}` pozostają poprawne semantycznie i nie psują renderowania preview
- testy regresyjne dla przepływu import -> edycja -> preview przechodzą lokalnie

Zakres:
- doprecyzowanie i wdrożenie zasad synchronizacji HTML między trybami edycji
- stabilizacja renderowania mailowych tabel i inline styles w podglądzie
- zabezpieczenie obsługi tokenów w treści i atrybutach pod kątem poprawności renderowania
- uzupełnienie testów smoke/regresji dla scenariuszy z referencyjnym HTML

---

## Milestone 3.0: Dokument HTML i warning parity (done)

Cel:
- domknięcie zgodności między pełnym dokumentem HTML a mechanizmem ostrzeżeń
- wyeliminowanie fałszywych alertów wynikających z transformacji pośrednich
- utrzymanie bezpieczeństwa preview przy jednoczesnym zachowaniu informacji dokumentu

Definition of Done:
- ostrzeżenie o braku `<title>` nie występuje, gdy `<title>` istnieje w źródłowym HTML
- mechanizm warnings bazuje na reprezentacji HTML zgodnej z aktualnym draftem użytkownika
- istnieje udokumentowane rozstrzygnięcie konfliktu WYSIWYG vs pełny dokument HTML (`<html>/<head>/<body>`)
- testy walidujące warning parity przechodzą lokalnie

Zakres:
- doprecyzowanie kontraktu wejściowego dla warnings względem źródłowego HTML draftu
- implementacja i weryfikacja reguł warnings dla metadanych dokumentu
- utrzymanie bezpiecznego preview bez regresji w blokadzie skryptów
- aktualizacja dokumentacji projektowej po rozstrzygnięciu konfliktu
