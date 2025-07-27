import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { tmdbApi, type MovieItem } from '@/api/tmdb';

interface MovieCardProps {
  item: MovieItem;
}

export function MovieCard({ item }: MovieCardProps) {
  const title = item.title || item.name || 'Unknown Title';
  const releaseDate = item.release_date || item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
  const linkPath = mediaType === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`;

  return (
    <Link to={linkPath} className="block">
      <div className="cinema-card min-w-[200px] group">
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={tmdbApi.getImageUrl(item.poster_path)}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Rating Badge */}
          {item.vote_average > 0 && (
            <div className="absolute top-2 right-2 rating-badge px-2 py-1 text-xs flex items-center space-x-1">
              <Star className="h-3 w-3 fill-current" />
              <span>{item.vote_average.toFixed(1)}</span>
            </div>
          )}

          {/* Media Type Badge */}
          <div className="absolute top-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {mediaType.toUpperCase()}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-sm leading-tight mb-2 line-clamp-2 group-hover:text-accent transition-colors">
            {title}
          </h3>
          {year && (
            <p className="text-muted-foreground text-xs">{year}</p>
          )}
        </div>
      </div>
    </Link>
  );
}