import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import styled from 'styled-components'
import { IMedia } from '../api'
import { makeImagePath } from '../utils'

const Container = styled.div`
  height: 300px;
`

const Title = styled.h3`
  font-size: 24px;
  font-weight: 400;
  padding-left: 25px;
  margin-bottom: 30px;
  color: ${(props) => props.theme.white.lighter};
`

const SliderWrapper = styled.div`
  position: relative;
  top: -20px;
`

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;

  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`

const PrevButton = styled(motion.button)`
  display: flex;
  align-items: center;
  height: 200px;
  width: 50px;
  position: absolute;
  top: 0;
  left: 0;
  border: none;
  background-color: transparent;
  cursor: pointer;
`

const NextButton = styled(motion.button)`
  display: flex;
  align-items: center;
  position: absolute;
  height: 200px;
  width: 50px;
  top: 0;
  right: 0;
  border: none;
  background-color: transparent;
  cursor: pointer;
`

const Info = styled(motion.div)`
  padding: 10px;
  background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;

  h4 {
    font-size: 18px;
    font-weight: 400;
    text-align: start;
  }
`

const rowVariants = {
  hidden: (isNextMove: boolean) => ({
    x: isNextMove ? window.innerWidth + 5 : -window.innerWidth - 5,
  }),
  visible: {
    x: 0,
  },
  exit: (isNextMove: boolean) => ({
    x: isNextMove ? -window.innerWidth - 5 : window.innerWidth + 5,
  }),
}

const boxVariants = {
  noraml: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -10,
    transition: {
      type: 'tween',
      delay: 0.5,
    },
  },
}

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      type: 'tween',
      delay: 0.5,
    },
  },
}

const prevButtonVariants = {
  normal: {
    opacity: 0,
  },
  hover: {
    opacity: 1,
    background: 'linear-gradient(to left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))',
    transition: {
      type: 'tween',
      delay: 0.5,
      duration: 0.3,
    },
  },
}

const nextButtonVariants = {
  normal: {
    opacity: 0,
  },
  hover: {
    opacity: 1,
    background: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))',
    transition: {
      type: 'tween',
      delay: 0.5,
      duration: 0.3,
    },
  },
}

const offset = 6

type OnBoxClick = {
  (mediaId: number, sliderTitle: string): void
  (mediaId: number, sliderTitle: string, mediaType: string): void
}

interface ISliderProps {
  sliderTitle: string
  mediaType: string
  data: IMedia[]
  onBoxClick: OnBoxClick
}

function Slider({ sliderTitle, mediaType, data, onBoxClick }: ISliderProps) {
  const [page, setPage] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [isNextMove, setIsNextMove] = useState(false)

  const onMovePage = async (isNextMove: boolean) => {
    if (data) {
      if (leaving) return
      toggleLeaving()
      const totalLength = data.length
      const maxPage = Math.floor(totalLength / offset) - 1
      if (isNextMove) {
        await setIsNextMove(true)
        setPage((prev) => (prev === maxPage ? 0 : prev + 1))
      } else {
        await setIsNextMove(false)
        setPage((prev) => (prev === 0 ? maxPage : prev - 1))
      }
    }
  }

  const toggleLeaving = () => setLeaving((prev) => !prev)

  return (
    <Container>
      <Title>{sliderTitle}</Title>
      <SliderWrapper>
        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
          <Row
            custom={isNextMove}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'tween', duration: 1 }}
            key={page}
          >
            {data?.slice(offset * page, offset * page + offset).map((media) => (
              <Box
                layoutId={String(media.id) + sliderTitle}
                key={media.id}
                variants={boxVariants}
                initial="normal"
                whileHover="hover"
                onClick={() => onBoxClick(media.id, sliderTitle, mediaType)}
                transition={{ type: 'tween' }}
                bgPhoto={makeImagePath(
                  media.backdrop_path || media.poster_path,
                  'w500'
                )}
              >
                <Info variants={infoVariants}>
                  <h4>{media?.title || media?.name}</h4>
                </Info>
              </Box>
            ))}
          </Row>
        </AnimatePresence>
        <PrevButton
          variants={prevButtonVariants}
          initial="normal"
          whileHover="hover"
          onClick={() => onMovePage(false)}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="white"
          >
            <path d="M15.293 3.293 6.586 12l8.707 8.707 1.414-1.414L9.414 12l7.293-7.293-1.414-1.414z" />
          </motion.svg>
        </PrevButton>
        <NextButton
          variants={nextButtonVariants}
          initial="normal"
          whileHover="hover"
          onClick={() => onMovePage(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="white"
          >
            <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" />
          </svg>
        </NextButton>
      </SliderWrapper>
    </Container>
  )
}

export default Slider
