import './resultados.css'
import mutiroes from '../../dadosMockados/mutiroes.js'
import organizacoes from '../../dadosMockados/organizacoes.js'
import categorias from '../../dadosMockados/categorias.js'
import {
  desenharIcones,
  normalizar,
  faltam,
  formatarData,
  textoPrazo,
  escapar,
} from '../../util/formatos.js'

// Tela 2 · Resultados
// O termo, a categoria e a ordem chegam pelo endereço
// (#resultados?termo=sopa&categoria=Alimentação&ordem=data).
// Mudar qualquer controle refaz só a lista, sem recarregar a tela,
// e regrava o endereço para o F5 voltar ao mesmo ponto.

const ORDENS = [
  { valor: 'falta', rotulo: 'Faltam mais pessoas' },
  { valor: 'data', rotulo: 'Acontece antes' },
]

let estado = { termo: '', categoria: '', ordem: 'falta' }

function resultados(app, parametros) {
  const ordemPedida = parametros.get('ordem') ?? 'falta'
  estado = {
    termo: parametros.get('termo') ?? '',
    categoria: parametros.get('categoria') ?? '',
    ordem: ORDENS.find(o => o.valor === ordemPedida) ? ordemPedida : 'falta',
  }

  app.innerHTML = `
    <section class="resultados">
      <header class="resultados__topo">
        <h1 class="resultados__titulo">Mutirões</h1>
        <p class="resultados__resumo" id="resumo" aria-live="polite"></p>
      </header>

      <form class="resultados__filtros" id="form-filtros" role="search">
        <div class="resultados__campo-busca">
          <label for="filtro-termo" class="visualmente-oculto">Buscar</label>
          <i data-lucide="search"></i>
          <input id="filtro-termo" type="search" autocomplete="off" maxlength="60"
                 placeholder="Buscar por nome, bairro ou ONG"
                 value="${escapar(estado.termo)}">
        </div>
        <div class="resultados__selecoes">
          <label class="resultados__selecao">
            <span>Tipo de ajuda</span>
            <select id="filtro-categoria">
              <option value="">Todos</option>
              ${categorias
                .map(c => `<option value="${c.nome}" ${c.nome === estado.categoria ? 'selected' : ''}>${c.nome}</option>`)
                .join('')}
            </select>
          </label>
          <label class="resultados__selecao">
            <span>Ordenar por</span>
            <select id="filtro-ordem">
              ${ORDENS
                .map(o => `<option value="${o.valor}" ${o.valor === estado.ordem ? 'selected' : ''}>${o.rotulo}</option>`)
                .join('')}
            </select>
          </label>
        </div>
      </form>

      <div id="lista-resultados"></div>
    </section>`

  desenharLista()
  ligarEventos()
}

// filter: o que combina com o termo E com a categoria
function filtrar(lista, termo, categoria) {
  const procurado = normalizar(termo)
  return lista.filter(mutirao => {
    const organizacao = organizacoes.find(o => o.id === mutirao.organizacaoId)
    const textoDoMutirao = normalizar([
      mutirao.titulo,
      mutirao.categoria,
      mutirao.bairro,
      mutirao.local,
      organizacao ? organizacao.nome : '',
      ...mutirao.precisa,
    ].join(' '))
    const combinaTexto = procurado === '' || textoDoMutirao.includes(procurado)
    const combinaCategoria = categoria === '' || mutirao.categoria === categoria
    return combinaTexto && combinaCategoria
  })
}

// Dois critérios de ordenação. A cópia [...lista] protege o array original.
function ordenar(lista, ordem) {
  if (ordem === 'data') {
    return [...lista].sort((a, b) => a.data.localeCompare(b.data) || faltam(b) - faltam(a))
  }
  return [...lista].sort((a, b) => faltam(b) - faltam(a) || a.data.localeCompare(b.data))
}

