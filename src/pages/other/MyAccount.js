import { Fragment, useState, useEffect } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useGetProfileQuery, useUpdateProfileMutation } from "../../store/apiSlice/profileApiSlice";
import { useChangePasswordMutation, useLogoutMutation } from "../../store/apiSlice/authApiSlice";
import { useGetAllBillingAddressesQuery, useUpdateBillingAddressMutation, useCreateBillingAddressMutation, useDeleteBillingAddressMutation } from "../../store/apiSlice/billingApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { unauthenticate } from "../../store/slices/auth-slice";
import { useFormik } from "formik";
import { errorToast, successToast } from "../../helpers/toast";
import { useNavigate } from "react-router-dom";

const MyAccount = () => {
  let { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { data: billingAddresses, refetch } = useGetAllBillingAddressesQuery();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showEditDiv, setShowEditDiv] = useState(false);
  const [showAddDiv, setShowAddDiv] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { data: getProfile, refetch: refetchProfileDetails } = useGetProfileQuery();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [logout] = useLogoutMutation()
  const [changePassword, { isLoading: changePasswordLoading }] = useChangePasswordMutation();
  const [updateBillingAddress, { isLoading: updateLoading }] = useUpdateBillingAddressMutation();
  const [createBillingAddress, { isLoading: createLoading }] = useCreateBillingAddressMutation();
  const [deleteBillingAddress, { isLoading: deleteLoading }] = useDeleteBillingAddressMutation();

  const formik = useFormik({
    initialValues: { "first_name": getProfile?.first_name || "", "last_name": getProfile?.last_name || "", "email": getProfile?.email || "", "phone": getProfile?.phone || "" },
    validationSchema: "",
    enableReinitialize: true,
    onSubmit: async (values) => {
      updateProfile(values)
        .unwrap()
        .then((res) => {
          successToast("Profile updated successfully");
          refetchProfileDetails();
        })
        .catch((error) => {
          errorToast(error.data.detail || "Something went wrong, Please try again later");
        });
    }
  });

  const changePasswordformik = useFormik({
    initialValues: { "current_password": "", "new_password": "", "new_password_confirm": "" },
    validationSchema: "",
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (values.new_password !== values.new_password_confirm) {
        errorToast("New Passwords do not match");
        return;
      } else {
        changePassword(values)
          .unwrap()
          .then((res) => {
            successToast("Password updated successfully, please login again");
            dispatch(unauthenticate());
            logout({});
            navigate('/')
          })
          .catch((error) => {
            errorToast(error?.data?.detail || "Something went wrong, Please try again later");
          });
      }
    }
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleEditDivOpen = (address) => {
    setSelectedAddress(address);
    setShowEditDiv(true);
  };

  const handleEditDivClose = () => {
    setSelectedAddress(null);
    setShowEditDiv(false);
  };

  const handleAddDivOpen = () => {
    setShowAddDiv(true);
  };

  const handleAddDivClose = () => {
    setShowAddDiv(false);
  };

  const handleDeleteConfirm = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteCancel = () => {
    setDeleteId(null);
    setShowDeleteConfirm(false);
  };

  const handleDeleteAddress = () => {
    deleteBillingAddress(deleteId)
      .unwrap()
      .then((res) => {
        successToast("Address deleted successfully");
        refetch();
        setShowDeleteConfirm(false);
      })
      .catch((error) => {
        errorToast(error.data.detail || "Failed to delete address");
        setShowDeleteConfirm(false);
      });
  };

  const editFormik = useFormik({
    initialValues: {
      first_name: selectedAddress?.first_name || "",
      last_name: selectedAddress?.last_name || "",
      street_address: selectedAddress?.street_address || "",
      apartment: selectedAddress?.apartment || "",
      city: selectedAddress?.city || "",
      state: selectedAddress?.state || "",
      country: selectedAddress?.country || "",
      postcode: selectedAddress?.postcode || "",
      phone: selectedAddress?.phone || "",
      email: selectedAddress?.email || "",
    },
    validationSchema: "",
    enableReinitialize: true,
    onSubmit: async (values) => {
      updateBillingAddress({ id: selectedAddress.id, ...values })
        .unwrap()
        .then((res) => {
          successToast("Address updated successfully");
          refetch();
          handleEditDivClose();
        })
        .catch((error) => {
          errorToast(error.data.detail || "Failed to update address");
        });
    },
  });

  const addFormik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      street_address: "",
      apartment: "",
      city: "",
      state: "",
      country: "",
      postcode: "",
      phone: "",
      email: "",
    },
    validationSchema: "",
    onSubmit: async (values) => {
      createBillingAddress(values)
        .unwrap()
        .then((res) => {
          successToast("Address added successfully");
          refetch();
          handleAddDivClose();
        })
        .catch((error) => {
          errorToast(error.data.detail || "Failed to add address");
        });
    },
  });

  if (!isAuthenticated) {
    return <Navigate to={`/login-register`} />;
  }

  return (
    <Fragment>
      <SEO titleTemplate="My Account" description="My Account page of Tagworld eCommerce." />
      <LayoutOne headerTop="visible">
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
                          </div>
                          <div className="billing-back-btn">
                            <div className="billing-btn">
                              <button onClick={formik.handleSubmit}>
                                {isLoading ? "Loading..." : "Submit"}
                              </button>
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
                                <input
                                  type="password"
                                  onChange={changePasswordformik.handleChange}
                                  value={changePasswordformik.values.current_password}
                                  name={'current_password'}
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="billing-info">
                                <label>New Password</label>
                                <input
                                  type="password"
                                  onChange={changePasswordformik.handleChange}
                                  value={changePasswordformik.values.new_password}
                                  name={'new_password'}
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="billing-info">
                                <label>New Password Confirm</label>
                                <input
                                  type="password"
                                  onChange={changePasswordformik.handleChange}
                                  value={changePasswordformik.values.new_password_confirm}
                                  name={'new_password_confirm'}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="billing-back-btn">
                            <div className="billing-btn">
                              <button onClick={changePasswordformik.handleSubmit}>
                                {changePasswordLoading ? 'Changing password...' : 'Change password'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2" className="single-my-account mb-20">
                      <Accordion.Header className="panel-heading">
                        <span>3 .</span> Modify your address book entries{" "}
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="myaccount-info-wrapper">
                          <div className="account-info-wrapper">
                            <h4>Address Book Entries</h4>
                          </div>
                          {billingAddresses?.length > 0 ? (
                            billingAddresses?.map((address) => (
                              <div key={address.id} className="row">
                                <div className="col-lg-6 col-md-6">
                                  <div className="billing-info">
                                    <p><strong>{address.first_name} {address.last_name}</strong></p>
                                    <p>{address.street_address} {address.apartment}</p>
                                    <p>{address.city}, {address.state}</p>
                                    <p>{address.country} - {address.postcode}</p>
                                    <p>{address.phone}</p>
                                    <p>{address.email}</p>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="billing-back-btn">
                                    <div className="billing-btn">
                                      <button onClick={() => handleEditDivOpen(address)}>Edit</button>
                                      <button onClick={() => handleDeleteConfirm(address.id)}>Delete</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p>No addresses found.</p>
                          )}
                          <div className="billing-back-btn">
                            <div className="billing-btn">
                              <button onClick={handleAddDivOpen}>Add New Address</button>
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

        {/* Edit Address Div */}
        {showEditDiv && (
          <div className="custom-modal">
            <div className="custom-modal-content">
              <div className="custom-modal-header">
                <h5 className="custom-modal-title">Edit Billing Address</h5>
                <button type="button" className="close" onClick={handleEditDivClose}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="custom-modal-body">
                <form>
                  <div className="billing-info">
                    <label>First Name</label>
                    <input type="text" onChange={editFormik.handleChange} value={editFormik.values.first_name} name="first_name" />
                  </div>
                  <div className="billing-info">
                    <label>Last Name</label>
                    <input type="text" onChange={editFormik.handleChange} value={editFormik.values.last_name} name="last_name" />
                  </div>
                  <div className="billing-info">
                    <label>Street Address</label>
                    <input type="text" onChange={editFormik.handleChange} value={editFormik.values.street_address} name="street_address" />
                  </div>
                  <div className="billing-info">
                    <label>Apartment</label>
                    <input type="text" onChange={editFormik.handleChange} value={editFormik.values.apartment} name="apartment" />
                  </div>
                  <div className="billing-info">
                    <label>City</label>
                    <input type="text" onChange={editFormik.handleChange} value={editFormik.values.city} name="city" />
                  </div>
                  <div className="billing-info">
                    <label>State</label>
                    <input type="text" onChange={editFormik.handleChange} value={editFormik.values.state} name="state" />
                  </div>
                  <div className="billing-info">
                    <label>Country</label>
                    <input type="text" onChange={editFormik.handleChange} value={editFormik.values.country} name="country" />
                  </div>
                  <div className="billing-info">
                    <label>Postcode</label>
                    <input type="text" onChange={editFormik.handleChange} value={editFormik.values.postcode} name="postcode" />
                  </div>
                  <div className="billing-info">
                    <label>Phone</label>
                    <input type="text" onChange={editFormik.handleChange} value={editFormik.values.phone} name="phone" />
                  </div>
                  <div className="billing-info">
                    <label>Email</label>
                    <input type="email" onChange={editFormik.handleChange} value={editFormik.values.email} name="email" />
                  </div>
                  <div className="billing-back-btn">
                    <div className="billing-btn">
                      <button type="button" onClick={editFormik.handleSubmit}>
                        {updateLoading ? "Loading" : 'Submit'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Add Address Div */}
        {showAddDiv && (
          <div className="custom-modal">
            <div className="custom-modal-content">
              <div className="custom-modal-header">
                <h5 className="custom-modal-title">Add Billing Address</h5>
                <button type="button" className="close" onClick={handleAddDivClose}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="custom-modal-body">
                <form>
                  <div className="billing-info">
                    <label>First Name</label>
                    <input type="text" onChange={addFormik.handleChange} value={addFormik.values.first_name} name="first_name" />
                  </div>
                  <div className="billing-info">
                    <label>Last Name</label>
                    <input type="text" onChange={addFormik.handleChange} value={addFormik.values.last_name} name="last_name" />
                  </div>
                  <div className="billing-info">
                    <label>Street Address</label>
                    <input type="text" onChange={addFormik.handleChange} value={addFormik.values.street_address} name="street_address" />
                  </div>
                  <div className="billing-info">
                    <label>Apartment</label>
                    <input type="text" onChange={addFormik.handleChange} value={addFormik.values.apartment} name="apartment" />
                  </div>
                  <div className="billing-info">
                    <label>City</label>
                    <input type="text" onChange={addFormik.handleChange} value={addFormik.values.city} name="city" />
                  </div>
                  <div className="billing-info">
                    <label>State</label>
                    <input type="text" onChange={addFormik.handleChange} value={addFormik.values.state} name="state" />
                  </div>
                  <div className="billing-info">
                    <label>Country</label>
                    <input type="text" onChange={addFormik.handleChange} value={addFormik.values.country} name="country" />
                  </div>
                  <div className="billing-info">
                    <label>Postcode</label>
                    <input type="text" onChange={addFormik.handleChange} value={addFormik.values.postcode} name="postcode" />
                  </div>
                  <div className="billing-info">
                    <label>Phone</label>
                    <input type="text" onChange={addFormik.handleChange} value={addFormik.values.phone} name="phone" />
                  </div>
                  <div className="billing-info">
                    <label>Email</label>
                    <input type="email" onChange={addFormik.handleChange} value={addFormik.values.email} name="email" />
                  </div>
                  <div className="billing-back-btn">
                    <div className="billing-btn">
                      <button type="button" onClick={addFormik.handleSubmit}>
                        {createLoading ? "Loading" : 'Submit'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Div */}
        {showDeleteConfirm && (
          <div className="custom-modal">
            <div className="custom-modal-content">
              <div className="custom-modal-header">
                <h5 className="custom-modal-title">Confirm Delete</h5>
                <button type="button" className="close" onClick={handleDeleteCancel}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="custom-modal-body">
                <p>Are you sure you want to delete this address?</p>
                <div className="billing-back-btn">
                  <div className="billing-btn">
                    <button type="button" onClick={handleDeleteAddress}>
                      {deleteLoading ? "Loading" : 'Yes'}
                    </button>
                    <button type="button" onClick={handleDeleteCancel}>No</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </LayoutOne>
    </Fragment>
  );
};

export default MyAccount;

