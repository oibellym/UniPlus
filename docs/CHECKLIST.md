# Checklist do Desafio 1 · Uni+ (Mutirões e voluntariado)

Legenda: **[x]** já atendido no código entregue e conferido em 360px · **[ ]** depende do grupo (Git, relatório, apresentação).

Cada item traz **onde conferir**, para o grupo provar na apresentação.

---

## 1. O que o desafio não é

- [x] Sem backend, banco de dados ou login de verdade. Dados em `src/js/dadosMockados/`, sessão só na memória (`sessao.js`).
- [x] Sem CSS Grid, sem framework CSS, sem framework JS. Só Vite + JavaScript puro + Lucide (ícones, já vinha no KiOferta).
- [x] Não é o KiOferta com nomes trocados: dados, telas, textos e critérios são do tema (vagas que faltam e data, em vez de preço e distância).

## 2. Tema e pergunta

- [x] Tema sorteado: **Mutirões e voluntariado**. O que se publica: um mutirão, com data e o que precisa.
- [x] Pergunta do app: *"Onde a minha ajuda faz mais falta, em uma data em que eu consigo ir?"* Ela decide o que vem primeiro: o número de voluntários que faltam aparece à direita na lista e no topo do detalhe.
- [ ] A frase abre o relatório (R1).

## 3. Mapa de equivalência

- [x] Tabela pronta no `README.md` (Produto, Oferta, Mercado, Preço, Distância, Contribuinte, Visitante).
- [ ] Copiar a tabela para o relatório (R2).

## 4. Estrutura obrigatória

- [x] `src/index.html` com `#app` e o menu (`#navbar`).
- [x] `css/tokens.css`, `css/base.css`, `css/style.css` (este só importa os outros dois).
- [x] `js/main.js`: roteador com `hashchange` e `find` na lista de rotas.
- [x] `js/rotas/rotas.js`: lista única das 6 telas.
- [x] `js/navbar/navbar.js`: menu gerado da lista.
- [x] `js/sessao/sessao.js`: `entrar`, `sair`, `usuarioAtual`.
- [x] `js/dadosMockados/`: `mutiroes.js`, `organizacoes.js`, `usuarios.js`, `categorias.js`.
- [x] `js/paginas/`: uma pasta por tela, com JS e CSS da tela.
- [x] Pasta extra `js/util/formatos.js` (funções usadas por várias telas). Justificar no relatório como decisão.
- [x] **E1.** Toda tela exporta `{ url, label, icon, pagina }` e está em `rotas.js`. Detalhe e Rota inexistente têm `label: ''`.
- [x] **E2.** Nenhum item de menu escrito à mão no HTML: `navbar.js` faz `filter(label !== '')` + `map` + `join`.
- [x] **E3.** Um CSS por componente, importado pelo próprio módulo (`import './inicio.css'` etc., inclusive `navbar.css`). Nenhum `style=""` no projeto (os botões com estilo inline do KiOferta foram removidos).
- [x] **E4.** 15 registros (mínimo 12), 6 organizações publicadoras e 7 usuários (mínimo 4 de cada). Todo registro tem `id` e guarda `publicadoPor` (id do usuário) e `organizacaoId`.
- [x] **E5.** Estrutura copiada do KiOferta; conteúdo todo do tema.

## 5. As seis telas

| Tela | Exigência | Onde está | OK |
|---|---|---|---|
| 1 · Início | Busca dominante e categorias como 2º caminho; termo chega na próxima tela | `inicio.js`: `location.hash = '#resultados?termo=...'` | [x] |
| 2 · Resultados | `filter`, `map` + `join`, 2 critérios de ordenação, `.length === 0` | `resultados.js`: `filtrar()`, `ordenar()`, `desenharLista()` | [x] |
| 3 · Detalhe | `find` pelo id vindo da lista; quem publicou e os dados que decidem | `detalhe.js`: `mutiroes.find(m => m.id === id)` + `find` da organização e do autor | [x] |
| 4 · Publicar | Formulário validado pelo HTML, `find` recusa repetido, `push` | `publicar.js`: `required/minlength/min/max`, `reportValidity()`, `find` + `push` | [x] |
| 5 · Minha conta | Login com `find`, dados de quem entrou, `filter` pelos registros dele, botão sair | `sessao.js` (`find`) e `conta.js` (`filter(m => m.publicadoPor === usuario.id)`) | [x] |
| 6 · Rota inexistente | Endereço que não existe cai aqui, com saída para o início | `main.js`: `if (rota === undefined)` → `naoEncontrada` | [x] |

Casos extras já tratados: detalhe com id que não existe, mutirão com vagas completas, conta sem publicações (`tiago@exemplo.com.br`), publicar sem estar logado (leva ao login e volta para publicar).

## 6. Regras de layout

- [x] **L1.** Nenhum `display: grid` (o `buscar.css` do KiOferta usava grid e foi removido).
- [x] **L2.** Nenhum `width` ou `height` em CSS. Tamanhos importantes usam `flex: 0 0 <medida>` (ex.: `.resultado__decisao { flex: 0 0 76px }`, `.inicio__icone { flex: 0 0 44px }`, `.conta__avatar { flex: 0 0 56px }`). A barra de vagas ocupa a linha com `flex: 1 1 0` e a espessura vem do `font-size`.
- [x] **L3.** Nenhuma cor escrita fora de `tokens.css`. Destaque (`--cor-destaque`) em um único papel por tela:
  - Início: botão Buscar
  - Resultados: número de pessoas que faltam (mesmo papel do preço no KiOferta)
  - Detalhe: número grande de voluntários que faltam
  - Publicar: botão Publicar mutirão
  - Conta: botão Entrar
  - Rota inexistente: botão Voltar para o início
