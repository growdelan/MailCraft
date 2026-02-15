# PRD — Import HTML: Wklejanie + Drag&Drop pliku

**Produkt:** MailCraft (Email HTML Editor)  
**Typ PRD:** Rozszerzenie funkcjonalne  
**Cel:** Rozszerzyć ekran importu o drugą metodę wejścia HTML: przeciągnięcie pliku `.html/.htm` i natychmiastowe załadowanie treści do importu.

## 1) Kontekst problemu

Aktualnie użytkownik importuje szablon głównie przez ręczne wklejenie kodu HTML.  
W praktyce częsty scenariusz pracy to gotowy plik z dysku, który użytkownik chce po prostu przeciągnąć i od razu otworzyć w edytorze.

Brak dedykowanego obszaru drag&drop wydłuża przepływ i zwiększa liczbę kroków.

## 2) Problem do rozwiązania

### 2.1 Oczekiwane zachowanie
- Ekran `/import` udostępnia dwie równorzędne metody wejścia:
  - wklejenie kodu HTML (obecna metoda),
  - przeciągnięcie pliku `.html/.htm` do wydzielonego obszaru.
- Po upuszczeniu poprawnego pliku jego zawartość trafia do pola importu i może zostać od razu otwarta w edytorze.
- Użytkownik widzi jasny feedback stanu drag&drop (hover/active/error).

### 2.2 Aktualne zachowanie
- Brakuje dedykowanego drugiego okna importu z obsługą drag&drop plików.

## 3) Zakres

### 3.1 W zakresie
- Dodanie na `/import` drugiego panelu wejścia dla drag&drop pliku.
- Obsługa odczytu pliku tekstowego `.html/.htm` po drop.
- Ujednolicenie przepływu: niezależnie od metody wejścia wynik trafia do tego samego draftu i dalej do `/editor`.
- Komunikaty walidacyjne dla niepoprawnych plików.

### 3.2 Poza zakresem
- Obsługa wielu plików jednocześnie.
- Konwersja formatów innych niż HTML.
- Zmiany w edytorze `/editor`, preview i warnings (poza skutkami poprawnego importu).

## 4) Wpływ biznesowy / produktowy

- Krótszy i wygodniejszy start pracy na realnych szablonach.
- Mniej błędów użytkownika wynikających z ręcznego kopiowania kodu.
- Lepsza użyteczność narzędzia dla workflow „plik -> edycja -> podgląd”.

## 5) Kryteria akceptacji

1. Na `/import` istnieją dwie widoczne opcje:
- pole do wklejenia HTML,
- panel drag&drop pliku `.html/.htm`.

2. Upuszczenie poprawnego pliku HTML:
- odczytuje treść pliku,
- wstawia ją do importu,
- umożliwia natychmiastowe przejście do `/editor`.

3. Upuszczenie niepoprawnego pliku (np. inny typ/rozszerzenie) pokazuje czytelny błąd i nie psuje aktualnej zawartości importu.

4. Dotychczasowy przepływ „wklej kod HTML” nadal działa bez regresji.

5. Smoke testy pokrywają oba wejścia importu (wklejenie i drag&drop).

## 6) Ryzyka i uwagi

- Różnice przeglądarkowe w obsłudze `DataTransfer` i MIME typów plików.
- Potrzeba jasnej walidacji, by nie dopuścić nieoczekiwanych formatów.
- Trzeba zachować prosty UX bez konfliktu dwóch metod wejścia.

## 7) Proponowana nazwa inicjatywy

**Milestone roboczy:** Import Dual Input  
**Nazwa PRD:** `002-import-dual-input-dragdrop-prd.md`
