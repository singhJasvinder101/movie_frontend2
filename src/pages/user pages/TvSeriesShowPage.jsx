import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchMoviesSeries_Results, fetchSeriesDataById, getTVGenreNameById, gettingTVCastInfo, gettingCurrentEpisodeTitleOverview, gettingSeriesOfGenre } from '../../utils/fetchMoviesVarities';
import NormalCardSliderComponent from '../../components/NormalCardSliderComponent';
import Cryptr from 'cryptr';
const cryptr = new Cryptr('jhsdjhdsfhwerhjhgtjrkhg');

const TvSeriesShowPage = () => {
  const { imdbId } = useParams()
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
    castInfo: []
  })
  const [seriesIsFound, setSeriesIsFound] = useState(false)
  const [server, setServer] = useState(1)

  useEffect(() => {
    if (currentEpisodeData.title) {
      document.title = `${currentEpisodeData.title} | ${currentEpisodeData.genres}`;
    }
  }, [currentEpisodeData.title, currentEpisodeData.genres]);


  useEffect(() => {
    // Fetch series details and set seriesId and other data
    fetchMoviesSeries_Results(imdbId).then((data) => {
      if (data.tv_results) {
        // console.log(data.tv_results);
        const seriesId = data.tv_results[0].id;
        setSeriesId(seriesId);
        setCurrentEpisodeData((prevData) => ({
          ...prevData,
          genres_ids: data.tv_results[0].genre_ids,
          releaseDate: new Date(data.tv_results[0].first_air_date).getFullYear(),
        }));
        setSeriesIsFound(true)
      }
    });
  }, [imdbId]);

  useEffect(() => {
    // Fetch current episode details when seriesId, season_number, or episode_number changes
    if (seriesId && season_number && episode_number) {
      gettingCurrentEpisodeTitleOverview(seriesId, season_number, episode_number)
        .then((data) => {
          if (data) {
            // console.log(data)
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
    // Fetch genre names when currentEpisodeData.genres_ids changes
    if (currentEpisodeData.genres_ids.length > 0) {
      const fetchGenres = async () => {
        const genreArray = [];
        for (const genreId of currentEpisodeData.genres_ids) {
          const genreData = await getTVGenreNameById(genreId);
          genreArray.push(genreData.name);
        }
        setCurrentEpisodeData((prevData) => ({
          ...prevData,
          genres: genreArray,
        }));
      };
      fetchGenres();
    }
  }, [currentEpisodeData.genres_ids]);

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
  }, [seriesId]);


  return (
    <div className='tvSeriesPage my-3'>
      {seriesIsFound ? (
        <>
          <iframe
            id="iframe"
            className='mx-auto'
            // https://vidsrc.me/embed/tt13623148/1-1/
            src={server === 1 ? `https://embed.smashystream.com/playere.php?imdb=${imdbId}&season=${season_number}&episode=${encodeURIComponent(episode_number)}` : `https://vidsrc.me/embed/${imdbId}/${season_number}-${episode_number}/` }
            scrolling="no"
            frameborder="0"
            allow="fullscreen"
            webkitallowfullscreen="true"
            mozallowfullscreen="true"
            allowFullScreen >
          </iframe>

          <div className="server-options">
            <div className="buttons">
              <button className='btn text-light' onClick={() => setServer(1)} >Video 1</button>
              <button className='btn text-light' onClick={() => setServer(2)} >Video 2</button>
            </div>
          </div>

          <div className="series-overview container">
            <div className=" mt-5">
              <h2>{currentEpisodeData.title} <span className='mx-3'>{currentEpisodeData.releaseDate}</span> <span className='hd'>HD</span> </h2>
              <p>
                Rating: {currentEpisodeData.imdbRating && currentEpisodeData.imdbRating.toString().slice(0, 3)}
                &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;{currentEpisodeData.totalMins} mins
              </p>
              {currentEpisodeData.genres && currentEpisodeData.genres.map((genre, id) => (
                <span className='genre' key={id} >⚪ {genre}</span>
              ))}
              <div className="overview my-4">
                <h3 className='my-2'>Overview:</h3>
                <p>{currentEpisodeData.overview}</p>
              </div>
            </div>
          </div>

          <h2 className='castInfo container my-3'>Casts Info:</h2>
          <div className="d-flex container flex-wrap">
            {currentEpisodeData.castInfo && currentEpisodeData.castInfo.slice(0,6).map((cast, id) => (
              <>
                <span key={id} className='cast d-flex flex-row col-xl-4'>
                  <div className="info d-flex flex-wrap justify-content-evenly align-items-center">
                    <div className="image">
                      {cast.profile_path ? (
                        <img className='cast-img' src={`https://image.tmdb.org/t/p/w185/${cast.profile_path}`} alt="" />
                      ) : (
                        <img className='cast-img' src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/1024px-User-avatar.svg.png" alt="" />
                      )}
                    </div>
                    <div className="cast-details mx-3 my-3">
                      <h3>{cast.name}</h3>
                      <h6>Profession: &ensp; {cast.known_for_department}</h6>
                      <h6>character: &ensp; {cast.character}</h6>
                      <h6>popularity: &ensp; {cast.popularity}</h6>
                    </div>
                  </div>
                </span>
              </>
            ))}
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
      )}
    </div >
  );
};

export default TvSeriesShowPage;
