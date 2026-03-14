"use client";

import { useEffect, useRef, useState } from "react";

/* ─── Tire SVG Component ─── */
function TireSVG({ className = "", size = 200 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer tire */}
      <circle cx="100" cy="100" r="95" stroke="var(--gray-600)" strokeWidth="4" fill="var(--gray-800)" />
      <circle cx="100" cy="100" r="88" stroke="var(--gray-700)" strokeWidth="2" fill="none" />
      {/* Tread marks */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 15 * Math.PI) / 180;
        const x1 = Math.round((100 + 78 * Math.cos(angle)) * 100) / 100;
        const y1 = Math.round((100 + 78 * Math.sin(angle)) * 100) / 100;
        const x2 = Math.round((100 + 92 * Math.cos(angle)) * 100) / 100;
        const y2 = Math.round((100 + 92 * Math.sin(angle)) * 100) / 100;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--gray-600)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      })}
      {/* Inner ring */}
      <circle cx="100" cy="100" r="55" stroke="var(--gray-600)" strokeWidth="3" fill="var(--gray-900)" />
      {/* Rim spokes */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i * 60 * Math.PI) / 180;
        const x1 = Math.round((100 + 20 * Math.cos(angle)) * 100) / 100;
        const y1 = Math.round((100 + 20 * Math.sin(angle)) * 100) / 100;
        const x2 = Math.round((100 + 50 * Math.cos(angle)) * 100) / 100;
        const y2 = Math.round((100 + 50 * Math.sin(angle)) * 100) / 100;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--blue-500)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        );
      })}
      {/* Center hub */}
      <circle cx="100" cy="100" r="18" fill="var(--gray-800)" stroke="var(--blue-500)" strokeWidth="2" />
      <circle cx="100" cy="100" r="6" fill="var(--blue-500)" />
    </svg>
  );
}

/* ─── Intersection Observer Hook ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ─── Counter Animation ─── */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView(0.5);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="stat-number">
      {count.toLocaleString("pt-PT")}
      {suffix}
    </span>
  );
}