function cartao(mutirao) {
  const organizacao = organizacoes.find(o => o.id === mutirao.organizacaoId)
  const quantos = faltam(mutirao)
  return `
    <li>
      <a class="resultado" href="#detalhe?id=${mutirao.id}">
        <div class="resultado__info">
          <p class="resultado__categoria">${escapar(mutirao.categoria)}</p>
          <h2 class="resultado__titulo">${escapar(mutirao.titulo)}</h2>
          <p class="resultado__org">${organizacao ? escapar(organizacao.nome) : 'Iniciativa de moradores'}</p>
          <p class="resultado__linha">
            <i data-lucide="calendar-days"></i>
            <span>${formatarData(mutirao.data)}, <strong>${textoPrazo(mutirao.data)}</strong></span>
          </p>
          <p class="resultado__linha">
            <i data-lucide="map-pin"></i>
            <span>${escapar(mutirao.bairro)}</span>
          </p>
        </div>
        ${quantos === 0
          ? `<div class="resultado__decisao resultado__decisao--completo">
               <span class="resultado__rotulo">vagas completas</span>
             </div>`
          : `<div class="resultado__decisao">
               <span class="resultado__numero">${quantos}</span>
               <span class="resultado__rotulo">${quantos === 1 ? 'pessoa falta' : 'pessoas faltam'}</span>
             </div>`}
      </a>
    </li>`
}

function textoResumo(quantos) {
  const partes = []
  if (estado.termo !== '') partes.push(`para "${escapar(estado.termo)}"`)
  if (estado.categoria !== '') partes.push(`em ${escapar(estado.categoria)}`)
  const contagem = quantos === 1 ? '1 mutirão encontrado' : `${quantos} mutirões encontrados`
  return [contagem, ...partes].join(' ')
}

function textoVazio() {
  const filtros = []
  if (estado.termo !== '') filtros.push(`com "${escapar(estado.termo)}"`)
  if (estado.categoria !== '') filtros.push(`em ${escapar(estado.categoria)}`)
  const frase = filtros.length === 0
    ? 'Nenhuma ação aberta no momento.'
    : `Ninguém publicou ainda uma ação ${filtros.join(' ')}.`
  return `${frase} Tente outra palavra ou veja todos.`
}

function desenharLista() {
  const lista = ordenar(filtrar(mutiroes, estado.termo, estado.categoria), estado.ordem)
  const destino = document.getElementById('lista-resultados')

  document.getElementById('resumo').innerHTML = textoResumo(lista.length)

  destino.innerHTML = lista.length === 0
    ? `<div class="resultados__vazio">
         <i data-lucide="search-x"></i>
         <h2>Nenhum mutirão encontrado</h2>
         <p>${textoVazio()}</p>
         <button type="button" class="resultados__limpar" id="btn-limpar">Ver todos os mutirões</button>
       </div>`
    : `<ul class="resultados__lista">${lista.map(cartao).join('')}</ul>`

  const botaoLimpar = document.getElementById('btn-limpar')
  if (botaoLimpar) {
    botaoLimpar.addEventListener('click', () => {
      estado = { termo: '', categoria: '', ordem: estado.ordem }
      document.getElementById('filtro-termo').value = ''
      document.getElementById('filtro-categoria').value = ''
      atualizar()
    })
  }

  desenharIcones()
}

function gravarEndereco() {
  const consulta = new URLSearchParams()
  if (estado.termo !== '') consulta.set('termo', estado.termo)
  if (estado.categoria !== '') consulta.set('categoria', estado.categoria)
  if (estado.ordem !== 'falta') consulta.set('ordem', estado.ordem)
  const texto = consulta.toString()
  // replaceState não dispara hashchange: a tela não é redesenhada inteira.
  history.replaceState(null, '', texto === '' ? '#resultados' : `#resultados?${texto}`)
}

function atualizar() {
  gravarEndereco()
  desenharLista()
}

function ligarEventos() {
  document.getElementById('form-filtros').addEventListener('submit', evento => {
    evento.preventDefault()
  })
  document.getElementById('filtro-termo').addEventListener('input', evento => {
    estado.termo = evento.target.value.trim()
    atualizar()
  })
  document.getElementById('filtro-categoria').addEventListener('change', evento => {
    estado.categoria = evento.target.value
    atualizar()
  })
  document.getElementById('filtro-ordem').addEventListener('change', evento => {
    estado.ordem = evento.target.value
    atualizar()
  })
}

export default {
  url: '#resultados',
  label: 'Mutirões',
  icon: 'hand-heart',
  pagina: resultados,
}
