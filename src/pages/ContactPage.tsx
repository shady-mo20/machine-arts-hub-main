import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeader from "@/components/SectionHeader";
import { machines } from "@/data/machines";
import { Phone, Mail, MapPin, ChevronDown, Send } from "lucide-react";
import { toast } from "sonner";

const ContactPage = () => {
  const { lang, t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(lang === "en" ? "Inquiry sent successfully!" : "تم إرسال الاستفسار بنجاح!");
  };

  return (
    <Layout>
      <section className="pt-28 pb-24 bg-surface-dark min-h-screen">
        <div className="container mx-auto px-4 lg:px-8">
          <ScrollReveal>
            <SectionHeader tag={t.contact.tag} title={t.contact.title} subtitle={t.contact.subtitle} />
          </ScrollReveal>

          <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Form */}
            <div className="lg:col-span-2">
              <ScrollReveal>
                <form onSubmit={handleSubmit} className="metal-surface rounded-xl p-8 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label={t.contact.form.fullName} name="fullName" required />
                    <InputField label={t.contact.form.company} name="company" />
                    <InputField label={t.contact.form.email} name="email" type="email" required />
                    <InputField label={t.contact.form.phone} name="phone" type="tel" />
                    <InputField label={t.contact.form.country} name="country" />
                    <div>
                      <label className="block text-sm font-medium text-steel-light mb-2">{t.contact.form.machine}</label>
                      <select
                        name="machine"
                        className="w-full px-4 py-3 rounded-lg bg-charcoal border border-steel/20 text-steel-light text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
                      >
                        <option value="">{t.contact.form.selectMachine}</option>
                        {machines.map((m) => (
                          <option key={m.id} value={m.id}>{m.name[lang]}</option>
                        ))}
                      </select>
                    </div>
                    <InputField label={t.contact.form.quantity} name="quantity" type="number" />
                    <div>
                      <label className="block text-sm font-medium text-steel-light mb-2">{t.contact.form.projectType}</label>
                      <select
                        name="projectType"
                        className="w-full px-4 py-3 rounded-lg bg-charcoal border border-steel/20 text-steel-light text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
                      >
                        <option value="">{t.contact.form.selectProject}</option>
                        <option>{t.contact.form.newFactory}</option>
                        <option>{t.contact.form.upgrade}</option>
                        <option>{t.contact.form.replacement}</option>
                        <option>{t.contact.form.expansion}</option>
                        <option>{t.contact.form.custom}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-steel-light mb-2">{t.contact.form.message}</label>
                    <textarea
                      name="message"
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-charcoal border border-steel/20 text-steel-light text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-industrial-blue-dark text-accent-foreground font-semibold rounded-lg transition-all shadow-industrial w-full justify-center"
                  >
                    <Send className="w-5 h-5" />
                    {t.contact.form.submit}
                  </button>
                </form>
              </ScrollReveal>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <ScrollReveal delay={100}>
                <div className="metal-surface rounded-xl p-6 space-y-5">
                  {[
                    { icon: Phone, text: t.contact.info.phone },
                    { icon: Mail, text: t.contact.info.email },
                    { icon: MapPin, text: t.contact.info.address },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <item.icon className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                      <span className="text-sm text-steel-light">{item.text}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              {/* FAQ */}
              <ScrollReveal delay={200}>
                <div className="metal-surface rounded-xl p-6">
                  <h3 className="text-lg font-bold text-steel-light mb-4">{t.contact.faq}</h3>
                  <div className="space-y-2">
                    {t.contact.faqs.map((faq: { q: string; a: string }, i: number) => (
                      <div key={i} className="border-b border-steel/10 last:border-0">
                        <button
                          onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          className="w-full flex items-center justify-between py-3 text-sm text-steel-light text-start hover:text-accent transition-colors"
                        >
                          <span>{faq.q}</span>
                          <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                        </button>
                        {openFaq === i && (
                          <p className="text-sm text-steel pb-3 leading-relaxed">{faq.a}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

const InputField = ({ label, name, type = "text", required = false }: { label: string; name: string; type?: string; required?: boolean }) => (
  <div>
    <label className="block text-sm font-medium text-steel-light mb-2">{label}</label>
    <input
      type={type}
      name={name}
      required={required}
      className="w-full px-4 py-3 rounded-lg bg-charcoal border border-steel/20 text-steel-light text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors placeholder:text-steel/40"
    />
  </div>
);

export default ContactPage;
