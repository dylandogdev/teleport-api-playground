import React, { useState, useEffect } from "react";
import "./App.css";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  TextField,
} from "@material-ui/core";
import { getUrbanAreas, getUrbanArea } from "./Teleport";
import Autocomplete from "@material-ui/lab/Autocomplete";

function App() {
  const [input, setInput] = useState(true);
  const [display, setDisplay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [urbanAreas, setUrbanAreas] = useState([]);
  const [firstUrban, setFirstUrban] = useState({});
  const [secondUrban, setSecondUrban] = useState({});

  //run once at start to grab all valid urban areas
  useEffect(() => {
    getUrbanAreas(setUrbanAreas);
  }, []);

  //need to know when both async calls have resolved so I know when to switch off loading screen
  useEffect(() => {
    if (firstUrban.fetched && secondUrban.fetched) {
      setLoading(false);
      setDisplay(true);
    }
  }, [firstUrban, secondUrban]);

  //hide the input card and display comparison when loaded
  const handleGo = () => {
    setInput(false);
    setLoading(true);
    getUrbanArea(firstUrban, setFirstUrban);
    getUrbanArea(secondUrban, setSecondUrban);
  };

  const handleReset = () => {
    setDisplay(false);
    setFirstUrban({});
    setSecondUrban({});
    setInput(true);
  };

  const getNightOutTotal = (ua) => {
    return ua.nightOut.movie + ua.nightOut.beer + ua.nightOut.dinner;
  };

  // prefetch the available urban areas from API on load
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: "100vh" }}
    >
      {input && (
        <Box>
          <Card style={{ marginTop: "1rem" }}>
            <CardHeader
              title="Urban Area Comparison"
              subheader="Select two urban areas and get a quick-look comparison of 5 key data points: rent, salary, commute, internet download speed, and the cost
              of a night out."
            ></CardHeader>
            <CardContent>
              <Autocomplete
                id="ua-select-1"
                options={urbanAreas}
                onChange={(event, value) => {
                  setFirstUrban(value);
                }}
                style={{ marginBottom: "1rem" }}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select first urban area"
                    variant="outlined"
                  />
                )}
              />
              <Autocomplete
                id="ua-select-2"
                options={urbanAreas}
                getOptionLabel={(option) => option.name}
                onChange={(event, value) => {
                  setSecondUrban(value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select second urban area"
                    variant="outlined"
                  />
                )}
              />
            </CardContent>
            <CardContent>
              <Button variant="contained" color="primary" onClick={handleGo}>
                Go
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}

      {display && (
        //In real life I would pop this into a separate component but in teh interest of time I am skipping
        //because it's been awhile since I worked in React and I was having some issues debugging the behavior of useEffect callback on the params
        //passed into child components - my coding time has been split between Hooks (which I prefer), and Redux, so I would need to review while I debug.
        <Card>
          <CardMedia
            component="img"
            alt={firstUrban.image}
            height="160"
            image={firstUrban.image}
            title={firstUrban.name}
          />
          <CardContent>
            {/* Hope this is in the right ballpark, I just did a very superficial comparison. */}
            <b>Housing:</b>
            <br />
            <p>
              A small apartment in {firstUrban.name} will cost you $
              {firstUrban.housing.price} per month, while a similar apartment in{" "}
              {secondUrban.name} will cost you around $
              {secondUrban.housing.price}
            </p>
            <br />
            <b>Salary:</b>
            <br />
            <p>
              A software developer earning a salary within the 50th percentile
              living in {firstUrban.name} can expect to make around $
              {firstUrban.salary.wage50.toFixed(2)} per year. A similar worker
              in {secondUrban.name} can expect to bring in roughly $
              {secondUrban.salary.wage50.toFixed(2)} annually.
            </p>
            <br />
            <b>Commute:</b>
            <br />
            <p>
              The traffic score in {firstUrban.name} is {firstUrban.commute},
              while the traffic score for {secondUrban.name} is{" "}
              {secondUrban.commute}. A higher traffic score means you will
              likely experience more traffic and delays on your driving commute.
            </p>
            <br />
            <b>Night Out: </b>
            <br />
            <p>
              For this metric we looked at the cost of a ticket to a movie, a
              dinner at a restaurant, and a beer. That kind of night out will
              run you ${getNightOutTotal(firstUrban)} in {firstUrban.name}. A
              similar evening in {secondUrban.name} will likely cost around $
              {getNightOutTotal(secondUrban)}.
            </p>
            <br />
            <b>Internet:</b>
            <br />
            <p>
              Typical internet download speeds in {firstUrban.name} are about{" "}
              {firstUrban.internet}mbps, while in {secondUrban.name} they
              average about {secondUrban.internet}
              mbps.
            </p>
          </CardContent>
          <CardMedia
            component="img"
            alt={secondUrban.image}
            height="160"
            image={secondUrban.image}
            title={secondUrban.name}
          />
          <CardContent>
            <Button variant="contained" color="primary" onClick={handleReset}>
              Start Over
            </Button>
          </CardContent>
        </Card>
      )}
    </Grid>
  );
}

export default App;
