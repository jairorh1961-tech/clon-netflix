const API_KEY = 'd5ccdd9bcee8513164db43b9a0431906';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

// Cargar Banner Principal
async function loadBanner() {
  const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=es-ES`);
  const data = await res.json();
  const movies = data.results;
  const selectedMovie = movies[Math.floor(Math.random() * movies.length)];

  document.getElementById('banner').style.backgroundImage = `url('https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}')`;
  document.getElementById('banner-title').innerText = selectedMovie.title || selectedMovie.name;
  document.getElementById('banner-description').innerText = selectedMovie.overview.slice(0, 150) + '...';
}

// Cargar Carruseles de Películas
async function loadMovies(endpoint, elementId) {
  const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=es-ES`);
  const data = await res.json();
  const container = document.getElementById(elementId);

  data.results.forEach(movie => {
    if (movie.poster_path) {
      const img = document.createElement('img');
      img.src = `${IMG_URL}${movie.poster_path}`;
      img.alt = movie.title || movie.name;
      img.classList.add('row__poster');
      container.appendChild(img);
    }
  });
}

// Ejecutar funciones al cargar la página
loadBanner();
loadMovies('/trending/movie/week', 'row-trending');
loadMovies('/movie/popular', 'row-popular');
