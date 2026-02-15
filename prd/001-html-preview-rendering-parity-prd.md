# PRD — Spójność renderowania HTML w edytorze i podglądzie

**Produkt:** MailCraft (Email HTML Editor)  
**Typ PRD:** Korekta funkcjonalna / jakościowa  
**Cel:** Usunięcie rozjazdu między HTML wklejanym przez użytkownika a tym, co aplikacja pokazuje w edytorze WYSIWYG i panelu podglądu.

## 1) Kontekst problemu

Użytkownik wkleja poprawny, mailowy HTML oparty o układ tabelkowy, inline style i tokeny `{{...}}`.  
Wynik w aplikacji jest zniekształcony względem oryginału:
- podgląd traci część układu i stylów (m.in. przycisk CTA wygląda jak zwykły link),
- niektóre elementy są spłaszczane do prostego tekstu,
- pojawia się ostrzeżenie o braku `<title>`, mimo że oryginalny HTML je zawiera.

Efekt: użytkownik nie może ufać temu, że to co widzi w aplikacji odpowiada rzeczywistemu wyglądowi maila.

## 2) Problem do rozwiązania

### 2.1 Oczekiwane zachowanie
- HTML wklejony przez użytkownika powinien być zachowany i renderowany możliwie wiernie w panelu podglądu.
- Tryb WYSIWYG nie może powodować utraty kluczowej struktury mailowej (tabele, atrybuty i inline style potrzebne do renderingu maila).
- Ostrzeżenia powinny odzwierciedlać stan aktualnego HTML, a nie artefakty wynikające z niezamierzonej transformacji.

### 2.2 Aktualne zachowanie
- Wklejony HTML jest po drodze transformowany tak, że wygląd w podglądzie odbiega od źródła.
- Elementy typowo mailowe (layout tabelkowy + style inline) nie są prezentowane tak jak w dostarczonym kodzie.

## 3) Zakres

### 3.1 W zakresie
- Ujednolicenie przepływu import -> edycja -> preview tak, aby podgląd pokazywał finalny HTML bez utraty kluczowych cech layoutu i stylów.
- Doprecyzowanie zasad, która reprezentacja HTML jest źródłem prawdy dla preview.
- Zabezpieczenie tokenów `{{...}}`, aby nie psuły HTML ani stylowania.

### 3.2 Poza zakresem
- Rozbudowa funkcjonalna niezwiązana z renderowaniem (nowe moduły, nowe ekrany, nowe integracje).
- Zmiana docelowego stacku edytora.
- Gwarancja piksel-perfect między wszystkimi klientami poczty (to nadal obszar heurystyczny).

## 4) Wpływ biznesowy / produktowy

- Wyższa wiarygodność narzędzia podczas pracy na realnych szablonach e-mail.
- Mniejsze ryzyko błędów wysyłki wynikających z niezgodności podglądu z kodem.
- Mniej iteracji ręcznych "wklej -> popraw -> test poza aplikacją".

## 5) Kryteria akceptacji

1. Po wklejeniu dostarczonego HTML (layout tabelkowy + inline style + tokeny), podgląd zachowuje:
- nagłówek z tłem i typografią,
- blok treści z poprawnymi odstępami,
- CTA jako przycisk (nie zwykły link tekstowy),
- stopkę ze stylem i linkiem wypisu.

2. Tokeny `{{...}}` pozostają poprawne semantycznie i nie niszczą struktury HTML.

3. Przełączanie między `WYSIWYG` i `HTML source` nie powoduje degradacji kluczowych elementów maila.

4. Ostrzeżenie o braku `<title>` nie pojawia się, jeśli `<title>` istnieje w źródłowym HTML.

## 6) Ryzyka i uwagi

- Edytory WYSIWYG zwykle upraszczają HTML e-mail; trzeba jawnie kontrolować granicę między edycją wizualną a źródłem HTML.
- Nadmierne transformacje po stronie edytora mogą ponownie wprowadzić utratę stylów/atrybutów.
- Należy utrzymać bezpieczeństwo preview (blokada skryptów) bez niepotrzebnej utraty legalnych elementów HTML e-mail.

## 7) Proponowana nazwa inicjatywy

**Milestone roboczy:** HTML Rendering Parity  
**Nazwa PRD:** `001-html-preview-rendering-parity-prd.md`
