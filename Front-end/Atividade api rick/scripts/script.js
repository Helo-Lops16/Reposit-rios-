const ident = document.querySelector("#app");

async function buscarDados() {
  const resposta = await fetch("https://rickandmortyapi.com/api/character", { method: "GET" });
  const dados = await resposta.json();
  console.log(dados);

  dados.results.forEach((item) => {
    ident.innerHTML += `
      <h1>${item.name}</h1>
      <img src="${item.image}" alt="${item.name}">
    `;
  });
}

buscarDados();