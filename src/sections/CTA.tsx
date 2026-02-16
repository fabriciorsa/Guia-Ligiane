import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Clock, Phone, MapPin } from 'lucide-react';
import { CONTACT, whatsappUrl } from '@/constants/contact';

const CTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const contactInfo = [
    { icon: Clock, text: CONTACT.businessHours },
    { icon: Phone, text: CONTACT.whatsappFormatted },
    { icon: MapPin, text: CONTACT.address },
  ];

  return (
    <section
      id="contato"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#365A38] via-[#5C4A3A] to-[#8B6F4E] animate-gradient" />

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Circles */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#365A38]/20 rounded-full blur-3xl" />

        {/* Wave Pattern */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L48 110C96 100 192 80 288 75C384 70 480 70 576 72.5C672 75 768 80 864 82.5C960 85 1056 85 1152 82.5C1248 80 1344 75 1392 72.5L1440 70V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
            fill="#F5F0E8"
            fillOpacity="0.1"
          />
        </svg>
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
              }`}
          >
            Pronto para sua{' '}
            <span className="text-[#E8E0D5]">Próxima Aventura?</span>
          </h2>

          {/* Subheadline */}
          <p
            className={`text-lg sm:text-xl text-white/80 leading-relaxed mb-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            style={{ transitionDelay: '200ms' }}
          >
            Entre em contato conosco e reserve seu passeio agora mesmo.
            Vagas limitadas para garantir uma experiência exclusiva!
          </p>

          {/* CTA Button */}
          <div
            className={`mb-10 transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
            style={{ transitionDelay: '400ms' }}
          >
            <a
              href={whatsappUrl('Olá! Gostaria de saber mais sobre os passeios disponíveis.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 bg-[#25D366] text-white text-lg font-bold rounded-xl transition-all duration-300 hover:bg-[#128C7E] hover:scale-105 hover:shadow-2xl animate-pulse-glow"
            >
              <MessageCircle className="w-6 h-6" />
              Fale Conosco no WhatsApp
            </a>
          </div>

          {/* Contact Info */}
          <div
            className={`flex flex-wrap justify-center gap-6 mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            style={{ transitionDelay: '600ms' }}
          >
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-white/70"
              >
                <info.icon className="w-4 h-4" />
                <span className="text-sm">{info.text}</span>
              </div>
            ))}
          </div>

          {/* Trust Badge */}
          <div
            className={`inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            style={{ transitionDelay: '700ms' }}
          >
            <div className="flex -space-x-2">
              {['MS', 'JS', 'AC', 'PL'].map((initials, i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-gradient-to-br from-[#365A38] to-[#8B6F4E] rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white/20"
                >
                  {initials}
                </div>
              ))}
            </div>
            <span className="text-white/80 text-sm">
              <span className="text-white font-semibold">+5.000</span> aventureiros já embarcaram
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
