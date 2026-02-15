# Specyfikacja techniczna

## Cel
Krótki opis celu aplikacji:
- jaki problem rozwiązuje
- dla kogo
- w jakim zakresie (co jest poza zakresem)

MailCraft rozwiązuje problem ręcznej i rozproszonej pracy nad pojedynczym szablonem e-mail HTML, łącząc import, edycję, podgląd kompatybilności i wysyłkę testową w jednej aplikacji webowej.

Docelowym użytkownikiem jest osoba przygotowująca komunikację e-mail (np. marketing, obsługa klienta, płatności), która potrzebuje szybko modyfikować treść i tokeny personalizacji bez pełnego systemu zarządzania kampaniami.

Zakres MVP obejmuje workflow jednego szablonu na raz, edycję w trybach WYSIWYG/HTML, podgląd na presetach urządzeń, heurystyczne ostrzeżenia oraz testową wysyłkę przez mockowane API.

Zakres rozszerzony po PRD `001-html-preview-rendering-parity-prd.md` obejmuje także spójność renderowania importowanego HTML między źródłem użytkownika, edytorem i panelem podglądu.
Zakres rozszerzony po PRD `002-import-dual-input-dragdrop-prd.md` obejmuje dwa równorzędne wejścia importu na `/import`: wklejenie kodu HTML oraz drag&drop pliku `.html/.htm`.
Zakres rozszerzony po PRD `003-premium-saas-ui-refresh-prd.md` obejmuje odświeżenie warstwy wizualnej aplikacji w stylu premium SaaS (glassmorphism + gradient lawenda -> błękit) bez zmiany logiki funkcjonalnej.

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
- import HTML przez dedykowany obszar drag&drop pliku `.html/.htm` na ekranie `/import`
- edycja treści maila i wstawianie tokenów personalizacji
- przełączanie między edycją wizualną i kodem HTML
- podgląd rezultatu w różnych trybach klienta poczty i urządzeniach
- zachowanie spójności renderowania layoutu/stylów maila między importem i preview
- spójny, nowoczesny i premium wygląd UI na stronach `/import` i `/editor`
- wysyłka testowa maila przez endpoint aplikacyjny
- eksport gotowego HTML i zapis szkicu lokalnie

Główne przepływy użytkownika:
- wejście przez ekran importu, przygotowanie draftu (wklejenie albo drag&drop pliku) i przejście do edytora
- praca iteracyjna: edycja + podgląd + ostrzeżenia + zapis
- weryfikacja zgodności widoku preview z importowanym HTML (w tym tokeny i kluczowe style)
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
- ekran importu do utworzenia szkicu (textarea + panel drag&drop pliku HTML)
- ekran edytora z trzema obszarami: tagi, edytor, podgląd
- warstwa stanu draftu i preferencji podglądu
- serwisy domenowe: ostrzeżenia, dane tagów/presetów, eksport, wywołanie API testowego

2. Przepływ danych między komponentami
- użytkownik dostarcza HTML na `/import` przez wklejenie lub drop pliku; wynik staje się aktywnym szkicem
- edytor aktualizuje centralny stan szkicu przy zmianach treści i trybu
- panel tagów i akcje toolbaru modyfikują ten sam stan draftu
- preview renderuje aktualny HTML ze stanu, z zastosowaniem polityki bezpiecznego podglądu
- warnings są wyliczane na podstawie HTML i wybranego trybu klienta
- wysyłka testowa używa bieżącego HTML i metadanych formularza
- przy zmianach trybu edycji utrzymywana jest spójność semantyczna HTML, aby preview nie tracił kluczowego layoutu i stylów maila

3. Granice odpowiedzialności
- UI odpowiada za interakcje użytkownika i prezentację
- store odpowiada za spójny stan roboczy draftu oraz preferencje widoku
- serwisy domenowe odpowiadają za logikę biznesową (warnings, eksport, persist, API client)
- endpoint testowy odpowiada za kontrakt odpowiedzi do testowej wysyłki w środowisku MVP
- localStorage odpowiada za lokalną trwałość szkicu, bez synchronizacji wieloużytkownikowej
- warstwa edytora i preview odpowiada łącznie za brak niezamierzonej degradacji importowanego HTML podczas renderowania
- warstwa stylów odpowiada za premium spójność wizualną bez ingerencji w przepływy biznesowe

---

## Komponenty techniczne
Lista kluczowych komponentów technicznych i ich odpowiedzialności.

