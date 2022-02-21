
import './App.css';

import {useEffect, useState} from "react";
import { Switch, Route, useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useHistory } from "react-router-dom";
import { useFormik } from 'formik';
import * as yup from 'yup';

const API_URL = "https://movies-node-app.herokuapp.com";

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
       <Button varient="text" color="inherit" onClick={()=>history.push("/addmovies")}>AddMovies</Button>
       <Button varient="text" color="inherit" onClick={()=>history.push("/movielist")}>Movielist</Button>

       <Button varient="text" color="inherit" style={{marginLeft:"auto"}} onClick={()=>setMode(mode==="light"? "dark":"light")}> {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />} {mode==="light"? "Dark":"Light"}Mode</Button>
       </Toolbar>
       </AppBar>

      <Switch>
      
      <Route exact path="/">
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

function NotFound(){
  return(
    <div className="not-found-pic">
      <h1 className="not-found-name">404 Not Found</h1>
      <img  src="https://s12emagst.akamaized.net/assets/hu/images/error_404_600px.gif" alt="404 not found"/>
    </div>
  );
}

function Home() {
  return (
    <div className="home">
      <h2 className="home-hello">Hello All!!!</h2>
      <img className="home-pic" src="https://c.tenor.com/NuKLjcqaiqsAAAAC/welcome.gif" alt="welcome"/>
    </div>
  );
}

function MovieDetails() {
  const history = useHistory();
  const {id} = useParams();
  
  console.log("the id is ", id);

const [moviedet, setMoviedet] = useState({});

useEffect(()=>{
  fetch(`${API_URL}/movies/${id}`, {method:"GET"})
  .then((data)=>data.json())
  .then((mv)=>setMoviedet(mv));
}, [id]);

  console.log(moviedet);
  const styles = {
    color: moviedet.rating<8? "crimson":"green",
    fontWeight:"bold"
  };
  return(
  <div className="details">
        <iframe width="1430" height="650" src={moviedet.trailer} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        
        <div className="det"> 
        <h1 className="user-name">{moviedet.name}</h1>
      <p style= {styles}> ⭐{moviedet.rating} </p>
      </div>
     
    <p>{moviedet.summary}</p>
    
    <Button onClick={()=>history.push("/movielist") }variant="outlined"><KeyboardBackspaceIcon/>Back</Button>
    </div>
  );
}

function EditMovie(){
 
  const {id} = useParams();

const [moviedet, setMoviedet] = useState(null);
useEffect(()=>{
  fetch(`${API_URL}/movies/${id}`, {method:"GET"})
  .then((data)=>data.json())
  .then((mv)=>setMoviedet(mv));
}, [id]);

  return moviedet? <UpdateMovie moviedet={moviedet}/>:"";
  
}
function UpdateMovie({moviedet}){
  const history = useHistory();

  const formvalidationschema = yup.object({
    pic: yup.string().required("why not fill this pic?").min(4),
    name: yup.string().required("why not fill this name?").min(1),
    rating: yup.number().required("why not fill this rating?").min(0).max(10),
    summary: yup.string().required("why not fill this summary?").min(20),
    trailer: yup.string().required("why not fill this trailer?").min(5),
  });

  const {handleSubmit, values, handleChange, handleBlur, errors, touched} = useFormik({
    initialValues: { name: moviedet.name, pic:moviedet.pic, rating:moviedet.rating, summary:moviedet.summary, trailer:moviedet.trailer},

    validationSchema: formvalidationschema,
  
    onSubmit: (updatedMovie) => {
      console.log("onsubmit", updatedMovie);
      editMovie(updatedMovie);
    }
  });

  const editMovie =(updatedMovie)=>{
   
    console.log(updatedMovie);

  fetch(`${API_URL}/movies/${moviedet.id}`, {
    method:"PUT",
    body: JSON.stringify(updatedMovie),
    headers: {'Content-Type': 'application/json'},
}).then(()=>history.push("/movielist"))
  };

  
  return(
    <form onSubmit={handleSubmit} className="in-con">
    
    <TextField id="pic" 
      name="pic" 
      value = {values.pic} 
      onChange={handleChange} 
      onBlur={handleBlur}
       label="enter movie url" 
       error={errors.pic && touched.pic}
       helperText={errors.pic && touched.pic && errors.pic}
       variant="filled" />
       
     
     <TextField id="name" 
      name="name" 
      value = {values.name} 
      onChange={handleChange} 
      onBlur={handleBlur}
      label="enter movie name"
      error={errors.name && touched.name}
      helperText={errors.name && touched.name && errors.name}
       variant="filled" />
      

      <TextField id="rating" 
      name="rating" 
      value = {values.rating} 
      onChange={handleChange} 
      onBlur={handleBlur}  
      label="enter movie rating" 
      error={errors.rating && touched.rating}
       helperText={errors.rating && touched.rating && errors.rating}
      variant="filled" />
      

      <TextField id="summary" 
      name="summary" 
      value = {values.summary} 
      onChange={handleChange} 
      onBlur={handleBlur}  label="enter movie summary" 
      error= {errors.summary && touched.summary}
      helperText= {errors.summary && touched.summary && errors.summary}
      variant="filled" />
     
      <TextField id="trailer" 
      name="trailer" 
      value = {values.trailer} 
      onChange={handleChange} 
      onBlur={handleBlur}  label="enter movie trailer"
      error=  {errors.trailer && touched.trailer}
      helperText= {errors.trailer && touched.trailer && errors.trailer}
      variant="filled" />
     
          <Button type="submit" variant="contained">Save</Button>
         
        </form>
      );
}


