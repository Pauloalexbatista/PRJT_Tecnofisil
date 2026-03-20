import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new sqlite3.Database(path.join(__dirname, 'data', 'tecnofisil.db'), (err) => {
    if (err) {
        console.error('Error:', err);
        process.exit(1);
    }
});

db.all("SELECT id, image_url FROM projects", [], (err, rows) => {
    if (err) throw err;
    
    rows.forEach(row => {
        let newUrl = row.image_url;
        // Fix Unsplash blocked images that are not correctly displaying
        if (newUrl.includes('unsplash.com')) {
             newUrl = '/projectos/placeholder.jpg'; // We can let user change it later
        }
        // Fix locally uploaded ones that missed the /projectos prefix
        else if (newUrl.startsWith('/') && !newUrl.startsWith('/projectos/') && !newUrl.startsWith('/especialidades/')) {
             newUrl = '/projectos' + newUrl;
             // Allow user pngs
        }
        
        if (newUrl !== row.image_url) {
            db.run("UPDATE projects SET image_url = ? WHERE id = ?", [newUrl, row.id], (upErr) => {
                if(upErr) console.error(upErr);
                else console.log(`Updated project ${row.id} to ${newUrl}`);
            });
        }
    });

    setTimeout(() => db.close(), 1000);
});
