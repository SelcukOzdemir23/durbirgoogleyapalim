# Proje: “Bunu Senin İçin Google’layayım” — Türkçe Klon

Bu doküman iki bölümden oluşur:

1. **Ürün Yapısı ve Teknik Şartname** (tasarım, özellik, işleyiş)
2. **Coder Model Talimatı** (bir kodlayıcı yapay zekâ/modeli için ayrıntılı yönergeler)

---

## 1) Ürün Yapısı ve Teknik Şartname

### 1.1. Amaç

İnsanlara “bunu Google’lamak çok kolaydı” mesajını kaba olmadan, eğitici bir akışla göstermek: Kullanıcı bir arama cümlesi yazar, paylaşılabilir bir bağlantı üretilir; linke tıklayan kişi ekranda yazma ve tıklama animasyonunu izler, ardından gerçek **Google arama** sonuçlarına yönlendirilir.

### 1.2. Kullanıcı Senaryoları

* **Sorgu oluşturma:** Ziyaretçi ana sayfaya gelir, arama kutusuna metin yazıp “Bağlantı Oluştur”a tıklar. Hemen paylaşılabilir bir URL üretilir ve kopyalanır.
* **Rehber animasyonu izleme:** Paylaşılan linke tıklayan kişi; (1) imlecin arama kutusuna ilerlediğini, (2) metnin harf harf yazıldığını, (3) “Google’da Ara” butonunun tıklandığını görür. İpucu balonları kısa açıklamalar verir (ör. “Önce arama kutusuna yazıyoruz…”).
* **Yönlendirme:** Animasyon bittiğinde otomatik olarak Google sonuç sayfasına gider.
* **Kibar mod:** Sabit bir uyarı metniyle “Önce bir deneme araması yapmayı deneyebilirsiniz.” gibi yumuşak bir dil kullanılır.

### 1.3. Ana Özellikler

* Arama kutusu + büyük “Bağlantı Oluştur” butonu
* Animasyon (imleç hareketi + yazma efekti + buton tıklama)
* Geri sayım göstergesi (ör. 3…2…1…)
* Google’a otomatik yönlendirme (yeni sekme opsiyonu)
* **Bağlantı kopyalama** butonu (Clipboard API)
* **Dil desteği:** Varsayılan `tr`; URL parametresi ile `lang` değiştirilebilir
* **Kibar/sert ton seçimi:** `tone=polite|classic`
* **Koyu/açık tema:** Sistem tercihini izler, elle geçiş yapılabilir
* **Mobil uyum:** 360px ve üzeri; tek sütun düzeni
* **Erişilebilirlik:** WCAG’ye uygun kontrast, odak halkaları, `aria-live` ile animasyon bildirimleri
* **Gizlilik:** Sorgular sunucuya kaydedilmez; yalnızca anonim sayaç/telemetri (isteğe bağlı) tutulur

### 1.4. Sayfa ve Akış Diyagramı

* **/** (Ana sayfa)

  * Bileşenler: Header, AramaFormu, İpucuKartı, AyarlarMenüsü, Altbilgi
* **/l** (Link oynatma sayfası)

  * Animasyon sahnesi + geri sayım + yönlendirme
* **/hakkinda**, **/kvkk** (opsiyonel yasal sayfalar)

### 1.5. URL Şeması

* **Üretim linki (paylaşılacak):**

  ```
  /l?q=<url-encode(query)>&lang=tr&tone=polite&delay=3500&engine=google
  ```

  * `q`: Arama metni (zorunlu)
  * `lang`: Arayüz dili (`tr` varsayılan)
  * `tone`: `polite` (yumuşak) veya `classic` (daha alaycı)
  * `delay`: Yönlendirme gecikmesi (ms)
  * `engine`: `google` (ilk sürüm), ileride `yandex`, `bing` eklenebilir

* **Yönlendirme hedefi (Google):**

  * `https://www.google.com/search?q=<encoded>&hl=<lang>`

### 1.6. Görsel Tasarım

* **Stil:** Minimal, tek odak arama kutusu; bol boşluk
* **Renk:** Açık temada açık arka plan + vurgulu buton; koyu temada koyu arka plan
* **Tipografi:** Sistem fontları (performans için) veya değişken font (ör. Inter)
* **Animasyon:**

  * Yazma: tipografi "+ caret" simülasyonu (CSS + JS)
  * İmleç: `transform` ile keyframe hareket; `prefers-reduced-motion` saygı
