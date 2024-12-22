const LoadingState = () => (
  <div className="min-h-screen bg-surface">
    <div className="container mx-auto pt-24 px-4">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-32 bg-gray-200 rounded mb-4"></div>
      </div>
    </div>
  </div>
);

export default LoadingState;