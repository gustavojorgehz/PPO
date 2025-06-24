document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const searchInput = document.getElementById('searchInput');
    const randomStoryBtn = document.getElementById('randomStoryBtn');
    const adicionarComentarioBtn = document.getElementById('adicionarComentario');
    const nomeComentarioInput = document.getElementById('nomeComentario');
    const textoComentarioInput = document.getElementById('textoComentario');
    const listaComentarios = document.getElementById('listaComentarios');
    const historiasContainers = document.querySelectorAll('.historias-container');

    // Array para armazenar comentários
    let comentarios = JSON.parse(localStorage.getItem('comentarios')) || [];

    // Funcionalidade de busca
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase().trim();
        
        historiasContainers.forEach(container => {
            const h1Element = container.querySelector('h1');
            const h1Text = h1Element.textContent.toLowerCase();
            
            if (searchTerm === '' || h1Text.includes(searchTerm)) {
                container.classList.remove('hidden');
                // Remove highlight anterior
                h1Element.innerHTML = h1Element.textContent;
                
                // Adiciona highlight se houver busca
                if (searchTerm !== '' && h1Text.includes(searchTerm)) {
                    const regex = new RegExp(`(${searchTerm})`, 'gi');
                    h1Element.innerHTML = h1Element.textContent.replace(regex, '<span class="highlight">$1</span>');
                }
            } else {
                container.classList.add('hidden');
            }
        });
    });

    // Funcionalidade de busca com Enter
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            if (searchTerm !== '') {
                // Encontra o primeiro container visível e rola até ele
                const visibleContainer = Array.from(historiasContainers).find(container => 
                    !container.classList.contains('hidden')
                );
                
                if (visibleContainer) {
                    visibleContainer.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }
        }
    });

    // Funcionalidade do botão de história aleatória
    randomStoryBtn.addEventListener('click', () => {
        // Remove todos os filtros de busca
        searchInput.value = '';
        historiasContainers.forEach(container => {
            container.classList.remove('hidden');
            const h1Element = container.querySelector('h1');
            h1Element.innerHTML = h1Element.textContent; // Remove highlights
        });

        // Seleciona uma história aleatória
        const randomIndex = Math.floor(Math.random() * historiasContainers.length);
        const randomContainer = historiasContainers[randomIndex];
        
        // Adiciona efeito visual
        randomContainer.style.transform = 'scale(1.02)';
        randomContainer.style.boxShadow = '0 15px 50px rgba(79, 70, 229, 0.4)';
        
        // Rola até a história selecionada
        randomContainer.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
        
        // Remove o efeito após 2 segundos
        setTimeout(() => {
            randomContainer.style.transform = '';
            randomContainer.style.boxShadow = '';
        }, 2000);
    });

    // Funcionalidade de comentários - Adicionar comentário
    adicionarComentarioBtn.addEventListener('click', () => {
        const nome = nomeComentarioInput.value.trim();
        const texto = textoComentarioInput.value.trim();
        
        if (nome === '' || texto === '') {
            alert('Por favor, preencha todos os campos!');
            return;
        }
        
        const novoComentario = {
            id: Date.now(),
            nome: nome,
            texto: texto,
            data: new Date().toLocaleString('pt-BR')
        };
        
        comentarios.unshift(novoComentario); // Adiciona no início do array
        localStorage.setItem('comentarios', JSON.stringify(comentarios));
        
        // Limpa os campos
        nomeComentarioInput.value = '';
        textoComentarioInput.value = '';
        
        // Atualiza a lista de comentários
        renderizarComentarios();
        
        // Feedback visual
        adicionarComentarioBtn.style.background = 'linear-gradient(135deg, #059669, #047857)';
        adicionarComentarioBtn.innerHTML = '<span class="material-icons">check</span> Comentário Enviado!';
        
        setTimeout(() => {
            adicionarComentarioBtn.style.background = '';
            adicionarComentarioBtn.innerHTML = '<span class="material-icons">send</span> Enviar Comentário';
        }, 2000);
    });

    // Função para renderizar comentários
    function renderizarComentarios() {
        listaComentarios.innerHTML = '';
        
        if (comentarios.length === 0) {
            listaComentarios.innerHTML = `
                <div class="comentario-item" style="text-align: center; color: #6b7280;">
                    <p>Ainda não há comentários. Seja o primeiro a comentar!</p>
                </div>
            `;
            return;
        }
        
        comentarios.forEach(comentario => {
            const comentarioElement = document.createElement('div');
            comentarioElement.className = 'comentario-item';
            comentarioElement.innerHTML = `
                <div class="comentario-header">
                    <span class="comentario-nome">${escapeHtml(comentario.nome)}</span>
                    <span class="comentario-data">${comentario.data}</span>
                </div>
                <div class="comentario-texto">${escapeHtml(comentario.texto)}</div>
            `;
            listaComentarios.appendChild(comentarioElement);
        });
    }

    // Função para escapar HTML (segurança)
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Funcionalidade de navegação suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Efeito de parallax no header
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('header');
        
        if (scrolled > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = '#ffffff';
            header.style.backdropFilter = 'none';
        }
    });

    // Animação de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observa elementos para animação
    document.querySelectorAll('.historias-container, .sobre-container, .comentarios-section').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Carrega comentários existentes
    renderizarComentarios();

    // Funcionalidade de teclado para acessibilidade
    document.addEventListener('keydown', (e) => {
        //limpar busca
        if (e.key === 'Escape') {
            searchInput.value = '';
            historiasContainers.forEach(container => {
                container.classList.remove('hidden');
                const h1Element = container.querySelector('h1');
                h1Element.innerHTML = h1Element.textContent;
            });
        }
    });
});

