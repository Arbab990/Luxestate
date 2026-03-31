export function CardSkeleton() {
  return (
    <div className="bg-white border border-stone/60 rounded-2xl overflow-hidden">
      {/* Image placeholder */}
      <div className="skeleton w-full" style={{ aspectRatio: '4/3' }} />

      {/* Info placeholder */}
      <div className="p-5 border-t border-cream-2 space-y-3">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
        <div className="flex gap-4 pt-3 border-t border-cream-2">
          <div className="skeleton h-3 w-12" />
          <div className="skeleton h-3 w-12" />
          <div className="skeleton h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

export function ArticleSkeleton() {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden">
      <div className="skeleton w-full h-48" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-2/3" />
      </div>
    </div>
  );
}