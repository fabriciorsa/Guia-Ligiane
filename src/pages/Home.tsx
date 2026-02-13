import { useState, useEffect } from 'react';
import Navigation from '../sections/Navigation';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Tours from '../sections/Tours';
import Gallery from '../sections/Gallery';
import Testimonials from '../sections/Testimonials';
import CTA from '../sections/CTA';
import Footer from '../sections/Footer';
import BoatScrollbar from '../components/BoatScrollbar';

const Home = () => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#F5F0E8] overflow-x-hidden relative">
            <Navigation scrollY={scrollY} />
            <BoatScrollbar />
            <main>
                <Hero />
                <About />
                <Tours />
                <Gallery />
                <Testimonials />
                <CTA />
            </main>
            <Footer />
        </div>
    );
};

export default Home;
