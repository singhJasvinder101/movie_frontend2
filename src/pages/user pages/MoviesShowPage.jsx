import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchMoviesSeries_Results, fetchYoutubeKey_movie, getMovieGenreNameById, gettingMovieCastInfo, gettingMovieTitleOverview } from '../../utils/fetchMoviesVarities'
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';


// import required modules
import { Pagination } from 'swiper/modules';

const MoviesShowPageComponent = ({ fetchAgain }) => {
  // const { imdbId } = useParams()
  var imdbId = localStorage.getItem("id")
  const [movieId, setMovieId] = useState("")
  const [currentMovieData, setCurrentMovieData] = useState({
    title: "",
    overview: "",
    imdbRating: null,
    totalMins: null,
    releaseYear: null,
    genres_ids: [],
    genres: [],
    castInfo: [],
    img: "",
    tagline: "",
    status: ""
  })
  const [seriesIsFound, setSeriesIsFound] = useState(false)
  const [server, setServer] = useState(1)
  const [youtubeKey, setYoutubeKey] = useState("")


  useEffect(() => {
    if (currentMovieData.title) {
      document.title = `${currentMovieData.title} | ${currentMovieData.genres}`;
    }
  }, [currentMovieData.title, currentMovieData.genres]);

  useEffect(() => {
    // Fetch movies details and set movieid and other data
    fetchMoviesSeries_Results(imdbId).then((data) => {
      if (data) {
        setMovieId(data.id);
        setCurrentMovieData((prevData) => ({
          ...prevData,
          imdbId: data.imdb_id,
          imdbRating: data.vote_average,
          releaseDate: new Date(data.release_date).getFullYear(),
          genres: data.genres,
          img: data.backdrop_path,
          tagline: data.tagline,
          status: data.status
        }));
        setSeriesIsFound(true)
      }
    });
  }, [imdbId, fetchAgain]);


  useEffect(() => {
    // Fetch current episode details when seriesId, season_number, or episode_number changes
    gettingMovieTitleOverview(imdbId)
      .then((data) => {
        if (data) {
          setCurrentMovieData((prevData) => ({
            ...prevData,
            title: data.title,
            overview: data.overview,
            releaseDate: new Date(data.release_date).getFullYear(),
            totalMins: data.runtime,
          }));
        }

      })
      .catch((err) => console.error(err));
  }, [imdbId, fetchAgain]);

  useEffect(() => {
    // Fetch cast info when seriesId changes
    if (movieId) {
      gettingMovieCastInfo(movieId)
        .then((data) => {
          setCurrentMovieData((prevData) => ({
            ...prevData,
            castInfo: data,
          }));
        })
        .catch((err) => console.log(err));
    }
  }, [imdbId, fetchAgain]);

  useEffect(() => {
    fetchYoutubeKey_movie(imdbId).then((data) => {
      setYoutubeKey(data)
    })
      .catch((err) => console.log(err));
  }, [imdbId, fetchAgain])


  return (
    <div className='moviesPage'>
      <div className="movie-top">
        <img src={`https://image.tmdb.org/t/p/w1280/${currentMovieData.img}`} alt="" />
        <div className="movie-show d-flex jusitfy-content-between">
          <iframe
            id="iframe"
            className='video'
            src={server === 1 ? `https://embed.smashystream.com/playere.php?imdb=${currentMovieData.imdbId}` : `https://vidsrc.me/embed/${currentMovieData.imdbId}`}
            scrolling="no"
            frameborder="0"
            allow="fullscreen"
            webkitallowfullscreen="true"
            mozallowfullscreen="true"
            allowFullScreen
            referrerPolicy='origin'>
          </iframe>
          <div className="movie-trailer-section mx-auto">
            <iframe
              id='yo-trailer'
              src={`https://www.youtube.com/embed/${youtubeKey}?si=y64AWLNG2Ve4Ujgh`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen>
            </iframe>
            <div className='trailer-section'>
              <div className="my-3">
                Watch Trailer
              </div>
              <h5 style={{ color: '#A3A2A6' }}>
                {currentMovieData.title}
              </h5>
              <div style={{ color: '#A3A2A6' }}>
                {currentMovieData.tagline}
              </div>
              <div style={{ color: '#A3A2A6' }}>
                {currentMovieData.status}
              </div>
            </div>
          </div>
        </div>

        <div className="server-options">
          <div className="buttons">
            <button className='btn text-light' onClick={() => setServer(1)} >Video 1</button>
            <button className='btn text-light' onClick={() => setServer(2)} >Video 2</button>
          </div>
        </div>


      </div>
      <div className="series-overview container">
        <div className=" mt-5">
          <h1 className=''>{currentMovieData.title} <span className='mx-3'>{currentMovieData.releaseDate}</span> <span className='hd'>HD</span> </h1>
          <p>
            Rating: {currentMovieData.imdbRating && <span className='cyan'>{currentMovieData.imdbRating.toString().slice(0, 3)}</span>}
            &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;{currentMovieData.totalMins} <span className='cyan'>mins</span>
          </p>
          {currentMovieData.genres && currentMovieData.genres.map((genre, id) => (
            <span className='genre' key={id} ><span className='cyan'>⚪</span> {genre.name}</span>
          ))}
          <div className="overview my-4">
            <h3 className='my-2 cyan'>Overview:</h3>
            <p className='poppins'>{currentMovieData.overview}</p>
          </div>
        </div>
      </div>

      <h2 className='castInfo container cyan my-3'>Casts Info:</h2>
      <div className="container">
        <Swiper
          slidesPerView={2}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 10,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 10,
            },
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {currentMovieData.castInfo && currentMovieData.castInfo.slice(0, 6).map((cast, id) => (
            <>
              <SwiperSlide key={id} className='cast'>
                <div className="info">
                  <div className="image d-flex justify-content-center">
                    {cast.profile_path ? (
                      <img className='cast-img' src={`https://image.tmdb.org/t/p/w185/${cast.profile_path}`} alt="" />
                    ) : (
                      <img className='cast-img-alt' src="https://www.shutterstock.com/image-vector/person-gray-photo-placeholder-man-260nw-1409665172.jpg" alt="" />
                    )}
                  </div>
                  <div className="cast-details my-3">
                    <div className='cast-name poppins'>{cast.name}</div>
                    <div className='cast-character poppins'>character: {cast.character}</div>
                  </div>
                </div>
              </SwiperSlide>
            </>
          ))}
        </Swiper>
      </div>



    </div>
  )
}

export default MoviesShowPageComponent
