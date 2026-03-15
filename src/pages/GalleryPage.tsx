import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeader from "@/components/SectionHeader";
import { machines } from "@/data/machines";
import { X } from "lucide-react";

const GalleryPage = () => {
  const { lang, t } = useLanguage();
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState("");

  const galleryItems = machines.map((m) => ({
    src: m.image,
    alt: m.name[lang],
    category: m.category,
  }));

  return (
    <Layout>
      <section className="pt-28 pb-24 bg-surface-dark min-h-screen">
        <div className="container mx-auto px-4 lg:px-8">
          <ScrollReveal>
            <SectionHeader tag={t.gallery.tag} title={t.gallery.title} subtitle={t.gallery.subtitle} />
          </ScrollReveal>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {galleryItems.map((item, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <button
                  onClick={() => { setLightboxImg(item.src); setLightboxAlt(item.alt); }}
                  className="block w-full rounded-xl overflow-hidden group cursor-pointer break-inside-avoid"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-colors duration-300 flex items-end p-4">
                      <span className="text-steel-light text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                        {item.alt}
                      </span>
                    </div>
                  </div>
                </button>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-[100] bg-charcoal/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-6 end-6 text-steel-light hover:text-accent transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={lightboxImg}
            alt={lightboxAlt}
            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </Layout>
  );
};

export default GalleryPage;
