// Módulo de sessão: entrar, sair e usuarioAtual.
// A sessão vive só na memória: um F5 desloga, como o desafio permite.
import usuarios from '../dadosMockados/usuarios.js'
import { normalizar } from '../util/formatos.js'

let atual = null

function entrar(email, senha) {
  const encontrado = usuarios.find(
    usuario => normalizar(usuario.email) === normalizar(email) && usuario.senha === senha
  )
  atual = encontrado ?? null
  return atual
}

function sair() {
  atual = null
}

function usuarioAtual() {
  return atual
}

export { entrar, sair, usuarioAtual }
