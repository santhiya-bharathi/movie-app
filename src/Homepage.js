import Button from '@mui/material/Button';
import { useHistory } from "react-router-dom";

export function Homepage() {
  const history = useHistory();
  return (
    <div>
      <h3 className="homepage-text">For Explore Movies Click here</h3>
      <Button variant="outlined" color="secondary" onClick={() => history.push("/movielist")}>Movielist</Button>
      <h3 className="homepage-text">For Add Movies Click here</h3>
      <Button variant="outlined" color="secondary" onClick={() => history.push("/addmovies")}>AddMovies</Button>
    </div>
  );
}
