import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useHistory } from "react-router-dom";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { API_URL, Buttonbar } from '../App';

export function AddMovie() {
  const history = useHistory();

  const formvalidationschema = yup.object({
    pic: yup.string().required("why not fill this pic?").min(4),
    name: yup.string().required("why not fill this name?").min(1),
    rating: yup.number().required("why not fill this rating?").min(0).max(10),
    summary: yup.string().required("why not fill this summary?").min(20),
    trailer: yup.string().required("why not fill this trailer?").min(5),
  });

  const { handleSubmit, values, handleChange, handleBlur, errors, touched } = useFormik({
    initialValues: { name: "", pic: "", rating: "", summary: "", trailer: "" },

    validationSchema: formvalidationschema,

    onSubmit: (newMovies) => {
      console.log("onsubmit", newMovies);
      addMovie(newMovies);
    }
  });

  const addMovie = (newMovies) => {

    console.log(newMovies);
    fetch(`${API_URL}/movies`, {
      method: "POST",
      body: JSON.stringify(newMovies),
      headers: { 'Content-Type': 'application/json' },
    }).then(() => history.push("/movielist"));

  };

  return (
    <div>
      <Buttonbar />
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

      <Button type="submit" variant="contained">Add movies</Button>
      <Button onClick={() => history.push("/homepage")} variant="outlined"><KeyboardBackspaceIcon />Homepage</Button>

    </form>
    </div>
  );
}
