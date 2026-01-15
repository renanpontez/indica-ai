export function FeedEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-md text-center">
      <svg
        className="h-24 w-24 text-text-secondary mb-md"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <h2 className="text-title-m font-semibold text-text-primary mb-sm">
        No places yet
      </h2>
      <p className="text-body text-text-secondary max-w-sm">
        Follow friends to discover places they love.
      </p>
    </div>
  );
}
