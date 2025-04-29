const appId = '7c88aab3'; 
const appKey = 'c5798d3e4fed51a78ccd6836998448d1';

let refeicoesOrdem = ["Café da Manhã", "Almoço", "Jantar"];
const cardapio = {
  "Café da Manhã": [],
  "Almoço": [],
  "Jantar": []
};

let alimentoSelecionado = null;
const modalRefeicoes = new bootstrap.Modal(document.getElementById('modalRefeicoes'));
const modalNovaRefeicao = new bootstrap.Modal(document.getElementById('modalNovaRefeicao'));

function buscarAlimentos() {
  const query = document.getElementById('buscarAlimento').value;
  if (!query) return;

  fetch(`https://api.edamam.com/api/food-database/v2/parser?app_id=${appId}&app_key=${appKey}&ingr=${query}`)
    .then(response => response.json())
    .then(data => {
      const alimentos = data.hints.slice(0, 5).map(hint => ({
        label: hint.food.label,
        calories: hint.food.nutrients.ENERC_KCAL || 0,
        protein: hint.food.nutrients.PROCNT || 0,
        fat: hint.food.nutrients.FAT || 0,
        carbs: hint.food.nutrients.CHOCDF || 0
      }));
      mostrarResultados(alimentos);
    })
    .catch(error => {
      console.error('Erro na busca de alimentos:', error);
    });
}

function mostrarResultados(alimentos) {
  const div = document.getElementById('resultados');
  div.innerHTML = '';

  alimentos.forEach(alimento => {
    const col = document.createElement('div');
    col.className = 'col-md-6 mb-3';
    col.innerHTML = `
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">${alimento.label}</h5>
          <p class="card-text">Calorias: ${alimento.calories.toFixed(0)} kcal</p>
          <p class="card-text">Proteína: ${alimento.protein.toFixed(1)} g | Gordura: ${alimento.fat.toFixed(1)} g | Carboidratos: ${alimento.carbs.toFixed(1)} g</p>
          <button class="btn btn-primary" onclick='selecionarRefeicao(${JSON.stringify(alimento)})'>Adicionar</button>
        </div>
      </div>
    `;
    div.appendChild(col);
  });
}

function selecionarRefeicao(alimento) {
  alimentoSelecionado = alimento;
  mostrarOpcoesRefeicoes();
  modalRefeicoes.show();
}

function mostrarOpcoesRefeicoes() {
  const div = document.getElementById('opcoesRefeicoes');
  div.innerHTML = '';

  refeicoesOrdem.forEach(refeicao => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-outline-primary w-100 mb-2';
    btn.textContent = refeicao;
    btn.onclick = () => adicionarAlimentoNaRefeicao(refeicao);
    div.appendChild(btn);
  });
}

function adicionarAlimentoNaRefeicao(refeicao) {
  if (alimentoSelecionado) {
    cardapio[refeicao].push(alimentoSelecionado);
    atualizarCardapio();
    atualizarResumo();
    modalRefeicoes.hide();
    alimentoSelecionado = null;
  }
}

function atualizarCardapio() {
  const div = document.getElementById('refeicoes');
  div.innerHTML = '';

  refeicoesOrdem.forEach((refeicao, index) => {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';
    col.innerHTML = `
      <div class="card border-primary h-100">
        <div class="card-header d-flex justify-content-between align-items-center">
          <strong>${refeicao}</strong>
          <div>
            ${index > 0 ? `<button class="btn btn-sm btn-outline-secondary me-1" onclick="moverRefeicao('${refeicao}', -1)">↑</button>` : ''}
            ${index < refeicoesOrdem.length -1 ? `<button class="btn btn-sm btn-outline-secondary" onclick="moverRefeicao('${refeicao}', 1)">↓</button>` : ''}
            <button class="btn btn-sm btn-outline-danger ms-2" onclick="excluirRefeicao('${refeicao}')">Excluir</button>
          </div>
        </div>
        <ul class="list-group list-group-flush">
          ${cardapio[refeicao].length > 0 ? cardapio[refeicao].map((alimento, idx) => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <small>${alimento.label} (${alimento.calories.toFixed(0)} kcal)</small>
              <button class="btn btn-sm btn-danger" onclick="removerAlimento('${refeicao}', ${idx})">X</button>
            </li>
          `).join('') : `
            <li class="list-group-item text-muted text-center">Sem alimentos</li>
          `}
        </ul>
      </div>
    `;
    div.appendChild(col);
  });
}

function removerAlimento(refeicao, index) {
  cardapio[refeicao].splice(index, 1);
  atualizarCardapio();
  atualizarResumo();
}

function excluirRefeicao(refeicao) {
  if (confirm(`Tem certeza que deseja excluir a refeição "${refeicao}"?`)) {
    delete cardapio[refeicao];
    refeicoesOrdem = refeicoesOrdem.filter(r => r !== refeicao);
    atualizarCardapio();
    atualizarResumo();
  }
}

function abrirModalNovaRefeicao() {
  document.getElementById('inputNovaRefeicao').value = '';
  modalNovaRefeicao.show();
}

function criarNovaRefeicao() {
  const nome = document.getElementById('inputNovaRefeicao').value.trim();
  if (nome && !cardapio[nome]) {
    cardapio[nome] = [];
    refeicoesOrdem.push(nome);
    atualizarCardapio();
    modalNovaRefeicao.hide();
  } else {
    alert('Nome inválido ou refeição já existe.');
  }
}

function moverRefeicao(nome, direcao) {
  const idx = refeicoesOrdem.indexOf(nome);
  if (idx >= 0) {
    const novoIdx = idx + direcao;
    if (novoIdx >= 0 && novoIdx < refeicoesOrdem.length) {
      [refeicoesOrdem[idx], refeicoesOrdem[novoIdx]] = [refeicoesOrdem[novoIdx], refeicoesOrdem[idx]];
      atualizarCardapio();
    }
  }
}

function atualizarResumo() {
  let totalCalorias = 0, totalProteina = 0, totalGordura = 0, totalCarbs = 0;

  for (const refeicao of refeicoesOrdem) {
    for (const alimento of cardapio[refeicao]) {
      totalCalorias += alimento.calories;
      totalProteina += alimento.protein;
      totalGordura += alimento.fat;
      totalCarbs += alimento.carbs;
    }
  }

  document.getElementById('resumo').innerHTML = `
    <p><strong>Calorias Totais:</strong> ${totalCalorias.toFixed(0)} kcal</p>
    <p><strong>Proteínas:</strong> ${totalProteina.toFixed(1)} g</p>
    <p><strong>Gorduras:</strong> ${totalGordura.toFixed(1)} g</p>
    <p><strong>Carboidratos:</strong> ${totalCarbs.toFixed(1)} g</p>
  `;
}


atualizarCardapio();
