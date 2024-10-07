import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import axios from 'axios';
import { Link } from 'react-router-dom';
import StarRatings from 'react-star-ratings';

const CorouselComponent = ({ trendingSeries }) => {
    const [genre_Data, setGenre_Data] = useState({
        genres: [],
        adult: false
    })

    useEffect(() => {
        const fetchGenresData = async (mediaType, id) => {
            const apiKey = 'b6b677eb7d4ec17f700e3d4dfc31d005';
            const url = `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${apiKey}&language=en-US`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                return { genres: data.genres, adult: data.adult };
            } catch (error) {
                console.error('Error fetching genre data:', error);
                return null;
            }
        };

        const fetchAllGenreData = async () => {
            const AllResponses = trendingSeries?.map(async (item) => {
                const genreData = await fetchGenresData(item.media_type, item.id);
                return genreData;
            });

            if(AllResponses){
                const fetchedGenreData = await Promise.all(AllResponses);
                setGenre_Data(fetchedGenreData);
            }
        };

        fetchAllGenreData();
    }, [trendingSeries]);

    const handleClick = (id) => {
        localStorage.setItem('id', id);
    };

    return (
        <div className='trending-section'>
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
                {trendingSeries?.map((item, idx) => (
                    <SwiperSlide
                        id='trending' key={idx}
                        className='wiper'
                        onClick={() => handleClick(item.id)}
                    >
                        <Link className='w-100 h-100' to={item.media_type === "tv" ? `/series/s/1/e/1` : `/movies/`}>
                            <div className="swiper-slide-content w-100 h-100">
                                <img src={`https://image.tmdb.org/t/p/w1280/${trendingSeries[idx].backdrop_path}`} alt="" />
                                <div className="slide-overlay ">
                                    <h2 className="mx-3" >{item.media_type === "tv" ? item.name : item.title}</h2>
                                    <p className='p-1 d-flex align-items-center justify-content-center'>
                                        <span className="star mt-1 mx-2">
                                            <StarRatings
                                                rating={1}
                                                starDimension="20px"
                                                numberOfStars={1}
                                                starRatedColor="cyan" />
                                        </span>
                                        {trendingSeries[idx].vote_average} | {item.media_type === "tv" ? new Date(trendingSeries[idx].first_air_date).getFullYear() : new Date(trendingSeries[idx].release_date).getFullYear()}  {genre_Data[idx]?.adult ? ' | U/A 16+' : ' | U/A  8+'}</p>
                                    <p className="mx-3" >
                                        {genre_Data[idx] && genre_Data[idx].genres.map((genre, id) => (
                                            <>
                                                <span key={id}>{genre.name} | </span>
                                            </>
                                        ))}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default CorouselComponent;
