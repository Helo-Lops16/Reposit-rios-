const apiUrl = 'https://rickandmortyapi.com/api/character/';
const grid = document.getElementById('grid');
const empty = document.getElementById('empty');
const atualizarBtn = document.querySelector('header button');
const searchInput = document.querySelector('.pesquisar input[placeholder="Buscar por nome"]');
const modal = document.getElementById('modalBackdrop');
const modalContent = modal.querySelector('div');
const closeModalBtn = modal.querySelector('button');
const closeModalXBtn = document.getElementById('modalCloseX');

function traduzirStatus(status) {
  const traducoes = {
    Alive: 'Vivo',
    Dead: 'Morto',
    unknown: 'Desconhecido'
  };
  return traducoes[status] || status;
}

function traduzirGenero(genero) {
  const traducoes = {
    Female: 'Feminino',
    Male: 'Masculino',
    Genderless: 'Sem Gênero',
    unknown: 'Desconhecido'
  };
  return traducoes[genero] || genero;
}

function traduzirEspecie(especie) {
  const traducoes = {
    Human: 'Humano',
    Alien: 'Alienígena',
    Humanoid: 'Humanoide',
    Robot: 'Robô',
    Cronenberg: 'Cronenberg',
    Animal: 'Animal',
    Disease: 'Doença',
    unknown: 'Desconhecido'
  };
  return traducoes[especie] || especie;
}

function getFilters() {
  return {
    name: searchInput.value,
    status: document.querySelector('input[name="status"]:checked').value,
    gender: document.querySelector('input[name="gender"]:checked').value,
    species: document.querySelector('input[name="species"]:checked').value,
  };
}

function limparSelecao() {
  searchInput.value = '';
  document.getElementById('status-todos').checked = true;
  document.getElementById('gender-all').checked = true;
  document.getElementById('species-all').checked = true;
  carregarPersonagens();
}

async function carregarPersonagens() {
  const { name, status, gender, species } = getFilters();
  let url = `${apiUrl}?`;

  if (name) url += `name=${encodeURIComponent(name)}&`;
  if (status !== 'Todos') url += `status=${status}&`;
  if (gender !== 'All') url += `gender=${gender}&`;
  if (species !== 'All') url += `species=${species}&`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      grid.innerHTML = '';
      empty.style.display = 'block';
      return;
    }

    empty.style.display = 'none';
    grid.innerHTML = '';
    data.results.forEach(personagem => {
      const div = document.createElement('div');
      div.classList.add('personagem');
      div.innerHTML = `
        <img src="${personagem.image}" alt="${personagem.name}" />
        <h3>${personagem.name}</h3>
        <p>${traduzirEspecie(personagem.species)} - ${traduzirStatus(personagem.status)}</p>
      `;
      div.addEventListener('click', () => mostrarModal(personagem));
      grid.appendChild(div);
    });

  } catch (e) {
    grid.innerHTML = '';
    empty.style.display = 'block';
  }
}

function mostrarModal(personagem) {
  const spans = modal.querySelectorAll('span');
  const episodiosDiv = document.getElementById('episodiosList');

  modalContent.querySelector('h2').textContent = personagem.name;
  spans[0].textContent = traduzirStatus(personagem.status);
  spans[1].textContent = traduzirEspecie(personagem.species);
  spans[2].textContent = traduzirGenero(personagem.gender);
  spans[3].textContent = personagem.origin.name;
  spans[4].textContent = personagem.location.name;

  episodiosDiv.innerHTML = '';
  personagem.episode.slice(0, 5).forEach(async url => {
    const res = await fetch(url);
    const ep = await res.json();
    const epDiv = document.createElement('div');
    epDiv.textContent = `${ep.episode} - ${ep.name}`;
    episodiosDiv.appendChild(epDiv);
  });

  modal.style.display = 'flex';
}

closeModalBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

closeModalXBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

document.querySelectorAll('input').forEach(input => {
  input.addEventListener('change', carregarPersonagens);
});
searchInput.addEventListener('input', carregarPersonagens);
atualizarBtn.addEventListener('click', carregarPersonagens);

window.limparSelecao = limparSelecao;

carregarPersonagens();
