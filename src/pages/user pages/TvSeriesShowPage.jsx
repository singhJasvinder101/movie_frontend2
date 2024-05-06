import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchMoviesSeries_Results, fetchSeriesDataById, getTVGenreNameById, gettingTVCastInfo, gettingCurrentEpisodeTitleOverview, gettingSeriesOfGenre, fetchTvSeries_Results, fetchYoutubeKey_series } from '../../utils/fetchMoviesVarities';
import NormalCardSliderComponent from '../../components/NormalCardSliderComponent';
import Cryptr from 'cryptr';
const cryptr = new Cryptr('jhsdjhdsfhwerhjhgtjrkhg');
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Pagination } from 'swiper/modules';

const TvSeriesShowPage = ({ fetchAgain }) => {
  // const { imdbId } = useParams()
  const imdbId = localStorage.getItem("id")
  const { season_number } = useParams()
  const { episode_number } = useParams()
  const [seriesId, setSeriesId] = useState("")
  const [seasonsData, setSeasonsData] = useState([])
  const [currentEpisodeData, setCurrentEpisodeData] = useState({
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
  const [iframeError, setIframeError] = useState(false);


  useEffect(() => {
    if (currentEpisodeData.title) {
      document.title = `${currentEpisodeData.title} | ${currentEpisodeData.genres.map((g, i) => g.name)}`;
    }
  }, [currentEpisodeData.title, currentEpisodeData.genres]);


  useEffect(() => {
    // Fetch series details and set seriesId and other data
    fetchTvSeries_Results(imdbId).then((data) => {
      if (data) {
        const seriesId = data.id;
        setSeriesId(seriesId);
        setCurrentEpisodeData((prevData) => ({
          ...prevData,
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
    if (seriesId && season_number && episode_number) {
      gettingCurrentEpisodeTitleOverview(seriesId, season_number, episode_number)
        .then((data) => {
          if (data) {
            setCurrentEpisodeData((prevData) => ({
              ...prevData,
              title: data.name,
              overview: data.overview,
              imdbRating: data.vote_average,
              releaseDate: new Date(data.air_date).getFullYear(),
              totalMins: data.runtime,
            }));
          }
        })
        .catch((err) => console.error(err));
    }
  }, [seriesId, season_number, episode_number]);

  useEffect(() => {
    // Fetch series data when seriesId changes
    if (seriesId) {
      fetchSeriesDataById(seriesId).then((data) => {
        setSeasonsData(data.seasons);
      });
    }
  }, [seriesId]);

  useEffect(() => {
    // Fetch cast info when seriesId changes
    if (seriesId) {
      gettingTVCastInfo(seriesId)
        .then((data) => {
          setCurrentEpisodeData((prevData) => ({
            ...prevData,
            castInfo: data,
          }));
        })
        .catch((err) => console.log(err));
    }
  }, [seriesId, fetchAgain]);


  useEffect(() => {
    fetchYoutubeKey_series(imdbId).then((data) => {
      setYoutubeKey(data)
    })
      .catch((err) => console.log(err));
  }, [imdbId, fetchAgain])

  // const handleIframeLoad = () => {
  //   const iframe = document.getElementById("iframe");
  //   // console.log("hello", iframe?.contentDocument)
  //   if (iframe.contentDocument === null) {
  //     setIframeError(true);
  //   }

  // };

  // useEffect(() => {
  //   setIframeError(false);
  // }, [server])

  return (
    <div className='tvSeriesPage my-3'>
      {seriesIsFound ? (
        <>
          <div className="movie-top">
            <img src={`https://image.tmdb.org/t/p/w1280/${currentEpisodeData.img}`} alt="" />
            <div className="movie-show d-flex jusitfy-content-between">
              {iframeError ? (
                <h1 className='video iframe-error'>use VPN</h1>
              ) : (
                <iframe
                  id="iframe"
                  className='mx-auto'
                  src={server === 1 ? `https://vidsrc.me/embed/tv?tmdb=${imdbId}&amp;season=${season_number}&amp;episode=${episode_number}`
                    : server === 2 ? `https://embed.smashystream.com/playere.php?tmdb=${imdbId}&season=${season_number}&episode=${encodeURIComponent(episode_number)}`
                      : server === 3 ? `https://multiembed.mov/?video_id=${imdbId}&amp;tmdb=1&amp;s=${season_number}&amp;e=${episode_number}`
                        : server === 4 ? `https://moviesapi.club/tv/${imdbId}-${season_number}-${episode_number}`
                          : `https://www.2embed.cc/embedtv/${imdbId}&amp;s=${season_number}&amp;e=${episode_number}`
                  }
                  scrolling="no"
                  frameborder="0"
                  // webkitallowfullscreen="true"
                  // mozallowfullscreen="true"
                  allowfullscreen="true"
                  // sandbox="allow-scripts allow-same-origin"
                  // onLoad={handleIframeLoad}
                  referrerPolicy='origin'>
                </iframe>
              )}
              <div className="movie-trailer-section mx-auto">
                <iframe
                  id='yo-trailer'
                  src={`https://www.youtube.com/embed/${youtubeKey}?si=y64AWLNG2Ve4Ujgh`}
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen="allowfullscreen">
                </iframe>
                <div className='trailer-section'>
                  <h4 className="my-3">
                    Watch Trailer
                  </h4>
                  <h4 style={{ color: '#A3A2A6' }}>
                    {currentEpisodeData.title}
                  </h4>
                  <div style={{ color: '#A3A2A6' }}>
                    {currentEpisodeData.tagline}
                  </div>
                  <div style={{ color: '#A3A2A6' }}>
                    {currentEpisodeData.status}
                  </div>
                </div>
              </div>
            </div>
            <h5 className='md:mx-5 lg:mx-20'><span className='text-green-600'>Recommendation: </span>Use VPN</h5>
            <div className="server-options">
              <div className="buttons">
                <button className='btn text-light' onClick={() => setServer(1)} >Server 1</button>
                <button className='btn text-light' onClick={() => setServer(2)} >Server 2</button>
                <button className='btn text-light' onClick={() => setServer(3)} >Server 3</button>
                <button className='btn text-light' onClick={() => setServer(4)} >Server 4</button>
                <button className='btn text-light' onClick={() => setServer(5)} >Server 5</button>
              </div>
            </div>
          </div>
          <div className="series-overview container">
            <div className=" mt-5">
              <h1 className='text-success'>{currentEpisodeData.title} <span className='mx-3'>{currentEpisodeData.releaseDate}</span> <span className='hd text-white'>HD</span> </h1>
              <p>
                Rating: <span className='text-success'>{currentEpisodeData.imdbRating && currentEpisodeData.imdbRating.toString().slice(0, 3)}</span>
                &ensp;&ensp;&ensp;&ensp;&ensp;&ensp; {currentEpisodeData.totalMins} <span className='text-success'>mins</span>
              </p>
              {currentEpisodeData.genres && currentEpisodeData.genres.map((genre, id) => (
                <span className='genre' key={id} >⚪ {genre.name}</span>
              ))}
              <div className="overview my-4">
                <h2 className='my-2 text-success'>Overview:</h2>
                <p className='poppins'>{currentEpisodeData.overview}</p>
              </div>
            </div>
          </div>

          <h2 className='castInfo text-success container my-3'>Casts Info:</h2>
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
              {currentEpisodeData.castInfo && currentEpisodeData.castInfo.map((cast, id) => (
                <>
                  <SwiperSlide key={id} className='cast'>
                    <div className="info">
                      <div className="image d-flex justify-content-center">
                        {cast.profile_path ? (
                          <img className='cast-img' src={`https://image.tmdb.org/t/p/w185/${cast.profile_path}`} alt="" />
                        ) : (
                          <img className='cast-img' src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/1024px-User-avatar.svg.png" alt="" />
                        )}
                      </div>
                      <div className="cast-details mx-3 my-3">
                        <div className='cast-name poppins'>{cast.name}</div>
                        <div className='cast-character poppins'>character: {cast.character}</div>
                      </div>
                    </div>
                  </SwiperSlide>
                </>
              ))}
            </Swiper>
          </div>

          <div className="seasons-episodes my-5">
            {seasonsData.map(season => (
              <>
                <h2 className='my-3 mx-4'>{season.name}</h2>
                <NormalCardSliderComponent setCurrentEpisodeData={setCurrentEpisodeData} imdbId={imdbId} season={season} />
              </>
            ))}
          </div>
        </>
      ) : (
        <div>
          <h2 className='text-center my-5'>Oops Series Not Found</h2>
        </div>
      )
      }
    </div >
  );
};

export default TvSeriesShowPage;
