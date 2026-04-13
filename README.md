# Elite Furniture — واجهة المتجر + لوحة الإدارة

مشروع **Vite + React + TypeScript** لواجهة تجارة إلكترونية (متجر + تسجيل دخول عملاء + لوحة أدمن) جاهز للنشر على **Vercel** مع ربط اختياري بـ **API على Railway**.

---

## جدول محتويات

1. [متطلبات التشغيل](#متطلبات-التشغيل)
2. [تشغيل المشروع محليًا](#تشغيل-المشروع-محليًا)
3. [بيانات الدخول (مهم)](#بيانات-الدخول-مهم)
4. [متغيرات البيئة `.env`](#متغيرات-البيئة-env)
5. [هيكل المشروع](#هيكل-المشروع)
6. [مسارات الموقع](#مسارات-الموقع)
7. [لوحة الإدمن — الصفحات والوظائف](#لوحة-الإدمن--الصفحات-والوظائف)
8. [ربط الـ API (Railway)](#ربط-الـ-api-railway)
9. [النشر على Vercel (إنتاج)](#النشر-على-vercel-إنتاج)
10. [تسجيل الدخول بجوجل للعملاء](#تسجيل-الدخول-بجوجل-للعملاء)
11. [البناء للإنتاج محليًا](#البناء-للإنتاج-محليًا)
12. [الأمان والتوصيات](#الأمان-والتوصيات)
13. [استكشاف الأخطاء](#استكشاف-الأخطاء)

---

## متطلبات التشغيل

- **Node.js** إصدار **18** أو أحدث (يُفضّل LTS).
- **npm** (يأتي مع Node).
- حساب **GitHub** لرفع الكود (اختياري لكنه الطريقة المعتادة مع Vercel).
- حساب **Vercel** (مجاني للمشاريع الشخصية ضمن حدود الخدمة).

تحقق من الإصدارات:

```bash
node -v
npm -v
```

---

## تشغيل المشروع محليًا

1. انسخ المستودع أو فك ضغط المشروع ثم ادخل المجلد:

   ```bash
   cd elite-furniture
   ```

2. ثبّت الحزم:

   ```bash
   npm install
   ```

3. (اختياري للتطوير) أنشئ ملف `.env` في جذر المشروع — انسخ من `.env.example`:

   ```bash
   copy .env.example .env
   ```

   على Linux/macOS: `cp .env.example .env`

4. شغّل السيرفر المحلي:

   ```bash
   npm run dev
   ```

5. افتح المتصفح على: **http://localhost:5173/**

---

## بيانات الدخول (مهم)

### مسؤول المتجر (Admin)

يُستخدم هذا الزوج **تلقائيًا** إذا لم تضبط `VITE_ADMIN_EMAIL` و `VITE_ADMIN_PASSWORD` في البيئة (محليًا أو على Vercel). **احفظهما في مكان آمن** (مثل ورقة في مكان خاص) ثم غيّرهما على الإنتاج إذا أردت عبر متغيرات Vercel.

| الحقل    | القيمة |
|----------|--------|
| **Email** | `elite.admin@elitefurniture.store` |
| **Password** | `EliteAdmin2026!Sec` |

- رابط الدخول: **`/admin/login`** (مثال محلي: http://localhost:5173/admin/login)
- بعد الدخول تُخزّن الجلسة في **localStorage** (حل مؤقت؛ لاحقًا يمكن ربط JWT من الـ API).

**لتغيير البيانات على الإنتاج:** في Vercel → Project → Settings → Environment Variables أضف:

- `VITE_ADMIN_EMAIL` = البريد الذي تريده  
- `VITE_ADMIN_PASSWORD` = كلمة مرور قوية  

ثم أعد نشر المشروع (**Redeploy**).

> القيم الافتراضية معرّفة أيضًا في الملف: `src/config/adminCredentials.ts` (مصدر واحد للكود والتوثيق).

### عميل تجريبي (المتجر — ليس الأدمن)

لتجربة صفحة تسجيل دخول العميل بدون جوجل:

| Email | Password |
|-------|----------|
| `demo@elitefurniture.com` | `demo1234` |

---

## متغيرات البيئة `.env`

كل المتغيرات تبدأ بـ `VITE_` لأن Vite يعرّضها للمتصفح **فقط** للقيم العامة — **لا تضع أسرار حساسة جدًا** في متغيرات تُبنى للواجهة إن كان المستودع عامًا.

| المتغير | الوصف |
|---------|--------|
| `VITE_API_URL` | عنوان الـ API (Railway) بدون `/` في النهاية. إن كان فارغًا أو الـ API غير متاح، يُستخدم تخزين **محلي في المتصفح** لجزء من البيانات (منتجات/طلبات/عروض) للتجربة. |
| `VITE_ADMIN_EMAIL` | (اختياري) يتجاوز بريد الأدمن الافتراضي. |
| `VITE_ADMIN_PASSWORD` | (اختياري) تتجاوز كلمة مرور الأدمن الافتراضية. |
| `VITE_GOOGLE_CLIENT_ID` | معرف عميل OAuth لتسجيل دخول العملاء بجوجل. إن كان فارغًا يختفي زر جوجل ويظهر تنبيه في صفحة Login. |

مثال `.env` محلي:

```env
VITE_API_URL=https://your-app.up.railway.app
VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
```

---

## هيكل المشروع

```
elite-furniture/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── vercel.json              # إعادة توجيه SPA لصفحات React
├── .env.example
├── public/
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css            # Tailwind v4
    ├── config/
    │   └── adminCredentials.ts
    ├── types/
    ├── data/                # بيانات ثابتة (محافظات، منتجات أولية)
    ├── context/             # السلة، المفضلة، عميل
    ├── services/
    │   ├── api/             # axios + endpoints
    │   ├── local/           # fallback localStorage
    │   └── *.ts             # طبقات دمج API + محلي
    ├── components/
    ├── pages/
    └── utils/
```

---

## مسارات الموقع

| المسار | الوصف |
|--------|--------|
| `/` | الصفحة الرئيسية |
| `/shop` | المتجر |
| `/product/:id` | تفاصيل منتج |
| `/offers` | العروض |
| `/about` | من نحن |
| `/login` | دخول العميل (جوجل + تجريبي) |
| `/account` | حساب العميل |
| `/cart` | السلة |
| `/checkout` | إتمام الطلب (بيانات توصيل كاملة) |
| `/wishlist` | المفضلة |
| `/track-order` | تتبع الطلب + تقييم بعد التسليم |

---

## لوحة الإدمن — الصفحات والوظائف

| المسار | الوظيفة |
|--------|---------|
| `/admin/login` | تسجيل دخول الأدمن |
| `/admin/dashboard` | إحصائيات سريعة |
| `/admin/products` | قائمة المنتجات + حذف |
| `/admin/products/add` | إضافة منتج |
| `/admin/products/edit/:id` | تعديل منتج |
| `/admin/offers` | إدارة العروض |
| `/admin/orders` | الطلبات، تغيير الحالة، تنزيل Excel |
| `/admin/analytics` | رسوم بيانية وزيارات تقريبية (محلية) |

---

## ربط الـ API (Railway)

الواجهة تتوقع (حيثما وُجد الـ API) تقريبًا:

- `GET /products` — قائمة منتجات  
- `POST /products` — إنشاء  
- `PUT /products/:id` — تحديث  
- `DELETE /products/:id` — حذف  
- `GET /orders`، `POST /orders`، `PATCH أو PUT /orders/:id` — إن وُجدت  
- `GET/POST/PUT/DELETE /offers` — إن وُجدت  

إن كان شكل الـ JSON مختلفًا، عدّل دوال التطبيع في `src/services/api/*.ts`.

---

## النشر على Vercel (إنتاج)

1. ارفع المشروع إلى مستودع GitHub (مثلاً تحت حسابك).
2. ادخل [vercel.com](https://vercel.com) → **Add New** → **Project** → استورد الريبو.
3. إعدادات البناء الافتراضية لـ **Vite** عادة:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. في **Environment Variables** أضف القيم المناسبة (`VITE_API_URL`، إلخ). لبيانات الأدمن: إمّا تترك الافتراضي من الكود أو تضع `VITE_ADMIN_EMAIL` / `VITE_ADMIN_PASSWORD`.
5. اضغط **Deploy**. بعد الانتهاء يظهر رابط مثل `https://اسم-المشروع.vercel.app`.

ملف `vercel.json` يضمن إعادة توجيه المسارات لـ `index.html` (SPA).

---

## تسجيل الدخول بجوجل للعملاء

1. [Google Cloud Console](https://console.cloud.google.com/) → مشروع → **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID** → نوع **Web application**.
2. **Authorized JavaScript origins:** أضف `http://localhost:5173` للتطوير ودومين Vercel للإنتاج (مثل `https://xxx.vercel.app`).
3. انسخ **Client ID** إلى `VITE_GOOGLE_CLIENT_ID` في `.env` وفي إعدادات Vercel.
4. أعد البناء/النشر.

---

## البناء للإنتاج محليًا

```bash
npm run build
npm run preview
```

- `build` ينتج مجلد `dist`.
- `preview` يعرض نسخة الإنتاج محليًا.

---

## الأمان والتوصيات

- **لا ترفع ملف `.env` إلى GitHub** (موجود في `.gitignore`).
- بيانات الأدمن الافتراضية مناسبة للتجربة؛ على **موقع حي عام** يُفضّل تعيين `VITE_ADMIN_*` في Vercel بقيم قوية خاصة بك.
- تسجيل دخول الأدمن الحالي **واجهة فقط**؛ أي حماية حقيقية للبيانات تكون من جهة الـ **API** والصلاحيات على السيرفر.

---

## استكشاف الأخطاء

| المشكلة | الحل المقترح |
|---------|----------------|
| الصفحة بيضاء بعد النشر | تأكد من `vercel.json` وأن Output = `dist`. |
| المنتجات لا تظهر | تحقق من `VITE_API_URL` أو استخدم الوضع المحلي؛ قد يكون الـ API فارغًا أو CORS يمنع الطلبات. |
| الأدمن لا يقبل الدخول | تأكد من البريد/كلمة المرور الافتراضيين أعلاه، أو من متغيرات Vercel بعد إعادة النشر. |
| جوجل لا يعمل | تحقق من `VITE_GOOGLE_CLIENT_ID` ومن **Authorized JavaScript origins** لنفس الدومين. |

---

## الترخيص والعلامة

المحتوى والتصميم مخصصان لعلامة **Elite Furniture**. راجع سياساتك القانونية قبل النشر العام.

للدعم التقني: راجع الكود في `src/services` و `src/pages`.
