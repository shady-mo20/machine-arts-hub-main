import { ReactNode } from "react";

interface SectionHeaderProps {
  tag: string;
  title: string;
  subtitle?: string;
  className?: string;
  children?: ReactNode;
}

const SectionHeader = ({ tag, title, subtitle, className = "" }: SectionHeaderProps) => (
  <div className={`text-center mb-16 ${className}`}>
    <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-accent border border-accent/20 rounded-full mb-4">
      {tag}
    </span>
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-steel-light leading-tight mb-4">
      {title}
    </h2>
    {subtitle && (
      <p className="text-steel text-lg max-w-2xl mx-auto leading-relaxed">
        {subtitle}
      </p>
    )}
  </div>
);

export default SectionHeader;
