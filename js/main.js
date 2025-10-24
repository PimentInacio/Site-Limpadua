/* ---
Arquivo: main.js
Descrição: Scripts principais para interatividade do site Limpádua.
Autor: Desenvolvedor Sênior (Persona)
--- */

// Aguarda o DOM estar completamente carregado antes de executar os scripts
document.addEventListener('DOMContentLoaded', () => {

  /**
   * 1. Navegação Móvel (Menu Hambúrguer)
   * Controla a abertura e fechamento do menu em dispositivos móveis.
   */
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navOverlay = document.getElementById('nav-overlay');

  if (menuToggle && mainNav && navOverlay) {
    const toggleMenu = () => {
      menuToggle.classList.toggle('active');
      mainNav.classList.toggle('active');
      navOverlay.classList.toggle('active');
      // Trava o scroll do body quando o menu está aberto
      document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', toggleMenu);
  }

  /**
   * 2. Destaque do Link de Navegação Ativo
   * Adiciona a classe 'active' ao link de navegação da página atual.
   */
  const setActiveNavLink = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.main-nav a');

    navLinks.forEach(link => {
      const linkPage = link.getAttribute('href').split('/').pop();
      if (linkPage === currentPage) {
        link.classList.add('active');
      }
    });
  };
  setActiveNavLink();

  /**
   * 3. Animação de Scroll (Intersection Observer API)
   * Adiciona a classe 'visible' a elementos com a classe 'reveal'
   * quando eles entram no viewport.
   */
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Opcional: parar de observar após a animação
          // observer.unobserve(entry.target);
        }
      });
    }, {
      root: null, // relativo ao viewport
      threshold: 0.1 // 10% do elemento visível
    });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  }

  /**
   * 4. Carrossel de Produtos (Página Inicial)
   * Controla o carrossel de produtos em destaque.
   */
  const carouselTrack = document.querySelector('.carousel-track');
  if (carouselTrack) {
    const prevButton = document.querySelector('.carousel-btn.prev');
    const nextButton = document.querySelector('.carousel-btn.next');
    const items = Array.from(carouselTrack.children);
    
    // Calcula o tamanho do item (incluindo padding/margin se houver)
    // Usamos offsetWidth para obter a largura total
    const itemWidth = items[0].offsetWidth + parseInt(getComputedStyle(items[0]).marginRight) + parseInt(getComputedStyle(items[0]).marginLeft);
    
    let currentIndex = 0;
    const maxIndex = items.length - Math.floor(carouselTrack.parentElement.offsetWidth / itemWidth); // Ajuste para quantos cabem na tela

    const updateCarousel = () => {
      // Garante que o índice não saia dos limites
      if (currentIndex < 0) currentIndex = 0;
      if (currentIndex > maxIndex) currentIndex = maxIndex;

      const offset = -currentIndex * itemWidth;
      carouselTrack.style.transform = `translateX(${offset}px)`;

      // Habilita/desabilita botões
      prevButton.disabled = currentIndex === 0;
      nextButton.disabled = currentIndex === maxIndex;
    };

    nextButton.addEventListener('click', () => {
      currentIndex++;
      updateCarousel();
    });

    prevButton.addEventListener('click', () => {
      currentIndex--;
      updateCarousel();
    });

    // Inicializa o carrossel
    updateCarousel();
    // Recalcula em caso de redimensionamento da janela
    window.addEventListener('resize', updateCarousel);
  }

  /**
   * 5. Filtros Dinâmicos (Página de Produtos e Dicas)
   * Filtra os cards de produtos ou dicas sem recarregar a página.
   */
  const filterProducts = () => {
    const filterContainer = document.querySelector('.filtros-container');
    if (!filterContainer) return; // Sai se não estiver na página de produtos

    const products = document.querySelectorAll('.produto-card');
    const categoryButtons = filterContainer.querySelectorAll('.filtro-grupo[data-filter-group="categoria"] .filtro-btn');
    const surfaceSelect = filterContainer.querySelector('.filtro-select[data-filter-group="superficie"]');
    const problemSelect = filterContainer.querySelector('.filtro-select[data-filter-group="problema"]');

    let activeFilters = {
      categoria: 'todos',
      superficie: 'todas',
      problema: 'todos'
    };

    const applyFilters = () => {
      products.forEach(product => {
        const cat = product.dataset.categoria;
        const sup = product.dataset.superficie;
        const prob = product.dataset.problema;

        const catMatch = activeFilters.categoria === 'todos' || activeFilters.categoria === cat;
        const supMatch = activeFilters.superficie === 'todas' || activeFilters.superficie === sup;
        const probMatch = activeFilters.problema === 'todos' || activeFilters.problema === prob;

        if (catMatch && supMatch && probMatch) {
          product.classList.remove('hidden');
        } else {
          product.classList.add('hidden');
        }
      });
    };

    // Listeners para botões de categoria
    categoryButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Atualiza classe ativa
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        // Atualiza filtro
        activeFilters.categoria = button.dataset.filter;
        applyFilters();
      });
    });

    // Listeners para selects
    if (surfaceSelect) {
      surfaceSelect.addEventListener('change', () => {
        activeFilters.superficie = surfaceSelect.value;
        applyFilters();
      });
    }

    if (problemSelect) {
      problemSelect.addEventListener('change', () => {
        activeFilters.problema = problemSelect.value;
        applyFilters();
      });
    }
  };
  filterProducts(); // Executa para a pág de produtos
  
  // (Adaptação similar seria necessária para a página de dicas, 
  // mas o princípio é o mesmo. Vamos focar no de produtos.)

  /**
   * 6. Acordeão (FAQ na Página de Contato)
   * Controla a abertura e fechamento dos itens do FAQ.
   */
  const faqItems = document.querySelectorAll('.faq-item');

  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const pergunta = item.querySelector('.faq-pergunta');
      pergunta.addEventListener('click', () => {
        // Fecha todos os outros itens
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });
        // Alterna o item clicado
        item.classList.toggle('active');
      });
    });
  }

  /**
   * 7. Validação do Formulário de Contato
   * Valida os campos antes de um (simulado) envio.
   */
  const contatoForm = document.getElementById('contato-form');

  if (contatoForm) {
    contatoForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Impede o envio real do formulário
      let isValid = true;

      // Seleciona campos e erros
      const nome = document.getElementById('nome');
      const email = document.getElementById('email');
      const assunto = document.getElementById('assunto');
      const mensagem = document.getElementById('mensagem');
      const formSuccess = document.getElementById('form-success');
      
      const fields = [nome, email, assunto, mensagem];

      // Reseta erros
      fields.forEach(field => {
        const errorEl = field.nextElementSibling;
        if (errorEl && errorEl.classList.contains('form-error')) {
          errorEl.style.display = 'none';
        }
      });
      formSuccess.style.display = 'none';

      // Validação do Nome
      if (nome.value.trim() === '') {
        isValid = false;
        showError(nome, 'Por favor, preencha seu nome.');
      }

      // Validação do E-mail
      if (email.value.trim() === '') {
        isValid = false;
        showError(email, 'Por favor, preencha seu e-mail.');
      } else if (!isValidEmail(email.value)) {
        isValid = false;
        showError(email, 'Por favor, insira um e-mail válido.');
      }

      // Validação do Assunto
      if (assunto.value.trim() === '') {
        isValid = false;
        showError(assunto, 'Por favor, selecione um assunto.');
      }

      // Validação da Mensagem
      if (mensagem.value.trim() === '') {
        isValid = false;
        showError(mensagem, 'Por favor, escreva sua mensagem.');
      }

      // Se tudo for válido
      if (isValid) {
        formSuccess.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
        formSuccess.style.display = 'block';
        contatoForm.reset(); // Limpa o formulário
      }
    });

    const showError = (field, message) => {
      const errorEl = field.nextElementSibling;
      if (errorEl && errorEl.classList.contains('form-error')) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
      }
    };

    const isValidEmail = (email) => {
      // Regex simples para validação de e-mail
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    };
  }

});
