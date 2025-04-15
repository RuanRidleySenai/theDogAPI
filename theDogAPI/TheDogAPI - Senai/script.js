const apiKey = 'live_LqGfgecz3MSlPctzVOExQZdKOPkVl9N3800SwVFEfalGbA4ratRX4SfKBvqMjs8U';
const searchInput = document.getElementById('searchInput');
const dogImageContainer = document.querySelector('.dog-image');

// Adiciona ou remove dos favoritos
function toggleFavorite(imageUrl, breedName, heartIcon) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const index = favorites.findIndex(fav => fav.imageUrl === imageUrl);

  if (index === -1) {
    favorites.push({ imageUrl, name: breedName });
    localStorage.setItem('favorites', JSON.stringify(favorites));
    heartIcon.classList.remove('fa-regular');
    heartIcon.classList.add('fa-solid');
  } else {
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    heartIcon.classList.remove('fa-solid');
    heartIcon.classList.add('fa-regular');
  }
}

// Busca a raça e mostra a imagem + coração
async function searchDog() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return;

  dogImageContainer.innerHTML = `<p>Carregando...</p>`;

  try {
    const breedRes = await fetch('https://api.thedogapi.com/v1/breeds');
    const breeds = await breedRes.json();
    const match = breeds.find(breed => breed.name.toLowerCase().includes(query));

    if (!match) {
      dogImageContainer.innerHTML = `<p>Raça não encontrada.</p>`;
      return;
    }

    const imgRes = await fetch(`https://api.thedogapi.com/v1/images/search?breed_ids=${match.id}`, {
      headers: { 'x-api-key': apiKey }
    });

    const data = await imgRes.json();
    const imageUrl = data[0]?.url;
    const breedName = match.name;

    if (imageUrl) {
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      const isFavorited = favorites.some(fav => fav.imageUrl === imageUrl);

      dogImageContainer.innerHTML = `
        <img src="${imageUrl}" alt="${breedName}" />
        <p>${breedName}</p>
        <div class="dog-actions">
          <i class="${isFavorited ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
        </div>
      `;

      const heartIcon = document.querySelector('.dog-actions .fa-heart');
      heartIcon.addEventListener('click', () =>
        toggleFavorite(imageUrl, breedName, heartIcon)
      );
    } else {
      dogImageContainer.innerHTML = `<p>Imagem não disponível.</p>`;
    }
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    dogImageContainer.innerHTML = `<p>Erro ao buscar dados da API.</p>`;
  }
}
