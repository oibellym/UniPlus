// Contas do Uni+ (o "Contribuinte" do KiOferta): quem publica precisa entrar.
// Pessoas e e-mails fictícios. Senha igual para todas, só para a demonstração.
// organizacaoId liga a conta à organização em nome da qual ela publica;
// null significa uma pessoa sem organização (iniciativa de moradores).
const usuarios = [
  { id: 1, nome: 'Helena Duarte', email: 'helena@exemplo.com.br', senha: 'uni123', organizacaoId: 1 },
  { id: 2, nome: 'Rafael Okamoto', email: 'rafael@exemplo.com.br', senha: 'uni123', organizacaoId: 2 },
  { id: 3, nome: 'Juliana Prates', email: 'juliana@exemplo.com.br', senha: 'uni123', organizacaoId: 3 },
  { id: 4, nome: 'Marcos Ribeiro', email: 'marcos@exemplo.com.br', senha: 'uni123', organizacaoId: 4 },
  { id: 5, nome: 'Priscila Andrade', email: 'priscila@exemplo.com.br', senha: 'uni123', organizacaoId: 5 },
  { id: 6, nome: 'Bianca Lemos', email: 'bianca@exemplo.com.br', senha: 'uni123', organizacaoId: 6 },
  { id: 7, nome: 'Tiago Nunes', email: 'tiago@exemplo.com.br', senha: 'uni123', organizacaoId: null },
]

export default usuarios
