const API_KEY = 'd5ccdd9bcee8513164db43b9a0431906';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

async function loadBanner() {
  const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=es-ES`);
  const data = await res.json();
  const movies = data.results;
  const selectedMovie = movies[Math.floor(Math.random() * movies.length)];

  document.getElementById('banner').style.backgroundImage = `url('https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}')`;
  document.getElementById('banner-title').innerText = selectedMovie.title || selectedMovie.name;
  document.getElementById('banner-description').innerText = selectedMovie.overview.slice(0, 150) + '...';
}

async function loadMovies(endpoint, elementId) {
  const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=es-ES`);
  const data = await res.json();
  const container = document.getElementById(elementId);

  data.results.forEach(movie => {
    if (movie.poster_path) {
      const img = document.createElement('img');
      img.src = `${IMG_URL}${movie.poster_path}`;
      img.alt = movie.title || movie.name;
      img.classList.add('row_poster');
      
      // Al hacer clic abre el modal con la película seleccionada
      img.addEventListener('click', () => openModal(movie));
      
      container.appendChild(img);
    }
  });
}

async function openModal(movie) {
  const modal = document.getElementById('movie-modal');
  document.getElementById('modal-title').innerText = movie.title || movie.name;
  document.getElementById('modal-description').innerText = movie.overview || 'Sin descripción disponible.';
  
  const trailerContainer = document.getElementById('trailer-container');
  trailerContainer.innerHTML = 'Cargando tráiler...';

  modal.style.display = 'flex';

  // Obtener el video de la API de TMDb
  const res = await fetch(`${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}&language=es-ES`);
  const data = await res.json();
  const trailer = data.results.find(vid => vid.type === 'Trailer' && vid.site === 'YouTube');

  if (trailer) {
    trailerContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${trailer.key}" allowfullscreen></iframe>`;
  } else {
    trailerContainer.innerHTML = '<p>Tráiler no disponible para esta película.</p>';
  }
}

// Cerrar modal
document.querySelector('.close-btn').addEventListener('click', () => {
  document.getElementById('movie-modal').style.display = 'none';
  document.getElementById('trailer-container').innerHTML = '';
});

loadBanner();
loadMovies('/trending/movie/week', 'row-trending');
loadMovies('/movie/popular', 'row-popular');
