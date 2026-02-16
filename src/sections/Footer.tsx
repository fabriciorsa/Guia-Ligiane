import { Anchor, Instagram, Facebook, MessageCircle, Mail, MapPin, Phone } from 'lucide-react';
import { CONTACT, whatsappUrl } from '@/constants/contact';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Início', href: '#inicio' },
    { name: 'Passeios', href: '#passeios' },
    { name: 'Galeria', href: '#galeria' },
    { name: 'Sobre', href: '#sobre' },
    { name: 'Contato', href: '#contato' },
  ];

  const legalLinks = [
    { name: 'Termos de Uso', href: '#' },
    { name: 'Política de Privacidade', href: '#' },
  ];

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: MessageCircle, href: whatsappUrl(), label: 'WhatsApp' },
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-[#2C2416] text-white relative overflow-hidden">
      {/* Decorative Top Wave */}
      <div className="absolute top-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60L48 55C96 50 192 40 288 37.5C384 35 480 40 576 42.5C672 45 768 45 864 42.5C960 40 1056 35 1152 35C1248 35 1344 40 1392 42.5L1440 45V0H1392C1344 0 1248 0 1152 0C1056 0 960 0 864 0C768 0 672 0 576 0C480 0 384 0 288 0C192 0 96 0 48 0H0V60Z"
            fill="#F5F0E8"
          />
        </svg>
      </div>

      <div className="container-custom pt-24 pb-8">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <a
              href="#inicio"
              onClick={(e) => { e.preventDefault(); scrollToSection('#inicio'); }}
              className="flex items-center gap-2 mb-4 group"
            >
              <Anchor className="w-8 h-8 text-[#A68B6A] transition-transform duration-300 group-hover:rotate-12" />
              <span className="text-2xl font-bold font-['Montserrat']">{CONTACT.brandName}</span>
            </a>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Criando memórias que duram para sempre. Há mais de 10 anos conectando
              pessoas com a natureza em sua forma mais pura em Sergipe.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white/70 hover:bg-[#365A38] hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#E8E0D5]">Links Rápidos</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-white/70 text-sm hover:text-[#A68B6A] hover:translate-x-1 transition-all duration-300 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#E8E0D5]">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/70 text-sm hover:text-[#A68B6A] hover:translate-x-1 transition-all duration-300 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#E8E0D5]">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#A68B6A] flex-shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm">
                  {CONTACT.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#A68B6A] flex-shrink-0" />
                <a
                  href={`tel:+${CONTACT.whatsapp.replace(/\D/g, '')}`}
                  className="text-white/70 text-sm hover:text-[#A68B6A] transition-colors"
                >
                  {CONTACT.whatsappFormatted}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#A68B6A] flex-shrink-0" />
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-white/70 text-sm hover:text-[#A68B6A] transition-colors"
                >
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm text-center md:text-left">
            © {currentYear} {CONTACT.brandName}. Todos os direitos reservados.
          </p>
          <p className="text-white/50 text-sm flex items-center gap-1">
            Desenvolvido com <span className="text-red-400">♥</span> para aventureiros
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#365A38]/5 rounded-full blur-3xl" />
      <div className="absolute top-20 left-10 w-48 h-48 bg-[#8B6F4E]/5 rounded-full blur-3xl" />
    </footer>
  );
};

export default Footer;
