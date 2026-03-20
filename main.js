import './style.css'

let currentLang = 'pt';
let translationsDict = {};

window.setLanguage = async function(lang) {
    try {
        const res = await fetch(`http://localhost:3000/api/translations?lang=${lang}`);
        if (res.ok) {
            translationsDict = await res.json();
            
            // Update active state in UI
            document.querySelectorAll('.lang-switcher a').forEach(el => {
                if (el.dataset.lang === lang) {
                    el.classList.add('active');
                } else {
                    el.classList.remove('active');
                }
            });
            currentLang = lang;
            
            // Apply text replacements
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (translationsDict[key]) {
                    el.innerHTML = translationsDict[key];
                }
            });
        }
    } catch(e) {
        console.error('Error fetching language pack:', e);
    }
};

// Add interactivity for the split image slider in the hero section
document.addEventListener('DOMContentLoaded', () => {
  // Inicialize language mapping synchronously or fire-and-forget
  window.setLanguage('pt');

  const hero = document.querySelector('.split-hero-visual');
  const blueprint = document.querySelector('.blueprint');
  const handle = document.querySelector('.slider-handle');

  if (hero && blueprint && handle) {
    let isResizing = false;

    // Set initial position (50%)
    let currentX = hero.offsetWidth / 2;
    updateSliderPosition(currentX);

    hero.addEventListener('mousedown', (e) => {
      isResizing = true;
      updateSliderPosition(e.clientX - hero.getBoundingClientRect().left);
    });

    window.addEventListener('mouseup', () => {
      isResizing = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      const rect = hero.getBoundingClientRect();
      let x = e.clientX - rect.left;
      
      // Keep within bounds
      x = Math.max(0, Math.min(x, hero.offsetWidth));
      updateSliderPosition(x);
    });

    // Touch support
    hero.addEventListener('touchstart', (e) => {
      isResizing = true;
      updateSliderPosition(e.touches[0].clientX - hero.getBoundingClientRect().left);
    }, {passive: true});

    window.addEventListener('touchend', () => {
      isResizing = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!isResizing) return;
      const rect = hero.getBoundingClientRect();
      let x = e.touches[0].clientX - rect.left;
      x = Math.max(0, Math.min(x, hero.offsetWidth));
      updateSliderPosition(x);
    }, {passive: true});

    function updateSliderPosition(x) {
      const percentage = (x / hero.offsetWidth) * 100;
      blueprint.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;
      handle.style.left = `${percentage}%`;
    }
  }

  // Hero button fallback
  const heroBtn = document.querySelector('.btn-green');
  if (heroBtn) {
    heroBtn.addEventListener('click', () => {
      document.querySelector('#projectos').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Load projects from API
  (async function() {
    try {
      const res = await fetch('http://localhost:3000/api/projects');
      if (res.ok) {
          const projects = await res.json();
          window.allProjectsData = projects;
          renderProjects(projects);
      } else {
          console.error('Failed to load projects from API');
      }
    } catch (e) {
        console.error('Backend server might not be running locally or error fetching projects:', e);
    }
    
    // Fire off the dynamic clients carousel generator
    await loadClientesCarousel();
  })();

  // --- DYNAMIC CLIENTS CAROUSEL ---
  async function loadClientesCarousel() {
      try {
          const res = await fetch('http://localhost:3000/api/clientes');
          if (res.ok) {
              const images = await res.json();
              const track = document.querySelector('.logos-carousel-track');
              if (track && images.length > 0) {
                  track.innerHTML = ''; // Clear hardcoded ones
                  
                  // Create html structure for the specific logos
                  const imgHtml = images.map(img => `<img src="/clientes/${img}" alt="Cliente" loading="lazy">`).join('');
                  
                  // Inject identical blocks to allow the CSS animation to infinite scroll seamlessly
                  track.innerHTML = imgHtml + imgHtml; 
              }
          }
      } catch (e) {
          console.error('Failed to load dynamic clients carousel:', e);
      }
  }

  function renderProjects(projects) {
    const grid = document.querySelector('.portfolio-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    projects.forEach(p => {
        const card = document.createElement('div');
        card.className = 'project-card revealed';
        
        // Normalize categories (e.g. "Edifícios" -> "edificios") to match HTML buttons
        const safeCat = p.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        card.setAttribute('data-category', safeCat);
        
        card.innerHTML = `
          <div class="card-image">
             <img src="${p.image_url}" alt="${p.title}">
             <div class="category-badge">${p.category}</div>
          </div>
          <div class="card-content">
             <h3>${p.title}</h3>
             <p>${p.description ? p.description.substring(0, 100) + '...' : ''}</p>
             <div class="card-footer">
                <span class="location">${p.location}, ${p.country}</span>
                <button class="arrow-icon" onclick="window.openProjectModal(${p.id})" title="Ver Detalhes">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
             </div>
          </div>
        `;
        grid.appendChild(card);
    });
  }

  window.openProjectModal = function(id) {
     const p = window.allProjectsData.find(proj => proj.id === id);
     if(!p) return;
     
     document.getElementById('modal-title').textContent = p.title;
     document.getElementById('modal-location').textContent = p.location + ', ' + p.country;
     document.getElementById('modal-category').textContent = p.category;
     document.getElementById('modal-desc').textContent = p.description;
     document.getElementById('modal-image').src = p.image_url;
     
     const modal = document.getElementById('project-modal');
     if(modal) {
         modal.classList.add('active');
         document.body.style.overflow = 'hidden';
     }
  };

  window.closeProjectModal = function() {
     const modal = document.getElementById('project-modal');
     if(modal) {
         modal.classList.remove('active');
         document.body.style.overflow = '';
     }
  };

  const closeBtn = document.querySelector('.modal-close');
  if (closeBtn) {
     closeBtn.addEventListener('click', () => {
         window.closeProjectModal();
     });
  }

  const modalOverlay = document.getElementById('project-modal');
  if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
          if (e.target === modalOverlay) {
              window.closeProjectModal();
          }
      });
  }

  // Portfolio Filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      
      // Query dynamically since they are loaded async
      const dynamicCards = document.querySelectorAll('.project-card');

      dynamicCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300); // Wait for transition
        }
      });
    });
  });

  // Reveal Animations on Scroll
  const revealElements = document.querySelectorAll('.project-card, .section-title, .section-desc, .portfolio-filters, .service-card, .empresa-content, .empresa-logos, .contacto-info, .contacto-form-wrapper');
  
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null,
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));
});
