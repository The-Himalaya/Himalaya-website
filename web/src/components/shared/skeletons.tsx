import { Skeleton } from '@/components/ui/skeleton';

export function CategoryCardSkeleton() {
  return (
    <div className="bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-1/3 mt-4" />
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg overflow-hidden">
      <Skeleton className="h-56 w-full rounded-none" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="relative h-96 rounded-lg overflow-hidden">
      <Skeleton className="w-full h-full rounded-none" />
    </div>
  );
}

export function BlogPostCardSkeleton() {
  return (
    <div className="bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

export function FeaturedBlogPostSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg overflow-hidden">
      <Skeleton className="h-96 lg:h-auto rounded-none" />
      <div className="p-8 flex flex-col justify-center space-y-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-10 w-32 mt-2" />
      </div>
    </div>
  );
}

export function JobOpeningSkeleton() {
  return (
    <div className="bg-[var(--himalaya-card)] border border-[var(--border)] rounded-lg p-6">
      <Skeleton className="h-7 w-2/3 mb-3" />
      <div className="flex flex-wrap gap-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="py-6 bg-slate-50 border-b border-[var(--border)]">
        <div className="container mx-auto px-4">
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      {/* Content */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <Skeleton className="h-4 w-40 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: image */}
            <div className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-xl" />
            </div>
            {/* Right: details */}
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-10 w-full mt-4" />
              <div className="space-y-3 pt-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex justify-between py-3 border-b border-[var(--border)]">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CategoryPageSkeleton() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <div className="relative py-32 bg-slate-800">
        <div className="container mx-auto px-4 space-y-4">
          <Skeleton className="h-4 w-32 bg-slate-600" />
          <Skeleton className="h-16 w-2/3 bg-slate-600" />
          <Skeleton className="h-6 w-full max-w-2xl bg-slate-600" />
          <Skeleton className="h-6 w-5/6 max-w-2xl bg-slate-600" />
        </div>
      </div>

      {/* Advantages */}
      <div className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="w-6 h-6 flex-shrink-0 mt-1 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-48 mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
