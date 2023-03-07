import { useQuery } from 'react-query'
import {
  getAiringTodayTvShows,
  getPopularTvShows,
  getTopRatedTvShows,
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

const SliderWrapper = styled.div``

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

function Tv() {
  const navigate = useNavigate()
  const bigTvShowsMatch = useMatch('/tv/:id')
  const { scrollY } = useScroll()
  const [sliderTtile, setSliderTitle] = useState('')

  const useMultipleQuery = () => {
    const airingToday = useQuery<IGetMdediasResult>(
      ['tvShows', 'airingToday'],
      getAiringTodayTvShows
    )
    const popular = useQuery<IGetMdediasResult>(
      ['tvShows', 'popular'],
      getPopularTvShows
    )
    const topRated = useQuery<IGetMdediasResult>(
      ['tvShows', 'topRated'],
      getTopRatedTvShows
    )
    return [airingToday, popular, topRated]
  }

  const [
    { isLoading: loadingAiringToday, data: airingTodayData },
    { isLoading: loadingPopular, data: popularData },
    { isLoading: loadingTopRated, data: topRatedData },
  ] = useMultipleQuery()

  const isLoading = loadingAiringToday && loadingPopular && loadingTopRated

  const onOverlayClick = () => navigate('/tv')
  const clickedTv =
    bigTvShowsMatch?.params.id &&
    (airingTodayData?.results.find(
      (tvShows) => String(tvShows.id) === bigTvShowsMatch.params.id
    ) ||
      popularData?.results.find(
        (tvShows) => String(tvShows.id) === bigTvShowsMatch.params.id
      ) ||
      topRatedData?.results.find(
        (tvShows) => String(tvShows.id) === bigTvShowsMatch.params.id
      ))

  const onBoxClick = (mediaId: number, sliderTitle: string) => {
    setSliderTitle(sliderTitle)
    navigate(`/tv/${mediaId}`)
  }

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(
              airingTodayData?.results[0].backdrop_path || ''
            )}
          >
            <Title>{airingTodayData?.results[0].name}</Title>
            <Overview>{airingTodayData?.results[0].overview}</Overview>
          </Banner>

          <Slider
            sliderTitle="👀 Airing Today"
            mediaType="tv"
            onBoxClick={onBoxClick}
            data={airingTodayData?.results.slice(1) || []}
          />

          <Slider
            sliderTitle="🦄 Popular"
            mediaType="tv"
            onBoxClick={onBoxClick}
            data={popularData?.results || []}
          />

          <Slider
            sliderTitle="✨ Top Rated"
            mediaType="tv"
            onBoxClick={onBoxClick}
            data={topRatedData?.results || []}
          />

          <AnimatePresence>
            {bigTvShowsMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  layoutId={bigTvShowsMatch.params.id + sliderTtile}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {clickedTv && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedTv.backdrop_path || clickedTv.poster_path,
                            'w500'
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedTv.name}</BigTitle>
                      <BigOverview>{clickedTv.overview}</BigOverview>
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

export default Tv
