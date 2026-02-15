# Specyfikacja techniczna

## Cel
Krótki opis celu aplikacji:
- jaki problem rozwiązuje
- dla kogo
- w jakim zakresie (co jest poza zakresem)

MailCraft rozwiązuje problem ręcznej i rozproszonej pracy nad pojedynczym szablonem e-mail HTML, łącząc import, edycję, podgląd kompatybilności i wysyłkę testową w jednej aplikacji webowej.

Docelowym użytkownikiem jest osoba przygotowująca komunikację e-mail (np. marketing, obsługa klienta, płatności), która potrzebuje szybko modyfikować treść i tokeny personalizacji bez pełnego systemu zarządzania kampaniami.

Zakres MVP obejmuje workflow jednego szablonu na raz, edycję w trybach WYSIWYG/HTML, podgląd na presetach urządzeń, heurystyczne ostrzeżenia oraz testową wysyłkę przez mockowane API.

Poza zakresem MVP pozostają: biblioteka szablonów, wersjonowanie/historia, współdzielenie, autentykacja użytkowników, produkcyjna wysyłka oraz serwerowe „naprawianie” HTML.

---

## Zakres funkcjonalny (high-level)
Opis funkcjonalności na wysokim poziomie:
- kluczowe use-case’i
- główne przepływy użytkownika
- czego aplikacja **nie** robi

Bez wchodzenia w szczegóły implementacyjne.

Kluczowe use-case’y:
- import HTML przez wklejenie lub upload pliku
- edycja treści maila i wstawianie tokenów personalizacji
- przełączanie między edycją wizualną i kodem HTML
- podgląd rezultatu w różnych trybach klienta poczty i urządzeniach
- wysyłka testowa maila przez endpoint aplikacyjny
- eksport gotowego HTML i zapis szkicu lokalnie

Główne przepływy użytkownika:
- wejście przez ekran importu, przygotowanie draftu i przejście do edytora
- praca iteracyjna: edycja + podgląd + ostrzeżenia + zapis
- finalizacja: testowa wysyłka lub eksport pliku

Aplikacja nie realizuje:
- zarządzania wieloma szablonami i ich cyklem życia
- integracji z produkcyjną infrastrukturą e-mail
- logowania i ról użytkowników
- serwerowej transformacji HTML poza bezpiecznym podglądem
- walidacji kompatybilności gwarantującej poprawne renderowanie w każdym kliencie (ostrzeżenia są heurystyczne i nieblokujące)

---

## Architektura i przepływ danych
Opis architektury na poziomie koncepcyjnym.

1. Główne komponenty systemu
2. Przepływ danych między komponentami
3. Granice odpowiedzialności

1. Główne komponenty systemu
- warstwa routingu aplikacji (`/import`, `/editor`, endpoint testowy API)
- ekran importu do utworzenia szkicu
- ekran edytora z trzema obszarami: tagi, edytor, podgląd
- warstwa stanu draftu i preferencji podglądu
- serwisy domenowe: ostrzeżenia, dane tagów/presetów, eksport, wywołanie API testowego

2. Przepływ danych między komponentami
- użytkownik dostarcza HTML na `/import`, który staje się aktywnym szkicem
- edytor aktualizuje centralny stan szkicu przy zmianach treści i trybu
- panel tagów i akcje toolbaru modyfikują ten sam stan draftu
- preview renderuje aktualny HTML ze stanu, z zastosowaniem polityki bezpiecznego podglądu
- warnings są wyliczane na podstawie HTML i wybranego trybu klienta
- wysyłka testowa używa bieżącego HTML i metadanych formularza

3. Granice odpowiedzialności
- UI odpowiada za interakcje użytkownika i prezentację
- store odpowiada za spójny stan roboczy draftu oraz preferencje widoku
- serwisy domenowe odpowiadają za logikę biznesową (warnings, eksport, persist, API client)
- endpoint testowy odpowiada za kontrakt odpowiedzi do testowej wysyłki w środowisku MVP
- localStorage odpowiada za lokalną trwałość szkicu, bez synchronizacji wieloużytkownikowej

---

## Komponenty techniczne
Lista kluczowych komponentów technicznych i ich odpowiedzialności.

- Next.js App Router: routing ekranów import/edytor oraz lokalny endpoint API do wysyłki testowej.
- React + TypeScript (strict): budowa interfejsu i modelowanie typów domenowych.
- Store stanu aplikacji (Zustand lub równoważny kontekst): utrzymanie draftu i ustawień podglądu.
- TipTap: edycja WYSIWYG treści maila.
- Tryb HTML source: bezpośrednia edycja surowego kodu HTML.
- Panel tagów: przeglądanie, wyszukiwanie i wstawianie tokenów personalizacji.
- Preview iframe: bezpieczny podgląd aktualnego HTML na presetach urządzeń i zoomie.
- WarningsService: heurystyczna analiza kompatybilności i jakości HTML.
- Draft service (localStorage): autosave/manual save i odtwarzanie szkicu.
- Email API client + mock route: obsługa testowej wysyłki i standaryzacja odpowiedzi.
- Warstwa UI (shadcn/ui + Tailwind): spójne komponenty i stylowanie aplikacji.

