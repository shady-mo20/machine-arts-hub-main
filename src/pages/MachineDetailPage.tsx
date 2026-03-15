import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import MachineCard from "@/components/MachineCard";
import { machines } from "@/data/machines";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

const MachineDetailPage = () => {
  const { id } = useParams();
  const { lang, t } = useLanguage();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;
  const machine = machines.find((m) => m.id === id);
  const related = machines.filter((m) => m.id !== id).slice(0, 3);

  if (!machine) {
    return (
      <Layout>
        <div className="pt-28 pb-24 text-center bg-surface-dark min-h-screen">
          <p className="text-steel text-lg">Machine not found.</p>
          <Link to="/machines" className="text-accent mt-4 inline-block">{t.machines.backToMachines}</Link>
        </div>
      </Layout>
    );
  }

  const specPlaceholders = [
    { label: lang === "en" ? "Max Glass Size" : "أقصى حجم للزجاج", value: "—" },
    { label: lang === "en" ? "Min Glass Thickness" : "أقل سمك للزجاج", value: "—" },
    { label: lang === "en" ? "Max Glass Thickness" : "أقصى سمك للزجاج", value: "—" },
    { label: lang === "en" ? "Processing Speed" : "سرعة المعالجة", value: "—" },
    { label: lang === "en" ? "Power Supply" : "مصدر الطاقة", value: "—" },
    { label: lang === "en" ? "Machine Dimensions" : "أبعاد الآلة", value: "—" },
    { label: lang === "en" ? "Weight" : "الوزن", value: "—" },
    { label: lang === "en" ? "Control System" : "نظام التحكم", value: "—" },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-24 bg-gradient-industrial">
        <div className="container mx-auto px-4 lg:px-8">
          <Link to="/machines" className="inline-flex items-center gap-2 text-steel hover:text-accent text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {t.machines.backToMachines}
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center pb-16">
            <ScrollReveal>
              <div className="rounded-xl overflow-hidden bg-charcoal shadow-industrial">
                <img src={machine.image} alt={machine.name[lang]} className="w-full h-auto object-cover" />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div>
                <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent border border-accent/20 rounded-full mb-4">
                  {machine.category}
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-steel-light mb-3">
                  {machine.name[lang]}
                </h1>
                <p className="text-lg text-steel mb-2">{machine.subtitle[lang]}</p>
                <p className="text-steel/80 leading-relaxed mb-8">{machine.summary[lang]}</p>

                <h3 className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">{t.machines.keyBenefits}</h3>
                <ul className="space-y-3 mb-8">
                  {machine.benefits[lang].map((b, i) => (
                    <li key={i} className="flex items-center gap-3 text-steel-light">
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-industrial-blue-dark text-accent-foreground font-semibold rounded-lg transition-all shadow-industrial"
                >
                  {t.machines.inquireNow} <Arrow className="w-5 h-5" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Specs */}
      <section className="py-20 bg-surface-dark">
        <div className="container mx-auto px-4 lg:px-8">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-steel-light mb-8">{t.machines.specifications}</h2>
            <div className="metal-surface rounded-xl overflow-hidden">
              <table className="w-full">
                <tbody>
                  {specPlaceholders.map((spec, i) => (
                    <tr key={i} className="border-b border-steel/10 last:border-0">
                      <td className="px-6 py-4 text-sm font-medium text-steel-light w-1/2">{spec.label}</td>
                      <td className="px-6 py-4 text-sm text-steel">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-steel/50 mt-3 italic">
              {lang === "en" ? "* Specifications to be updated. Contact us for detailed technical data." : "* سيتم تحديث المواصفات. تواصل معنا للحصول على البيانات الفنية التفصيلية."}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Related */}
      <section className="py-20 bg-gradient-industrial">
        <div className="container mx-auto px-4 lg:px-8">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-steel-light mb-8">{t.machines.relatedMachines}</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((m, i) => (
              <ScrollReveal key={m.id} delay={i * 80}>
                <MachineCard machine={m} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MachineDetailPage;
