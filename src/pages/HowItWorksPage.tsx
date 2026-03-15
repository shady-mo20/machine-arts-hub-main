import { useLanguage } from "@/i18n/LanguageContext";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeader from "@/components/SectionHeader";
import { Package, Scissors, Layers, Flame, Search, Archive } from "lucide-react";

const HowItWorksPage = () => {
  const { t } = useLanguage();
  const icons = [Package, Scissors, Layers, Flame, Search, Archive];

  return (
    <Layout>
      <section className="pt-28 pb-24 bg-surface-dark min-h-screen">
        <div className="container mx-auto px-4 lg:px-8">
          <ScrollReveal>
            <SectionHeader tag={t.process.tag} title={t.process.title} subtitle={t.process.subtitle} />
          </ScrollReveal>

          <div className="max-w-4xl mx-auto">
            {t.process.steps.map((step: { title: string; desc: string }, i: number) => {
              const Icon = icons[i];
              return (
                <ScrollReveal key={i} delay={i * 100}>
                  <div className="flex gap-6 mb-8 last:mb-0">
                    {/* Timeline */}
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                      {i < t.process.steps.length - 1 && (
                        <div className="w-px flex-1 bg-accent/20 mt-2" />
                      )}
                    </div>

                    <div className="metal-surface rounded-xl p-6 flex-1 mb-2">
                      <div className="text-xs font-semibold text-accent mb-1 uppercase tracking-wider">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <h3 className="text-lg font-bold text-steel-light mb-2">{step.title}</h3>
                      <p className="text-sm text-steel leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HowItWorksPage;
