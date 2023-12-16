import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { useEffect, useState } from 'react'
import ProtectedRouteComponent from './components/ProtectedRouteComponent'
import AdminUserDetailsPage from './pages/admin pages/AdminUserDetailsPage'
import TvSeriesShowPage from './pages/user pages/TvSeriesShowPage'
import MoviesShowPage from './pages/user pages/MoviesShowPage'
import ScrollToTop from './components/ScrollToTop'
import MainPage from './pages/MainPage'
import Hollywood from './pages/user pages/HollywoodMovies'
import BollywoodMovies from './pages/user pages/BollywoodMovies'
import WatchListsPage from './pages/user pages/WatchListsPage'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isloggedin, setIsloggedin] = useState(false)
  const [isToken, setIsToken] = useState(false)
  const [fetchAgain, setFetchAgain] = useState(false)

  const disableInspect = () => {
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.onkeydown = (e) => {
      // Disable F12, Ctrl + Shift + I, Ctrl + Shift + J, Ctrl + U
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && e.key === 'I') || // Ctrl + Shift + I
        (e.ctrlKey && e.shiftKey && e.key === 'J') || // Ctrl + Shift + J
        (e.ctrlKey && e.key === 'U') // Ctrl + U
      ) {
        e.preventDefault();
      }
    };
  };

  useEffect(() => {
    disableInspect();
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 3000);
    setIsloggedin(localStorage.getItem("userInfo"))
  }, [])



  return (
    <div className='App'>
      {isLoading ? (
        <div className='loading-gif my-5'>
          <img className='my-3 mx-auto' src="https://media.tenor.com/CLVR-rgpQL8AAAAi/popcorn-joypixels.gif" alt="" />
        </div>
      ) : (
        <>
          <ToastContainer />
          <Router>
            <ScrollToTop />
            <ChakraProvider>
                <Navbar setFetchAgain={setFetchAgain} isToken={isToken}/>
            </ChakraProvider>
            <Routes>
              <Route exact path='/' element={isloggedin ? <Home fetchAgain={fetchAgain} /> : <MainPage />} />
                <Route element={<ProtectedRouteComponent setIsToken={setIsToken} isAuthenticated={true} admin={false} />}>
                <Route path='/home' element={<Home fetchAgain={fetchAgain} />} />
                <Route path='/hollywood' element={<Hollywood />} />
                <Route path='/bollywood' element={<BollywoodMovies />} />
                  <Route path='/series/s/:season_number/e/:episode_number' element={<TvSeriesShowPage fetchAgain={fetchAgain} />} />
                  <Route path='/movies/' element={<MoviesShowPage fetchAgain={fetchAgain} />} />
                <Route path='/watchlists' element={<WatchListsPage />} />
              </Route>
              <Route element={<ProtectedRouteComponent admin={true} />}>
                <Route path='/admin' element={<AdminUserDetailsPage />} />
              </Route>
              <Route path='/login' element={<LoginPage />} />
              <Route path='/register' element={<RegisterPage />} />
            </Routes>
          </Router >
        </>
      )}
    </div>
  )
}

export default App
