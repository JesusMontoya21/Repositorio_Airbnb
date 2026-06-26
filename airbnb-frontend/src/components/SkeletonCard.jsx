export function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-64 animate-pulse">
      <div className="h-48 rounded-xl bg-gray-200 mb-3"></div>
      <div className="px-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  );
}

export function SkeletonGridCard() {
  return (
    <div className="animate-pulse">
      <div className="h-48 rounded-xl bg-gray-200 mb-3"></div>
      <div className="px-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  );
}

export function SkeletonCarouselRow({ title = true }) {
  return (
    <div className="mb-12">
      {title && <div className="h-7 bg-gray-200 rounded w-64 mb-4 animate-pulse"></div>}
      <div className="flex gap-4 overflow-x-hidden">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );
}