import { useLanguage } from "@/i18n/LanguageContext";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeader from "@/components/SectionHeader";
import { Building2, Car, Palette, Sun, Refrigerator, Factory } from "lucide-react";

const ApplicationsPage = () => {
  const { t } = useLanguage();
  const icons = [Building2, Car, Palette, Sun, Refrigerator, Factory];

  return (
    <Layout>
      <section className="pt-28 pb-24 bg-surface-dark min-h-screen">
        <div className="container mx-auto px-4 lg:px-8">
          <ScrollReveal>
            <SectionHeader tag={t.applications.tag} title={t.applications.title} subtitle={t.applications.subtitle} />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.applications.items.map((item: { title: string; desc: string }, i: number) => {
              const Icon = icons[i];
              return (
                <ScrollReveal key={i} delay={i * 80}>
                  <div className="metal-surface rounded-xl p-8 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 h-full">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-bold text-steel-light mb-2">{item.title}</h3>
                    <p className="text-sm text-steel leading-relaxed">{item.desc}</p>
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

export default ApplicationsPage;
