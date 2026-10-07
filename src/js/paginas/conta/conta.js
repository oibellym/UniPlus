import './conta.css'
import mutiroes from '../../dadosMockados/mutiroes.js'
import organizacoes from '../../dadosMockados/organizacoes.js'
import usuarios from '../../dadosMockados/usuarios.js'
import { entrar, sair, usuarioAtual } from '../../sessao/sessao.js'
import { faltam, formatarData, textoPrazo, escapar, desenharIcones } from '../../util/formatos.js'

// Tela 5 · Minha conta
// Sem sessão: formulário de login (find no módulo de sessão).
// Com sessão: os dados de quem entrou e um filter pelos mutirões dele.
function conta(app, parametros) {
  const usuario = usuarioAtual()
  if (usuario === null) {
    desenharLogin(app, parametros)
  } else {
    desenharPerfil(app, usuario, parametros)
  }
}

function desenharLogin(app, parametros) {
  const voltar = parametros.get('voltar')

  app.innerHTML = `
    <section class="conta">
      <header class="conta__topo">
        <h1 class="conta__titulo">Entrar</h1>
        <p class="conta__apoio">
          ${voltar === 'publicar'
            ? 'Entre para publicar o mutirão da sua organização.'
            : 'A conta é para quem publica mutirões. Para procurar onde ajudar, não precisa entrar.'}
        </p>
      </header>

      <form class="conta__form" id="form-login">
        <div class="conta__campo">
          <label for="email">E-mail</label>
          <input id="email" name="email" type="email" required autocomplete="username"
                 placeholder="voce@exemplo.com.br">
        </div>
        <div class="conta__campo">
          <label for="senha">Senha</label>
          <input id="senha" name="senha" type="password" required minlength="3"
                 autocomplete="current-password">
        </div>
        <p id="erro-login" class="conta__erro" role="alert" hidden></p>
        <button type="submit" class="conta__entrar">Entrar</button>
      </form>

      <details class="conta__teste">
        <summary>Contas de demonstração</summary>
        <p>Todas usam a senha <strong>uni123</strong>.</p>
        <ul>
          ${usuarios
            .map(u => {
              const org = organizacoes.find(o => o.id === u.organizacaoId)
              return `<li><span>${u.email}</span><span>${org ? org.nome : 'sem organização'}</span></li>`
            })
            .join('')}
        </ul>
      </details>
    </section>`

  const form = document.getElementById('form-login')
  const erro = document.getElementById('erro-login')

  form.addEventListener('submit', evento => {
    evento.preventDefault()
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    const dados = new FormData(form)
    const encontrado = entrar(dados.get('email'), dados.get('senha'))

    if (encontrado === null) {
      erro.innerHTML = '<i data-lucide="circle-alert"></i><span>E-mail ou senha não conferem. Confira e tente de novo.</span>'
      erro.hidden = false
      desenharIcones()
      document.getElementById('senha').value = ''
      document.getElementById('senha').focus()
      return
    }

    if (voltar === 'publicar') {
      location.hash = '#publicar'
    } else {
      conta(app, new URLSearchParams())
      desenharIcones()
    }
  })
}

function linhaMutirao(mutirao) {
  const quantos = faltam(mutirao)
  return `
    <li>
      <a class="conta__mutirao" href="#detalhe?id=${mutirao.id}">
        <span class="conta__mutirao-info">
          <span class="conta__mutirao-titulo">${escapar(mutirao.titulo)}</span>
          <span class="conta__mutirao-data">${formatarData(mutirao.data)}, ${textoPrazo(mutirao.data)}</span>
        </span>
        <span class="conta__mutirao-vagas">
          ${quantos === 0 ? 'completo' : `faltam ${quantos}`}
        </span>
      </a>
    </li>`
}

function desenharPerfil(app, usuario) {
  const organizacao = organizacoes.find(o => o.id === usuario.organizacaoId)
  const meus = mutiroes
    .filter(m => m.publicadoPor === usuario.id)
    .sort((a, b) => a.data.localeCompare(b.data))

  app.innerHTML = `
    <section class="conta">
      <header class="conta__perfil">
        <span class="conta__avatar" aria-hidden="true">${escapar(usuario.nome.charAt(0))}</span>
        <div class="conta__dados">
          <h1 class="conta__nome">${escapar(usuario.nome)}</h1>
          <p class="conta__apoio">${escapar(usuario.email)}</p>
          <p class="conta__apoio">${organizacao ? escapar(organizacao.nomeCompleto) : 'Iniciativa de moradores'}</p>
        </div>
      </header>

      <section class="conta__secao">
        <div class="conta__secao-topo">
          <h2>Mutirões que você publicou</h2>
          <span class="conta__contagem">${meus.length}</span>
        </div>
        ${meus.length === 0
          ? `<div class="conta__vazio">
               <p>Você ainda não publicou nenhum mutirão.</p>
               <a href="#publicar">Publicar o primeiro</a>
             </div>`
          : `<ul class="conta__lista">${meus.map(linhaMutirao).join('')}</ul>`}
      </section>

      <button type="button" class="conta__sair" id="btn-sair">
        <i data-lucide="log-out"></i><span>Sair</span>
      </button>
    </section>`

  document.getElementById('btn-sair').addEventListener('click', () => {
    sair()
    history.replaceState(null, '', '#conta')
    conta(app, new URLSearchParams())
    desenharIcones()
  })
}

export default {
  url: '#conta',
  label: 'Conta',
  icon: 'user-round',
  pagina: conta,
}
