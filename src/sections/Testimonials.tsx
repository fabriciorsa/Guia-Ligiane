import { useEffect, useRef, useState, useCallback } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Sailboat, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader } from '../components/ui/dialog';
import axios from 'axios';
import { toast } from 'sonner';

const initialTestimonials = [
  {
    id: 1,
    name: 'Maria Silva',
    city_role: 'São Paulo, SP',
    text: 'A experiência com a TOTOTUR foi transformadora. Não foi apenas um passeio, foi um mergulho profundo na beleza natural da ilha com um atendimento impecável.',
    rating: 5,
  },
  {
    id: 2,
    name: 'João Santos',
    city_role: 'Rio de Janeiro, RJ',
    text: 'Sabe aquele momento que você quer parar o tempo? Foi assim em cada parada. O roteiro exclusivo fora do circuito turístico tradicional fez toda a diferença.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Ana Costa',
    city_role: 'Belo Horizonte, MG',
    text: 'Guias que realmente conhecem e respeitam a natureza. A sensação de segurança e exclusividade transformou nossa viagem em família.',
    rating: 5,
  }
];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 50 : -50,
    opacity: 0,
    scale: 0.95,
  }),
};

const Testimonials = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [[page, direction], setPage] = useState([0, 0]);
  const sectionRef = useRef<HTMLElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [testimonials, setTestimonials] = useState<any[]>(initialTestimonials);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', city_role: '', text: '', rating: 5 });

  const activeTestimonialIndex = testimonials.length > 0 ? ((page % testimonials.length) + testimonials.length) % testimonials.length : 0;

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get('/api/testimonials');
      if (response.data && response.data.length > 0) {
        setTestimonials(response.data);
      }
    } catch (error) {
      console.error("Error fetching testimonials", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('/api/testimonials', formData);
      toast.success('Depoimento enviado com sucesso! Obrigado!');
      setFormData({ name: '', city_role: '', text: '', rating: 5 });
      setIsModalOpen(false);
      fetchTestimonials();
    } catch (error) {
      console.error("Error submitting testimonial", error);
      toast.error('Erro ao enviar depoimento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'User';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const paginate = useCallback((newDirection: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setPage([page + newDirection, newDirection]);
    setTimeout(() => setIsAnimating(false), 150); // Velocidade máxima
  }, [page, isAnimating]);

  // Auto-advance carousel
  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      paginate(1);
    }, 6000);
  }, [paginate]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      startAutoPlay();
    }
    return () => stopAutoPlay();
  }, [isVisible, startAutoPlay, stopAutoPlay]);

  const setIndex = (index: number) => {
    if (isAnimating || index === activeTestimonialIndex) return;
    const newDirection = index > activeTestimonialIndex ? 1 : -1;
    setIsAnimating(true);
    setPage([index, newDirection]);
    setTimeout(() => setIsAnimating(false), 150); // Velocidade máxima
  }

  return (
    <section
      id="depoimentos"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-gradient-to-br from-[#E8E0D5] via-[#F5F0E8] to-[#E8E0D5] relative overflow-hidden"
    >
      {/* Organic Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Abstract Shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#365A38]/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#8B6F4E]/5 rounded-full blur-3xl animate-float" />

        {/* Floating Boats Decoration */}
        <div className="absolute top-20 left-10 opacity-10 animate-float-slow">
          <Sailboat className="w-48 h-48 text-[#365A38] rotate-[-5deg]" />
        </div>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

          {/* Left Column: Title & Context */}
          <div className={`lg:col-span-5 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}>
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-12 h-[2px] bg-[#365A38]" />
              <span className="text-[#365A38] font-bold uppercase tracking-widest text-sm">
                Histórias Reais
              </span>
            </div>

            <h2 className="text-4xl lg:text-6xl font-bold text-[#2C2416] leading-[1.1] mb-8 font-['Montserrat']">
              Memórias que <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#365A38] to-[#5C4A3A]">
                Ficam para Sempre
              </span>
            </h2>

            <p className="text-lg text-[#5C4A3A]/80 leading-relaxed mb-10 max-w-md">
              Não vendemos apenas passeios, criamos experiências inesquecíveis.
              Veja o que nossos aventureiros têm a dizer sobre seus momentos conosco.
            </p>

            <button
              onClick={() => setIsModalOpen(true)}
              className="group flex items-center gap-2 px-8 py-4 bg-[#365A38] text-white font-bold rounded-full hover:bg-[#2C2416] transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-[#365A38]/30 mb-8"
            >
              <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
              Deixe seu Depoimento
            </button>

            {/* Decoration Quote */}
            <Quote className="w-24 h-24 text-[#365A38]/10 hidden lg:block ml-10" />
          </div>

          {/* Right Column: Glassmorphism Testimonial Card */}
          <div className={`lg:col-span-7 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
            <div
              className="relative rounded-[2.5rem] p-8 md:p-12 min-h-[600px] flex flex-col
                         bg-white/40 backdrop-blur-xl border border-white/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]
                         hover:shadow-[0_25px_70px_-15px_rgba(54,90,56,0.15)] transition-shadow duration-500"
              onMouseEnter={stopAutoPlay}
              onMouseLeave={startAutoPlay}
            >

              {/* Card Content Wrapper */}
              <div className="relative flex-1 min-h-[400px]">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={page}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 500, damping: 30 }, // Super rápido
                      opacity: { duration: 0.15 }, // Quase instantâneo
                      scale: { duration: 0.15 }
                    }}
                    className="absolute inset-0 flex flex-col justify-between py-4"
                  >
                    <div>
                      {/* Stars */}
                      <div className="flex gap-2 mb-6 md:mb-8">
                        {[...Array(testimonials[activeTestimonialIndex].rating)].map((_, i) => (
                          <Star key={i} className="w-6 h-6 fill-[#E5B946] text-[#E5B946] drop-shadow-sm" />
                        ))}
                      </div>

                      {/* Text */}
                      <blockquote className="text-xl md:text-2xl lg:text-[1.7rem] text-[#2C2416] leading-relaxed font-medium relative z-10">
                        "{testimonials[activeTestimonialIndex].text}"
                      </blockquote>
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center gap-5 pt-6 border-t border-[#365A38]/10 mt-auto">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#365A38] to-[#8B6F4E] flex items-center justify-center text-white text-xl font-bold border-4 border-white shadow-lg flex-shrink-0">
                        {getInitials(testimonials[activeTestimonialIndex].name)}
                      </div>
                      <div>
                        <cite className="not-italic block text-xl font-bold text-[#2C2416]">
                          {testimonials[activeTestimonialIndex].name}
                        </cite>
                        <span className="block text-sm text-[#5C4A3A] font-medium mt-1">
                          {testimonials[activeTestimonialIndex].city_role}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between mt-8 relative z-20">
                {/* Dots */}
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setIndex(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${index === activeTestimonialIndex
                        ? 'w-10 bg-[#365A38]'
                        : 'w-2 bg-[#365A38]/20 hover:bg-[#365A38]/40'
                        }`}
                      aria-label={`Ir para depoimento ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Arrows */}
                <div className="flex gap-3">
                  <button
                    onClick={() => paginate(-1)}
                    className="w-12 h-12 rounded-full bg-white text-[#365A38] flex items-center justify-center 
                               shadow-lg border border-[#E8E0D5] hover:bg-[#365A38] hover:text-white 
                               transition-all duration-300 hover:scale-110 active:scale-95 z-30 cursor-pointer"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => paginate(1)}
                    className="w-12 h-12 rounded-full bg-[#365A38] text-white flex items-center justify-center 
                               shadow-lg border border-[#365A38] hover:bg-[#2C2416] hover:border-[#2C2416] 
                               transition-all duration-300 hover:scale-110 active:scale-95 z-30 cursor-pointer"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Modal de Depoimento */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md bg-brand-beige-light border-none p-0 overflow-hidden">
          <div className="p-6 md:p-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-brand-brown hover:text-brand-terracotta transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <DialogHeader className="mb-6">
              <h3 className="text-2xl font-bold text-brand-text-dark">Sua Experiência</h3>
              <p className="text-brand-brown-dark text-sm mt-1">Compartilhe como foi viajar com a Guia Ligiane.</p>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-brand-brown mb-1">Seu Nome</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-brand-brown/20 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta outline-none transition-all bg-white"
                  placeholder="Ex: Maria Silva"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-brown mb-1">De onde você é?</label>
                <input
                  type="text"
                  required
                  value={formData.city_role}
                  onChange={(e) => setFormData({ ...formData, city_role: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-brand-brown/20 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta outline-none transition-all bg-white"
                  placeholder="Ex: Aracaju, SE"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-brown mb-1">Nota (1 a 5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: num })}
                      className="p-1 focus:outline-none"
                    >
                      <Star className={`w-8 h-8 ${formData.rating >= num ? 'fill-[#E5B946] text-[#E5B946]' : 'text-gray-300'} transition-colors`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-brown mb-1">Seu Comentário</label>
                <textarea
                  required
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-brand-brown/20 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta outline-none transition-all bg-white resize-none"
                  placeholder="Conte-nos como foi seu passeio..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 mt-2 bg-brand-terracotta text-white font-bold rounded-lg shadow-lg shadow-brand-terracotta/20 hover:bg-brand-brown-dark transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Depoimento'}
              </button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Testimonials;
