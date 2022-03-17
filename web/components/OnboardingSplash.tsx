import styled from 'styled-components';

const Container = styled.div`
  padding: 24px 12ps;
`;

const Title = styled.div`
  font-size: 24px;
  margin: 16px 0px;
`;

const Input = styled.input`
  padding: 5px 12px;
  font-size: 14px;
  line-height: 20px;
  vertical-align: middle;
  border-radius: 6px;
  outline: none;
`;

const Button = styled.button`;
  color: #fff;
  background-color: #2ea44f;
  display: inline-block;
  font-weight: 600;
  margin: 0px 4px;
  padding: 8px 12px;
  text-align: center;
  border: 0px;
  border-radius: 6px;
`;

const RegisterContainer = styled.div`
  margin: 24px 0px;
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

      <RegisterContainer>
        <Input
            name="username"
            type="text"
            autoComplete="off"
            spellCheck="false"
            placeholder="GitHub Username">
        </Input>
        <Button>
          Register
        </Button>
      </RegisterContainer>
    </Container>
  );
};

export default OnboardingSplash;
