import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Card2 from '../../components/Card2';

const WatchListsPage = () => {
    const [allWatchLists, setAllWatchLists] = useState([])
    const [fetchAgain, setFetchAgain] = useState(false)
    const apiUrl = import.meta.env.VITE_API_URI;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`${apiUrl}/api/users/watchlists`, {
                    withCredentials: true
                })
                if (data.success) {
                    console.log(data.watchLists)
                    setAllWatchLists(data.watchLists)
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchData()
    }, [fetchAgain])

    return (
        <div>
            {allWatchLists.length > 0 ? (
                <div className='container d-flex flex-wrap my-3'>
                    {allWatchLists.map((res, index) => (
                        <>
                            {res.imageUrl && <div className='mx-3 my-3' key={`movies-card-${index}`}>
                                <Card2 fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} showCross={true} className='card-slider-item' title={res.name} imgUrl={res.imageUrl} />
                            </div>}
                        </>
                    ))}
                </div>
            ) : (
                <div className="d-flex justify-content-center align-items-center">
                    <h1>No Watchlists</h1>
                </div>
            )}
        </div>
    )
}

export default WatchListsPage
