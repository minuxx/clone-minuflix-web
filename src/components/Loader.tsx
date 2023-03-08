import styled from 'styled-components'

const Wrapper = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

function Loader() {
  return <Wrapper>Loading....</Wrapper>
}

export default Loader
