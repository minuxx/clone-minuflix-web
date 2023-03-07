import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { IGetMdediasResult, searchMedia } from '../api'
import styled from 'styled-components'
import Slider from '../components/Slider'
import { useEffect, useState } from 'react'
import MediaModal from '../components/MediaModal'
import Loader from '../components/Loader'

const Wrapper = styled.div`
  background-color: black;
  padding-bottom: 250px;
  overflow: hidden;
`

const Top = styled.div`
  padding: 80px 30px 20px 30px;
`

const Keyword = styled.h2`
  font-size: 80px;
  color: ${(props) => props.theme.white.lighter};
  font-weight: 900;
`

function Search() {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParam = new URLSearchParams(location.search)
  const keyword = searchParam.get('keyword')
  const movieId = searchParam.get('movie')
  const tvShowId = searchParam.get('tv')
  const { data, isLoading, refetch } = useQuery<IGetMdediasResult>(
    ['search'],
    () => searchMedia(keyword || '')
  )
  const [sliderTtile, setSliderTitle] = useState('')

  useEffect(() => {
    refetch()
  }, [keyword, refetch])

  const movies = data?.results.filter((m) => m.media_type === 'movie') || []
  const tvShows = data?.results.filter((m) => m.media_type === 'tv') || []

  const clickedMedia =
    movies.find((m) => String(m.id) === movieId) ||
    tvShows.find((t) => String(t.id) === tvShowId)

  const onBoxClick = (mediaId: number, title: string, mdeiaType?: string) => {
    setSliderTitle(title)
    navigate(`/search?keyword=${keyword}&${mdeiaType}=${mediaId}`)
  }
  const onOverlayClick = () => navigate(`/search?keyword=${keyword}`)

  return (
    <Wrapper>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Top>
            <Keyword>{keyword?.toUpperCase()}</Keyword>
          </Top>
          {movies.length !== 0 && (
            <Slider
              sliderTitle="🍿 Movies"
              data={movies}
              mediaType="movie"
              onBoxClick={onBoxClick}
            />
          )}

          {tvShows.length !== 0 && (
            <Slider
              sliderTitle="📺 Tv Shows"
              data={tvShows}
              mediaType="tv"
              onBoxClick={onBoxClick}
            />
          )}

          <MediaModal
            media={clickedMedia}
            sliderTitle={sliderTtile}
            onOverlayClick={onOverlayClick}
          />
        </>
      )}
    </Wrapper>
  )
}

export default Search
