import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useHistory } from "react-router-dom";
import { API_URL } from './App';

export function MovieList() {
  const [movies, setMovies] = useState([]);

  const getMovies = () => {
    fetch(`${API_URL}/movies`, { method: "GET" })
      .then((data) => data.json())
      .then((mvs) => setMovies(mvs));
  };


  useEffect(getMovies, []);

  const deleteMovie = (_id) => {
    fetch(`${API_URL}/movies/${_id}`, { method: "DELETE" })
      .then(() => getMovies());
  };

  const history = useHistory();
  return (
    <section className='movies-section'>

      {movies.map(({ pic, name, rating, summary, id, _id }) => (
        <Movie key={_id} name={name} pic={pic} rating={rating} summary={summary} id={_id}
          deleteButton={<IconButton aria-label="delete" color="error"
            onClick={() => deleteMovie(_id)}>
            <DeleteIcon />
          </IconButton>}
          editButton={<IconButton
            aria-label="edit" color="success"
            onClick={() => history.push("/movielist/edit/" + _id)}>
            <EditIcon />
          </IconButton>} />
      ))}
      <div>
        <Button onClick={() => history.push("/homepage")} variant="outlined"><KeyboardBackspaceIcon />Homepage</Button>
      </div>
    </section>
  );
}
function Movie({ pic, name, rating, summary, id, deleteButton, editButton }) {
  const [show, setShow] = useState(true);
  const history = useHistory();
  const styles = {
    color: rating < 8 ? "crimson" : "green",
    fontWeight: "bold"
  };
  const summaryStyles = {
    display: show ? "block" : "none"
  };
  return (

    <div className="container">

      <div className="full-det">

        <img className="user-pic" src={pic} alt={name} />
        <div className="details">

          <div className="det"> <h1 className="user-name">{name}
            <IconButton onClick={() => {
              console.log(id);

              history.push("/movielist/" + id);
            }} color="info" aria-label="more-info">
              <InfoIcon />
            </IconButton>
            <IconButton onClick={() => setShow(!show)} color="primary" aria-label="description">
              {show ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </h1>

            <p style={styles}> ⭐{rating} </p>
          </div>

          {show ? <p style={summaryStyles}>{summary}</p> : ""}
          <div className="count-edit">
            {editButton}{deleteButton}</div>


        </div>
      </div>
    </div>


  );
}
