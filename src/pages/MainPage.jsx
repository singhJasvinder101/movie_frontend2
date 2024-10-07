import React from 'react'
import { Link } from 'react-router-dom'

const MainPage = () => {
  return (
    <div>
      <div className='mainPage container'>
        <div className="mainPageContent text-center">
          <h1>Unlimited movies, TV shows and more</h1>
          <p>Watch anywhere. Cancel anytime.</p>
          <Link to='/register' className='btn my-4 px-5 py-2 mainPage-btn' style={{backgroundColor: 'red', color: 'white'}}>Sign Up</Link>
        </div>
      </div>
    </div>
  )
}

export default MainPage
