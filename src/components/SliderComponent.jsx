import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import axios from 'axios';
import { Link } from 'react-router-dom';
import StarRatings from 'react-star-ratings';

const CorouselComponent = ({ trendingSeries }) => {
    const [imdbData, setImdbData] = useState([]);
    const [genreNames, setGenreNames] = useState([]);
    const [isAdult, setisAdult] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Function to fetch IMDb data for a series title
        const fetchData = async (title) => {
            try {
                // const response = await axios.get(`https://v3.sg.media-imdb.com/suggestion/x/${encodeURIComponent(title.slice(0, 15))}.json`, {
                //     params: {
                //         callback: 'jsonpCallback',
                //     },
                // });
                // const response = await axios.get(`https://imdb-api.projects.thetuhin.com/search?query=${encodeURIComponent(title)}`);
                const response = await axios.get(`https://www.omdbapi.com/?s=${encodeURIComponent(title)}&apikey=e7db26be`);
                // const data = response.data;
                // if (data.results[0] && title) {
                //     return data.results[0].id;
                // }
                const data = response.data;
                if (data.Search[0] && title) {
                    const sortedItems = data.Search.sort((a, b) => {
                        if(!isNaN(a.Year) && !isNaN(b.Year)){
                            return b.Year - a.Year
                        } 
                        return 0
                    });
                    console.log(sortedItems)
                    return sortedItems[0].imdbID
                }
            } catch (error) {
                console.error(error);
            }
        };

        const fetchAllImdbData = async () => {
            try {
                const imdbDataPromises = trendingSeries.map(async (series) => {
                    if (series.name) {
                        // console.log(series.name)
                        const id = await fetchData(series.name);
                        return { name: series.name, id };
                    }
                    return null;
                });
                const fetchedImdbData = await Promise.all(imdbDataPromises);
                const filteredImdbData = fetchedImdbData.filter((data) => data !== null);
                setImdbData(filteredImdbData);
            } catch (error) {
                console.log(error);
            }
        };

        fetchAllImdbData();
    }, [trendingSeries]);

    useEffect(() => {
        const fetchGenresData = async (seriesId) => {
            return fetch(`https://api.themoviedb.org/3/tv/${seriesId}?api_key=b6b677eb7d4ec17f700e3d4dfc31d005&language=en-US`)
                .then(res => { return res.json() })
                .then(data => data)
        }

        const fetchAllGenreNames = async () => {
            const AllResponses = trendingSeries.map(async (series) => {
                if (series.name) {
                    const genre_Data = await fetchGenresData(series.id);
                    setisAdult(series.adult)
                    // console.log(series.adult)
                    return genre_Data.genres
                }
                return null;
            });
            const fetchedGenreNames = await Promise.all(AllResponses);
            setGenreNames(fetchedGenreNames);
        };
        fetchAllGenreNames()
        // console.log(genreNames)

    }, [trendingSeries]);

    return (
        <>
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper"
            >
                {imdbData.map((item, idx) => (
                    <SwiperSlide key={idx} className='wiper'>
                        <Link className='w-100 h-100' to={`/series/${item.name && item.id}/s/1/e/1`}>
                            <div className="swiper-slide-content w-100 h-100">
                                <img src={`https://image.tmdb.org/t/p/w1280/${trendingSeries[idx].backdrop_path}`} alt="" />
                                <div className="slide-overlay ">
                                    <h2>{item.name}</h2>
                                    <p className='p-1 d-flex align-items-center justify-content-center'>
                                        <span className="star mt-1 mx-2">
                                            <StarRatings
                                                rating={1}
                                                starDimension="20px"
                                                numberOfStars={1}
                                                starRatedColor="cyan" />
                                        </span>
                                        {trendingSeries[idx].vote_average} | {new Date(trendingSeries[idx].first_air_date).getFullYear()}  {isAdult ? ' | U/A 16+' : ' | U/A  8+'}</p>
                                    <p>
                                        {genreNames[idx] && genreNames[idx].map((genre, id) => (
                                            <span key={id}>{genre.name} | </span>
                                        ))}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
};

export default CorouselComponent;
