import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, AlertCircle, Phone, Mail, MapPin } from 'lucide-react';
import { PortfolioSettings } from '../../types';

interface ContactFormProps {
  settings: PortfolioSettings;
}

export const ContactForm: React.FC<ContactFormProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successNotice, setSuccessNotice] = useState(false);

  const cleanPhone = (settings.whatsapp || '').replace(/\D/g, '');

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Por favor, informe o seu nome.';
    if (!subject.trim()) errs.subject = 'Por favor, informe o assunto da mensagem.';
    if (!message.trim()) errs.message = 'Por favor, escreva a sua mensagem.';
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Insira um endereço de e-mail válido ou deixe em branco.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (!cleanPhone) {
      setErrors({
        whatsapp: 'O proprietário do portfólio ainda não configurou um número de WhatsApp nas configurações.',
      });
      return;
    }

    // Build formatted message
    let compiled = `Olá! Meu nome é ${name.trim()}.\n\n`;
    compiled += `Estou entrando em contato sobre: ${subject.trim()}.\n\n`;
    if (email.trim()) {
      compiled += `Meu e-mail para resposta: ${email.trim()}\n\n`;
    }
    compiled += `Mensagem:\n${message.trim()}`;

    const encoded = encodeURIComponent(compiled);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encoded}`;

    setSuccessNotice(true);

    // Open WhatsApp in new tab safely
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        {/* Left column: Info & Contacts */}
        <div className="md:col-span-5 space-y-6">
          <div>
            <h2
              className="text-2xl md:text-3xl font-bold tracking-tight mb-3"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text-primary, #141414)',
              }}
            >
              Vamos conversar?
            </h2>
            <p
              className="text-base leading-relaxed opacity-85"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text-secondary, #5C5852)',
              }}
            >
              Tem interesse em desenvolver um projeto, colaboração de pesquisa, workshop ou palestra? Envie uma mensagem direta.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {settings.whatsapp && (
              <div className="flex items-start gap-3 text-sm">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Phone className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-xs text-neutral-500 uppercase tracking-wide">WhatsApp</p>
                  <p className="font-medium" style={{ color: 'var(--color-text-primary, #141414)' }}>{settings.whatsapp}</p>
                </div>
              </div>
            )}

            {settings.email_public && (
              <div className="flex items-start gap-3 text-sm">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                  <Mail className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-xs text-neutral-500 uppercase tracking-wide">E-mail Direto</p>
                  <a
                    href={`mailto:${settings.email_public}`}
                    className="font-medium underline hover:opacity-80 focus:outline-none focus:ring-2 rounded-xs"
                    style={{ color: 'var(--color-text-primary, #141414)', outlineColor: 'var(--color-focus, #B43E19)' }}
                  >
                    {settings.email_public}
                  </a>
                </div>
              </div>
            )}

            {settings.location && (
              <div className="flex items-start gap-3 text-sm">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-xs text-neutral-500 uppercase tracking-wide">Localização</p>
                  <p className="font-medium" style={{ color: 'var(--color-text-primary, #141414)' }}>{settings.location}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Form */}
        <div
          className="md:col-span-7 p-6 sm:p-8 rounded-xl border shadow-xs"
          style={{
            backgroundColor: 'var(--color-surface, #FFFFFF)',
            borderColor: 'var(--color-border, #E2DDD3)',
            borderRadius: 'var(--border-radius, 8px)',
            borderWidth: 'var(--border-width, 1px)',
            borderStyle: 'var(--border-style, solid)' as any,
          }}
        >
          <form onSubmit={handleSendWhatsApp} noValidate className="space-y-4">
            {errors.whatsapp && (
              <div
                role="alert"
                className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errors.whatsapp}</span>
              </div>
            )}

            {/* Field: Name */}
            <div>
              <label
                htmlFor="contact-name"
                className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                style={{ color: 'var(--color-text-primary, #141414)' }}
              >
                Nome Completo <span className="text-rose-600" aria-hidden="true">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
                required
                aria-required="true"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'contact-name-error' : undefined}
                placeholder="Ex.: Mariana Silva"
                className="w-full px-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2"
                style={{
                  borderColor: errors.name ? 'var(--color-error, #B91C1C)' : 'var(--color-border, #E2DDD3)',
                  backgroundColor: 'var(--color-surface, #FFFFFF)',
                  color: 'var(--color-text-primary, #141414)',
                  outlineColor: 'var(--color-focus, #B43E19)',
                }}
              />
              {errors.name && (
                <p id="contact-name-error" className="mt-1 text-xs text-rose-600 font-medium" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Field: Subject */}
            <div>
              <label
                htmlFor="contact-subject"
                className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                style={{ color: 'var(--color-text-primary, #141414)' }}
              >
                Assunto <span className="text-rose-600" aria-hidden="true">*</span>
              </label>
              <input
                id="contact-subject"
                type="text"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  if (errors.subject) setErrors((prev) => ({ ...prev, subject: '' }));
                }}
                required
                aria-required="true"
                aria-invalid={Boolean(errors.subject)}
                aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                placeholder="Ex.: Proposta de projeto de identidade e web"
                className="w-full px-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2"
                style={{
                  borderColor: errors.subject ? 'var(--color-error, #B91C1C)' : 'var(--color-border, #E2DDD3)',
                  backgroundColor: 'var(--color-surface, #FFFFFF)',
                  color: 'var(--color-text-primary, #141414)',
                  outlineColor: 'var(--color-focus, #B43E19)',
                }}
              />
              {errors.subject && (
                <p id="contact-subject-error" className="mt-1 text-xs text-rose-600 font-medium" role="alert">
                  {errors.subject}
                </p>
              )}
            </div>

            {/* Field: Email (optional) */}
            <div>
              <label
                htmlFor="contact-email"
                className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                style={{ color: 'var(--color-text-primary, #141414)' }}
              >
                Seu E-mail <span className="text-xs font-normal text-neutral-500 tracking-normal">(opcional)</span>
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                }}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'contact-email-error' : undefined}
                placeholder="mariana@exemplo.com"
                className="w-full px-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2"
                style={{
                  borderColor: errors.email ? 'var(--color-error, #B91C1C)' : 'var(--color-border, #E2DDD3)',
                  backgroundColor: 'var(--color-surface, #FFFFFF)',
                  color: 'var(--color-text-primary, #141414)',
                  outlineColor: 'var(--color-focus, #B43E19)',
                }}
              />
              {errors.email && (
                <p id="contact-email-error" className="mt-1 text-xs text-rose-600 font-medium" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Field: Message */}
            <div>
              <label
                htmlFor="contact-message"
                className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                style={{ color: 'var(--color-text-primary, #141414)' }}
              >
                Mensagem <span className="text-rose-600" aria-hidden="true">*</span>
              </label>
              <textarea
                id="contact-message"
                rows={4}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (errors.message) setErrors((prev) => ({ ...prev, message: '' }));
                }}
                required
                aria-required="true"
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'contact-message-error' : undefined}
                placeholder="Olá Lucas, gostaria de conversar sobre a criação de um novo projeto..."
                className="w-full px-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2"
                style={{
                  borderColor: errors.message ? 'var(--color-error, #B91C1C)' : 'var(--color-border, #E2DDD3)',
                  backgroundColor: 'var(--color-surface, #FFFFFF)',
                  color: 'var(--color-text-primary, #141414)',
                  outlineColor: 'var(--color-focus, #B43E19)',
                }}
              />
              {errors.message && (
                <p id="contact-message-error" className="mt-1 text-xs text-rose-600 font-medium" role="alert">
                  {errors.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg font-bold text-sm text-white shadow-md transition-all duration-200 hover:opacity-95 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer"
                style={{
                  backgroundColor: '#25D366', // Official accessible WhatsApp green
                  outlineColor: '#25D366',
                }}
              >
                <MessageSquare className="w-5 h-5 fill-current" aria-hidden="true" />
                <span>{settings.ux_voice.cta_contact_label || 'Enviar pelo WhatsApp'}</span>
              </button>
            </div>

            {successNotice && (
              <div
                role="status"
                className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-lg flex items-start gap-2 animate-in fade-in"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Mensagem formatada com sucesso!</p>
                  <p className="text-neutral-600 mt-0.5">
                    O WhatsApp foi aberto com os dados preenchidos para envio direto ao proprietário.
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
