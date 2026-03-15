import precisionHigh from "@/assets/machines/precision-high.png";
import productionLine from "@/assets/machines/production-line.png";
import glassWashing from "@/assets/machines/glass-washing.png";
import cncCutting from "@/assets/machines/cnc-cutting.png";
import cncEngraving from "@/assets/machines/cnc-engraving.png";
import storageRack from "@/assets/machines/storage-rack.png";
import temperingFurnace from "@/assets/machines/tempering-furnace.png";
import lineCutting from "@/assets/machines/line-cutting.png";

export interface Machine {
  id: string;
  image: string;
  name: { en: string; ar: string };
  subtitle: { en: string; ar: string };
  summary: { en: string; ar: string };
  category: string;
  benefits: { en: string[]; ar: string[] };
}

export const machines: Machine[] = [
  {
    id: "precision-edging-line",
    image: precisionHigh,
    name: { en: "Precision Edging Line", ar: "خط تشكيل الحواف الدقيق" },
    subtitle: { en: "Multi-Stage Glass Edge Processing System", ar: "نظام معالجة حواف الزجاج متعدد المراحل" },
    summary: { en: "High-speed multi-spindle edging line designed for continuous glass edge grinding, polishing, and finishing with exceptional precision and throughput.", ar: "خط تشكيل حواف عالي السرعة متعدد المغازل مصمم لجلخ وتلميع وتشطيب حواف الزجاج بدقة استثنائية وإنتاجية عالية." },
    category: "processing",
    benefits: { en: ["Multi-spindle precision", "Continuous processing", "Automated edge control", "High throughput"], ar: ["دقة متعددة المغازل", "معالجة مستمرة", "تحكم آلي بالحواف", "إنتاجية عالية"] },
  },
  {
    id: "tempering-furnace",
    image: temperingFurnace,
    name: { en: "Glass Tempering Furnace", ar: "فرن تقسية الزجاج" },
    subtitle: { en: "Advanced Thermal Processing System", ar: "نظام المعالجة الحرارية المتقدم" },
    summary: { en: "State-of-the-art tempering furnace with precise temperature control, uniform heating zones, and rapid cooling system for producing high-strength tempered glass.", ar: "فرن تقسية متطور بتحكم دقيق في درجة الحرارة ومناطق تسخين موحدة ونظام تبريد سريع لإنتاج زجاج مقسّى عالي القوة." },
    category: "tempering",
    benefits: { en: ["Uniform heating", "Precise temperature control", "Rapid cooling", "Energy efficient"], ar: ["تسخين موحد", "تحكم دقيق بالحرارة", "تبريد سريع", "كفاءة طاقة"] },
  },
  {
    id: "cnc-cutting-machine",
    image: cncCutting,
    name: { en: "CNC Glass Cutting Machine", ar: "آلة قص الزجاج CNC" },
    subtitle: { en: "Automated Precision Cutting System", ar: "نظام قص دقيق آلي" },
    summary: { en: "Fully automated CNC cutting table with intelligent optimization software, delivering precise cuts with minimal waste across all glass types.", ar: "طاولة قص CNC مؤتمتة بالكامل مع برنامج تحسين ذكي، تقدم قصاً دقيقاً بأقل هدر لجميع أنواع الزجاج." },
    category: "cutting",
    benefits: { en: ["CNC precision", "Auto optimization", "Minimal waste", "All glass types"], ar: ["دقة CNC", "تحسين تلقائي", "أقل هدر", "جميع أنواع الزجاج"] },
  },
  {
    id: "cnc-engraving-center",
    image: cncEngraving,
    name: { en: "CNC Glass Engraving Center", ar: "مركز نقش الزجاج CNC" },
    subtitle: { en: "SKE-CNC-1530 Precision Engraving System", ar: "نظام النقش الدقيق SKE-CNC-1530" },
    summary: { en: "High-precision CNC engraving center for intricate patterns, drilling, milling, and decorative glass processing with multi-axis capability.", ar: "مركز نقش CNC عالي الدقة للأنماط المعقدة والحفر والطحن ومعالجة الزجاج الزخرفي بقدرة متعددة المحاور." },
    category: "processing",
    benefits: { en: ["Multi-axis capability", "Intricate patterns", "High precision", "Versatile processing"], ar: ["قدرة متعددة المحاور", "أنماط معقدة", "دقة عالية", "معالجة متعددة"] },
  },
  {
    id: "production-line",
    image: productionLine,
    name: { en: "Automated Production Line", ar: "خط الإنتاج الآلي" },
    subtitle: { en: "Complete Glass Processing Line", ar: "خط معالجة زجاج متكامل" },
    summary: { en: "Fully integrated production line combining multiple processing stages for continuous, high-volume glass manufacturing with minimal manual intervention.", ar: "خط إنتاج متكامل بالكامل يجمع مراحل معالجة متعددة للتصنيع المستمر وعالي الحجم مع أقل تدخل يدوي." },
    category: "processing",
    benefits: { en: ["Fully integrated", "High volume", "Minimal labor", "Continuous operation"], ar: ["متكامل بالكامل", "حجم عالي", "عمالة أقل", "تشغيل مستمر"] },
  },
  {
    id: "glass-washing-machine",
    image: glassWashing,
    name: { en: "Glass Washing & Drying Machine", ar: "آلة غسل وتجفيف الزجاج" },
    subtitle: { en: "Industrial Cleaning System", ar: "نظام التنظيف الصناعي" },
    summary: { en: "Industrial-grade glass washing and drying system with precision rollers and controlled water management for spotless surface preparation.", ar: "نظام غسل وتجفيف زجاج بمواصفات صناعية مع بكرات دقيقة وإدارة مياه محكومة لتحضير أسطح خالية من البقع." },
    category: "processing",
    benefits: { en: ["Spotless cleaning", "Controlled drying", "High speed", "Water recycling"], ar: ["تنظيف بلا بقع", "تجفيف محكوم", "سرعة عالية", "إعادة تدوير المياه"] },
  },
  {
    id: "automatic-cutting-line",
    image: lineCutting,
    name: { en: "Automatic Glass Cutting Line", ar: "خط قص الزجاج الآلي" },
    subtitle: { en: "High-Speed Automated Cutting System", ar: "نظام قص آلي عالي السرعة" },
    summary: { en: "Fully automatic glass cutting line with integrated loading, scoring, breaking, and sorting for maximum production efficiency.", ar: "خط قص زجاج آلي بالكامل مع تحميل وتسجيل وكسر وفرز متكامل لأقصى كفاءة إنتاج." },
    category: "cutting",
    benefits: { en: ["Full automation", "Integrated sorting", "High speed", "Maximum efficiency"], ar: ["أتمتة كاملة", "فرز متكامل", "سرعة عالية", "أقصى كفاءة"] },
  },
  {
    id: "glass-storage-system",
    image: storageRack,
    name: { en: "Intelligent Glass Storage System", ar: "نظام تخزين الزجاج الذكي" },
    subtitle: { en: "Automated Storage & Retrieval", ar: "تخزين واسترجاع آلي" },
    summary: { en: "Smart storage rack system with automated glass handling, organized inventory management, and safe vertical storage for processed glass sheets.", ar: "نظام رفوف تخزين ذكي مع مناولة زجاج آلية وإدارة مخزون منظمة وتخزين عمودي آمن لألواح الزجاج المعالجة." },
    category: "storage",
    benefits: { en: ["Automated handling", "Space optimized", "Safe storage", "Inventory tracking"], ar: ["مناولة آلية", "مساحة محسّنة", "تخزين آمن", "تتبع المخزون"] },
  },
];
