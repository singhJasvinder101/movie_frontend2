import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Card1 from './Card1';
import { useSpring, animated } from 'react-spring';
import { useEffect, useState } from 'react';
import { gettingMoviesOfGenres, gettingSeriesOfGenre } from '../utils/fetchMoviesVarities';
import Card2 from './Card2';
import Loader1Component from './Loader1Component';
import { ChakraProvider, Skeleton } from '@chakra-ui/react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';

const tmdbApiKey = import.meta.env.tmdbApiKey
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';

const CardSlider = ({ id, seriesId }) => {
    const { data, isLoading } = useQuery({
        queryKey: ["movie_genres", id],
        queryFn: () => gettingMoviesOfGenres(id),
        staleTime: 1000 * 60 * 300 // 5 hrs
    })

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        centerMode: false,
        // slidesToShow: data.length >= 6 ? 4 : data.length,
        slidesToScroll: 2,
        centerPadding: "10px",
        slidesToShow: 1,
        variableWidth: true,
        arrows: window.innerWidth <= 640 ? false : true,
    };

    const CardContainer = styled(animated.div)`
        position: relative;
        width: 190px;
        height: 15rem;
        margin-right: 10px;
        overflow: hidden;
        border-radius: 10px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
        cursor: pointer;

        &:hover {
          z-index: 12;
        }
    `;


    return (
        <ChakraProvider>
            <Swiper
                slidesPerView={2.5}
                spaceBetween={0}
                pagination={{
                    clickable: true,
                }}
                breakpoints={{
                    640: {
                        slidesPerView: 4,
                        spaceBetween: 0,
                    },
                    768: {
                        slidesPerView: 6,
                        spaceBetween: 0,
                    },
                    1024: {
                        slidesPerView: 7,
                        spaceBetween: 0,
                    },
                }}
                modules={[Pagination]}
                className="mySwiper"
            >
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, idx) => (
                        <SwiperSlide>
                            <CardContainer  >
                                <Skeleton key={idx} className='card-skeleton' height='254px' width="190px" fadeDuration={3} style={{ width: '190px', height: '254px' }} />
                            </CardContainer>
                        </SwiperSlide>
                    ))
                ) : (
                    data && data?.results?.map((res, index) => (
                        <>
                            <SwiperSlide key={`movies-card-${index}`}>
                                <Card2 className='mx-4 card-slider-item' title={res.title} imgUrl={res.poster_path} isMovie={res.title ? true : false} imdbId={res.id} />
                            </SwiperSlide>
                        </>
                    )
                    ))}
            </Swiper>
        </ChakraProvider>
    );
}

export default CardSlider;

