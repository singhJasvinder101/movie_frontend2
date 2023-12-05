import React, { useEffect, useState } from 'react'
import CorouselComponent from '../components/SliderComponent'
import Card1 from '../components/Card1'
import { gettingAllGenres, gettingAllSeriesGenres, gettingTrendingMovies, gettingTrendingSeries } from '../utils/fetchMoviesVarities'
import CardSlider from '../components/CardSliderComponent'
import Card2 from '../components/Card2'
import SeriesCardSliderComponent from '../components/SeriesCardSliderComponent'
import { useQuery } from '@tanstack/react-query'


const Home = () => {
  // const [data, setData] = useState([])
  // const [genres, setGenres] = useState([])
  // const [seriesGenres, setSeriesGenres] = useState([])
  // const [trendingSeries, setTrendingSeries] = useState([])

  // useEffect(() => {
  //   gettingTrendingMovies().then(res => {
  //     setData(res.slice(0, 18))
  //   }).catch(err => console.log(err)) 
  // }, [])

  // useEffect(() => {
  //   gettingAllGenres().then(genre => {
  //     const excludedGenres = ["Action", "Crime", "Mystery", "Drama", "Science Fiction"];
  //     setGenres(genre.filter(it => excludedGenres.includes(it.name)))
  //   }).catch(err => console.log(err))
  // }, [])

  // useEffect(() => { 
  //   gettingAllSeriesGenres().then(genre => {
  //     const excludedGenres = ["Animation", "Mystery", "Comedy", "Sci-Fi & Fantasy"];
  //     setSeriesGenres(genre.filter(it => excludedGenres.includes(it.name)))
  //   }).catch(err => console.log(err))
  // }, [])

  // useEffect(() => {
  //   gettingTrendingSeries().then(res => {
  //     setTrendingSeries(res.slice(0,4))
  //   }).catch(err => console.log(err))
  // }, [])

  const trendingMoviesQuery = useQuery({
    queryKey: ['trendingMovies'],
    queryFn: gettingTrendingMovies,
  });

  const trendingSeriesQuery = useQuery({
    queryKey: ['trendingSeries'],
    queryFn: gettingTrendingSeries,
  });

  const genresQuery = useQuery({
    queryKey: ['genres'],
    queryFn: gettingAllGenres,
  });

  const gettingAllSeriesGenresQuery = useQuery({
    queryKey: ['seriesGenre'],
    queryFn: gettingAllSeriesGenres,
  });

  const trendingSeries = trendingSeriesQuery.data || [];
  const data = trendingMoviesQuery.data || []
  const genres = genresQuery.data || [];

  const includedGenres = ["Action", "Crime", "Mystery", "Drama", "Science Fiction"];
  const filteredGenres = genres.filter((it) => includedGenres.includes(it.name));

  const seriesGenres = gettingAllSeriesGenresQuery.data || []
  const includedeSeriesGenres = ["Animation", "Mystery", "Comedy", "Sci-Fi & Fantasy"];
  const filteredSeriesGenres = seriesGenres.filter(it => includedeSeriesGenres.includes(it.name))

  return (
    <div className='container-fluid'>
      <CorouselComponent trendingSeries={trendingSeries.slice(0, 4)} />
      <div className="trending-section my-3">
        <h2 className='mx-3 px-2 my-4 tr-h'>Trending Now 🔥</h2>
        <div className="d-flex flex-wrap justify-content-center">
          <h4>{data.name}</h4>
          <CardSlider trendingData={data} />
        </div>
      </div>
      {filteredGenres
        ?.map((item, i) => (
          <div key={`movies-slider${i}`}>
            <h4 className='mx-3 mt-5 px-2 movie-heading'>{item.name}</h4>
            <CardSlider id={item.id} />
          </div>
        ))}
      {filteredSeriesGenres.length > 0 && filteredSeriesGenres
        .map((item, i) => (
          <div key={`series-slider-${i-100}`}>
            <h4 className='mx-3 mt-5 px-2 series-heading'>{item.name}</h4>
            <SeriesCardSliderComponent seriesId={item.id} />
          </div>
        ))}
    </div>
  )
}

export default Home
