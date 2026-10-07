// Roteador por hash.
// O endereço tem duas partes: o caminho (#detalhe) e a consulta (?id=3).
// O find procura o caminho na lista de rotas; a consulta vai para a tela.
// Assim o F5 em #detalhe?id=3 reabre o mesmo mutirão.
import { mapaderotas } from './rotas/rotas.js'
import { navbar, marcarAtivo } from './navbar/navbar.js'
import { desenharIcones } from './util/formatos.js'

const app = document.getElementById('app')
navbar(mapaderotas)

function lerEndereco() {
  const hash = window.location.hash
  const completo = hash === '' || hash === '#' ? '#inicio' : hash
  const [caminho, consulta = ''] = completo.split('?')
  return { caminho, parametros: new URLSearchParams(consulta) }
}

function renderizarPagina() {
  const { caminho, parametros } = lerEndereco()
  const rota = mapaderotas.find(tela => tela.url === caminho)

  if (rota === undefined) {
    const naoEncontrada = mapaderotas.find(tela => tela.url === '#nao-encontrada')
    naoEncontrada.pagina(app, parametros, caminho)
  } else {
    rota.pagina(app, parametros)
  }

  marcarAtivo(caminho)
  desenharIcones()
  window.scrollTo(0, 0)
}

window.addEventListener('hashchange', renderizarPagina)
renderizarPagina()
