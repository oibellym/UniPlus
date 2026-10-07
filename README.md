# Uni+

**Tema sorteado:** Mutirões e voluntariado
**Disciplina:** Análise e Desenvolvimento de Sistemas · FATEC Mogi das Cruzes
**Desafio 1:** o mesmo esqueleto, outro negócio

> **A pergunta que o Uni+ responde:** onde a minha ajuda faz mais falta, em uma data em que eu consigo ir?

A ação social não encontra voluntário, e o voluntário não encontra a ação. No Uni+, uma organização publica um mutirão (com data, local e o que precisa), e quem quer ajudar procura e compara pelo número que decide: **quantos voluntários ainda faltam**.

## Integrantes

| Integrante | GitHub | Responsabilidade principal |
|---|---|---|
| _Nome do integrante A_ | @usuario-a | Dados e descoberta (dados mockados, início, resultados) |
| _Nome do integrante B_ | @usuario-b | Detalhe e publicação (detalhe, publicar, validações, aviso de repetido) |
| _Nome do integrante C_ | @usuario-c | Conta e fundação (tokens, base, sessão, conta, rota inexistente) |

## Como rodar

Pré-requisito: [Node.js](https://nodejs.org/) LTS (o npm vem junto).

```bash
npm install
npm run dev
```

O Vite mostra o endereço no terminal (normalmente `http://localhost:5173`). Para testar como no celular, abra o DevTools e use a largura de **360px**.

Outros comandos:

```bash
npm run build     # gera a pasta dist/ (usada também pelo Capacitor)
npm run preview   # serve o build de produção localmente
```

### Contas de demonstração

Todas com a senha `uni123`. A lista também aparece na tela **Conta**, em "Contas de demonstração".

| E-mail | Publica em nome de |
|---|---|
| helena@exemplo.com.br | Instituto SOPA |
| rafael@exemplo.com.br | Associação do Voluntariado |
| juliana@exemplo.com.br | AVOSC |
| marcos@exemplo.com.br | LBV Mogi das Cruzes |
| priscila@exemplo.com.br | ABRAC |
| bianca@exemplo.com.br | Mogi Solidária |
| tiago@exemplo.com.br | sem organização (conta sem publicações, mostra o estado vazio) |

## As seis telas

| # | Tela | Endereço | No menu |
|---|---|---|---|
| 1 | Início | `#inicio` | Início |
| 2 | Resultados | `#resultados?termo=sopa&categoria=Saúde&ordem=data` | Mutirões |
| 3 | Detalhe | `#detalhe?id=3` | não (label vazio) |
| 4 | Publicar | `#publicar` | Publicar |
| 5 | Minha conta | `#conta` | Conta |
| 6 | Rota inexistente | qualquer outro endereço (`#nao-encontrada`) | não (label vazio) |

O roteador separa o caminho (`#detalhe`) da consulta (`?id=3`), procura o caminho na lista de rotas com `find` e passa a consulta para a tela. Por isso o F5 em qualquer endereço reabre a mesma tela, com a mesma busca ou o mesmo mutirão.

## Estrutura

```
src/
├── index.html                 uma página só, com #app e o #navbar
├── css/
│   ├── tokens.css             cores, tinta, superfícies, tipografia e espaçamento
│   ├── base.css               reset e regras do site inteiro
│   └── style.css              importa os dois anteriores
└── js/
    ├── main.js                roteador: hashchange e find na lista de rotas
    ├── rotas/rotas.js         a lista única de telas
    ├── navbar/
    │   ├── navbar.js          menu gerado a partir da lista de rotas
    │   └── navbar.css
    ├── sessao/sessao.js       entrar, sair e usuarioAtual
    ├── util/formatos.js       normalizar texto, datas, "faltam", escapar HTML, ícones
    ├── dadosMockados/
    │   ├── mutiroes.js        15 mutirões (os registros)
    │   ├── organizacoes.js    6 organizações (quem oferece)
    │   ├── usuarios.js        7 contas (quem publica)
    │   └── categorias.js      6 tipos de ajuda
    └── paginas/
        ├── inicio/            inicio.js + inicio.css
        ├── resultados/        resultados.js + resultados.css
        ├── detalhe/           detalhe.js + detalhe.css
        ├── publicar/          publicar.js + publicar.css
        ├── conta/             conta.js + conta.css
        └── naoEncontrada/     naoEncontrada.js + naoEncontrada.css
docs/
├── CHECKLIST.md               conferência das exigências do desafio
└── (relatório em PDF, a ser incluído)
```

## Mapa de equivalência

| No KiOferta | No Uni+ | Exemplo |
|---|---|---|
| Produto | O tipo de ajuda que a pessoa procura | Alimentação: servir sopa |
| Oferta | Um mutirão publicado | Sopa solidária de sábado, das 8h às 13h |
| Mercado | A organização e o local | Instituto SOPA, na Vila Industrial |
| Preço | Quantos voluntários ainda faltam | Faltam 9 de 15 |
| Distância | Em quantos dias acontece | Em 3 dias |
| Contribuinte | A organização com conta, que publica | Helena, pelo Instituto SOPA |
| Visitante | Quem procura onde ajudar, sem cadastro | Aluno que quer ajudar no sábado |

## Sobre os dados

Tudo é mockado e vive na memória: nada sobrevive a um F5, nem o login nem o que for publicado. As datas dos mutirões são calculadas a partir do dia em que o app abre, para a demonstração nunca mostrar ações vencidas.

Nomes, focos e contatos das organizações vêm de informações públicas de instituições de Mogi das Cruzes. **Os mutirões, as pessoas e os e-mails são fictícios**, criados apenas para este exercício.

## Regras do desafio seguidas

Sem backend, sem framework de CSS ou JavaScript, sem CSS Grid. Todo o layout é Flexbox, nenhum filho de contêiner flex tem `width` ou `height` fixo (quando o tamanho importa, usa `flex: 0 0 <medida>`), todas as cores vêm de `tokens.css`, e a cor de destaque aparece em um único papel por tela. A conferência completa está em [docs/CHECKLIST.md](docs/CHECKLIST.md).

## App nativo (Capacitor)

O projeto mantém a base do Capacitor herdada do KiOferta. Depois de `npm run build`, adicione a plataforma (`npx cap add android`) e sincronize (`npx cap sync`). Consulte a [documentação do Capacitor](https://capacitorjs.com/docs).