/* ─── Navigation ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { href: "#servicos", label: "Serviços" },
    { href: "#sobre", label: "Sobre Nós" },
    { href: "#testemunhos", label: "Testemunhos" },
    { href: "#contacto", label: "Contacto" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[var(--gray-950)]/95 backdrop-blur-md shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative">
            <TireSVG size={40} className="tire-spin" />
          </div>
          <div>
            <span
              className="text-2xl tracking-wider"
              style={{ fontFamily: "var(--font-bebas-neue)" }}
            >
              PNEUS
              <span style={{ color: "var(--yellow-400)" }}>PRO</span>
            </span>
          </div>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm tracking-wide uppercase transition-colors duration-300 hover:text-[var(--yellow-400)]"
              style={{ color: "var(--gray-300)", fontWeight: 500 }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="tel:+351912345678"
            className="btn-primary px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide text-white"
          >
            Ligar Agora
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menu"
        >
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ background: "var(--gray-950)" }}
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm tracking-wide uppercase py-2"
              style={{ color: "var(--gray-300)" }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="tel:+351912345678"
            className="btn-primary px-5 py-3 rounded-lg text-sm font-semibold tracking-wide text-white text-center"
          >
            Ligar Agora
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ─── Hero Section ─── */
function HeroSection() {
  return (
    <section className="hero-bg grain relative min-h-screen flex items-center overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 opacity-[0.04]">
        <TireSVG size={500} className="tire-spin" />
      </div>
      <div className="absolute -bottom-20 -left-20 opacity-[0.03]">
        <TireSVG size={400} className="tire-spin" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20 sm:py-32 grid lg:grid-cols-2 gap-12 sm:gap-16 items-center w-full">
        {/* Text content */}
        <div>
          {/* Badge */}
          <div
            className="animate-fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-8"
            style={{
              background: "rgba(37, 99, 235, 0.12)",
              color: "var(--blue-400)",
              border: "1px solid rgba(37, 99, 235, 0.2)",
              animationDelay: "0.1s",
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "var(--yellow-400)" }}
            />
            Desde 2021 ao seu serviço
          </div>

          <h1
            className="animate-fade-up text-[clamp(3rem,10vw,4.5rem)] sm:text-7xl lg:text-8xl leading-[0.9] tracking-tight mb-6"
            style={{
              fontFamily: "var(--font-bebas-neue)",
              animationDelay: "0.25s",
            }}
          >
            OS SEUS PNEUS
            <br />
            <span style={{ color: "var(--blue-400)" }}>EM BOAS</span>
            <br />
            <span
              className="relative inline-block"
              style={{ color: "var(--yellow-400)" }}
            >
              MÃOS
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="8"
                viewBox="0 0 200 8"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 4 Q50 0 100 4 T200 4"
                  stroke="var(--yellow-400)"
                  strokeWidth="3"
                  fill="none"
                  opacity="0.6"
                />
              </svg>
            </span>
          </h1>

          <p
            className="animate-fade-up text-base sm:text-lg leading-relaxed max-w-lg mb-8 sm:mb-10"
            style={{
              color: "var(--gray-400)",
              animationDelay: "0.4s",
            }}
          >
            Especialistas em montagem, alinhamento e equilíbrio de pneus.
            Trabalhamos com todas as marcas para garantir a sua segurança na
            estrada.
          </p>

          <div
            className="animate-fade-up flex flex-col sm:flex-row gap-3 sm:gap-4"
            style={{ animationDelay: "0.55s" }}
          >
            <a
              href="#contacto"
              className="btn-secondary px-8 py-4 rounded-lg font-bold text-sm tracking-wider uppercase text-center"
            >
              Marcar Agora
            </a>
            <a
              href="#servicos"
              className="btn-primary px-8 py-4 rounded-lg font-semibold text-sm tracking-wider uppercase text-white text-center"
            >
              Ver Serviços
            </a>
          </div>
        </div>

        {/* Hero visual — animated tire */}
        <div
          className="animate-scale-in hidden lg:flex items-center justify-center relative"
          style={{ animationDelay: "0.6s" }}
        >
          <div className="relative">
            <TireSVG size={380} className="tire-spin" />
            {/* Floating stats */}
            <div
              className="absolute -top-4 -right-8 px-4 py-3 rounded-xl shadow-2xl animate-fade-up"
              style={{
                background: "var(--gray-800)",
                border: "1px solid var(--gray-700)",
                animationDelay: "1s",
              }}
            >
              <div
                className="text-2xl font-bold"
                style={{
                  fontFamily: "var(--font-bebas-neue)",
                  color: "var(--yellow-400)",
                }}
              >
                +15.000
              </div>
              <div className="text-xs" style={{ color: "var(--gray-400)" }}>
                Pneus montados
              </div>
            </div>
            <div
              className="absolute -bottom-4 -left-8 px-4 py-3 rounded-xl shadow-2xl animate-fade-up"
              style={{
                background: "var(--gray-800)",
                border: "1px solid var(--gray-700)",
                animationDelay: "1.2s",
              }}
            >
              <div
                className="text-2xl font-bold"
                style={{
                  fontFamily: "var(--font-bebas-neue)",
                  color: "var(--blue-400)",
                }}
              >
                4.9 ★
              </div>
              <div className="text-xs" style={{ color: "var(--gray-400)" }}>
                Avaliação Google
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background:
            "linear-gradient(to top, var(--gray-900), transparent)",
        }}
      />
    </section>
  );
}

