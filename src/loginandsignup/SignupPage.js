import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useHistory } from "react-router-dom";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { API_URL } from '../App';

export function SignupPage() {
  const history = useHistory();
  const formvalidationschema = yup.object({
    email: yup.string().min(5, "need a bigger email").required(),
    password: yup.string().min(5).max(12).required(),
  });

  const { handleSubmit, values, handleChange, handleBlur, errors, touched } = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: formvalidationschema,

    onSubmit: (newSignup) => {
      console.log("onsubmit", newSignup);
      addData(newSignup);
    }
  });
  const addData = (newSignup) => {
    console.log(newSignup);
    fetch(`${API_URL}/signup`, {
      method: "POST",
      body: JSON.stringify(newSignup),
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
      if (response.status === 400) {
        history.push("/signupfailed");
      } else {
        history.push("/");
      }
      // console.log(response.status));
    });
  };
  return (
    <form className="login-page" onSubmit={handleSubmit}>
      <div className="login-page">
        <h1 className="login-head">sign up</h1>
        <h4 className="please">Please enter your e-mail id and Password</h4>
        <TextField id="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          type="email"
          error={errors.email && touched.email}
          helperText={errors.email && touched.email && errors.email}
          placeholder="Enter your Email" />

        <TextField id="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          type="password"
          autoComplete="current-password"
          error={errors.password && touched.password}
          helperText={errors.password && touched.password && errors.password}
          placeholder="Enter your Password" />
        <Button variant="contained" type="submit">sign up</Button>
        
      
      </div>
    </form>
  );
}
export function SignupFailed() {
  return (
    <div>
      <img className="failed" src="https://icon-library.com/images/red-cross-icon-png/red-cross-icon-png-27.jpg" alt="signup failed" />
      <h2>email already exists or password must be longer</h2>
    </div>
  );
}
