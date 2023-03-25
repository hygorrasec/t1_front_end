function searchAnime() {

  // Limpa a tela com informações existentes de buscas anteriores:
  const animeInfo = document.getElementById("id-anime-info");
  animeInfo.innerHTML = '';

  // Remove os espaços antes e depois do texto, substitui espaços por _ (underline), deixando todas as letras minúsculas:
  var searchQuery = document.getElementById("search-bar").value.trim().replace(/\s+/g, '_').toLowerCase();

  // A constante abaixo retorna um array com os dados da busca.
  const apiURL = `https://appanimeplus.tk/play-api.php?search=${searchQuery}`;

  if (searchQuery) {
    fetch(apiURL)
      .then(response => response.json())
      .then(data => {
        // Verifica se não há conteúdo.
        if (data === null) {
          alert('Anime não encontrado.');
        } else {
          const animeList = document.getElementById("id-anime-info");
          data.forEach(anime => {
            const animeId = anime.id;
            const animeTitle = anime.category_name;
            const animeImage = anime.category_image;
            const divElement = document.createElement('div');
            const imgElement = document.createElement('img');
            const titleElement = document.createElement('h4');
        
            // cria div para receber a div do anime
            const fundoPretoDiv = document.createElement('div');
            fundoPretoDiv.className = 'fundo_preto';
        
            // cria a div do anime
            divElement.className = 'card-anime';
            divElement.id = animeId;
            divElement.classList.add("col-md-2", "card");
        
            // adiciona a imagem e o título à div do anime
            imgElement.src = `https://cdn.appanimeplus.tk/img/${animeImage}`;
            divElement.appendChild(imgElement)
            titleElement.innerHTML = animeTitle;
            divElement.appendChild(titleElement)
        
            // adiciona a div do anime à div pai
            fundoPretoDiv.appendChild(divElement);
        
            // adiciona a div pai à lista de animes
            animeList.appendChild(fundoPretoDiv);

            divElement.onclick = () => redirecionarAnime(anime.id)
          });
        }        
      })
      .catch(error => {
        console.error('Ocorreu um erro ao obter informações do anime:', error);
    });
  
    // Limpa o valor da barra de pesquisa.
    document.getElementById("search-bar").value = "";
  } else {
    alert('Digite o nome de um anime para pesquisar.');
  }
}

function redirecionarAnime(id) {
  fetch(`https://appanimeplus.tk/play-api.php?info=${id}`)
    .then(response => response.json())
    .then(data => {
      // Cria o conteúdo do modal com os dados do anime
      const modalTitle = document.querySelector('#animeModal .modal-title');
      modalTitle.innerText = data[0].category_name;
      
      const modalBody = document.querySelector('#animeModal #animeModalBody');
      
      modalBody.innerHTML = `
        <img class="modal-img" src="https://cdn.appanimeplus.tk/img/${data[0].category_image}" alt="${data[0].catecory_name}">
        <p class="mx-4 my-4"><b>Sinopse:</b> ${data[0].category_description}</p>
      `;

      // Faz uma nova requisição para a API de títulos e adiciona na lista do modal
      fetch(`https://appanimeplus.tk/play-api.php?cat_id=${data[0].id}`)
        .then(response => response.json())
        .then(data => {
          const titlesList = document.createElement('ul');
          data.forEach(episode => {
            const episodeId = episode.video_id;
            fetch(`https://appanimeplus.tk/play-api.php?episodios=${episodeId}`)
              .then(response => response.json())
              .then(episodeData => {
                const episodeTitle = episodeData[0].title;
                const episodeLocation = episodeData[0].location;
                const titleItem = document.createElement('li');
                titleItem.innerHTML = `
                  <div class="alert alert-danger mx-4 my-4" role="alert">
                    <h4 class="alert-heading">${episodeTitle}</h4>
                    <hr>
                    <p class="mb-0">
                      <div class="d-grid gap-2">
                        <a class="btn btn-lg btn-outline-danger" href="${episodeLocation}" role="button" target="_blank">Assistir</a>
                      </div>
                    </p>
                  </div>
                `;
                titlesList.appendChild(titleItem);
                // Ordena a lista de títulos pelo episódio
                Array.from(titlesList.children)
                  .sort((a, b) => a.querySelector('h4').innerText.localeCompare(b.querySelector('h4').innerText))
                  .forEach(li => titlesList.appendChild(li));
              })
          })
          modalBody.appendChild(titlesList);
          
        })
        .catch(error => console.error(error));

      // Exibe o modal
      const animeModal = new bootstrap.Modal(document.getElementById('animeModal'));
      animeModal.show();
    })
    .catch(error => console.error(error));
}
