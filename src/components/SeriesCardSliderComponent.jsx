import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Card1 from './Card1';
import { useEffect, useState } from 'react';
import { gettingMoviesOfGenres, gettingSeriesOfGenre } from '../utils/fetchMoviesVarities';
import Card2 from './Card2';
import { LinkContainer } from 'react-router-bootstrap';
import Loader1Component from './Loader1Component';
import { ChakraProvider, Skeleton } from '@chakra-ui/react';
import styled from 'styled-components';
import { animated } from 'react-spring';

const tmdbApiKey = import.meta.env.tmdbApiKey
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';

const SeriesCardSliderComponent = ({ id, seriesId }) => {
    const [data, setData] = useState([])
    const [seriesData, setSeriesData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        gettingSeriesOfGenre(seriesId).then(data => {
            //   console.log(data.results)
            setIsLoading(true)
            setSeriesData(data.results)
            setIsLoading(false)
        }).catch(err => console.log(err))
    }, [seriesId])

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



    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        centerMode: false,
        // slidesToShow: data.length >= 6 ? 4 : data.length,
        slidesToScroll: 2,
        centerPadding: "10px",
        variableWidth: true,
        slidesToShow: 1,
        arrows: window.innerWidth <= 640 ? false : true,
    };

    return (
        <ChakraProvider>
            <Swiper
                slidesPerView={2}
                spaceBetween={0}
                pagination={{
                    clickable: true,
                }}
                breakpoints={{
                    640: {
                        slidesPerView: 4,
                        spaceBetween: 3,
                    },
                    768: {
                        slidesPerView: 5,
                        spaceBetween: 3,
                    },
                    1024: {
                        slidesPerView: 7,
                        spaceBetween: 10,
                    },
                }}
                modules={[Pagination]}
                className="mySwiper"
            >
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, idx) => (
                        <SwiperSlide>
                            <CardContainer>
                                <Skeleton key={idx} className='card-skeleton' height='254px' width="190px" fadeDuration={3} style={{ width: '190px', height: '254px' }} />
                            </CardContainer>
                        </SwiperSlide>
                    ))
                ) : (
                    seriesData && seriesData.map((res, idx) => (
                        <SwiperSlide key={`series-card-${res.id}`}>
                            <Card2 className='mx-4 card-slider-item' title={res.name} imgUrl={res.poster_path} />
                        </SwiperSlide>
                    ))
                )}
            </Swiper>
        </ChakraProvider>
    );
};

export default SeriesCardSliderComponent;

