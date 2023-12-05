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

const tmdbApiKey = import.meta.env.tmdbApiKey

const CardSlider = ({ id, seriesId }) => {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        gettingMoviesOfGenres(id).then(data => {
            //   console.log(data.results)
            setData(data.results && data.results)
            setIsLoading(false)
        }).catch(err => console.log(err))
    }, [id])



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
        height: 20rem;
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
            <Slider className='mx-3' {...settings}>
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, idx) => (
                        <CardContainer>
                            <Skeleton key={idx} className='' height='254px' width="190px" fadeDuration={1} style={{ width: '190px', height: '254px' }} />
                        </CardContainer>
                    ))
                ) : (
                    data && data.map((res, index) => (
                        <>
                            <div key={`movies-card-${index}`}>
                                <Card2 className='mx-4 card-slider-item' title={res.title} imgUrl={res.poster_path} />
                            </div>
                        </>
                    )
                    ))}
            </Slider>
        </ChakraProvider>
    );
};

export default CardSlider;

