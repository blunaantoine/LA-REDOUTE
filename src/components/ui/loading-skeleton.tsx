'use client'

export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="min-h-screen hero-gradient flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="h-8 w-48 bg-white/10 rounded-full skeleton-pulse" />
              <div className="h-16 w-96 bg-white/10 rounded-lg skeleton-pulse" />
              <div className="h-8 w-24 bg-white/10 rounded-lg skeleton-pulse" />
              <div className="h-20 w-full max-w-xl bg-white/10 rounded-lg skeleton-pulse" />
              <div className="flex gap-4">
                <div className="h-12 w-40 bg-white/10 rounded-lg skeleton-pulse" />
                <div className="h-12 w-40 bg-white/10 rounded-lg skeleton-pulse" />
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-80 h-80 mx-auto bg-white/10 rounded-3xl skeleton-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Products skeleton */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <div className="h-6 w-32 mx-auto bg-gray-200 rounded-full skeleton-pulse" />
            <div className="h-10 w-80 mx-auto bg-gray-200 rounded-lg skeleton-pulse" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md">
                <div className="h-64 bg-gray-200 skeleton-pulse" />
                <div className="p-6 space-y-4">
                  <div className="h-4 w-full bg-gray-200 rounded skeleton-pulse" />
                  <div className="flex gap-2">
                    <div className="h-6 w-20 bg-gray-200 rounded-full skeleton-pulse" />
                    <div className="h-6 w-20 bg-gray-200 rounded-full skeleton-pulse" />
                  </div>
                  <div className="h-10 w-full bg-gray-200 rounded-lg skeleton-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values section skeleton */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <div className="h-6 w-40 mx-auto bg-gray-200 rounded-full skeleton-pulse" />
            <div className="h-10 w-72 mx-auto bg-gray-200 rounded-lg skeleton-pulse" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-8 space-y-4">
                <div className="w-14 h-14 bg-gray-200 rounded-xl skeleton-pulse" />
                <div className="h-6 w-32 bg-gray-200 rounded skeleton-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded skeleton-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded skeleton-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA section skeleton */}
      <div className="py-20 hero-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="h-10 w-96 mx-auto bg-white/10 rounded-lg skeleton-pulse" />
          <div className="h-6 w-full max-w-lg mx-auto bg-white/10 rounded skeleton-pulse" />
          <div className="flex justify-center gap-4">
            <div className="h-12 w-48 bg-white/10 rounded-lg skeleton-pulse" />
            <div className="h-12 w-48 bg-white/10 rounded-lg skeleton-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
