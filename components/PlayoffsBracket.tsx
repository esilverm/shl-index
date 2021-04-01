import React, { useEffect, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import styled from 'styled-components';
import useSWR from 'swr';
import tinycolor from 'tinycolor2';
import { PlayoffsRound, PlayoffsSeries } from '../pages/api/v1/standings/playoffs';
import Link from './LinkWithSeason';

interface Props {
  data: Array<PlayoffsRound>;
  league: string;
}

const LEAGUE_WIN_CONDITION = {
  shl: 4,
  smjhl: 4,
  iihf: 1,
  wjc: 1
};

function PlayoffsBracket({ data, league }: Props): JSX.Element {
  const [isLoadingAssets, setLoadingAssets] = useState<boolean>(true);
  const [sprites, setSprites] = useState<{
    [index: string]: React.ComponentClass<any>;
  }>({});
  const [isLoading, setIsLoading] = useState(true);

  const { data: teamData, error: teamError } = useSWR(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/teams?league=${[
      'shl',
      'smjhl',
      'iihf',
      'wjc',
    ].indexOf(league)}`
  );

  useEffect(() => {
    // Dynamically import svg icons based on the league chosen
    (async () => {
      const { default: s } = await import(
        `../public/team_logos/${league.toUpperCase()}/`
      );

      setSprites(() => s);
      setLoadingAssets(() => false);
    })();
  }, []);

  useEffect(() => {
    setIsLoading(isLoadingAssets || !teamData);
  }, [isLoadingAssets, teamData]);

  if (teamError || isLoading || !data) return <PlayoffsBracketSkeleton isError={teamError} />;

  const renderSeries = (series: PlayoffsSeries) => {
    const isInternationalLeague = league === "iihf" || league === "wjc";
    const primaryColors = {
      away: teamData?.find(team => team.id === series.team1)?.colors.primary || '#DDD',
      home: teamData?.find(team => team.id === series.team2)?.colors.primary || '#BBB'
    };
    const awayTeam = {
      id: series.team1 >= 0 ? series.team1 : -1,
      abbr: series.team1_Abbr || "TEST",
      name: isInternationalLeague ? series.team1_Nickname || "Away Team" : series.team1_Name || "Away Team",
      wins: series.team1Wins || 0,
      color: {
        background: primaryColors.away,
        isDark: tinycolor(primaryColors.away).isDark()
      }
    };
    const homeTeam = {
      id: series.team2 >= 0 ? series.team2 : -1,
      abbr: series.team2_Abbr || "TEST",
      name: isInternationalLeague ? series.team2_Nickname || "Home Team" : series.team2_Name || "Home Team",
      wins: series.team2Wins || 0,
      color: {
        background: primaryColors.home,
        isDark: tinycolor(primaryColors.home).isDark()
      }
    };
    const hasAwayTeamWon = awayTeam.wins === LEAGUE_WIN_CONDITION[league];
    const hasHomeTeamWon = homeTeam.wins === LEAGUE_WIN_CONDITION[league];
    const temp = () => <div></div>;
    const AwayLogo = sprites[awayTeam.abbr] || temp;
    const HomeLogo = sprites[homeTeam.abbr] || temp; 

    return (
      <Series key={`${awayTeam.id}${homeTeam.id}`}>
        <Link
          href="/[league]/team/[id]"
          as={`/${league}/team/${awayTeam.id}`}
          passHref
        >
          <SeriesTeam color={awayTeam.color.background} isDark={awayTeam.color.isDark} lost={hasHomeTeamWon}>
            <AwayLogo />
            <span>{awayTeam.name}</span>
            <SeriesScore>
              {awayTeam.wins}
            </SeriesScore>
          </SeriesTeam>
        </Link>
        <Link
          href="/[league]/team/[id]"
          as={`/${league}/team/${homeTeam.id}`}
          passHref
        >
          <SeriesTeam color={homeTeam.color.background} isDark={homeTeam.color.isDark} lost={hasAwayTeamWon}>
            <HomeLogo />
            <span>{homeTeam.name}</span>
            <SeriesScore>
              {homeTeam.wins}
            </SeriesScore>
          </SeriesTeam>
        </Link>
      </Series>
    );
  };
  const renderRound = (round, index) => (
    <Round key={index}>
      <h2>{round.length === 1 ? "Finals" : `Round ${index + 1}`}</h2>
      {round.map(series => renderSeries(series))}
    </Round>
  );
  const renderBracket = () => data.map((round, i) => renderRound(round, i));

  return (
    <Container>
      <Bracket>
        {renderBracket()}
      </Bracket>
    </Container>
  );
}

function PlayoffsBracketSkeleton({ isError }: {
  isError: boolean
}): JSX.Element {
  const fakeArray = (length) => new Array(length).fill(0);

  const renderSkeletonSeries = (i) => (
    <Series key={i}>
      <SeriesTeam color={'#CCC'} isDark={false} lost={false}>
        <div style={{ marginLeft: '5px' }}></div>
        <Skeleton width={45} height={45} />
        <span><Skeleton width={100} /></span>
        <SeriesScore>
          <Skeleton />
        </SeriesScore>
      </SeriesTeam>
      <SeriesTeam color={'#EEE'} isDark={false} lost={false}>
        <div style={{ marginLeft: '5px' }}></div>
        <Skeleton width={45} height={45} />
        <span><Skeleton width={100} /></span>
        <SeriesScore>
          <Skeleton />
        </SeriesScore>
      </SeriesTeam>
    </Series>
  );

  const renderSkeletonBracket = () => (
    <Bracket>
      <Round>
        <Skeleton width={150} height={30} />
        {fakeArray(4).map((_, i) => renderSkeletonSeries(i))}
      </Round>
      <Round>
        <Skeleton width={150} height={30} />
        {fakeArray(2).map((_, i) => renderSkeletonSeries(i))}
      </Round>
      <Round>
        <Skeleton width={150} height={30} />
        <Series>
          {renderSkeletonSeries(0)}
        </Series>
      </Round>
    </Bracket>
  );

  return (
    <SkeletonTheme color="#ADB5BD" highlightColor="#CED4DA">
      <Container>
        {isError && <strong>A technical error occurred. Please reload the page to try again.</strong>}
        {renderSkeletonBracket()}
      </Container>
    </SkeletonTheme>
  );
}

const Container = styled.div`
  width: 95%;
  height: 100%;
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Bracket = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 3%;
`;

const Round = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 270px;

  h2 {
    margin-bottom: 10px;
  }
`;

const Series = styled.div`
  display: flex;
  flex-direction: column;
  width: 230px;
  align-items: center;
  margin-bottom: 5px;
  padding: 20px;
`;

const SeriesTeam = styled.div<{
  color: string;
  isDark: boolean;
  lost: boolean;
}>`
  display: flex;
  align-items: center;
  height: 55px;
  width: 230px;
  background-color: ${props => props.color};
  cursor: pointer;
  letter-spacing: 0.05rem;
  font-size: 18px;
  font-weight: 600;
  ${props => props.lost && 'opacity: 0.5;'}

  svg {
    width: 55px;
    padding: 5px;
  }

  span {
    padding-right: 5px;
    color: ${({ isDark, theme }) => isDark ? theme.colors.grey100 : theme.colors.grey900};
  }

  &:hover {
    background-color: ${props => tinycolor(props.color).setAlpha(.85).toRgbString()};
  }
`;

const SeriesScore = styled.div`
  background-color: ${({ theme }) => theme.colors.grey900}80;
  color: ${({ theme }) => theme.colors.grey100};
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 20px;
  padding: 0 15px;
  font-family: Montserrat, Arial, Helvetica, sans-serif;
  font-weight: bold;
  font-size: 25px;
  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
  margin-left: auto;
`;

export default React.memo(PlayoffsBracket);
