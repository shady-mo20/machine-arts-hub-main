import { useLanguage } from "@/i18n/LanguageContext";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeader from "@/components/SectionHeader";
import { Target, Eye, Wrench, Award, Lightbulb, Factory } from "lucide-react";

const AboutPage = () => {
  const { t } = useLanguage();

  const sections = [
    { icon: Target, title: t.about.mission, text: t.about.missionText },
    { icon: Eye, title: t.about.vision, text: t.about.visionText },
    { icon: Wrench, title: t.about.philosophy, text: t.about.philosophyText },
    { icon: Award, title: t.about.quality, text: t.about.qualityText },
    { icon: Lightbulb, title: t.about.innovation, text: t.about.innovationText },
    { icon: Factory, title: t.about.excellence, text: t.about.excellenceText },
  ];

  return (
    <Layout>
      <section className="pt-28 pb-24 bg-surface-dark min-h-screen">
        <div className="container mx-auto px-4 lg:px-8">
          <ScrollReveal>
            <SectionHeader tag={t.nav.about} title={t.about.title} subtitle={t.about.subtitle} />
          </ScrollReveal>

          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <p className="text-lg text-steel leading-relaxed">{t.about.intro}</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section, i) => {
              const Icon = section.icon;
              return (
                <ScrollReveal key={i} delay={i * 80}>
                  <div className="metal-surface rounded-xl p-8 h-full hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-bold text-steel-light mb-3">{section.title}</h3>
                    <p className="text-sm text-steel leading-relaxed">{section.text}</p>
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

export default AboutPage;
