/**
 * Portfólio Felipão — Script Principal
 * Etapa 2: Menu de Navegação Fixo, Menu Mobile e Destaque de Seções Ativas
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initActiveSectionObserver();
});

/**
 * Controle do Menu Mobile (Abertura, Fechamento e Acessibilidade)
 */
function initMobileMenu() {
  const menuButton = document.getElementById('btn-menu-mobile');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.site-nav .nav-link');

  if (!menuButton || !navMenu) return;

  function toggleMenu(forceState) {
    const isCurrentlyOpen = menuButton.getAttribute('aria-expanded') === 'true';
    const shouldOpen = typeof forceState === 'boolean' ? forceState : !isCurrentlyOpen;

    menuButton.setAttribute('aria-expanded', String(shouldOpen));
    menuButton.setAttribute(
      'aria-label',
      shouldOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'
    );

    menuButton.classList.toggle('is-open', shouldOpen);
    navMenu.classList.toggle('is-open', shouldOpen);
    document.body.classList.toggle('menu-open', shouldOpen);
  }

  // Evento de clique no botão hambúrguer
  menuButton.addEventListener('click', () => {
    toggleMenu();
  });

  // Fechar menu ao clicar em qualquer link de navegação
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (menuButton.getAttribute('aria-expanded') === 'true') {
        toggleMenu(false);
      }
    });
  });

  // Acessibilidade por teclado: fechar com tecla Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      toggleMenu(false);
      menuButton.focus();
    }
  });

  // Fechar menu se a janela for redimensionada para desktop (> 768px)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && menuButton.getAttribute('aria-expanded') === 'true') {
      toggleMenu(false);
    }
  });
}

/**
 * Destaque do link da seção atualmente visível usando IntersectionObserver
 */
function initActiveSectionObserver() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.site-nav .nav-link');

  if (!sections.length || !navLinks.length) return;

  // Mapa rápido de ID da seção para o respectivo link
  const navMap = new Map();
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      navMap.set(href.slice(1), link);
    }
  });

  function setActiveLink(sectionId) {
    navLinks.forEach((link) => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    });

    const activeLink = navMap.get(sectionId);
    if (activeLink) {
      activeLink.classList.add('active');
      activeLink.setAttribute('aria-current', 'page');
    }
  }

  // Observer com margem que detecta a seção predominante no terço superior da tela
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -65% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));

  // Fallback para o topo absoluto da página
  window.addEventListener('scroll', () => {
    if (window.scrollY < 80) {
      setActiveLink('inicio');
    }
  }, { passive: true });
}
