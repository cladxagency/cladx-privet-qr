# CLADx Privet QR

**Package version: 1.1.1**

تحديث محدد مبني على الإصدار المستقر 1.0.2. تم الحفاظ على بنية Cloudflare Pages وواجهات API الحالية، مع إضافة واجهة إدارة موسعة وأنواع QR إضافية وتتبع المسح.

## المزايا المضافة في 1.1.0

- شاشة دخول ممتدة ومتجاوبة: شعار CLADx في الهيدر، رسم توضيحي QR، تبديل اللغة واللون، وتذييل Developed by CLADx.
- شعار `logo.webp` في القائمة الجانبية، قائمة سفلية للهاتف، إغلاق القائمة بالنقر خارجها، وقائمة حساب جانبية.
- أحدث ثلاثة رموز في Overview، ومكتبة كاملة مع بحث وتعديل ونسخ وحذف وتفعيل/إيقاف.
- أنواع QR: Link وPhone وText وBank details وApp وSmart map وVideo Marketing وMulti Payments.
- معرّف قصير مقترح من اسم QR بحروف لاتينية مع أربعة أرقام، ويمكن تخصيصه.
- إعدادات ألوان مستقلة للنقاط وإطار وعلامة مركز نقاط QR والخلفية، خلفية شفافة، أنماط متعددة، وخيارات شعار وحجم.
- تنزيل PNG وSVG وWEBP وPDF ومشاركة الرابط مع عنوان QR.
- معاينة صفحة Multi Payments لحظيًا؛ عمود واحد على الهاتف وعمودان على الكمبيوتر.
- صفحات عامة للبيانات البنكية وMulti Payments وVideo Marketing وApp وSmart map، مع شعار CLADx وتذييل Provided by CLADx.
- تتبع زيارات روابط QR وإحصاءات إجمالية حسب النوع، وتنبيهات للمسح ومراحل 50 و100 و500 و1000 و5000.
- Backup now يجمع بيانات KV والتخزين المحلي، واستعادة من نسخة الاستضافة، مع الاستيراد والتصدير.
- `manifest.json` وService Worker لتسهيل تثبيت الواجهة باسم Our QR.

## أنواع الوجهات

- **Link:** يوجّه مباشرة إلى رابط HTTP أو HTTPS.
- **Phone:** يفتح تطبيق الاتصال برقم الهاتف.
- **Text:** يعرض النص ويحاول نسخه تلقائيًا، مع زر نسخ يدوي احتياطيًا؛ المتصفحات قد تمنع النسخ التلقائي دون تفاعل.
- **Bank details:** صفحة بيانات مع زر نسخ لكل حقل.
- **App:** يختار Apple App Store أو Google Play أو Other devices حسب نوع الجهاز، ثم يستخدم أول رابط صالح كخيار احتياطي.
- **Smart map:** يطلب إذن الموقع ويختار أقرب فرع من الفروع التي تحتوي على إحداثيات؛ عند رفض GPS أو عدم توافر إحداثيات يستخدم أول فرع.
- **Video Marketing:** صفحة متجاوبة تعرض تضمين الفيديو مع تشغيل تلقائي صامت ومحاولة تشغيل فوري.
- **Multi Payments:** صفحة روابط دفع، عمود واحد على الهاتف وعمودان على الشاشات الأكبر.

## ملاحظات مهمة حول منصات الفيديو والمتصفح

لا يمكن للتطبيق ضمان إزالة إعلانات YouTube أو Facebook أو Instagram أو TikTok؛ الإعلانات وسياسات العرض تتحكم فيها المنصة نفسها. كذلك قد تمنع المنصة تضمين بعض الفيديوهات أو تتطلب تسجيل دخول، وقد تمنع أنظمة الهاتف التشغيل التلقائي بالصوت. التطبيق يطلب التشغيل التلقائي الصامت حيث تسمح المنصة والمتصفح، مع إبقاء عناصر التحكم عند استخدام ملف فيديو مباشر.

