
import './App.css';

import {useEffect, useState} from "react";
import { Switch, Route } from "react-router-dom";
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useHistory } from "react-router-dom";
import { NotFound } from './homepage/NotFound';
import { Homepage } from './homepage/Homepage';
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
const history = useHistory();
const [mode, setMode] = useState("dark");
const darkTheme = createTheme({
  palette: {
    mode: mode,
  },
});

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
       <AppBar position="static">
       <Toolbar>
       <Button varient="text" color="inherit" onClick={()=>history.push("/")}>Home</Button>

       <Button varient="text" color="inherit" onClick={()=>history.push("/login")}>Log in</Button>
       <Button varient="text" color="inherit" onClick={()=>history.push("/signup")}>Sign up</Button>

       <Button varient="text" color="inherit" style={{marginLeft:"auto"}} onClick={()=>setMode(mode==="light"? "dark":"light")}> {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />} {mode==="light"? "Dark":"Light"}Mode</Button>
       </Toolbar>
       </AppBar>

      <Switch>
      
      <Route exact path="/">
          <Home />
        </Route>

        <Route path="/homepage">
          <Homepage />
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

        <Route path="/login">
          <LoginPage />
        </Route>
        
          <Route path="/signup">
          <SignupPage />
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


