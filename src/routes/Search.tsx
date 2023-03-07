import { useLocation } from 'react-router-dom'
import { useQuery } from 'react-query'
import { IGetMdediasResult, searchMedia } from '../api'
import styled from 'styled-components'
import Slider from '../components/Slider'
import { useEffect } from 'react'

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

const Top = styled.div`
  padding: 80px 30px 20px 30px;
`

const Keyword = styled.h2`
  font-size: 80px;
  color: ${(props) => props.theme.white.lighter};
  font-weight: 900;
`

function Search() {
  const location = useLocation()
  const keyword = new URLSearchParams(location.search).get('keyword')
  const { data, isLoading, refetch } = useQuery<IGetMdediasResult>(
    ['search'],
    () => searchMedia(keyword || '')
  )

  useEffect(() => {
    refetch()
  }, [keyword, refetch])

  const movies = data?.results.filter((m) => m.media_type === 'movie') || []
  const tvShows = data?.results.filter((m) => m.media_type === 'tv') || []

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Top>
            <Keyword>{keyword?.toUpperCase()}</Keyword>
          </Top>
          {movies.length !== 0 && (
            <Slider mediaType="movies" title="🍿 Movies" data={movies} />
          )}

          {tvShows.length !== 0 && (
            <Slider mediaType="tv" title="📺 Tv Shows" data={tvShows} />
          )}
        </>
      )}
    </Wrapper>
  )
}

export default Search
