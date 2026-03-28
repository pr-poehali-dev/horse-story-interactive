import { useState } from "react";
import Icon from "@/components/ui/icon";

interface StoryTextProps {
  content: string;
  title: string;
  subtitle?: string;
}

export default function StoryText({ content, title, subtitle }: StoryTextProps) {
  const [revealed, setRevealed] = useState(false);

  const paragraphs = content.split("\n\n").filter(Boolean);

  return (
    <div className="relative">
      <div className="mb-6">
        <h3 className="font-display text-2xl font-bold uppercase tracking-wider text-foreground">
          {title}
        </h3>
        {subtitle && (
          <span className="text-gold text-sm font-body uppercase tracking-widest mt-1 block">
            — {subtitle}
          </span>
        )}
      </div>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="group relative overflow-hidden w-full border border-dashed border-border hover:border-gold transition-all duration-300 py-12 px-8 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <Icon name="BookOpen" size={32} className="mx-auto mb-3 text-muted-foreground group-hover:text-gold transition-colors" />
          <p className="font-display text-sm uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
            Нажмите, чтобы прочитать историю
          </p>
        </button>
      ) : (
        <div className="space-y-4">
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className="font-body text-base text-foreground/90 leading-relaxed animate-text-reveal"
              style={{ animationDelay: `${i * 0.12}s`, opacity: 0 }}
            >
              {para}
            </p>
          ))}
          <button
            onClick={() => setRevealed(false)}
            className="mt-4 text-xs font-body text-muted-foreground hover:text-gold transition-colors uppercase tracking-widest flex items-center gap-1"
          >
            <Icon name="EyeOff" size={12} />
            Скрыть
          </button>
        </div>
      )}
    </div>
  );
}
