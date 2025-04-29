// Salva os dados do usuário no localStorage
export function salvarUsuario(dados) {
    localStorage.setItem('usuario', JSON.stringify(dados));
  }
  
  // Obtém os dados do usuário do localStorage
  export function obterUsuario() {
    const dados = localStorage.getItem('usuario');
    return dados ? JSON.parse(dados) : null;
  }
  
  // Limpa os dados do usuário do localStorage
  export function limparUsuario() {
    localStorage.removeItem('usuario');
  }
  
 
  // Salva o cardápio criado pelo usuário
  export function salvarCardapio(cardapio) {
    localStorage.setItem('cardapio', JSON.stringify(cardapio));
  }
  
  // Obtém o cardápio salvo
  export function obterCardapio() {
    const dados = localStorage.getItem('cardapio');
    return dados ? JSON.parse(dados) : {};
  }
  
  // Limpa o cardápio salvo
  export function limparCardapio() {
    localStorage.removeItem('cardapio');
  }
  