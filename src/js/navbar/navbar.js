import './navbar.css'

// O menu sai da lista de rotas. Nenhum item está escrito no HTML.
function navbar(itensMenu) {
  const elemento = document.getElementById('navbar')
  elemento.innerHTML = `
    <nav class="navbar" aria-label="Menu principal">
      <ul class="navbar__lista">
        ${itensMenu
          .filter(item => item.label !== '')
          .map(item => `
            <li class="navbar__item">
              <a href="${item.url}" class="navbar__link" data-url="${item.url}">
                <i data-lucide="${item.icon}"></i>
                <span>${item.label}</span>
              </a>
            </li>`)
          .join('')}
      </ul>
    </nav>`
}

// Marca o item da tela atual. A tela de detalhe pertence a "Mutirões".
function marcarAtivo(caminho) {
  const pertence = { '#detalhe': '#resultados' }
  const alvo = pertence[caminho] ?? caminho
  document.querySelectorAll('.navbar__link').forEach(link => {
    if (link.dataset.url === alvo) {
      link.setAttribute('aria-current', 'page')
    } else {
      link.removeAttribute('aria-current')
    }
  })
}

export { navbar, marcarAtivo }
