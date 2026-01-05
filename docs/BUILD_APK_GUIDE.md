# 📱 Panduan Build APK - Autocuan Supply Mobile

## Prasyarat

1. **Akun Expo** - Daftar gratis di https://expo.dev
2. **EAS CLI** - Install secara global
3. **Node.js** - Sudah terinstall

---

## 🚀 Langkah-Langkah Build APK

### Step 1: Install EAS CLI

```powershell
npm install -g eas-cli
```

### Step 2: Login ke Expo

```powershell
eas login
```

Masukkan email dan password akun Expo Anda.

### Step 3: Konfigurasi Project

```powershell
cd mobile
eas build:configure
```

Pilih platform: **Android**

### Step 4: Build APK (Preview)

```powershell
eas build --platform android --profile preview
```

**Opsi Profile:**
- `preview` - APK untuk testing (recommended untuk tugas)
- `production` - APK/AAB untuk Play Store
- `development` - Development client dengan debugging

### Step 5: Download APK

Setelah build selesai (5-15 menit), Anda akan mendapat link download:

```
✔ Build finished
🤖 Android app:
https://expo.dev/artifacts/eas/xxxxx.apk
```

Klik link tersebut atau buka dashboard di https://expo.dev untuk download APK.

---

## ⚡ Build Lokal (Tanpa Cloud)

Jika ingin build di komputer sendiri (memerlukan Android SDK):

### Install Dependencies

```powershell
npm install -g eas-cli
npx expo install expo-dev-client
```

### Build Lokal

```powershell
eas build --platform android --profile preview --local
```

**Catatan:** Build lokal memerlukan:
- Java JDK 17
- Android SDK
- Android NDK
- ~10GB disk space

---

## 📋 Troubleshooting

### Error: "Owner account not found"

```powershell
eas login
eas whoami  # Pastikan sudah login
```

### Error: "Missing android.package"

Sudah dikonfigurasi di `app.json`:
```json
"android": {
  "package": "com.autocuan.supply"
}
```

### Build Gagal

1. Cek log error di Expo dashboard
2. Pastikan semua dependencies compatible
3. Jalankan `npx expo-doctor` untuk diagnosa

---

## 📦 Output Files

| Profile | Output | Size | Use Case |
|---------|--------|------|----------|
| preview | APK | ~30MB | Testing, Demo |
| production | AAB | ~15MB | Play Store |

---

## 🔗 Quick Commands

```powershell
# Login
eas login

# Build APK (preview)
eas build -p android --profile preview

# Build APK (production)
eas build -p android --profile production

# Check build status
eas build:list

# Download artifact
eas build:view
```

---

## 📱 Install APK di HP

1. Download file `.apk` dari link Expo
2. Transfer ke HP Android via:
   - USB cable
   - Google Drive
   - WhatsApp (kirim ke diri sendiri)
3. Buka file APK di HP
4. Izinkan "Install from Unknown Sources" jika diminta
5. Install dan jalankan aplikasi

---

## 🎓 Untuk Tugas UAS

Untuk keperluan tugas, gunakan profile `preview`:

```powershell
cd mobile
eas build -p android --profile preview
```

Build gratis di Expo cloud:
- ✅ 30 builds/bulan (gratis)
- ✅ APK siap install
- ✅ Tidak perlu Android Studio

---

*Dokumentasi Build APK - Autocuan Supply Mobile App*
