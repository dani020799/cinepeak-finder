import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { tmdbApi, type MovieItem } from '@/api/tmdb';
import { MovieCard } from '@/components/MovieCard';
import { CarouselRow } from '@/components/CarouselRow';
import { Loader2 } from 'lucide-react';

interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  profile_path: string;
  birthday: string;
  place_of_birth: string;
  known_for_department: string;
}

interface CombinedCredits {
  cast: MovieItem[];
  crew: MovieItem[];
}

export function ActorPage() {
  const { id } = useParams<{ id: string }>();
  const [person, setPerson] = useState<PersonDetails | null>(null);
  const [credits, setCredits] = useState<CombinedCredits | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        const [personData, creditsData] = await Promise.all([
          tmdbApi.getPersonDetails(id),
          tmdbApi.getPersonCredits(id),
        ]);

        setPerson(personData);
        setCredits(creditsData);
      } catch (error) {
        console.error('Error fetching person details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Person not found</p>
      </div>
    );
  }

  const knownFor = credits?.cast
    ?.sort((a, b) => b.vote_average - a.vote_average)
    ?.slice(0, 20) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-cinema-dark to-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start space-y-8 lg:space-y-0 lg:space-x-12">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <img
                src={tmdbApi.getImageUrl(person.profile_path, 'w500')}
                alt={person.name}
                className="w-80 rounded-lg shadow-2xl mx-auto"
              />
            </div>

            {/* Person Info */}
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 gradient-text">
                {person.name}
              </h1>
              
              <div className="space-y-4 mb-8">
                {person.known_for_department && (
                  <div>
                    <h3 className="text-lg font-semibold text-accent mb-2">Known For</h3>
                    <p className="text-muted-foreground">{person.known_for_department}</p>
                  </div>
                )}

                {person.birthday && (
                  <div>
                    <h3 className="text-lg font-semibold text-accent mb-2">Born</h3>
                    <p className="text-muted-foreground">
                      {new Date(person.birthday).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      {person.place_of_birth && ` in ${person.place_of_birth}`}
                    </p>
                  </div>
                )}
              </div>

              {person.biography && (
                <div>
                  <h3 className="text-lg font-semibold text-accent mb-4">Biography</h3>
                  <div className="prose prose-invert max-w-none">
                    {person.biography.split('\n').map((paragraph, index) => (
                      <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Known For Section */}
      {knownFor.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <CarouselRow title="Known For" id="known-for-carousel">
            {knownFor.map((item) => (
              <MovieCard key={`${item.id}-${item.media_type}`} item={item} />
            ))}
          </CarouselRow>
        </div>
      )}
    </div>
  );
}