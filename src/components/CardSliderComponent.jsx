import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Card1 from './Card1';
import { useEffect, useState } from 'react';
import { gettingMoviesOfGenres, gettingSeriesOfGenre } from '../utils/fetchMoviesVarities';
import Card2 from './Card2';
import Loader1Component from './Loader1Component';

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
        variableWidth: true,
        slidesToShow: 1,
    };

    return (
        <>
            <Slider className='mx-3' {...settings}>
                {isLoading ? (
                    <Loader1Component/>
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
        </>
    );
};

export default CardSlider;

