# Bunu Senin İçin Google’layayım

Bu proje, "Bunu senin için Google'da aratayım" (Let Me Google That For You) konseptinin Türkçe bir versiyonudur. İnsanlara "bunu Google’lamak çok kolaydı" mesajını kaba olmadan, eğitici bir akışla göstermeyi amaçlar. Kullanıcı bir arama cümlesi yazar, paylaşılabilir bir bağlantı üretilir; linke tıklayan kişi ekranda yazma ve tıklama animasyonunu izler, ardından gerçek Google arama sonuçlarına yönlendirilir.

## Özellikler

- **Arama Animasyonu:** Girilen metnin Google'da nasıl aratılacağını gösteren bir animasyon oluşturur.
- **Özelleştirilebilir Bağlantılar:** Oluşturulan bağlantıları dil, ton, gecikme süresi ve arama motoru gibi parametrelerle özelleştirme imkanı sunar.
- **Çoklu Dil Desteği:** Türkçe ve İngilizce dil seçenekleri mevcuttur.
- **Tema Desteği:** Açık, koyu ve sistem teması seçenekleri sunar.
- **Kopyala ve Paylaş:** Oluşturulan bağlantıyı kolayca panoya kopyalayıp paylaşma imkanı sağlar.
- **Ayarları Kaydetme:** Kullanıcı tercihlerini (dil, ton, tema vb.) tarayıcının yerel depolamasında saklar.

## Kullanılan Teknolojiler

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)

## Başlarken

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

### Ön Koşullar

- [Node.js](https://nodejs.org/en/) (v18 veya üstü)
- [npm](https://www.npmjs.com/)

### Kurulum

1. Proje dosyalarını klonlayın veya indirin.
2. Proje dizininde bir terminal açın ve bağımlılıkları yüklemek için aşağıdaki komutu çalıştırın:

   ```sh
   npm install
   ```

### Geliştirme Sunucusunu Çalıştırma

Geliştirme sunucusunu başlatmak için aşağıdaki komutu çalıştırın:

```sh
npm run dev
```

Bu komut, projeyi `http://localhost:5173` adresinde başlatacaktır.

## Mevcut Komut Dosyaları

- `npm run dev`: Geliştirme sunucusunu başlatır.
- `npm run build`: Projeyi üretim için derler.
- `npm run preview`: Üretim derlemesini önizler.

## Yol Haritası

- **v1:** Google + TR/EN + kibar ton + açık/koyu tema
- **v1.1:** Kısaltılmış bağlantı (opsiyonel) + basit sayma
- **v1.2:** Diğer arama motorları + daha fazla dil