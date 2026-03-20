const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    fetchProjects();
    fetchTranslations();

    // Project Form Submit (Create or Update)
    document.getElementById('project-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = document.getElementById('p-id').value;
        const payload = {
            title: document.getElementById('p-title').value,
            category: document.getElementById('p-category').value,
            location: document.getElementById('p-location').value,
            country: document.getElementById('p-country').value,
            image_url: document.getElementById('p-image').value,
            description: document.getElementById('p-desc').value,
        };

        try {
            let res;
            if (id) {
                // Update
                res = await fetch(`${API_URL}/projects/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                // Create
                res = await fetch(`${API_URL}/projects`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }
            
            if (res.ok) {
                alert(`Projeto ${id ? 'Atualizado' : 'Criado'} com Sucesso!`);
                toggleProjectForm(false);
                fetchProjects();
            } else {
                alert('Erro ao guardar!');
            }
        } catch (e) {
            console.error(e);
            alert('Não foi possível conectar ao Servidor DB.');
        }
    });
});

// Tab logic
function switchTab(tabId) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

// ========================
// PROJECTS LOGIC
// ========================

let projectsData = [];

function toggleProjectForm(forceState, isEdit = false) {
    const container = document.getElementById('project-form-container');
    const form = document.getElementById('project-form');
    
    if (forceState === false) {
        container.style.display = 'none';
        form.reset();
        document.getElementById('p-id').value = '';
        return;
    }
    
    container.style.display = 'block';
    
    if (!isEdit) {
        form.reset();
        document.getElementById('p-id').value = '';
        document.getElementById('form-title').innerText = 'Criar Novo Registo';
        document.getElementById('btn-submit-project').innerText = 'Gravar Projeto na Base de Dados';
    }
}

async function fetchProjects() {
    try {
        const res = await fetch(`${API_URL}/projects`);
        projectsData = await res.json();
        renderProjectsTable();
    } catch (e) {
        console.error('Falha de DB Projetos:', e);
    }
}

function renderProjectsTable() {
    const tbody = document.querySelector('#projects-table tbody');
    tbody.innerHTML = '';
    
    projectsData.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>#${p.id}</strong></td>
            <td><img src="${p.image_url}" alt="Img"></td>
            <td><strong>${p.title}</strong></td>
            <td><span style="background: #eef2f5; padding: 4px 8px; border-radius: 4px; font-size: 0.85rem;">${p.category}</span></td>
            <td>${p.location}, ${p.country}</td>
            <td style="display:flex; gap: 8px;">
                <button class="btn btn-warning btn-sm" onclick="editProject(${p.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteProject(${p.id})">Apagar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function editProject(id) {
    const proj = projectsData.find(p => p.id === id);
    if (!proj) return;
    
    document.getElementById('p-id').value = proj.id;
    document.getElementById('p-title').value = proj.title;
    document.getElementById('p-category').value = proj.category;
    document.getElementById('p-location').value = proj.location;
    document.getElementById('p-country').value = proj.country;
    document.getElementById('p-image').value = proj.image_url;
    document.getElementById('p-desc').value = proj.description;
    
    document.getElementById('form-title').innerText = `Editar Projeto #${proj.id}`;
    document.getElementById('btn-submit-project').innerText = 'Atualizar Base de Dados';
    
    toggleProjectForm(true, true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteProject(id) {
    if (!confirm('Tem a certeza que deseja eliminar permanentemente este projeto da base de dados?')) return;
    try {
        const res = await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE' });
        if (res.ok) fetchProjects();
    } catch (e) { console.error(e); }
}

// ========================
// TRANSLATIONS LOGIC
// ========================

async function fetchTranslations() {
    try {
        const res = await fetch(`${API_URL}/translations/all`);
        const translations = await res.json();
        
        const tbody = document.querySelector('#translations-table tbody');
        tbody.innerHTML = '';
        
        translations.forEach(t => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input type="text" class="trans-input" id="k_${t.key}" value="${t.key}" readonly style="background:#f4f4f4; cursor:not-allowed"></td>
                <td><textarea class="trans-input" id="pt_${t.key}" rows="2">${t.pt}</textarea></td>
                <td><textarea class="trans-input" id="en_${t.key}" rows="2">${t.en}</textarea></td>
                <td><textarea class="trans-input" id="es_${t.key}" rows="2">${t.es || ''}</textarea></td>
                <td><textarea class="trans-input" id="fr_${t.key}" rows="2">${t.fr || ''}</textarea></td>
                <td>
                    <button class="btn btn-success btn-sm" onclick="saveTranslation('${t.key}')" style="margin-bottom: 4px; width: 100%;">Gravar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTranslation('${t.key}')" style="width: 100%;">Apagar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error('Falha de DB Traduçōes:', e);
    }
}

async function saveTranslation(key) {
    const payload = {
        key: key,
        pt: document.getElementById(`pt_${key}`).value,
        en: document.getElementById(`en_${key}`).value,
        es: document.getElementById(`es_${key}`).value,
        fr: document.getElementById(`fr_${key}`).value,
    };
    
    try {
        const res = await fetch(`${API_URL}/translations`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (res.ok) {
            alert('Tradução gravada com sucesso!');
            // fetchTranslations(); 
        } else {
            alert('Erro ao guardar tradução.');
        }
    } catch (e) {
        console.error(e);
    }
}

async function deleteTranslation(key) {
    if (!confirm('Deseja apagar permanentemente esta chave de tradução? Pode quebrar partes do site!')) return;
    try {
        const res = await fetch(`${API_URL}/translations/${key}`, { method: 'DELETE' });
        if (res.ok) fetchTranslations();
    } catch (e) { console.error(e); }
}

function addTranslationRow() {
    const newKey = prompt("Escreva a nova Chave (ex: nav_contacto). Não utilize espaços grandes.");
    if (!newKey) return;
    
    const payload = { key: newKey, pt: 'Texto PT', en: 'Text EN', es: 'Texto ES', fr: 'Texte FR' };
    
    fetch(`${API_URL}/translations`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(res => {
        if(res.ok) fetchTranslations();
    });
}
