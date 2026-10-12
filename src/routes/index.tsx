import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Download, Mail, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Константин Иванов — Product Designer" },
      {
        name: "description",
        content:
          "Сайт-резюме Константина Иванова: product designer с опытом 8 лет. Опыт, проекты, навыки и контакты.",
      },
      { property: "og:title", content: "Константин Иванов — Product Designer" },
      {
        property: "og:description",
        content:
          "Сайт-резюме Константина Иванова: product designer с опытом 8 лет. Опыт, проекты, навыки и контакты.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const experience = [
  {
    period: "2021 — н.в.",
    role: "Lead Product Designer",
    company: "FinTech Start",
    text: "Руковожу командой из 4 дизайнеров, отвечаю за дизайн-систему и ключевые продуктовые метрики. Конверсия онбординга выросла на 34%.",
  },
  {
    period: "2018 — 2021",
    role: "Senior Product Designer",
    company: "Digital Agency N1",
    text: "Проектировал интерфейсы для банковских и e-commerce продуктов. Запустил 12 продуктов с нуля до релиза.",
  },
  {
    period: "2016 — 2018",
    role: "UI/UX Designer",
    company: "Studio Kraft",
    text: "Дизайн сайтов и мобильных приложений, прототипирование, работа с заказчиками.",
  },
];

const skills = [
  "Product Strategy",
  "Design Systems",
  "Figma",
  "UX Research",
  "Прототипирование",
  "Design Ops",
  "A/B-тесты",
  "Английский — C1",
];

const projects = [
  {
    name: "Банковское приложение «Орбита»",
    result: "2 млн пользователей, редизайн главного экрана поднял NPS с 31 до 52",
  },
  {
    name: "Платформа онлайн-обучения",
    result: "Дизайн-система на 200+ компонентов, время разработки сократилось на 40%",
  },
  {
    name: "Сервис доставки еды",
    result: "Новый сценарий заказа: конверсия в оплату +18%",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      {/* Навигация */}
      <header className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <span className="font-display text-lg font-semibold tracking-tight">
          К. Иванов
        </span>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground sm:flex">
          <a href="#experience" className="transition-colors hover:text-foreground">
            Опыт
          </a>
          <a href="#projects" className="transition-colors hover:text-foreground">
            Проекты
          </a>
          <a href="#contacts" className="transition-colors hover:text-foreground">
            Контакты
          </a>
        </nav>
        <a
          href="#contacts"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Связаться
          <ArrowUpRight className="size-4" />
        </a>
      </header>

      {/* Герой */}
      <section className="mx-auto max-w-4xl px-6 pt-16 pb-20 sm:pt-24">
        <p className="mb-4 text-sm font-medium tracking-widest text-accent-foreground uppercase">
          Product Designer · Москва
        </p>
        <h1 className="font-display text-5xl leading-[1.05] font-semibold tracking-tight sm:text-7xl">
          Константин
          <br />
          Иванов
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Проектирую цифровые продукты, которыми пользуются миллионы людей.
          8 лет опыта в финтехе, e-commerce и образовании. Люблю сложные
          задачи и измеримые результаты.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="#contacts"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Mail className="size-4" />
            Написать мне
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <Download className="size-4" />
            Скачать PDF
          </a>
        </div>
      </section>

      {/* Цифры */}
      <section className="border-y border-border bg-secondary/50">
        <div className="mx-auto grid max-w-4xl grid-cols-3 divide-x divide-border px-6">
          {[
            ["8 лет", "опыта в дизайне"],
            ["12+", "продуктов запущено"],
            ["2 млн", "пользователей"],
          ].map(([num, label]) => (
            <div key={label} className="py-10 text-center">
              <div className="font-display text-3xl font-semibold sm:text-4xl">
                {num}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Опыт */}
      <section id="experience" className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="font-display text-3xl font-semibold tracking-tight">
          Опыт работы
        </h2>
        <div className="mt-10 space-y-0">
          {experience.map((job) => (
            <article
              key={job.company}
              className="grid gap-2 border-t border-border py-8 sm:grid-cols-[180px_1fr] sm:gap-8"
            >
              <div className="text-sm text-muted-foreground">{job.period}</div>
              <div>
                <h3 className="text-lg font-semibold">{job.role}</h3>
                <div className="text-sm font-medium text-muted-foreground">
                  {job.company}
                </div>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {job.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Проекты */}
      <section id="projects" className="border-t border-border bg-secondary/50">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            Ключевые проекты
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {projects.map((p) => (
              <div
                key={p.name}
                className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
              >
                <h3 className="font-semibold">{p.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {p.result}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Навыки */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="font-display text-3xl font-semibold tracking-tight">
          Навыки
        </h2>
        <div className="mt-8 flex flex-wrap gap-2">
          {skills.map((s) => (
            <span
              key={s}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Контакты */}
      <section id="contacts" className="border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Давайте работать вместе
          </h2>
          <p className="mx-auto mt-4 max-w-md text-primary-foreground/80">
            Открыт для предложений о работе и интересных проектов. Отвечаю
            в течение дня.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="mailto:konstantin@example.com"
              className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
            >
              <Mail className="size-4" />
              konstantin@example.com
            </a>
            <a
              href="tel:+79000000000"
              className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-6 py-3 text-sm font-medium transition-colors hover:bg-primary-foreground/10"
            >
              <Phone className="size-4" />
              +7 900 000-00-00
            </a>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-primary-foreground/70">
            <MapPin className="size-4" />
            Москва, готов к удалённой работе
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © 2026 Константин Иванов
      </footer>
    </div>
  );
}
