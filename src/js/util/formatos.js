// Funções pequenas usadas por mais de uma tela.
// Ficam aqui para que cada tela não reescreva a mesma conta.
import { createIcons, icons } from 'lucide'

// Troca os <i data-lucide="..."> pelo desenho do ícone.
// Chamada pelo roteador e por toda tela que redesenha parte de si.
function desenharIcones() {
  createIcons({ icons })
}

// "Sopá  Solidária" e "sopa solidaria" passam a ser iguais na busca
// e na verificação de registro repetido.
function normalizar(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
}

// O "preço" do Uni+: quantos voluntários ainda faltam.
function faltam(mutirao) {
  return Math.max(mutirao.vagasTotal - mutirao.vagasPreenchidas, 0)
}

function dataLocal(textoISO) {
  const [ano, mes, dia] = textoISO.split('-')
  return new Date(Number(ano), Number(mes) - 1, Number(dia))
}

function hojeISO() {
  const hoje = new Date()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const dia = String(hoje.getDate()).padStart(2, '0')
  return `${hoje.getFullYear()}-${mes}-${dia}`
}

// A "distância" do Uni+: quantos dias até o mutirão.
function diasAte(textoISO) {
  const hoje = dataLocal(hojeISO())
  const umDia = 24 * 60 * 60 * 1000
  return Math.round((dataLocal(textoISO) - hoje) / umDia)
}

function textoPrazo(textoISO) {
  const dias = diasAte(textoISO)
  if (dias < 0) return 'já aconteceu'
  if (dias === 0) return 'hoje'
  if (dias === 1) return 'amanhã'
  return `em ${dias} dias`
}

function formatarData(textoISO) {
  return dataLocal(textoISO).toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

function formatarHora(hora) {
  const [h, m] = hora.split(':')
  return m === '00' ? `${Number(h)}h` : `${Number(h)}h${m}`
}

// Todo texto digitado por alguém passa por aqui antes de ir para o innerHTML.
function escapar(texto) {
  return String(texto ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export {
  desenharIcones,
  normalizar,
  faltam,
  diasAte,
  hojeISO,
  textoPrazo,
  formatarData,
  formatarHora,
  escapar,
}
