import './publicar.css'
import mutiroes from '../../dadosMockados/mutiroes.js'
import organizacoes from '../../dadosMockados/organizacoes.js'
import categorias from '../../dadosMockados/categorias.js'
import { usuarioAtual } from '../../sessao/sessao.js'
import { normalizar, hojeISO, escapar, desenharIcones } from '../../util/formatos.js'

// Tela 4 · Publicar
// Quem publica precisa de conta (o "Contribuinte" do KiOferta).
// A validação é do próprio HTML: required, minlength, min, max.
// Antes do push, um find recusa o mutirão repetido.
function publicar(app) {
  const usuario = usuarioAtual()

  if (usuario === null) {
    app.innerHTML = `
      <section class="publicar publicar--bloqueado">
        <h1 class="publicar__titulo">Publicar um mutirão</h1>
        <p class="publicar__apoio">
          Para publicar, entre com a conta da sua organização.
          Quem só procura onde ajudar não precisa de cadastro.
        </p>
        <a class="publicar__entrar" href="#conta?voltar=publicar">
          <i data-lucide="log-in"></i><span>Entrar para publicar</span>
        </a>
      </section>`
    return
  }

  const organizacao = organizacoes.find(o => o.id === usuario.organizacaoId)

  app.innerHTML = `
    <section class="publicar">
      <header class="publicar__topo">
        <h1 class="publicar__titulo">Publicar um mutirão</h1>
        <p class="publicar__apoio">
          Publicando como <strong>${escapar(usuario.nome)}</strong>,
          ${organizacao ? `em nome de ${escapar(organizacao.nome)}` : 'como iniciativa de moradores'}.
        </p>
      </header>

      <div id="aviso" class="publicar__aviso" role="alert" hidden></div>

      <form class="publicar__form" id="form-publicar">
        <div class="publicar__campo">
          <label for="titulo">Nome do mutirão</label>
          <input id="titulo" name="titulo" type="text" required minlength="5" maxlength="70"
                 placeholder="Ex.: Pintura da creche do bairro">
        </div>

        <div class="publicar__campo">
          <label for="categoria">Tipo de ajuda</label>
          <select id="categoria" name="categoria" required>
            <option value="">Escolha</option>
            ${categorias.map(c => `<option value="${c.nome}">${c.nome}</option>`).join('')}
          </select>
        </div>

        <fieldset class="publicar__grupo">
          <legend>Quando</legend>
          <div class="publicar__linha">
            <div class="publicar__campo publicar__campo--largo">
              <label for="data">Data</label>
              <input id="data" name="data" type="date" required min="${hojeISO()}">
            </div>
          </div>
          <div class="publicar__linha">
            <div class="publicar__campo">
              <label for="horaInicio">Começa</label>
              <input id="horaInicio" name="horaInicio" type="time" required>
            </div>
            <div class="publicar__campo">
              <label for="horaFim">Termina</label>
              <input id="horaFim" name="horaFim" type="time" required>
            </div>
          </div>
        </fieldset>

        <fieldset class="publicar__grupo">
          <legend>Onde</legend>
          <div class="publicar__campo">
            <label for="local">Local</label>
            <input id="local" name="local" type="text" required minlength="3" maxlength="80"
                   placeholder="Ex.: Salão da paróquia">
          </div>
          <div class="publicar__campo">
            <label for="bairro">Bairro</label>
            <input id="bairro" name="bairro" type="text" required minlength="3" maxlength="40">
          </div>
        </fieldset>

        <div class="publicar__campo">
          <label for="vagasTotal">Quantos voluntários vocês precisam</label>
          <input id="vagasTotal" name="vagasTotal" type="number" required min="1" max="200" step="1"
                 inputmode="numeric" class="publicar__vagas">
        </div>

        <div class="publicar__campo">
          <label for="precisa">O que precisa</label>
          <input id="precisa" name="precisa" type="text" required minlength="3" maxlength="140"
                 placeholder="Separe por vírgula: servir, lavar louça, luvas">
        </div>

        <div class="publicar__campo">
          <label for="requisitos">Requisitos <span class="publicar__opcional">(opcional)</span></label>
          <input id="requisitos" name="requisitos" type="text" maxlength="100"
                 placeholder="Ex.: maiores de 18 anos">
        </div>

        <div class="publicar__campo">
          <label for="descricao">Descrição <span class="publicar__opcional">(opcional)</span></label>
          <textarea id="descricao" name="descricao" rows="3" maxlength="280"></textarea>
        </div>

        <button type="submit" class="publicar__enviar">Publicar mutirão</button>
      </form>
    </section>`

  ligarEventos(usuario)
}

function mostrarAviso(tipo, html) {
  const aviso = document.getElementById('aviso')
  aviso.className = `publicar__aviso publicar__aviso--${tipo}`
  aviso.innerHTML = html
  aviso.hidden = false
  desenharIcones()
  aviso.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function ligarEventos(usuario) {
  const form = document.getElementById('form-publicar')
  const inicio = document.getElementById('horaInicio')
  const fim = document.getElementById('horaFim')

  // Ainda é validação do HTML: setCustomValidity só troca a mensagem
  // que o navegador mostra quando o horário final vem antes do inicial.
  function conferirHorario() {
    const invertido = inicio.value !== '' && fim.value !== '' && fim.value <= inicio.value
    fim.setCustomValidity(invertido ? 'O fim precisa ser depois do começo.' : '')
  }
  inicio.addEventListener('input', conferirHorario)
  fim.addEventListener('input', conferirHorario)

  form.addEventListener('submit', evento => {
    evento.preventDefault()
    conferirHorario()
    if (!form.reportValidity()) return

    const dados = new FormData(form)
    const titulo = dados.get('titulo').trim()
    const data = dados.get('data')

    // find para recusar repetido: mesmo nome, mesma data, mesmo publicador
    const repetido = mutiroes.find(m =>
      normalizar(m.titulo) === normalizar(titulo) &&
      m.data === data &&
      (usuario.organizacaoId !== null
        ? m.organizacaoId === usuario.organizacaoId
        : m.publicadoPor === usuario.id)
    )

    if (repetido) {
      mostrarAviso('erro', `
        <i data-lucide="triangle-alert"></i>
        <span>Já existe um mutirão "${escapar(repetido.titulo)}" nessa data.
        <a href="#detalhe?id=${repetido.id}">Ver o que já foi publicado</a>.</span>`)
      return
    }

    // id novo: um a mais que o maior id existente
    const maiorId = mutiroes.reduce((maior, m) => Math.max(maior, m.id), 0)

    const novo = {
      id: maiorId + 1,
      titulo,
      categoria: dados.get('categoria'),
      organizacaoId: usuario.organizacaoId,
      publicadoPor: usuario.id,
      data,
      horaInicio: dados.get('horaInicio'),
      horaFim: dados.get('horaFim'),
      local: dados.get('local').trim(),
      bairro: dados.get('bairro').trim(),
      vagasTotal: Number(dados.get('vagasTotal')),
      vagasPreenchidas: 0,
      precisa: dados.get('precisa').trim().split(/\s*,\s*/).filter(item => item !== ''),
      requisitos: dados.get('requisitos').trim(),
      descricao: dados.get('descricao').trim(),
    }

    mutiroes.push(novo)
    form.reset()

    mostrarAviso('ok', `
      <i data-lucide="circle-check-big"></i>
      <span>Mutirão publicado. <a href="#detalhe?id=${novo.id}">Ver como ficou</a>
      ou publique outro.</span>`)
  })
}

export default {
  url: '#publicar',
  label: 'Publicar',
  icon: 'circle-plus',
  pagina: publicar,
}
