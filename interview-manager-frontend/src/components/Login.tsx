import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import AuthService from "../services/auth.service";
import "../style/Login.css";

interface State {
  redirect: string | null;
  username: string;
  password: string;
  loading: boolean;
  message: string;
}

const Login: React.FC = () => {
  const [state, setState] = useState<State>({
    redirect: null,
    username: "",
    password: "",
    loading: false,
    message: "",
  });

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("This field is required!"),
    password: Yup.string().required("This field is required!"),
  });

  const handleLogin = (formValue: { username: string; password: string }) => {
    const { username, password } = formValue;

    setState({
      ...state,
      message: "",
      loading: true,
    });

    AuthService.login(username, password).then(
      () => {
        setState({
          ...state,
          redirect: "/candidates",
        });
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setState({
          ...state,
          loading: false,
          message: resMessage,
        });
      }
    );
  };

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();

    if (currentUser) {
      setState({ ...state, redirect: "/candidates" });
    }
  }, []);

  const { loading, message, redirect } = state;

  const initialValues = {
    username: "",
    password: "",
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          <Form>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <Field name="username" type="text" className="form-control" />
              <ErrorMessage
                name="username"
                component="div"
                className="alert alert-danger"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field name="password" type="password" className="form-control" />
              <ErrorMessage
                name="password"
                component="div"
                className="alert alert-danger"
              />
            </div>

            <div className="form-group">
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Login</span>
              </button>
              <a href="/signup">Register</a>
            </div>

            {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Login;
