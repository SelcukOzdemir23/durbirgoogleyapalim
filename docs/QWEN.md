# Coder Model Genel Talimatlar

Bu dosya, bir kodlayıcı yapay zekâ/modeli ile çalışırken daha iyi, güvenilir ve temiz sonuçlar almak için genel yönergeleri içerir. Hedef: **React + Vite tabanlı** projeler.

---

## 1. Genel Kodlama İlkeleri

* **Temiz kod** yaz: Gereksiz yorumlar, tekrar eden kod veya açıklaması olmayan kısayollar kullanma.
* **Okunabilirlik** öncelikli: Anlamlı değişken/komponent isimleri kullan (`SearchForm`, `ResultCard` gibi).
* **Fonksiyonellik > kısalık:** Karmaşık tek satırlık kodlardan kaçın.
* **Modülerlik:** Her işlevi ayrı dosya/komponentte tut; tek dosya devasa olmamalı.
* **React Hooks** kullan, class component yazma.
* **TypeScript desteği** eklenebilir ama opsiyoneldir.

---

## 2. React + Vite Proje Yapısı

```
/ (root)
  index.html
  /src
    main.jsx          # React giriş
    App.jsx           # Ana layout
    /components       # Küçük tekrar kullanılabilir parçalar
    /pages            # Sayfa bazlı bileşenler
    /lib              # Yardımcı fonksiyonlar
    /hooks            # Custom hooks
    /styles           # Global ve modüler stiller
  /public
    favicon.svg
```

---

## 3. Kod Tarzı

* **ESLint + Prettier** kullan.
* `async/await` tercih et, `then/catch` zincirinden kaçın.
* Import sıralaması: önce React/üçüncü taraf, sonra proje içi.
* CSS: TailwindCSS tercih edilebilir. Eğer kullanılmazsa CSS modülleri.
* **Responsive tasarım** zorunlu.
* Kod içinde Türkçe açıklama kullanma; tüm açıklamalar İngilizce olsun.

---

## 4. UI/UX İlkeleri

* **Responsive:** Mobil (≥360px) ve masaüstü uyumlu.
* **Erişilebilirlik (a11y):**

  * `aria-*` etiketleri ekle.
  * Renk kontrastı kontrol et.
  * Klavye ile gezilebilir olmalı.
* **Tema:** Koyu/açık tema desteği.
* **Durum Yönetimi:** Local state → Context → Zustand/Redux (ihtiyaca göre). Küçük projelerde `useState`/`useReducer` yeterli.

---

## 5. Performans

* **Kod bölme:** Vite + React lazy ile sayfa bazlı code-splitting.
* **Memoization:** `useMemo`, `useCallback` gerektiğinde.
* **Resimler:** `public/` altında optimize edilmiş kullan.
* **3. parti bağımlılıklar:** Minimum seviyede tut.
* **Bundle boyutu hedefi:** < 150 KB gzip.

---

## 6. Test ve Kalite

* **Unit test:** Jest + React Testing Library önerilir.
* **E2E test:** Playwright veya Cypress (opsiyonel).
* **CI/CD:** GitHub Actions veya GitLab CI (opsiyonel).
* Test senaryoları: Boş input, uzun input, hata durumları mutlaka kapsanmalı.

---

## 7. Güvenlik

* XSS’den korun: Kullanıcı girişini sanitize et.
* `dangerouslySetInnerHTML` kullanma.
* URL parametrelerini mutlaka encode/decode et.
* Gizli bilgiler `.env` dosyasında tutulmalı (kod deposuna konmamalı).

---

## 8. Proje Teslimi

* `README.md` mutlaka olsun: kurulum, geliştirme, build, deploy adımları.
* Kod içinde açıklamalar minimal olsun.
* Commit mesajları açık ve İngilizce olsun (örn: `feat: add search form component`).
* `npm run build` çıktısı **tamamen statik** olmalı.

---

## 9. İletişim

Eğer model ek kod veya açıklama üretirse:

* Öncelik kodun **çalışabilir olması**.
* Ekstra açıklama varsa, ayrı blokta `// NOTE:` prefiksiyle yaz.

---

## 10. Özet

* React + Vite tabanlı, modüler, erişilebilir, responsive proje.
* Kod okunabilir, test edilebilir, performanslı ve güvenli.
* Gereksiz karmaşadan kaçın; kullanıcı deneyimini ön planda tut.

---

> **Not:** Bu talimat dosyası, her React + Vite tabanlı proje için yeniden kullanılabilir. Projeye özel yönergeler ayrıca ayrı dosyada verilmeli.
