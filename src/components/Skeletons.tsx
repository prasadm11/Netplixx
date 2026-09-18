import React from 'react';

export const ShimmerEffect: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative overflow-hidden bg-white/[0.04] rounded-2xl ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
  </div>
);

export const MediaCardSkeleton: React.FC = () => (
  <div className="flex flex-col gap-2.5">
    <div className="aspect-[2/3] w-full rounded-2xl bg-white/[0.05] relative overflow-hidden border border-white/[0.05]">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
    </div>
    <div className="h-4 bg-white/[0.06] rounded-md w-3/4 animate-pulse" />
    <div className="h-3 bg-white/[0.04] rounded-md w-1/2 animate-pulse" />
  </div>
);

export const HeroSkeleton: React.FC = () => (
  <div className="relative h-[80vh] min-h-[550px] max-h-[750px] w-full overflow-hidden bg-[#0a0a0c] border-b border-white/[0.05]">
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
    <div className="absolute bottom-16 left-6 sm:left-12 max-w-xl w-full flex flex-col gap-4">
      <div className="h-6 w-28 bg-white/[0.08] rounded-full animate-pulse" />
      <div className="h-12 w-4/5 bg-white/[0.1] rounded-2xl animate-pulse" />
      <div className="h-4 w-full bg-white/[0.06] rounded-lg animate-pulse" />
      <div className="h-4 w-2/3 bg-white/[0.05] rounded-lg animate-pulse" />
      <div className="flex gap-3 pt-3">
        <div className="h-12 w-36 bg-white/[0.12] rounded-2xl animate-pulse" />
        <div className="h-12 w-36 bg-white/[0.06] rounded-2xl animate-pulse" />
      </div>
    </div>
  </div>
);

export const MovieRowSkeleton: React.FC<{ title?: string }> = ({ title }) => (
  <div className="py-7 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <div className="flex items-center justify-between mb-4">
      {title ? (
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">{title}</h2>
      ) : (
        <div className="h-6 w-48 bg-white/[0.08] rounded-lg animate-pulse" />
      )}
      <div className="h-4 w-16 bg-white/[0.05] rounded-md animate-pulse" />
    </div>
    <div className="flex gap-4 overflow-hidden py-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="w-36 sm:w-44 md:w-48 lg:w-52 shrink-0">
          <MediaCardSkeleton />
        </div>
      ))}
    </div>
  </div>
);

export const MediaGridSkeleton: React.FC<{ count?: number }> = ({ count = 18 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <MediaCardSkeleton key={i} />
    ))}
  </div>
);

export const DetailSkeleton: React.FC = () => (
  <div className="min-h-screen bg-black text-[#f5f5f7]">
    {/* Apple TV Full-Bleed Hero Skeleton */}
    <div className="relative w-full h-[88vh] min-h-[560px] bg-[#0c0c0e] overflow-hidden flex flex-col justify-between p-6 sm:p-10">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

      {/* Top Bar Skeleton */}
      <div className="relative z-10 flex justify-between items-center w-full max-w-[1720px] mx-auto">
        <div className="w-11 h-11 rounded-full bg-white/[0.08] animate-pulse" />
        <div className="flex gap-3">
          <div className="w-11 h-11 rounded-full bg-white/[0.08] animate-pulse" />
          <div className="w-11 h-11 rounded-full bg-white/[0.08] animate-pulse" />
        </div>
      </div>

      {/* Bottom Content Skeleton */}
      <div className="relative z-10 w-full max-w-[1720px] mx-auto pb-6">
        <div className="max-w-2xl flex flex-col gap-4">
          <div className="h-6 w-36 bg-white/[0.1] rounded-full animate-pulse" />
          <div className="h-14 sm:h-16 w-3/4 bg-white/[0.12] rounded-2xl animate-pulse" />
          <div className="flex gap-2">
            <div className="h-4 w-16 bg-white/[0.06] rounded-md animate-pulse" />
            <div className="h-4 w-28 bg-white/[0.06] rounded-md animate-pulse" />
            <div className="h-4 w-12 bg-white/[0.06] rounded-md animate-pulse" />
          </div>
          <div className="h-4 w-full bg-white/[0.05] rounded-lg animate-pulse mt-1" />
          <div className="h-4 w-4/5 bg-white/[0.05] rounded-lg animate-pulse" />
          <div className="flex gap-2">
            <div className="h-5 w-12 bg-white/[0.06] rounded-md animate-pulse" />
            <div className="h-5 w-20 bg-white/[0.06] rounded-md animate-pulse" />
            <div className="h-5 w-20 bg-white/[0.06] rounded-md animate-pulse" />
          </div>
          <div className="flex gap-4 mt-3">
            <div className="h-12 w-40 bg-white/[0.2] rounded-full animate-pulse" />
            <div className="h-12 w-36 bg-white/[0.08] rounded-full animate-pulse" />
            <div className="w-12 h-12 rounded-full bg-white/[0.08] animate-pulse" />
          </div>
        </div>
      </div>
    </div>

    {/* Shelves Skeleton */}
    <div className="max-w-[1720px] mx-auto px-4 sm:px-8 py-10 space-y-10">
      <div>
        <div className="h-7 w-44 bg-white/[0.08] rounded-lg animate-pulse mb-5" />
        <div className="flex gap-5 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-80 aspect-video rounded-2xl bg-white/[0.05] shrink-0 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const ShortsSkeleton: React.FC = () => (
  <div className="min-h-screen bg-black pt-20 pb-10 flex items-center justify-center relative text-white">
    <div className="w-full max-w-[420px] aspect-[9/16] max-h-[82vh] bg-[#121214] rounded-3xl overflow-hidden border border-white/[0.12] relative flex flex-col justify-between p-6">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
      <div className="flex justify-between items-center z-10">
        <div className="h-5 w-28 bg-white/[0.08] rounded-full animate-pulse" />
        <div className="w-9 h-9 rounded-full bg-white/[0.08] animate-pulse" />
      </div>
      <div className="z-10 flex flex-col gap-3">
        <div className="h-4 w-24 bg-white/[0.08] rounded-md animate-pulse" />
        <div className="h-6 w-3/4 bg-white/[0.1] rounded-xl animate-pulse" />
        <div className="h-3 w-full bg-white/[0.06] rounded animate-pulse" />
        <div className="h-12 w-full bg-white/[0.15] rounded-2xl animate-pulse mt-2" />
      </div>
    </div>
  </div>
);
