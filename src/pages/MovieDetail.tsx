import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Calendar, Clock, Play } from 'lucide-react';
import { tmdbApi, type PersonItem } from '@/api/tmdb';
import { ActorCard } from '@/components/ActorCard';
import { CarouselRow } from '@/components/CarouselRow';
import { RatingModal } from '@/components/RatingModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  genres: { id: number; name: string }[];
}

export function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<PersonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [userRating, setUserRating] = useState<number | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        const [movieData, creditsData] = await Promise.all([
          tmdbApi.getMovieDetails(id),
          tmdbApi.getMovieCredits(id),
        ]);

        setMovie(movieData);
        setCast(creditsData.cast?.slice(0, 20) || []);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleRate = (rating: number) => {
    setUserRating(rating);
    // In a real app, this would save to backend
    console.log(`Rated movie ${id} with ${rating} stars`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Movie not found</p>
      </div>
    );
  }

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-[70vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(${tmdbApi.getBackdropUrl(movie.backdrop_path)})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/60 to-black/40" />
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-12">
          <div className="flex flex-col md:flex-row items-start md:items-end space-y-6 md:space-y-0 md:space-x-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              <img
                src={tmdbApi.getImageUrl(movie.poster_path)}
                alt={movie.title}
                className="w-64 rounded-lg shadow-2xl"
              />
            </div>

            {/* Movie Info */}
            <div className="flex-1 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>
              
              <div className="flex flex-wrap items-center space-x-6 mb-4 text-lg">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-accent fill-accent" />
                  <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>

              <p className="text-lg leading-relaxed mb-6 max-w-3xl opacity-90">
                {movie.overview}
              </p>

              <div className="flex space-x-4">
                <Button size="lg" className="bg-gradient-to-r from-accent to-cinema-gold text-black font-semibold">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Trailer
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setRatingModalOpen(true)}
                  className="border-white text-white hover:bg-white hover:text-black"
                >
                  <Star className="mr-2 h-5 w-5" />
                  Rate Movie
                </Button>
              </div>

              {userRating && (
                <div className="mt-4 flex items-center space-x-2 text-accent">
                  <Star className="h-5 w-5 fill-current" />
                  <span>You rated this {userRating}/10</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CarouselRow title="Cast" id="cast-carousel">
          {cast.map((person) => (
            <ActorCard key={person.id} person={person} />
          ))}
        </CarouselRow>
      </div>

      <RatingModal
        isOpen={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        onRate={handleRate}
        title={movie.title}
        currentRating={userRating}
      />
    </div>
  );
}