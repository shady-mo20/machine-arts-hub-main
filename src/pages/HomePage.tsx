import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeader from "@/components/SectionHeader";
import MachineCard from "@/components/MachineCard";
import { machines } from "@/data/machines";
import { ArrowRight, ArrowLeft, Cog, Zap, Shield, Headphones, Settings2, Leaf } from "lucide-react";
import temperingFurnace from "@/assets/machines/tempering-furnace.png";

const HomePage = () => {
  const { lang, t } = useLanguage();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;
  const featuredMachines = machines.slice(0, 4);
  const whyUsIcons = [Cog, Zap, Shield, Headphones, Settings2, Leaf];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={temperingFurnace}
            alt="Hero machine"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220,15%,6%)] via-[hsl(220,15%,6%,0.85)] to-transparent" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-20">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-accent border border-accent/20 rounded-full mb-6 animate-fade-up">
              {t.hero.subhead}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-6 text-gradient-steel animate-fade-up" style={{ animationDelay: "0.1s" }}>
              {t.hero.headline}
            </h1>
            <p className="text-lg md:text-xl text-steel leading-relaxed max-w-2xl mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              {t.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <Link
                to="/machines"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent hover:bg-industrial-blue-dark text-accent-foreground font-semibold rounded-lg transition-all duration-200 shadow-industrial hover:shadow-card-hover"
              >
                {t.hero.cta1}
                <Arrow className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-steel/30 text-steel-light hover:border-accent hover:text-accent font-semibold rounded-lg transition-all duration-200"
              >
                {t.hero.cta2}
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-up" style={{ animationDelay: "0.4s" }}>
              {[
                { val: t.hero.stat1, label: t.hero.stat1Label },
                { val: t.hero.stat2, label: t.hero.stat2Label },
                { val: t.hero.stat3, label: t.hero.stat3Label },
                { val: t.hero.stat4, label: t.hero.stat4Label },
              ].map((stat, i) => (
                <div key={i} className="border-s border-accent/30 ps-4">
                  <div className="text-2xl font-bold text-accent">{stat.val}</div>
                  <div className="text-xs text-steel uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-24 bg-gradient-industrial">
        <div className="container mx-auto px-4 lg:px-8">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-accent border border-accent/20 rounded-full mb-4">
                {t.intro.tag}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-steel-light mb-6">
                {t.intro.title}
              </h2>
              <p className="text-lg text-steel leading-relaxed mb-8">{t.intro.text}</p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
              >
                {t.intro.cta} <Arrow className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Machines */}
      <section className="py-24 bg-surface-dark">
        <div className="container mx-auto px-4 lg:px-8">
          <ScrollReveal>
            <SectionHeader tag={t.machines.tag} title={t.machines.title} subtitle={t.machines.subtitle} />
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMachines.map((m, i) => (
              <ScrollReveal key={m.id} delay={i * 100}>
                <MachineCard machine={m} />
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal>
            <div className="text-center mt-12">
              <Link
                to="/machines"
                className="inline-flex items-center gap-2 px-8 py-4 border border-steel/30 text-steel-light hover:border-accent hover:text-accent font-semibold rounded-lg transition-all"
              >
                {t.machines.allMachines} <Arrow className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-gradient-industrial">
        <div className="container mx-auto px-4 lg:px-8">
          <ScrollReveal>
            <SectionHeader tag={t.whyUs.tag} title={t.whyUs.title} />
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.whyUs.items.map((item: { title: string; desc: string }, i: number) => {
              const Icon = whyUsIcons[i];
              return (
                <ScrollReveal key={i} delay={i * 80}>
                  <div className="metal-surface rounded-xl p-8 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
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

      {/* CTA Band */}
      <section className="py-20 bg-accent/5 border-y border-accent/10">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-steel-light mb-4">{t.cta.title}</h2>
            <p className="text-lg text-steel mb-8 max-w-xl mx-auto">{t.cta.subtitle}</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-10 py-4 bg-accent hover:bg-industrial-blue-dark text-accent-foreground font-semibold rounded-lg transition-all shadow-industrial"
            >
              {t.cta.button} <Arrow className="w-5 h-5" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
