import React from 'react'
import { RxHamburgerMenu } from 'react-icons/rx'
import { Link } from 'react-router-dom'
import Drawer from 'react-modern-drawer'

import 'react-modern-drawer/dist/index.css'
import { IoClose } from "react-icons/io5";

const SideDrawerComponent = () => {
    const btnRef = React.useRef()
    const [isOpen, setIsOpen] = React.useState(false)
    const toggleDrawer = () => {
        setIsOpen((prevState) => !prevState)
    }

    return (
        <>
            {/* ${showMobileMenu ? 'show-mobile-menu justify-content-between align-items-center' : '' */}
            <button onClick={toggleDrawer}>
                <RxHamburgerMenu className='menu-btn' />
            </button>
            <Drawer
                open={isOpen}
                onClose={toggleDrawer}
                direction='left'
                className='bg-dark text-light w-[12rem]'
            >
                <button className='close-drawer-btn'>
                    <IoClose onClick={toggleDrawer} />
                </button>
                <div className="bg-dark text-light">
                    <ul className={`mobile-links`}>
                        <li><Link to="/">Home</Link></li>
                        <li>
                            <Link to="/hollywood">Hollywood</Link>
                        </li>
                        <li><Link to="/bollywood">Bollywood</Link></li>
                        <li>
                            <Link to="/watchlists">Watchlists</Link>
                        </li>
                    </ul>
                </div>
                <div className="footer text-center mt-5 pt-3">
                    Enjoy Movies 😄
                </div>
            </Drawer>
        </>
    )
}

export default SideDrawerComponent
