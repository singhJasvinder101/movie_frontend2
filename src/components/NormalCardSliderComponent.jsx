import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Card1 from './Card1';
import { Link } from 'react-router-dom';

const tmdbApiKey = import.meta.env.tmdbApiKey

const NormalCardSliderComponent = ({ season, imdbId }) => {

    const settings = {
        dots: false,
        speed: 500,
        centerMode: false,
        slidesToScroll: 3,
        centerPadding: "10px",
        variableWidth: true,
        slidesToShow: 1,
    };

    return (
        <>
            <Slider className='mx-3' {...settings}>
                {season.episodes.map((episode, index) => (
                    <Link key={`episode-${index}`} to={`/series/${imdbId}/s/${season.seasonNumber}/e/${episode.episodeNumber}`}>
                        <Card1 captionData={episode} imageUrl={episode.imageUrl}/>
                    </Link>
                ))}
            </Slider>
        </>
    );
};

export default NormalCardSliderComponent;

