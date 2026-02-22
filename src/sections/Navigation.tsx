import { useState } from 'react';
import { Menu, X, Home, Info, MapPin, Images, MessageSquare, MessageCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
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
        <a
            href="#inicio"
            onClick={(e) => {
                e.preventDefault();
                handleNavClick('#inicio');
            }}
            className="flex items-center gap-3 group cursor-pointer"
        >
            <img
                src="/images/logo-hd.webp"
                alt="Logo Trilhas de Sergipe"
                className="h-16 md:h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
            />
        </a>
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
        <>
            <header
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrollY > 50 || !isHome
                    ? 'bg-white/95 backdrop-blur-lg shadow-sm py-3'
                    : isMobileMenuOpen
                        ? 'bg-transparent' // Remove bg when menu opens to avoid conflict
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
            </header>

            {/* Mobile Menu - Compact Bottom Sheet (Auto Height) */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-[9999] flex items-end justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Menu Content - Auto Height & Bottom Aligned */}
                    <div className="relative bg-white w-full rounded-t-3xl shadow-2xl flex flex-col animate-slide-up max-h-[80vh]">

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                            <div className="flex items-center gap-3">
                                <span className="w-1.5 h-5 bg-[#365A38] rounded-full"></span>
                                <span className="text-[#2C2416] font-bold text-lg">Menu</span>
                            </div>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Navigation Links - Compact List */}
                        <nav className="flex flex-col p-2 overflow-y-auto">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <button
                                        key={link.name}
                                        onClick={() => handleNavClick(link.href)}
                                        className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#F5F0E8] group transition-all duration-200"
                                    >
                                        <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all duration-200">
                                            <Icon className="w-5 h-5 text-[#C68D5D] group-hover:text-[#365A38]" />
                                        </div>
                                        <span className="text-[#2C2416] font-bold text-lg text-left">{link.name}</span>
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Footer / CTA - Compact */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50 pb-8 shrink-0">
                            <a
                                href={whatsappUrl('Olá! Vim pelo site e gostaria de saber sobre os passeios.')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-3 rounded-xl font-bold text-lg shadow-md active:scale-95 transition-all"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Reservar Agora
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navigation;
