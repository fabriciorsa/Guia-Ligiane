import { ArrowRight, MapPin, Sailboat } from 'lucide-react';
import { whatsappUrl } from '@/constants/contact';

const Hero = () => {

    const scrollToTours = () => {
        const toursSection = document.getElementById('passeios');
        if (toursSection) {
            toursSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="inicio" className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Main Background Image - Single Image optimization */}
            <div
                style={{ backgroundColor: "#112330" }}
                className="absolute inset-0 z-0 opacity-100"
            >
                <img
                    src="/images/hero_tototo.webp"
                    alt="Passeio de Barco Tototó em Sergipe"
                    className="w-full h-full object-cover object-[50%_50%] sm:object-[50%_75%]"
                    loading="eager"
                    fetchPriority="high"
                    decoding="sync"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center text-white">
                <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 sm:px-6 py-2 rounded-full mb-4 sm:mb-6 border border-white/10 animate-fade-in shadow-2xl ring-1 ring-white/20 max-w-full">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#C68D5D] shrink-0" />
                    <span className="text-[10px] sm:text-sm font-bold tracking-widest uppercase text-shadow-md truncate">Barra dos Coqueiros – Aracaju – Sergipe</span>
                </div>

                <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-6 leading-tight animate-slide-up drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C68D5D] via-[#F5F0E8] to-[#C68D5D] animate-gradient drop-shadow-md">
                        TOTOTUR
                    </span>
                </h1>

                <p className="text-lg sm:text-xl md:text-2xl text-white mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed animate-slide-up drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-semibold px-4" style={{ animationDelay: '0.2s' }}>
                    Turismo, cultura e consciência ambiental a bordo de um Tototó, navegando por ilhas inimagináveis entre os rios Sergipe e Pomonga.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up w-full max-w-[320px] sm:max-w-none mx-auto" style={{ animationDelay: '0.4s' }}>
                    <a
                        href="#passeios"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToTours();
                        }}
                        className="w-full sm:w-[280px] h-[56px] flex items-center justify-center gap-2 bg-[#C68D5D] hover:bg-[#A87246] text-white rounded-full font-bold text-[17px] transition-all active:scale-95 shadow-xl border-2 border-[#C68D5D] group appearance-none"
                    >
                        Ver Nossos Passeios
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a
                        href={whatsappUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-[280px] h-[56px] flex items-center justify-center bg-transparent hover:bg-white text-white hover:text-[#2C2416] border-2 border-white rounded-full font-bold text-[17px] transition-all active:scale-95 shadow-xl appearance-none"
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
