import { useState } from 'react';
import { Menu, X, Home, Info, MapPin, Images, MessageSquare, MessageCircle } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { whatsappUrl } from '@/constants/contact';

interface NavigationProps {
    scrollY: number;
}

const Navigation = ({ scrollY }: NavigationProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const isHome = location.pathname === '/';

    // Paleta de Cores:
    // Verde Marca: #365A38
    // Terracota: #C68D5D
    // Bege Fundo: #F5F0E8
    // Texto Escuro: #2C2416

    const renderLogo = () => (
        <Link to="/" className="flex items-center gap-3 group">
            <img
                src="/images/logo-hd.webp"
                alt="Logo Trilhas de Sergipe"
                className="h-16 md:h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
            />
        </Link>
    );

    const navLinks = [
        { name: 'Início', href: '#inicio', icon: Home },
        { name: 'Sobre', href: '#sobre', icon: Info },
        { name: 'Passeios', href: '#passeios', icon: MapPin },
        { name: 'Galeria', href: '#galeria', icon: Images },
        { name: 'Depoimentos', href: '#depoimentos', icon: MessageSquare },
    ];

    const handleNavClick = (href: string) => {
        setIsMobileMenuOpen(false);
        if (!isHome) {
            navigate('/');
            setTimeout(() => {
                const element = document.querySelector(href);
                element?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const element = document.querySelector(href);
            element?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrollY > 50 || !isHome
                ? 'bg-white/95 backdrop-blur-lg shadow-sm py-3'
                : isMobileMenuOpen
                ? 'bg-white/98 backdrop-blur-lg shadow-sm py-3'
                : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
                {renderLogo()}

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <button
                            key={link.name}
                            onClick={() => handleNavClick(link.href)}
                            className={`text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:text-[#C68D5D] relative group ${scrollY > 50 || !isHome ? 'text-[#2C2416]' : 'text-white shadow-black drop-shadow-sm'
                                }`}
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#C68D5D] transition-all duration-300 group-hover:w-full"></span>
                        </button>
                    ))}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className={`md:hidden p-2 rounded-lg transition-colors ${scrollY > 50 || !isHome ? 'hover:bg-gray-100 text-[#2C2416]' : 'hover:bg-white/20 text-white'
                        }`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Menu"
                >
                    {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                </button>
            </div>

            {/* Mobile Menu Modal */}
            {isMobileMenuOpen && (
                <>
                    {/* Backdrop com blur suave */}
                    <div
                        className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-md z-[60] animate-fade-in"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Modal branco estilizado - melhor posicionamento */}
                    <div className="md:hidden fixed inset-x-4 top-24 bottom-4 bg-white rounded-3xl shadow-2xl z-[70] flex flex-col overflow-hidden animate-scale-in border border-[#E8E0D5]/50">
                        {/* Header do Modal */}
                        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[#E8E0D5] bg-white">
                            <div className="flex items-center gap-3">
                                <img
                                    src="/images/logo-hd.webp"
                                    alt="Logo Trilhas de Sergipe"
                                    className="h-10 w-auto object-contain"
                                />
                                <span className="text-[#2C2416] font-bold text-lg">Menu</span>
                            </div>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 text-[#2C2416] hover:bg-[#F5F0E8] rounded-full transition-all duration-200 hover:rotate-90 active:scale-95"
                                aria-label="Fechar menu"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Conteúdo do Modal - Opções do Navbar */}
                        <div className="flex-1 flex flex-col px-6 py-6 overflow-y-auto">
                            <nav className="flex flex-col gap-2">
                                {navLinks.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <button
                                            key={link.name}
                                            onClick={() => handleNavClick(link.href)}
                                            className="group flex items-center gap-4 text-[#2C2416] font-bold text-base uppercase tracking-wider py-4 px-5 rounded-xl hover:bg-[#F5F0E8] hover:text-[#365A38] transition-all duration-200 active:scale-[0.98]"
                                        >
                                            <div className="p-2.5 bg-[#F5F0E8] rounded-lg group-hover:bg-[#365A38] transition-colors duration-200">
                                                <Icon className="w-5 h-5 text-[#C68D5D] group-hover:text-white transition-colors duration-200" />
                                            </div>
                                            <span className="flex-1 text-left">{link.name}</span>
                                        </button>
                                    );
                                })}
                            </nav>

                            {/* Separador */}
                            <div className="flex items-center gap-3 my-6">
                                <div className="flex-1 h-px bg-[#E8E0D5]"></div>
                                <div className="w-1.5 h-1.5 bg-[#C68D5D] rounded-full"></div>
                                <div className="flex-1 h-px bg-[#E8E0D5]"></div>
                            </div>

                            {/* Botão CTA WhatsApp */}
                            <a
                                href={whatsappUrl('Olá! Gostaria de reservar um passeio.')}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-center gap-3 bg-[#25D366] text-white px-6 py-4 rounded-xl font-bold text-base shadow-lg active:scale-95 transition-all duration-200 hover:bg-[#128C7E] hover:shadow-xl"
                            >
                                <MessageCircle className="w-5 h-5" />
                                <span>Reservar no WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </>
            )}
        </header>
    );
};

export default Navigation;
