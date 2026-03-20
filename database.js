import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const dbPromise = open({
  filename: path.join(dataDir, 'tecnofisil.db'),
  driver: sqlite3.Database
});

export async function initDb() {
  const db = await dbPromise;

  await db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      country TEXT,
      location TEXT,
      image_url TEXT,
      category TEXT
    );

    CREATE TABLE IF NOT EXISTS translations (
      key TEXT PRIMARY KEY,
      pt TEXT,
      en TEXT,
      es TEXT,
      fr TEXT
    );
  `);

  // Populate projects if empty
  const projectCount = await db.get("SELECT COUNT(*) as count FROM projects");
  if (projectCount.count === 0) {
    const projects = [
      { title: "Linha da Beira Baixa", description: "Modernização do troço entre Covilhã e Guarda. Uma reestruturação vital que permitiu aumentar a capacidade, com renovação integral da superestrutura de via.", country: "Portugal", location: "Covilhã - Guarda", category: "Ferrovia", image_url: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&q=80" },
      { title: "Metro do Porto (Linha Rosa)", description: "Design e consultoria para a nova Linha Rosa interligando as zonas cruciais da cidade de forma inteiramente subterrânea, preservando o património.", country: "Portugal", location: "Porto", category: "Ferrovia", image_url: "https://images.unsplash.com/photo-1541888031154-8e1c6fa5e990?w=600&q=80" },
      { title: "IP3 Coimbra-Penacova", description: "Duplicação e requalificação profunda do Itinerário Principal 3. Intervenção em nós viários, passagens desniveladas e mitigação de perigos.", country: "Portugal", location: "Coimbra", category: "Rodovia", image_url: "https://images.unsplash.com/photo-1468818461933-b1d79f62434e?w=600&q=80" },
      { title: "Nova Ponte Rio Douro", description: "Construção avançada de estruturas em betão armado para o novo atravessamento fluvial e interligação metropolitana.", country: "Portugal", location: "Porto - Gaia", category: "Obras de Arte", image_url: "https://images.unsplash.com/photo-1513568910411-1ee06b98ea5a?w=600&q=80" },
      { title: "Expansão Hospital S. João", description: "Projeto de engenharia de fundações críticas, suporte terraplenagens e infraestruturas anexas para a nova ala de internamento e operações.", country: "Portugal", location: "Porto", category: "Edifícios", image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80" },
      { title: "Reabilitação Viaduto do Corgo", description: "Inspeção tática e formulação do plano de reabilitação estrutural profunda dos pilares centrais face à erosão natural.", country: "Portugal", location: "Vila Real", category: "Obras de Arte", image_url: "https://images.unsplash.com/photo-1416879598446-2e2126be1acc?w=600&q=80" }
    ];

    for (const p of projects) {
        await db.run(
            `INSERT INTO projects (title, description, country, location, category, image_url) VALUES (?, ?, ?, ?, ?, ?)`,
            [p.title, p.description, p.country, p.location, p.category, p.image_url]
        );
    }
  }

  // Populate basic dictionary if empty
  const transCount = await db.get("SELECT COUNT(*) as count FROM translations");
  if (transCount.count === 0) {
    await db.run(`INSERT INTO translations (key, pt, en, es, fr) VALUES ('hero_title', 'Do Projecto para a realidade', 'From Blueprint to Reality', 'Del Proyecto a la Realidad', 'Du Projet à la Réalité')`);
    await db.run(`INSERT INTO translations (key, pt, en, es, fr) VALUES ('hero_btn', 'Veja os nossos projectos', 'View our projects', 'Ver nuestros proyectos', 'Voir nos projets')`);
    await db.run(`INSERT INTO translations (key, pt, en, es, fr) VALUES ('nav_home', 'Início', 'Home', 'Inicio', 'Accueil')`);
    await db.run(`INSERT INTO translations (key, pt, en, es, fr) VALUES ('nav_company', 'Empresa', 'Company', 'Empresa', 'Entreprise')`);
    await db.run(`INSERT INTO translations (key, pt, en, es, fr) VALUES ('nav_strategy', 'Estratégia', 'Strategy', 'Estrategia', 'Stratégie')`);
    await db.run(`INSERT INTO translations (key, pt, en, es, fr) VALUES ('nav_projects', 'Projectos', 'Projects', 'Proyectos', 'Projets')`);
    await db.run(`INSERT INTO translations (key, pt, en, es, fr) VALUES ('nav_contact', 'Contacto', 'Contact', 'Contacto', 'Contact')`);
  }

  return db;
}

export { dbPromise };
