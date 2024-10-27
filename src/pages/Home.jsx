import React, { useEffect } from 'react';
import CorouselComponent from '../components/CorouselComponent';
import { gettingAllGenres, gettingAllSeriesGenres, gettingTrendingMovies, gettingTrendingSeries } from '../utils/fetchMoviesVarities';
import CardSlider from '../components/CardSliderComponent';
import Loader from '../components/Loader';
import SeriesCardSliderComponent from '../components/SeriesCardSliderComponent';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const Home = ({ fetchAgain }) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = "Movie Time 🔥";
  }, [fetchAgain]);

  useEffect(() => {
    const prefetchData = async () => {
      const results = await Promise.allSettled([
        queryClient.prefetchQuery('trendingMovies', gettingTrendingMovies, { staleTime: 1000 * 60 * 300 }),
        queryClient.prefetchQuery('trendingSeries', gettingTrendingSeries, { staleTime: 1000 * 60 * 300 }),
        queryClient.prefetchQuery('genres', gettingAllGenres, { staleTime: 1000 * 60 * 300 }),
        queryClient.prefetchQuery('seriesGenres', gettingAllSeriesGenres, { staleTime: 1000 * 60 * 300 })
      ]);

      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Error prefetching data ${index + 1}:`, result.reason);
        }
      });
    };

    prefetchData();
  }, [queryClient]);

  const { data: trendingMovies, error: trendingMoviesError } = useQuery({
    queryKey: ['trendingMovies'],
    queryFn: gettingTrendingMovies,
    staleTime: 0 // 5 hrs
  });

  const { data: trendingSeries, error: trendingSeriesError } = useQuery({
    queryKey: ['trendingSeries'],
    queryFn: gettingTrendingSeries,
    staleTime: 1000 * 60 * 300
  });

  const { data: genres, error: genresError } = useQuery({
    queryKey: ['genres'],
    queryFn: gettingAllGenres,
    staleTime: 1000 * 60 * 300
  });

  const { data: seriesGenres, error: seriesGenresError } = useQuery({
    queryKey: ['seriesGenres'],
    queryFn: gettingAllSeriesGenres,
    staleTime: 1000 * 60 * 300
  });

  const includedGenres = ["Action", "Crime", "Mystery", "Drama", "Science Fiction"];
  const filteredGenres = genres?.filter((it) => includedGenres.includes(it.name));

  const includedSeriesGenres = ["Animation", "Mystery", "Comedy", "Sci-Fi & Fantasy"];
  const filteredSeriesGenres = seriesGenres?.filter(it => includedSeriesGenres.includes(it.name));

  const renderError = (error) => (
    <div style={{ textAlign: 'center', color: 'white' }}>
      <span role="img" aria-label="upset face" style={{ fontSize: '48px' }}>Please try using VPN</span>
    </div>
  );

  if (trendingMoviesError || trendingSeriesError || genresError || seriesGenresError) {
    return renderError(trendingMoviesError || trendingSeriesError || genresError || seriesGenresError);
  }

  return (
    <>
      {
        !(!!trendingSeries && !!filteredGenres && !!filteredSeriesGenres) ? (
              <Loader />
          ) : (
            
      <>
      <CorouselComponent trendingSeries={trendingSeries?.slice(0, 8)} />
      <div className='container-fluid'>
        <div className="trending-section my-3">
          <h2 className='mx-2 px-2 my-4 tr-h'>Trending Now 🔥</h2>
          <div className="d-flex flex-wrap justify-content-center">
            <CardSlider trendingMovies={trendingMovies} />
          </div>
        </div>
        {filteredGenres && filteredGenres?.map((item, i) => (
          <div key={`movies-slider${i}`}>
            <h4 className='  px-2 movie-heading'>{item.name}</h4>
            <CardSlider id={item.id} />
          </div>
        ))}
        {filteredSeriesGenres?.length > 0 && filteredSeriesGenres.map((item, i) => (
          <div key={`series-slider-${i}`}>
            <h4 className='px-2 series-heading'>{item.name}</h4>
            <SeriesCardSliderComponent seriesId={item.id} />
          </div>
        ))}
      </div>
    
      </>
          )
      }
    </>
  );
};

export default Home;
