import { NextSeo } from 'next-seo';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

//
const IIHFLogo = require('../public/league_logos/IIHF.svg?sprite');
const SHLLogo = require('../public/league_logos/SHL.svg?sprite');
const SMJHLLogo = require('../public/league_logos/SMJHL.svg?sprite');
const WJCLogo = require('../public/league_logos/WJC.svg?sprite');

export default function Home(): JSX.Element {
  return (
    <React.Fragment>
      <NextSeo
        title="Home"
        openGraph={{
          title: 'Home',
        }}
      />
      <Container>
        <Title>Welcome to the SHL Index</Title>
        <Action>Select a League</Action>
        <LeagueListContainer>
          <Link href="/[league]" as="/shl" passHref>
            <LeagueLink role="link" aria-label="SHL" tabIndex={0}>
              <SHLLogo />
            </LeagueLink>
          </Link>
          <Link href="/[league]" as="/smjhl" passHref>
            <LeagueLink role="link" aria-label="SMJHL" tabIndex={0}>
              <SMJHLLogo />
            </LeagueLink>
          </Link>
          <Link href="/[league]" as="/iihf" passHref>
            <LeagueLink role="link" aria-label="IIHF" tabIndex={0}>
              <IIHFLogo />
            </LeagueLink>
          </Link>
          <Link href="/[league]" as="/wjc" passHref>
            <LeagueLink role="link" aria-label="WJC" tabIndex={0}>
              <WJCLogo />
            </LeagueLink>
          </Link>
        </LeagueListContainer>
      </Container>
    </React.Fragment>
  );
}

const Container = styled.div`
  width: 80%;
  height: auto;
  margin: 100px auto 0 auto;

  @media screen and (max-width: 414px) {
    width: 90%;
  }
`;

const Title = styled.h2`
  font-family: Raleway, sans-serif;
  font-weight: 800;
  text-align: center;
  margin-bottom: 70px;
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.grey800};
  letter-spacing: 0.1rem;
`;

const Action = styled.h2`
  font-family: Montserrat, sans-serif;
  font-weight: 600;
  text-align: center;
  font-size: 2.4rem;
  color: ${({ theme }) => theme.colors.grey700};
  letter-spacing: 0.1rem;

  @media screen and (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const LeagueListContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
`;

const LeagueLink = styled.div`
  cursor: pointer;
  border-radius: 100%;
  width: 20%;
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.3);
  transition: box-shadow 200ms, transform 200ms ease-out;
  padding-top: 20%;
  position: relative;
  min-width: 200px;
  min-height: 200px;
  margin: 4% 2.5%;
  transform: scale(1);
  background-color: ${({ theme }) => theme.colors.grey100};

  &:first-child svg {
    width: 75%;
    height: 75%;
    top: 13%;
    left: 14.3%;
  }

  & svg {
    width: 80%;
    height: 80%;
    position: absolute;
    top: 10%;
    left: 10%;
    display: block;
    object-fit: contain;
  }

  &:hover {
    box-shadow: 0 15px 25px 4px rgba(0, 0, 0, 0.3);
    transform: scale(1.04);
  }
`;
