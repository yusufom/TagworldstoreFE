/* eslint-disable no-unused-vars */
import React, { Fragment } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { useLoginMutation, useRegisterMutation } from "../../store/apiSlice/authApiSlice";
import { errorToast, successToast } from "../../helpers/toast";
import { authenticate } from "../../store/slices/auth-slice";
import { useStartCreateMultipleCartMutation } from "../../store/apiSlice/cartApiSlice";
import { deleteAllFromCart } from "../../store/slices/cart-slice";
import FadeLoader from "react-spinners/FadeLoader";

const override = {
  width: "10px",
  height: "10px",
};
const LoginRegister = () => {
  let { pathname } = useLocation();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [login, { isLoading }] = useLoginMutation();
  const [register, { isLoading: registerLoading }] = useRegisterMutation();
  const [startCreateMultipleCart, { isLoading: startCreateMultipleCartLoading }] = useStartCreateMultipleCartMutation();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: "",
    enableReinitialize: true,
    onSubmit: async (values) => {
      if(values.email === "" || values.password === ""){
        errorToast("Email or Password is required");
        return
      }
      try {
        await login(values).unwrap().then(async (res) => {
          dispatch(authenticate(res));
          successToast("Login successful");

          if (cartItems.length > 0) {
            await startCreateMultipleCart({ token: res.access, data: cartItems });
            dispatch(deleteAllFromCart());
          }
          window.location.href = "/";
        }).catch((error) => {
          console.log(error)
          errorToast(error?.data?.detail || "An error occurred during login.");
        });

      } catch (error) {
        console.error('Error in userLogin:', error);
        errorToast(error?.data?.detail || "An error occurred during login.");
      }
    }
  });

  const registerFormik = useFormik({
    initialValues: { email: "", first_name: "", last_name: "", phone: "", password: "", confirm_password: ""  },
    validationSchema: "",
    enableReinitialize: true,
    onSubmit: async (values) => {
      if(values.email === "" || values.password === "" || values.first_name === "" || values.last_name === "" || values.phone === ""){
        errorToast("All Fields are required");
        return
      }
      if(values.password !== values.confirm_password){
        errorToast("Password does not match");
        return
      }
      try {
        const res = await register(values).unwrap();
        successToast("Registration successful, Please visit your email to activate your account");
      } catch (error) {
        console.error('Error in userRegister:', error);
        const errorToastData = error?.data || {};
        if (errorToastData.password) {
          errorToast(errorToastData.password[0]);
        } else if (errorToastData.username) {
          errorToast(errorToastData.username[0]);
        } else {
          errorToast("An error occurred during registration.");
        }
      }
    }
  });

  return (
    <Fragment>
      <SEO titleTemplate="Login" description="Login page of flone react minimalist eCommerce template." />
      <LayoutOne headerTop="visible">
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
                                placeholder="Email"
                                onChange={formik.handleChange}
                                value={formik.values.email}
                                name={'email'}
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
                                  <Link to={process.env.PUBLIC_URL + "/forgotpassword"}>
                                    Forgot Password?
                                  </Link>
                                </div>
                                <button type="button" onClick={formik.handleSubmit}>

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
                                placeholder="First Name"
                                onChange={formik.handleChange}
                                value={formik.values.first_name}
                                name={'first_name'}
                              />
                              <input
                                type="text"
                                placeholder="Last Name"
                                onChange={formik.handleChange}
                                value={formik.values.last_name}
                                name={'last_name'}
                              />
                              <input
                                type="tel"
                                placeholder="Phone"
                                onChange={formik.handleChange}
                                value={formik.values.phone}
                                name={'phone'}
                              />
                              <input
                                type="password"
                                placeholder="Password"
                                onChange={registerFormik.handleChange}
                                value={registerFormik.values.password}
                                name={'password'}
                                
                              />
                              <input
                                type="password"
                                placeholder="Confirm Password"
                                onChange={formik.handleChange}
                                value={formik.values.confirm_password}
                                name={'confirm_password'}
                              />
                              <div className="button-box">
                                <button type="button" onClick={registerFormik.handleSubmit}>
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