- Next.js App Router: routing ekranów import/edytor oraz lokalny endpoint API do wysyłki testowej.
- React + TypeScript (strict): budowa interfejsu i modelowanie typów domenowych.
- Store stanu aplikacji (Zustand lub równoważny kontekst): utrzymanie draftu i ustawień podglądu.
- TipTap: edycja WYSIWYG treści maila.
- Tryb HTML source: bezpośrednia edycja surowego kodu HTML.
- Import drag&drop: odczyt i walidacja pojedynczego pliku `.html/.htm` na ekranie importu.
- Panel tagów: przeglądanie, wyszukiwanie i wstawianie tokenów personalizacji.
- Preview iframe: bezpieczny podgląd aktualnego HTML na presetach urządzeń i zoomie.
- Synchronizacja WYSIWYG <-> HTML: utrzymanie spójności treści i kluczowej semantyki mailowego HTML.
- WarningsService: heurystyczna analiza kompatybilności i jakości HTML.
- Draft service (localStorage): autosave/manual save i odtwarzanie szkicu.
- Email API client + mock route: obsługa testowej wysyłki i standaryzacja odpowiedzi.
- Warstwa UI (shadcn/ui + Tailwind): spójne komponenty i stylowanie aplikacji.
- Globalne tokeny designu i style glassmorphism: gradient tła, szkliste panele, blur oraz nowoczesne stany interakcji.

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

9.
- Decyzja: Integracja trybu WYSIWYG w Milestone 1.0 została oparta o `@tiptap/react`, `@tiptap/core` i `@tiptap/starter-kit`.
- Uzasadnienie: ROADMAP 1.0 wymaga bezpośredniej integracji TipTap i przełączania WYSIWYG/HTML source.
- Konsekwencje: WYSIWYG działa w zgodzie z PRD, a logika synchronizacji z trybem HTML pozostaje jawna i utrzymywana w warstwie edytora.

10.
- Decyzja: Tokeny w WYSIWYG są reprezentowane jako atomowy inline node `emailToken` renderowany jako `.ee-token`.
- Uzasadnienie: ROADMAP 1.0 wymaga wizualnego wyróżnienia tokenów i wspólnej logiki insert tokenów.
- Konsekwencje: Wstawione tokeny są czytelne i trudniejsze do przypadkowej edycji, a w stanie draftu przechowywane są jako zwykłe placeholdery `{{...}}`.


11.
- Decyzja: Podgląd w Milestone 1.5 renderuje HTML w `iframe srcDoc` po sanitacji usuwającej znaczniki `<script>`, bez `allow-scripts` w sandbox.
- Uzasadnienie: ROADMAP 1.5 wymaga bezpiecznego preview i jawnej blokady skryptów.
- Konsekwencje: Podgląd jest bliższy realnym klientom poczty i ogranicza ryzyko wykonania niebezpiecznego kodu.

12.
- Decyzja: Ostrzeżenia kompatybilności realizuje dedykowany `WarningsService` oparty o heurystyczne reguły zależne od `client mode`.
- Uzasadnienie: ROADMAP 1.5 wymaga nieblokujących warnings zależnych od trybu klienta.
- Konsekwencje: Ostrzeżenia są szybkie i przewidywalne, ale mają charakter informacyjny (heurystyczny), nie gwarancyjny.

13.
- Decyzja: Dekorowanie tokenów w WYSIWYG działa wyłącznie na węzłach tekstowych DOM, bez modyfikacji atrybutów HTML.
- Uzasadnienie: Podczas 1.5 wykryto błąd zniekształcania HTML w preview przy tokenach osadzonych w atrybutach (np. `href`).
- Konsekwencje: Stabilniejsza synchronizacja WYSIWYG <-> HTML i poprawny podgląd dla szablonów z tokenami w atrybutach.

14.
- Decyzja: W Milestone 2.0 testowa wysyłka korzysta z lokalnego mock route handlera `POST /api/email/test` z opóźnieniem 700 ms, limitem 1/5 s i losowym błędem 10%.
- Uzasadnienie: ROADMAP 2.0 wymaga domknięcia przepływu wysyłki testowej bez produkcyjnego backendu.
- Konsekwencje: UX wysyłki i obsługa błędów mogą być weryfikowane end-to-end lokalnie, ale zachowanie jest symulowane.

15.
- Decyzja: Integracja wysyłki testowej po stronie UI została wydzielona do klienta `email-api.ts` z jawnym kontraktem request/response/error.
- Uzasadnienie: ROADMAP 2.0 wymaga obsługi sukcesu i błędów API oraz spójnego przepływu modalu „Wyślij test”.
- Konsekwencje: Warstwa UI pozostaje prostsza, a testy kontraktowe endpointu i klienta API są łatwiejsze do utrzymania.

