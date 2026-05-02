import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface HeroProps {
  onCtaClick: () => void;
}

export function Hero({ onCtaClick }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="mx-auto max-w-4xl px-4 pt-16 pb-12 text-center sm:pt-24 sm:pb-16">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated/60 px-4 py-1.5 text-sm font-medium text-foreground/90 backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          Менеджер сейчас на связи
        </div>

        <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Персональные подборки<br />
          проверенных вакансий<br />
          <span className="bg-gradient-primary bg-clip-text text-transparent">по всей России и СНГ</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Наш менеджер подберёт вакансии по вашим запросам, а HR-эксперт поможет
          дойти до финального устройства на работу.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Button size="lg" variant="hero" onClick={onCtaClick} className="h-14 px-8 text-base">
            <MessageCircle className="mr-2 h-5 w-5" />
            Связаться с менеджером
          </Button>
          <p className="text-sm text-muted-foreground">
            Не нужно никуда переходить — связь с менеджером прямо на странице сайта
          </p>
        </div>

        <dl className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { value: "12 000+", label: "проверенных вакансий" },
            { value: "48 ч", label: "среднее время подбора" },
            { value: "9 / 10", label: "доходят до оффера" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-surface-elevated/50 p-5 backdrop-blur transition hover:border-primary/40 hover:shadow-glow"
            >
              <dt className="text-2xl font-bold text-foreground sm:text-3xl">{stat.value}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
