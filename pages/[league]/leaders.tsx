import React, { useState } from 'react';
import styled from 'styled-components';
import { GetStaticProps, GetStaticPaths } from 'next';
import { NextSeo } from 'next-seo';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeasonTypeSelector from '../../components/Selector/SeasonTypeSelector';
import { SeasonType } from '../api/v1/schedule';
import Leaderboard from '../../components/LeaderBoard';

const PLAYER_TYPES = {
  SKATER: 'skater',
  GOALIE: 'goalie'
};
type PlayerTypes = typeof PLAYER_TYPES[keyof typeof PLAYER_TYPES];

// const skaterLeaderboards = {
//   'points': 'Points',
//   'goals': 'Goals',
//   'assists': 'Assists',
//   'plusminus': 'Plus Minus',
//   'penaltyminutes': 'PIM',
//   'ppg': 'Power Play Goals',
//   'shg': 'Shorthanded Goals',
//   'shots': 'Shots',
//   'shotpct': 'Shot %',
//   'shotsblocked': 'Shots Blocked'
// };

interface Props {
  league: string;
}

function Stats({ league }: Props): JSX.Element {
  const [playerType, setPlayerType] = useState<PlayerTypes>(PLAYER_TYPES.SKATER);
  const [seasonType, setSeasonType] = useState<SeasonType>('Regular Season');

  const onSeasonTypeSelect = (type) => setSeasonType(type);

  return (
    <React.Fragment>
      <NextSeo
        title="Leaders"
        openGraph={{
          title: 'Leaders',
        }}
      />
      <Header league={league} activePage="leaders" />
      <Container>
        <Filters>
          <SelectorWrapper>
            <SeasonTypeSelector onChange={onSeasonTypeSelect} />
          </SelectorWrapper>
          <DisplaySelectContainer role="tablist">
            <DisplaySelectItem
              onClick={() => setPlayerType(() => PLAYER_TYPES.SKATER)}
              active={playerType === PLAYER_TYPES.SKATER}
              tabIndex={0}
              role="tab"
              aria-selected={playerType === PLAYER_TYPES.SKATER}
            >
              Skaters
            </DisplaySelectItem>
            <DisplaySelectItem
              onClick={() => setPlayerType(() => PLAYER_TYPES.GOALIE)}
              active={playerType === PLAYER_TYPES.GOALIE}
              tabIndex={0}
              role="tab"
              aria-selected={playerType === PLAYER_TYPES.GOALIE}
            >
              Goalies
            </DisplaySelectItem>
          </DisplaySelectContainer>
        </Filters>
        <LeaderBoards>
          <Leaderboard league={league} playerType={playerType} stat={{
            id: 'points',
            label: 'Points'
          }} seasonType={seasonType} />
        </LeaderBoards>
      </Container>
      <Footer />
    </React.Fragment>
  );
}

const Container = styled.div`
  height: 100%;
  width: 75%;
  padding: 1px 0 40px 0;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.grey100};

  @media screen and (max-width: 1024px) {
    width: 100%;
    padding: 2.5%;
  }
`;

const Filters = styled.div`
  @media screen and (max-width: 1024px) {
    display: flex;
    flex-direction: column;
    align-items: center;

    button {
      margin-right: 0;
      margin-bottom: 5px;
    }
  }
`;

const SelectorWrapper = styled.div`
  width: 250px;
  float: right;
  margin-right: 3%;
`;

const DisplaySelectContainer = styled.div`
  margin: 28px auto;
  width: 95%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey500};
`;

const DisplaySelectItem = styled.div<{ active: boolean }>`
  display: inline-block;
  padding: 8px 24px;
  border: 1px solid
    ${({ theme, active }) => (active ? theme.colors.grey500 : 'transparent')};
  background-color: ${({ theme, active }) =>
    active ? theme.colors.grey100 : 'transparent'};
  border-radius: 5px 5px 0 0;
  cursor: pointer;
  position: relative;
  border-bottom: none;
  bottom: -1px;
`;

const LeaderBoards = styled.div`
  margin: 28px auto;
  width: 95%;
`;

export const getStaticPaths: GetStaticPaths = async () => {
  const leagues = ['shl', 'smjhl', 'iihf', 'wjc'];

  const paths = leagues.map((league) => ({
    params: { league },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  return { props: { league: ctx.params.league } };
};

export default Stats;