* **Boş durumlar:** Örnek sorgular (placeholder veya “Şunları deneyin: …”)

### 1.7. Teknik Mimari

* **Ön yüz:** Tek sayfa uygulaması (React / Svelte / Vanilla + Vite). İlk sürüm için **Vanilla + Vite** önerilir (düşük yük).
* **Barındırma:** Statik hosting (Vercel, Cloudflare Pages, Netlify ya da kendi Nginx).
* **Sunucu (opsiyonel):**

  * Bağlantı kısaltma / tıklama sayacı için hafif bir edge function
  * KV/SQLite ile minimal sayaç; PII saklanmaz
* **Paket boyutu hedefi:** `< 60KB gzip` (HTML+CSS+JS, font hariç)
* **Performans:**

  * SSR gerekmez; pre-render yeterli
  * `defer` script, `rel=preconnect` Google’a
  * Lighthouse > 95

### 1.8. Bileşenler (Öneri)

* `SearchForm` — girdi, ayarlar açılır menüsü, “Bağlantı Oluştur”
* `LinkPreview` — üretilen URL + “Kopyala”
* `Player` — animasyon sahnesi, geri sayım, yönlendirme
* `Toast` — kopyalandı bildirimleri
* `ThemeSwitch` — tema değiştirici

### 1.9. Durum Yönetimi

* Sade `URLSearchParams` ve `history.pushState`
* Ton/tema tercihleri `localStorage`

### 1.10. Hata Durumları

* Boş `q`: “Önce bir arama metni yazınız.”
* Çok uzun `q` (> 2.000 karakter): “Sorgu çok uzun.”
* Engelli yönlendirme (pop-up engelleyici): Manuel “Google’da aç” düğmesi

### 1.11. Yerelleştirme

* `lang` parametresine göre sabit metinler
* İlk sürüm: `tr` ve `en`; JSON dil dosyaları

### 1.12. Güvenlik ve Gizlilik

* PII kaydı yok; IP/UA log’ları kapalı (opsiyonel, anonim sayım)
* Üçüncü taraf çerez yok
* **KVKK/GDPR:** Aydınlatma metni + çerezsiz istatistik

### 1.13. Ölçüm (İsteğe bağlı)

* Sunucu tarafı sayma: `/api/hit?id=<hash>` (hash: link parametrelerinin sabitlenmiş SHA-256 özetidir; geri döndürülemez)
* Toplam tıklama sayısı hariç hiçbir içerik saklanmaz

### 1.14. SEO

* Ana sayfa için statik meta (başlık, açıklama)
* Paylaşımda Open Graph: Başlıkta arama metnini gösteren dinamik OG (isteğe bağlı, kenar işlevi)

### 1.15. Test Kriterleri (Kabul)

* [ ] `q` ile gidilen `/l` sayfasında yazma animasyonu başlar
* [ ] Geri sayım sonunda doğru `hl` ile Google’a yönlendirilir
* [ ] “Kopyala” tüm modern tarayıcılarda çalışır
* [ ] `prefers-reduced-motion` etkinse animasyon atlanır, yalnızca geri sayım gösterilir
* [ ] Mobil 360px genişlikte düzen bozulmaz

### 1.16. Yol Haritası

* v1: Google + TR/EN + kibar ton + açık/koyu tema
* v1.1: Kısaltılmış bağlantı (opsiyonel) + basit sayma
* v1.2: Diğer arama motorları + daha fazla dil

---

## 2) Coder Model Talimatı (Instruction)

Aşağıdaki talimatları bir kodlayıcı yapay zekâ/modeline .md olarak veriniz. Modelden hedef: Üstteki şartnameyi hayata geçiren, minimal boyutlu, erişilebilir ve Türkçe odaklı bir web uygulaması üretmek.

### 2.1. Genel Beklenti

* **Dil:** Arayüz ve sabit metinler Türkçe; `en` desteği JSON sözlükle sağlanacak.
* **Çerçeve:** Vanilla JS + Vite (React vb. kullanılmayacak). Paket boyutu hedefi `< 60KB gzip`.
* **Stil:** Tek CSS dosyası; sistem font yığını kullan. Koyu/açık tema, `prefers-color-scheme`.
* **Erişilebilirlik:** WCAG odak halkaları, yeterli kontrast, `aria-live` ile animasyon bildirimleri.
* **Animasyon:**

  * Yazma: Zamanlamalı karakter ekleme (insansı aralık jitter’ı)
  * İmleç: CSS keyframes; `prefers-reduced-motion` varsa animasyon devre dışı
