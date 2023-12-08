import React, { useEffect, useState } from 'react'
import { Bollywood } from '../../utils/fetchMoviesVarities'
import Card2 from '../../components/Card2'
import Loader1Component from '../../components/Loader1Component'
import { useQuery } from '@tanstack/react-query'

const BollywoodMovies = () => {
    // const [data, setData] = useState([])
    // const [isLoading, setIsLoading] = useState(true)

    // useEffect(() => {
    //     Bollywood()
    //         .then(data => {
    //             setData(data)
    //             setIsLoading(false)
    //         })
    //         .catch(err => console.log(err))
    // }, [])
    const { data, isLoading } = useQuery({
        queryKey: ['bollywood'],
        queryFn: Bollywood,
        staleTime: 1000 * 60 * 300 // 5 hrs
    });

    return (
        <div className='d-flex justify-content-center flex-wrap my-5'>
            {isLoading ? (
                <Loader1Component />
            ) : (
                data && data.map((res, index) => (
                    <>
                        {res.poster_path && <div key={`movies-card-${index}`}>
                            <Card2 className='mx-4 card-slider-item' title={res.title} imgUrl={res.poster_path} />
                        </div>}
                    </>
                )
                ))}
        </div>
    )
}

export default BollywoodMovies
