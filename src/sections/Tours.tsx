import { useEffect, useRef, useState } from 'react';
import { Clock, ChevronLeft, ChevronRight, MapPin, Users, Star, MessageCircle, X, Calendar } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from '@/components/ui/dialog';
import { useTours, type Tour } from '../context/TourContext';

const Tours = () => {
    const { tours } = useTours();
    const [isVisible, setIsVisible] = useState(false);
    const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const openModal = (tour: Tour) => {
        setSelectedTour(tour);
        setCurrentImageIndex(0);
    };

    const closeModal = () => {
        setSelectedTour(null);
    };

    const nextImage = () => {
        if (selectedTour) {
            setCurrentImageIndex((prev) => (prev + 1) % selectedTour.images.length);
        }
    };

    const prevImage = () => {
        if (selectedTour) {
            setCurrentImageIndex((prev) => (prev - 1 + selectedTour.images.length) % selectedTour.images.length);
        }
    };

    const generateWhatsAppLink = (tour: Tour) => {
        const message = `Olá! Gostaria de reservar o passeio "${tour.title}" para o dia ${tour.date}.`;
        return `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    };

    return (
        <section
            id="passeios"
            ref={sectionRef}
            className="section-padding bg-brand-beige-light relative overflow-hidden"
        >
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-20 -left-20 w-96 h-96 bg-brand-terracotta/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 -right-20 w-96 h-96 bg-[#3E4D37]/5 rounded-full blur-3xl" />
            </div>

            <div className="container-custom relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <div
                        className={`inline-flex items-center gap-2 mb-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                            }`}
                    >
                        <div className="w-8 h-px bg-brand-terracotta" />
                        <span className="text-brand-terracotta font-semibold text-sm uppercase tracking-wider">
                            Agenda de Março
                        </span>
                        <div className="w-8 h-px bg-brand-terracotta" />
                    </div>

                    <h2
                        className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-text-dark mb-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            }`}
                        style={{ transitionDelay: '100ms' }}
                    >
                        Próximas <span className="text-brand-terracotta">Aventuras</span>
                    </h2>

                    <p
                        className={`text-brand-brown-dark text-lg transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                            }`}
                        style={{ transitionDelay: '200ms' }}
                    >
                        Garanta seu lugar nos roteiros exclusivos deste mês
                    </p>
                </div>

                {/* Tours Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
                    {tours.map((tour, index) => (
                        <div
                            key={tour.id}
                            onClick={() => openModal(tour)}
                            className={`group relative bg-brand-sand rounded-2xl overflow-hidden shadow-md transition-all duration-700 hover:shadow-xl hover:-translate-y-2 cursor-pointer preserve-3d border border-brand-terracotta/10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                                }`}
                            style={{ transitionDelay: `${400 + index * 150}ms` }}
                        >
                            {/* Image */}
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={tour.images[0]}
                                    alt={tour.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                {/* Price Badge */}
                                <div className="absolute top-4 right-4 bg-brand-terracotta text-white px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                                    R$ {tour.price}
                                </div>

                                {/* Date Badge */}
                                <div className="absolute top-4 left-4 bg-brand-gold text-brand-text-dark px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                                    <Calendar className="w-3 h-3 text-brand-text-dark" />
                                    {tour.date}
                                </div>

                                {/* Rating */}
                                <div className="absolute bottom-4 left-4 flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-brand-gold text-brand-gold" />
                                    <span className="text-white text-sm font-medium">{tour.rating}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div>
                                    <h3 className="text-xl font-bold text-brand-text-dark group-hover:text-brand-terracotta transition-colors leading-tight">
                                        {tour.title}
                                    </h3>
                                    {tour.subtitle && (
                                        <span className="text-sm text-brand-terracotta font-medium block mb-2 uppercase tracking-wide">
                                            {tour.subtitle}
                                        </span>
                                    )}
                                </div>

                                <p className="text-brand-brown-dark text-sm mb-4 line-clamp-2 mt-2">
                                    {tour.description}
                                </p>

                                {/* Meta Info */}
                                <div className="flex items-center gap-4 text-sm text-brand-brown border-t border-brand-terracotta/10 pt-4">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4 text-brand-terracotta" />
                                        <span>{tour.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4 text-brand-terracotta" />
                                        <span>Max {tour.maxPeople}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tour Modal */}
            <Dialog open={!!selectedTour} onOpenChange={closeModal}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-brand-beige-light border-none p-0">
                    {/* Custom Close Button */}
                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 z-50 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                        aria-label="Fechar"
                    >
                        <X className="w-6 h-6 text-brand-brown" strokeWidth={2.5} />
                    </button>

                    {selectedTour && (
                        <>
                            {/* Image Gallery */}
                            <div className="relative h-72 sm:h-96">
                                <img
                                    src={selectedTour.images[currentImageIndex]}
                                    alt={`${selectedTour.title} - Imagem ${currentImageIndex + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                {/* Navigation Arrows */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 text-[#365A38] rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all z-10"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 text-[#365A38] rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all z-10"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>

                                {/* Image Indicators */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                    {selectedTour.images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                            className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Title Overlay */}
                                {/* Title Overlay REMOVED */}
                            </div>

                            {/* Content */}
                            <div className="p-6 sm:p-8">
                                <DialogHeader className="mb-6">
                                    <div className="mb-4">
                                        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text-dark text-left leading-tight">
                                            {selectedTour.title}
                                        </h2>
                                        {selectedTour.subtitle && (
                                            <span className="text-brand-terracotta font-semibold text-lg block mt-1 uppercase">
                                                {selectedTour.subtitle}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-brand-brown">
                                        <div className="flex items-center gap-1 bg-brand-gold/20 px-3 py-1 rounded-full text-brand-brown-dark font-bold">
                                            <Calendar className="w-4 h-4 text-brand-terracotta" />
                                            <span>{selectedTour.date}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{selectedTour.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            <span>Até {selectedTour.maxPeople} pessoas</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>Sergipe, Brasil</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-brand-gold text-brand-gold" />
                                            <span>{selectedTour.rating}</span>
                                        </div>
                                    </div>
                                </DialogHeader>

                                {/* Description */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-brand-text-dark mb-3 border-l-4 border-brand-terracotta pl-3">Sobre o Passeio</h3>
                                    <p className="text-brand-brown-dark leading-relaxed">
                                        {selectedTour.fullDescription}
                                    </p>
                                </div>

                                {/* Features */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-brand-text-dark mb-3 border-l-4 border-brand-terracotta pl-3">O que está incluído</h3>
                                    <div className="grid sm:grid-cols-2 gap-3">
                                        {selectedTour.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-brand-brown-dark">
                                                <div className="w-5 h-5 bg-brand-terracotta/10 rounded-full flex items-center justify-center">
                                                    <div className="w-2 h-2 bg-brand-terracotta rounded-full" />
                                                </div>
                                                <span className="text-sm">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Price and CTA */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-xl border border-brand-beige shadow-sm">
                                    <div>
                                        <p className="text-sm text-brand-brown mb-1">Investimento</p>
                                        <p className="text-3xl font-bold text-brand-terracotta">
                                            R$ {selectedTour.price}
                                            <span className="text-sm font-normal text-brand-brown">/pessoa</span>
                                        </p>
                                    </div>
                                    <a
                                        href={generateWhatsAppLink(selectedTour)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-full sm:w-auto px-8 py-4 bg-[#25D366] text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-[#128C7E] transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        Reservar Vaga no WhatsApp
                                    </a>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </section>
    );
};

export default Tours;
