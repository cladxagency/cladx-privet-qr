# CLADx Privet QR

**Package version: 1.0.2**

نظام إدارة QR ديناميكي خاص بوكالة CLADx، مبني باستخدام HTML وCSS وJavaScript، مع Cloudflare Pages Functions وCloudflare KV.

## المميزات
- لوحة تحكم خاصة على المسار `/` ومحمية بكلمة مرور محفوظة في Cloudflare Secrets.
- روابط ديناميكية ثابتة على المسار `/go/:id`؛ تغيير الوجهة أو التصميم لا يغيّر المعرّف.
- خمسة أنواع: رابط، نص، رقم هاتف، بيانات حساب بنكي، وصفحة دفع متعددة الوسائل.
- تخصيص ألوان النقاط والزوايا والخلفية ونمط QR وإضافة شعار CLADx في المنتصف.
- إضافة خانات بنكية مخصصة، وشعار ورابط لكل وسيلة دفع.
- تنزيل QR بصيغتي PNG وSVG.
- إنشاء QR والرابط الديناميكي معًا، مع رابط مختصر ثابت وإمكانية نسخ الرابط وتنزيل QR بصيغتي PNG وSVG.
- تعديل وحذف وإدارة السجلات، مع تخزين مؤقت محلي ونسخ احتياطي سحابي ومحلي موحّد، واستعادة من Cloudflare KV، واستيراد وتصدير JSON.
- واجهة متجاوبة للهاتف والتابلت والكمبيوتر.

## هيكل النشر
- `public/`: ملفات الموقع الثابتة التي ينشرها Cloudflare Pages.
- `functions/`: Pages Functions للـ API وتوجيه روابط QR والنسخ الاحتياطي السحابي؛ يظل في جذر المستودع ولا تنقله داخل `public`.
- `wrangler.toml`: إعداد Pages، ومثال اختياري لربط KV باستخدام Namespace ID.

## إعداد Cloudflare Pages عبر GitHub
1. ارفع كل محتويات هذا المجلد إلى جذر GitHub Repository، مع الحفاظ على مجلدي `public` و`functions`.
2. في Cloudflare افتح Workers & Pages → Create application → Pages → Connect to Git، واختر المستودع.
3. Framework preset: `None`.
4. Build command: `exit 0`.
5. Build output directory: `public`.
6. Root directory: اتركه فارغًا لأن ملفات المشروع في جذر المستودع.
7. احفظ الإعدادات ونفّذ Deploy.

## إنشاء KV وربطه
1. افتح Workers & Pages → Storage & databases → KV.
2. أنشئ Namespace باسم `cladx-privet-qr`.
3. افتح مشروع Pages → Settings → Bindings → Production → Add → KV namespace.
4. Variable name: `QR_KV`.
5. اختر Namespace: `cladx-privet-qr`.
6. احفظ ثم نفّذ Redeploy.

**لو زر Add ظاهر باللون الرمادي أو غير قابل للضغط:** استخدم الربط من ملف الإعدادات بدلًا منه. افتح `wrangler.toml` الموجود في جذر المشروع، وأضف في آخره الأسطر التالية بعد استبدال القيمة بالـ Namespace ID الحقيقي الذي يظهر داخل صفحة KV في Cloudflare:

```toml
[[kv_namespaces]]
binding = "QR_KV"
id = "PASTE_REAL_KV_NAMESPACE_ID_HERE"
```

لا تضع اسم الـ Namespace (`cladx-privet-qr`) مكان الـ ID. احفظ الملف، ارفعه إلى GitHub، ثم انتظر Cloudflare Pages حتى ينفذ Deploy جديدًا. يجب أن يكون الربط موجودًا في إعدادات المشروع قبل اختبار الحفظ السحابي. إذا لم يقرأ Pages الربط من ملف Wrangler في إعدادات مشروعك، فستحتاج إلى حل صلاحيات/واجهة Cloudflare أو استخدام حساب لديه صلاحية إدارة Bindings؛ لا تعتبر إنشاء الـ Namespace وحده كافيًا.

## إصلاح تحذير Git disconnected
إذا ظهر `This project is disconnected from your Git account`:
1. افتح Pages project → Settings → Builds → Git Repository → Manage.
2. أعد تفويض/تثبيت Cloudflare GitHub App.
3. من GitHub → Settings → Applications → Installed GitHub Apps → Cloudflare Workers and Pages، تأكد أن المستودع ضمن Repository access.
4. ارجع إلى Cloudflare وادفع Commit جديدًا لاختبار التزامن.

