import express from 'express';
import cors from 'cors';
import { initDb, dbPromise } from './database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve built Vite files in production, or raw files locally
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
} else {
    app.use(express.static('.'));
}

// --- CLIENTES (CARROSEL) API ---
app.get('/api/clientes', (req, res) => {
    try {
        const clientesDir = path.join(__dirname, 'public', 'clientes');
        if (fs.existsSync(clientesDir)) {
            const files = fs.readdirSync(clientesDir);
            const images = files.filter(f => /\.(png|jpe?g|svg|webp|gif)$/i.test(f));
            res.json(images);
        } else {
            res.json([]);
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- PROJECTS API ---
app.get('/api/projects', async (req, res) => {
    try {
        const db = await dbPromise;
        const projects = await db.all("SELECT * FROM projects");
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/projects', async (req, res) => {
    try {
        const db = await dbPromise;
        const { title, description, country, location, category, image_url } = req.body;
        const result = await db.run(
            `INSERT INTO projects (title, description, country, location, category, image_url) VALUES (?, ?, ?, ?, ?, ?)`,
            [title, description, country, location, category, image_url]
        );
        res.json({ id: result.lastID });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/projects/:id', async (req, res) => {
    try {
        const db = await dbPromise;
        const { title, description, country, location, category, image_url } = req.body;
        await db.run(
            `UPDATE projects SET title = ?, description = ?, country = ?, location = ?, category = ?, image_url = ? WHERE id = ?`,
            [title, description, country, location, category, image_url, req.params.id]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/projects/:id', async (req, res) => {
    try {
        const db = await dbPromise;
        await db.run(`DELETE FROM projects WHERE id = ?`, req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- TRANSLATIONS API ---
app.get('/api/translations', async (req, res) => {
    try {
        const db = await dbPromise;
        const lang = req.query.lang || 'pt';
        if (!['pt', 'en', 'es', 'fr'].includes(lang)) {
            return res.status(400).json({ error: 'Invalid language parameter' });
        }
        
        const translations = await db.all(`SELECT key, ${lang} as value FROM translations`);
        const dict = translations.reduce((acc, current) => {
            acc[current.key] = current.value;
            return acc;
        }, {});
        
        res.json(dict);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/translations/all', async (req, res) => {
    try {
        const db = await dbPromise;
        const translations = await db.all("SELECT * FROM translations");
        res.json(translations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/translations', async (req, res) => {
    try {
        const db = await dbPromise;
        const { key, pt, en, es, fr } = req.body;
        await db.run(
            `INSERT OR REPLACE INTO translations (key, pt, en, es, fr) VALUES (?, ?, ?, ?, ?)`,
            [key, pt, en, es, fr]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/translations/:key', async (req, res) => {
    try {
        const db = await dbPromise;
        await db.run(`DELETE FROM translations WHERE key = ?`, req.params.key);
        res.json({ success: true });
    } catch (error) {
         res.status(500).json({ error: error.message });
    }
});

// Initialize database and start server
initDb().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 API Server running on http://localhost:${PORT}`);
    });
}).catch(console.error);
