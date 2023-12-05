import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'

const ChakraModal = ({ resultsData, handleSearchOnChange, setQuery, children, onClose, isOpen, onOpen }) => {
    // const { isOpen, onOpen } = useDisclosure()
    return (
        <div>
            <Link onClick={onOpen}>{children}</Link>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader className='text-dark'>Search Movies/Series</ModalHeader>
                    <ModalCloseButton className='text-dark mt-2 mx-2' />
                    <ModalBody className=''>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search..."
                                onKeyPress={handleSearchOnChange}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>

                        <div className='text-dark sample-results'>
                            <h5 className='mx-2'>Featured Results</h5>
                            <ul>
                                {resultsData && resultsData.map((res, idx) => (
                                    res.type === "movie" ? (
                                        <li><Link to={`/movies/${res.id}`}>{res.title}</Link> </li>
                                    ) : (
                                        <li><Link to={`/series/${res.id}/s/1/e/1`}>{res.title}</Link></li>
                                    )
                                ))}
                            </ul>
                        </div>
                    </ModalBody>

                </ModalContent>
            </Modal>
        </div>
    )
}

export default ChakraModal
