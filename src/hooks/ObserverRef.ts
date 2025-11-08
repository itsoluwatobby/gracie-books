import { useEffect, useRef } from "react";


export const useObserverRef = (
  {
    loadMore,
    hasMore,
    loading,
  }:{
    loadMore: () => void,
    hasMore: boolean,
    loading: boolean,
  }
) => {
  const loadMoreRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  // <button onClick={loadMore} disabled={loading || !hasMore}>
//   {loading ? 'Loading...' : hasMore ? 'Load More' : 'No More Books'}
// </button>
}