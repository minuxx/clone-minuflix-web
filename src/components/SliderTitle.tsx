import styled from 'styled-components'

interface ISliderTitleProps {
  title: string
}

const Title = styled.h3`
  font-size: 36px;
  font-weight: 400;
  margin-bottom: 20px;
  padding-left: 25px;
  color: ${(props) => props.theme.white.lighter};
`

function SliderTitle({ title }: ISliderTitleProps) {
  return <Title>{title}</Title>
}

export default SliderTitle
