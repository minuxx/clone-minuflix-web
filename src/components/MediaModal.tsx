import { AnimatePresence, motion, useScroll } from 'framer-motion'
import styled from 'styled-components'
import { getMedia, IGetMediaResult, IMedia } from '../api'
import { makeImagePath } from '../utils'
import { useQuery } from 'react-query'

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`

const CloseButton = styled.button`
  font-size: 18px;
  color: ${(props) => props.theme.white.lighter};
  background-color: transparent;
  border: none;
  position: absolute;
  top: 0;
  right: 0;
  padding: 20px;
  cursor: pointer;
`

const Modal = styled(motion.div)`
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

const Cover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`

const Title = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 38px;
  max-width: 40vw;
  position: relative;
  top: -80px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const Info = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  color: ${(props) => props.theme.white.lighter};
  padding: 10px 20px;
  top: -80px;
`

const Date = styled.span`
  font-size: 13px;
  font-weight: 300;
  color: ${(props) => props.theme.white.darker};
  margin-bottom: 8px;
`

const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`

const Vote = styled.span`
  width: fit-content;
  font-size: 16px;
  font-weight: 400;
  color: ${(props) => props.theme.white.darker};
  border: 1px solid ${(props) => props.theme.white.darker};
  border-radius: 4px;
  padding: 4px 8px 2px 8px;
`

const Popularity = styled.span`
  margin-left: auto;
  font-size: 18px;
  font-weight: 500;
  padding-top: 2px;
  color: ${(props) => props.theme.white.darker};
`

const GenreBox = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`

const Genre = styled.span`
  width: fit-content;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.black.lighter};
  background-color: ${(props) => props.theme.white.darker};
  border-radius: 20px;
  padding: 5px 10px 3px 10px;
`

const Overview = styled.p`
  font-size: 18px;
`

interface IMediaModalProps {
  media: IMedia | undefined
  mediaType: string
  sliderTitle: string
  onOverlayClick: () => void
}

function MediaModal({
  media,
  mediaType,
  sliderTitle,
  onOverlayClick,
}: IMediaModalProps) {
  const { scrollY } = useScroll()
  const { data, isLoading, error } = useQuery<IGetMediaResult>(
    ['movie', media?.id],
    () => getMedia(mediaType, media?.id || -1),
    { enabled: !!media }
  )

  if (error) return null

  return (
    <AnimatePresence>
      {media ? (
        <>
          <Overlay
            onClick={onOverlayClick}
            exit={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
          <Modal
            layoutId={media.id + sliderTitle}
            style={{ top: scrollY.get() + 100 }}
          >
            {media && (
              <>
                <Cover
                  style={{
                    backgroundImage: `linear-gradient(to top, black, transparent),url(${makeImagePath(
                      media.backdrop_path || media.poster_path,
                      'w500'
                    )})`,
                  }}
                />
                <CloseButton onClick={onOverlayClick}>X</CloseButton>
                <Title>{media.title || media.name}</Title>

                <Info>
                  <Date>
                    {data?.first_air_date || data?.release_date || ''}
                  </Date>

                  <InfoHeader>
                    <Vote>🍿 {data?.vote_average.toFixed(1) || 0} / 10</Vote>
                    <Popularity>🔥 {data?.popularity.toFixed(1)}%</Popularity>
                  </InfoHeader>

                  <GenreBox>
                    {data?.genres.map((g, index) => (
                      <Genre key={index}>{g.name}</Genre>
                    ))}
                  </GenreBox>

                  <Overview>{media.overview}</Overview>
                </Info>
              </>
            )}
          </Modal>
        </>
      ) : null}
    </AnimatePresence>
  )
}

export default MediaModal
