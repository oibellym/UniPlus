// A lista única de telas. O roteador procura aqui (find) e o menu
// é gerado daqui (filter + map). Tela com label vazio não vai para o menu.
import inicio from '../paginas/inicio/inicio.js'
import resultados from '../paginas/resultados/resultados.js'
import detalhe from '../paginas/detalhe/detalhe.js'
import publicar from '../paginas/publicar/publicar.js'
import conta from '../paginas/conta/conta.js'
import naoEncontrada from '../paginas/naoEncontrada/naoEncontrada.js'

const mapaderotas = [
  inicio,
  resultados,
  publicar,
  conta,
  detalhe,
  naoEncontrada,
]

export { mapaderotas }
