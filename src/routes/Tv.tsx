import { useQuery } from 'react-query'
import {
  getAiringTodayTvShows,
  getPopularTvShows,
  getTopRatedTvShows,
  IGetMdediasResult,
} from '../api'
import styled from 'styled-components'
import { makeImagePath } from '../utils'
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

function Tv() {
  const navigate = useNavigate()
  const bigTvShowsMatch = useMatch('/tv/:id')
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

  const clickedTvShow =
    airingTodayData?.results.find(
      (tvShows) => String(tvShows.id) === bigTvShowsMatch?.params.id
    ) ||
    popularData?.results.find(
      (tvShows) => String(tvShows.id) === bigTvShowsMatch?.params.id
    ) ||
    topRatedData?.results.find(
      (tvShows) => String(tvShows.id) === bigTvShowsMatch?.params.id
    )

  const onBoxClick = (mediaId: number, sliderTitle: string) => {
    setSliderTitle(sliderTitle)
    navigate(`/tv/${mediaId}`)
  }
  const onOverlayClick = () => navigate('/tv')

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

          <MediaModal
            media={clickedTvShow}
            sliderTitle={sliderTtile}
            onOverlayClick={onOverlayClick}
          />
        </>
      )}
    </Wrapper>
  )
}

export default Tv
