import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

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
        { name: 'Início', href: '#inicio' },
        { name: 'Sobre', href: '#sobre' },
        { name: 'Passeios', href: '#passeios' },
        { name: 'Galeria', href: '#galeria' },
        { name: 'Depoimentos', href: '#depoimentos' },
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
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrollY > 50 || !isHome || isMobileMenuOpen
                ? 'bg-white/95 backdrop-blur-lg shadow-sm py-3'
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

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-white/95 backdrop-blur-xl z-[60] flex flex-col justify-center items-center gap-8 animate-fade-in">
                    {/* Close Button positioned absolutely top-right matches header height */}
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="absolute top-6 right-4 p-2 text-[#2C2416] hover:bg-black/5 rounded-full transition-colors"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="flex flex-col items-center gap-6 w-full px-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => handleNavClick(link.href)}
                                className="text-[#2C2416] font-bold text-2xl py-2 w-full text-center hover:text-[#C68D5D] transition-colors border-b border-transparent hover:border-[#C68D5D]/20"
                            >
                                {link.name}
                            </button>
                        ))}
                        <div className="w-16 h-1 bg-[#C68D5D] rounded-full my-4"></div>
                        <a
                            href="https://wa.me/5598992265003"
                            className="bg-[#365A38] text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider shadow-lg active:scale-95 transition-transform"
                        >
                            Reservar Agora
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navigation;
