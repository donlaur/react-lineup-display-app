import React, { useState, useEffect } from "react";
import Lineup from "./Lineup";
import uuid4 from "uuid";
import axios from "axios";

export default function LineupGroup(props) {
  const [lineups, setLineups] = useState({ lineups: [] });
  const [hasError, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errStr, setErrstr] = useState(null);

  const LINEUPS_URL = "http://localhost:5000/lineups";
  async function fetchData() {
    await axios
      .get(LINEUPS_URL)
      .then(resJSON => {
        /* console.log("fetched"); */
        setLineups(
          JSON.parse(resJSON.data).lineups.map(lineup => (
            <Lineup
              key={uuid4()}
              id={lineup.lineup_id}
              players={lineup.players}
              points={lineup.lineup_points}
            />
          ))
        );
        setLoading(false);
        if (props.refresh) {
          setTimeout(fetchData, props.refreshRate);
        }
      })
      .catch(err => {
        console.log(err);
        setErrstr(err);
        setError(true);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const rows = [];
  const LINEUPS_PER_ROW = 3;
  let lineupRowGroup = [];
  for (let i = 0; i < lineups.length; i++) {
    if (lineupRowGroup.length < LINEUPS_PER_ROW) {
      lineupRowGroup.push(lineups[i]);
    } else {
      rows.push(
        <div className="row" key={uuid4()}>
          {lineupRowGroup}
        </div>
      );
      lineupRowGroup = [lineups[i]];
    }
    if (i + 1 === lineups.length) {
      rows.push(
        <div className="row" key={uuid4()}>
          {lineupRowGroup}
        </div>
      );
    }
  }
  return hasError ? (
    <div>error {String(errStr)}</div>
  ) : loading ? (
    <div>Loading...</div>
  ) : (
    <div>{rows}</div>
  );
}
