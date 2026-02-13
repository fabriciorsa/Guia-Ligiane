import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTours } from '../../context/TourContext';
import { Plus, Edit, Trash, LogOut, Save, X, Calendar, Clock, Users, Star, MessageCircle, LayoutList, Eye, PenTool, Upload } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const Dashboard = () => {
    const { tours, addTour, updateTour, deleteTour } = useTours();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<any>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
    const [previewImageIndex, setPreviewImageIndex] = useState(0);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    const handleDelete = (id: number) => {
        if (confirm('Tem certeza que deseja excluir este passeio?')) {
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
            setPreviewImageIndex((prev) => (prev + 1) % editForm.images.length);
        }
    };

    const prevPreviewImage = () => {
        if (editForm.images?.length > 1) {
            setPreviewImageIndex((prev) => (prev - 1 + editForm.images.length) % editForm.images.length);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const remainingSlots = 5 - (editForm.images?.length || 0);
        if (remainingSlots <= 0) {
            toast.error('Limite de 5 imagens atingido!');
            return;
        }

        const filesToProcess = Array.from(files).slice(0, remainingSlots);

        filesToProcess.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditForm((prev: any) => ({
                    ...prev,
                    images: [...(prev.images || []), reader.result as string]
                }));
            };
            reader.readAsDataURL(file);
        });

        // Reset input
        e.target.value = '';
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
            const updatedTour = {
                ...editForm,
                features: editForm.featuresString.split('\n').filter((f: string) => f.trim() !== '')
            };
            delete updatedTour.featuresString; // Clean up helper

            updateTour(isEditing, updatedTour);
            setIsEditing(null);
            toast.success('Passeio atualizado com sucesso');
        }
    };

    const handleAddNew = () => {
        const newTour = {
            id: Date.now(),
            title: 'Novo Passeio',
            subtitle: '',
            description: 'Descrição curta do passeio',
            fullDescription: 'Descrição completa do passeio detalhada...',
            duration: '0 horas',
            date: 'Data',
            price: '0,00',
            images: ['https://placehold.co/600x400?text=Sem+Imagem'], // Default image
            features: ['Item incluso 1', 'Item incluso 2'],
            rating: 5.0,
            reviews: 0,
            maxPeople: 0
        };
        addTour(newTour);
        handleEdit(newTour); // Immediately open edit mode
        toast.info('Novo passeio criado. Edite os detalhes.');
    };

    // Render the Live Preview (copy of Tours.tsx Modal/Card logic)
    const renderPreview = () => {
        const previewData = {
            ...editForm,
            features: editForm.featuresString ? editForm.featuresString.split('\n').filter((f: string) => f.trim() !== '') : []
        };

        return (
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-brand-beige relative w-full max-w-sm sm:max-w-md mx-auto">
                {/* Simulation of Dialog Close Button */}
                <div className="absolute top-4 right-4 z-50 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-lg cursor-not-allowed opacity-50">
                    <X className="w-4 h-4 md:w-5 md:h-5 text-brand-brown" />
                </div>

                {/* Hero Image */}
                <div className="relative h-48 sm:h-64 group">
                    <img
                        src={previewData.images?.[previewImageIndex] || 'https://placehold.co/600x400?text=Sem+Imagem'}
                        alt={previewData.title}
                        className="w-full h-full object-cover transition-opacity duration-300"
                        onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400?text=Imagem+Indisponivel')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Image Indicators (Dots) */}
                    {previewData.images?.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                            {previewData.images.map((_: any, idx: number) => (
                                <div
                                    key={idx}
                                    className={`w-1.5 h-1.5 rounded-full transition-all ${idx === previewImageIndex ? 'bg-white w-3' : 'bg-white/50'}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Navigation Arrows */}
                    {previewData.images?.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevPreviewImage(); }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 text-[#365A38] rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <div className="w-2.5 h-2.5 border-t-2 border-l-2 border-current -rotate-45 ml-0.5" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextPreviewImage(); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 text-[#365A38] rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <div className="w-2.5 h-2.5 border-t-2 border-r-2 border-current rotate-45 mr-0.5" />
                            </button>
                        </>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 bg-[#F5F0E8]">
                    <div className="mb-4">
                        <div className="mb-3">
                            <h2 className="text-xl sm:text-2xl font-bold text-[#2C2416] text-left leading-tight">
                                {previewData.title || 'Título do Passeio'}
                            </h2>
                            {previewData.subtitle && (
                                <span className="text-[#C68D5D] font-semibold text-sm sm:text-base block mt-1 uppercase">
                                    {previewData.subtitle}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#8B6F4E]">
                            <div className="flex items-center gap-1 bg-[#C68D5D]/20 px-2 py-0.5 rounded-full text-[#5D4037] font-bold">
                                <Calendar className="w-3 h-3 text-[#C68D5D]" />
                                <span>{previewData.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{previewData.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>Até {previewData.maxPeople}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                                <span>{previewData.rating}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="text-sm sm:text-base font-semibold text-[#2C2416] mb-2 border-l-4 border-[#C68D5D] pl-3">Sobre o Passeio</h3>
                        <p className="text-[#5D4037] leading-relaxed text-xs sm:text-sm whitespace-pre-wrap">
                            {previewData.fullDescription || 'Descrição completa do passeio...'}
                        </p>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                        <h3 className="text-sm sm:text-base font-semibold text-[#2C2416] mb-2 border-l-4 border-[#C68D5D] pl-3">O que está incluído</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {previewData.features?.map((feature: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-2 text-[#5D4037] text-xs sm:text-sm">
                                    <div className="w-4 h-4 bg-[#C68D5D]/20 rounded-full flex items-center justify-center shrink-0">
                                        <div className="w-1.5 h-1.5 bg-[#C68D5D] rounded-full" />
                                    </div>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex flex-col gap-3 p-4 bg-white rounded-xl border border-[#E8E0D5] shadow-sm">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs text-[#8B6F4E] mb-0.5">Investimento</p>
                                <p className="text-2xl font-bold text-[#C68D5D]">
                                    R$ {previewData.price}
                                    <span className="text-xs font-normal text-[#8B6F4E] ml-1">/pessoa</span>
                                </p>
                            </div>
                        </div>
                        <button disabled className="w-full px-4 py-3 bg-[#25D366] text-white font-semibold rounded-lg flex items-center justify-center gap-2 opacity-80 cursor-not-allowed shadow-sm">
                            <MessageCircle className="w-4 h-4" />
                            Reservar (WhatsApp)
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#F5F0E8] p-4 lg:p-8 font-sans">
            <Toaster />

            {/* Main Listing View - Only visible when NOT editing */}
            {!isEditing && (
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-[#E8E0D5]">
                        <div>
                            <h1 className="text-2xl font-bold text-[#2C2416]">Painel Administrativo</h1>
                            <p className="text-[#8B6F4E]">Gerencie seus passeios</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Sair
                        </button>
                    </div>

                    {/* Actions Bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                        <input
                            type="text"
                            placeholder="Buscar passeio por título..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-3 rounded-xl border border-[#E8E0D5] w-full sm:max-w-md focus:outline-none focus:ring-2 focus:ring-[#365A38]/30 transition-all shadow-sm"
                        />
                        <button
                            onClick={handleAddNew}
                            className="flex items-center gap-2 px-6 py-3 bg-[#365A38] text-white font-bold rounded-xl hover:bg-[#2A452B] transition-all shadow-md active:scale-95 w-full sm:w-auto justify-center"
                        >
                            <Plus className="w-5 h-5" />
                            Novo Passeio
                        </button>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tours
                            .filter((tour: any) => tour.title.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((tour: any) => (
                                <div key={tour.id} className="bg-white rounded-2xl shadow-sm border border-[#E8E0D5] overflow-hidden group hover:shadow-md transition-all">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={tour.images?.[0] || 'https://placehold.co/600x400?text=Sem+Imagem'}
                                            alt={tour.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400?text=Imagem+Indisponivel')}
                                        />
                                        <div className="absolute top-3 right-3 flex gap-2">
                                            <button
                                                onClick={() => handleEdit(tour)}
                                                className="p-2 bg-white/90 backdrop-blur-sm text-[#365A38] rounded-full hover:bg-[#365A38] hover:text-white transition-colors shadow-sm"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(tour.id)}
                                                className="p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                        {tour.date && (
                                            <div className="absolute bottom-3 left-3 bg-[#365A38]/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> {tour.date}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-xl font-bold text-[#2C2416] mb-2 line-clamp-1">{tour.title}</h3>
                                        <p className="text-[#8B6F4E] text-sm mb-4 line-clamp-2 min-h-[40px]">
                                            {tour.description}
                                        </p>
                                        <div className="flex items-center justify-between text-sm pt-4 border-t border-[#E8E0D5]">
                                            <span className="font-bold text-[#365A38]">R$ {tour.price}</span>
                                            <div className="flex items-center gap-3 text-[#8B6F4E]">
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {tour.duration}</span>
                                                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {tour.maxPeople}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Edit Modal (Mobile Enhanced & Desktop Split View) */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    {/* Main Container */}
                    <div className="bg-[#F5F0E8] w-full h-full sm:h-auto sm:max-h-[95vh] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">

                        {/* 1. Header Fixed */}
                        <div className="bg-white border-b border-[#E8E0D5] px-4 py-3 lg:px-6 lg:py-4 flex justify-between items-center shrink-0 z-20">
                            <div>
                                <h2 className="text-lg lg:text-xl font-bold text-[#2C2416]">Editor de Passeio</h2>
                                <p className="text-xs text-[#8B6F4E] hidden sm:block">Você está editando: {editForm.title}</p>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3">
                                <button
                                    onClick={() => setIsEditing(null)}
                                    className="px-3 sm:px-4 py-2 text-[#8B6F4E] hover:text-[#2C2416] font-medium text-sm transition-colors rounded-lg hover:bg-gray-100"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 sm:px-6 py-2 bg-[#365A38] text-white font-bold rounded-lg hover:bg-[#2A452B] transition-colors flex items-center gap-2 text-sm shadow-md active:scale-95"
                                >
                                    <Save className="w-4 h-4" />
                                    <span className="hidden sm:inline">Salvar Alterações</span>
                                    <span className="sm:hidden">Salvar</span>
                                </button>
                            </div>
                        </div>

                        {/* 2. Mobile Tabs Controller (Hidden on Desktop) */}
                        <div className="lg:hidden bg-white border-b border-[#E8E0D5] flex sticky top-0 z-10">
                            <button
                                onClick={() => setActiveTab('edit')}
                                className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'edit'
                                    ? 'border-[#365A38] text-[#365A38] bg-[#365A38]/5'
                                    : 'border-transparent text-[#8B6F4E] hover:bg-gray-50'
                                    }`}
                            >
                                <PenTool className="w-4 h-4" /> Editar
                            </button>
                            <button
                                onClick={() => setActiveTab('preview')}
                                className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'preview'
                                    ? 'border-[#365A38] text-[#365A38] bg-[#365A38]/5'
                                    : 'border-transparent text-[#8B6F4E] hover:bg-gray-50'
                                    }`}
                            >
                                <Eye className="w-4 h-4" /> Visualizar
                            </button>
                        </div>

                        {/* 3. Main Content - Independent Scrolling Columns (Split View) */}
                        <div className="flex-1 flex overflow-hidden relative min-h-0">

                            {/* LEFT: Form Editor */}
                            <div className={`w-full lg:w-1/2 h-full overflow-y-auto bg-white border-r border-[#E8E0D5] ${activeTab === 'edit' ? 'block' : 'hidden lg:block'
                                }`}>
                                <div className="p-5 lg:p-8 max-w-3xl mx-auto space-y-8 pb-32 lg:pb-10">

                                    {/* Info Básica */}
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-[#2C2416] flex items-center gap-2 text-lg">
                                            <span className="w-6 h-6 bg-[#365A38] text-white text-xs rounded-full flex items-center justify-center font-bold">1</span>
                                            Informações Básicas
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="col-span-1 sm:col-span-2">
                                                <label className="block text-xs font-bold text-[#8B6F4E] uppercase tracking-wider mb-1">Título do Passeio</label>
                                                <input
                                                    className="w-full p-3 bg-gray-50 border border-[#E8E0D5] rounded-xl focus:ring-2 focus:ring-[#365A38]/20 outline-none transition-all font-medium text-[#2C2416]"
                                                    value={editForm.title}
                                                    onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                                    placeholder="Ex: Ilha Pomonga"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-[#8B6F4E] uppercase tracking-wider mb-1">Subtítulo (Opcional)</label>
                                                <input
                                                    className="w-full p-3 bg-gray-50 border border-[#E8E0D5] rounded-xl focus:ring-2 focus:ring-[#365A38]/20 outline-none transition-all"
                                                    value={editForm.subtitle}
                                                    onChange={e => setEditForm({ ...editForm, subtitle: e.target.value })}
                                                    placeholder="Ex: No Tototó"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-[#8B6F4E] uppercase tracking-wider mb-1">Preço (R$)</label>
                                                <input
                                                    className="w-full p-3 bg-gray-50 border border-[#E8E0D5] rounded-xl focus:ring-2 focus:ring-[#365A38]/20 outline-none transition-all font-mono"
                                                    value={editForm.price}
                                                    onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                                                    placeholder="0,00"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="border-[#E8E0D5]" />

                                    {/* Detalhes */}
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-[#2C2416] flex items-center gap-2 text-lg">
                                            <span className="w-6 h-6 bg-[#365A38] text-white text-xs rounded-full flex items-center justify-center font-bold">2</span>
                                            Detalhes Logísticos
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-[#8B6F4E] uppercase tracking-wider mb-1">Data Próxima</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-3 bg-gray-50 border border-[#E8E0D5] rounded-xl focus:ring-2 focus:ring-[#365A38]/20 outline-none"
                                                    value={editForm.date}
                                                    onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                                                    placeholder="Ex: 15 de Março"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-[#8B6F4E] uppercase tracking-wider mb-1">Duração</label>
                                                <input
                                                    className="w-full p-3 bg-gray-50 border border-[#E8E0D5] rounded-xl focus:ring-2 focus:ring-[#365A38]/20 outline-none"
                                                    value={editForm.duration}
                                                    onChange={e => setEditForm({ ...editForm, duration: e.target.value })}
                                                    placeholder="Ex: 5h"
                                                />
                                            </div>
                                            <div className="col-span-2 sm:col-span-1">
                                                <label className="block text-xs font-bold text-[#8B6F4E] uppercase tracking-wider mb-1">Max Pessoas</label>
                                                <input
                                                    type="number"
                                                    className="w-full p-3 bg-gray-50 border border-[#E8E0D5] rounded-xl focus:ring-2 focus:ring-[#365A38]/20 outline-none"
                                                    value={editForm.maxPeople}
                                                    onChange={e => setEditForm({ ...editForm, maxPeople: e.target.value })}
                                                    placeholder="Ex: 20"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="border-[#E8E0D5]" />

                                    {/* Conteúdo */}
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-[#2C2416] flex items-center gap-2 text-lg">
                                            <span className="w-6 h-6 bg-[#365A38] text-white text-xs rounded-full flex items-center justify-center font-bold">3</span>
                                            Conteúdo Rico
                                        </h3>
                                        <div>
                                            <label className="block text-xs font-bold text-[#8B6F4E] uppercase tracking-wider mb-1">Descrição Curta (Card)</label>
                                            <textarea
                                                className="w-full p-3 bg-gray-50 border border-[#E8E0D5] rounded-xl focus:ring-2 focus:ring-[#365A38]/20 outline-none resize-y min-h-[100px]"
                                                value={editForm.description}
                                                onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                                placeholder="Resumo para o card inicial..."
                                                rows={3}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[#8B6F4E] uppercase tracking-wider mb-1">Descrição Completa (Modal)</label>
                                            <textarea
                                                className="w-full p-3 bg-gray-50 border border-[#E8E0D5] rounded-xl focus:ring-2 focus:ring-[#365A38]/20 outline-none resize-y min-h-[200px]"
                                                value={editForm.fullDescription}
                                                onChange={e => setEditForm({ ...editForm, fullDescription: e.target.value })}
                                                placeholder="Detalhes completos da experiência..."
                                                rows={8}
                                            />
                                        </div>
                                    </div>

                                    <hr className="border-[#E8E0D5]" />

                                    {/* Mídia e Extras */}
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-[#2C2416] flex items-center gap-2 text-lg">
                                            <span className="w-6 h-6 bg-[#365A38] text-white text-xs rounded-full flex items-center justify-center font-bold">4</span>
                                            Mídia e Extras
                                        </h3>
                                        <div>
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="block text-xs font-bold text-[#8B6F4E] uppercase tracking-wider">Galeria de Imagens (Max 5)</label>
                                                    <span className="text-xs text-[#8B6F4E]">{editForm.images?.length || 0}/5</span>
                                                </div>

                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                                                    {editForm.images?.map((img: string, index: number) => (
                                                        <div key={index} className="relative aspect-square group rounded-xl overflow-hidden border border-[#E8E0D5] bg-gray-100">
                                                            <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />

                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                                {index !== 0 && (
                                                                    <button
                                                                        onClick={() => setCoverImage(index)}
                                                                        className="p-1.5 bg-white/20 hover:bg-white text-white hover:text-[#365A38] rounded-full transition-colors backdrop-blur-sm shadow-sm"
                                                                        title="Definir como Capa"
                                                                    >
                                                                        <Star className="w-4 h-4 fill-current" />
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() => removeImage(index)}
                                                                    className="p-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-colors backdrop-blur-sm shadow-sm"
                                                                    title="Remover Imagem"
                                                                >
                                                                    <Trash className="w-4 h-4" />
                                                                </button>
                                                            </div>

                                                            {index === 0 && (
                                                                <div className="absolute top-2 left-2 bg-[#365A38] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 z-10">
                                                                    <Star className="w-3 h-3 fill-current" /> CAPA
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}

                                                    {(editForm.images?.length || 0) < 5 && (
                                                        <label className="border-2 border-dashed border-[#E8E0D5] hover:border-[#365A38]/50 hover:bg-[#365A38]/5 rounded-xl flex flex-col items-center justify-center p-4 cursor-pointer transition-all aspect-square text-[#8B6F4E] hover:text-[#365A38]">
                                                            <Upload className="w-6 h-6 mb-1" />
                                                            <span className="text-xs font-bold">Adicionar</span>
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
                                                <p className="text-xs text-gray-400">
                                                    A primeira imagem será usada como capa. Mouse sobre para opções.
                                                </p>
                                            </div>

                                            <div className="mt-4">
                                                <label className="block text-xs font-bold text-[#8B6F4E] uppercase tracking-wider mb-1">Itens Inclusos (Um por linha)</label>
                                                <textarea
                                                    className="w-full p-3 bg-gray-50 border border-[#E8E0D5] rounded-xl focus:ring-2 focus:ring-[#365A38]/20 outline-none font-mono text-sm"
                                                    value={editForm.featuresString || ''}
                                                    onChange={e => setEditForm({ ...editForm, featuresString: e.target.value })}
                                                    placeholder="Guia Local&#10;Almoço incluso&#10;Transporte"
                                                    rows={5}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT: Live Preview */}
                            <div className={`w-full lg:w-1/2 h-full overflow-y-auto bg-[#E8E0D5]/30 flex flex-col items-center p-4 lg:p-8 ${activeTab === 'preview' ? 'block' : 'hidden lg:flex'
                                }`}>
                                <div className="w-full max-w-md mx-auto space-y-6 pb-20 lg:pb-0">
                                    <div className="flex items-center justify-center gap-2 text-[#8B6F4E] text-xs font-bold uppercase tracking-widest opacity-70 sticky top-0 py-2 bg-[#F3ECE4]/80 backdrop-blur-md rounded-full lg:bg-transparent lg:backdrop-blur-none z-10 w-fit mx-auto px-4">
                                        <LayoutList className="w-4 h-4" />
                                        <span>Pré-visualização em Tempo Real</span>
                                    </div>

                                    {/* Preview Wrapper */}
                                    <div className="transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl rounded-xl">
                                        {renderPreview()}
                                    </div>

                                    <div className="text-center space-y-2">
                                        <p className="text-xs text-[#8B6F4E]/60">
                                            Visualização exata de como aparecerá para o cliente.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
