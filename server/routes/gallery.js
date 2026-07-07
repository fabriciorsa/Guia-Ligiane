import express from 'express';
import pool from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

// Create table if not exists
const initDb = async () => {
    try {
        const connection = await pool.getConnection();
        await connection.query(`
            CREATE TABLE IF NOT EXISTS gallery (
                id INT AUTO_INCREMENT PRIMARY KEY,
                image_url TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        connection.release();
        console.log('Gallery table unified');
    } catch (err) {
        console.error('Error initializing gallery table:', err);
    }
};

initDb();

// Helper to save physical base64 images
const processImage = (imgBase64) => {
    if (!imgBase64 || !imgBase64.startsWith('data:image')) return null;

    const matches = imgBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
        return null;
    }

    const type = matches[1];
    const base64Data = matches[2];
    const extension = type.split('/')[1] === 'jpeg' ? 'jpg' : type.split('/')[1];
    const filename = `gallery_${Date.now()}_${Math.floor(Math.random() * 1000)}.${extension}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    fs.writeFileSync(filepath, base64Data, 'base64');
    return `/uploads/${filename}`;
};

// Helper to delete physical image
const deletePhysicalImage = (imgPath) => {
    if (imgPath && imgPath.startsWith('/uploads/')) {
        const filename = imgPath.replace('/uploads/', '');
        const filepath = path.join(UPLOAD_DIR, filename);
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
    }
};

// GET all gallery images
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM gallery ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching gallery photos:', error);
        res.status(500).json({ error: 'Erro ao buscar fotos da galeria' });
    }
});

// POST a new gallery image
router.post('/', authMiddleware, async (req, res) => {
    const { image } = req.body;

    if (!image) {
        return res.status(400).json({ error: 'Imagem é obrigatória' });
    }

    try {
        const imageUrl = processImage(image);
        if (!imageUrl) {
            return res.status(400).json({ error: 'Formato de imagem inválido' });
        }

        const [result] = await pool.query(
            'INSERT INTO gallery (image_url) VALUES (?)',
            [imageUrl]
        );
        res.status(201).json({ id: result.insertId, image_url: imageUrl });
    } catch (error) {
        console.error('Error adding gallery image:', error);
        res.status(500).json({ error: 'Erro ao adicionar foto à galeria' });
    }
});

// DELETE a gallery image
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM gallery WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Foto não encontrada' });
        }

        deletePhysicalImage(rows[0].image_url);

        const [result] = await pool.query('DELETE FROM gallery WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Foto não encontrada' });
        }
        res.json({ message: 'Foto deletada com sucesso' });
    } catch (error) {
        console.error('Error deleting gallery image:', error);
        res.status(500).json({ error: 'Erro ao deletar foto' });
    }
});

export default router;
