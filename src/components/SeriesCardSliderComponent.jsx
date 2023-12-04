import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Card1 from './Card1';
import { useEffect, useState } from 'react';
import { gettingMoviesOfGenres, gettingSeriesOfGenre } from '../utils/fetchMoviesVarities';
import Card2 from './Card2';
import { LinkContainer } from 'react-router-bootstrap';
import Loader1Component from './Loader1Component';

const tmdbApiKey = import.meta.env.tmdbApiKey

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


    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToScroll: 4,
        centerMode: false,
        // slidesToShow: data.length >= 6 ? 4 : data.length,
        slidesToScroll: 3,
        centerPadding: "10px",
        variableWidth: true,
        slidesToShow: 1,
    };

    return (
        <>
        {isLoading ? (
            <Loader1Component />
        ): (
            <Slider className='mx-3' {...settings}>
                {seriesData && seriesData.map((res, idx) => (
                    <div key={`series-card-${res.id}`}>
                        <Card2 className='mx-4 card-slider-item' title={res.name} imgUrl={res.poster_path} />
                    </div>
                ))}
            </Slider>
        )}
        </>
    );
};

export default SeriesCardSliderComponent;

