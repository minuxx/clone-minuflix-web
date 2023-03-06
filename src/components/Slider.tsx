import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { IMovie } from '../api'
import { makeImagePath } from '../utils'

const Wrapper = styled.div`
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

const rowVariants = {
  hidden: {
    x: window.innerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.innerWidth - 5,
  },
}

const boxVariants = {
  noraml: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
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

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;

  h4 {
    font-size: 18px;
    text-align: center;
  }
`

const offset = 6

interface ISliderProps {
  data: IMovie[]
}

function Slider({ data }: ISliderProps) {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const increaseIndex = () => {
    if (data) {
      if (leaving) return
      toggleLeaving()
      const totalMovies = data.length - 1 // 하나는 배너
      const maxIndex = Math.floor(totalMovies / offset) - 1 // 올림, 0부터 시작하니 -1
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1))
    }
  }
  const toggleLeaving = () => setLeaving((prev) => !prev)
  const onBoxClick = (movieId: number) => {
    navigate(`/movies/${movieId}`)
  }

  return (
    <Wrapper>
      <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
        <Row
          variants={rowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: 'tween', duration: 1 }}
          key={index}
        >
          {data?.slice(offset * index, offset * index + offset).map((movie) => (
            <Box
              layoutId={String(movie.id)}
              key={movie.id}
              variants={boxVariants}
              initial="normal"
              whileHover="hover"
              onClick={() => onBoxClick(movie.id)}
              transition={{ type: 'tween' }}
              bgPhoto={makeImagePath(movie.backdrop_path, 'w500')}
            >
              <Info variants={infoVariants}>
                <h4>{movie.title}</h4>
              </Info>
            </Box>
          ))}
        </Row>
      </AnimatePresence>
    </Wrapper>
  )
}

export default Slider
