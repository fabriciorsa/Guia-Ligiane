import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Criar tabela se não existir
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        city_role VARCHAR(255) NOT NULL,
        text TEXT NOT NULL,
        rating INT DEFAULT 5,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

pool.query(createTableQuery).catch(err => console.error("Error creating testimonials table:", err));

// GET all testimonials
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST new testimonial
router.post('/', async (req, res) => {
    try {
        const { name, city_role, text, rating } = req.body;

        if (!name || !city_role || !text) {
            return res.status(400).json({ error: 'Name, city/role, and text are required' });
        }

        const insertQuery = `
            INSERT INTO testimonials (name, city_role, text, rating)
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await pool.query(insertQuery, [name, city_role, text, rating || 5]);

        res.status(201).json({ id: result.insertId, message: 'Testimonial created successfully' });
    } catch (error) {
        console.error("Error creating testimonial:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE testimonial
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query('DELETE FROM testimonials WHERE id = ?', [id]);

        if (result.affectedRows > 0) {
            res.json({ message: 'Testimonial deleted successfully' });
        } else {
            res.status(404).json({ error: 'Testimonial not found' });
        }
    } catch (error) {
        console.error("Error deleting testimonial:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
