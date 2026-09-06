export default function Loading() {
  return (
    <div
      className="page-shell page-stack"
      role="status"
      aria-label="Loading your page"
      aria-busy="true"
    >
      <span className="sr-only">Loading your Cardinal page...</span>
      <div className="grid gap-4" aria-hidden="true">
        <div className="skeleton h-3 w-28" />
        <div className="skeleton h-10 w-3/4 max-w-96" />
        <div className="skeleton h-4 w-2/3 max-w-80" />
      </div>
      <div className="panel panel-body grid gap-design-sm" aria-hidden="true">
        <div className="skeleton h-4 w-24" />
        <div className="skeleton h-16 w-3/4 max-w-72" />
        <div className="skeleton h-2 w-full" />
      </div>
      <div className="grid gap-design-sm sm:grid-cols-2" aria-hidden="true">
        {[0, 1].map((item) => (
          <div key={item} className="grid gap-4">
            <div className="skeleton h-48" />
            <div className="skeleton h-6 w-1/2" />
            <div className="skeleton h-3 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