إذا كان المشروع الأصلي من نوع Direct Upload، فلا يمكن تحويله إلى Git integration. يلزم إنشاء Pages project جديد من Connect to Git واختيار المستودع. لا تحذف المشروع القديم قبل التأكد من نجاح الجديد.

## أسرار تسجيل الدخول
من Pages → Settings → Variables and Secrets أضف في Production كـ Encrypted Secrets:
- `ADMIN_PASSWORD`: كلمة مرور قوية للوحة التحكم.
- `SESSION_SECRET`: مفتاح عشوائي مستقل لا يقل عن 32 حرفًا.

أضف القيم إلى Preview فقط إذا كنت ستختبر Preview deployments. بعد تغيير الأسرار نفّذ Deploy جديدًا.

## تحديث من الإصدار 1.0.1 بدون فقد ربط KV
عند رفع ملفات هذا الإصدار إلى المستودع، احتفظ بإعداد `wrangler.toml` الحالي إذا كان يحتوي بالفعل على `[[kv_namespaces]]` و`id` الحقيقي الخاص بـ KV. لا تستبدل هذا المعرّف بالتعليق التجريبي الموجود في نسخة القالب. يجب أن يظل الربط كما يلي:

```toml
[[kv_namespaces]]
binding = "QR_KV"
id = "REAL_EXISTING_NAMESPACE_ID"
```

إذا كان الربط مضافًا من لوحة Cloudflare وليس داخل ملف Wrangler، احتفظ بإعداد لوحة التحكم الحالي ولا تضف Namespace ثانية.

## النسخ الاحتياطي السحابي والمحلي
- زر `Backup now` يدمج سجلات KV ونسخة المتصفح المحلية، ثم يزامن السجلات إلى KV ويحفظ لقطة `backup:latest` داخل نفس الـ Namespace، ويحدّث التخزين المحلي.
- زر `Restore from hosting` يسترجع آخر لقطة من KV ويعيد كتابة سجلاتها إلى KV والتخزين المحلي. الاستعادة تدمج/تحدّث السجلات الموجودة ولا تحذف سجلات إضافية غير موجودة في اللقطة.
- يجب أن يكون Binding باسم `QR_KV` متاحًا في Production، وأن تنجح جلسة دخول المدير.

## اختبار ما بعد النشر
- افتح `/` وتأكد من ظهور شاشة تسجيل الدخول.
- سجّل الدخول بكلمة مرور `ADMIN_PASSWORD`.
- افتح `+ QR`، أنشئ تجربة من أحد الأنواع الخمسة، وتأكد من ظهور QR والرابط المختصر معًا.
- اختبر حفظ QR جديد؛ يجب أن ينجح الحفظ السحابي وليس المحلي فقط.
- افتح Backup & restore واضغط `Backup now`، ثم اختبر `Restore from hosting`.
- افتح `/api/auth/me` بعد تسجيل الدخول وفق جلسة التطبيق، واختبر `/go/<id>` لرابط تم إنشاؤه.
- إذا ظهر `KV binding QR_KV is missing` أو `Storage unavailable`، راجع Binding في Production ثم أعد النشر.

## ملاحظات مهمة
- Cloudflare KV هو مصدر البيانات المشترك والدائم، أما Local Storage فهو نسخة مؤقتة على نفس المتصفح.
- إذا تعذر الاتصال بالـ API، لا تعتبر التعديل محفوظًا سحابيًا إلا بعد ظهور رسالة نجاح الحفظ السحابي.
- الروابط لا تحتوي على تاريخ انتهاء تلقائي، لكنها تعتمد على استمرار المشروع والدومين وبيانات KV وعدم حذف السجل.
- صفحات الدفع تعرض وسائل وروابط الدفع فقط، ولا تعالج معاملات مالية ولا تخزن بيانات البطاقات.
- أي بيانات QR عامة يمكن لأي شخص يملك الرابط الوصول إليها؛ لا تضع كلمات مرور أو بيانات بنكية سرية أو معلومات حساسة داخلها.
- مكتبة إنشاء QR والخطوط يتم تحميلها من CDN خارجي.
