import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sailboat, Lock } from 'lucide-react';

const Login = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Senha temporária simples para o MVP
        if (password === 'admin123') {
            localStorage.setItem('isAuthenticated', 'true');
            navigate('/admin/dashboard');
        } else {
            setError('Senha incorreta');
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-[#E8E0D5]">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-[#365A38]/10 rounded-full flex items-center justify-center mb-4">
                        <Sailboat className="w-8 h-8 text-[#365A38]" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#2C2416]">Área Administrativa</h1>
                    <p className="text-[#8B6F4E]">Entre para gerenciar os passeios</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#5C4A3A] mb-1">Senha de Acesso</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A68B6A]" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#E8E0D5] focus:outline-none focus:ring-2 focus:ring-[#365A38]/50 text-[#2C2416]"
                                placeholder="Digite sua senha"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full py-3 bg-[#365A38] text-white font-bold rounded-lg hover:bg-[#2C2416] transition-colors"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
