import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTours } from '../../context/TourContext';
import { Edit, Trash, LogOut, Save, X, Calendar, Clock, Users, Star, MessageCircle, LayoutList, Eye, PenTool, Upload, Tag, RefreshCcw, Image as ImageIcon, MessageSquare } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import axios from 'axios';

const Dashboard = () => {
    const { tours, addTour, updateTour, deleteTour, error, isLoading } = useTours();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<any>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
    const [previewImageIndex, setPreviewImageIndex] = useState(0);

    const [dashboardTab, setDashboardTab] = useState<'tours' | 'testimonials' | 'gallery'>('tours');
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [galleryImages, setGalleryImages] = useState<any[]>([]);

    useEffect(() => {
        if (dashboardTab === 'testimonials') {
            fetchTestimonials();
        } else if (dashboardTab === 'gallery') {
            fetchGallery();
        }
    }, [dashboardTab]);

    const fetchGallery = async () => {
        try {
            const response = await axios.get('/api/gallery');
            setGalleryImages(response.data);
        } catch (error) {
            console.error("Error fetching gallery", error);
            toast.error("Erro ao carregar galeria");
        }
    };

    const fetchTestimonials = async () => {
        try {
            const response = await axios.get('/api/testimonials');
            setTestimonials(response.data);
        } catch (error) {
            console.error("Error fetching testimonials", error);
            toast.error("Erro ao carregar os depoimentos");
        }
    };

    const handleDeleteTestimonial = async (id: number) => {
        if (confirm('Tem certeza que deseja excluir este depoimento? Isso refletirá imediatamente no site.')) {
            try {
                await axios.delete(`/api/testimonials/${id}`);
                setTestimonials(testimonials.filter(t => t.id !== id));
                toast.success('Depoimento excluído com sucesso');
            } catch (error) {
                console.error("Error deleting testimonial", error);
                toast.error("Erro ao excluir o depoimento");
            }
        }
    };

    const handleDeleteGalleryImage = async (id: number) => {
        if (confirm('Tem certeza que deseja excluir esta foto da galeria? O arquivo físico também será deletado do servidor.')) {
            try {
                await axios.delete(`/api/gallery/${id}`);
                setGalleryImages(galleryImages.filter(img => img.id !== id));
                toast.success('Imagem da galeria excluída');
            } catch (error) {
                console.error("Error deleting gallery image", error);
                toast.error("Erro ao excluir imagem");
            }
        }
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        toast.loading('Otimizando e enviando foto para a galeria...', { id: 'gallery-upload' });

        const processImage = (file: File): Promise<string> => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;
                        const MAX_SIZE = 1200;
                        if (width > height) {
                            if (width > MAX_SIZE) {
                                height *= MAX_SIZE / width;
                                width = MAX_SIZE;
                            }
                        } else {
                            if (height > MAX_SIZE) {
                                width *= MAX_SIZE / height;
                                height = MAX_SIZE;
                            }
                        }
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                            ctx.fillStyle = '#FFFFFF';
                            ctx.fillRect(0, 0, width, height);
                            ctx.drawImage(img, 0, 0, width, height);
                        }
                        resolve(canvas.toDataURL('image/webp', 0.8));
                    };
                    img.src = event.target?.result as string;
                };
                reader.readAsDataURL(file);
            });
        };

        try {
            for (let i = 0; i < files.length; i++) {
                const base64 = await processImage(files[i]);
                const response = await axios.post('/api/gallery', { image: base64 });
                setGalleryImages(prev => [{ id: response.data.id, image_url: response.data.image_url }, ...prev]);
            }
            toast.success('Foto recebida com sucesso!', { id: 'gallery-upload' });
        } catch (error) {
            console.error(error);
            toast.error('Erro ao enviar foto.', { id: 'gallery-upload' });
        } finally {
            e.target.value = '';
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    const handleDelete = (id: number) => {
        if (confirm('Tem certeza que deseja excluir este passeio e todas as suas imagens físicas?')) {
            deleteTour(id);
            toast.success('Passeio excluído com sucesso');
        }
    };

    const handleEdit = (tour: any) => {
        setIsEditing(tour.id);
        setEditForm({
            ...tour,
            featuresString: tour.features.join('\n'), // Helper for textarea
            images: tour.images || [] // Ensure images array exists
        });

        setActiveTab('edit'); // Reset to edit tab when opening
        setPreviewImageIndex(0); // Reset image index
    };

    const nextPreviewImage = () => {
        if (editForm.images?.length > 1) {
            setPreviewImageIndex((prev: number) => (prev + 1) % editForm.images.length);
        }
    };

    const prevPreviewImage = () => {
        if (editForm.images?.length > 1) {
            setPreviewImageIndex((prev: number) => (prev - 1 + editForm.images.length) % editForm.images.length);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const remainingSlots = 5 - (editForm.images?.length || 0);
        if (remainingSlots <= 0) {
            toast.error('Limite de 5 imagens atingido!');
            return;
        }

        const filesToProcess = Array.from(files).slice(0, remainingSlots);
        toast.loading('Otimizando imagens para alta performance...', { id: 'upload-toast' });

        const processImage = (file: File): Promise<string> => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;

                        // Limit dimensions (max 1200px)
                        const MAX_SIZE = 1200;
                        if (width > height) {
                            if (width > MAX_SIZE) {
                                height *= MAX_SIZE / width;
                                width = MAX_SIZE;
                            }
                        } else {
                            if (height > MAX_SIZE) {
                                width *= MAX_SIZE / height;
                                height = MAX_SIZE;
                            }
                        }

                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');

                        // Fill white background (useful if png with transparency)
                        if (ctx) {
                            ctx.fillStyle = '#FFFFFF';
                            ctx.fillRect(0, 0, width, height);
                            ctx.drawImage(img, 0, 0, width, height);
                        }

                        // Compress to WebP at 80% quality for drastic size reduction
                        resolve(canvas.toDataURL('image/webp', 0.8));
                    };
                    img.src = event.target?.result as string;
                };
                reader.readAsDataURL(file);
            });
        };

        try {
            const newImages = await Promise.all(filesToProcess.map(processImage));

            setEditForm((prev: any) => ({
                ...prev,
                images: [...(prev.images || []), ...newImages]
            }));

            toast.success('Imagens carregadas super rápidas!', { id: 'upload-toast' });
        } catch (error) {
            toast.error('Erro ao processar as imagens', { id: 'upload-toast' });
        } finally {
            // Reset input
            e.target.value = '';
        }
    };

    const removeImage = (index: number) => {
        setEditForm((prev: any) => ({
            ...prev,
            images: prev.images.filter((_: any, i: number) => i !== index)
        }));
    };

    const setCoverImage = (index: number) => {
        setEditForm((prev: any) => {
            const newImages = [...prev.images];
            const [selectedImage] = newImages.splice(index, 1);
            newImages.unshift(selectedImage);
            return { ...prev, images: newImages };
        });
        toast.success('Imagem de capa definida!');
    };

    const handleSave = () => {
        if (isEditing) {
            toast.loading('Salvando alterações e otimizando imagens...', { id: 'save-toast' });

            const updatedTour = {
                ...editForm,
                features: editForm.featuresString.split('\n').filter((f: string) => f.trim() !== '')
            };
            delete updatedTour.featuresString; // Clean up helper

            updateTour(isEditing, updatedTour).then(() => {
                setIsEditing(null);
                toast.success('Passeio salvo no Banco de Dados com sucesso!', { id: 'save-toast' });
            }).catch(() => {
                toast.error('Erro ao salvar no Banco de Dados', { id: 'save-toast' });
            });
        }
    };

    const handleAddNew = () => {
        if (error) {
            toast.error('Falha de conexão: O Servidor ou o Banco de Dados estão offline.', { id: 'new-toast' });
            return;
        }

        const newTour: any = {
            id: Date.now(),
            title: 'Nova Trilha',
            subtitle: '',
            description: 'Breve resumo do passeio.',
            fullDescription: 'Descrição completa da experiência e do roteiro...',
            duration: '0 horas',
            date: 'Consulte agenda',
            price: '150.00',
            images: [], // Start without images to encourage real uploads
            features: ['Transporte', 'Guia Local', 'Almoço não incluso'],
            rating: 5.0,
            reviews: 0,
            maxPeople: 20
        };
        toast.loading('Preparando novo registro...', { id: 'new-toast' });

        addTour(newTour).then(() => {
            toast.success('Rascunho criado. Preencha os detalhes e insira fotos.', { id: 'new-toast' });
        }).catch(() => {
            toast.error('Falha ao criar rascunho', { id: 'new-toast' });
        });
    };

    const filteredTours = useMemo(() => {
        return tours.filter((tour: any) => tour.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [tours, searchTerm]);

    // Live Preview Component
    const renderPreview = () => {
        const previewData = {
            ...editForm,
            features: editForm.featuresString ? editForm.featuresString.split('\n').filter((f: string) => f.trim() !== '') : []
        };

        return (
            <div className="bg-white rounded-[24px] shadow-2xl overflow-hidden border border-gray-100 relative w-full max-w-sm sm:max-w-md mx-auto ring-1 ring-black/5">
                {/* Hero Image */}
                <div className="relative h-56 sm:h-72 group">
                    {previewData.images?.length > 0 ? (
                        <img
                            src={previewData.images[previewImageIndex]}
                            alt={previewData.title}
                            className="w-full h-full object-cover transition-opacity duration-300"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-400">
                            <ImageIcon className="w-12 h-12 mb-2 opacity-30" />
                            <span className="text-sm font-medium">Sem Imagens</span>
                        </div>
                    )}

                    {/* Dark gradient for overlay text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

                    {/* Image Indicators (Dots) */}
                    {previewData.images?.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                            {previewData.images.map((_: any, idx: number) => (
                                <div
                                    key={idx}
                                    className={`w-1.5 h-1.5 rounded-full transition-all ${idx === previewImageIndex ? 'bg-white w-4' : 'bg-white/40'}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Navigation Arrows */}
                    {previewData.images?.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevPreviewImage(); }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100"
                            >
                                <div className="w-2.5 h-2.5 border-t-2 border-l-2 border-current -rotate-45 ml-0.5" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextPreviewImage(); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100"
                            >
                                <div className="w-2.5 h-2.5 border-t-2 border-r-2 border-current rotate-45 mr-0.5" />
                            </button>
                        </>
                    )}

                    {/* Overlay Title */}
                    <div className="absolute bottom-4 left-5 right-5 z-10">
                        <h2 className="text-2xl font-black text-white leading-tight drop-shadow-md">
                            {previewData.title || 'Título da Trilha'}
                        </h2>
                        {previewData.subtitle && (
                            <span className="text-white/90 font-bold text-sm block mt-1 uppercase tracking-widest drop-shadow-md text-[#C68D5D]">
                                {previewData.subtitle}
                            </span>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 bg-white">
                    <div className="flex flex-wrap items-center gap-2 mb-6 text-xs font-semibold text-gray-600">
                        <div className="flex items-center gap-1.5 bg-[#C68D5D]/10 px-3 py-1.5 rounded-full text-[#C68D5D]">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{previewData.date || 'Data a definir'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{previewData.duration || '--'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
                            <Users className="w-3.5 h-3.5" />
                            <span>Até {previewData.maxPeople || '0'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-full text-yellow-600">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{previewData.rating || '5.0'}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="text-sm font-black text-gray-900 mb-2.5 border-l-4 border-[#2A452B] pl-3 uppercase tracking-wider">A Experiência</h3>
                        <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
                            {previewData.fullDescription || 'Descrição incrível da trilha...'}
                        </p>
                    </div>

                    {/* Features */}
                    <div className="mb-8">
                        <h3 className="text-sm font-black text-gray-900 mb-3.5 border-l-4 border-[#2A452B] pl-3 uppercase tracking-wider">Incluso no Pacote</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {previewData.features?.map((feature: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-2.5 text-gray-600 text-sm">
                                    <div className="w-5 h-5 bg-[#2A452B]/10 rounded-full flex items-center justify-center shrink-0">
                                        <div className="w-1.5 h-1.5 bg-[#2A452B] rounded-full" />
                                    </div>
                                    <span className="font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex flex-col gap-3 p-5 bg-[#F8F9FA] rounded-[20px] ring-1 ring-black/5">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">Valor do Ingresso</p>
                                <p className="text-3xl font-black text-[#2A452B]">
                                    <span className="text-xl font-bold mr-1 align-top">R$</span>
                                    {previewData.price ? String(previewData.price).replace('.', ',') : '0,00'}
                                </p>
                            </div>
                        </div>
                        <button disabled className="w-full py-4 bg-[#25D366] text-white font-black rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#25D366]/20 mt-2 opacity-50 cursor-not-allowed">
                            <MessageCircle className="w-5 h-5" />
                            Simular Reserva (Inativo)
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-[100dvh] bg-[#F8F9FA] font-sans text-gray-800 overflow-hidden">
            <Toaster position="top-right" />

            {/* Sidebar Desktop */}
            <aside className="w-[280px] bg-white border-r border-gray-200 hidden md:flex flex-col z-20 shadow-sm relative shrink-0">
                <div className="px-8 pt-8 pb-6 flex items-center justify-center border-b border-gray-100/50 mix-blend-multiply">
                    <img src="/images/logo-hd.webp" alt="Trilhas de Sergipe Logo" className="w-[120px] object-contain drop-shadow-sm" />
                </div>

                <div className="px-8 py-5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Painel Administrativo</p>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <button
                        onClick={() => setDashboardTab('tours')}
                        className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl font-bold transition-all shadow-sm group ${dashboardTab === 'tours' ? 'bg-[#2A452B] text-white shadow-[#2A452B]/20' : 'text-gray-600 hover:bg-gray-100 hover:text-[#2A452B]'}`}>
                        <LayoutList className={`w-5 h-5 transition-transform ${dashboardTab === 'tours' ? 'text-white/90 group-hover:scale-110' : ''}`} />
                        <span>Catálogo de Trilhas</span>
                    </button>
                    <button
                        onClick={() => setDashboardTab('testimonials')}
                        className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl font-bold transition-all shadow-sm group ${dashboardTab === 'testimonials' ? 'bg-[#2A452B] text-white shadow-[#2A452B]/20' : 'text-gray-600 hover:bg-gray-100 hover:text-[#2A452B]'}`}>
                        <MessageSquare className={`w-5 h-5 transition-transform ${dashboardTab === 'testimonials' ? 'text-white/90 group-hover:scale-110' : ''}`} />
                        <span>Avaliações</span>
                    </button>
                    <button
                        onClick={() => setDashboardTab('gallery')}
                        className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl font-bold transition-all shadow-sm group ${dashboardTab === 'gallery' ? 'bg-[#2A452B] text-white shadow-[#2A452B]/20' : 'text-gray-600 hover:bg-gray-100 hover:text-[#2A452B]'}`}>
                        <ImageIcon className={`w-5 h-5 transition-transform ${dashboardTab === 'gallery' ? 'text-white/90 group-hover:scale-110' : ''}`} />
                        <span>Galeria de Fotos</span>
                    </button>
                </nav>

                <div className="p-4 m-4 mt-auto rounded-2xl bg-gradient-to-br from-[#E8E0D5]/40 to-[#E8E0D5]/10 ring-1 ring-black/5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                        <RefreshCcw className={`w-5 h-5 ${error ? 'text-red-500' : 'text-green-600'} ${isLoading ? 'animate-spin' : ''}`} />
                    </div>
                    <div>
                        <p className="text-[11px] font-black text-gray-900 uppercase">Status do Sistema</p>
                        <div className="flex items-center gap-1.5 opacity-80">
                            <div className={`w-1.5 h-1.5 rounded-full shadow-sm ${error ? 'bg-red-500 shadow-red-500' : 'bg-green-500 shadow-green-500'}`}></div>
                            <p className={`text-[10px] font-bold ${error ? 'text-red-600' : 'text-gray-600'}`}>
                                {error ? 'Banco de Dados Offline' : isLoading ? 'Conectando...' : 'Sistema Operacional'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100">
                    <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full px-4 py-3.5 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl font-bold transition-colors">
                        <LogOut className="w-5 h-5" /> Sair com Segurança
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-[100dvh] overflow-hidden relative z-10 w-full min-w-0">
                {/* Mobile Header */}
                <header className="md:hidden bg-white/95 backdrop-blur-md border-b border-gray-100 p-4 sticky top-0 flex justify-between items-center z-30 shrink-0">
                    <img src="/images/logo-hd.webp" alt="Logo" className="w-[80px] object-contain mix-blend-multiply" />
                    <button onClick={handleLogout} className="p-2.5 text-red-500 bg-red-50/80 rounded-xl active:scale-95 transition-transform"><LogOut className="w-5 h-5" /></button>
                </header>

                {/* Main Scrollable Area */}
                <div className="flex-1 overflow-y-auto w-full custom-scrollbar relative">
                    {!isEditing && (
                        <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* Page Header */}
                            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-5 bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100">
                                {/* Header Switcher Texts */}
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                                        {dashboardTab === 'tours' ? 'Catálogo de Trilhas' : dashboardTab === 'testimonials' ? 'Avaliações de Clientes' : 'Galeria de Fotos'}
                                    </h2>
                                    <p className="text-gray-500 mt-1 md:mt-2 font-medium text-sm md:text-base">
                                        {dashboardTab === 'tours'
                                            ? 'Controle total sobre as opções oferecidas aos seus clientes no site principal.'
                                            : dashboardTab === 'testimonials'
                                                ? 'Gerencie os depoimentos deixados pelos aventureiros que já viajaram com você.'
                                                : 'Suba fotos com qualidade superior e de forma comprimida, enviando direto para a página Galeria.'
                                        }
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto shrink-0 mt-2 xl:mt-0">
                                    <div className="relative w-full sm:w-[320px]">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Busque por nome, local..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl leading-5 bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#C68D5D]/50 focus:border-[#C68D5D] transition-all font-bold text-gray-900"
                                        />
                                    </div>
                                </div>
                            </div>



                            {dashboardTab === 'tours' && (
                                <>
                                    {/* Tour Listing */}
                                    {filteredTours.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {filteredTours.map((tour: any) => (
                                                <div key={tour.id} className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full ring-1 ring-black/5">
                                                    <div className="relative h-60 overflow-hidden bg-gray-50/50 p-2">
                                                        <div className="w-full h-full rounded-[24px] overflow-hidden relative">
                                                            {tour.images?.length > 0 ? (
                                                                <img
                                                                    src={tour.images[0]}
                                                                    alt={tour.title}
                                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[800ms] ease-out"
                                                                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400?text=Sem+Foto')}
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                                                                    <ImageIcon className="w-12 h-12" />
                                                                </div>
                                                            )}

                                                            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

                                                            <div className="absolute top-4 left-4 flex gap-1.5">
                                                                <span className="bg-[#2A452B]/90 backdrop-blur-md text-white text-[10px] uppercase font-black px-3 py-1.5 rounded-xl shadow-sm border border-white/10">
                                                                    Público
                                                                </span>
                                                                {tour.date && (
                                                                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] uppercase font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm border border-white/10">
                                                                        <Calendar className="w-3.5 h-3.5" /> {tour.date}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Hover Overlay Actions */}
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                                                <button
                                                                    onClick={() => handleEdit(tour)}
                                                                    className="px-6 py-3 bg-white text-[#2A452B] font-black rounded-xl hover:bg-gray-100 transition-all shadow-lg active:scale-95 flex items-center gap-2"
                                                                >
                                                                    <Edit className="w-4 h-4" /> Editar
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(tour.id)}
                                                                    className="w-12 h-12 bg-red-500 text-white rounded-xl flex items-center justify-center hover:bg-red-600 transition-all shadow-lg active:scale-95"
                                                                    title="Excluir Permanentemente"
                                                                >
                                                                    <Trash className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="p-6 md:p-8 flex-1 flex flex-col pt-4">
                                                        <h3 className="text-2xl font-black text-gray-900 line-clamp-2 leading-tight mb-2 group-hover:text-[#2A452B] transition-colors">{tour.title}</h3>
                                                        {tour.subtitle && (
                                                            <p className="text-sm font-bold text-[#C68D5D] uppercase tracking-wide mb-3">{tour.subtitle}</p>
                                                        )}

                                                        <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-1 font-medium">
                                                            {tour.description}
                                                        </p>

                                                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto bg-gray-50/50 p-4 rounded-2xl">
                                                            <div>
                                                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-1">Preço Atual</span>
                                                                <span className="font-black text-[#C68D5D] text-2xl">R$ {parseFloat(tour.price || 0).toFixed(2).replace('.', ',')}</span>
                                                            </div>
                                                            <div className="flex flex-col items-end gap-1">
                                                                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-white px-2.5 py-1 rounded-md shadow-sm border border-gray-100">
                                                                    <Clock className="w-3.5 h-3.5 text-gray-400" /> {tour.duration}
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-white px-2.5 py-1 rounded-md shadow-sm border border-gray-100">
                                                                    <Users className="w-3.5 h-3.5 text-gray-400" /> Max {tour.maxPeople}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-white rounded-[32px] border border-gray-100 p-16 text-center shadow-sm">
                                            <div className="w-24 h-24 bg-gray-50 rounded-[24px] flex items-center justify-center mx-auto mb-6 text-gray-300">
                                                <Tag className="w-10 h-10" />
                                            </div>
                                            <h3 className="text-2xl font-black text-gray-900 mb-2">Poxa, nenhuma trilha.</h3>
                                            <p className="text-gray-500 max-w-md mx-auto font-medium">
                                                Parece que não temos nenhuma trilha cadastrada ainda ou sua busca não retornou resultados.
                                            </p>
                                            <button onClick={handleAddNew} className="mx-auto mt-8 flex items-center justify-center gap-2 px-8 py-3.5 bg-[#2A452B] text-white font-black rounded-xl shadow-lg shadow-[#2A452B]/20 hover:bg-[#1f3320] transition-all active:scale-95">
                                                Adicionar Minha Primeira Trilha
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}

                            {dashboardTab === 'testimonials' && (
                                /* Testimonials Listing */
                                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden ring-1 ring-black/5">
                                    {testimonials.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                                        <th className="p-5 font-black text-gray-900 text-sm">Cliente</th>
                                                        <th className="p-5 font-black text-gray-900 text-sm">Comentário</th>
                                                        <th className="p-5 font-black text-gray-900 text-sm w-24">Avaliação</th>
                                                        <th className="p-5 font-black text-gray-900 text-sm w-32">Data</th>
                                                        <th className="p-5 font-black text-gray-900 text-sm w-20 text-center">Ações</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {testimonials.map((testimonial) => (
                                                        <tr key={testimonial.id} className="hover:bg-gray-50/30 transition-colors">
                                                            <td className="p-5">
                                                                <p className="font-bold text-gray-900">{testimonial.name}</p>
                                                                <p className="text-xs text-gray-500 mt-0.5">{testimonial.city_role}</p>
                                                            </td>
                                                            <td className="p-5">
                                                                <p className="text-sm border-l-2 border-[#2A452B]/20 pl-3 text-gray-600 line-clamp-2" title={testimonial.text}>"{testimonial.text}"</p>
                                                            </td>
                                                            <td className="p-5">
                                                                <div className="flex gap-0.5">
                                                                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                                                                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                                    ))}
                                                                </div>
                                                            </td>
                                                            <td className="p-5 text-sm font-medium text-gray-500">
                                                                {new Date(testimonial.created_at || new Date()).toLocaleDateString('pt-BR')}
                                                            </td>
                                                            <td className="p-5 text-center">
                                                                <button
                                                                    onClick={() => handleDeleteTestimonial(testimonial.id)}
                                                                    className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95 inline-flex"
                                                                    title="Excluir Depoimento"
                                                                >
                                                                    <Trash className="w-5 h-5" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="p-16 text-center text-gray-500 flex flex-col items-center">
                                            <div className="w-20 h-20 bg-gray-50 rounded-[20px] flex items-center justify-center mb-4">
                                                <MessageSquare className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <h3 className="text-xl font-black text-gray-900 mb-1">Nenhum depoimento.</h3>
                                            <p className="text-sm max-w-sm">Ainda não há nenhum depoimento cadastrado em seu banco de dados.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {dashboardTab === 'gallery' && (
                                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 ring-1 ring-black/5">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-[#2A452B]" /> Suas Fotos na Nuvem</h3>
                                            <p className="text-sm text-gray-500 font-medium">Fotos pesadas já são comprimidas em fundo de tela mantendo a beleza de Sergipe.</p>
                                        </div>
                                        <label className="shrink-0">
                                            <div className="px-6 py-3 bg-[#2A452B] text-white font-black rounded-xl cursor-pointer hover:bg-[#1f3320] transition-all shadow-lg shadow-[#2A452B]/20 flex items-center justify-center gap-2 active:scale-95">
                                                <Upload className="w-4 h-4" /> Enviar Novas Fotos
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                                onChange={handleGalleryUpload}
                                            />
                                        </label>
                                    </div>

                                    {galleryImages.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                            {galleryImages.map((img) => (
                                                <div key={img.id} className="relative aspect-square group rounded-[20px] overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                                                    <img src={img.image_url} alt={`Gallery ${img.id}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                                        <button
                                                            onClick={() => handleDeleteGalleryImage(img.id)}
                                                            className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform active:scale-95"
                                                            title="Excluir da Galeria"
                                                        >
                                                            <Trash className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-16 text-center text-gray-500 flex flex-col items-center">
                                            <div className="w-20 h-20 bg-gray-50 rounded-[20px] flex items-center justify-center mb-4 text-gray-300">
                                                <ImageIcon className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-xl font-black text-gray-900 mb-1">Galeria Vazia.</h3>
                                            <p className="text-sm">Envie a sua primeira foto em alta qualidade clicando no botão acima.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Edit Modal (Premium Overlay) */}
                {isEditing && (
                    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 lg:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                        {/* Box Modal */}
                        <div className="bg-[#F8F9FA] w-full h-[100dvh] lg:h-[95vh] max-w-[1700px] lg:rounded-[32px] shadow-2xl flex flex-col overflow-hidden relative ring-1 ring-white/10 slide-in-from-bottom-6">

                            {/* Modal Header Premium */}
                            <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 lg:py-5 flex justify-between items-center z-20 shadow-sm relative shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#2A452B]/5 rounded-[16px] hidden sm:flex items-center justify-center text-[#2A452B] border border-[#2A452B]/10">
                                        <Edit className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl lg:text-3xl font-black text-gray-900 tracking-tight">Estúdio de Roteiros</h2>
                                        <div className="flex items-center gap-2 mt-0.5 md:mt-1">
                                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                            <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">{editForm.title || "Novo Rascunho"}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-4">
                                    <button
                                        onClick={() => setIsEditing(null)}
                                        className="px-4 lg:px-6 py-3 text-gray-500 hover:text-gray-900 font-bold transition-all rounded-xl hover:bg-gray-100 active:scale-95 text-sm lg:text-base hidden sm:block"
                                    >
                                        Descartar
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(null)}
                                        className="p-3 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl sm:hidden"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-6 lg:px-8 py-3 bg-[#2A452B] hover:bg-[#1a2d1b] text-white font-black rounded-xl transition-all shadow-lg shadow-[#2A452B]/30 flex items-center gap-2 active:scale-95 text-sm lg:text-base"
                                    >
                                        <Save className="w-5 h-5" />
                                        <span className="hidden sm:inline">Salvar Base de Dados</span>
                                        <span className="sm:hidden">Salvar</span>
                                    </button>
                                </div>
                            </div>

                            {/* Mobile Tabs Controller */}
                            <div className="lg:hidden bg-white border-b border-gray-200 flex shrink-0 z-10 w-full relative">
                                <button
                                    onClick={() => setActiveTab('edit')}
                                    className={`flex-1 py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'edit'
                                        ? 'border-[#2A452B] text-[#2A452B] bg-[#2A452B]/5'
                                        : 'border-transparent text-gray-400 hover:bg-gray-50'
                                        }`}
                                >
                                    <PenTool className="w-4 h-4" /> Dados
                                </button>
                                <button
                                    onClick={() => setActiveTab('preview')}
                                    className={`flex-1 py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'preview'
                                        ? 'border-[#2A452B] text-[#2A452B] bg-[#2A452B]/5'
                                        : 'border-transparent text-gray-400 hover:bg-gray-50'
                                        }`}
                                >
                                    <Eye className="w-4 h-4" /> Site
                                </button>
                            </div>

                            {/* Modal Content - Split View */}
                            <div className="flex-1 flex overflow-hidden min-h-0 relative">

                                {/* LEFT: Editor Column */}
                                <div className={`w-full lg:w-1/2 xl:w-7/12 h-full overflow-y-auto custom-scrollbar bg-white ${activeTab === 'edit' ? 'block' : 'hidden lg:block'}`}>
                                    <div className="p-4 sm:p-6 lg:p-12 max-w-4xl mx-auto space-y-8 lg:space-y-12 pb-40">

                                        {/* Block 1: Info Básica */}
                                        <section className="bg-gray-50/50 p-6 sm:p-8 rounded-[32px] border border-gray-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] relative">
                                            <div className="absolute top-0 right-0 transform translate-x-1/3 sm:translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white border-4 border-gray-50 rounded-full text-[#C68D5D] font-black flex items-center justify-center shadow-lg text-sm sm:text-base">1</div>
                                            <h3 className="font-black text-gray-900 text-xl sm:text-2xl mb-6">Identidade Visual</h3>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
                                                <div className="col-span-1 sm:col-span-2">
                                                    <label className="block text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Título do Passeio (Maiúsculo)</label>
                                                    <input
                                                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#C68D5D]/50 focus:border-[#C68D5D] outline-none transition-all font-black text-gray-900 text-lg shadow-sm"
                                                        value={editForm.title}
                                                        onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                                        placeholder="Sua incrível trilha..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Subtítulo (Aparece Dourado)</label>
                                                    <input
                                                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#C68D5D]/50 focus:border-[#C68D5D] outline-none transition-all font-bold text-gray-700 shadow-sm"
                                                        value={editForm.subtitle}
                                                        onChange={e => setEditForm({ ...editForm, subtitle: e.target.value })}
                                                        placeholder="Destaque..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Investimento (BRL)</label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <span className="text-gray-400 font-bold">R$</span>
                                                        </div>
                                                        <input
                                                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#2A452B]/50 focus:border-[#2A452B] outline-none transition-all text-[#2A452B] font-black text-lg shadow-sm"
                                                            value={editForm.price}
                                                            onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        {/* Block 4: Imagens Físicas (Moved UP for priority) */}
                                        <section className="bg-gray-50/50 p-6 sm:p-8 rounded-[32px] border border-gray-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] relative">
                                            <div className="absolute top-0 right-0 transform translate-x-1/3 sm:translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white border-4 border-gray-50 rounded-full text-[#C68D5D] font-black flex items-center justify-center shadow-lg text-sm sm:text-base">2</div>
                                            <h3 className="font-black text-gray-900 text-xl sm:text-2xl mb-6">Mídia & Galeria</h3>

                                            <div className="space-y-6">
                                                <div className="bg-white p-5 lg:p-6 rounded-[24px] border border-gray-100 shadow-sm ring-1 ring-black/5">
                                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-5 gap-3">
                                                        <div>
                                                            <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest">Fotos Oficiais do Banco</h4>
                                                            <p className="text-xs text-gray-500 font-medium mt-1">Ao deletar, apaga fisicamente do servidor Linux.</p>
                                                        </div>
                                                        <div className="px-3.5 py-1.5 bg-gray-100 rounded-xl text-xs font-black tracking-widest text-gray-500 shrink-0">
                                                            {(editForm.images?.length || 0)} OF 5
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                                                        {editForm.images?.map((img: string, index: number) => (
                                                            <div key={index} className="relative aspect-square group rounded-[20px] overflow-hidden border-2 border-transparent hover:border-[#2A452B] transition-all bg-gray-100 shadow-md">
                                                                <img src={img} alt={`Img ${index}`} className="w-full h-full object-cover" />

                                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 md:gap-4 backdrop-blur-md">
                                                                    {index !== 0 && (
                                                                        <button
                                                                            onClick={() => setCoverImage(index)}
                                                                            className="px-4 py-2 bg-white text-gray-900 rounded-full text-[10px] md:text-xs font-black tracking-widest hover:bg-[#C68D5D] hover:text-white transition-transform active:scale-95"
                                                                        >
                                                                            USAR CAPA
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        onClick={() => removeImage(index)}
                                                                        className="px-4 py-2 bg-red-500 text-white rounded-full text-[10px] md:text-xs font-black tracking-widest hover:bg-red-600 transition-transform active:scale-95 flex items-center gap-1.5"
                                                                    >
                                                                        <Trash className="w-3.5 h-3.5" /> DELETAR
                                                                    </button>
                                                                </div>

                                                                {index === 0 && (
                                                                    <div className="absolute top-2 left-2 bg-[#2A452B] text-white text-[9px] md:text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 z-10 border border-white/20">
                                                                        <Star className="w-3 h-3 fill-current" /> DESTAQUE PRINCIPAL
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}

                                                        {(editForm.images?.length || 0) < 5 && (
                                                            <label className="border-2 border-dashed border-gray-300 hover:border-[#2A452B] bg-gray-50 hover:bg-[#2A452B]/5 rounded-[20px] flex flex-col items-center justify-center p-4 cursor-pointer transition-all aspect-square text-gray-400 hover:text-[#2A452B]">
                                                                <Upload className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3" />
                                                                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Carregar Foto</span>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    multiple
                                                                    className="hidden"
                                                                    onChange={handleImageUpload}
                                                                />
                                                            </label>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        {/* Block 2: Logística */}
                                        <section className="bg-gray-50/50 p-6 sm:p-8 rounded-[32px] border border-gray-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] relative">
                                            <div className="absolute top-0 right-0 transform translate-x-1/3 sm:translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white border-4 border-gray-50 rounded-full text-[#C68D5D] font-black flex items-center justify-center shadow-lg text-sm sm:text-base">3</div>
                                            <h3 className="font-black text-gray-900 text-xl sm:text-2xl mb-6">Logística de Operação</h3>

                                            <div className="grid grid-cols-2 gap-5 lg:gap-6">
                                                <div className="col-span-2 md:col-span-1">
                                                    <label className="block text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Agenda Escrita</label>
                                                    <input
                                                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#C68D5D]/50 focus:border-[#C68D5D] outline-none transition-all font-bold text-gray-700 shadow-sm"
                                                        value={editForm.date}
                                                        onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                                                        placeholder="Ex: Todo dom às 8h"
                                                    />
                                                </div>
                                                <div className="col-span-2 md:col-span-1">
                                                    <label className="block text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Carga Horária</label>
                                                    <input
                                                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#C68D5D]/50 focus:border-[#C68D5D] outline-none transition-all font-bold text-gray-700 shadow-sm"
                                                        value={editForm.duration}
                                                        onChange={e => setEditForm({ ...editForm, duration: e.target.value })}
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="block text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Capacidade (Apenas números)</label>
                                                    <input
                                                        type="number"
                                                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#C68D5D]/50 focus:border-[#C68D5D] outline-none transition-all font-bold text-gray-700 shadow-sm"
                                                        value={editForm.maxPeople}
                                                        onChange={e => setEditForm({ ...editForm, maxPeople: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </section>

                                        {/* Block 3: Descrição e Texto */}
                                        <section className="bg-gray-50/50 p-6 sm:p-8 rounded-[32px] border border-gray-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] relative">
                                            <div className="absolute top-0 right-0 transform translate-x-1/3 sm:translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white border-4 border-gray-50 rounded-full text-[#C68D5D] font-black flex items-center justify-center shadow-lg text-sm sm:text-base">4</div>
                                            <h3 className="font-black text-gray-900 text-xl sm:text-2xl mb-6">Narrativa e Checklist</h3>

                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Resumo do Card (Marketing rápido)</label>
                                                    <textarea
                                                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#C68D5D]/50 focus:border-[#C68D5D] outline-none resize-y min-h-[100px] font-medium text-gray-700 shadow-sm leading-relaxed"
                                                        value={editForm.description}
                                                        onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                                        rows={3}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">A Experiência (Lido no clique)</label>
                                                    <textarea
                                                        className="w-full p-5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#C68D5D]/50 focus:border-[#C68D5D] outline-none resize-y min-h-[220px] font-medium text-gray-700 leading-relaxed shadow-sm"
                                                        value={editForm.fullDescription}
                                                        onChange={e => setEditForm({ ...editForm, fullDescription: e.target.value })}
                                                        rows={8}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">O que está incluso? (Enter para novo item)</label>
                                                    <textarea
                                                        className="w-full p-4 bg-gray-100 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-300 outline-none font-medium text-sm text-gray-700 shadow-inner leading-relaxed font-mono"
                                                        value={editForm.featuresString || ''}
                                                        onChange={e => setEditForm({ ...editForm, featuresString: e.target.value })}
                                                        rows={6}
                                                    />
                                                </div>
                                            </div>
                                        </section>

                                        <div className="pt-4 pb-12 text-center">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pb-8">Finalize no Botão "Salvar Base de Dados" Acima</p>
                                        </div>

                                    </div>
                                </div>

                                {/* RIGHT: Live Preview Column */}
                                <div className={`w-full lg:w-1/2 xl:w-5/12 h-full overflow-y-auto custom-scrollbar bg-gradient-to-br from-gray-100 to-gray-50 p-4 sm:p-6 lg:p-10 border-l border-gray-200 relative ${activeTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
                                    <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-white to-transparent pointer-events-none z-0"></div>
                                    <div className="w-full max-w-md mx-auto space-y-8 pb-32 min-h-full flex flex-col items-center justify-start relative z-10">

                                        <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm border border-white flex items-center gap-2 text-gray-600 mb-2 font-black uppercase tracking-widest text-[10px] ring-1 ring-black/5">
                                            <LayoutList className="w-3.5 h-3.5" /> Como o cliente vê o Card Expandido no Site
                                        </div>

                                        {/* Preview Widget */}
                                        <div className="w-full scale-[0.98] origin-top hover:scale-100 transition-transform duration-500">
                                            {renderPreview()}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile Bottom Navigation */}
                {!isEditing && (
                    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-2 py-2 z-40 flex justify-around items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
                        <button
                            onClick={() => setDashboardTab('tours')}
                            className={`flex flex-col items-center justify-center w-full py-2 gap-1 rounded-xl transition-all ${dashboardTab === 'tours' ? 'text-[#2A452B] bg-[#2A452B]/10' : 'text-gray-400 hover:bg-gray-50'}`}
                        >
                            <LayoutList className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest mt-0.5">Trilhas</span>
                        </button>
                        <button
                            onClick={() => setDashboardTab('testimonials')}
                            className={`flex flex-col items-center justify-center w-full py-2 gap-1 rounded-xl transition-all ${dashboardTab === 'testimonials' ? 'text-[#2A452B] bg-[#2A452B]/10' : 'text-gray-400 hover:bg-gray-50'}`}
                        >
                            <MessageSquare className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest mt-0.5">Mural</span>
                        </button>
                        <button
                            onClick={() => setDashboardTab('gallery')}
                            className={`flex flex-col items-center justify-center w-full py-2 gap-1 rounded-xl transition-all ${dashboardTab === 'gallery' ? 'text-[#2A452B] bg-[#2A452B]/10' : 'text-gray-400 hover:bg-gray-50'}`}
                        >
                            <ImageIcon className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest mt-0.5">Galeria</span>
                        </button>
                    </nav>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
