import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'data', 'tecnofisil.db');

// Connect natively as Express is not running to accept API POSTs
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

const translations = [
    // Empresa
    { key: 'empresa_title', pt: 'A Nossa Empresa', en: 'Our Company', es: 'Nuestra Empresa', fr: 'Notre Entreprise' },
    { key: 'empresa_missao_title', pt: 'Missão e Valores', en: 'Mission and Values', es: 'Misión y Valores', fr: 'Mission et Valeurs' },
    { key: 'empresa_missao_desc', pt: 'A nossa prioridade é garantir a satisfação dos nossos Clientes e a qualidade do nosso trabalho. Para isso encontramos soluções criativas e aplicamos princípios de excelência num mercado altamente competitivo.', en: 'Our priority is to ensure the satisfaction of our Customers and the quality of our work. To achieve this, we find creative solutions and apply principles of excellence in a highly competitive market.', es: 'Nuestra prioridad es garantizar la satisfacción de nuestros Clientes y la calidad de nuestro trabajo. Para ello encontramos soluciones creativas y aplicamos principios de excelencia en un mercado altamente competitivo.', fr: 'Notre priorité est de garantir la satisfaction de nos Clients et la qualité de notre travail. Pour cela, nous trouvons des solutions créatives et appliquons des principes d\'excellence dans un marché hautement concurrentiel.' },
    { key: 'empresa_lideranca_title', pt: 'Liderança', en: 'Leadership', es: 'Liderazgo', fr: 'Leadership' },
    { key: 'empresa_lideranca_desc', pt: 'Nelson Madeira | Director Geral', en: 'Nelson Madeira | General Director', es: 'Nelson Madeira | Director General', fr: 'Nelson Madeira | Directeur Général' },
    { key: 'empresa_posicionamento_title', pt: 'Posicionamento', en: 'Positioning', es: 'Posicionamiento', fr: 'Positionnement' },
    { key: 'empresa_posicionamento_desc', pt: 'Coordenação Geral, Consultoria e Assistência Técnica de Projectos para a Administração Central, Concessionárias e Grupos Construtores.', en: 'General Coordination, Consulting and Technical Assistance of Projects for the Central Administration, Concessionaires and Construction Groups.', es: 'Coordinación General, Consultoría y Asistencia Técnica de Proyectos para la Administración Central, Concesionarias y Grupos Constructores.', fr: 'Coordination Générale, Conseil et Assistance Technique de Projets pour l\'Administration Centrale, les Concessionnaires et les Groupes de Construction.' },
    
    // Estratégia
    { key: 'estrategia_title', pt: 'O seu consultor de Engenharia', en: 'Your Engineering Consultant', es: 'Su consultor de Ingeniería', fr: 'Votre consultant en Ingénierie' },
    { key: 'estrategia_desc', pt: 'A TECNOFISIL apresenta-se no mercado nacional e internacional com soluções personalizadas de elevado padrão técnico.', en: 'TECNOFISIL presents itself in the national and international market with personalized solutions of high technical standard.', es: 'TECNOFISIL se presenta en el mercado nacional e internacional con soluciones personalizadas de alto nivel técnico.', fr: 'TECNOFISIL se présente sur le marché national et international avec des solutions personnalisées de haut niveau technique.' },
    { key: 'estrategia_ferrovia_title', pt: 'Ferrovia', en: 'Railway', es: 'Ferrocarril', fr: 'Chemin de fer' },
    { key: 'estrategia_ferrovia_desc', pt: 'Experiência de mais de 10 anos em projetos de significativa importância em Portugal, nomeadamente Alta Velocidade.', en: 'Experience of more than 10 years in projects of significant importance in Portugal, namely High Speed.', es: 'Experiencia de más de 10 años en proyectos de gran importancia en Portugal, concretamente de Alta Velocidad.', fr: 'Expérience de plus de 10 ans dans des projets d\'importance significative au Portugal, notamment la Grande Vitesse.' },
    { key: 'estrategia_rodovia_title', pt: 'Rodovia', en: 'Highway', es: 'Carretera', fr: 'Autoroute' },
    { key: 'estrategia_rodovia_desc', pt: 'Consultor chave no desenvolvimento da rede de autoestradas e requalificação da Rede Rodoviária Nacional.', en: 'Key consultant in the development of the highway network and requalification of the National Road Network.', es: 'Consultor clave en el desarrollo de la red de autopistas y recalificación de la Red Nacional de Carreteras.', fr: 'Consultant clé dans le développement du réseau autoroutier et la requalification du Réseau Routier National.' },
    { key: 'estrategia_obras_title', pt: 'Obras de Arte', en: 'Special Structures', es: 'Estructuras de Arte', fr: 'Ouvrages d\'Art' },
    { key: 'estrategia_obras_desc', pt: 'Concepção de Estruturas em betão armado pré-esforçado, pré-fabricadas e em aço. Reabilitação e Inspecções.', en: 'Design of structures in prestressed reinforced concrete, prefabricated and steel. Rehabilitation and Inspections.', es: 'Diseño de Estructuras en hormigón armado pretensado, prefabricado y acero. Rehabilitación e Inspecciones.', fr: 'Conception de Structures en béton armé précontraint, préfabriquées et en acier. Réhabilitation et Inspections.' },
    { key: 'estrategia_edificios_title', pt: 'Edifícios', en: 'Buildings', es: 'Edificios', fr: 'Bâtiments' },
    { key: 'estrategia_edificios_desc', pt: 'Larga experiência em estruturas de edifícios, fundações e todas as suas especialidades.', en: 'Wide experience in building structures, foundations and all its specialties.', es: 'Amplia experiencia en estructuras de edificios, cimentaciones y todas sus especialidades.', fr: 'Vaste expérience dans les structures de bâtiments, les fondations et toutes leurs spécialités.' },
    { key: 'estrategia_geotecnia_title', pt: 'Geotecnia', en: 'Geotechnics', es: 'Geotecnia', fr: 'Géotechnique' },
    { key: 'estrategia_geotecnia_desc', pt: 'Cartografia Geológica, Geomorfologia, Reologia de Materiais, Terraplenagens e Estabilidade de Taludes, Estruturas de Suporte, Materiais de Pedreiras.', en: 'Geological Cartography, Geomorphology, Rheology of Materials, Earthworks and Slope Stability, Support Structures, Quarry Materials.', es: 'Cartografía Geológica, Geomorfología, Reología de Materiales, Movimiento de Tierras y Estabilidad de Taludes, Estructuras de Soporte, Materiales de Cantera.', fr: 'Cartographie Géologique, Géomorphologie, Rhéologie des Matériaux, Terrassements et Stabilité des Pentes, Structures de Soutènement, Matériaux de Carrières.' },
    { key: 'estrategia_hidraulica_title', pt: 'Hidráulica', en: 'Hydraulics', es: 'Hidráulica', fr: 'Hydraulique' },
    { key: 'estrategia_hidraulica_desc', pt: 'Abastecimento de Água e Saneamento Urbano, Sistemas de irrigação e Estações Elevatórias.', en: 'Water Supply and Urban Sanitation, Irrigation Systems and Pumping Stations.', es: 'Abastecimiento de Agua y Saneamiento Urbano, Sistemas de riego y Estaciones Elevadoras.', fr: 'Approvisionnement en Eau et Assainissement Urbain, Systèmes d\'irrigation et Stations de Pompage.' },
    
    // Portfolio
    { key: 'portfolio_title', pt: 'O nosso trabalho', en: 'Our work', es: 'Nuestro trabajo', fr: 'Notre travail' },
    { key: 'portfolio_desc', pt: 'Veja quais são os nossos principais projectos e onde temos trabalhado.', en: 'See what our main projects are and where we have been working.', es: 'Vea cuáles son nuestros principales proyectos y dónde hemos estado trabajando.', fr: 'Regardez quels sont nos principaux projets et où nous avons travaillé.' },
    { key: 'portfolio_filter_all', pt: 'Todos os Projectos', en: 'All Projects', es: 'Todos los Proyectos', fr: 'Tous les Projets' },
    
    // Contactos
    { key: 'contacto_title', pt: 'Estamos aqui', en: 'We are here', es: 'Estamos aquí', fr: 'Nous sommes ici' },
    { key: 'contacto_desc', pt: 'Envie-nos um email ou visite os nossos escritórios.', en: 'Send us an email or visit our offices.', es: 'Envíenos un correo electrónico o visite nuestras oficinas.', fr: 'Envoyez-nous un e-mail ou visitez nos bureaux.' },
    { key: 'contacto_tel_title', pt: 'Telefone', en: 'Phone', es: 'Teléfono', fr: 'Téléphone' },
    { key: 'contacto_email_title', pt: 'Email', en: 'Email', es: 'Correo electrónico', fr: 'E-mail' },
    { key: 'contacto_address_title', pt: 'Morada', en: 'Address', es: 'Dirección', fr: 'Adresse' },
    { key: 'contacto_address_desc', pt: 'Av. Luís Bívar 85A<br>Lisboa, Portugal', en: 'Av. Luís Bívar 85A<br>Lisbon, Portugal', es: 'Av. Luís Bívar 85A<br>Lisboa, Portugal', fr: 'Av. Luís Bívar 85A<br>Lisbonne, Portugal' },
    { key: 'contacto_form_title', pt: 'Envie-nos uma mensagem', en: 'Send us a message', es: 'Envíanos un mensaje', fr: 'Envoyez-nous un message' },
    { key: 'contacto_btn', pt: 'Enviar Mensagem', en: 'Send Message', es: 'Enviar Mensaje', fr: 'Envoyer Message' },
];

db.serialize(() => {
    const stmt = db.prepare("INSERT OR REPLACE INTO translations (key, pt, en, es, fr) VALUES (?, ?, ?, ?, ?)");
    translations.forEach(t => {
        stmt.run(t.key, t.pt, t.en, t.es, t.fr);
    });
    stmt.finalize();
    console.log('Seeding completed successfully!');
});
db.close();
