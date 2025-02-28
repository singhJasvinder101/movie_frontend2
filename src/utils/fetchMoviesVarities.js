import axios from "axios";

const apiKey = import.meta.env.VITE_API_KEY
const apiKey1 = import.meta.env.VITE_API_KEY_1
const apiKey2 = import.meta.env.VITE_API_KEY_2
const gettingAllGenres = () => {
    return fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            // console.log(data)
            return data.genres
        })
        .catch(error => {
            console.log(error);
        });
}
const gettingAllSeriesGenres = () => {
    return fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}`)
        .then(response => {
            return response.json();
        })
        .then(data => data.genres)
        .catch(error => {
            console.log(error);
        });
}

const gettingMoviesOfGenres = (id) => {
    return fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${id}`)
        .then((res) => {
            return res.json()
        }).then(data => data)
        .catch(err => console.log(err))
}

const gettingSeriesOfGenre = (id) => {
    return fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=${id}`)
        .then((res) => {
            return res.json()
        }).then(data => data)
        .catch(err => console.log(err))
}

const gettingAllMovies = () => {
    return fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey1}&language=en-US&sort_by=popularity.desc&with_genres=null&primary_release_year=null&page=1`)
        .then((res) => {
            return res.json()
        }).then(data => data)
        .catch(err => console.log(err))
}

const gettingTrendingMovies = () => {
    return fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`)
        .then((res) => {
            return res.json()
        }).then(data => data.results)
        .catch(err => console.log(err))
}

const gettingTrendingSeries = () => {
    return fetch(`https://api.themoviedb.org/3/trending/all/day?language=en-US&api_key=${apiKey}`)
        .then((res) => {
            return res.json()
        }).then(data => data.results)
        .catch(err => console.log(err))
}

const fetchIMDBData = async (title) => {
    try {
        // const response = await axios.get(`https://v3.sg.media-imdb.com/suggestion/x/${encodeURIComponent(title.slice(0, 15))}.json`, {
        //     params: {
        //         callback: 'jsonpCallback',
        //     },
        // });
        const response = await axios.get(`https://imdb-api.projects.thetuhin.com/search?query=${encodeURIComponent(title)}`);
        const data = response.data;
        console.log(data)

        // return data.d[0].id;
    } catch (error) {
        console.error(error);
    }
};

export const fetchYoutubeKey_movie = async (id) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US&api_key=${apiKey}`)
        const data = response.data
        return data.results[0].key
    } catch (error) {
        console.log(error)
    }
}

export const fetchYoutubeKey_series = async (id) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}/videos?language=en-US&api_key=${apiKey}`)
        const data = response.data
        return data.results[0].key
    } catch (error) {
        console.log(error)
    }
}

const fetchMoviesSeries_Results = async (tmdbId) => {
    try {
        return fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${apiKey}&language=en-US&external_source=tmdb_id`)
            .then((res) => {
                return res.json()
            }).then(data => data)
            .catch(err => console.log(err))
    } catch (error) {
        console.log(error)
    }
}

const fetchTvSeries_Results = async (tmdbId) => {
    try {
        return fetch(`https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${apiKey}&language=en-US&external_source=tmdb_id`)
            .then((res) => {
                return res.json()
            }).then(data => data)
            .catch(err => console.log(err))
    } catch (error) {
        console.log(error)
    }
}

const fetchSeriesDataById = async (seriesid) => {
    const newContent = {
        seriesId: seriesid,
        seasons: [],
    }
    const seriesDataResponse = await fetch(`https://api.themoviedb.org/3/tv/${seriesid}?api_key=${apiKey}&language=en-US`);
    const seriesData = await seriesDataResponse.json();
    if (seriesData.seasons) {
        for (const season of seriesData.seasons) {
            const episodesDataResponse = await fetch(`https://api.themoviedb.org/3/tv/${seriesid}/season/${season.season_number}?api_key=${apiKey}&language=en-US`);
            const episodesData = await episodesDataResponse.json();

            const episodes = [];
            for (const episode of episodesData.episodes) {
                episodes.push({
                    episodeNumber: episode?.episode_number,
                    name: episode?.name,
                    overview: episode?.overview,
                    imageUrl: episode?.still_path,
                    videoUrl: `https://embed.smashystream.com/playere.php?imdb=${newContent.id}&season=${season.season_number}&episode=${encodeURIComponent(episode.episode_number)}`
                });
            }

            newContent.seasons.push({
                seasonNumber: season.season_number,
                name: season.name,
                episodes: episodes
            });
            // console.log(newContent)
        }
    }
    return newContent;
}

const getTVGenreNameById = (genreId) => {
    try {
        return fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}`)
            .then((response) => response.json())
            .then((data) => {
                const genre = data.genres.find(g => g.id === parseInt(genreId))
                return genre
            })
            .catch((error) => {
                console.error(error);
            });
    } catch (error) {
        console.log(error)
    }
}

const getMovieGenreNameById = (genreId) => {
    try {
        return fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`)
            .then((response) => response.json())
            .then((data) => {
                const genre = data.genres.find(g => g.id === parseInt(genreId))
                return genre
            })
            .catch((error) => {
                console.error(error);
            });
    } catch (error) {
        console.log(error)
    }
}

