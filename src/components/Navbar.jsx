import React, { useEffect, useState } from 'react';
import { RiCloseLine as RxCross2, RiMenuLine as RxHamburgerMenu } from 'react-icons/ri';
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md';
import { FiBookmark } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { logoutUser } from '../../redux/slices/loginRegisterSlice';
import { searchMoviesOrSeries } from '../utils/fetchMoviesVarities';
import { useDisclosure } from '@chakra-ui/react';
import ChakraModal from './ChakraModal';
import SideDrawerComponent from './SideDrawerComponent';
const apiUrl = import.meta.env.VITE_API_URI;

export default function MenuAppBar({ isToken }) {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [query, setQuery] = useState("")
    const [resultsData, setResultsData] = useState([])
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isTyping, setIsTyping] = useState(false)
    // to do: debounce function
    const navigate = useNavigate()

    const handleSearchOnChange = (e) => {
        if (e.key === "Enter") {
            setQuery(e.target.value)
        }
    }

    const userInfo = useSelector(state => state.userLoggedIn.userInfo)

    const dispatch = useDispatch()
    const handleLogout = async () => {
        dispatch(logoutUser())
    }
    useEffect(() => {
        onClose()
    }, [navigate])

    useEffect(() => {
        searchMoviesOrSeries(query)
            .then(res => {
                console.log(res)
                setResultsData(res)
            })
    }, [query])

    return (
        <div className={`App ${showMobileMenu ? 'mobile-menu-active' : ''}`}>
            <nav className="navbar">
                <div className="left d-flex mx-0 justify-content-between align-items-center">
                    {window.innerWidth <= 1068 ? (
                        <SideDrawerComponent />
                    ) : null}
                    <div className="logo">
                        <Link to="/home" style={{ textDecoration: 'none' }} >
                            <span className="netflix">MOVIE</span>
                            <span className="prime">TIME</span>
                        </Link>
                    </div>
                    <ul className={`nav-links`}>
                        <li><Link to="/home">Home</Link></li>
                        <li>
                            <Link to="/hollywood">Hollywood</Link>
                        </li>
                        <li><Link to="/bollywood">Bollywood</Link></li>
                        <li>
                            <Link to="/watchlists">Watchlists</Link>
                        </li>
                    </ul>
                </div>
                <div className='search-icon right mx-1'>
                    <ChakraModal
                        resultsData={resultsData}
                        handleSearchOnChange={handleSearchOnChange}
                        setQuery={setQuery}
                        onClose={onClose}
                        isOpen={isOpen}
                        onOpen={onOpen}
                    >
                        <FontAwesomeIcon className='text-white mx-3' icon={faSearch} />
                    </ChakraModal>
                    {userInfo.isAdmin ? (
                        <li className="nav-item">
                            <Link
                                className="nav-link position-relative"
                                style={{ fontSize: '1rem' }}
                                to="/admin/orders">
                                Admin
                                <span
                                    className="position-absolute top-5 start-100 translate-middle p-2 bg-success border border-light rounded-circle"
                                >
                                </span>
                            </Link>
                        </li>
                    ) : isToken && !userInfo.isAdmin ? (<button onClick={handleLogout} className='btn btn-danger mx-1'>Logout</button>)
                        : (
                            <>
                                <Link to="/login" className='login btn btn-danger mx-1'>Login</Link>
                                <Link to="/register" className='signup mx-2'>Sign Up</Link>
                            </>
                        )}
                </div>
            </nav>
        </div>
    );
}
