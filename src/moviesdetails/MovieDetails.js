import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useHistory } from "react-router-dom";
import { API_URL } from '../App';

export function MovieDetails() {
  const history = useHistory();
  const { id } = useParams();

  console.log("the id is ", id);

  const [moviedet, setMoviedet] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/movies/${id}`, { method: "GET" })
      .then((data) => data.json())
      .then((mv) => setMoviedet(mv));
  }, [id]);

  console.log(moviedet);
  const styles = {
    color: moviedet.rating < 8 ? "crimson" : "green",
    fontWeight: "bold"
  };
  return (
    <div className="details-div">
      <iframe className='iframe-size' width="1000" height="500" src={moviedet.trailer} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

      <div className="det">
        <h1 className="user-name">{moviedet.name}</h1>
        <p style={styles}> ⭐{moviedet.rating} </p>
      </div>

      <p>{moviedet.summary}</p>

      <Button onClick={() => history.push("/movielist")} variant="outlined"><KeyboardBackspaceIcon />Back</Button>
    </div>
  );
}
