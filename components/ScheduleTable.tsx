import React, { useMemo } from 'react';
// import Link from 'next/link';
import { useTable, useSortBy } from 'react-table';
import styled from 'styled-components';
import { Game } from '../pages/api/v1/schedule';
import { Team } from '..';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

interface Columns {
  Header: string;
  id?: string;
  title?: string;
  accessor: string | ((gameData) => string) | ((gameData) => JSX.Element);
}

interface ColumnData {
  Header: string;
  id?: string;
  columns: Array<Columns>;
}

interface Props {
  games: Array<Game>;
  teamlist: Array<Team>;
  isLoading: boolean;
}

function ScheduleTable({
  games,
  teamlist,
  isLoading
} : Props): JSX.Element {
  const getMatchup = (awayScore, homeScore, awayTeamId, homeTeamId) => {
    if (isLoading) return <Skeleton height={18} />;

    const awayTeamWon = awayScore > homeScore;
    const awayTeam = teamlist.find(team => team.id === awayTeamId);
    const awayTeamName = awayTeam && awayTeam.name ? awayTeam.name : 'Away Team';
    const homeTeam = teamlist.find(team => team.id === homeTeamId);
    const homeTeamName = homeTeam && homeTeam.name ? homeTeam.name : 'Home Team';

    return (
      <>
        {awayTeamWon ? <strong>{awayTeamName}</strong> : awayTeamName}
        {' @ '}
        {!awayTeamWon ? <strong>{homeTeamName}</strong> : homeTeamName}
      </>
    )
  };
  
  const getResult = (awayScore, homeScore, played, shootout, overtime) => {
    if (isLoading) return <Skeleton height={18} />;
    if (!played) return <span>TBD</span>;
  
    const endedIn = shootout ? " (SO)" : overtime ? " (OT)" : "";
    return <span>{`${awayScore} - ${homeScore}${endedIn}`}</span>;
  };

  const columnData: ColumnData[] = [
    {
      Header: 'schedule',
      id: 'gameday-matchups',
      columns: [
        {
          Header: 'type',
          id: 'type',
          accessor: 'type'
        },
        {
          Header: 'Matchup',
          id: 'matchup',
          accessor: ({ awayScore, homeScore, awayTeam, homeTeam }) => getMatchup(awayScore, homeScore, awayTeam, homeTeam)
        },
        {
          Header: 'Result',
          id: 'result',
          accessor: ({ awayScore, homeScore, played, shootout, overtime }) => getResult(awayScore, homeScore, played, shootout, overtime)
        }
      ]
    }
  ];

  const data = useMemo(
    () => isLoading
      ? new Array(25).fill({
        awayScore: 0,
        homeScore: 0,
        awayTeam: '',
        homeTeam: '',
        played: 0,
        overtime: 0,
        shootout: 0,
        type: ''
      })
    : games,
    [isLoading, games]
  );

  const columns = useMemo(
    () => columnData,
    [isLoading]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups, 
    rows,
    prepareRow
  } = useTable({ columns, data, initialState: {
    hiddenColumns: ['type']
  }}, useSortBy);

  return (
    <SkeletonTheme color="#ADB5BD" highlightColor="#CED4DA">
      <TableContainer>
        <Table {...getTableProps()}>
          <TableHeader>
            {
              headerGroups.map((headerGroup, i) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                  {
                    headerGroup.headers.map((column, i) => column.Header !== 'schedule' && (
                        <th
                          {
                            ...column.getHeaderProps(column.getSortByToggleProps())
                          }
                          title={column.title}
                          key={`${i}_${column.id}`}
                          className={
                            column.isSorted
                              ? column.isSortedDesc
                                ? 'sorted--desc'
                                : 'sorted--asc'
                              : ''
                          }
                          >
                            {
                              column.render('Header')
                            }
                          </th>
                      )
                    )
                  }
                </tr>
              ))
            }
          </TableHeader>
          <TableBody {...getTableBodyProps()}>
            {
              rows.map((row, i) => {
                prepareRow(row);

                return (
                  <tr {...row.getRowProps()} key={i}>
                    {
                      row.cells.map((cell, i) => {
                        return (
                          <td
                            {...cell.getCellProps()}
                            key={i}
                            className={cell.column.isSorted ? 'sorted' : ''}
                          >
                            {
                              cell.render('Cell')
                            }
                          </td>
                        )
                      })
                    }
                  </tr>
                )
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
    </SkeletonTheme>
  )
}

const TableContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.grey500};
  border-top: none;
  overflow-x: auto;
  overflow-y: hidden;
  border-radius: 10px;

  tr:not(:last-child) th,
  tr:not(:last-child) td {
    border-bottom: 1px solid ${({ theme }) => theme.colors.grey500};
  }
`;

const Table = styled.table`
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;

  border-radius: inherit;
`;

const TableHeader = styled.thead`
  background-color: ${({ theme }) => theme.colors.grey900};
  color: ${({ theme }) => theme.colors.grey100};
  position: relative;

  tr {
    display: table-row;
  }

  th {
    height: 50px;
    font-weight: 400;
    background-color: ${({ theme }) => theme.colors.grey900};
    position: relative;
    text-align: left;
    padding-left: 10px;
    padding-right: 10px;
  }
`;

const TableBody = styled.tbody`
  background-color: ${({ theme }) => theme.colors.grey100};
  margin: 0 auto;
  display: table-row-group;
  vertical-align: middle;
  position: relative;

  th {
    display: table-cell;
    text-align: left;
    font-weight: 400;
    background-color: ${({ theme }) => theme.colors.grey200};
    position: sticky;
    left: 0px;
  }

  td {
    font-family: Montserrat, Arial, Helvetica, sans-serif;
    padding: 10px;
    text-align: left;

    &.sorted {
      background-color: rgba(1, 131, 218, 0.1);
    }
  }

  tr {
    &:hover {
      background-color: rgba(1, 131, 218, 0.1);
    }
  }
`;

export default ScheduleTable;
