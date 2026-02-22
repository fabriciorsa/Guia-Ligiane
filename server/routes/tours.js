import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Função auxiliar para converter JSON strings do banco de volta para arrays
const parseTourData = (row) => ({
    ...row,
    images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images,
    features: typeof row.features === 'string' ? JSON.parse(row.features) : row.features,
    rating: parseFloat(row.rating)
});

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

        const imagesJson = JSON.stringify(images || []);
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

        const imagesJson = JSON.stringify(images || []);
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
        await pool.query('DELETE FROM tours WHERE id = ?', [id]);
        res.json({ message: 'Tour deleted successfully' });
    } catch (error) {
        console.error("Error deleting tour:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
