import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Copy, Download, FileUp, GraduationCap, Mail, MapPin, Moon, Phone, Send, Sun } from "lucide-react";
import { RESUME_STORAGE_KEY, type Resume } from "@/lib/resume";
import { readStoredPhoto } from "@/lib/photo";
import profilePhoto from "@/assets/resume-photo.jpg.asset.json";
import resumePdf from "@/assets/resume.pdf.asset.json";

const NAME = "Константин Чугрин";
const TITLE = "Ведущий специалист технической поддержки";
const SUBTITLE = "Инженер поддержки 2–3 линии · Координатор поддержки";
const LOCATION = "Москва";
const EMAIL = "skosta_m@mail.ru";
const PHONE = "+7 (926) 357-34-95";
const SUMMARY =
  "20 лет сопровождаю пользователей и корпоративные информационные системы в крупных компаниях — РЖД и Транстелеком. Поддержка SAP для 1 500+ пользователей, решение сложных инцидентов, взаимодействие с бизнесом и техническими командами. Рекомендован в кадровый резерв РЖД на позицию начальника отдела. Рассматриваю позиции ведущего специалиста, инженера 2–3 линии или координатора технической поддержки.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Константин Чугрин — Ведущий специалист технической поддержки" },
      {
        name: "description",
        content:
          "Сайт-резюме Константина Чугрина: 20 лет в IT-поддержке и сопровождении корпоративных систем (РЖД, Транстелеком). Опыт, достижения, навыки и контакты.",
      },
      { property: "og:title", content: "Константин Чугрин — Ведущий специалист технической поддержки" },
      {
        property: "og:description",
        content:
          "20 лет в IT-поддержке корпоративных систем федерального масштаба. Опыт, достижения, навыки и контакты.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const defaultExperience: { period: string; role: string; company: string; text: string; bullets?: string[] }[] = [
  {
    period: "2016 — 2026",
    role: "Ведущий специалист по сопровождению информационных систем",
    company: "АО «Центр корпоративного учёта и отчётности» (ОАО «РЖД»)",
    text: "",
    bullets: [
      "Техническая поддержка 1 500+ пользователей финансово-учётных систем SAP",
      "Автоматизировал регламентную отчётность (SAP + Excel) — исключил ручную выгрузку для руководства",
      "Курировал внедрение машиночитаемых доверенностей, сопроводил 50+ сотрудников",
      "Настроил защищённый документооборот с банками (ВТБ, Сбербанк)",
      "Внедрил инструкции по типовым обращениям — снизил количество повторных обращений",
      "Зона ответственности выросла в 5 раз; замещал заместителя начальника отдела",
      "Рекомендован в кадровый резерв РЖД на позицию начальника отдела; почётные грамоты (2017, 2022)",
    ],
  },
  {
    period: "2008 — 2016",
    role: "Менеджер эксплуатации сети",
    company: "ОАО «Транстелеком»",
    text: "",
    bullets: [
      "Эксплуатация и развитие телеком-инфраструктуры, диагностика оборудования Cisco",
      "Анализ логов и предотвращение сбоев",
      "Развёртывание IP-телефонии (Cisco, Yealink, Audiocodes), администрирование СКУД BioSmart",
      "Техническая экспертиза оборудования перед закупкой",
    ],
  },
  {
    period: "2007 — 2008",
    role: "Инженер по инсталляции",
    company: "ОАО «Транстелеком»",
    text: "",
    bullets: [
      "Монтаж структурированных кабельных систем",
      "Пусконаладка и ввод телеком-оборудования в эксплуатацию",
    ],
  },
  {
    period: "2006 — 2007",
    role: "Технический специалист",
    company: "ООО «РТС Телеком»",
    text: "",
    bullets: [
      "Подключение и техподдержка клиентов по технологии WiMax",
      "Проектирование и строительство компьютерных сетей полным циклом",
    ],
  },
];

const skillGroups = [
  { title: "Инциденты и SLA", items: ["Поддержка 1–3 линии", "Диагностика и решение инцидентов", "Работа с заявками / Helpdesk"] },
  { title: "Корпоративные системы", items: ["SAP — сопровождение", "Электронный документооборот", "Автоматизация отчётности (SAP + Excel)"] },
  { title: "Сети и связь", items: ["Cisco / сетевые технологии", "VoIP / IP-телефония", "СКУД"] },
  { title: "Координация и люди", items: ["Взаимодействие с ИТ-командами и подрядчиками", "Инструкции и документация", "Наставничество и обучение", "Английский — B1"] },
];
const defaultSkills = skillGroups.flatMap((g) => g.items);

const achievements = [
  ["×5", "рост зоны ответственности в РЖД"],
  ["50+", "сотрудников сопровождено при внедрении МЧД"],
  ["0", "ручных выгрузок после автоматизации отчётности"],
  ["2 банка", "защищённый обмен с ВТБ и Сбербанком"],
];