16.
- Decyzja: [Nowa funkcjonalność PRD 001] W obszarze renderowania HTML źródłem prawdy dla preview, warnings i eksportu pozostaje aktualny HTML draftu, a nie reprezentacja pośrednia zależna od warstwy prezentacyjnej.
- Uzasadnienie: PRD `001-html-preview-rendering-parity-prd.md` wymaga eliminacji rozjazdu między kodem wejściowym a podglądem.
- Konsekwencje: Ogranicza ryzyko utraty layoutu/stylów mailowych podczas pracy między trybami edycji.

17.
- Decyzja: [Nowa funkcjonalność PRD 001] Zidentyfikowano konflikt wymagający doprecyzowania: model edycji WYSIWYG nie odwzorowuje pełnego dokumentu HTML (`<html>/<head>/<body>`), podczas gdy PRD 001 wymaga poprawnej interpretacji elementów dokumentu (np. `<title>`) bez fałszywych ostrzeżeń.
- Uzasadnienie: Aktualne objawy obejmują ostrzeżenie o braku `<title>` mimo obecności tego znacznika w HTML źródłowym.
- Konsekwencje: Konflikt pozostaje jawnie otwarty do rozstrzygnięcia w kolejnych milestone’ach; nie jest rozwiązywany na poziomie tej aktualizacji dokumentacji.

18.
- Decyzja: [Nowa funkcjonalność PRD 001, Milestone 2.5] Dla szablonów zawierających pełny/mailowy HTML dokumentu (`<!doctype>`, `<html>/<head>/<body>` lub layout tabelkowy) tryb `HTML source` jest źródłem prawdy, a WYSIWYG nie nadpisuje surowego HTML.
- Uzasadnienie: Najprostszy wariant eliminujący degradację layoutu i inline styles podczas synchronizacji przez edytor WYSIWYG.
- Konsekwencje: Preview, warnings i eksport pozostają spójne z kodem wejściowym; edycja takich szablonów powinna być wykonywana głównie w `HTML source`.

19.
- Decyzja: [Nowa funkcjonalność PRD 001, Milestone 3.0] Warnings dla metadanych dokumentu (w tym `<title>`) są wyliczane na podstawie struktury pełnego HTML draftu; dla pełnego dokumentu brak `<title>` jest sygnalizowany tylko wtedy, gdy rzeczywiście nie istnieje w `<head>`.
- Uzasadnienie: ROADMAP 3.0 wymaga warning parity i eliminacji fałszywych alertów względem źródłowego HTML.
- Konsekwencje: Rozstrzyga konflikt opisany wcześniej między ograniczeniami WYSIWYG a interpretacją pełnego dokumentu HTML po stronie ostrzeżeń.

20.
- Decyzja: [Nowa funkcjonalność PRD 001, korekta po 2.5] WYSIWYG pozostaje edytowalny także dla pełnego HTML dokumentu; zmiany z WYSIWYG są synchronizowane do sekcji `<body>` dokumentu źródłowego bez nadpisywania `<head>` i metadanych.
- Uzasadnienie: Usunięcie regresji użyteczności (brak możliwości edycji WYSIWYG) przy zachowaniu parytetu renderowania i warning parity.
- Konsekwencje: Użytkownik może dalej pracować wizualnie nad treścią, a elementy dokumentowe (np. `<title>`) pozostają kontrolowane w `HTML source`.

21.
- Decyzja: [Nowa funkcjonalność PRD 001, domknięcie 3.0] Synchronizacja WYSIWYG -> pełny HTML działa przez bezpieczne mapowanie treści tekstowych (preferencyjnie po elementach liściowych), z fallbackiem „brak nadpisania” przy niejednoznacznym mapowaniu.
- Uzasadnienie: Potrzebne było jednoczesne utrzymanie live preview i ochrona mailowej struktury/layoutu przed degradacją.
- Konsekwencje: Użytkownik widzi na żywo większość zmian treści z WYSIWYG, a w przypadkach ryzykownych struktura HTML pozostaje nienaruszona.

22.
- Decyzja: [Nowa funkcjonalność PRD 002] Ekran importu obsługuje dwa równorzędne wejścia HTML: wklejenie kodu oraz drag&drop pojedynczego pliku `.html/.htm` do dedykowanego panelu.
- Uzasadnienie: PRD `002-import-dual-input-dragdrop-prd.md` wymaga drugiego, bezpośredniego sposobu rozpoczęcia pracy na pliku szablonu.
- Konsekwencje: Krótszy przepływ startowy dla plików lokalnych i spójne wejście do jednego draftu niezależnie od metody importu.

