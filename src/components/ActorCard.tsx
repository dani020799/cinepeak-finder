import { Link } from 'react-router-dom';
import { tmdbApi, type PersonItem } from '@/api/tmdb';

interface ActorCardProps {
  person: PersonItem;
}

export function ActorCard({ person }: ActorCardProps) {
  return (
    <Link to={`/actor/${person.id}`} className="block">
      <div className="cinema-card min-w-[150px] group">
        {/* Profile Image */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={tmdbApi.getImageUrl(person.profile_path)}
            alt={person.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-semibold text-sm leading-tight mb-1 group-hover:text-accent transition-colors">
            {person.name}
          </h3>
          {person.character && (
            <p className="text-muted-foreground text-xs line-clamp-2">
              {person.character}
            </p>
          )}
          {person.known_for_department && !person.character && (
            <p className="text-muted-foreground text-xs">
              {person.known_for_department}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}