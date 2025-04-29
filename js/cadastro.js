import { salvarUsuario } from './storage.js';

document.getElementById('form-cadastro').addEventListener('submit', function (e) {
  e.preventDefault();

  const form = new FormData(e.target);

const usuarioSalvo = localStorage.getItem('usuario');
if (usuarioSalvo) {
  alert('Você já possui um cadastro salvo! Se desejar, pode atualizar os dados.');
}
  const usuario = {
    nome: form.get('nome'),
    idade: Number(form.get('idade')),
    sexo: form.get('sexo'),
    peso: Number(form.get('peso')),
    altura: Number(form.get('altura')),
    atividade: parseFloat(form.get('atividade')),
    objetivo: form.get('objetivo'),
  };

  usuario.tmb = calcularTMB(usuario);
  usuario.kcalMeta = calcularMetaCalorica(usuario);

  salvarUsuario(usuario);
  alert(`Cadastro salvo com sucesso!\nMeta calórica: ${usuario.kcalMeta} kcal`);
  window.location.href = '../index.html';
});

function calcularTMB({ sexo, peso, altura, idade }) {
  return sexo === 'masculino'
    ? 10 * peso + 6.25 * altura - 5 * idade + 5
    : 10 * peso + 6.25 * altura - 5 * idade - 161;
}

function calcularMetaCalorica(usuario) {
  let tmb = calcularTMB(usuario);
  let manutencao = tmb * usuario.atividade;

  if (usuario.objetivo === 'Emagrecer') return Math.round(manutencao - 500);
  if (usuario.objetivo === 'Ganhar Massa') return Math.round(manutencao + 500);
  return Math.round(manutencao);
}
