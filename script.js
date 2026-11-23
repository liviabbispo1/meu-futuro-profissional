// Tema claro/escuro (lembra a escolha)
const raiz = document.documentElement, temaBtn = document.getElementById('temaBtn');
function aplicarTema(t){ raiz.dataset.tema = t; temaBtn.textContent = t === 'escuro' ? 'Claro' : 'Escuro'; }
let salvo = null; try { salvo = localStorage.getItem('tema'); } catch(e){}
aplicarTema(salvo || (matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro'));
temaBtn.onclick = () => { const n = raiz.dataset.tema === 'escuro' ? 'claro' : 'escuro'; aplicarTema(n); try{ localStorage.setItem('tema', n); }catch(e){} };

// Menu responsivo / editorial
const menu = document.getElementById('menu'), menuBtn = document.getElementById('menuBtn');
menuBtn.onclick = () => {
  const aberto = menu.classList.toggle('aberto');
  menuBtn.setAttribute('aria-expanded', aberto);
};
menu.onclick = e => {
  if (e.target.tagName === 'A') {
    menu.classList.remove('aberto');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
};

// Abas do Hero (destacam a área correspondente na seção Profissão)
const abas = document.querySelectorAll('.aba');
const cartoes = document.querySelectorAll('.cartao');
abas.forEach(aba => {
  aba.addEventListener('click', () => {
    abas.forEach(a => { a.classList.remove('ativa'); a.setAttribute('aria-selected', 'false'); });
    aba.classList.add('ativa');
    aba.setAttribute('aria-selected', 'true');
    const filtro = aba.dataset.filtro;
    cartoes.forEach(c => {
      c.classList.toggle('oculto', filtro !== 'todos' && c.dataset.area !== filtro);
    });
    if (filtro !== 'todos') {
      document.getElementById('profissao').scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Chips de foco de estudo (destacam habilidades relacionadas)
const chips = document.querySelectorAll('.chip');
const habs = document.querySelectorAll('.hab');
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('ativo'));
    chip.classList.add('ativo');
    const tag = chip.dataset.tag;
    habs.forEach(h => {
      const lista = (h.dataset.tags || '').split(' ');
      h.classList.toggle('atenuada', tag !== 'todos' && !lista.includes(tag));
    });
  });
});

// Linha do tempo expansível
document.querySelectorAll('.etapa').forEach(b => b.onclick = () => {
  const abrir = b.getAttribute('aria-expanded') !== 'true';
  b.setAttribute('aria-expanded', abrir);
  b.nextElementSibling.hidden = !abrir;
});

// Menu destaca a seção atual
const links = document.querySelectorAll('nav a');
document.querySelectorAll('section[id]').forEach(s => new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) links.forEach(a => a.classList.toggle('ativo', a.getAttribute('href') === '#' + s.id));
}), { rootMargin: '-40% 0px -55% 0px' }).observe(s));

// Simulador de juros compostos com gráfico
const brl = v => v.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
document.getElementById('simulador').addEventListener('submit', e => {
  e.preventDefault();
  const n = id => parseFloat(document.getElementById(id).value);
  const ini = n('inicial') || 0, ap = n('aporte') || 0, taxa = n('taxa'), anos = parseInt(document.getElementById('anos').value, 10);
  const saida = document.getElementById('resultado'), graf = document.getElementById('graf');
  if (isNaN(taxa) || isNaN(anos) || anos < 1 || taxa < 0 || ini < 0 || ap < 0) {
    saida.textContent = 'Use valores positivos e prazo de pelo menos 1 ano.';
    return;
  }
  const i = Math.pow(1 + taxa/100, 1/12) - 1;
  let s = ini;
  const pts = [];
  for (let m = 1; m <= anos*12; m++) {
    s = s*(1+i) + ap;
    if (m % 12 === 0) pts.push(s);
  }
  const inv = ini + ap*anos*12;
  saida.innerHTML = `Em ${anos} anos: <strong>${brl(s)}</strong><br>Investido: ${brl(inv)} · Juros ganhos: ${brl(s-inv)}`;
  graf.innerHTML = pts.map(v => `<span style="height:${Math.max(3, v/s*100)}%" title="${brl(v)}"></span>`).join('');
});
