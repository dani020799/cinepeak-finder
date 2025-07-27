import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Calendar, Tv, Play } from 'lucide-react';
import { tmdbApi, type PersonItem } from '@/api/tmdb';
import { ActorCard } from '@/components/ActorCard';
import { CarouselRow } from '@/components/CarouselRow';
import { RatingModal } from '@/components/RatingModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface TVDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  last_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
  vote_average: number;
  genres: { id: number; name: string }[];
  status: string;
}

export function TVDetail() {
  const { id } = useParams<{ id: string }>();
  const [show, setShow] = useState<TVDetails | null>(null);
  const [cast, setCast] = useState<PersonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [userRating, setUserRating] = useState<number | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        const [showData, creditsData] = await Promise.all([
          tmdbApi.getTVDetails(id),
          tmdbApi.getTVCredits(id),
        ]);

        setShow(showData);
        setCast(creditsData.cast?.slice(0, 20) || []);
      } catch (error) {
        console.error('Error fetching TV details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleRate = (rating: number) => {
    setUserRating(rating);
    console.log(`Rated TV show ${id} with ${rating} stars`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>TV show not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-[70vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(${tmdbApi.getBackdropUrl(show.backdrop_path)})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/60 to-black/40" />
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-12">
          <div className="flex flex-col md:flex-row items-start md:items-end space-y-6 md:space-y-0 md:space-x-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              <img
                src={tmdbApi.getImageUrl(show.poster_path)}
                alt={show.name}
                className="w-64 rounded-lg shadow-2xl"
              />
            </div>

            {/* Show Info */}
            <div className="flex-1 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{show.name}</h1>
              
              <div className="flex flex-wrap items-center space-x-6 mb-4 text-lg">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-accent fill-accent" />
                  <span className="font-semibold">{show.vote_average.toFixed(1)}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>{new Date(show.first_air_date).getFullYear()}</span>
                  {show.status !== 'Ended' && <span>- Present</span>}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Tv className="h-5 w-5" />
                  <span>{show.number_of_seasons} Season{show.number_of_seasons !== 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {show.genres.map((genre) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
                <Badge variant="outline" className="border-accent text-accent">
                  {show.status}
                </Badge>
              </div>

              <p className="text-lg leading-relaxed mb-6 max-w-3xl opacity-90">
                {show.overview}
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
                  Rate Show
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
        title={show.name}
        currentRating={userRating}
      />
    </div>
  );
}