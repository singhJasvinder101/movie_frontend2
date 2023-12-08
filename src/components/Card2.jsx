
// Styled components for the card
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

const CardImage = styled(animated.img)`
width: 100%;
height: 100%;
object-fit: cover;
`;

const CardOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  backdrop-filter: blur(4px);
  padding: 20px;
  text-align: center;
  transform-origin: center center;
  
  &:hover {
    opacity: 1;
  }
`;

const CardTitle = styled.h3`
color: white;
font-size: 20px;
  margin-bottom: 10px;
`;

const CardButton = styled.button`
  background: black;
  color: grey;
  font-size: 1.2rem;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
  border: 2px solid grey;
  
  &:hover {
    background: white;
    border: 2px solid grey;
    color: black;
  }
  `;

import React from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';
import { useEffect } from 'react';
import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import { BsFillPlayFill } from 'react-icons/bs'
import { RxCross2 } from 'react-icons/rx'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Card2 = ({ title, imgUrl, showCross = false, setFetchAgain, fetchAgain }) => {
  const [imdbId, setImdbId] = useState("")
  const [isMovie, setIsMovie] = useState(false)

  const fetchData = async () => {
    try {
      // const response = await axios.get(`https://imdb-api.projects.thetuhin.com/search?query=${encodeURIComponent(title)}`);
      const response = await axios.get(`https://www.omdbapi.com/?s=${encodeURIComponent(title)}&apikey=e7db26be`);
      const data = response.data;
      // console.log(data)

      if (data.Search[0] && title) {
        const sortedItems = data.Search.sort((a, b) => b.Year - a.Year);
        // console.log(sortedItems[0]); 
        setImdbId(sortedItems[0].imdbID !== "/emmys" ? sortedItems[0].imdbID : sortedItems[1].imdbID);
        setIsMovie(data.Search[0].Type === "movie")
      }
    } catch (error) {
      console.log(error); 
    }
  };

  fetchData();

  const [hovered, setHovered] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URI;

  const cardProps = useSpring({
    transform: hovered ? 'scale(1.2)' : 'scale(1)',
  });

  const overlayProps = useSpring({
    opacity: hovered ? 1 : 0,
    transform: hovered ? 'scale(1)' : 'scale(1)',
  });

  const handleWatchList = async (name, id, imageUrl, isMovie) => {
    try {
      const category = isMovie ? "movies" : "series"
      const { data } = await axios.post(`${apiUrl}/api/users/watchlists`, {
        name, id, imageUrl, category
      }, {
        withCredentials: true,
      })
      if (data.success) {
        toast.success("Added to Watchlist", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "black",
          icon: "🔥"
        })
      }
    } catch (error) {
      toast.error("some error occoured", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "black",
      })
    }
  }

  const removeWatchList = async (id) => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/users/watchlists/id/${id}`, {
        withCredentials: true
      })
      if (data.success) {
        toast.success("Removed from Watchlist", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "black",
        })
        setFetchAgain(!fetchAgain)
      }
    } catch (error) {
      toast.error("some error occoured", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "black",
      })
    }
  }

  return (

    <CardContainer
      className='card2'
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={cardProps}
    >
      {/* {console.log(imgUrl)} */}
      <CardImage src={imgUrl && `https://image.tmdb.org/t/p/w185/${imgUrl}`} alt={title} />
      <CardOverlay style={overlayProps}>
        <button onClick={() => removeWatchList(imdbId)} className='cross-icon'>{showCross ? <RxCross2 /> : null}</button>
        <CardTitle>{title}</CardTitle>
        <div className="d-flex">
          <CardButton className='mx-2' onClick={() => handleWatchList(title, imdbId, imgUrl, isMovie)} >+</CardButton>
          <CardButton>
            {/* {!isMovie && console.log(imdbId)} */}
            <Link to={isMovie ? `/movies/${imdbId}` : `/series/${imdbId}/s/1/e/1`}>
              <BsFillPlayFill />
            </Link>
          </CardButton>
        </div>
      </CardOverlay>
    </CardContainer>
  );
};

export default Card2;
