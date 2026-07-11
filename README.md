# iStore — مشروعين منفصلين + Supabase

تم تقسيم المشروع إلى **مشروعين منفصلين تمامًا**، كل واحد يترفع لوحده على Render، وبينهم قاعدة بيانات مشتركة على **Supabase**:

| المجلد | الوظيفة | الرابط بعد الرفع |
|---|---|---|
| `istore-frontend/` | متجر العرض اللي يشوفه الزبون (يعرض المنتجات فقط، قراءة فقط) | مثلاً: `istore-frontend.onrender.com` |
| `istore-admin/` | لوحة تحكم الأدمن (تسجيل دخول + إضافة/تعديل/حذف منتجات وأقسام) | مثلاً: `istore-admin.onrender.com` |
| `supabase/schema.sql` | ملف SQL واحد ينشئ كل الجداول والصلاحيات وباكت الصور | يتشغّل مرة واحدة جوه Supabase |

الفكرة: لوحة التحكم بتكتب في نفس قاعدة بيانات Supabase، والمتجر بيقرأ منها مباشرة (ولحظيًا عن طريق Realtime)، فأي منتج تضيفه من لوحة التحكم يظهر فورًا في المتجر من غير ما تلمس أي كود.

---

## الخطوة 1: تجهيز Supabase (قاعدة البيانات)

1. اعمل حساب / مشروع جديد على [supabase.com](https://supabase.com).
2. من **SQL Editor** جوه المشروع، افتح ملف `supabase/schema.sql` من هذا الريبو، وانسخ محتواه بالكامل، وشغّله (Run).
   - هيعمل جدول `categories` وجدول `products`.
   - هيفعّل Row Level Security بحيث: **القراءة مفتوحة للجميع** (عشان المتجر يقدر يعرض المنتجات من غير تسجيل دخول)، و**الكتابة (إضافة/تعديل/حذف) مسموحة فقط لمستخدم مسجّل دخول** (يعني الأدمن).
   - هيعمل Storage bucket اسمه `product-images` عام (public) لرفع صور المنتجات، مع صلاحيات مماثلة (قراءة للجميع، كتابة للمسجلين فقط).
   - هيفعّل Realtime على الجدولين عشان التحديثات تظهر فورًا في المتجر.
3. من **Authentication > Users > Add user**، اعمل حساب أدمن (إيميل + باسورد). ده هو اللي هيستخدمه صاحب المتجر لتسجيل الدخول على `istore-admin`.
4. من **Settings > API** خد نسختين:
   - `Project URL` → هيتحط في `VITE_SUPABASE_URL`
   - `anon public key` → هيتحط في `VITE_SUPABASE_ANON_KEY`

> ملاحظة: المشروع مبيتسجلش فيه غير الأدمن بحساب بريد إلكتروني تعمله انت بنفسك من لوحة Supabase؛ مفيش تسجيل حسابات عامة (وده مقصود لحماية لوحة التحكم).

---

## الخطوة 2: رفع المشروعين على GitHub

الأسهل: اعمل **ريبو واحد** فيه المجلدين `istore-frontend` و `istore-admin` جنب بعض (زي ما هما دلوقتي)، وعلى Render هتحدد لكل خدمة الـ **Root Directory** بتاعها. أو لو حابب تفصلهم في ريبوهين منفصلين تمامًا، ده كمان شغال عادي.

---

## الخطوة 3: رفع متجر العرض (istore-frontend) على Render

1. من Render Dashboard: **New > Static Site**.
2. اربطه بالريبو، وحدد **Root Directory**: `istore-frontend`.
3. Build Command: `npm install && npm run build`
4. Publish Directory: `dist`
5. في **Environment Variables** ضيف:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. مهم جدًا (SPA rewrite): في تبويب **Redirects/Rewrites** ضيف Rewrite Rule:
   - Source: `/*`
   - Destination: `/index.html`
   - (ده موجود جاهز في ملف `render.yaml` لو استخدمت "Blueprint" بدل الإعداد اليدوي)
7. Deploy. هيديك رابط زي `https://istore-frontend.onrender.com`.

---

## الخطوة 4: رفع لوحة التحكم (istore-admin) على Render

نفس الخطوات بالظبط، بس:
1. **New > Static Site** تاني، Root Directory: `istore-admin`.
2. Build Command: `npm install && npm run build`، Publish Directory: `dist`.
3. Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_STOREFRONT_URL` (اختياري) = رابط متجر العرض اللي طلع فوق، عشان يظهر زرار "عرض المتجر" جوه لوحة التحكم.
4. نفس الـ Rewrite Rule: `/*` → `/index.html`.
5. Deploy. هيديك رابط زي `https://istore-admin.onrender.com` — سجّل دخول بالإيميل والباسورد اللي عملتهم في خطوة Supabase.

---

## الخطوة 5: أول استخدام

1. افتح `istore-admin`، سجّل دخول.
2. روح تبويب **الأقسام** وأضف الأقسام الستة (آيفون، سماعات، ساعات، شواحن، كفرات، أندرويد) مع صورة لكل قسم.
3. روح تبويب **المنتجات** وابدأ ضيف منتجاتك بصورها الحقيقية.
4. افتح `istore-frontend` وهتلاقي كل حاجة ظاهرة فورًا.

---

## التشغيل محليًا (اختياري، للتجربة قبل الرفع)

```bash
# داخل istore-frontend أو istore-admin
cp .env.example .env    # واملأ القيم من Supabase
npm install
npm run dev
```

---

## ملاحظات مهمة

- الشات/الأسعار/سلة المشتريات في المتجر شغالة زي ما هي (بيانات محلية في المتصفح للزبون، مش محتاجة قاعدة بيانات).
- تم إلغاء لوحة التحكم القديمة المدمجة جوه المتجر (كانت بتحفظ في localStorage بتاع المتصفح بس، ومش متزامنة بين الأجهزة) — دلوقتي كل الإدارة بتتم من `istore-admin` وتتخزن في Supabase فعليًا وتظهر لكل الزوار.
- لو عايز تضيف أدمن تاني، زوّد مستخدم جديد من Supabase Authentication.
