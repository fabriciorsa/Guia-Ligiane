import { useState, useEffect } from 'react';
import { ArrowRight, MapPin, Sailboat } from 'lucide-react';

const Hero = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = [
        "/images/barco_na_pomonga.png",
        "/images/tour-boat-1.webp" // Falback to existing image since generation failed
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const scrollToTours = () => {
        const toursSection = document.getElementById('passeios');
        if (toursSection) {
            toursSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="inicio" className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image Slider with Overlay */}
            {images.map((img, index) => (
                <div
                    key={img}
                    className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img
                        src={img}
                        alt={`Passeio de Barco em Sergipe ${index + 1}`}
                        className={`w-full h-full object-cover object-[50%_75%] transition-transform duration-[10000ms] ease-linear ${index === currentImageIndex ? 'scale-115' : 'scale-100'}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90" />
                </div>
            ))}

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center text-white">
                <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md px-6 py-2 rounded-full mb-6 border border-white/10 animate-fade-in shadow-2xl ring-1 ring-white/20">
                    <MapPin className="w-4 h-4 text-[#C68D5D]" />
                    <span className="text-sm font-bold tracking-widest uppercase text-shadow-md">Aracaju - Sergipe</span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight animate-slide-up drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                    Descubra o Paraíso <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C68D5D] via-[#F5F0E8] to-[#C68D5D] animate-gradient drop-shadow-md">
                        Em Sergipe
                    </span>
                </h1>

                <p className="text-lg sm:text-xl md:text-2xl text-white mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed animate-slide-up drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-semibold px-4" style={{ animationDelay: '0.2s' }}>
                    Conheça as belezas naturais de Sergipe com quem entende do assunto. Experiências únicas em roteiros personalizados.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up px-4" style={{ animationDelay: '0.4s' }}>
                    <button
                        onClick={scrollToTours}
                        className="w-full sm:w-auto group bg-[#C68D5D] hover:bg-[#A87246] text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
                    >
                        Ver Nossos Passeios
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <a
                        href="https://wa.me/5598992265003"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg border-2 border-white text-white hover:bg-white hover:text-[#2C2416] transition-all shadow-lg hover:shadow-xl backdrop-blur-sm flex items-center justify-center"
                    >
                        Falar no WhatsApp
                    </a>
                </div>
            </div>

            {/* Scroll Indicator - Boat Animation */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer" onClick={scrollToTours}>
                <div className="animate-float">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-lg">
                        <Sailboat className="w-6 h-6 text-white opacity-90" />
                    </div>
                    <div className="flex justify-center mt-2">
                        <div className="w-1 h-8 bg-gradient-to-b from-white/50 to-transparent rounded-full"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
