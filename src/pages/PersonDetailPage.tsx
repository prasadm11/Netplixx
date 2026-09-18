import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  MapPin, 
  Film, 
  Star, 
  ChevronLeft, 
  ExternalLink,
  Clapperboard
} from 'lucide-react';
import { fetchPersonDetails, getImageUrl } from '../services/tmdb';
import { PersonDetail, MediaItem } from '../types';
import MediaCard from '../components/MediaCard';
import { DetailSkeleton } from '../components/Skeletons';

const PersonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [person, setPerson] = useState<PersonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullBio, setShowFullBio] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'movie' | 'tv'>('all');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    fetchPersonDetails(id)
      .then(data => {
        setPerson(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch person details:', err);
        setError('Could not load cast profile.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-28 px-4 sm:px-8 max-w-7xl mx-auto">
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="min-h-screen bg-black text-[#f5f5f7] pt-32 px-4 text-center flex flex-col items-center justify-center">
        <User className="w-16 h-16 text-zinc-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Person Not Found</h2>
        <p className="text-zinc-400 text-sm mb-6">The requested artist profile could not be loaded.</p>
        <Link
          to="/"
          className="bg-white text-black font-semibold px-6 py-2.5 rounded-full text-xs shadow-apple-button"
        >
          Return Home
        </Link>
      </div>
    );
  }

  // Deduplicate and sort credits by popularity
  const rawCredits = [
    ...(person.combined_credits?.cast || []),
    ...(person.combined_credits?.crew || [])
  ];

  const seen = new Set<string>();
  const credits: MediaItem[] = [];

  for (const c of rawCredits) {
    const key = `${c.media_type || (c.title ? 'movie' : 'tv')}-${c.id}`;
    if (!seen.has(key)) {
      seen.add(key);
      credits.push({
        ...c,
        media_type: (c.media_type || (c.title ? 'movie' : 'tv')) as 'movie' | 'tv'
      });
    }
  }

  // Sort by popularity / vote count
  credits.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

  const filteredCredits = activeTab === 'all'
    ? credits
    : credits.filter(c => c.media_type === activeTab);

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to={-1 as any}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back</span>
        </Link>

        {/* Profile Card / Bio Section */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start mb-16">
          {/* Portrait Image */}
          <div className="w-44 sm:w-56 md:w-64 shrink-0 mx-auto md:mx-0">
            <div className="aspect-[2/3] rounded-3xl overflow-hidden bg-[#161618] border border-white/15 shadow-apple-card relative">
              {person.profile_path ? (
                <img
                  src={getImageUrl(person.profile_path, 'w780')}
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                  <User className="w-20 h-20" />
                </div>
              )}
            </div>

            {/* Quick Facts Below Portrait */}
            <div className="mt-6 space-y-3 text-xs bg-white/[0.03] p-4 rounded-2xl border border-white/[0.08]">
              {person.known_for_department && (
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Known For</span>
                  <span className="text-zinc-200 font-medium">{person.known_for_department}</span>
                </div>
              )}

              {person.birthday && (
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Born</span>
                  <span className="text-zinc-200 font-medium">
                    {new Date(person.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              )}

              {person.place_of_birth && (
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Birthplace</span>
                  <span className="text-zinc-200 font-medium">{person.place_of_birth}</span>
                </div>
              )}

              {person.external_ids?.imdb_id && (
                <div className="pt-1">
                  <a
                    href={`https://www.imdb.com/name/${person.external_ids.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#2997ff] hover:underline font-semibold"
                  >
                    <span>View on IMDb</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Name & Biography */}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight mb-4">
              {person.name}
            </h1>

            {person.biography ? (
              <div className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-3xl space-y-4">
                <p className={showFullBio ? '' : 'line-clamp-6'}>
                  {person.biography}
                </p>
                {person.biography.length > 400 && (
                  <button
                    onClick={() => setShowFullBio(!showFullBio)}
                    className="text-xs font-bold text-[#2997ff] hover:underline block"
                  >
                    {showFullBio ? 'Show Less' : 'Read Full Biography'}
                  </button>
                )}
              </div>
            ) : (
              <p className="text-zinc-400 text-sm italic">No biography currently available for this artist.</p>
            )}
          </div>
        </div>

        {/* Filmography Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <Clapperboard className="w-5 h-5 text-[#2997ff]" />
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight">
                Filmography & Roles
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/10 text-zinc-400">
                {filteredCredits.length}
              </span>
            </div>

            {/* Filter Tabs (All / Movies / Series) */}
            <div className="flex items-center gap-1 bg-white/[0.06] p-1 rounded-full border border-white/10 self-start sm:self-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  activeTab === 'all' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                All Titles
              </button>
              <button
                onClick={() => setActiveTab('movie')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  activeTab === 'movie' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Movies
              </button>
              <button
                onClick={() => setActiveTab('tv')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  activeTab === 'tv' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                TV Series
              </button>
            </div>
          </div>

          {filteredCredits.length === 0 ? (
            <p className="text-zinc-400 text-sm py-12 text-center">No credits found in this category.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {filteredCredits.map(item => (
                <MediaCard key={`${item.media_type}-${item.id}`} item={item} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default PersonDetailPage;
