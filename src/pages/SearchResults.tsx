import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { tmdbApi, type MovieItem, type PersonItem } from '@/api/tmdb';
import { MovieCard } from '@/components/MovieCard';
import { ActorCard } from '@/components/ActorCard';
import { Loader2, Search } from 'lucide-react';

interface SearchResult extends MovieItem {
  media_type: 'movie' | 'tv' | 'person';
  profile_path?: string;
}

export function SearchResults() {
  const location = useLocation();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('q') || '';
    const searchType = searchParams.get('type') || 'multi';
    
    setQuery(searchQuery);

    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        const data = await tmdbApi.searchMulti(searchQuery);
        setResults(data.results || []);
      } catch (error) {
        console.error('Error searching:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchResults();
  }, [location.search]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <span className="text-lg">Searching...</span>
        </div>
      </div>
    );
  }

  const movieResults = results.filter(item => item.media_type === 'movie');
  const tvResults = results.filter(item => item.media_type === 'tv');
  const personResults = results.filter(item => item.media_type === 'person');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <Search className="h-6 w-6 text-accent" />
          <h1 className="text-3xl font-bold">
            Search Results for "{query}"
          </h1>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No results found</h2>
            <p className="text-muted-foreground">
              Try searching with different keywords or check your spelling.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Movies */}
            {movieResults.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6 text-accent">
                  Movies ({movieResults.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {movieResults.map((movie) => (
                    <MovieCard key={movie.id} item={movie} />
                  ))}
                </div>
              </section>
            )}

            {/* TV Shows */}
            {tvResults.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6 text-accent">
                  TV Shows ({tvResults.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {tvResults.map((show) => (
                    <MovieCard key={show.id} item={show} />
                  ))}
                </div>
              </section>
            )}

            {/* People */}
            {personResults.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6 text-accent">
                  People ({personResults.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6">
                  {personResults.map((person) => (
                    <ActorCard 
                      key={person.id} 
                      person={{
                        id: person.id,
                        name: person.name || '',
                        profile_path: person.profile_path,
                        known_for_department: 'Acting'
                      }} 
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}