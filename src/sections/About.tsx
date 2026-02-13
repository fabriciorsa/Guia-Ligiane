import { CheckCircle2, MapPin } from 'lucide-react';

const About = () => {
    const features = [
        'Guias locais experientes e credenciados',
        'Veículos 4x4 modernos e confortáveis',
        'Roteiros exclusivos e personalizados',
        'Atendimento humanizado 24h'
    ];

    return (
        <section id="sobre" className="py-20 lg:py-32 bg-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-[#F5F0E8]/50 skew-x-12 translate-x-1/4 z-0 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">

                    {/* Image Composition */}
                    <div className="w-full lg:w-1/2 relative group">
                        <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#C68D5D]/20 rounded-full blur-2xl animate-pulse-glow" />
                        <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-[#365A38]/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />

                        <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/50 transform transition-transform duration-700 hover:scale-[1.02]">
                            <img
                                src="/images/guia_ligiane.jpeg"
                                alt="Guia Ligiane"
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="w-full lg:w-1/2">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-12 h-[2px] bg-[#C68D5D]"></span>
                            <span className="text-[#C68D5D] font-bold tracking-widest uppercase text-sm">
                                Nossa Essência
                            </span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-extrabold text-[#2C2416] mb-8 leading-[1.15]">
                            Especialistas em Criar <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#365A38] to-[#5C8D60]">
                                Memórias Inesquecíveis
                            </span>
                        </h2>

                        <p className="text-[#5D5446] text-lg mb-8 leading-relaxed">
                            Há mais de uma década, a <strong className="text-[#365A38]">Trilhas de Sergipe</strong> conecta viajantes às belezas do nosso estado.
                            Não oferecemos apenas transporte; oferecemos uma imersão completa na cultura, na natureza e na magia deste paraíso.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-10">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-start gap-3 group">
                                    <div className="mt-1 p-0.5 bg-[#E8F5E9] rounded-full group-hover:bg-[#C8E6C9] transition-colors">
                                        <CheckCircle2 className="w-4 h-4 text-[#365A38]" />
                                    </div>
                                    <span className="text-[#4A4A4A] font-medium group-hover:text-[#2C2416] transition-colors">
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => document.getElementById('passeios')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-8 py-4 bg-[#2C2416] text-white font-bold rounded-full hover:bg-[#365A38] transition-colors shadow-lg flex items-center justify-center gap-2 group w-full sm:w-auto"
                            >
                                Conhecer Roteiros
                                <MapPin className="w-4 h-4 group-hover:animate-bounce" />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default About;
