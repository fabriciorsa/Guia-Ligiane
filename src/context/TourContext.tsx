import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface Tour {
    id: number;
    title: string;
    subtitle?: string;
    description: string;
    fullDescription: string;
    duration: string;
    date: string;
    price: string;
    images: string[];
    features: string[];
    rating: number;
    reviews: number;
    maxPeople: number;
}

// Dados iniciais (Hardcoded por enquanto)
const initialTours: Tour[] = [
    {
        id: 1,
        title: 'Ilha Pomonga',
        subtitle: 'No Tototó',
        description: 'Um passeio relaxante pelo estuário, conhecendo a rica biodiversidade e a cultura local.',
        fullDescription: 'Explore a Ilha Pomonga a bordo do tradicional Tototó. Um passeio que conecta você com a natureza vibrante do estuário, manguezais e a tranquilidade das águas sergipanas.',
        duration: '5 horas',
        date: '01 de Março de 2026',
        price: '160',
        images: ['/images/tours/pomonga.jpg', '/images/tours/pomonga.jpg'],
        features: ['Passeio de Tototó', 'Guia local', 'Almoço típico', 'Parada para banho', 'Seguro viagem'],
        rating: 4.8,
        reviews: 124,
        maxPeople: 20,
    },
    {
        id: 2,
        title: 'Pacatuba',
        subtitle: 'Pantanal Sergipano',
        description: 'Dunas, lagoas e uma paisagem de tirar o fôlego no coração de Sergipe.',
        fullDescription: 'Conheça o Pantanal Sergipano em Pacatuba. Uma aventura off-road que leva você a dunas intocadas, lagoas cristalinas e mirantes com vistas espetaculares.',
        duration: '8 horas',
        date: '08 de Março de 2026',
        price: '220',
        images: ['/images/tours/pacatuba.jpg', '/images/tours/pacatuba.jpg'],
        features: ['Transporte 4x4', 'Guia especializado', 'Lanche de trilha', 'Fotos inclusas', 'Taxas ambientais'],
        rating: 4.9,
        reviews: 89,
        maxPeople: 12,
    },
    {
        id: 3,
        title: 'Tur 3 Ilhas',
        subtitle: 'No Tototó',
        description: 'Um roteiro completo visitando três ilhas paradisíacas em um único dia.',
        fullDescription: 'Aventure-se no Tur 3 Ilhas a bordo do Tototó. Descubra paisagens únicas, bancos de areia e a vida marinha local em um passeio dinâmico e divertido.',
        duration: '6 horas',
        date: '15 de Março de 2026',
        price: '180',
        images: ['/images/tours/3ilhas.jpg', '/images/tours/3ilhas.jpg'],
        features: ['Visita a 3 Ilhas', 'Música a bordo', 'Frutas tropicais', 'Equipamento snorkel', 'Refrigerante e água'],
        rating: 5.0,
        reviews: 215,
        maxPeople: 25,
    },
    {
        id: 4,
        title: 'Lagoa dos Tambaquis',
        subtitle: '+ Paraíso da Lagoa (Pirambu)',
        description: 'Interação com peixes e relaxamento em um complexo de lazer incrível.',
        fullDescription: 'Visite a famosa Lagoa dos Tambaquis, onde você pode alimentar e nadar com os peixes. Em seguida, relaxe no Paraíso da Lagoa em Pirambu, com estrutura completa.',
        duration: '7 horas',
        date: '22 de Março de 2026',
        price: '150',
        images: ['/images/tours/tambaquis.jpg', '/images/tours/tambaquis.jpg'],
        features: ['Entrada na Lagoa', 'Ração para peixes', 'Acesso ao Day Use', 'Transporte Climatizado', 'Almoço não incluso'],
        rating: 4.7,
        reviews: 340,
        maxPeople: 30,
    },
    {
        id: 5,
        title: 'Trilha Cachoeira Roncador',
        subtitle: '+ Paraíso da Lagoa (Pirambu)',
        description: 'Aventura na mata atlântica terminando em uma cachoeira refrescante.',
        fullDescription: 'Faça a Trilha da Cachoeira do Roncador, encravada na mata. Após a caminhada, descanse e aproveite o dia no clube Paraíso da Lagoa em Pirambu.',
        duration: '8 horas',
        date: '29 de Março de 2026',
        price: '190',
        images: ['/images/tours/roncador.jpg', '/images/tours/roncador.jpg'],
        features: ['Guia de trilha', 'Banho de cachoeira', 'Day Use no Clube', 'Kit primeiros socorros', 'Translado'],
        rating: 4.9,
        reviews: 156,
        maxPeople: 15,
    }
];

interface TourContextType {
    tours: Tour[];
    addTour: (tour: Tour) => void;
    updateTour: (id: number, tour: Partial<Tour>) => void;
    deleteTour: (id: number) => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider = ({ children }: { children: ReactNode }) => {
    // Inicializa com LocalStorage se existir, senão usa initialTours
    const [tours, setTours] = useState<Tour[]>(() => {
        const saved = localStorage.getItem('tours');
        return saved ? JSON.parse(saved) : initialTours;
    });

    useEffect(() => {
        localStorage.setItem('tours', JSON.stringify(tours));
    }, [tours]);

    const addTour = (tour: Tour) => {
        setTours(prev => [...prev, { ...tour, id: Date.now() }]); // ID temporário
    };

    const updateTour = (id: number, updatedTour: Partial<Tour>) => {
        setTours(prev => prev.map(t => t.id === id ? { ...t, ...updatedTour } : t));
    };

    const deleteTour = (id: number) => {
        setTours(prev => prev.filter(t => t.id !== id));
    };

    return (
        <TourContext.Provider value={{ tours, addTour, updateTour, deleteTour }}>
            {children}
        </TourContext.Provider>
    );
};

export const useTours = () => {
    const context = useContext(TourContext);
    if (!context) {
        throw new Error('useTours deve ser usado dentro de um TourProvider');
    }
    return context;
};
