import styled from 'styled-components';

const Container = styled.div`
  padding: 24px 12ps;
`;

const Title = styled.div`
  font-size: 24px;
  margin: 16px 0px;
`;

const Text = styled.div`
  font-size: 18px;
  margin: 8px 24px;
`;

const OnboardingSplash = () => {
  return (
    <Container>
      <Title>
        Together we make the data for language technology.
      </Title>

      <Text>
        Surface is on a mission to build datasets for the worlds languages.
        These datasets are built, owned, and governed by all contributors.
        That means you help decide what we build and how profits are shared.
      </Text>
    </Container>
  );
};

export default OnboardingSplash;