function AddMovie(){
  const history = useHistory();

const formvalidationschema = yup.object({
  pic: yup.string().required("why not fill this pic?").min(4),
  name: yup.string().required("why not fill this name?").min(1),
  rating: yup.number().required("why not fill this rating?").min(0).max(10),
  summary: yup.string().required("why not fill this summary?").min(20),
  trailer: yup.string().required("why not fill this trailer?").min(5),
});

const {handleSubmit, values, handleChange, handleBlur, errors, touched} = useFormik({
  initialValues: { name: "", pic:"", rating:"", summary:"", trailer:""},

  validationSchema: formvalidationschema,

  onSubmit: (newMovies) => {
    console.log("onsubmit", newMovies);
    addMovie(newMovies);
  }
});

const addMovie =(newMovies)=>{

console.log(newMovies)
  fetch(`${API_URL}/movies`, {
    method:"POST",
    body: JSON.stringify(newMovies),
    headers: {'Content-Type': 'application/json'},
}).then(()=>history.push("/movielist"));
  
};

  return(
<form onSubmit={handleSubmit} className="in-con">

<TextField id="pic" 
      name="pic" 
      value = {values.pic} 
      onChange={handleChange} 
      onBlur={handleBlur}
       label="enter movie url" 
       error={errors.pic && touched.pic}
       helperText={errors.pic && touched.pic && errors.pic}
       variant="filled" />
       
     
     <TextField id="name" 
      name="name" 
      value = {values.name} 
      onChange={handleChange} 
      onBlur={handleBlur}
      label="enter movie name"
      error={errors.name && touched.name}
      helperText={errors.name && touched.name && errors.name}
       variant="filled" />
      

      <TextField id="rating" 
      name="rating" 
      value = {values.rating} 
      onChange={handleChange} 
      onBlur={handleBlur}  
      label="enter movie rating" 
      error={errors.rating && touched.rating}
       helperText={errors.rating && touched.rating && errors.rating}
      variant="filled" />
      

      <TextField id="summary" 
      name="summary" 
      value = {values.summary} 
      onChange={handleChange} 
      onBlur={handleBlur}  label="enter movie summary" 
      error= {errors.summary && touched.summary}
      helperText= {errors.summary && touched.summary && errors.summary}
      variant="filled" />
     
      <TextField id="trailer" 
      name="trailer" 
      value = {values.trailer} 
      onChange={handleChange} 
      onBlur={handleBlur}  label="enter movie trailer"
      error=  {errors.trailer && touched.trailer}
      helperText= {errors.trailer && touched.trailer && errors.trailer}
      variant="filled" />
     
      <Button type="submit" variant="contained">Add movies</Button>
     
    </form>
  );
} 

function Counter(){
  const [like, setLike] = useState(0);
  const [disLike, setDisLike] = useState(0);
  return(
<div className="button-like">
<IconButton onClick={()=> setLike(like+1)} aria-label="like">
<Badge badgeContent={like} color="primary">👍</Badge>
      </IconButton>
      <IconButton onClick={()=> setDisLike(disLike+1)} aria-label="dislike">
<Badge badgeContent={disLike} color="error">👎</Badge>
      </IconButton>
  
  </div>
  );
}
function MovieList(){
  const [movies, setMovies] = useState([]);
 
const getMovies = () => {
  fetch(`${API_URL}/movies`, {method:"GET"})
  .then((data)=>data.json())
  .then((mvs)=>setMovies(mvs));
};


useEffect(getMovies, []);

const deleteMovie = (id) =>{
  fetch(`${API_URL}/movies/${id}`, {method:"DELETE"})
  .then(()=>getMovies());
};

  const history = useHistory();
  return(
    <section>
         {movies.map(({pic, name, rating, summary, id, _id})=>(
       <Movie key={_id} name={name} pic={pic} rating={rating} summary={summary} id={_id}
       deleteButton= {<IconButton aria-label="delete" color="error"
       onClick={()=> deleteMovie(_id)}>
       <DeleteIcon />
     </IconButton>}
       editButton= {<IconButton 
        style={{marginLeft:"auto"}}
        aria-label="edit"  color="success"
       onClick={()=>history.push("/movielist/edit/" + _id)}>
       <EditIcon />
     </IconButton>}
       />
     ))}
    </section>
  );
}

function Movie({pic, name, rating, summary,id,deleteButton,editButton}){
const [show,setShow] = useState(true);
const history = useHistory();
const styles = {
  color: rating<8? "crimson":"green",
  fontWeight:"bold"
};
const summaryStyles = {
  display:show?"block":"none"
};
  return (
    
    <div className="container">
     
      <div className="full-det">
      
      <img className="user-pic" src={pic} alt={name}/>
      <div className="details">
        
        <div className="det"> <h1 className="user-name">{name}  
        <IconButton onClick={()=>{console.log(id);
  
        history.push("/movielist/"+id);
        }} color="info" aria-label="more-info">
        <InfoIcon/>
</IconButton>
<IconButton onClick={()=>setShow(!show)} color="primary" aria-label="description">
 {show?<ExpandLessIcon/>:<ExpandMoreIcon/>}
</IconButton>
</h1>
       
      <p style= {styles}> ⭐{rating} </p>
      </div>
 
      {show?<p style={summaryStyles}>{summary}</p>:""}
      <div className="count-edit"><Counter/>
{editButton}{deleteButton}</div>
      
      
    </div>
    </div>
    </div>
    
    
  );
}