# Uni+

**Tema sorteado:** Mutirões e voluntariado
**Disciplina:** Análise e Desenvolvimento de Sistemas · FATEC Mogi das Cruzes
**Desafio 1:** o mesmo esqueleto, outro negócio

> **A pergunta que o Uni+ responde:** Qual multirão perto de mim precisa de ajuda neste fim de semana?

A ação social não encontra voluntário, e o voluntário não encontra a ação. No Uni+, uma organização publica um mutirão (com data, local e o que precisa), e quem quer ajudar procura e compara pelo número que decide: **quantos voluntários ainda faltam**.

## Integrantes

| Integrante | GitHub | Responsabilidade principal |
|---|---|---|
| Isabelly | @oibellym | Dados e descoberta (dados mockados, início, resultados) |
| Nicholas | @grusnicholas-ctrl| Detalhe e publicação (detalhe, publicar, validações, aviso de repetido) |
| Thamires| @Thamyu | Conta e fundação (tokens, base, sessão, conta, rota inexistente, relatório) |

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


