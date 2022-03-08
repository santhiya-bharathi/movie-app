
import './App.css';

import {useEffect, useState} from "react";
import { Switch, Route } from "react-router-dom";
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

import { useHistory } from "react-router-dom";
import { NotFound } from './homepage/NotFound';

import { Home } from './homepage/Home';
import { MovieDetails } from './moviesdetails/MovieDetails';
import { EditMovie } from './moviesdetails/EditMovie';
import { AddMovie } from './addmovies/AddMovie';
import { MovieList } from './moviesdetails/MovieList';
import { LoginFailed, LoginPage } from './loginandsignup/LoginPage';
import { SignupFailed, SignupPage } from './loginandsignup/SignupPage';

export const API_URL = "https://movies-node-app.herokuapp.com";

function App() {
  const [movies, setMovies] = useState([]);

  const [mode, setMode] = useState("dark");
const darkTheme = createTheme({
  
  palette: {
    mode: mode,
  },
});

console.log(setMode);
console.log(movies);
useEffect(()=>{
  fetch(`${API_URL}/movies`, {method:"GET"})
  .then((data)=>data.json())
  .then((mvs)=>setMovies(mvs));
}, []);
  return (
    
  <ThemeProvider theme={darkTheme}>
      <Paper elevation={3} style={{borderRadius:"0px",minHeight:"100vh"}}>

    <div className="App">
      

      <Switch>
      
      <Route exact path="/">
      <LoginPage />
        </Route>


        <Route path="/signup">
          <SignupPage />
        </Route>

        <Route path="/homepage">
        <Home />
        </Route>

        <Route path="/addmovies">
          <AddMovie />
        </Route>

        <Route path="/movielist/edit/:id">
        <EditMovie />
        </Route>

        <Route path="/movielist/:id">
        <MovieDetails />
        </Route>

        <Route path="/movielist">
        <MovieList />
        </Route>

        <Route path="/signupfailed">
          <SignupFailed />
        </Route>

        <Route path="/loginfailed">
          <LoginFailed />
        </Route>

        <Route path="**">
          <NotFound/>
        </Route>

      </Switch>
   
    </div>
    </Paper>
    </ThemeProvider>
   
  );
}

export default App;


export function Buttonbar(){
 
  const history = useHistory();
  return(

    <AppBar position="static">
    <Toolbar>
    <Button varient="text" color="inherit" onClick={()=>history.push("/homepage")}>Home</Button>
    <Button variant="text" color="secondary" onClick={() => history.push("/movielist")}>Movielist</Button>
    <Button variant="text" color="secondary" onClick={() => history.push("/addmovies")}>AddMovies</Button>

   
    </Toolbar>
    </AppBar>
  
  );
}