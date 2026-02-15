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