23.
- Decyzja: [Nowa funkcjonalność PRD 002] Walidacja importu drag&drop ogranicza się do pojedynczego pliku HTML (`.html/.htm`), a niepoprawny typ pliku zwraca komunikat błędu bez nadpisywania bieżącej zawartości importu.
- Uzasadnienie: PRD 002 wymaga czytelnej walidacji i ochrony przed utratą aktualnego inputu.
- Konsekwencje: Brak wsparcia dla multi-file i innych formatów w tym etapie; mniejsze ryzyko regresji obecnego przepływu.

24.
- Decyzja: [Nowa funkcjonalność PRD 002, Milestone 3.5] Odczyt treści pliku dla importu drag&drop korzysta z `File.text()` z fallbackiem do `FileReader`, aby zachować kompatybilność środowiska runtime i testów.
- Uzasadnienie: W trakcie implementacji 3.5 ujawniono różnice wsparcia API plikowego między środowiskami; potrzebne było stabilne, minimalne rozwiązanie bez zmiany architektury.
- Konsekwencje: Spójne zachowanie importu pliku HTML w aplikacji i testach smoke, bez regresji istniejącego przepływu wklejania.

25.
- Decyzja: [Nowa funkcjonalność PRD 003] Odświeżenie premium SaaS realizujemy wyłącznie na warstwie wizualnej (style, tokeny designu, komponenty UI), bez modyfikacji logiki domenowej i przepływów użytkownika.
- Uzasadnienie: PRD `003-premium-saas-ui-refresh-prd.md` wymaga poprawy jakości odbioru wizualnego bez regresji funkcjonalnych.
- Konsekwencje: Zmiany mogą być wdrażane iteracyjnie i testowane wizualnie, przy niskim ryzyku wpływu na działanie aplikacji.

26.
- Decyzja: [Nowa funkcjonalność PRD 003] Kierunek wizualny obejmuje delikatny gradient tła (lawenda -> błękit), szkliste karty (glassmorphism), subtelne rozmycie i nowoczesne stany komponentów z zachowaniem czytelności/kontrastu.
- Uzasadnienie: Jest to bezpośredni wymóg estetyczny nowego PRD.
- Konsekwencje: Konieczne jest ujednolicenie stylu między `/import` i `/editor` oraz kontrola intensywności efektów, aby nie pogorszyć użyteczności.

27.
- Decyzja: [Nowa funkcjonalność PRD 003, Milestone 4.5] Foundation premium UI została osadzona globalnie w `app/globals.css` przez tokeny designu i wspólne style komponentów (karty/panele/kontrolki/toolbar/modal), zamiast punktowych override’ów per widok.
- Uzasadnienie: Milestone 4.5 wymaga spójności bazowej i niskiego ryzyka regresji funkcjonalnej przy zmianach wizualnych.
- Konsekwencje: Kolejny etap polish (`5.0`) może skupić się na dopracowaniu detali, bez przebudowy fundamentu stylów.

---

## Jakość i kryteria akceptacji
Wspólne wymagania jakościowe dla całego projektu.

- Aplikacja musi przechodzić pełny przepływ MVP: import → edycja → podgląd → eksport/wysyłka testowa.
- Import musi działać przez oba wejścia (`wklejenie` i `drag&drop` pliku `.html/.htm`) bez regresji istniejącego przepływu.
- Edytor musi zachowywać spójność treści między trybem WYSIWYG i HTML source.
- Ostrzeżenia kompatybilności mają charakter informacyjny i nie blokują pracy użytkownika.
- Podgląd musi działać w bezpiecznym trybie (blokada skryptów) i odzwierciedlać bieżący stan draftu.
- Podgląd musi zachowywać kluczowy layout i inline style importowanego HTML mailowego (np. tabele, CTA, stopka) bez niezamierzonej degradacji.
- UI powinno zachować spójny premium wygląd SaaS (glass cards + gradient + subtelny blur) bez pogorszenia czytelności na desktopie i mobile.
- Trwałość szkicu musi działać lokalnie (autosave + zapis ręczny) oraz poprawnie odtwarzać stan.
- Funkcje eksportu i wysyłki testowej muszą działać z aktualną wersją HTML draftu.
- MVP musi działać lokalnie bez zależności od produkcyjnego backendu.
- Ostrzeżenia nie mogą raportować braków metadanych dokumentu, jeśli elementy istnieją w źródłowym HTML.
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
- Aktualny zakres obowiązywania: MVP Edytora E-maili opisany w `prd/000-initial-prd.md` oraz rozszerzenia z `prd/001-html-preview-rendering-parity-prd.md`, `prd/002-import-dual-input-dragdrop-prd.md` i `prd/003-premium-saas-ui-refresh-prd.md`
