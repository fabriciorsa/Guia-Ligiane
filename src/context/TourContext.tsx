import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';

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

interface TourContextType {
    tours: Tour[];
    addTour: (tour: Tour) => Promise<void>;
    updateTour: (id: number, tour: Partial<Tour>) => Promise<void>;
    deleteTour: (id: number) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || '/api/tours';

export const TourProvider = ({ children }: { children: ReactNode }) => {
    const [tours, setTours] = useState<Tour[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTours = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(API_URL);
            setTours(response.data);
            setError(null);
        } catch (err) {
            console.error("Erro ao buscar passeios:", err);
            setError("Falha ao carregar os passeios do banco de dados.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTours();
    }, []);

    const addTour = async (tour: Tour) => {
        try {
            await axios.post(API_URL, tour);
            // Assuming backend returns the new ID, but we just refetch to be safe
            await fetchTours();
        } catch (err) {
            console.error("Erro ao adicionar passeio:", err);
            throw err;
        }
    };

    const updateTour = async (id: number, updatedTour: Partial<Tour>) => {
        try {
            await axios.put(`${API_URL}/${id}`, updatedTour);
            setTours(prev => prev.map(t => t.id === id ? { ...t, ...updatedTour } : t));
        } catch (err) {
            console.error("Erro ao atualizar passeio:", err);
            throw err;
        }
    };

    const deleteTour = async (id: number) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setTours(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            console.error("Erro ao deletar passeio:", err);
            throw err;
        }
    };

    return (
        <TourContext.Provider value={{ tours, addTour, updateTour, deleteTour, isLoading, error }}>
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
