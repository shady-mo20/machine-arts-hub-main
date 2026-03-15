import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Machine } from "@/data/machines";
import { ArrowRight, ArrowLeft } from "lucide-react";

const MachineCard = ({ machine }: { machine: Machine }) => {
  const { lang, t } = useLanguage();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  return (
    <Link
      to={`/machines/${machine.id}`}
      className="group block metal-surface rounded-xl overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
    >
      <div className="aspect-[16/10] overflow-hidden bg-charcoal">
        <img
          src={machine.image}
          alt={machine.name[lang]}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-steel-light mb-1 group-hover:text-accent transition-colors">
          {machine.name[lang]}
        </h3>
        <p className="text-sm text-steel mb-3">{machine.subtitle[lang]}</p>
        <p className="text-sm text-steel/80 leading-relaxed mb-4 line-clamp-2">
          {machine.summary[lang]}
        </p>
        <div className="flex items-center gap-2 text-accent text-sm font-medium">
          <span>{t.machines.viewDetails}</span>
          <Arrow className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

export default MachineCard;
