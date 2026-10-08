import './naoEncontrada.css'
import { escapar } from '../../util/formatos.js'

// Tela 6 · Rota inexistente
function naoEncontrada(app, parametros, caminhoPedido = '') {
  app.innerHTML = `
    <section class="nao-encontrada">
      <i data-lucide="map-pin-off"></i>
      <h1 class="nao-encontrada__titulo">Este endereço não leva a nenhum mutirão</h1>
      <p class="nao-encontrada__apoio">
        ${caminhoPedido !== ''
          ? `O endereço <code>${escapar(caminhoPedido)}</code> não existe no Uni+.`
          : 'A página que você procurou não existe no Uni+.'}
        Pode ter sido digitado errado, ou o link é antigo.
      </p>
      <a class="nao-encontrada__voltar" href="#inicio">Voltar para o início</a>
    </section>`
}

export default {
  url: '#nao-encontrada',
  label: '',
  icon: 'map-pin-off',
  pagina: naoEncontrada,
}
