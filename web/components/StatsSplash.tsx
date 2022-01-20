import styled from 'styled-components';

const Container = styled.div`
  padding: 24px 12ps;
`;

const Title = styled.div`
  font-size: 24px;
  margin: 16px 0px;
  text-align: left;
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const TotalStat = styled.div`
  padding: 0px 24px;
  text-align: left;
`;

const TotalStatTitle = styled.div`
  font-size: 20px;
`;

const TotalStatSubtext = styled.div`
  font-size: 14px;
`;

const Text = styled.div`
  font-size: 18px;
  margin: 8px 24px;
`;

const LanguageStatContainer = styled.div`;
  display: flex;
  flex-direction: row;
  padding: 24px 12px;
  margin: 6px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.09), 0 1px 4px rgba(0, 0, 0, 0.09);
`;

const LanguageStat = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const LanguageStatList = styled.div`
  padding 6px 0px;
  width: 200px;
`;

const LanguageStatTitle  = styled.div`
  font-size: 12px;
  color: #959595;
`;

const LanguageStatValue = styled.div`
  font-size: 12px;
  font-weight: bold;
  color: #4a4a4a;
`;

const LanguageName = styled.div`;
  display: flex;
  align-items: center;
  margin: 0px 12px;
  font-size: 18px;
  font-weight: 600;
  width: 100px;
  text-align: left;
`;


const StatsSplash = () => {
  return (
    <Container>
      <StatsRow>
        <TotalStat>
          <TotalStatTitle>X+ Thousand</TotalStatTitle>
          <TotalStatSubtext>Contributors</TotalStatSubtext>
        </TotalStat>

        <TotalStat>
          <TotalStatTitle>X+ Thousand</TotalStatTitle>
          <TotalStatSubtext>Languages</TotalStatSubtext>
        </TotalStat>

        <TotalStat>
          <TotalStatTitle>X+ Million</TotalStatTitle>
          <TotalStatSubtext>Sentences</TotalStatSubtext>
        </TotalStat>

        <TotalStat>
          <TotalStatTitle>X+ Million</TotalStatTitle>
          <TotalStatSubtext>Translations</TotalStatSubtext>
        </TotalStat>

      </StatsRow>

      <Title>
        Launched
      </Title>

      <StatsRow>
        <LanguageStatContainer>
          <LanguageName>
            English
          </LanguageName>
          <LanguageStatList>
            <LanguageStat>
              <LanguageStatTitle>Contributors</LanguageStatTitle>
              <LanguageStatValue>xx,yyy</LanguageStatValue>
            </LanguageStat>
            <LanguageStat>
              <LanguageStatTitle>Verified Contributions</LanguageStatTitle>
              <LanguageStatValue>yyy,yyy</LanguageStatValue>
            </LanguageStat>
          </LanguageStatList>
        </LanguageStatContainer>

        <LanguageStatContainer>
          <LanguageName>
            Japanese
          </LanguageName>
          <LanguageStatList>
            <LanguageStat>
              <LanguageStatTitle>Contributors</LanguageStatTitle>
              <LanguageStatValue>xx,yyy</LanguageStatValue>
            </LanguageStat>
            <LanguageStat>
              <LanguageStatTitle>Verified Contributions</LanguageStatTitle>
              <LanguageStatValue>yyy,yyy</LanguageStatValue>
            </LanguageStat>
          </LanguageStatList>
        </LanguageStatContainer>

        <LanguageStatContainer>
          <LanguageName>
            French
          </LanguageName>
          <LanguageStatList>
            <LanguageStat>
              <LanguageStatTitle>Contributors</LanguageStatTitle>
              <LanguageStatValue>xx,yyy</LanguageStatValue>
            </LanguageStat>
            <LanguageStat>
              <LanguageStatTitle>Verified Contributions</LanguageStatTitle>
              <LanguageStatValue>yyy,yyy</LanguageStatValue>
            </LanguageStat>
          </LanguageStatList>
        </LanguageStatContainer>

      </StatsRow>

      <Title>
        In Progress 
      </Title>

      <StatsRow>
        <LanguageStatContainer>
          <LanguageName>
            Kurdish Sorani
          </LanguageName>
          <LanguageStatList>
            <LanguageStat>
              <LanguageStatTitle>Contributors</LanguageStatTitle>
              <LanguageStatValue>xx,yyy</LanguageStatValue>
            </LanguageStat>
            <LanguageStat>
              <LanguageStatTitle>Verified Contributions</LanguageStatTitle>
              <LanguageStatValue>yyy,yyy</LanguageStatValue>
            </LanguageStat>
          </LanguageStatList>
        </LanguageStatContainer>

        <LanguageStatContainer>
          <LanguageName>
            Tigrinya
          </LanguageName>
          <LanguageStatList>
            <LanguageStat>
              <LanguageStatTitle>Contributors</LanguageStatTitle>
              <LanguageStatValue>xx,yyy</LanguageStatValue>
            </LanguageStat>
            <LanguageStat>
              <LanguageStatTitle>Verified Contributions</LanguageStatTitle>
              <LanguageStatValue>yyy,yyy</LanguageStatValue>
            </LanguageStat>
          </LanguageStatList>
        </LanguageStatContainer>

        <LanguageStatContainer>
          <LanguageName>
            Kabyle
          </LanguageName>
          <LanguageStatList>
            <LanguageStat>
              <LanguageStatTitle>Contributors</LanguageStatTitle>
              <LanguageStatValue>xx,yyy</LanguageStatValue>
            </LanguageStat>
            <LanguageStat>
              <LanguageStatTitle>Verified Contributions</LanguageStatTitle>
              <LanguageStatValue>yyy,yyy</LanguageStatValue>
            </LanguageStat>
          </LanguageStatList>
        </LanguageStatContainer>

      </StatsRow>
    </Container>
  );
};

export default StatsSplash;
