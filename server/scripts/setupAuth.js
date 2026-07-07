import pool from '../config/db.js';
import bcrypt from 'bcrypt';

async function setup() {
    try {
        console.log('Criando tabela de usuários se não existir...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', ['ligiane']);
        if (rows.length === 0) {
            console.log('Usuário admin não encontrado. Criando novo usuário...');
            const hashedPassword = await bcrypt.hash('Tototur2026@', 10);
            await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', ['ligiane', hashedPassword]);
            console.log('Usuário "ligiane" criado com sucesso.');
        } else {
            console.log('Usuário "ligiane" já existe.');
        }
    } catch (error) {
        console.error('Erro durante o setup:', error);
    } finally {
        process.exit(0);
    }
}

setup();
