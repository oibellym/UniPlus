import './detalhe.css'
import mutiroes from '../../dadosMockados/mutiroes.js'
import organizacoes from '../../dadosMockados/organizacoes.js'
import usuarios from '../../dadosMockados/usuarios.js'
import {
  faltam,
  formatarData,
  formatarHora,
  textoPrazo,
  escapar,
} from '../../util/formatos.js'

// Tela 3 · Detalhe
// O id vem da lista (#detalhe?id=3). O find devolve o mutirão,
// e mais dois find trazem quem oferece e quem publicou.
function detalhe(app, parametros) {
  const id = Number(parametros.get('id'))
  const mutirao = mutiroes.find(m => m.id === id)

  if (mutirao === undefined) {
    app.innerHTML = `
      <section class="detalhe detalhe--ausente">
        <h1 class="detalhe__titulo">Mutirão não encontrado</h1>
        <p>Este mutirão não existe ou já saiu do ar.</p>
        <a class="detalhe__voltar" href="#resultados">Ver os mutirões abertos</a>
      </section>`
    return
  }

  const organizacao = organizacoes.find(o => o.id === mutirao.organizacaoId)
  const autor = usuarios.find(u => u.id === mutirao.publicadoPor)
  const quantos = faltam(mutirao)

  app.innerHTML = `
    <article class="detalhe">
      <a class="detalhe__voltar" href="#resultados">
        <i data-lucide="arrow-left"></i><span>Mutirões</span>
      </a>

      <header class="detalhe__topo">
        <p class="detalhe__categoria">${escapar(mutirao.categoria)}</p>
        <h1 class="detalhe__titulo">${escapar(mutirao.titulo)}</h1>
        <p class="detalhe__org">${organizacao ? escapar(organizacao.nome) : 'Iniciativa de moradores'}</p>
      </header>

      <section class="detalhe__decisao" aria-label="Resumo para decidir">
        <div class="detalhe__metricas">
          <div class="detalhe__metrica detalhe__metrica--principal">
            ${quantos === 0
              ? `<span class="detalhe__completo">Vagas completas</span>
                 <span class="detalhe__apoio">a organização pode abrir mais vagas</span>`
              : `<span class="detalhe__numero">${quantos}</span>
                 <span class="detalhe__apoio">${quantos === 1 ? 'voluntário falta' : 'voluntários faltam'}</span>`}
          </div>
          <div class="detalhe__metrica">
            <span class="detalhe__valor">${textoPrazo(mutirao.data)}</span>
            <span class="detalhe__apoio">${formatarData(mutirao.data)}</span>
          </div>
          <div class="detalhe__metrica">
            <span class="detalhe__valor">${formatarHora(mutirao.horaInicio)} às ${formatarHora(mutirao.horaFim)}</span>
            <span class="detalhe__apoio">horário</span>
          </div>
        </div>
        <div class="detalhe__trilho">
          <progress class="detalhe__barra" value="${mutirao.vagasPreenchidas}" max="${mutirao.vagasTotal}">
            ${mutirao.vagasPreenchidas} de ${mutirao.vagasTotal}
          </progress>
        </div>
        <p class="detalhe__legenda">
          ${mutirao.vagasPreenchidas} de ${mutirao.vagasTotal} vagas já preenchidas
        </p>
      </section>

      ${mutirao.descricao
        ? `<p class="detalhe__descricao">${escapar(mutirao.descricao)}</p>`
        : ''}

      <section class="detalhe__bloco">
        <h2>O que precisa</h2>
        <ul class="detalhe__precisa">
          ${mutirao.precisa.map(item => `<li>${escapar(item)}</li>`).join('')}
        </ul>
      </section>

      <section class="detalhe__bloco">
        <h2>Onde e para quem</h2>
        <p class="detalhe__linha"><i data-lucide="map-pin"></i>
          <span>${escapar(mutirao.local)}, ${escapar(mutirao.bairro)}</span></p>
        <p class="detalhe__linha"><i data-lucide="info"></i>
          <span>${escapar(mutirao.requisitos || 'Sem requisitos.')}</span></p>
      </section>

      <section class="detalhe__bloco detalhe__quem">
        <h2>Quem publicou</h2>
        ${organizacao
          ? `<p class="detalhe__org-nome">${escapar(organizacao.nomeCompleto)}</p>
             <p class="detalhe__org-foco">${escapar(organizacao.foco)}</p>
             <p class="detalhe__linha"><i data-lucide="phone"></i>
               <span>${escapar(organizacao.contato)}</span></p>`
          : '<p class="detalhe__org-foco">Iniciativa de moradores, sem organização ligada.</p>'}
        <p class="detalhe__autor">Publicado por ${autor ? escapar(autor.nome) : 'conta removida'}</p>
      </section>

      <p class="detalhe__como">
        Para participar, fale com a organização pelo contato acima.
        A inscrição pelo Uni+ ainda não existe.
      </p>
    </article>`
}

export default {
  url: '#detalhe',
  label: '',
  icon: 'file-text',
  pagina: detalhe,
}
