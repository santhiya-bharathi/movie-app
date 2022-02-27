import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useHistory } from "react-router-dom";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { API_URL } from '../App';

export function EditMovie() {

  const { id } = useParams();

  const [moviedet, setMoviedet] = useState(null);
  useEffect(() => {
    fetch(`${API_URL}/movies/${id}`, { method: "GET" })
      .then((data) => data.json())
      .then((mv) => setMoviedet(mv));
  }, [id]);

  return moviedet ? <UpdateMovie moviedet={moviedet} /> : "";

}
function UpdateMovie({ moviedet }) {
  const history = useHistory();

  const formvalidationschema = yup.object({
    pic: yup.string().required("why not fill this pic?").min(4),
    name: yup.string().required("why not fill this name?").min(1),
    rating: yup.number().required("why not fill this rating?").min(0).max(10),
    summary: yup.string().required("why not fill this summary?").min(20),
    trailer: yup.string().required("why not fill this trailer?").min(5),
  });

  const { handleSubmit, values, handleChange, handleBlur, errors, touched } = useFormik({
    initialValues: { name: moviedet.name, pic: moviedet.pic, rating: moviedet.rating, summary: moviedet.summary, trailer: moviedet.trailer },

    validationSchema: formvalidationschema,

    onSubmit: (updatedMovie) => {
      console.log("onsubmit", updatedMovie);
      editMovie(updatedMovie);
    }
  });

  const editMovie = (updatedMovie) => {

    console.log(updatedMovie);

    fetch(`${API_URL}/movies/${moviedet._id}`, {
      method: "PUT",
      body: JSON.stringify(updatedMovie),
      headers: { 'Content-Type': 'application/json' },
    }).then(() => history.push("/movielist"));
  };


  return (
    <form onSubmit={handleSubmit} className="in-con">


      <TextField id="pic"
        name="pic"
        value={values.pic}
        onChange={handleChange}
        onBlur={handleBlur}
        label="enter movie url"
        error={errors.pic && touched.pic}
        helperText={errors.pic && touched.pic && errors.pic}
        variant="filled" />


      <TextField id="name"
        name="name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        label="enter movie name"
        error={errors.name && touched.name}
        helperText={errors.name && touched.name && errors.name}
        variant="filled" />


      <TextField id="rating"
        name="rating"
        value={values.rating}
        onChange={handleChange}
        onBlur={handleBlur}
        label="enter movie rating"
        error={errors.rating && touched.rating}
        helperText={errors.rating && touched.rating && errors.rating}
        variant="filled" />


      <TextField id="summary"
        name="summary"
        value={values.summary}
        onChange={handleChange}
        onBlur={handleBlur} label="enter movie summary"
        error={errors.summary && touched.summary}
        helperText={errors.summary && touched.summary && errors.summary}
        variant="filled" />

      <TextField id="trailer"
        name="trailer"
        value={values.trailer}
        onChange={handleChange}
        onBlur={handleBlur} label="enter movie trailer"
        error={errors.trailer && touched.trailer}
        helperText={errors.trailer && touched.trailer && errors.trailer}
        variant="filled" />

      <Button type="submit" variant="contained">Save</Button>

    </form>
  );
}
