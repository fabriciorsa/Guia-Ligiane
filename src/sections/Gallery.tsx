import { useEffect, useRef, useState } from 'react';
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';

const galleryImages = [
  { src: '/images/gallery-1.jpg', alt: 'Praia paradisíaca' },
  { src: '/images/gallery-2.jpg', alt: 'Turistas no barco' },
  { src: '/images/gallery-3.jpg', alt: 'Cachoeira na floresta' },
  { src: '/images/gallery-4.jpg', alt: 'Pôr do sol no mar' },
  { src: '/images/gallery-5.jpg', alt: 'Mergulho com peixes' },
  { src: '/images/gallery-6.jpg', alt: 'Ilha formato de coração' },
];

const Gallery = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
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

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;

      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  return (
    <section
      id="galeria"
      ref={sectionRef}
      className="section-padding bg-[#F5F0E8] relative overflow-hidden"
    >
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div
            className={`inline-flex items-center gap-2 mb-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
          >
            <div className="w-8 h-px bg-[#365A38]" />
            <span className="text-[#365A38] font-semibold text-sm uppercase tracking-wider">
              Galeria
            </span>
            <div className="w-8 h-px bg-[#365A38]" />
          </div>

          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C2416] mb-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            style={{ transitionDelay: '100ms' }}
          >
            Momentos <span className="text-[#365A38]">Inesquecíveis</span>
          </h2>

          <p
            className={`text-[#5C4A3A] text-lg transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            style={{ transitionDelay: '200ms' }}
          >
            Explore visualmente o que espera por você
          </p>
        </div>

        {/* Gallery Grid - 3 columns layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              onClick={() => openLightbox(index)}
              className={`group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-700 hover:shadow-xl aspect-[4/3] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                }`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C2416]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Zoom Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-sm font-medium">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button - White circle with brown X */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-20"
            aria-label="Fechar"
          >
            <X className="w-7 h-7 text-[#8B6F4E]" strokeWidth={2.5} />
          </button>

          {/* Navigation */}
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image Container - Fixed size */}
          <div
            className="w-full max-w-4xl px-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full">
              <img
                src={galleryImages[selectedImage].src}
                alt={galleryImages[selectedImage].alt}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <p className="text-white text-center mt-4 text-lg">
              {galleryImages[selectedImage].alt}
            </p>
          </div>

          {/* Thumbnails */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {galleryImages.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setSelectedImage(idx); }}
                className={`w-2 h-2 rounded-full transition-all ${idx === selectedImage ? 'bg-white w-6' : 'bg-white/40'
                  }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
