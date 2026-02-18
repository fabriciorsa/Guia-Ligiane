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

            {/* Mobile Menu - Full Screen White Overlay (Moved outside Header for Safety) */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-[9999] bg-white animate-fade-in flex flex-col h-[100dvh] w-screen overflow-hidden">

                    {/* Header inside Modal */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                        <div className="flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-[#365A38] rounded-full"></span>
                            <span className="text-[#2C2416] font-bold text-xl tracking-tight">Menu</span>
                        </div>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                            <X className="w-8 h-8" />
                        </button>
                    </div>

                    {/* Navigation Links - Centered & Large */}
                    <nav className="flex-1 flex flex-col justify-center px-8 gap-4 overflow-y-auto">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <button
                                    key={link.name}
                                    onClick={() => handleNavClick(link.href)}
                                    className="flex items-center gap-6 px-4 py-4 rounded-2xl hover:bg-[#F5F0E8] group transition-all duration-200 shrink-0"
                                >
                                    <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-white group-hover:shadow-md transition-all duration-200">
                                        <Icon className="w-6 h-6 text-[#C68D5D] group-hover:text-[#365A38]" />
                                    </div>
                                    <span className="text-[#2C2416] font-bold text-2xl text-left">{link.name}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Footer / CTA */}
                    <div className="p-8 border-t border-gray-100 bg-gray-50 shrink-0">
                        <a
                            href={whatsappUrl('Olá! Vim pelo site e gostaria de saber sobre os passeios.')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-5 rounded-2xl font-bold text-xl shadow-lg active:scale-95 transition-all"
                        >
                            <MessageCircle className="w-7 h-7" />
                            Reservar Agora
                        </a>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navigation;