## النشر على Cloudflare Pages

1. ارفع ملفات `public` و`functions` إلى جذر مستودع GitHub.
2. استخدم Framework preset: `None`، وBuild command: `exit 0`، وBuild output directory: `public`.
3. ملف `wrangler.toml` غير مرفق عمدًا في هذه الحزمة لحماية إعدادات الربط الحالية. احتفظ بملف `wrangler.toml` الموجود في مستودعك كما هو، ولا تحذفه أو تستبدله. **لا تستبدل Namespace ID الحقيقي ولا تحذف إعداد `[[kv_namespaces]]` الذي ربطت به KV.**
4. يجب أن يكون اسم الـ KV binding هو `QR_KV`.
5. احتفظ بأسرار Cloudflare الحالية `ADMIN_PASSWORD` و`SESSION_SECRET` كما هي.
6. نفّذ Deploy جديدًا بعد رفع الملفات.

## بيانات التحليلات والتنبيهات

- كل طلب ناجح إلى `/go/:id` يسجل حدث مسح في KV مع اسم الرمز ونوعه والوقت وفئة الجهاز والبلد عند توفره ومرجع الصفحة السابقة إن وُجد.
- لا يتم تخزين عنوان IP في سجل المسح.
- يتم إنشاء إشعار لكل مسح، وإشعار إضافي عند بلوغ 50 و100 و500 و1000 و5000 مسح للرمز.
- بيانات السجل والتنبيهات محفوظة في KV دون مدة انتهاء محددة في هذا الإصدار. راجع استهلاك KV وسياسات الاحتفاظ عند ارتفاع حجم الاستخدام.
- عداد المسح مبني على قراءة ثم كتابة KV، لذلك قد لا يكون دقيقًا تمامًا عند وصول عدد كبير من المسحات المتزامنة في اللحظة نفسها؛ KV ليست قاعدة بيانات معاملات ذرية.

## النسخ الاحتياطي

- `Backup now` يدمج سجلات السحابة والتخزين المحلي، ويحفظ النسخة في KV والمتصفح.
- `Restore from hosting` يستعيد آخر نسخة سحابية إلى KV والتخزين المحلي.
- يمكن أيضًا تنزيل نسخة JSON أو استيراد نسخة سابقة.
- استخدم النسخ الاحتياطي قبل أي تحديث أو تعديل جماعي.

## ملفات الهوية

- `assets/logo.webp`: شعار CLADx الكامل.
- `assets/cladx-mark.webp`: العلامة المختصرة القديمة.
- `assets/qr-cladx-logo-icon.webp`: شعار منتصف QR.
- `assets/favicon.webp`: favicon وPWA icon.
- `assets/notifications.webp`: رمز الإشعارات.

## تحقق ما بعد النشر

1. سجل الدخول.
2. أنشئ QR من كل نوع على حدة، وتأكد من ظهور الرابط المختصر وحفظه في KV.
3. افتح `/go/<id>` من جهاز آخر وتحقق من الوجهة.
4. افتح Overview وتحقق من ظهور الإحصاءات بعد المسح.
5. تحقق من وصول إشعار للمسح.
6. اختبر Backup now ثم Restore from hosting.
7. اختبر التثبيت من قائمة المتصفح على الهاتف؛ ظهور اقتراح التثبيت يعتمد على دعم المتصفح وشروطه.


## v1.1.1 — targeted fixes
- Fixed QR type switching by retaining the selected type and unsaved type-specific draft fields.
- New QR actions now open a clean create form; saved QR records return to the refreshed library.
- Preserved custom short-link IDs through type changes and on save.
- Added live destination-page previews for bank, app, video and multi-payment QR types above the QR preview.
- Added a transparent-background preview indicator and sticky desktop preview column.
- Added branded, distinct unavailable pages for paused and deleted QR records.