* **Yönlendirme:** Google’a `https://www.google.com/search?q=<q>&hl=<lang>` 5 sn içinde; butonla anında geçiş seçeneği

### 2.2. Dosya Yapısı (çıktı olarak üret)

```
/ (Vite)
  index.html
  /src
    main.js
    styles.css
    i18n/tr.json
    i18n/en.json
    lib/animate.js      # yazma+imleç
    lib/url.js          # param çözme/üretme
    pages/home.js       # ana sayfa
    pages/player.js     # /l oynatıcı
  /public
    favicon.svg
```

### 2.3. Bileşen Gereksinimleri

* **Ana Sayfa (`home.js`)**

  * Girdi: `#query`
  * Ayarlar: `lang`, `tone`, `delay` (ms), `engine`
  * “Bağlantı Oluştur” ⇒ `/l?q=...&lang=...&tone=...&delay=...&engine=google`
  * Çıktı URL’yi göster ve `navigator.clipboard.writeText` ile kopyala
* **Oynatıcı (`player.js`)**

  * URL’den parametreleri oku; boş `q` ise uyarı ver
  * İmleç hareketi → yazma → buton tıklama animasyonu sırayla
  * Geri sayım (ekranda) ve **Atla & Google’da Aç** butonu
  * `prefers-reduced-motion` → yalnız geri sayım + buton

### 2.4. İşlevsel Ayrıntılar

* **İnsansı yazma:** Karakter başına 40–120ms arası rastlantısal gecikme; noktalama sonrası ufak bekleme
* **İmleç yolu:** CSS `@keyframes` ile input koordinatlarına, sonra butona; responsive ölçüler için yüzde tabanlı konumlandır
* **Hata yönetimi:**

  * `q` boşsa `role=alert` uyarı
  * Clipboard başarısızsa URL’yi işaretle seç (fallback)
* **Yerelleştirme:** `i18n/*` JSON’dan yükle; `data-i18n` ile metin eşlemesi
* **Tema:** `data-theme="dark|light"`; toggle butonu; tercih `localStorage`

### 2.5. Güvenlik & Gizlilik

* Sorgu/sunum **sunucuya gönderilmeyecek**.
* Telemetri varsayılan **kapalı**; eğer etkinleştirilecekse yalnızca anonim `/api/hit` sayacı (hashlenmiş link id’si) kullanılacak.

### 2.6. Performans

* Tek `main.js` paketi, kod bölme yok; üçüncü taraf kütüphane yok
* `requestAnimationFrame` zamanlaması; layout thrash’inden kaçın
* Resim yoksa `favicon.svg` dışındaki asset’leri minimumda tut

### 2.7. Edge/Vercel Function (opsiyonel)

* **Amaç:** Sadece tıklama sayacı ve dinamik OG görseli
* Endpoint: `POST /api/hit { id: string }` → 204
* Depo: KV (key: `hit:<id>`, value: int)
* OG: `/api/og?q=...` → basit SVG/PNG üret

### 2.8. Kabul Testleri (otomasyon için senaryolar)

* `/l?q=merhaba&lang=tr` → 0–1 sn içinde yazma başlar, ≤ 5 sn’de yönlendirme
* `prefers-reduced-motion` açık → animasyon yok, geri sayım var, manuel buton çalışır
* `tone=classic` → balon metinleri daha alaycı; `polite` → kibar
* `lang=en` → tüm sabit metinler İngilizceye döner

### 2.9. Teslim Çıktısı

* Çalışır Vite projesi; `npm run build` ile statik çıktılar
* `README.md` (kurulum, çevresel değişken gerekmez)
* 10 satırın altında açıklayıcı `comments` (yalın kod)

### 2.10. Metinler (TR örnekleri)

* Ana başlık: “Bunu sizin için Google’layalım.”
* Alt başlık: “Önce arama kutusuna yazıyoruz…”
* Butonlar: “Bağlantı Oluştur”, “Kopyala”, “Google’da Aç”, “Atla”
* Uyarı: “Önce bir arama metni yazınız.”

---

**Not:** İlk sürüm tamamen statik çalışır; hız, erişilebilirlik ve nezaket tonu önceliklidir. Gerektiğinde sayım ve OG gibi ekler modüler olarak eklenir.
