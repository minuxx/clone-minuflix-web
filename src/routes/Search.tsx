import { useLocation, useMatch, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { IGetMdediasResult, searchMedia } from '../api'
import styled from 'styled-components'
import Slider from '../components/Slider'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll } from 'framer-motion'
import { makeImagePath } from '../utils'

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

function Search() {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParam = new URLSearchParams(location.search)
  const keyword = searchParam.get('keyword')
  const movieId = searchParam.get('movie')
  const tvShowId = searchParam.get('tv')
  const { scrollY } = useScroll()
  const { data, isLoading, refetch } = useQuery<IGetMdediasResult>(
    ['search'],
    () => searchMedia(keyword || '')
  )
  const [sliderTtile, setSliderTitle] = useState('')
  const bigMediaMatch = useMatch(`/search?${searchParam.get('movie')}`)

  useEffect(() => {
    refetch()
  }, [keyword, refetch])

  const movies = data?.results.filter((m) => m.media_type === 'movie') || []
  const tvShows = data?.results.filter((m) => m.media_type === 'tv') || []

  const onBoxClick = (mediaId: number, title: string, mdeiaType?: string) => {
    setSliderTitle(title)
    navigate(`/search?keyword=${keyword}&${mdeiaType}=${mediaId}`)
  }

  const onOverlayClick = () => navigate(`/search?keyword=${keyword}`)
  const clickedMedia =
    (movieId && movies.find((m) => String(m.id) === movieId)) ||
    (tvShowId && tvShows.find((t) => String(t.id) === tvShowId))

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

          <AnimatePresence>
            {movieId || tvShowId ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  layoutId={(movieId || tvShowId) + sliderTtile}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {clickedMedia && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMedia.backdrop_path ||
                              clickedMedia.poster_path,
                            'w500'
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMedia.title}</BigTitle>
                      <BigOverview>{clickedMedia.overview}</BigOverview>
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

export default Search
