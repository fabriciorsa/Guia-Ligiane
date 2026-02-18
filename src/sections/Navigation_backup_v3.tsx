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
            {/* Mobile Menu Modal (Robust Implementation) */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-[9999] flex items-end justify-center p-4 pb-6">
                    {/* Backdrop - High Contrast */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Modal Content - Opaque White Card at Bottom */}
                    <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up ring-1 ring-black/5">

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-[#365A38] rounded-full"></span>
                                <span className="text-[#2C2416] font-bold text-xl tracking-tight">Navegação</span>
                            </div>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex flex-col p-4 gap-2 overflow-y-auto max-h-[60vh]">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <button
                                        key={link.name}
                                        onClick={() => handleNavClick(link.href)}
                                        className="flex items-center gap-4 px-4 py-4 rounded-xl text-left hover:bg-[#F5F0E8] group transition-all duration-200"
                                    >
                                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white group-hover:shadow-md transition-all duration-200">
                                            <Icon className="w-5 h-5 text-[#C68D5D] group-hover:text-[#365A38]" />
                                        </div>
                                        <span className="text-[#2C2416] font-bold text-lg">{link.name}</span>
                                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-[#365A38]">
                                            →
                                        </div>
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Footer / CTA */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50">
                            <a
                                href={whatsappUrl('Olá! Vim pelo site e gostaria de saber sobre os passeios.')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all"
                            >
                                <MessageCircle className="w-6 h-6" />
                                Reservar Agora
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navigation;
