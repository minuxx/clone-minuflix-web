import { AnimatePresence, motion, useScroll } from 'framer-motion'
import styled from 'styled-components'
import { IMedia } from '../api'
import { makeImagePath } from '../utils'

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
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
  border: 0;
`

const Title = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`

const Overview = styled.p`
  padding: 20px;
  position: relative;
  color: ${(props) => props.theme.white.lighter};
  top: -80px;
`

interface IMediaModalProps {
  media: IMedia | undefined
  sliderTitle: string
  onOverlayClick: () => void
}

function MediaModal({ media, sliderTitle, onOverlayClick }: IMediaModalProps) {
  const { scrollY } = useScroll()
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
                <Title>{media.title || media.name}</Title>
                <Overview>{media.overview}</Overview>
              </>
            )}
          </Modal>
        </>
      ) : null}
    </AnimatePresence>
  )
}

export default MediaModal
