# PRD — Premium SaaS UI Refresh (Glass + Gradient)

**Produkt:** MailCraft (Email HTML Editor)  
**Typ PRD:** Rozszerzenie UX/UI (visual refresh)  
**Cel:** Nadać aplikacji nowoczesny, premium wygląd SaaS bez zmiany logiki biznesowej i bez regresji funkcjonalnych.

## 1) Kontekst problemu

Obecny interfejs jest funkcjonalny, ale wizualnie surowy i spartański.  
Brakuje charakteru premium, który zwiększa postrzeganą jakość produktu.

Użytkownik oczekuje:
- delikatnego stylu SaaS,
- szklistego wyglądu kart (glassmorphism),
- gradientowego tła od lawendy do błękitu,
- subtelnego rozmycia i nowoczesnego „polish”.

## 2) Problem do rozwiązania

### 2.1 Oczekiwane zachowanie
- Aplikacja wygląda nowocześnie i premium, przy zachowaniu pełnej czytelności.
- Warstwa wizualna jest spójna na stronach `/import` i `/editor`.
- Zmiana dotyczy wyłącznie UI/stylów; funkcjonalność i przepływy pozostają bez zmian.

### 2.2 Aktualne zachowanie
- UI działa poprawnie, ale odbiór wizualny jest zbyt podstawowy i mało „SaaS premium”.

## 3) Zakres

### 3.1 W zakresie
- Redesign warstwy wizualnej:
  - tło gradientowe (lawenda -> błękit),
  - szkliste karty z rozmyciem,
  - nowoczesne cienie, obrysy, promienie i spacing.
- Ujednolicenie stylu:
  - nagłówki, przyciski, inputy, panele, sekcje ostrzeżeń, taby, toolbar.
- Dopracowanie stanów interakcji:
  - hover, focus, active, disabled.
- Zachowanie pełnej responsywności i dostępności kontrastu.

### 3.2 Poza zakresem
- Zmiany logiki aplikacyjnej (store, API, walidacje, routing, przepływy).
- Dodawanie nowych funkcji biznesowych.
- Refaktory niezwiązane z warstwą UI.

## 4) Wpływ biznesowy / produktowy

- Wyższa percepcja jakości produktu i „premium feel”.
- Lepsze pierwsze wrażenie dla użytkownika końcowego.
- Większa spójność wizualna i profesjonalny branding aplikacji.

## 5) Kryteria akceptacji

1. Aplikacja zachowuje wszystkie dotychczasowe funkcje i przepływy bez regresji.
2. Główna estetyka jest zgodna z założeniem:
- gradient tła od lawendy do błękitu,
- szkliste karty z subtelnym blur,
- nowoczesny, lekki styl SaaS.
3. Kluczowe widoki (`/import`, `/editor`) są wizualnie spójne i premium.
4. UI pozostaje czytelne na desktopie i mobile.
5. Kontrasty i stany fokus/disabled pozostają używalne.

## 6) Ryzyka i uwagi

- Nadmierne efekty (blur/shadow/gradient) mogą obniżyć czytelność.
- Zbyt duże odstępstwa wizualne mogą utrudnić orientację w interfejsie.
- Trzeba utrzymać balans: „premium” bez przesady i bez pogorszenia użyteczności.

## 7) Proponowana nazwa inicjatywy

**Milestone roboczy:** Premium UI Refresh  
**Nazwa PRD:** `003-premium-saas-ui-refresh-prd.md`