const education = [
  {
    year: "2006",
    degree: "Высшее образование",
    school: "Московский технический университет связи и информатики",
    detail: "Радиотехника, микроволновая техника",
  },
  {
    year: "2001",
    degree: "Среднее специальное",
    school: "Московский техникум информатики и вычислительной техники",
    detail: "Автоматизированные системы обработки информации и управления",
  },
];

const courses = [
  "Microsoft Excel. Уровень 3: анализ и визуализация данных (2023)",
  "Microsoft Excel. Уровень 1 (2022)",
  "Основы критического мышления — Корпоративный университет РЖД (2022)",
  "Цифровая трансформация в экономике — РУТ (МИИТ) (2022)",
  "Cisco Certified Network Associate (2013)",
];

const stats = [
  ["20 лет", "в технической поддержке и ИТ"],
  ["1 500+", "пользователей SAP на поддержке"],
  ["Резерв", "кадровый резерв руководителей РЖД"],
  ["2 грамоты", "почётные награды РЖД (2017, 2022)"],
];

const stack = [
  { title: "Корпоративные системы", items: ["SAP ERP", "1С", "КриптоПро / ЭЦП", "МЧД"] },
  { title: "Инфраструктура", items: ["Active Directory", "Windows Server", "VPN"] },
  { title: "Связь и сети", items: ["Cisco", "IP-телефония / VoIP", "TCP/IP"] },
  { title: "Управление инцидентами", items: ["Service Desk", "SLA", "Регламенты"] },
];

const principles = [
  "Устраняю первопричину, а не только симптомы инцидента.",
  "Говорю с пользователями и бизнесом на понятном языке, без лишнего жаргона.",
  "Систематизирую опыт: регламенты и база знаний экономят время всей команде.",
];

