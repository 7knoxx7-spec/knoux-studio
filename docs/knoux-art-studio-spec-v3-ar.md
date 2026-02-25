# 🏆 Knoux Art Studio - المواصفات الفنية الشاملة
## الإصدار 3.0 | التاريخ: 23 فبراير 2026

---

## 📑 فهرس المحتويات
1. [نظرة عامة على المشروع](#1-نظرة-عامة-على-المشروع)
2. [الفلسفة والرؤية](#2-الفلسفة-والرؤية)
3. [هيكل المشروع الكامل](#3-هيكل-المشروع-الكامل)
4. [المحركات الأساسية](#4-المحركات-الأساسية)
5. [نظام واجهات المستخدم](#5-نظام-واجهات-المستخدم)
6. [قاعدة البيانات والنماذج](#6-قاعدة-البيانات-والنماذج)
7. [نظام المصادقة والأمان](#7-نظام-المصادقة-والأمان)
8. [نظام الذكاء الاصطناعي](#8-نظام-الذكاء-الاصطناعي)
9. [محرر الصور](#9-محرر-الصور)
10. [محرر الفيديو](#10-محرر-الفيديو)
11. [نظام القوالب والمؤثرات](#11-نظام-القوالب-والمؤثرات)
12. [نظام التعاون الجماعي](#12-نظام-التعاون-الجماعي)
13. [نظام التحليلات](#13-نظام-التحليلات)
14. [نظام الأدوار والصلاحيات](#14-نظام-الأدوار-و-الصلاحيات)
15. [نظام المشاركة والتصدير](#15-نظام-المشاركة-والتصدير)
16. [الواجهات المتبقية](#16-الواجهات-المتبقية)
17. [خارطة الطريق](#17-خارطة-الطريق)
18. [معايير الجودة والأداء](#18-معايير-الجودة-والأداء)
19. [دليل المساهمين](#19-دليل-المساهمين)
20. [الملاحق](#20-الملاحق)

---

## 1. نظرة عامة على المشروع

### 1.1 تعريف المشروع
**Knoux Art Studio** هو تطبيق ويب متكامل لتحرير الصور والفيديو، يتميز بالعمل الكامل بدون إنترنت (Offline-First)، مع خصوصية مطلقة للمستخدم، وأدوات ذكاء اصطناعي متقدمة تعمل محلياً.

### 1.2 الأهداف الرئيسية
- ✅ **الخصوصية المطلقة**: كل شيء على جهاز المستخدم، لا خوادم خارجية
- ✅ **العمل بدون إنترنت**: تشغيل كامل في وضع الطيران
- ✅ **أدوات احترافية**: تنافس Adobe Photoshop و Premiere
- ✅ **دعم العربية**: واجهة RTL كاملة للمتحدثين بالعربية
- ✅ **الذكاء الاصطناعي المحلي**: نماذج تعمل على جهاز المستخدم

### 1.3 التقنيات المستخدمة
| التقنية | الاستخدام |
|---------|-----------|
| Next.js 16 | إطار العمل الرئيسي |
| TypeScript 5 | لغة البرمجة |
| Tailwind CSS 4 | التصميم والتنسيق |
| Framer Motion | الحركات والانتقالات |
| Fabric.js | معالجة الصور والرسم |
| FFmpeg.wasm | معالجة الفيديو |
| Prisma | ORM لقاعدة البيانات |
| NextAuth.js | المصادقة |
| Zustand | إدارة الحالة |
| React Hook Form | إدارة النماذج |
| Zod | التحقق من صحة البيانات |

### 1.4 المتطلبات الأساسية
- Node.js 20+
- Bun 1.3+
- 4GB RAM على الأقل
- متصفح حديث (Chrome 120+, Firefox 115+, Safari 17+)
- دعم WebGL2 (لتسريع GPU)

---

## 2. الفلسفة والرؤية

### 2.1 الشعار الأساسي
> **"الأمان ليس رفاهية، إنه حياة"**

### 2.2 المبادئ التوجيهية
1. **الخصوصية بالتصميم** - لا نجمع بيانات، لا نتتبع، لا نبيع
2. **المستخدم أولاً** - كل قرار يصب في مصلحة المستخدم
3. **البساطة والقوة** - سهل للمبتدئين، قوي للمحترفين
4. **الاستدامة** - أداء عالي مع استهلاك منخفض للموارد

### 2.3 الجمهور المستهدف
- المصممون المحترفون
- منشئو المحتوى على السوشيال ميديا
- الطلاب والمعلمون
- الهواة والمبتدئون
- الشركات الناشئة

---

## 3. هيكل المشروع الكامل

### 3.1 الهيكل التنظيمي للمجلدات
```text
knoux-art-studio/
├── .github/                    # إعدادات GitHub
│   ├── workflows/              # CI/CD pipelines
│   └── ISSUE_TEMPLATE/         # قوالب المشكلات
├── public/                      # الملفات الثابتة
│   ├── fonts/                   # الخطوط المخصصة
│   ├── icons/                   # الأيقونات
│   ├── luts/                     # ملفات LUT
│   ├── sounds/                   # المؤثرات الصوتية
│   └── templates/                # القوالب الجاهزة
├── src/                          # الكود المصدري
│   ├── ai/                        # نظام الذكاء الاصطناعي
│   │   ├── engine/                # محرك AI
│   │   │   ├── AICore.ts
│   │   │   ├── GPUAccelerator.ts
│   │   │   └── ModelManager.ts
│   │   └── services/              # خدمات AI خارجية
│   │       ├── OpenAIService.ts
│   │       ├── StabilityService.ts
│   │       └── LocalService.ts
│   ├── app/                        # Next.js App Router
│   │   ├── api/                    # API routes
│   │   │   ├── auth/               # المصادقة
│   │   │   ├── projects/           # المشاريع
│   │   │   └── ai/                  # الذكاء الاصطناعي
│   │   ├── (auth)/                  # صفحات المصادقة
│   │   ├── (dashboard)/              # لوحة التحكم
│   │   └── layout.tsx                # التخطيط الرئيسي
│   ├── components/                  # المكونات
│   │   ├── ui/                       # مكونات واجهة مشتركة
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── Dialog/
│   │   │   └── ...
│   │   ├── layout/                    # مكونات التخطيط
│   │   ├── screens/                    # شاشات التطبيق
│   │   │   ├── SplashScreen.tsx
│   │   │   ├── OnboardingScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── PhotoEditorScreen.tsx
│   │   │   ├── VideoEditorScreen.tsx
│   │   │   ├── SettingsScreen.tsx
│   │   │   ├── HelpScreen.tsx
│   │   │   └── ElysianCanvasScreen.tsx
│   │   ├── photo-editor/              # مكونات محرر الصور
│   │   │   ├── CanvasEngine.ts
│   │   │   ├── Toolbar/
│   │   │   ├── Panels/
│   │   │   └── Dialogs/
│   │   └── video-editor/              # مكونات محرر الفيديو
│   │       ├── VideoEngine.ts
│   │       ├── Timeline/
│   │       ├── Panels/
│   │       └── Export/
│   ├── lib/                         # مكتبات ووظائف مساعدة
│   │   ├── store/                    # إدارة الحالة
│   │   ├── hooks/                     # React hooks مخصصة
│   │   ├── utils/                     # دوال مساعدة
│   │   ├── canvas/                     # دوال معالجة الصور
│   │   ├── video/                       # دوال معالجة الفيديو
│   │   ├── audio/                       # دوال معالجة الصوت
│   │   ├── effects/                     # تأثيرات متنوعة
│   │   ├── luts/                        # مكتبة LUT
│   │   ├── i18n/                        # الترجمة
│   │   ├── auth.ts                       # المصادقة
│   │   ├── db.ts                         # قاعدة البيانات
│   │   ├── prisma.ts                     # عميل Prisma
│   │   └── milestones.ts                  # نظام الإنجازات
│   └── styles/                       # أنماط عامة
│       ├── globals.css
│       ├── themes/
│       └── animations/
├── prisma/                          # مخطط قاعدة البيانات
│   └── schema.prisma
├── scripts/                         # سكربتات مساعدة
├── tests/                           # اختبارات
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example                     # نموذج المتغيرات البيئية
├── next.config.ts                    # إعدادات Next.js
├── tailwind.config.ts                 # إعدادات Tailwind
├── tsconfig.json                      # إعدادات TypeScript
├── package.json                       # الاعتماديات
└── README.md                          # دليل المشروع
```

### 3.2 الإحصائيات الحالية (مكتوب)
| الفئة | عدد الملفات | حالة الإنجاز |
|-------|-------------|--------------|
| المحركات الأساسية | 4 ملفات | ✅ مكتمل |
| شاشات التطبيق | 8 شاشات | ✅ مكتمل |
| مكونات واجهة | 30+ مكون | ✅ مكتمل |
| نظام الصوت | 2 ملفات | ✅ مكتمل |
| نظام الذكاء الاصطناعي | 5 ملفات | ✅ مكتمل |
| نظام المصادقة | 3 ملفات | ✅ مكتمل |
| قاعدة البيانات | 1 ملف | ✅ مكتمل |
| الترجمة | 1 ملف | ✅ مكتمل |
| **الإجمالي** | **54+ ملف** | **مكتمل 85%** |

### 3.3 الملفات الناقصة (15%)
| الملف | المسار | الأولوية |
|-------|--------|----------|
| CurvesPanel.tsx | `src/components/photo-editor/Panels/CurvesPanel.tsx` | 🔴 عالية |
| LevelsPanel.tsx | `src/components/photo-editor/Panels/LevelsPanel.tsx` | 🔴 عالية |
| HSLPanel.tsx | `src/components/photo-editor/Panels/HSLPanel.tsx` | 🔴 عالية |
| CommentsPanel.tsx | `src/components/video-editor/Panels/CommentsPanel.tsx` | 🟡 متوسطة |
| CollaborationBar.tsx | `src/components/video-editor/CollaborationBar.tsx` | 🟡 متوسطة |
| ColorGradingPanel.tsx | `src/components/video-editor/Panels/ColorGradingPanel.tsx` | 🔴 عالية |
| AudioPanel.tsx | `src/components/video-editor/Panels/AudioPanel.tsx` | 🟢 منخفضة |
| TextPanel.tsx | `src/components/video-editor/Panels/TextPanel.tsx` | 🟢 منخفضة |

---

## 4. المحركات الأساسية

### 4.1 CanvasEngine.ts (مكتمل ✅)
**المسار:** `src/lib/canvas/CanvasEngine.ts`
**الوظيفة:** محرك معالجة الصور باستخدام Fabric.js

#### الواجهات (Interfaces)
```typescript
export interface CanvasObject {
  id: string;
  type: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  data: fabric.Object;
}

export type AdjustmentValues = {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  exposure: number;
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;
  clarity: number;
  vibrance: number;
  temperature: number;
  tint: number;
  sharpness: number;
  noise: number;
  vignette: number;
};

export type ToolType = 
  | 'select' | 'move' | 'crop' | 'rotate' 
  | 'brush' | 'eraser' | 'clone' | 'heal' 
  | 'text' | 'shape' | 'gradient' | 'eyedropper' 
  | 'zoom' | 'pan';
```

#### الدوال الرئيسية
| الدالة | الوصف | الحالة |
|--------|-------|--------|
| `initialize()` | تهيئة الكانفس | ✅ |
| `loadImage()` | تحميل صورة | ✅ |
| `applyAdjustments()` | تطبيق التعديلات | ✅ |
| `applyFilter()` | تطبيق فلتر | ✅ |
| `setActiveTool()` | تغيير الأداة | ✅ |
| `addText()` | إضافة نص | ✅ |
| `addShape()` | إضافة شكل | ✅ |
| `undo()` / `redo()` | تراجع وإعادة | ✅ |
| `exportImage()` | تصدير الصورة | ✅ |

### 4.2 VideoEngine.ts (مكتمل ✅)
**المسار:** `src/lib/video/VideoEngine.ts`
**الوظيفة:** محرك معالجة الفيديو مع FFmpeg.wasm

#### الواجهات (Interfaces)
```typescript
export interface VideoClip {
  id: string;
  type: 'video' | 'audio' | 'image' | 'text';
  name: string;
  src: string;
  startTime: number;
  duration: number;
  trimmedDuration: number;
  track: number;
  volume?: number;
  speed?: number;
  transform?: {
    scale?: number;
    rotation?: number;
    position?: { x: number; y: number };
    opacity?: number;
  };
}

export interface VideoTrack {
  id: string;
  index: number;
  name: string;
  type: 'video' | 'audio' | 'text' | 'overlay';
  clips: VideoClip[];
  muted?: boolean;
  locked?: boolean;
  volume?: number;
}

export interface VideoEffect {
  id: string;
  type: 'blur' | 'sharpen' | 'glitch' | 'vintage' | 'cinematic' | 'chroma';
  intensity: number;
  startTime: number;
  endTime: number;
}
```

#### الدوال الرئيسية
| الدالة | الوصف | الحالة |
|--------|-------|--------|
| `loadVideo()` | تحميل فيديو | ✅ |
| `loadAudio()` | تحميل صوت | ✅ |
| `splitClip()` | تقسيم مقطع | ✅ |
| `trimClip()` | قص مقطع | ✅ |
| `setClipSpeed()` | تغيير السرعة | ✅ |
| `addEffect()` | إضافة تأثير | ✅ |
| `renderFrame()` | رسم الإطار الحالي | ✅ |
| `exportVideo()` | تصدير الفيديو | ✅ |

### 4.3 AudioEngine.ts (مكتمل ✅)
**المسار:** `src/lib/audio/AudioEngine.ts`
**الوظيفة:** معالجة الصوت والمؤثرات الصوتية

#### الواجهات
```typescript
export interface AudioEffect {
  id: string;
  name: string;
  nameAr: string;
  category: AudioEffectCategory;
  duration: number;
  icon: string;
  tags: string[];
  favorite?: boolean;
}

export type AudioEffectCategory = 
  | 'transition' | 'whoosh' | 'impact' | 'ambient' 
  | 'nature' | 'cinematic' | 'horror' | 'interface';
```

#### الدوال الرئيسية
| الدالة | الوصف | الحالة |
|--------|-------|--------|
| `playEffect()` | تشغيل مؤثر | ✅ |
| `stopEffect()` | إيقاف مؤثر | ✅ |
| `adjustVolume()` | تعديل الصوت | ✅ |
| `addFade()` | إضافة تلاشي | ✅ |
| `getWaveform()` | الحصول على الموجة الصوتية | ✅ |

---

## 5. نظام واجهات المستخدم

### 5.1 نظام الألوان (مكتمل ✅)
```css
:root {
  /* الألوان الذهبية */
  --gold-primary: #D4AF37;
  --gold-light: #FDB931;
  --gold-dark: #B8860B;
  
  /* الألوان الخشبية */
  --wood-dark: #2c1810;
  --wood-medium: #5d3e1f;
  --wood-light: #8b5a2b;
  
  /* ألوان النص */
  --text-primary: #ffffff;
  --text-secondary: #c69c6d;
  --text-muted: #8b5a2b;
  
  /* ألوان الحالة */
  --success: #22c55e;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
}
```

### 5.2 نظام الخطوط (مكتمل ✅)
- **العربية:** Noto Sans Arabic (أوزان: 300, 400, 500, 600, 700)
- **الإنجليزية:** Inter (أوزان: 300, 400, 500, 600, 700)
- **العناوين:** Cinzel (للمناسبات الخاصة)

### 5.3 مكونات واجهة مشتركة (مكتمل ✅)
| المكون | الوصف | الملفات |
|--------|-------|---------|
| Button | زر قابل للتخصيص | `ui/button.tsx` |
| Card | بطاقة محتوى | `ui/card.tsx` |
| Dialog | نافذة منبثقة | `ui/dialog.tsx` |
| Tooltip | تلميحات | `ui/tooltip.tsx` |
| Slider | شريط تمرير | `ui/slider.tsx` |
| Tabs | تبويبات | `ui/tabs.tsx` |
| Dropdown | قائمة منسدلة | `ui/dropdown-menu.tsx` |
| Notification | إشعارات | `ui/notification.tsx` |

---

## 6. قاعدة البيانات والنماذج

### 6.1 مخطط قاعدة البيانات (مكتمل ✅)
**المسار:** `prisma/schema.prisma`

```prisma
// 👤 USER MODEL
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String?
  name          String?
  image         String?
  provider      String    @default("credentials")
  
  projects      Project[]
  settings      Settings?
  roles         UserRole[]
  analytics     Analytics[]
  templates     Template[]
  purchases     Purchase[]
  reviews       Review[]
  collaborations Collaboration[]
  comments      Comment[]
  versions      Version[]
  notifications Notification[]
  shares        Share[]
  assets        Asset[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

// 📁 PROJECT MODEL
model Project {
  id            String    @id @default(cuid())
  title         String
  description   String?
  type          String    // "photo" أو "video"
  data          String    // JSON string
  thumbnail     String?
  width         Int       @default(1920)
  height        Int       @default(1080)
  isPublic      Boolean   @default(false)
  shareId       String?   @unique
  
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  shares        Share[]
  analytics     Analytics[]
  collaborations Collaboration[]
  comments      Comment[]
  versions      Version[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

// ⚙️ SETTINGS MODEL
model Settings {
  id            String    @id @default(cuid())
  theme         String    @default("dark")
  accentColor   String    @default("#D4AF37")
  fontSize      String    @default("medium")
  gpuAcceleration Boolean @default(true)
  aiEnabled     Boolean   @default(true)
  secureMode    Boolean   @default(false)
  autoSave      Boolean   @default(true)
  
  userId        String    @unique
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// المزيد من النماذج (تحليلات، أدوار، قوالب، مشاركة، إلخ)
```

### 6.2 العلاقات الرئيسية
- User 1 --- * Projects
- User 1 --- 1 Settings
- User * --- * Roles (through UserRole)
- Project 1 --- * Comments
- Project 1 --- * Versions
- User * --- * Templates (through Purchase)

---

## 7. نظام المصادقة والأمان

### 7.1 طرق تسجيل الدخول (مكتمل ✅)
- ✅ البريد الإلكتروني وكلمة المرور
- ✅ Google OAuth
- ✅ GitHub OAuth
- ✅ Apple ID (مستقبلاً)

### 7.2 ميزات الأمان
| الميزة | الوصف | الحالة |
|--------|-------|--------|
| تشفير bcrypt | لكلمات المرور | ✅ |
| JWT Tokens | للجلسات | ✅ |
| Secure Mode | تشفير AES-256 للمشاريع | ✅ |
| Duress Password | كلمة مرور الإكراه | ✅ |
| Auto-lock | قفل تلقائي بعد فترة | ✅ |
| Secure Delete | حذف آمن (3-pass) | ✅ |

### 7.3 SecureMode (مكتمل ✅)
**المسار:** `src/components/editor/SecureModeDialog.tsx`

```typescript
interface SecureModeState {
  state: 'disabled' | 'enabled' | 'locked';
  passwordSet: boolean;
  duressPasswordSet: boolean;
  lastUnlockTime: Date | null;
  autoLockMinutes: number;
}
```

---

## 8. نظام الذكاء الاصطناعي

### 8.1 AICore.ts (مكتمل ✅)
**المسار:** `src/ai/engine/AICore.ts`
**الوظيفة:** المحرك الرئيسي للذكاء الاصطناعي

#### المهام المدعومة
```typescript
export type AITask = 
  | 'generateVideo' | 'generateImage' | 'generateMusic' 
  | 'cloneVoice' | 'translate' | 'upscale' | 'denoise' 
  | 'colorize' | 'styleTransfer' | 'inpainting' 
  | 'outpainting' | 'textToSpeech' | 'speechToText' | 'summarize';
```

#### الخدمات المتصلة
| الخدمة | الوظيفة | الحالة |
|--------|---------|--------|
| OpenAI | GPT-4, DALL-E, Whisper | ✅ |
| Stability AI | Stable Diffusion | ✅ |
| ElevenLabs | توليد الصوت | ✅ |
| Runway ML | توليد الفيديو | ✅ |
| Local Models | نماذج محلية | ✅ |

### 8.2 النماذج المحلية (مكتمل ✅)
| النموذج | الحجم | الوظيفة |
|---------|-------|---------|
| Real-ESRGAN | 64 MB | تكبير الصور |
| Whisper | 750 MB | تحويل الكلام إلى نص |
| MusicGen | 1.5 GB | توليد موسيقى |
| RIFE | 100 MB | إطارات بينية للفيديو |

---

## 9. محرر الصور

### 9.1 المكونات الموجودة (مكتمل ✅)
```text
src/components/photo-editor/
├── CanvasEngine.ts           # محرك الصور (550+ سطر)
├── Toolbar/
│   ├── TopToolbar.tsx        # شريط الأدوات العلوي
│   ├── LeftToolbar.tsx       # الشريط الجانبي
│   └── ToolButton.tsx        # زر أداة
├── Panels/
│   ├── LayersPanel.tsx       # لوحة الطبقات
│   ├── FiltersPanel.tsx      # لوحة الفلاتر
│   ├── QuickAdjustPanel.tsx  # تعديلات سريعة
│   └── AIPanel.tsx           # لوحة الذكاء الاصطناعي
└── Dialogs/
    └── ExportDialog.tsx      # حوار التصدير
```

### 9.2 المكونات الناقصة (🔴 عاجل)
```typescript
// src/components/photo-editor/Panels/CurvesPanel.tsx
export interface CurvePoint {
  x: number;  // 0-255
  y: number;  // 0-255
}

export interface CurveChannel {
  points: CurvePoint[];
  color: string;
  visible: boolean;
}

// الوظائف المطلوبة:
- رسم المنحنيات على canvas
- إضافة/إزالة نقاط
- سحب النقاط
- حفظ القنوات (RGB, Red, Green, Blue)
```

```typescript
// src/components/photo-editor/Panels/LevelsPanel.tsx
export interface LevelsState {
  shadows: number;        // 0-255
  midtones: number;       // 0.1-2.0
  highlights: number;     // 0-255
  outputShadows: number;  // 0-255
  outputHighlights: number; // 0-255
}

// الوظائف المطلوبة:
- رسم الهيستوجرام
- تحكم في الظلال والهايلايت
- معاينة حية
```

```typescript
// src/components/photo-editor/Panels/HSLPanel.tsx
export interface HSLValues {
  hue: number;        // -180 إلى 180
  saturation: number; // -100 إلى 100
  luminance: number;  // -100 إلى 100
}

export interface HSLColorValues {
  red: HSLValues;
  orange: HSLValues;
  yellow: HSLValues;
  green: HSLValues;
  cyan: HSLValues;
  blue: HSLValues;
  purple: HSLValues;
  magenta: HSLValues;
}

// الوظائف المطلوبة:
- تحكم في 8 ألوان مستقلة
- معاينة حية
- إعدادات مسبقة
```

### 9.3 أدوات الصور المدعومة (مكتمل ✅)
| الأداة | الوظيفة |
|--------|---------|
| Select | تحديد العناصر |
| Move | تحريك |
| Crop | قص |
| Rotate | تدوير |
| Brush | فرشاة |
| Eraser | ممحاة |
| Clone | استنساخ |
| Heal | إصلاح |
| Text | نص |
| Shape | أشكال |
| Gradient | تدرج |
| Eyedropper | قطارة |
| Zoom | تكبير |
| Pan | تحريك |

### 9.4 الفلاتر المدعومة (مكتمل ✅)
| الفئة | الفلاتر |
|-------|---------|
| أساسية | Vintage, BW, Sepia, Warm, Cool, Dramatic, Fade, Vivid, Matte |
| سينمائية | Cinematic, Hollywood, Teal-Orange, Bleach |
| فنية | Watercolor, Oil, Sketch, Pop Art |
| رجعية | 70s, 80s, 90s, Polaroid |

---

## 10. محرر الفيديو

### 10.1 المكونات الموجودة (مكتمل ✅)
```text
src/components/video-editor/
├── VideoEngine.ts              # محرك الفيديو (400+ سطر)
├── VideoCanvas.tsx             # معاينة الفيديو
├── Timeline/
│   ├── Timeline.tsx            # الخط الزمني الرئيسي
│   ├── TimelineClip.tsx        # مقطع فيديو
│   ├── TimelineRuler.tsx       # مسطرة الوقت
│   └── TimelineTrack.tsx       # مسار واحد
├── Panels/
│   ├── MediaPanel.tsx          # مكتبة الوسائط
│   ├── VideoEffectsPanel.tsx   # تأثيرات الفيديو
│   └── TransitionsPanel.tsx    # انتقالات
└── Export/
    └── VideoExportDialog.tsx   # تصدير الفيديو
```

### 10.2 المكونات الناقصة (🔴 عاجل)
```typescript
// src/components/video-editor/Panels/ColorGradingPanel.tsx
export interface ColorGrading {
  exposure: number;      // -2.0 إلى 2.0
  contrast: number;      // -100 إلى 100
  highlights: number;    // -100 إلى 100
  shadows: number;       // -100 إلى 100
  whites: number;        // -100 إلى 100
  blacks: number;        // -100 إلى 100
  temperature: number;   // -100 إلى 100 (بارد/دافئ)
  tint: number;          // -100 إلى 100 (أخضر/أرجواني)
  saturation: number;    // 0 إلى 200
  vibrance: number;      // 0 إلى 100
}

export interface ColorWheel {
  hue: number;           // 0-360
  saturation: number;    // 0-100
  luminance: number;     // 0-100
}

// الوظائف المطلوبة:
- تحكم في كل معاملات الألوان
- عجلات ألوان (Shadows, Midtones, Highlights)
- LUTs مخصصة
- معاينة حية
```

