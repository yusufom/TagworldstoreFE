import { Fragment } from "react";
import { useLocation, Navigate } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useGetProfileQuery, useUpdateProfileMutation } from "../../store/apiSlice/profileApiSlice";
import { useFormik } from 'formik';
import { errorToast, successToast } from "../../helpers/toast";
import { useChangePasswordMutation } from "../../store/apiSlice/authApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { unauthenticate } from "../../store/slices/auth-slice";

const MyAccount = () => {
  let { pathname } = useLocation();
  const dispatch = useDispatch()
  const { data: getProfile, refetch } = useGetProfileQuery()
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: changePasswordLoading }] = useChangePasswordMutation();

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  )



  // {id: 1, first_name: 'ola', last_name: 'ase', email: 'dss@ff.com', phone: '23'}
  const formik = useFormik(
    {
      initialValues: { "first_name": getProfile?.first_name || "", "last_name": getProfile?.last_name || "", "email": getProfile?.email || "", "phone": getProfile?.phone || "" },
      validationSchema: "",
      enableReinitialize: true,
      onSubmit: async (values) => {
        updateProfile(values)
          .unwrap()
          .then((res) => {
            successToast("Profile updated successfully")
            refetch()
          })
          .catch(error => {
            errorToast(error.data.detail || "Something went wrong, Please try again later");
          });
      }
    }
  )

  const changePasswordformik = useFormik(
    {
      initialValues: { "current_password": "", "new_password": "", "new_password_confirm": "" },
      validationSchema: "",
      enableReinitialize: true,
      onSubmit: async (values) => {
        if (values.new_password !== values.new_password_confirm) {
          errorToast("New Passwords do not match")
          return
        } else {
          changePassword(values)
            .unwrap()
            .then((res) => {
              successToast("Password updated successfully, please login again")
              dispatch(unauthenticate())

            })
            .catch(error => {
              errorToast(error?.data?.detail || "Something went wrong, Please try again later");
            });
        }
      }
    }
  )

  if (!isAuthenticated) {
    return <Navigate to={`/login-register`} />;
  }


  return (
    <Fragment>
      <SEO
        titleTemplate="My Account"
        description="My Account page of Tagworld eCommerce."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "My Account", path: process.env.PUBLIC_URL + pathname }
          ]}
        />

        <div className="myaccount-area pb-80 pt-100">
          <div className="container">
            <div className="row">
              <div className="ms-auto me-auto col-lg-9">
                <div className="myaccount-wrapper">
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0" className="single-my-account mb-20">
                      <Accordion.Header className="panel-heading">
                        <span>1 .</span> Edit your account information{" "}
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="myaccount-info-wrapper">
                          <div className="account-info-wrapper">
                            <h4>My Account Information</h4>
                            <h5>Your Personal Details</h5>
                          </div>
                          <div className="row">
                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info">
                                <label>First Name</label>
                                <input type="text"
                                  onChange={formik.handleChange}
                                  value={formik.values.first_name}
                                  name={'first_name'}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info">
                                <label>Last Name</label>
                                <input type="text"
                                  onChange={formik.handleChange}
                                  value={formik.values.last_name}
                                  name={'last_name'}
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="billing-info">
                                <label>Email Address</label>
                                <input type="email"
                                  onChange={formik.handleChange}
                                  value={formik.values.email}
                                  name={'email'}
                                  disabled
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info">
                                <label>Telephone</label>
                                <input type="text"
                                  onChange={formik.handleChange}
                                  value={formik.values.phone}
                                  name={'phone'}
                                />
                              </div>
                            </div>
                            {/* <div className="col-lg-6 col-md-6">
                              <div className="billing-info">
                                <label>Fax</label>
                                <input type="text" />
                              </div>
                            </div> */}
                          </div>
                          <div className="billing-back-btn">
                            <div className="billing-btn">
                              <button onClick={formik.handleSubmit}>Save</button>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>


                    <Accordion.Item eventKey="1" className="single-my-account mb-20">
                      <Accordion.Header className="panel-heading">
                        <span>2 .</span> Change your password
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="myaccount-info-wrapper">
                          <div className="account-info-wrapper">
                            <h4>Change Password</h4>
                            <h5>Your Password</h5>
                          </div>
                          <div className="row">
                            <div className="col-lg-12 col-md-12">
                              <div className="billing-info">
                                <label>Current Password</label>
                                <input type="password"
                                  onChange={changePasswordformik.handleChange}
                                  value={changePasswordformik.values.current_password}
                                  name={'current_password'}
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="billing-info">
                                <label>New Password</label>
                                <input type="password"
                                  onChange={changePasswordformik.handleChange}
                                  value={changePasswordformik.values.new_password}
                                  name={'new_password'}
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="billing-info">
                                <label>New Password</label>
                                <input type="password"
                                  onChange={changePasswordformik.handleChange}
                                  value={changePasswordformik.values.new_password_confirm}
                                  name={'new_password_confirm'}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="billing-back-btn">
                            <div className="billing-btn">
                              <button onClick={changePasswordformik.handleSubmit}>Continue</button>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="2" className="single-my-account mb-20">
                      <Accordion.Header className="panel-heading">
                        <span>3 .</span> Modify your address book entries
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="myaccount-info-wrapper">
                          <div className="account-info-wrapper">
                            <h4>Address Book Entries</h4>
                          </div>
                          <div className="entries-wrapper">
                            <div className="row">
                              <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center">
                                <div className="entries-info text-center">
                                  <p>John Doe</p>
                                  <p>Paul Park </p>
                                  <p>Lorem ipsum dolor set amet</p>
                                  <p>NYC</p>
                                  <p>New York</p>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center">
                                <div className="entries-edit-delete text-center">
                                  <button className="edit">Edit</button>
                                  <button>Delete</button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="billing-back-btn">
                            <div className="billing-btn">
                              <button type="submit">Continue</button>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default MyAccount;