function Index() {
  const [r, setR] = useState<Resume | null>(null);
  const [photo, setPhoto] = useState<string | null>(profilePhoto.url);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RESUME_STORAGE_KEY);
      if (raw) setR(JSON.parse(raw));
    } catch {}
    setPhoto(readStoredPhoto() ?? profilePhoto.url);
    const saved = localStorage.getItem("theme");
    const isDark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const [dark, setDark] = useState(false);
  const [copied, setCopied] = useState(false);
  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };
  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(PHONE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  const name = r?.name || NAME;
  const [first, ...rest] = name.split(" ");
  const experience = r?.experience?.length ? r.experience : defaultExperience;
  const skills = r?.skills?.length ? r.skills : defaultSkills;
  const email = r ? r.email : EMAIL;
  const phone = r ? r.phone : PHONE;
  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      {/* Навигация */}
      <header className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <span className="font-display text-lg font-semibold tracking-tight">
          {name}
        </span>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground sm:flex">
          <a href="#experience" className="transition-colors hover:text-foreground">
            Опыт
          </a>
          <a href="#education" className="transition-colors hover:text-foreground">
            Образование
          </a>
          <a href="#contacts" className="transition-colors hover:text-foreground">
            Контакты
          </a>
        </nav>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={dark ? "Светлая тема" : "Тёмная тема"}
          className="inline-flex size-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary"
        >
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
        <Link
          to="/upload"
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
        >
          <FileUp className="size-4" />
          Загрузить резюме
        </Link>
        <a
          href="#contacts"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Связаться
          <ArrowUpRight className="size-4" />
        </a>
      </header>

      {/* Герой */}
      <section className="mx-auto max-w-4xl px-6 pt-16 pb-20 sm:pt-24">
        {photo && (
          <img
            src={photo}
            alt={name}
            className="mb-5 size-28 rounded-full object-cover shadow-sm ring-1 ring-border sm:size-36"
          />
        )}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-4 py-1.5 text-sm font-medium text-success">
          <span className="size-2 rounded-full bg-success" />
          Открыт к предложениям · Москва / Любой формат
        </div>
        <p className="mb-4 text-sm font-medium tracking-widest text-accent-foreground uppercase">
          {r ? [r.title, r.location].filter(Boolean).join(" · ") : `${TITLE} · ${LOCATION}`}
        </p>
        {!r && <p className="mb-6 -mt-2 text-sm text-muted-foreground">{SUBTITLE}</p>}
        <h1 className="font-display text-[clamp(2.05rem,10.5vw,4.5rem)] leading-[1.05] font-semibold tracking-tight [overflow-wrap:anywhere] sm:text-7xl">
          {first}
          <br />
          {rest.join(" ")}
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
          {r?.summary || SUMMARY}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="#contacts"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
          >
            <Mail className="size-4" />
            Написать мне
          </a>
          <a
            href={resumePdf.url}
            download="konstantin-chugrin-resume.pdf"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium shadow-soft card-hover hover:bg-secondary"
          >
            <Download className="size-4" />
            Скачать PDF
          </a>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Открыт к предложениям в Москве: офис, гибридный или удалённый формат работы.
        </p>
      </section>

      {/* Цифры */}
      {!r && <section className="border-y border-border bg-secondary/50">
        <div className="mx-auto grid max-w-4xl grid-cols-2 divide-border px-6 sm:grid-cols-4 sm:divide-x">
          {stats.map(([num, label]) => (
            <div key={label} className="py-10 text-center">
              <div className="font-display text-3xl font-semibold sm:text-4xl">
                {num}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </section>}

      {/* Достижения */}
      {!r && <section className="mx-auto max-w-4xl px-6 pt-20">
        <h2 className="font-display text-3xl font-semibold tracking-tight">Ключевые достижения</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {achievements.map(([num, label]) => (
            <div key={label} className="card-hover rounded-2xl border border-border bg-card p-6">
              <div className="font-display text-3xl font-semibold">{num}</div>
              <div className="mt-1 text-sm text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </section>}

      {/* Опыт */}
      <section id="experience" className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="font-display text-3xl font-semibold tracking-tight">
          Опыт работы
        </h2>
        <div className="mt-10 space-y-0">
          {experience.map((job) => (
            <article
              key={job.company + job.period}
              className="grid gap-2 border-t border-border py-8 sm:grid-cols-[180px_1fr] sm:gap-8"
            >
              <div className="text-sm text-muted-foreground">{job.period}</div>
              <div>
                <h3 className="text-lg font-semibold">{job.role}</h3>
                <div className="text-sm font-medium text-muted-foreground">
                  {job.company}
                </div>
                {(job as { bullets?: string[] }).bullets ? (
                  <ul className="mt-3 space-y-1.5 text-muted-foreground">
                    {((job as { bullets?: string[] }).bullets ?? []).map((b) => (
                      <li key={b} className="flex gap-3 leading-relaxed">
                        <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-foreground/40" />
                        {b}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 leading-relaxed text-muted-foreground">{job.text}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Образование */}
      {!r && <section id="education" className="border-t border-border bg-secondary/50">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            Образование
          </h2>
          <div className="mt-10 space-y-0">
            {education.map((e) => (
              <article
                key={e.school}
                className="grid gap-2 border-t border-border py-8 sm:grid-cols-[180px_1fr] sm:gap-8"
              >
                <div className="text-sm text-muted-foreground">{e.year}</div>
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <GraduationCap className="size-5 text-muted-foreground" />
                    {e.school}
                  </h3>
                  <div className="text-sm font-medium text-muted-foreground">
                    {e.degree}
                  </div>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {e.detail}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <h3 className="mt-12 text-lg font-semibold">Повышение квалификации</h3>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            {courses.map((c) => (
              <li key={c} className="flex gap-3">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground/40" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>}

      {/* Навыки */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="font-display text-3xl font-semibold tracking-tight">
          Навыки
        </h2>
        {!r ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {skillGroups.map((g) => (
              <div key={g.title}>
                <h3 className="mb-3 text-sm font-semibold tracking-wide uppercase text-muted-foreground">{g.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((s) => (
                    <span key={s} className="rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors duration-200 hover:border-foreground/25 hover:bg-secondary">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : <div className="mt-8 flex flex-wrap gap-2">
          {skills.map((s) => (
            <span
              key={s}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm"
            >
              {s}
            </span>
          ))}
        </div>}
      </section>

      {/* Стек */}
      <section className="border-t border-border bg-secondary/50">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <h2 className="font-display text-3xl font-semibold tracking-tight">Ключевой стек и инструменты</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {stack.map((g) => (
              <div key={g.title} className="card-hover rounded-2xl border border-border bg-card p-6">
                <h3 className="mb-3 text-sm font-semibold tracking-wide uppercase text-muted-foreground">{g.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((s) => (
                    <span key={s} className="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium transition-colors duration-200 hover:bg-foreground/10">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Принципы */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="font-display text-3xl font-semibold tracking-tight">Принципы работы</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {principles.map((p, i) => (
            <div key={p} className="card-hover rounded-2xl border border-border bg-card p-6">
              <div className="font-display text-3xl font-semibold text-muted-foreground">0{i + 1}</div>
              <p className="mt-3 leading-relaxed">{p}</p>
            </div>
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
            {email && <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
            >
              <Mail className="size-4" />
              {email}
            </a>}
            {phone && <a
              href={`tel:${phone.replace(/[^+\d]/g, "")}`}
              className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-6 py-3 text-sm font-medium transition-colors hover:bg-primary-foreground/10"
            >
              <Phone className="size-4" />
              {phone}
            </a>}
          </div>
          <div className="mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://t.me/Chuga_28"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
            >
              <Send className="size-4" />
              Написать в Telegram
            </a>
            {phone && <button
              type="button"
              onClick={copyPhone}
              className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-6 py-3 text-sm font-medium transition-colors hover:bg-primary-foreground/10"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Номер скопирован" : "Скопировать телефон"}
            </button>}
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-primary-foreground/70">
            <MapPin className="size-4" />
            {r ? r.location : "Москва · Любой формат: офис, гибрид или удалённо"}
          </div>
          <div className="mt-4 flex justify-center">
            <a
              href={resumePdf.url}
              download="konstantin-chugrin-resume.pdf"
              className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-6 py-3 text-sm font-medium transition-colors hover:bg-primary-foreground/10"
            >
              <Download className="size-4" />
              Скачать резюме (PDF)
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © 2026 {name}
      </footer>
    </div>
  );
}
