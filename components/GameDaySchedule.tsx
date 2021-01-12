import React from 'react';
import styled from 'styled-components';
import { Team } from '..';

import { Game } from '../pages/api/v1/schedule';

interface GameDayHeaderProps {
  date: string;
}

const GameDayHeader = ({ date }: GameDayHeaderProps): JSX.Element => (
  <GameHeader>
    <h2>{date}</h2>
  </GameHeader>
);

interface GameDayMatchupProps {
  game: Game;
  teamlist: Array<Team>;
  sprites: {
    [index: string]: React.ComponentClass<any>;
  }
}

const GameDayMatchup = ({ game, teamlist, sprites }: GameDayMatchupProps): JSX.Element => {
  const { awayTeam, awayScore, homeTeam, homeScore, played, overtime, shootout } = game;
  const awayTeamWon = awayScore > homeScore;
  const winNote = shootout ? '(SO)' : (overtime ? '(OT)' : '');
  const awayTeamObject = teamlist.find(team => team.id === awayTeam);
  const awayTeamAbbr = awayTeamObject && awayTeamObject.abbreviation ? awayTeamObject.abbreviation : 'AYT';
  const awayTeamName = awayTeamObject && awayTeamObject.name ? awayTeamObject.name : 'Away Team';
  const homeTeamObject = teamlist.find(team => team.id === homeTeam);
  const homeTeamAbbr = homeTeamObject && homeTeamObject.abbreviation ? homeTeamObject.abbreviation : 'HET';
  const homeTeamName = homeTeamObject && homeTeamObject.name ? homeTeamObject.name : 'Home Team';
  const AwayLogo = sprites[awayTeamAbbr];
  const HomeLogo = sprites[homeTeamAbbr];

  return (
    <GameRow>
      <TeamRow played={played} won={awayTeamWon} winNote={winNote}>
        <span className='team'>
         <LogoWrapper abbr={awayTeamAbbr}>
            <AwayLogo aria-label={`${awayTeamName} logo`} />
          </LogoWrapper>
          {awayTeamName}
        </span>
        <span className='score'>
          {played ? awayScore : '*'}
        </span>
      </TeamRow>
      <TeamRow played={played} won={!awayTeamWon} winNote={winNote}>
        <span className='team'>
          <LogoWrapper abbr={homeTeamAbbr}>
            <HomeLogo aria-label={`${homeTeamName} logo`} />
          </LogoWrapper>
          {homeTeamName}
        </span>
        <span className='score'>
          {played ? homeScore : '*'}
        </span>
      </TeamRow>
    </GameRow>
  );
}

interface GameDayScheduleProps {
  date: string;
  games: Array<Game>;
  teamlist: Array<Team>;
  sprites: {
    [index: string]: React.ComponentClass<any>;
  }
}

function GameDaySchedule({ date, games, teamlist, sprites }: GameDayScheduleProps): JSX.Element {
  return (
    <Matchups>
      <GameDayHeader date={date} />
      {games.map((game, i) => (
        <GameDayMatchup key={i} game={game} teamlist={teamlist} sprites={sprites} />
      ))}
    </Matchups>
  );
}

export default GameDaySchedule;

const Matchups = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 0 5px;
`;

const GameHeader = styled.div`
  border-bottom: 2px solid ${({ theme }) => theme.colors.grey500};
  padding-bottom: 5px;
`;

const GameRow = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px 0;
  border-bottom: 2px solid ${({ theme }) => theme.colors.grey500};
`;

const TeamRow = styled.div<{ played: number, won: boolean, winNote: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  color: ${({ theme, played, won }) => !!played && !won ? theme.colors.grey500 : theme.colors.grey900};

  .team {
    font-size: 18px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .team:after {
    content: "${({ won, winNote }) => won ? winNote : ''}";
    margin-left: 5px;
  }

  .score {
    font-family: Montserrat, Arial, Helvetica, sans-serif;
    font-size: 30px;
    font-weight: 600;
  }
`;

const LogoWrapper = styled.div<{ abbr: string }>`
  width: 25px;
  height: 25px;
  margin-right: 5px;
`;
