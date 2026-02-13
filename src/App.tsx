import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import { TourProvider } from './context/TourContext';

// Componente para Proteger Rotas
const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <TourProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/admin/dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                    {/* Redirecionar rotas desconhecidas para Home */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </TourProvider>
    );
}

export default App;