/* ─── Stats Bar ─── */
function StatsBar() {
  const { ref, inView } = useInView();

  const stats = [
    { value: 15000, suffix: "+", label: "Pneus Montados" },
    { value: 4, suffix: "+", label: "Anos de Experiência" },
    { value: 50, suffix: "+", label: "Marcas Disponíveis" },
    { value: 98, suffix: "%", label: "Clientes Satisfeitos" },
  ];

  return (
    <div
      ref={ref}
      className="relative"
      style={{ background: "var(--gray-950)" }}
    >
      <div className="section-divider" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`text-center ${inView ? "animate-fade-up" : "opacity-0"}`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div
                className="text-3xl sm:text-5xl font-bold mb-2"
                style={{
                  fontFamily: "var(--font-bebas-neue)",
                  color: i % 2 === 0 ? "var(--blue-400)" : "var(--yellow-400)",
                }}
              >
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div
                className="text-sm tracking-wide uppercase"
                style={{ color: "var(--gray-400)" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="section-divider" />
    </div>
  );
}

/* ─── Services Section ─── */
function ServicesSection() {
  const { ref, inView } = useInView();

  const services = [
    {
      icon: (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="var(--blue-400)" strokeWidth="2">
          <circle cx="24" cy="24" r="20" />
          <circle cx="24" cy="24" r="12" />
          <circle cx="24" cy="24" r="4" fill="var(--blue-400)" />
          <line x1="24" y1="4" x2="24" y2="12" strokeWidth="3" />
          <line x1="24" y1="36" x2="24" y2="44" strokeWidth="3" />
          <line x1="4" y1="24" x2="12" y2="24" strokeWidth="3" />
          <line x1="36" y1="24" x2="44" y2="24" strokeWidth="3" />
        </svg>
      ),
      title: "Montagem de Pneus",
      description:
        "Montagem profissional de pneus para todo o tipo de viaturas — ligeiros, SUV e comerciais. Equipamento de última geração.",
    },
    {
      icon: (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="var(--yellow-400)" strokeWidth="2">
          <path d="M8 40L24 8L40 40" strokeWidth="2.5" strokeLinejoin="round" />
          <line x1="24" y1="8" x2="24" y2="40" strokeDasharray="4 3" />
          <line x1="14" y1="28" x2="34" y2="28" strokeDasharray="4 3" />
          <circle cx="24" cy="8" r="3" fill="var(--yellow-400)" />
        </svg>
      ),
      title: "Alinhamento de Direcção",
      description:
        "Alinhamento computorizado de alta precisão. Prolongue a vida dos seus pneus e melhore a estabilidade do veículo.",
    },
    {
      icon: (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="var(--blue-400)" strokeWidth="2">
          <circle cx="24" cy="24" r="18" />
          <path d="M24 6C24 6 30 18 24 24C18 30 24 42 24 42" strokeWidth="2.5" />
          <circle cx="24" cy="24" r="3" fill="var(--blue-400)" />
        </svg>
      ),
      title: "Equilíbrio de Rodas",
      description:
        "Equilíbrio dinâmico para eliminar vibrações e garantir uma condução suave e confortável a qualquer velocidade.",
    },
    {
      icon: (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="var(--yellow-400)" strokeWidth="2">
          <rect x="6" y="14" width="36" height="20" rx="4" strokeWidth="2.5" />
          <path d="M14 14V10C14 8 16 6 18 6H30C32 6 34 8 34 10V14" strokeWidth="2.5" />
          <line x1="24" y1="20" x2="24" y2="28" strokeWidth="3" />
          <line x1="20" y1="24" x2="28" y2="24" strokeWidth="3" />
        </svg>
      ),
      title: "Venda de Pneus",
      description:
        "Vasta gama de pneus novos das melhores marcas — Michelin, Continental, Bridgestone, Pirelli e muitas mais.",
    },
    {
      icon: (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="var(--blue-400)" strokeWidth="2">
          <path d="M12 36C12 36 8 28 8 20C8 12 15 6 24 6C33 6 40 12 40 20C40 28 36 36 36 36" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="12" y1="36" x2="36" y2="36" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="16" y1="42" x2="32" y2="42" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="24" cy="20" r="6" strokeWidth="2" />
          <line x1="24" y1="14" x2="24" y2="20" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
      title: "Diagnóstico e Inspeção",
      description:
        "Verificação completa do estado dos seus pneus — profundidade do piso, pressão e desgaste irregular. Sem compromisso.",
    },
    {
      icon: (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="var(--yellow-400)" strokeWidth="2">
          <path d="M6 24H14L20 10L28 38L34 24H42" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Reparação de Furos",
      description:
        "Reparação profissional de furos e cortes. Quando possível, reparamos em vez de substituir — poupança garantida.",
    },
  ];

  return (
    <section
      id="servicos"
      ref={ref}
      className="relative py-16 sm:py-24 tread-pattern"
      style={{ background: "var(--gray-900)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className={`text-center mb-10 sm:mb-16 ${inView ? "animate-fade-up" : "opacity-0"}`}>
          <span
            className="inline-block text-xs tracking-[0.3em] uppercase mb-4 px-4 py-1.5 rounded-full"
            style={{
              color: "var(--yellow-400)",
              background: "rgba(234, 179, 8, 0.1)",
              border: "1px solid rgba(234, 179, 8, 0.15)",
            }}
          >
            O que fazemos
          </span>
          <h2
            className="text-4xl sm:text-6xl lg:text-7xl tracking-tight"
            style={{ fontFamily: "var(--font-bebas-neue)" }}
          >
            OS NOSSOS{" "}
            <span style={{ color: "var(--blue-400)" }}>SERVIÇOS</span>
          </h2>
          <p
            className="mt-4 text-base sm:text-lg max-w-2xl mx-auto"
            style={{ color: "var(--gray-400)" }}
          >
            Oferecemos uma gama completa de serviços para manter os seus pneus
            em perfeitas condições.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map((service, i) => (
            <div
              key={i}
              className={`service-card rounded-2xl p-6 sm:p-8 ${inView ? "animate-fade-up" : "opacity-0"}`}
              style={{
                background: "var(--gray-800)",
                border: "1px solid var(--gray-700)",
                animationDelay: `${0.1 + i * 0.1}s`,
              }}
            >
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6"
                style={{
                  background:
                    i % 2 === 0
                      ? "rgba(37, 99, 235, 0.1)"
                      : "rgba(234, 179, 8, 0.1)",
                }}
              >
                {service.icon}
              </div>
              <h3
                className="text-2xl mb-3 tracking-wide"
                style={{ fontFamily: "var(--font-bebas-neue)" }}
              >
                {service.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--gray-400)" }}>
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── About Section ─── */
function AboutSection() {
  const { ref, inView } = useInView();

  return (
    <section
      id="sobre"
      ref={ref}
      className="relative py-16 sm:py-24 overflow-hidden"
      style={{ background: "var(--gray-950)" }}
    >
      {/* Decorative tire */}
      <div className="absolute -right-32 top-1/2 -translate-y-1/2 opacity-[0.03] hidden sm:block">
        <TireSVG size={600} className="tire-spin" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          {/* Left — visual */}
          <div className={`relative ${inView ? "animate-slide-left" : "opacity-0"}`}>
            <div
              className="aspect-[4/3] rounded-2xl overflow-hidden relative"
              style={{
                background:
                  "linear-gradient(135deg, var(--gray-800), var(--gray-700))",
              }}
            >
              {/* Abstract garage illustration */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <TireSVG size={200} className="tire-spin" />
                  <div
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-48 h-1 rounded-full blur-md"
                    style={{ background: "var(--blue-500)" }}
                  />
                </div>
              </div>
              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(234, 179, 8, 0.05))",
                }}
              />
            </div>
            {/* Yellow accent stripe */}
            <div
              className="absolute -bottom-3 -right-3 w-24 h-24 rounded-xl stripe-accent opacity-60"
            />
          </div>

          {/* Right — text */}
          <div className={`${inView ? "animate-slide-right" : "opacity-0"}`}>
            <span
              className="inline-block text-xs tracking-[0.3em] uppercase mb-4 px-4 py-1.5 rounded-full"
              style={{
                color: "var(--blue-400)",
                background: "rgba(37, 99, 235, 0.1)",
                border: "1px solid rgba(37, 99, 235, 0.15)",
              }}
            >
              Quem somos
            </span>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl tracking-tight mb-6"
              style={{ fontFamily: "var(--font-bebas-neue)" }}
            >
              CONFIANÇA E
              <br />
              <span style={{ color: "var(--yellow-400)" }}>PROFISSIONALISMO</span>
            </h2>
            <p
              className="text-base leading-relaxed mb-6"
              style={{ color: "var(--gray-400)" }}
            >
              Desde 2021, a PneusPro tem vindo a servir a comunidade com
              dedicação e rigor. A nossa equipa de técnicos certificados
              utiliza equipamento de última geração para garantir que cada
              serviço é realizado com a máxima qualidade.
            </p>
            <p
              className="text-base leading-relaxed mb-8"
              style={{ color: "var(--gray-400)" }}
            >
              Acreditamos que pneus em bom estado são fundamentais para a
              segurança rodoviária. Por isso, oferecemos não só serviços de
              excelência, mas também aconselhamento personalizado para que
              faça sempre a melhor escolha.
            </p>

            {/* Feature list */}
            <div className="space-y-4">
              {[
                "Técnicos certificados e experientes",
                "Equipamento de última geração",
                "Todas as marcas de pneus disponíveis",
                "Preços competitivos e transparentes",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(37, 99, 235, 0.15)" }}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="var(--blue-400)"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm" style={{ color: "var(--gray-300)" }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials Section ─── */
function TestimonialsSection() {
  const { ref, inView } = useInView();

  const testimonials = [
    {
      name: "Ricardo Almeida",
      location: "Lisboa",
      text: "Serviço impecável e rápido. Troquei os quatro pneus e fizeram o alinhamento num instante. Preços muito justos comparados com a concorrência.",
      rating: 5,
    },
    {
      name: "Ana Ferreira",
      location: "Setúbal",
      text: "Fui lá pela primeira vez por recomendação de um amigo e não me arrependi. Equipa super profissional e atenciosa. Já sou cliente habitual.",
      rating: 5,
    },
    {
      name: "Miguel Santos",
      location: "Almada",
      text: "Furei um pneu numa sexta à noite e conseguiram ajudar-me logo no sábado de manhã. Excelente atendimento e ficou como novo.",
      rating: 5,
    },
  ];

  return (
    <section
      id="testemunhos"
      ref={ref}
      className="relative py-16 sm:py-24"
      style={{ background: "var(--gray-900)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className={`text-center mb-10 sm:mb-16 ${inView ? "animate-fade-up" : "opacity-0"}`}>
          <span
            className="inline-block text-xs tracking-[0.3em] uppercase mb-4 px-4 py-1.5 rounded-full"
            style={{
              color: "var(--yellow-400)",
              background: "rgba(234, 179, 8, 0.1)",
              border: "1px solid rgba(234, 179, 8, 0.15)",
            }}
          >
            Testemunhos
          </span>
          <h2
            className="text-4xl sm:text-6xl lg:text-7xl tracking-tight"
            style={{ fontFamily: "var(--font-bebas-neue)" }}
          >
            O QUE DIZEM OS{" "}
            <span style={{ color: "var(--yellow-400)" }}>NOSSOS CLIENTES</span>
          </h2>
        </div>

        {/* Testimonials grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`testimonial-card rounded-2xl p-6 sm:p-8 ${inView ? "animate-fade-up" : "opacity-0"}`}
              style={{
                background: "var(--gray-800)",
                border: "1px solid var(--gray-700)",
                animationDelay: `${0.15 + i * 0.15}s`,
              }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <svg
                    key={j}
                    className="w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="var(--yellow-400)"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              {/* Quote */}
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: "var(--gray-300)" }}
              >
                &ldquo;{t.text}&rdquo;
              </p>
              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background:
                      i % 2 === 0
                        ? "rgba(37, 99, 235, 0.15)"
                        : "rgba(234, 179, 8, 0.15)",
                    color:
                      i % 2 === 0 ? "var(--blue-400)" : "var(--yellow-400)",
                  }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs" style={{ color: "var(--gray-500)" }}>
                    {t.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Brands Section ─── */
function BrandsSection() {
  const { ref, inView } = useInView();

  const brands = [
    "MICHELIN",
    "CONTINENTAL",
    "BRIDGESTONE",
    "PIRELLI",
    "GOODYEAR",
    "HANKOOK",
    "DUNLOP",
    "YOKOHAMA",
  ];

  return (
    <section
      ref={ref}
      className="py-14 sm:py-20"
      style={{ background: "var(--gray-950)" }}
    >
      <div className="section-divider mb-10 sm:mb-16" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`text-center mb-12 ${inView ? "animate-fade-up" : "opacity-0"}`}>
          <p
            className="text-xs tracking-[0.3em] uppercase"
            style={{ color: "var(--gray-500)" }}
          >
            Trabalhamos com as melhores marcas
          </p>
        </div>
        <div
          className={`flex flex-wrap justify-center items-center gap-x-6 sm:gap-x-12 gap-y-4 sm:gap-y-6 ${
            inView ? "animate-fade-in" : "opacity-0"
          }`}
          style={{ animationDelay: "0.2s" }}
        >
          {brands.map((brand, i) => (
            <span
              key={i}
              className="text-xl sm:text-2xl md:text-3xl tracking-[0.1em] sm:tracking-[0.15em] transition-colors duration-300 cursor-default hover:text-[var(--blue-400)]"
              style={{
                fontFamily: "var(--font-bebas-neue)",
                color: "var(--gray-600)",
              }}
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
      <div className="section-divider mt-10 sm:mt-16" />
    </section>
  );
}

/* ─── Contact / CTA Section ─── */
function ContactSection() {
  const { ref, inView } = useInView();

  return (
    <section
      id="contacto"
      ref={ref}
      className="relative py-16 sm:py-24 tread-pattern"
      style={{ background: "var(--gray-900)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16">
          {/* Left — CTA */}
          <div className={`${inView ? "animate-slide-left" : "opacity-0"}`}>
            <span
              className="inline-block text-xs tracking-[0.3em] uppercase mb-4 px-4 py-1.5 rounded-full"
              style={{
                color: "var(--blue-400)",
                background: "rgba(37, 99, 235, 0.1)",
                border: "1px solid rgba(37, 99, 235, 0.15)",
              }}
            >
              Contacto
            </span>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl tracking-tight mb-6"
              style={{ fontFamily: "var(--font-bebas-neue)" }}
            >
              PRECISA DE
              <br />
              <span style={{ color: "var(--yellow-400)" }}>PNEUS NOVOS?</span>
            </h2>
            <p
              className="text-base leading-relaxed mb-10"
              style={{ color: "var(--gray-400)" }}
            >
              Entre em contacto connosco e teremos todo o gosto em ajudá-lo.
              Ligue-nos, envie uma mensagem ou visite-nos directamente.
            </p>

            {/* Contact info */}
            <div className="space-y-6">
              {[
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="var(--blue-400)" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  ),
                  label: "Telefone",
                  value: "+351 912 345 678",
                  href: "tel:+351912345678",
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="var(--blue-400)" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                  label: "E-mail",
                  value: "geral@pneuspro.pt",
                  href: "mailto:geral@pneuspro.pt",
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="var(--blue-400)" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                  label: "Morada",
                  value: "Rua dos Pneus, 123 — Lisboa",
                  href: "#",
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="var(--blue-400)" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  label: "Horário",
                  value: "Seg–Sex: 8h–19h | Sáb: 9h–13h",
                  href: "#",
                },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="flex items-start gap-4 group"
                >
                  <div
                    className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-300 group-hover:bg-[rgba(37,99,235,0.2)]"
                    style={{ background: "rgba(37, 99, 235, 0.1)" }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div
                      className="text-xs tracking-wider uppercase mb-1"
                      style={{ color: "var(--gray-500)" }}
                    >
                      {item.label}
                    </div>
                    <div
                      className="text-sm font-medium transition-colors duration-300 group-hover:text-[var(--blue-400)]"
                      style={{ color: "var(--gray-200)" }}
                    >
                      {item.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div
            className={`${inView ? "animate-slide-right" : "opacity-0"}`}
            style={{ animationDelay: "0.2s" }}
          >
            <form
              className="rounded-2xl p-5 sm:p-8 space-y-5 sm:space-y-6"
              style={{
                background: "var(--gray-800)",
                border: "1px solid var(--gray-700)",
              }}
              onSubmit={(e) => e.preventDefault()}
            >
              <h3
                className="text-3xl tracking-wide mb-2"
                style={{ fontFamily: "var(--font-bebas-neue)" }}
              >
                ENVIE-NOS UMA{" "}
                <span style={{ color: "var(--blue-400)" }}>MENSAGEM</span>
              </h3>
              <p className="text-sm" style={{ color: "var(--gray-500)" }}>
                Responderemos o mais brevemente possível.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-xs tracking-wider uppercase mb-2"
                    style={{ color: "var(--gray-400)" }}
                  >
                    Nome
                  </label>
                  <input
                    type="text"
                    placeholder="O seu nome"
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-[var(--blue-500)]"
                    style={{
                      background: "var(--gray-900)",
                      border: "1px solid var(--gray-700)",
                      color: "var(--gray-200)",
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-xs tracking-wider uppercase mb-2"
                    style={{ color: "var(--gray-400)" }}
                  >
                    Telefone
                  </label>
                  <input
                    type="tel"
                    placeholder="+351 ..."
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-[var(--blue-500)]"
                    style={{
                      background: "var(--gray-900)",
                      border: "1px solid var(--gray-700)",
                      color: "var(--gray-200)",
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-xs tracking-wider uppercase mb-2"
                  style={{ color: "var(--gray-400)" }}
                >
                  E-mail
                </label>
                <input
                  type="email"
                  placeholder="o.seu@email.pt"
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-[var(--blue-500)]"
                  style={{
                    background: "var(--gray-900)",
                    border: "1px solid var(--gray-700)",
                    color: "var(--gray-200)",
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-xs tracking-wider uppercase mb-2"
                  style={{ color: "var(--gray-400)" }}
                >
                  Mensagem
                </label>
                <textarea
                  rows={4}
                  placeholder="Descreva o que precisa..."
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-300 resize-none focus:ring-2 focus:ring-[var(--blue-500)]"
                  style={{
                    background: "var(--gray-900)",
                    border: "1px solid var(--gray-700)",
                    color: "var(--gray-200)",
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-secondary w-full px-8 py-4 rounded-lg font-bold text-sm tracking-wider uppercase"
              >
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer style={{ background: "var(--gray-950)" }}>
      <div className="section-divider" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <a href="#" className="flex items-center gap-3 mb-4">
              <TireSVG size={36} className="tire-spin" />
              <span
                className="text-2xl tracking-wider"
                style={{ fontFamily: "var(--font-bebas-neue)" }}
              >
                PNEUS
                <span style={{ color: "var(--yellow-400)" }}>PRO</span>
              </span>
            </a>
            <p
              className="text-sm leading-relaxed max-w-sm"
              style={{ color: "var(--gray-500)" }}
            >
              Especialistas em pneus desde 2021. A sua segurança na estrada
              é a nossa prioridade.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4
              className="text-lg tracking-wider mb-4"
              style={{ fontFamily: "var(--font-bebas-neue)" }}
            >
              NAVEGAÇÃO
            </h4>
            <div className="space-y-3">
              {[
                { href: "#servicos", label: "Serviços" },
                { href: "#sobre", label: "Sobre Nós" },
                { href: "#testemunhos", label: "Testemunhos" },
                { href: "#contacto", label: "Contacto" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-sm transition-colors duration-300 hover:text-[var(--blue-400)]"
                  style={{ color: "var(--gray-500)" }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div>
            <h4
              className="text-lg tracking-wider mb-4"
              style={{ fontFamily: "var(--font-bebas-neue)" }}
            >
              HORÁRIO
            </h4>
            <div className="space-y-2 text-sm" style={{ color: "var(--gray-500)" }}>
              <div className="flex justify-between">
                <span>Segunda–Sexta</span>
                <span style={{ color: "var(--gray-300)" }}>8h–19h</span>
              </div>
              <div className="flex justify-between">
                <span>Sábado</span>
                <span style={{ color: "var(--gray-300)" }}>9h–13h</span>
              </div>
              <div className="flex justify-between">
                <span>Domingo</span>
                <span style={{ color: "var(--yellow-500)" }}>Encerrado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{
            borderTop: "1px solid var(--gray-800)",
            color: "var(--gray-600)",
          }}
        >
          <span>&copy; 2021–2026 PneusPro. Todos os direitos reservados.</span>
          <span>Feito com dedicação em Portugal</span>
        </div>
      </div>
    </footer>
  );
}

/* ─── Main Page ─── */
export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <StatsBar />
      <ServicesSection />
      <AboutSection />
      <BrandsSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
