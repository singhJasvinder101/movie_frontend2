import React, { useEffect, useState } from 'react'
import { HollyWood } from '../../utils/fetchMoviesVarities'
import Card2 from '../../components/Card2'
import Loader1Component from '../../components/Loader1Component'
import { useQuery } from '@tanstack/react-query'

const Hollywood = () => {
  // const [data, setData] = useState([])
  // const [isLoading, setIsLoading] = useState(true)

  // useEffect(() => {
  //   HollyWood()
  //     .then(data => {
  //       setData(data)
  //       setIsLoading(false)
  //     })
  //     .catch(err => console.log(err))
  // }, [])
  const { data, isLoading } = useQuery({
    queryKey: ['hollywood'],
    queryFn: HollyWood,
    staleTime: 1000 * 60 * 300 // 5 hrs
  });

  return (
    <div className='d-flex justify-content-center flex-wrap my-5'>
      {isLoading ? (
        <Loader1Component />
      ) : (
        data && data.map((res, index) => (
          <>
            <div key={`movies-card-${index}`}>
              <Card2 className='mx-4 card-slider-item' title={res.title} imgUrl={res.poster_path} />
            </div>
          </>
        )
        ))}
    </div>
  )
}

export default Hollywood
