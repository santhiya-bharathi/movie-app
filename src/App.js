
import './App.css';

import {useEffect, useState} from "react";
import { Switch, Route, useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
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

        <Route path="/signupsuccess">
          <SignupSuccess />
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

function NotFound(){
  return(
    <div className="not-found-pic">
      <h1 className="not-found-name">404 Not Found</h1>
      <img  src="https://s12emagst.akamaized.net/assets/hu/images/error_404_600px.gif" alt="404 not found"/>
    </div>
  );
}

function Homepage(){
  const history = useHistory();
  return(
    <div>
      <h3 className="homepage-text">For Explore Movies Click here</h3>
      <Button variant="outlined" color="secondary" onClick={()=>history.push("/movielist")}>Movielist</Button>
       <h3 className="homepage-text">For Add Movies Click here</h3>
       <Button variant="outlined" color="secondary" onClick={()=>history.push("/addmovies")}>AddMovies</Button>
    </div>
  );
}

function Home() {
  return (
    <div className="home">
      <h2 className="home-hello">Welcome to movies app</h2>
       <h6 className="home-det">you can explore movies after signup or login</h6>
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
  <div className="details-div">
        <iframe className='iframe-size' width="1000" height="500" src={moviedet.trailer} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        
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

  fetch(`${API_URL}/movies/${moviedet._id}`, {
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
     <Button onClick={()=>history.push("/homepage") }variant="outlined"><KeyboardBackspaceIcon/>Homepage</Button>
     
    </form>
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

const deleteMovie = (_id) =>{
  fetch(`${API_URL}/movies/${_id}`, {method:"DELETE"})
  .then(()=>getMovies());
};

  const history = useHistory();
  return(
    <section className='movies-section'>
      
         {movies.map(({pic, name, rating, summary, id, _id})=>(
       <Movie key={_id} name={name} pic={pic} rating={rating} summary={summary} id={_id}
       deleteButton= {<IconButton aria-label="delete" color="error"
       onClick={()=> deleteMovie(_id)}>
       <DeleteIcon />
     </IconButton>}
       editButton= {<IconButton 
        aria-label="edit"  color="success"
       onClick={()=>history.push("/movielist/edit/" + _id)}>
       <EditIcon />
     </IconButton>}
       />
     ))}
     <div>
     <Button onClick={()=>history.push("/homepage") }variant="outlined"><KeyboardBackspaceIcon/>Homepage</Button>
     </div>
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
      <div className="count-edit">
{editButton}{deleteButton}</div>
      
      
    </div>
    </div>
    </div>
    
    
  );
}


function LoginPage(){
  const history = useHistory();
  const formvalidationschema = yup.object({
    email: yup.string().min(5, "need a bigger email").required(),
    password: yup.string().min(5).max(12).required(),
  });

  const {handleSubmit, values, handleChange, handleBlur, errors, touched} = useFormik({
    initialValues: { email: "", password:""},
    validationSchema: formvalidationschema,

    onSubmit: (newlogin) => {
      console.log("onsubmit", newlogin);
      addData(newlogin);
    }
  });

  const addData =(newlogin)=>{
    console.log(newlogin)
      fetch(`${API_URL}/login`, {
        method:"POST",
        body: JSON.stringify(newlogin),
        headers: {'Content-Type': 'application/json'},
    }).then((response)=>{
      if(response.status===401){
        history.push("/loginfailed")
      }else{
        history.push("/homepage")
      }
    
      });

    };

  return(
    <form className="login-page" onSubmit={handleSubmit}>
      
     <h1 className="login-head">Login</h1>
     <h4 className="please">Please enter your e-mail id and Password</h4>  
    
    <TextField id="email" 
    name="email" 
    value = {values.email} 
    onChange={handleChange} 
    onBlur={handleBlur}
    type = "email" 
    error={errors.email && touched.email}
    helperText={errors.email && touched.email && errors.email}
    placeholder = "Enter your Email"/>


    <TextField id="password" 
    name="password" 
    value = {values.password} 
    onChange={handleChange} 
    onBlur={handleBlur}
    type="password"
    autoComplete="current-password"
    error={errors.password && touched.password}
    helperText={errors.password && touched.password && errors.password}
    placeholder = "Enter your Password"/>
    
    <Button variant="outlined" type="submit">log in</Button>

    
  </form>
    
  );
}

function SignupPage(){
  const history = useHistory();
  const formvalidationschema = yup.object({
    email: yup.string().min(5, "need a bigger email").required(),
    password: yup.string().min(5).max(12).required(),
  });

  const {handleSubmit, values, handleChange, handleBlur, errors, touched} = useFormik({
    initialValues: { email: "", password:""},
    validationSchema: formvalidationschema,

    onSubmit: (newSignup) => {
      console.log("onsubmit", newSignup);
      addData(newSignup);
    }
  });
  const addData =(newSignup)=>{
    console.log(newSignup)
      fetch(`${API_URL}/signup`, {
        method:"POST",
        body: JSON.stringify(newSignup),
        headers: {'Content-Type': 'application/json'},
    }).then((response)=>{
    if(response.status===400){
      history.push("/signupfailed")
    }else{
      history.push("/homepage")
    }
    // console.log(response.status));
    });
    };
  return(
    <form className="login-page" onSubmit={handleSubmit}>
    <div className="login-page">
    <h1 className="login-head">sign up</h1>
    <h4 className="please">Please enter your e-mail id and Password</h4>
    <TextField id="email" 
    name="email" 
    value = {values.email} 
    onChange={handleChange} 
    onBlur={handleBlur}
    type = "email" 
    error={errors.email && touched.email}
    helperText={errors.email && touched.email && errors.email}
    placeholder = "Enter your Email"/>

<TextField id="password" 
    name="password" 
    value = {values.password} 
    onChange={handleChange} 
    onBlur={handleBlur}
    type="password"
    autoComplete="current-password"
    error={errors.password && touched.password}
    helperText={errors.password && touched.password && errors.password}
    placeholder = "Enter your Password"/>
       <Button variant="contained" type="submit" >sign up</Button>
      
   </div>
   </form>
  );
}

function LoginFailed(){
  return(
    <div>
      <img className="failed" src="https://icon-library.com/images/red-cross-icon-png/red-cross-icon-png-27.jpg" alt="Login failed" />
      <h2>Invalid Credentials</h2>
    </div>
  );
}

function SignupSuccess(){
  return(
    <div>
      <img className="success" src="https://tse4.mm.bing.net/th?id=OIP.kPQ0PJHdeZL0H9HLZfbsGQAAAA&pid=Api&P=0&w=214&h=177" alt="signup success" />
      <h2>Successfully signed up</h2>
    </div>
  );
}

function SignupFailed(){
  return(
    <div>
      <img className="failed" src="https://icon-library.com/images/red-cross-icon-png/red-cross-icon-png-27.jpg" alt="signup failed" />
      <h2>email already exists or password must be longer</h2>
    </div>
  );
}
