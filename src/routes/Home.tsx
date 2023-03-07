import { useQuery } from 'react-query'
import {
  getNowPlayingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  IGetMdediasResult,
} from '../api'
import styled from 'styled-components'
import { makeImagePath } from '../utils'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import { useMatch, useNavigate } from 'react-router-dom'
import Slider from '../components/Slider'
import { useState } from 'react'
import MediaModal from '../components/MediaModal'

const Wrapper = styled.div`
  background-color: black;
  padding-bottom: 250px;
  overflow: hidden;
`

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`

const Overview = styled.p`
  font-size: 36px;
  width: 50%;
`

function Home() {
  const navigate = useNavigate()
  const bigMovieMatch = useMatch('/movies/:id')
  const [sliderTtile, setSliderTitle] = useState('')

  const useMultipleQuery = () => {
    const nowPlaying = useQuery<IGetMdediasResult>(
      ['movies', 'nowPlaying'],
      getNowPlayingMovies
    )
    const topRated = useQuery<IGetMdediasResult>(
      ['movies', 'topRated'],
      getTopRatedMovies
    )
    const upcoming = useQuery<IGetMdediasResult>(
      ['movies', 'upcoming'],
      getUpcomingMovies
    )
    return [nowPlaying, topRated, upcoming]
  }

  const [
    { isLoading: loadingNowPlaying, data: nowPlayingData },
    { isLoading: loadingtopRated, data: topRatedData },
    { isLoading: loadingupcoming, data: upcomingData },
  ] = useMultipleQuery()

  const isLoading = loadingNowPlaying && loadingtopRated && loadingupcoming

  const clickedMovie =
    nowPlayingData?.results.find(
      (movie) => String(movie.id) === bigMovieMatch?.params.id
    ) ||
    topRatedData?.results.find(
      (movie) => String(movie.id) === bigMovieMatch?.params.id
    ) ||
    upcomingData?.results.find(
      (movie) => String(movie.id) === bigMovieMatch?.params.id
    )

  const onBoxClick = (mediaId: number, sliderTitle: string) => {
    setSliderTitle(sliderTitle)
    navigate(`/movies/${mediaId}`)
  }
  const onOverlayClick = () => navigate('/')

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(
              nowPlayingData?.results[0].backdrop_path || ''
            )}
          >
            <Title>{nowPlayingData?.results[0].title}</Title>
            <Overview>{nowPlayingData?.results[0].overview}</Overview>
          </Banner>

          <Slider
            sliderTitle="🍿 Now Playing"
            mediaType="movie"
            onBoxClick={onBoxClick}
            data={nowPlayingData?.results.slice(1) || []}
          />

          <Slider
            sliderTitle="✨ Top Rated"
            mediaType="movie"
            onBoxClick={onBoxClick}
            data={topRatedData?.results || []}
          />

          <Slider
            sliderTitle="🔥 Upcoming"
            mediaType="movie"
            onBoxClick={onBoxClick}
            data={upcomingData?.results || []}
          />

          <MediaModal
            media={clickedMovie}
            sliderTitle={sliderTtile}
            onOverlayClick={onOverlayClick}
          />
        </>
      )}
    </Wrapper>
  )
}

export default Home
