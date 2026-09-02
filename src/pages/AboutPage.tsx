import React from 'react';
import { User, MapPin, Mail, Phone, Globe, ExternalLink, Sparkles, Award } from 'lucide-react';
import { PortfolioSettings } from '../types';
import { ContactForm } from '../components/public/ContactForm';

interface AboutPageProps {
  settings: PortfolioSettings;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings }) => {
  return (
    <div className="space-y-10 sm:space-y-12 max-w-5xl mx-auto animate-in fade-in duration-300 pb-16">
      {/* Top Header Card */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <span
            className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block"
          >
            Apresentação & Biografia
          </span>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight"
            style={{
              fontFamily: 'var(--font-heading)',
            }}
          >
            {settings.about_title || `Sobre ${settings.portfolio_name}`}
          </h1>
          <p
            className="text-base sm:text-lg lg:text-xl font-medium leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-3xl"
            style={{
              fontFamily: 'var(--font-body)',
            }}
          >
            {settings.tagline}
          </p>
        </div>
      </section>

      {/* Profile & Biography Grid (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Col: Profile Photo & Fast Facts */}
        <aside className="md:col-span-5 space-y-6">
          <div
            className="relative w-full aspect-square rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs"
          >
            {settings.profile_image ? (
              <img
                src={settings.profile_image}
                alt={`Retrato autoral de ${settings.portfolio_name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400">
                <User className="w-20 h-20 opacity-30" />
              </div>
            )}
          </div>

          {/* Key metadata box */}
          <div
            className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl space-y-4 text-xs shadow-xs"
          >
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-400 block">
              Canais Diretos
            </span>

            {settings.location && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-zinc-600 dark:text-zinc-300 font-medium">{settings.location}</span>
              </div>
            )}

            {settings.email_public && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Mail className="w-4 h-4" />
                </div>
                <a
                  href={`mailto:${settings.email_public}`}
                  className="hover:underline truncate text-zinc-900 dark:text-white font-semibold"
                >
                  {settings.email_public}
                </a>
              </div>
            )}

            {settings.whatsapp && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-zinc-900 dark:text-white font-semibold">{settings.whatsapp}</span>
              </div>
            )}
          </div>

          {/* Social Links */}
          {settings.social_links.length > 0 && (
            <div className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl space-y-3 shadow-xs">
              <span
                className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-400 block"
              >
                Redes & Presença Digital
              </span>
              <div className="grid grid-cols-1 gap-2">
                {settings.social_links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl flex items-center justify-between text-xs font-semibold text-zinc-900 dark:text-white transition-all hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  >
                    <span>{link.label || link.platform}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Right Col: Long Bio text */}
        <main className="md:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs space-y-6">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
            Declaração de Trabalho & Metodologia
          </span>
          <div
            className="text-base sm:text-lg leading-relaxed whitespace-pre-line space-y-4 text-zinc-800 dark:text-zinc-200"
            style={{
              fontFamily: 'var(--font-body)',
            }}
          >
            {settings.about_text}
          </div>
        </main>
      </div>

      {/* Integrated Contact Form Section (Bento Card) */}
      <section
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 lg:p-10 space-y-6 shadow-xs"
      >
        <div>
          <span
            className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1"
          >
            Fale Comigo
          </span>
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white"
            style={{
              fontFamily: 'var(--font-heading)',
            }}
          >
            Envie uma Mensagem
          </h2>
          <p className="text-sm mt-1 text-zinc-500">
            Preencha o formulário abaixo para abrir diretamente a conversa formatada no WhatsApp.
          </p>
        </div>

        <ContactForm settings={settings} />
      </section>
    </div>
  );
};
