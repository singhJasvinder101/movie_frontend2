import React, { useEffect, useState } from 'react'
import { HollyWood } from '../../utils/fetchMoviesVarities'
import Card2 from '../../components/Card2'
import Loader1Component from '../../components/Loader1Component'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer';
import ClipLoader from "react-spinners/ClipLoader";

const Hollywood = () => {
  const { ref, inView } = useInView();

  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage
  } = useInfiniteQuery({
    queryKey: ['hollywood'],
    queryFn: HollyWood,
    pageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // console.log({lastPage, allPages})
      // return allPages.length + 1;
      const nextPage = lastPage.length ? allPages.length + 1 : undefined;
      return nextPage;
    },
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      // console.log("!fire")      
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])


  return (
    <div className='d-flex justify-content-center flex-wrap my-5'>
      {status === 'loading' ? (
        <Loader1Component />
      ) : (
        data?.pages.map((page, idx) =>
          page.map((res, index) => (
            page.length === index + 1 ? (
              <div key={`movies-card-${index}`}>
                <Card2 innerRef={ref} className='mx-4 card-slider-item' imdbId={res.id} title={res.title} imgUrl={res.poster_path} />
              </div>
            ) : (
              <div key={`movies-card-${index}`}>
                <Card2 className='mx-4 card-slider-item' imdbId={res.id} title={res.title} imgUrl={res.poster_path} />
              </div>
            )
          ))
        )
      )}
      {/* {hasNextPage && (
        <button ref={ref} onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? <ClipLoader
            className='mx-3'
            color={"#ffffff"}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          /> : null}
        </button>
      )} */}

      {isFetchingNextPage ? <ClipLoader
        className='mx-3'
        color={"#ffffff"}
        size={100}
        aria-label="Loading Spinner"
        data-testid="loader"
      /> : null}
    </div>
  )
}

export default Hollywood
