

import { useEffect, useState } from "react";
import { API_URL, Buttonbar } from '../App';

export function Home() {
 
  return (
    <div>
    <Buttonbar />
    <div className="home">
      <h2 className="home-hello">Welcome to the movie app</h2>
      <h6 className="home-det">you can explore the movies</h6>

     <Pagehomemovie />

    </div>
    </div>
  );
}

function Pagehomemovie(){

  const [movies, setMovies] = useState([]);

  const getMovies = () => {
    fetch(`${API_URL}/movies`, { method: "GET" })
      .then((data) => data.json())
      .then((mvs) => setMovies(mvs));
  };


  useEffect(getMovies, []);

  return(
    <section>
       {movies.map(({ pic, name, id, _id }) => (
        <Moviepage key={_id} name={name} pic={pic} id={_id}
          />
      ))}
    </section>
  );
}


function Moviepage({ pic, name }){
  return(
    <div className="container">

      <div className="full-det-home">

        <img className="user-pic-home" src={pic} alt={name} />
        <div>
        <p className="user-name-home">{name} </p>
        </div>
       
        </div>
    </div>
  );
}