- [x] **L4.** Testado em 360px nas seis telas e nos estados de erro/vazio: nenhum elemento passa da largura.

Comandos para provar (rodar na raiz do projeto):

```bash
grep -rn "grid" src --include=*.css                         # deve voltar vazio
grep -rnE "(^|[^-])(width|height)\s*:" src --include=*.css  # deve voltar vazio
grep -rn "style=" src                                       # deve voltar vazio
grep -rnE "#[0-9a-fA-F]{3,6}\b" src --include=*.css | grep -v tokens.css   # vazio
grep -rn "cor-destaque" src --include=*.css                 # 1 linha por tela
```

## 7. Bônus (+0,5)

- [x] Segundo critério de ordenação que o usuário escolhe ("Faltam mais pessoas" / "Acontece antes").
- [x] Filtro por categoria funcionando junto com a busca por texto, sem recarregar a tela (`history.replaceState` atualiza o endereço e o F5 mantém o filtro).

## 8. Relatório (fica com o grupo)

- [ ] PDF de 3 a 5 páginas em `docs/`.
- [ ] R1 O problema e quem usa (pergunta + 3 situações de uso).
- [ ] R2 Mapa de equivalência.
- [ ] R3 Estrutura (árvore + papel de cada arquivo, já pronta no README).
- [ ] R4 Três decisões e um descartado. Sugestões tiradas do código:
  - Endereço com consulta (`#detalhe?id=3`) para o F5 reabrir a tela certa.
  - Datas dos mocks calculadas a partir de hoje (`daquiA(dias)`), para a demonstração nunca vencer.
  - "Faltam" como número que decide, em vez de vagas totais.
  - Descartado: inscrição no mutirão pelo app (contar vaga preenchida), porque exigiria estado por voluntário e o tema pede só publicar e comparar.
- [ ] R5 Divisão de tarefas com os números/hashes dos commits.
- [ ] R6 Duas dificuldades reais (ex.: barra de progresso que não esticava por causa da largura padrão do `<progress>`; ícones do Lucide que sumiam depois de redesenhar a lista).
- [ ] R7 O que ficou de fora (inscrição, editar/excluir mutirão, sessão e publicações não sobrevivem ao F5, mapa).
- [ ] Capturas em 360px: as 6 telas + erro de login + busca vazia.

## 9. Entrega e Git (fica com o grupo)

- [ ] Repositório **público** no GitHub, criado pelo grupo.
- [ ] Os três integrantes com commits próprios no histórico (quem não tem commit perde a nota da divisão).
- [ ] Tabela de divisão do relatório batendo com o `git log`.
- [x] `README.md` com tema, integrantes e como rodar. **Preencher os nomes e usuários reais.**
- [ ] Relatório em PDF dentro de `docs/`.
- [ ] Link postado no ambiente da disciplina até a data (atraso: -1,0 por dia).
- [ ] Testar em máquina limpa: `npm install` e `npm run dev`.

## 10. Apresentação (8 min, sem slides)

- [ ] 1 min: tema e pergunta em uma frase.
- [ ] 2 min: buscar, abrir detalhe, publicar e entrar na conta, tudo em 360px.
- [ ] 3 min: cada integrante mostra o seu `find`/`filter`.
- [ ] 1 min: uma decisão e o descartado.
- [ ] 1 min: no DevTools, dizer se a regra é do contêiner pai (`display: flex`, `gap`, `justify-content`, `align-items`, `flex-wrap`) ou do filho (`flex`, `align-self`, `min-width`).

## 11. Antes de entregar (lista do PDF)

- [x] As seis telas abrem pelo menu ou link, e o F5 em qualquer endereço leva à tela certa ou à rota inexistente.
- [x] Busca sem resultado mostra a mensagem de vazio, não uma lista em branco.
- [x] Todo `.map()` termina em `.join("")`, e nenhum `var(--...)` aponta para token inexistente.
- [x] Nenhum filho de contêiner flex com `width` fixo; nada rola para o lado em 360px.
- [ ] `git log` com commits dos três e tabela do relatório batendo.
- [x] Roda com `npm install` e `npm run dev` (testado neste pacote; repetir na máquina do grupo).

## 12. Critérios de avaliação

| Critério | Pontos | Situação |
|---|---|---|
| Estrutura no padrão | 2,0 | Atendido no código |
| As seis telas | 2,0 | Atendido no código |
| find, filter e map | 2,0 | Atendido no código |
| Layout em Flexbox | 1,5 | Atendido no código |
| Relatório | 1,5 | Pendente (grupo) |
| Divisão e apresentação | 1,0 | Pendente (grupo: commits e apresentação) |
| Bônus | +0,5 | Atendido no código |

> **Atenção ao Git:** este pacote é o código pronto. Para a nota da divisão, cada integrante precisa subir **a própria parte em commits próprios** (por exemplo, A sobe `dadosMockados/`, `inicio/` e `resultados/`; B sobe `detalhe/` e `publicar/`; C sobe `css/`, `sessao/`, `conta/` e `naoEncontrada/`; `rotas.js` e `navbar.js` combinados no primeiro dia).
