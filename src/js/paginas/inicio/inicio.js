import './inicio.css'
import mutiroes from '../../dadosMockados/mutiroes.js'
import categorias from '../../dadosMockados/categorias.js'
import { faltam } from '../../util/formatos.js'

// Tela 1 · Início
// Um elemento dominante: a busca. As categorias são o segundo caminho.
function inicio(app) {
  const abertos = mutiroes.filter(mutirao => faltam(mutirao) > 0)
  let pessoasQueFaltam = 0
  abertos.forEach(mutirao => { pessoasQueFaltam += faltam(mutirao) })

  app.innerHTML = `
    <section class="inicio">
      <header class="inicio__topo">
        <p class="inicio__marca">Uni<span aria-hidden="true">+</span></p>
        <h1 class="inicio__titulo">Onde a sua ajuda faz falta?</h1>
        <p class="inicio__apoio">
          ${abertos.length} mutirões em Mogi das Cruzes ainda precisam de
          ${pessoasQueFaltam} voluntários.
        </p>
      </header>

      <form class="inicio__busca" id="form-busca" role="search">
        <label for="campo-busca" class="visualmente-oculto">Buscar mutirão</label>
        <span class="inicio__icone" aria-hidden="true"><i data-lucide="search"></i></span>
        <input
          id="campo-busca"
          name="termo"
          type="search"
          class="inicio__campo"
          placeholder="Sopa, pintura, bairro, ONG..."
          autocomplete="off"
          maxlength="60"
        />
        <button type="submit" class="inicio__botao">Buscar</button>
      </form>

      <section class="inicio__categorias" aria-labelledby="titulo-categorias">
        <h2 id="titulo-categorias" class="inicio__subtitulo">Ou escolha o tipo de ajuda</h2>
        <ul class="inicio__lista">
          ${categorias
            .map(categoria => {
              const quantos = mutiroes.filter(m => m.categoria === categoria.nome).length
              return `
                <li class="inicio__item">
                  <a class="inicio__categoria"
                     href="#resultados?categoria=${encodeURIComponent(categoria.nome)}">
                    <i data-lucide="${categoria.icon}"></i>
                    <span class="inicio__categoria-nome">${categoria.nome}</span>
                    <span class="inicio__categoria-qtd">${quantos}</span>
                  </a>
                </li>`
            })
            .join('')}
        </ul>
      </section>
    </section>`

  ligarEventos()
}

function ligarEventos() {
  const form = document.getElementById('form-busca')
  form.addEventListener('submit', evento => {
    evento.preventDefault()
    const termo = document.getElementById('campo-busca').value.trim()
    // O termo viaja no endereço: a tela de resultados lê de lá,
    // e o F5 em resultados mantém a busca.
    location.hash = termo === ''
      ? '#resultados'
      : `#resultados?termo=${encodeURIComponent(termo)}`
  })
}

export default {
  url: '#inicio',
  label: 'Início',
  icon: 'house',
  pagina: inicio,
}
