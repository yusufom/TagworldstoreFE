import React, { Fragment } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useLoginMutation, useRegisterMutation } from "../../store/apiSlice/authApiSlice";
import { errorToast, successToast } from "../../helpers/toast";

const LoginRegister = () => {
  let { pathname } = useLocation();

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  )

  const [login, { isLoading }] = useLoginMutation();
  const [register, { isLoading: registerLoading }] = useRegisterMutation();


  const formik = useFormik(
    {
      initialValues: { "username": "", "password": "" },
      validationSchema: "",
      enableReinitialize: true,
      onSubmit: async (values) => {
        login(values)
          .unwrap()
          .then((res) => {
            console.log(res);
            successToast("Login successful")
          })
          .catch(error => {
            console.error('Error in userLogin:', error);
            errorToast(error.data.detail);
          });
      }
    }
  )

  const registerFormik = useFormik(
    {
      initialValues: { "username": "", "password": "", "email": "" },
      validationSchema: "",
      enableReinitialize: true,
      onSubmit: async (values) => {
        register(values)
          .unwrap()
          .then((res) => {
            console.log(res);
            successToast("Registration successful, Please visit your email to activate your account")
          })
          .catch(error => {
            console.error('Error in userLogin:', error);
            const errorToastData = error.data
            if (errorToastData.password) {
              errorToast(errorToastData.password[0])
            } else if (errorToastData.username) {
              errorToast(errorToastData.username[0])
            }
          });
      }
    }
  )

  // if (isAuthenticated) {
  //   return <Navigate to={`/`} />;
  // }


  return (
    <Fragment>
      <SEO
        titleTemplate="Login"
        description="Login page of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "Login Register", path: process.env.PUBLIC_URL + pathname }
          ]}
        />
        <div className="login-register-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-12 ms-auto me-auto">
                <div className="login-register-wrapper">
                  <Tab.Container defaultActiveKey="login">
                    <Nav variant="pills" className="login-register-tab-list">
                      <Nav.Item>
                        <Nav.Link eventKey="login">
                          <h4>Login</h4>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="register">
                          <h4>Register</h4>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane eventKey="login">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form method="POST">
                              <input
                                type="text"
                                placeholder="Username"
                                onChange={formik.handleChange}
                                value={formik.values.username}
                                name={'username'}
                              />
                              <input
                                type="password"
                                placeholder="Password"
                                onChange={formik.handleChange}
                                value={formik.values.password}
                                name={'password'}
                              />
                              <div className="button-box">
                                <div className="login-toggle-btn">
                                  <input type="checkbox" />
                                  <label className="ml-10">Remember me</label>
                                  <Link to={process.env.PUBLIC_URL + "/"}>
                                    Forgot Password?
                                  </Link>
                                </div>
                                <button onClick={formik.handleSubmit}>
                                  <span>Login</span>
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="register">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form>
                              <input
                                placeholder="Email"
                                type="email"
                                onChange={registerFormik.handleChange}
                                value={registerFormik.values.email}
                                name={'email'}
                              />
                              <input
                                type="text"
                                placeholder="Username"
                                onChange={registerFormik.handleChange}
                                value={registerFormik.values.username}
                                name={'username'}
                              />
                              <input
                                type="password"
                                placeholder="Password"
                                onChange={registerFormik.handleChange}
                                value={registerFormik.values.password}
                                name={'password'}
                              />

                              <div className="button-box">
                                <button onClick={registerFormik.handleSubmit}>
                                  <span>Register</span>
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default LoginRegister;
