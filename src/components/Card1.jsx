import React from 'react';
import { Link } from 'react-router-dom';

const cardStyle = {
    width: '13rem',
    marginRight: '1rem',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
    marginBottom: '20px',
    transition: 'transform 0.2s',
    cursor: 'pointer',
};

const imageStyle = {
    width: '100%',  
    height: '100%',
    objectFit: 'cover',
};

const overlayStyle = {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7))',
    opacity: '0',
    transition: 'opacity 0.2s',
};

const cardTitleStyle = {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    color: 'white',
    fontSize: '1.2rem',
    fontWeight: 'bold',
};

const Card1 = ({ captionData, imageUrl, rating, redirectUrl }) => {
    const handleMouseEnter = (e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.querySelector('.overlay').style.opacity = '1';
    };

    const handleMouseLeave = (e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.querySelector('.overlay').style.opacity = '0';
    };

    return (
        // <Link to={`/movies/${imdbId}`}>
        <div
            className='card'
            style={cardStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {imageUrl ? (
                <img
                    src={`https://image.tmdb.org/t/p/w300/${imageUrl}`}
                    alt={captionData.title}
                    style={imageStyle}
                />
                ): (
                <img
                    src={`https://www.simplyrecipes.com/thmb/Xzggu-Md45HKhhYSw4DK8tGlZ_I=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Perfect-Popcorn-LEAD-41-4a75a18443ae45aa96053f30a3ed0a6b.JPG`}
                    alt={captionData.title}
                    style={imageStyle}
                />
            )}
            <div className="overlay" style={overlayStyle}>
                <div style={cardTitleStyle}>{captionData.name}</div>
            </div>
        </div>
        // </Link> 
    );
};

export default Card1;
