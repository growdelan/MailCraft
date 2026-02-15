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

---

## Milestone 3.5: Import Dual Input — UI + Walidacja (done)

Cel:
- dodać drugą, równorzędną metodę importu HTML na `/import` obok wklejania kodu
- umożliwić szybkie załadowanie lokalnego pliku `.html/.htm` przez drag&drop
- zachować prosty i czytelny UX dla obu metod wejścia

Definition of Done:
- ekran `/import` zawiera pole wklejania HTML oraz osobny panel drag&drop
- drop poprawnego pliku `.html/.htm` wczytuje treść do importu
- drop niepoprawnego pliku pokazuje błąd bez nadpisania aktualnej zawartości importu
- istniejący przepływ wklejania kodu działa bez regresji

Zakres:
- implementacja komponentu/panelu drag&drop na `/import`
- odczyt pojedynczego pliku HTML po stronie klienta
- walidacja rozszerzenia/typu pliku i komunikaty błędów
- integracja wyniku importu z istniejącym stanem draftu

---

## Milestone 4.0: Import Dual Input — Domknięcie przepływu i testy (planned)

Cel:
- domknąć przepływ importu dla dwóch wejść aż do przejścia do `/editor`
- zapewnić przewidywalne zachowanie po imporcie pliku i po imporcie przez wklejenie
- potwierdzić stabilność funkcji testami smoke/regresji

Definition of Done:
- po imporcie przez drag&drop użytkownik może od razu przejść do `/editor` na tym samym draftcie
- oba wejścia importu (wklejenie i drag&drop) zapisują draft w spójny sposób
- smoke testy pokrywają oba scenariusze importu
- testy lokalne przechodzą

Zakres:
- doprecyzowanie akcji „Otwórz w edytorze” dla obu metod wejścia
- obsługa stanów granicznych (pusty plik, błędny plik, ponowny drop)
- aktualizacja i rozszerzenie testów smoke/regresji importu
- dopięcie komunikatów użytkownika po udanym i nieudanym imporcie pliku

---

## Milestone 4.5: Premium UI Foundation (done)

Cel:
- zdefiniować spójny kierunek wizualny premium SaaS dla całej aplikacji
- wdrożyć bazowe tokeny i style globalne (gradient, glass, blur, cienie, radius)
- poprawić odbiór wizualny bez zmiany logiki funkcjonalnej

Definition of Done:
- globalny motyw UI zawiera gradient lawenda -> błękit i podstawowe tokeny premium
- panele/karty kluczowych widoków używają stylu glassmorphism
- podstawowe komponenty interakcyjne (button/input/tabs/toolbar) mają spójne stany hover/focus/disabled
- istniejące funkcje i przepływy działają bez regresji

Zakres:
- aktualizacja warstwy stylów globalnych i zmiennych UI
- wprowadzenie szklistego wyglądu kart i paneli
- dopasowanie stylów podstawowych komponentów kontrolnych
- zachowanie responsywności i czytelności interfejsu

---

## Milestone 5.0: Premium UI Polish + Consistency (done)

Cel:
- domknąć spójność wizualną premium na `/import` i `/editor`
- dopracować szczegóły estetyczne oraz mikrointerakcje UI
- zapewnić wysoki poziom czytelności i użyteczności po redesignie

Definition of Done:
- oba główne widoki (`/import`, `/editor`) mają jednolity, nowoczesny styl premium
- sekcje ostrzeżeń, preview shell, panele i akcje toolbaru są wizualnie spójne
- UI zachowuje czytelność na desktopie i mobile
- testy lokalne przechodzą i nie występują regresje funkcjonalne

Zakres:
- ujednolicenie finalnych stylów między ekranami
- dopracowanie detali wizualnych (spacing, kontrast, hierarchy, subtle motion)
- korekty stanów komponentów w kontekście dostępności i czytelności
- finalna weryfikacja regresji funkcjonalnych po odświeżeniu UI
