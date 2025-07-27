import { useState, useEffect } from 'react';
import { tmdbApi, type MovieItem } from '@/api/tmdb';
import { MovieCard } from '@/components/MovieCard';
import { CarouselRow } from '@/components/CarouselRow';
import { Loader2 } from 'lucide-react';

export function Homepage() {
  const [trending, setTrending] = useState<MovieItem[]>([]);
  const [popular, setPopular] = useState<MovieItem[]>([]);
  const [freeToWatch, setFreeToWatch] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingData, popularData, freeData] = await Promise.all([
          tmdbApi.getTrending(),
          tmdbApi.getPopularMovies(),
          tmdbApi.getFreeToWatch(),
        ]);

        setTrending(trendingData.results || []);
        setPopular(popularData.results || []);
        setFreeToWatch(freeData.results || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <span className="text-lg">Loading amazing content...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-cinema-dark to-cinema-darker flex items-center">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Welcome to CineMatch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover your next favorite movie or TV show with personalized recommendations powered by TMDB
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Trending Today */}
        <CarouselRow title="Trending Today" id="trending-carousel">
          {trending.map((item) => (
            <MovieCard key={item.id} item={item} />
          ))}
        </CarouselRow>

        {/* What's Popular */}
        <CarouselRow title="What's Popular" id="popular-carousel">
          {popular.map((item) => (
            <MovieCard key={item.id} item={item} />
          ))}
        </CarouselRow>

        {/* Free to Watch */}
        <CarouselRow title="Free to Watch" id="free-carousel">
          {freeToWatch.map((item) => (
            <MovieCard key={item.id} item={item} />
          ))}
        </CarouselRow>
      </div>
    </div>
  );
}