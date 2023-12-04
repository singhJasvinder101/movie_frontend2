import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'

const SideDrawerComponent = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()
    return (
        <div>
            {/* ${showMobileMenu ? 'show-mobile-menu justify-content-between align-items-center' : '' */}
            <span ref={btnRef} colorScheme='teal' onClick={onOpen}>
                {children}
            </span>
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent className='bg-dark text-light'>
                    <DrawerCloseButton />

                    <DrawerBody className='bg-dark'>
                        <ul className={`mobile-links`}>
                            <li><Link to="/home">Home</Link></li>
                            <li>
                                <Link to="/hollywood">Hollywood</Link>
                            </li>
                            <li><Link to="/bollywood">Bollywood</Link></li>
                            <li>
                                <Link to="/watchlists">Watchlists</Link>
                            </li>
                        </ul>
                    </DrawerBody>

                    <DrawerFooter className='d-flex justify-content-center'>
                        Enjoy Movies 😄
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default SideDrawerComponent
