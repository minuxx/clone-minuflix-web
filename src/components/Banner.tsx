import styled from 'styled-components'
import { makeImagePath } from '../utils'

const Wrapper = styled.div<{ bgPhoto: string }>`
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

interface IBannerProps {
  title: string
  overview: string
  imgUrl: string
}

function Banner({ title, overview, imgUrl }: IBannerProps) {
  return (
    <Wrapper bgPhoto={makeImagePath(imgUrl)}>
      <Title>{title}</Title>
      <Overview>{overview}</Overview>
    </Wrapper>
  )
}

export default Banner
