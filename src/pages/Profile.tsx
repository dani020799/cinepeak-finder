import { useState, useEffect } from 'react';
import { User, Star, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { tmdbApi, type MovieItem } from '@/api/tmdb';
import { MovieCard } from '@/components/MovieCard';
import { CarouselRow } from '@/components/CarouselRow';

interface UserProfile {
  name: string;
  email: string;
  memberSince: string;
  totalRatings: number;
}

export function Profile() {
  const [profile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    memberSince: '2024',
    totalRatings: 0,
  });

  const [ratedMovies] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<MovieItem[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const getRecommendations = async () => {
    setLoadingRecommendations(true);
    try {
      // Since we don't have real user data, we'll get trending movies as "recommendations"
      const data = await tmdbApi.getTrending();
      setRecommendations(data.results?.slice(0, 20) || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    // Auto-load some initial recommendations
    getRecommendations();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="cinema-card">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-accent to-cinema-gold rounded-full flex items-center justify-center">
                    <User className="h-12 w-12 text-black" />
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2 gradient-text">{profile.name}</h1>
                  <p className="text-muted-foreground mb-4">{profile.email}</p>
                  
                  <div className="flex flex-wrap gap-4">
                    <Badge variant="secondary" className="flex items-center space-x-2">
                      <Star className="h-4 w-4" />
                      <span>{profile.totalRatings} Ratings</span>
                    </Badge>
                    <Badge variant="outline" className="border-accent text-accent">
                      Member since {profile.memberSince}
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Button 
                    onClick={getRecommendations}
                    disabled={loadingRecommendations}
                    className="bg-gradient-to-r from-accent to-cinema-gold text-black font-semibold"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {loadingRecommendations ? 'Loading...' : 'Get Recommendations'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Rated Movies */}
            <Card className="cinema-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-accent" />
                  <span>Your Ratings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ratedMovies.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No ratings yet</h3>
                    <p className="text-muted-foreground">
                      Start rating movies and TV shows to build your profile and get better recommendations!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {ratedMovies.map((movie) => (
                      <MovieCard key={movie.id} item={movie} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <Card className="cinema-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    <span>Recommended for You</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CarouselRow title="" id="recommendations-carousel">
                    {recommendations.map((movie) => (
                      <MovieCard key={movie.id} item={movie} />
                    ))}
                  </CarouselRow>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card className="cinema-card">
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Movies Rated</span>
                  <Badge variant="secondary">{profile.totalRatings}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Average Rating</span>
                  <Badge variant="secondary">N/A</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Favorite Genre</span>
                  <Badge variant="secondary">Unknown</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="cinema-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Star className="mr-2 h-4 w-4" />
                  View Watchlist
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Discover New
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}