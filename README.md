# جمعية البركة - تطبيق PWA

تطبيق تسيير عدادات الماء الصالح للشرب.

## خطوات النشر على GitHub Pages

### 1. تثبيت المكتبات
```bash
npm install
```

### 2. عدّل اسم الـ Repository
افتح `vite.config.js` وغيّر السطر:
```js
base: '/baraka-pwa/',
```
إلى اسم الـ repository الذي أنشأته على GitHub، مثلاً:
```js
base: '/my-repo-name/',
```

### 3. أنشئ repository على GitHub
- اذهب إلى github.com → New repository
- اسمه: `baraka-pwa` (أو أي اسم تريده)
- اتركه Public

### 4. ارفع الكود
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/USERNAME/baraka-pwa.git
git push -u origin main
```

### 5. انشر التطبيق
```bash
npm run deploy
```

### 6. فعّل GitHub Pages
- اذهب إلى Settings → Pages في الـ repository
- Source: اختر `gh-pages` branch
- بعد دقيقة سيكون التطبيق على:
  `https://USERNAME.github.io/baraka-pwa/`

## تشغيل محلي
```bash
npm run dev
```

## بناء للإنتاج
```bash
npm run build
```
