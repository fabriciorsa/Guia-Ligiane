import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tourRoutes from './routes/tours.js';
import testimonialsRoutes from './routes/testimonials.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/tours', tourRoutes);
app.use('/api/testimonials', testimonialsRoutes);

// Servir arquivos estáticos do Vite em produção
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../dist')));
app.use('/uploads', express.static(path.join(__dirname, '../server/uploads')));

// Redireciona tudo que não é /api para o index.html (React Router)
app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    } else {
        next();
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
