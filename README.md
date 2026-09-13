# VoidTracker 🌌 — League of Legends Personal Performance Tracker (v0.1)

Nowoczesna aplikacja webowa do osobistego śledzenia i analizy meczów w **League of Legends**, zaprojektowana w mrocznym, fioletowym klimacie **Pustki (The Void)** z neonowymi akcentami runicznymi i zaawansowaną analityką.

![Wersja](https://img.shields.io/badge/Wersja-0.1.0-a855f7)
![League Patch](https://img.shields.io/badge/League_Patch-16.18.1-d946ef)
![Postaci](https://img.shields.io/badge/Baza_Postaci-173_Bohaterów-38bdf8)
![Tech Stack](https://img.shields.io/badge/Stack-React_18_+_Vite_+_Tailwind-7c3aed)

---

## ✨ Główne Funkcjonalności

1. **🌌 Klimat Pustki (Dark Violet Void Aesthetic):**
   - Paleta głębokich fioletów, czerni i neonowych akcentów (`#06020c`, `#281353`, `#a855f7`, `#d946ef`).
   - Tło z animowanymi cząstkami energii Pustki (`canvas`).
   - Efekty glassmorphismu, poświaty i runiczne obramowania kart.

2. **🔐 System Logowania (LocalStorage):**
   - Lokalny system sesji z kontem administratora:
     - **Login:** `admin`
     - **Hasło:** `Krecik1234`
   - Ochrona sesji, wskaźnik administratora i przycisk szybkiego uzupełniania danych testowych.

3. **📚 Baza Danych 173 Bohaterów (Riot Data Dragon):**
   - Pre-kompilowany zbiór wszystkich 173 bohaterów LoL (wersja 16.18.1) w języku polskim.
   - Wyszukiwarka na żywo po nazwie i tytule (np. Kai'Sa, Yasuo, Kassadin).
   - Filtry klas: *Zabójca, Wojownik, Mag, Strzelec, Wsparcie, Obrońca*.
   - Interaktywny modal ze splash artem, lore oraz profilami taktycznymi (Atak, Obrona, Magia, Trudność).
   - Przycisk szybkiego przeniesienia wybranego bohatera do analizatora meczu.

4. **⚡ Zaawansowany Analizator Wyników Meczowych:**
   - **Dane Wejściowe (Input):**
     - Bohater, Rola (*Top, Jungle, Mid, Bot, Support*), Wynik (*Zwycięstwo, Porażka*), Czas gry (minuty : sekundy), Typ kolejki.
     - Kills, Deaths, Assists, CS (Creep Score), Obrażenia do bohaterów, Wynik Wizji (Vision Score), Złoto, Łączne zabójstwa drużyny.
     - Stan psychiczny gracza (*Skupiony, Spokojny, Zmęczony, Tilt, Autopilot*), poziom skupienia (1–5 gwiazdek), notatka taktyczna.
   - **Wyniki i Analiza (Output):**
     - **Ocena ogólna (D- do S+)**: Algorytm ważony specyfiką roli (np. ADC oceniany z CS i obrażeń, Support z wizji i udziału w walkach).
     - **Wskaźniki per-minuta**: CS/min, DPM, VPM, GPM, KDA Ratio, Kill Participation (KP%), Efektywność złota do obrażeń.
     - **5 Filarów Gry (0-100)**: Farma i Ekonomia, Walka, Przeżywalność, Wizja, Spójność.
     - **Dynamiczne Odznaki**: *CS Maszyna, Filar Walki, Władca Wizji, Niezabijalny, Maszyna do Obrażeń, Ostrzeżenie Feedera, Ślepa Mapa, Zaburzony Mental*.
     - **Rekomendacje Void Coacha**: Konkretne porady co poprawić w kolejnych meczach.

5. **📊 Panel Dowodzenia & Historia Meczów:**
   - Podsumowanie Winrate %, KDA, średniego CS/min i DPM.
   - Wykres i ranking najczęściej granych postaci.
   - Historia rozegranych gier z filtrowaniem i możliwością usuwania.

---

## 🚀 Uruchomienie Projektu

Wymagania: Node.js (>= 18.x)

```bash
# 1. Instalacja zależności
npm install

# 2. Uruchomienie serwera deweloperskiego
npm run dev

# 3. Zbudowanie wersji produkcyjnej
npm run build

# 4. Odświeżenie bazy bohaterów z Riot Data Dragon
npm run fetch-champions
```

---

## 🛠️ Technologie

- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS + animacje Pustki
- **Ikony:** Lucide React
- **Efekty:** Canvas Confetti + Canvas Void Particles
- **Baza Danych:** Riot Games Data Dragon API v16.18.1 (JSON lokalny)
- **Repozytorium:** GitHub CLI (`gh`)

---

Tworzone z pasją dla graczy League of Legends. Pustka wzywa! 🌌