---

## Decyzje techniczne
Jawne decyzje techniczne wraz z uzasadnieniem.

Każda decyzja powinna zawierać:
- Decyzja:
- Uzasadnienie:
- Konsekwencje:

1.
- Decyzja: Aplikacja jest realizowana jako web app w React + Next.js (App Router) z TypeScript w trybie strict.
- Uzasadnienie: PRD wskazuje ten stack jako bazę MVP i wymaga przejrzystego routingu oraz bezpiecznego modelowania danych.
- Konsekwencje: Jeden spójny runtime frontend/API mock, mniejsza liczba decyzji infrastrukturalnych w MVP.

2.
- Decyzja: UI budowane z shadcn/ui i Tailwind CSS.
- Uzasadnienie: PRD definiuje ten zestaw jako docelowy dla szybkiego dostarczenia spójnego interfejsu.
- Konsekwencje: Przyspieszenie implementacji i łatwiejsze utrzymanie wzorców wizualnych.

3.
- Decyzja: Edytor wizualny oparty o TipTap oraz równoległy tryb edycji HTML source.
- Uzasadnienie: PRD wymaga dwóch trybów pracy nad tym samym draftem.
- Konsekwencje: Konieczna synchronizacja treści między trybami i jasne zasady przełączania.

4.
- Decyzja: Stan roboczy draftu utrzymywany we wspólnym store (preferowany Zustand).
- Uzasadnienie: PRD definiuje współdzielony stan między panelem tagów, edytorem, preview i toolbar.
- Konsekwencje: Centralizacja logiki stanu i prostsza koordynacja przepływów użytkownika.

5.
- Decyzja: Persist draftu realizowany lokalnie przez localStorage (autosave + zapis ręczny).
- Uzasadnienie: MVP ma działać end-to-end bez backendu i bez systemu kont użytkowników.
- Konsekwencje: Brak synchronizacji między urządzeniami/użytkownikami, ale pełna niezależność od usług zewnętrznych.

6.
- Decyzja: Wysyłka testowa przez kontrakt `POST /api/email/test` z mockiem deweloperskim.
- Uzasadnienie: PRD wymaga przepływu testowej wysyłki bez integracji produkcyjnej.
- Konsekwencje: Możliwe testowanie UX i obsługi błędów bez realnych kluczy SMTP.

7.
- Decyzja: Walidacja formularza i kontraktów danych wspierana przez Zod i React Hook Form.
- Uzasadnienie: PRD jawnie wskazuje te biblioteki w stacku MVP.
- Konsekwencje: Spójniejsze walidacje wejścia i prostsza obsługa błędów formularzy.

8.
- Decyzja: W Milestone 0.5 import ograniczamy do wklejenia HTML i akcji „Wstaw przykładowy HTML” (bez uploadu pliku).
- Uzasadnienie: ROADMAP dla 0.5 wymaga minimalnego przepływu importu do `/editor`; upload nie jest wymagany na tym etapie.
- Konsekwencje: Najkrótsza ścieżka end-to-end jest dostępna od razu, a upload zostaje na kolejne milestone’y.

---

## Jakość i kryteria akceptacji
Wspólne wymagania jakościowe dla całego projektu.

- Aplikacja musi przechodzić pełny przepływ MVP: import → edycja → podgląd → eksport/wysyłka testowa.
- Edytor musi zachowywać spójność treści między trybem WYSIWYG i HTML source.
- Ostrzeżenia kompatybilności mają charakter informacyjny i nie blokują pracy użytkownika.
- Podgląd musi działać w bezpiecznym trybie (blokada skryptów) i odzwierciedlać bieżący stan draftu.
- Trwałość szkicu musi działać lokalnie (autosave + zapis ręczny) oraz poprawnie odtwarzać stan.
- Funkcje eksportu i wysyłki testowej muszą działać z aktualną wersją HTML draftu.
- MVP musi działać lokalnie bez zależności od produkcyjnego backendu.
- TODO: Brak w PRD docelowych mierników niefunkcjonalnych (np. limity czasu odpowiedzi UI/API, budżety wydajnościowe).

---

## Zasady zmian i ewolucji
- zmiany funkcjonalne → aktualizacja `ROADMAP.md`
- zmiany architektoniczne → aktualizacja tej specyfikacji
- nowe zależności → wpis do `## Decyzje techniczne`
- refactory tylko w ramach aktualnego milestone’u

---

## Powiązanie z roadmapą
- Szczegóły milestone’ów i ich statusy znajdują się w `ROADMAP.md`.

Specyfikacja definiuje docelowy zakres MVP i decyzje techniczne, a roadmapa rozkłada ten zakres na kolejne kroki dostarczania.

---

## Status specyfikacji
- Data utworzenia:
- Ostatnia aktualizacja:
- Aktualny zakres obowiązywania:
- Data utworzenia: TODO (brak daty źródłowej w PRD i repo)
- Ostatnia aktualizacja: 2026-02-15
- Aktualny zakres obowiązywania: MVP Edytora E-maili opisany w `prd/000-initial-prd.md`
