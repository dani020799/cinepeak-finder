const API_KEY = '2e07ce71cc9f7b5a418b824c87bcb76f';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const tmdbApi = {
  // Trending content
  getTrending: async () => {
    const response = await fetch(`${BASE_URL}/trending/all/day?api_key=${API_KEY}`);
    return response.json();
  },

  // Popular movies
  getPopularMovies: async () => {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    return response.json();
  },

  // Free to watch
  getFreeToWatch: async () => {
    const response = await fetch(`${BASE_URL}/discover/movie?with_watch_monetization_types=free&api_key=${API_KEY}`);
    return response.json();
  },

  // Search
  searchMulti: async (query: string) => {
    const response = await fetch(`${BASE_URL}/search/multi?query=${encodeURIComponent(query)}&api_key=${API_KEY}`);
    return response.json();
  },

  // Movie details
  getMovieDetails: async (id: string) => {
    const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
    return response.json();
  },

  // TV details
  getTVDetails: async (id: string) => {
    const response = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}`);
    return response.json();
  },

  // Movie credits
  getMovieCredits: async (id: string) => {
    const response = await fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`);
    return response.json();
  },

  // TV credits
  getTVCredits: async (id: string) => {
    const response = await fetch(`${BASE_URL}/tv/${id}/credits?api_key=${API_KEY}`);
    return response.json();
  },

  // Person details
  getPersonDetails: async (id: string) => {
    const response = await fetch(`${BASE_URL}/person/${id}?api_key=${API_KEY}`);
    return response.json();
  },

  // Person combined credits
  getPersonCredits: async (id: string) => {
    const response = await fetch(`${BASE_URL}/person/${id}/combined_credits?api_key=${API_KEY}`);
    return response.json();
  },

  // Image URLs
  getImageUrl: (path: string, size: string = 'w500') => {
    if (!path) return '/placeholder.svg';
    return `${IMAGE_BASE_URL}/${size}${path}`;
  },

  getBackdropUrl: (path: string) => {
    if (!path) return '/placeholder.svg';
    return `${IMAGE_BASE_URL}/original${path}`;
  }
};

export type MovieItem = {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  overview: string;
  media_type?: 'movie' | 'tv' | 'person';
  genre_ids?: number[];
};

export type PersonItem = {
  id: number;
  name: string;
  profile_path?: string;
  character?: string;
  job?: string;
  known_for_department?: string;
};