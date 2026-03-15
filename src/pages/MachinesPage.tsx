import { useLanguage } from "@/i18n/LanguageContext";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeader from "@/components/SectionHeader";
import MachineCard from "@/components/MachineCard";
import { machines } from "@/data/machines";
import { useState } from "react";

const MachinesPage = () => {
  const { lang, t } = useLanguage();
  const [filter, setFilter] = useState("all");

  const categories = [
    { id: "all", label: t.machines.allMachines },
    { id: "cutting", label: lang === "en" ? "Cutting" : "القص" },
    { id: "tempering", label: lang === "en" ? "Tempering" : "التقسية" },
    { id: "processing", label: lang === "en" ? "Processing" : "المعالجة" },
    { id: "storage", label: lang === "en" ? "Storage" : "التخزين" },
  ];

  const filtered = filter === "all" ? machines : machines.filter((m) => m.category === filter);

  return (
    <Layout>
      <section className="pt-28 pb-24 bg-surface-dark min-h-screen">
        <div className="container mx-auto px-4 lg:px-8">
          <ScrollReveal>
            <SectionHeader tag={t.machines.tag} title={t.machines.title} subtitle={t.machines.subtitle} />
          </ScrollReveal>

          {/* Filters */}
          <ScrollReveal>
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 border
                    ${filter === cat.id
                      ? "bg-accent text-accent-foreground border-accent"
                      : "border-steel/20 text-steel hover:border-accent hover:text-accent"
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((m, i) => (
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

export default MachinesPage;
