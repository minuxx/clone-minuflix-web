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

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
  border: 0;
`

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  color: ${(props) => props.theme.white.lighter};
  top: -80px;
`

function Home() {
  const navigate = useNavigate()
  const bigMovieMatch = useMatch('/movies/:id')
  const { scrollY } = useScroll()
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

  const onOverlayClick = () => navigate('/')
  const clickedMovie =
    bigMovieMatch?.params.id &&
    (nowPlayingData?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.id
    ) ||
      topRatedData?.results.find(
        (movie) => String(movie.id) === bigMovieMatch.params.id
      ) ||
      upcomingData?.results.find(
        (movie) => String(movie.id) === bigMovieMatch.params.id
      ))

  const onBoxClick = (mediaId: number, sliderTitle: string) => {
    setSliderTitle(sliderTitle)
    navigate(`/movies/${mediaId}`)
  }

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

          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  layoutId={bigMovieMatch.params.id + sliderTtile}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path ||
                              clickedMovie.poster_path,
                            'w500'
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  )
}

export default Home
