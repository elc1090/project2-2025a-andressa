const apiKey = '463ebfb4f74ff08c172f586bd43b796548539ef9'; 
const apiUrl = 'https://wger.de/api/v2/';

async function buscarExercicios() {
  const query = document.getElementById('buscarExercicio').value.trim().toLowerCase();
  if (!query) return;

  await carregarCategorias();
  await carregarEquipamentos();

  try {
    const res = await fetch(`${apiUrl}exercise/?language=2&limit=100`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${apiKey}`,  
      }
    });

    if (!res.ok) {
      throw new Error('Erro ao buscar exercícios');
    }

    const data = await res.json();

    exerciciosEncontrados = data.results.filter(exercicio => {
      const ativo = exercicio.status === 2; 
      const nome = exercicio.name?.toLowerCase() || '';
      const descricao = exercicio.description?.toLowerCase() || '';
      return ativo && (nome.includes(query) || descricao.includes(query));
    });

    if (exerciciosEncontrados.length === 0) {
      alert('Nenhum exercício encontrado para essa busca. Tente buscar por palavras em inglês (ex: chest, biceps, squat).');
    }

    paginaAtual = 0;
    mostrarResultados();
  } catch (err) {
    console.error('Erro ao buscar exercícios:', err);
  }
}
