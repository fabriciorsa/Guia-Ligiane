import express from 'express';
import pool from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, '../uploads');

// Garante que o diretório de uploads existe
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const router = express.Router();

// Função auxiliar para converter JSON strings do banco de volta para arrays
const parseTourData = (row) => ({
    ...row,
    images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images,
    features: typeof row.features === 'string' ? JSON.parse(row.features) : row.features,
    rating: parseFloat(row.rating)
});

// Helper para processar imagens (Base64 -> Arquivo)
const processImages = (imagesArray) => {
    if (!imagesArray || !Array.isArray(imagesArray)) return [];

    return imagesArray.map((img, index) => {
        // Se for base64, salva o arquivo
        if (img && img.startsWith('data:image')) {
            const matches = img.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (!matches || matches.length !== 3) {
                return img; // Falha no regex, retorna como está
            }

            const type = matches[1];
            const base64Data = matches[2];
            const extension = type.split('/')[1] === 'jpeg' ? 'jpg' : type.split('/')[1];
            const filename = `tour_${Date.now()}_${index}.${extension}`;
            const filepath = path.join(UPLOAD_DIR, filename);

            // Grava o arquivo físico de forma síncrona/assíncrona dependendo do uso, aqui síncrono para garantir antes de salvar no banco
            fs.writeFileSync(filepath, base64Data, 'base64');

            return `/uploads/${filename}`;
        }
        // Se já for uma URL ou caminho (ex: /uploads/... ou /images/...), mantém
        return img;
    });
};

// Helper para deletar imagens físicas
const deletePhysicalImages = (imagesArray) => {
    if (!imagesArray || !Array.isArray(imagesArray)) return;

    imagesArray.forEach(imgPath => {
        if (imgPath && imgPath.startsWith('/uploads/')) {
            const filename = imgPath.replace('/uploads/', '');
            const filepath = path.join(UPLOAD_DIR, filename);
            if (fs.existsSync(filepath)) {
                try {
                    fs.unlinkSync(filepath);
                } catch (err) {
                    console.error(`Erro ao deletar arquivo físico: ${filepath}`, err);
                }
            }
        }
    });
};

// GET all tours
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tours');
        res.json(rows.map(parseTourData));
    } catch (error) {
        console.error("Error fetching tours:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST new tour
router.post('/', async (req, res) => {
    try {
        const { title, subtitle, description, fullDescription, duration, date, price, images, features, maxPeople } = req.body;

        // Processa imagens base64 para arquivos físicos
        const processedImages = processImages(images);
        const imagesJson = JSON.stringify(processedImages || []);
        const featuresJson = JSON.stringify(features || []);

        const query = `
            INSERT INTO tours 
            (title, subtitle, description, fullDescription, duration, date, price, images, features, rating, reviews, maxPeople)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 5.0, 0, ?)
        `;

        const [result] = await pool.query(query, [
            title, subtitle, description, fullDescription, duration, date, price, imagesJson, featuresJson, maxPeople
        ]);

        res.status(201).json({ id: result.insertId, message: 'Tour created successfully' });
    } catch (error) {
        console.error("Error creating tour:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT update tour
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subtitle, description, fullDescription, duration, date, price, images, features, maxPeople } = req.body;

        // 1. Busca tour antigo para comparar imagens
        const [oldRows] = await pool.query('SELECT images FROM tours WHERE id = ?', [id]);
        if (oldRows.length === 0) {
            return res.status(404).json({ error: 'Tour not found' });
        }

        let oldImages = [];
        try {
            oldImages = typeof oldRows[0].images === 'string' ? JSON.parse(oldRows[0].images) : oldRows[0].images;
        } catch (e) { }

        // 2. Processa as imagens novas/atuais enviadas
        const processedImages = processImages(images);

        // 3. Verifica quais imagens antigas não estão na nova lista e deleta
        const imagesToDelete = oldImages.filter(oldImg => !processedImages.includes(oldImg));
        deletePhysicalImages(imagesToDelete);

        const imagesJson = JSON.stringify(processedImages || []);
        const featuresJson = JSON.stringify(features || []);

        const query = `
            UPDATE tours 
            SET title = ?, subtitle = ?, description = ?, fullDescription = ?, duration = ?, date = ?, price = ?, images = ?, features = ?, maxPeople = ?
            WHERE id = ?
        `;

        await pool.query(query, [
            title, subtitle, description, fullDescription, duration, date, price, imagesJson, featuresJson, maxPeople, id
        ]);

        res.json({ message: 'Tour updated successfully' });
    } catch (error) {
        console.error("Error updating tour:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE tour
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Busca imagens do tour para deletá-las fisicamente
        const [rows] = await pool.query('SELECT images FROM tours WHERE id = ?', [id]);

        if (rows.length > 0) {
            let images = [];
            try {
                images = typeof rows[0].images === 'string' ? JSON.parse(rows[0].images) : rows[0].images;
            } catch (e) { }

            // Deleta imagens físicas
            deletePhysicalImages(images);

            // Deleta registro do banco
            await pool.query('DELETE FROM tours WHERE id = ?', [id]);
            res.json({ message: 'Tour deleted successfully' });
        } else {
            res.status(404).json({ error: 'Tour not found' });
        }
    } catch (error) {
        console.error("Error deleting tour:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
