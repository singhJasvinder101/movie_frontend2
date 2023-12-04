import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchMoviesSeries_Results, getMovieGenreNameById, gettingMovieCastInfo, gettingMovieTitleOverview } from '../../utils/fetchMoviesVarities'

const MoviesShowPageComponent = () => {
  const { imdbId } = useParams()
  const [movieId, setMovieId] = useState("")
  const [currentMovieData, setCurrentMovieData] = useState({
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
    if (currentMovieData.title) {
      document.title = `${currentMovieData.title} | ${currentMovieData.genres}`;
    }
  }, [currentMovieData.title, currentMovieData.genres]);

  useEffect(() => {
    // Fetch movies details and set movieid and other data
    fetchMoviesSeries_Results(imdbId).then((data) => {
      if (data.movie_results) {
        // console.log(data.movie_results);
        // console.log(currentMovieData)
        const movieId = data.movie_results[0].id;
        setMovieId(movieId);
        setCurrentMovieData((prevData) => ({
          ...prevData,
          genres_ids: data.movie_results[0].genre_ids,
          imdbRating: data.movie_results[0].vote_average,
          releaseDate: new Date(data.movie_results[0].first_air_date).getFullYear(),
        }));
        setSeriesIsFound(true)
      }
    });
  }, [imdbId]);


  useEffect(() => {
    // Fetch current episode details when seriesId, season_number, or episode_number changes
    if (movieId) {
      gettingMovieTitleOverview(movieId)
        .then((data) => {
          // console.log(data)
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
    }
  }, [movieId]);

  
  useEffect(() => {
    // Fetch genre names when currentEpisodeData.genres_ids changes
    if (currentMovieData.genres_ids.length > 0) {
      const fetchGenres = async () => {
        const genreArray = [];
        for (const genreId of currentMovieData.genres_ids) {
          const genreData = await getMovieGenreNameById(genreId);
          genreArray.push(genreData.name);
        }
        setCurrentMovieData((prevData) => ({
          ...prevData,
          genres: genreArray,
        }));
      };
      fetchGenres();
    }
  }, [currentMovieData.genres_ids]);

  useEffect(() => {
    // Fetch cast info when seriesId changes
    if (movieId) {
      gettingMovieCastInfo(movieId)
        .then((data) => {
          // console.log(data)
          setCurrentMovieData((prevData) => ({
            ...prevData,
            castInfo: data,
          }));
        })
        .catch((err) => console.log(err));
    }
  }, [movieId]);

  return (
    <div className='moviesPage my-3'>
      <iframe
        id="iframe"
        className='mx-auto'
        src={server === 1 ? `https://embed.smashystream.com/playere.php?imdb=${imdbId}` : `https://vidsrc.me/embed/${imdbId}`}
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
          <h2>{currentMovieData.title} <span className='mx-3'>{currentMovieData.releaseDate}</span> <span className='hd'>HD</span> </h2>
          <p>
            Rating: {currentMovieData.imdbRating && <span className='cyan'>{currentMovieData.imdbRating.toString().slice(0, 3)}</span>}
            &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;{currentMovieData.totalMins} <span className='cyan'>mins</span>
          </p>
          {currentMovieData.genres && currentMovieData.genres.map((genre, id) => (
            <span className='genre' key={id} ><span className='cyan'>⚪</span> {genre}</span>
          ))}
          <div className="overview my-4">
            <h3 className='my-2 cyan'>Overview:</h3>
            <p>{currentMovieData.overview}</p>
          </div>
        </div>
      </div>

      <h2 className='castInfo cyan container my-3'>Casts Info:</h2>
      <div className="d-flex container flex-wrap">
        {currentMovieData.castInfo && currentMovieData.castInfo.slice(0,6).map((cast, id) => (
          <>
            <span key={id} className='cast d-flex flex-row col-xl-4'>
              <div className="info d-flex flex-wrap justify-content-evenly w-75 align-items-center">
                <div className="image">
                  {cast.profile_path ? (
                    <img className='cast-img' src={`https://image.tmdb.org/t/p/w185/${cast.profile_path}`} alt="" />
                  ) : (
                    <img className='cast-img' src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/1024px-User-avatar.svg.png" alt="" />
                  )}
                </div>
                <div className="cast-details mx-3 my-3">
                  <h2>{cast.name}</h2>
                  <h5>Profession: &ensp; {cast.known_for_department}</h5>
                  <h5>character: &ensp; {cast.character}</h5>
                  <h5>popularity: &ensp; {cast.popularity}</h5>
                </div>
              </div>
            </span>
          </>
        ))}
      </div>

    </div>
  )
}

export default MoviesShowPageComponent