const gettingTVCastInfo = (id) => {
    return fetch(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=${apiKey}`)
        .then(res => { return res.json() })
        .then(data => {
            return data.cast
        }).catch(err => {
            console.log(err)
        })
}

const gettingMovieCastInfo = (id) => {
    return fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`)
        .then(res => { return res.json() })
        .then(data => {
            return data.cast
        }).catch(err => {
            console.log(err)
        })
}

const gettingCurrentEpisodeTitleOverview = (id, season_number, episode_number) => {
    try {
        return fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season_number}/episode/${episode_number}?api_key=${apiKey}&language=en-US`)
            .then(res => { return res.json() })
            .then(data => {
                return data
            }).catch(err => {
                console.log(err)
            })
    } catch (error) {
        console.log(error)
    }
}

const gettingMovieTitleOverview = (id) => {
    try {
        return fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`)
            .then(res => { return res.json() })
            .then(data => {
                return data
            }).catch(err => {
                console.log(err)
            })
    } catch (error) {
        console.log(error)
    }
}

// takes array of ids

const getTVGenreName = (genreId) => {
    try {
        return fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}`)
            .then((response) => response.json())
            .then((data) => {
                const genre = data.genres.find(g => g.id === parseInt(genreId))
                return genre ?? genre.name
            })
            .catch((error) => {
                console.error(error);
            });
    } catch (error) {
        console.log(error)
    }
}
const getGenreNames = async (genreIds) => {
    try {
        const genreNames = [];
        genreIds.forEach(async (genreId) => {
            const genreName = await getTVGenreName(genreId);
            genreNames.push(genreName.name);
        });
        return genreNames;
    } catch (error) {
        console.log(error)
    }
};

const searchMoviesOrSeries = async (query) => {
    try {
        // const response = await axios.get(`https://v3.sg.media-imdb.com/suggestion/x/${encodeURIComponent(query.slice(0, 15))}.json`, {
        //     params: {
        //         callback: 'jsonpCallback',
        //     },
        // });
        // const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=98325a9d3ed3ec225e41ccc4d360c817&language=en-US&query=${encodeURIComponent(query)}`);
        // const response = await axios.get(`https://imdb-api.projects.thetuhin.com/search?query=${encodeURIComponent(query)}`);
        // const response = await axios.get(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=8e70dc5`);
        const response = await axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey2}&query=${encodeURIComponent(query)}`);
        const data = response.data;
        return data.results
    } catch (err) {
        console.log(err)
    }
}
async function HollyWood({ pageParam }) {
    const genreId = 28; // Genre ID for Hollywood
    const totalPages = 8;
    let allResults = [];
    // console.log(pageParam)

    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/discover/movie`,
            {
                params: {
                    api_key: apiKey,
                    with_genres: genreId,
                    page: pageParam,
                },
            }
        );
        return response.data.results;
    } catch (error) {
        console.log('Error fetching movies:', error);
        return [];
    }
}
async function Bollywood({ pageParam }) {
    const genreId = 10402;
    const totalPages = 8;
    let allResults = [];

    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/discover/movie`,
            {
                params: {
                    api_key: apiKey,
                    page: pageParam,
                    language: 'en-US',
                    region: 'IN',
                    with_original_language: 'hi',
                },
            }
        );
        // console.log(response.data.results)
        return response.data.results;
    } catch (error) {
        console.log('Error fetching movies:', error);
        return [];
    }
}

export {
    gettingAllGenres,
    gettingMoviesOfGenres,
    gettingAllMovies,
    gettingTrendingMovies,
    gettingAllSeriesGenres,
    gettingSeriesOfGenre,
    gettingTrendingSeries,
    fetchIMDBData,
    fetchMoviesSeries_Results,
    fetchSeriesDataById,
    getTVGenreNameById,
    gettingTVCastInfo,
    gettingCurrentEpisodeTitleOverview,
    gettingMovieTitleOverview,
    gettingMovieCastInfo,
    getMovieGenreNameById,
    getGenreNames,
    searchMoviesOrSeries,
    HollyWood,
    Bollywood,
    fetchTvSeries_Results
} 
