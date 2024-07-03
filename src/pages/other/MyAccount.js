import { Fragment, useState, useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useGetProfileQuery, useUpdateProfileMutation } from "../../store/apiSlice/profileApiSlice";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { errorToast, successToast } from "../../helpers/toast";
import { useChangePasswordMutation } from "../../store/apiSlice/authApiSlice";
import { useGetAllBillingAddressesQuery, useUpdateBillingAddressMutation, useCreateBillingAddressMutation, useDeleteBillingAddressMutation } from "../../store/apiSlice/billingApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { unauthenticate } from "../../store/slices/auth-slice";

const MyAccount = () => {
  let { pathname } = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { data: billingAddresses, refetch } = useGetAllBillingAddressesQuery();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { data: getProfile, refetch:refetchProfileDetails } = useGetProfileQuery()
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: changePasswordLoading }] = useChangePasswordMutation();
  const [updateBillingAddress, { isLoading: updateLoading }] = useUpdateBillingAddressMutation();
  const [createBillingAddress, { isLoading: createLoading }] = useCreateBillingAddressMutation();
  const [deleteBillingAddress, { isLoading: deleteLoading }] = useDeleteBillingAddressMutation();

  const [showPasswordModal, setShowPasswordModal] = useState(false);


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
            refetchProfileDetails()
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

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleEditModalOpen = (address) => {
    setSelectedAddress(address);
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setSelectedAddress(null);
    setShowEditModal(false);
  };

  const handleAddModalOpen = () => {
    setShowAddModal(true);
  };

  const handleAddModalClose = () => {
    setShowAddModal(false);
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

  const handlePasswordModalOpen = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordModalClose = () => {
    setShowPasswordModal(false);
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
          handleEditModalClose();
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
      email: "", // Shouldn't be editable or clickable
    },
    validationSchema: "",
    onSubmit: async (values) => {
      createBillingAddress(values)
        .unwrap()
        .then((res) => {
          successToast("Address added successfully");
          refetch();
          handleAddModalClose();
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
                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info">
                                <label>New Password</label>
                                <input type="password"
                                  onChange={changePasswordformik.handleChange}
                                  value={changePasswordformik.values.new_password}
                                  name={'new_password'}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info">
                                <label>Confirm Password</label>
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
                        <span>3 .</span> Manage your addresses
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="myaccount-info-wrapper">
                          <div className="account-info-wrapper">
                            <h4>Manage Addresses</h4>
                          </div>
                          <div className="entries-wrapper">
                            {billingAddresses && billingAddresses.map((address) => (
                              <div key={address.id} className="row mb-3">
                                <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center">
                                  <div className="entries-info text-center">
                                    <p>{address.first_name} {address.last_name}</p>
                                    <p>{address.street_address}</p>
                                    <p>{address.city}</p>
                                    <p>{address.state}, {address.country}, {address.postcode}</p>
                                    <p>{address.phone}</p>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center">
                                  <div className="entries-edit-delete text-center">
                                    <button className="edit" onClick={() => handleEditModalOpen(address)}>Edit</button>
                                    <button onClick={() => handleDeleteConfirm(address.id)}>Delete</button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="billing-back-btn">
                            <div className="billing-btn">
                              <button onClick={handleAddModalOpen}>Add New Address</button>
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

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={editFormik.handleSubmit}>
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="billing-info">
                  <label>First Name</label>
                  <input type="text"
                    onChange={editFormik.handleChange}
                    value={editFormik.values.first_name}
                    name="first_name"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="billing-info">
                  <label>Last Name</label>
                  <input type="text"
                    onChange={editFormik.handleChange}
                    value={editFormik.values.last_name}
                    name="last_name"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="billing-info">
                  <label>Street Address</label>
                  <input type="text"
                    onChange={editFormik.handleChange}
                    value={editFormik.values.street_address}
                    name="street_address"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="billing-info">
                  <label>Apartment</label>
                  <input type="text"
                    onChange={editFormik.handleChange}
                    value={editFormik.values.apartment}
                    name="apartment"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="billing-info">
                  <label>City</label>
                  <input type="text"
                    onChange={editFormik.handleChange}
                    value={editFormik.values.city}
                    name="city"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="billing-info">
                  <label>State</label>
                  <input type="text"
                    onChange={editFormik.handleChange}
                    value={editFormik.values.state}
                    name="state"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="billing-info">
                  <label>Country</label>
                  <input type="text"
                    onChange={editFormik.handleChange}
                    value={editFormik.values.country}
                    name="country"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="billing-info">
                  <label>Postcode</label>
                  <input type="text"
                    onChange={editFormik.handleChange}
                    value={editFormik.values.postcode}
                    name="postcode"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="billing-info">
                  <label>Telephone</label>
                  <input type="text"
                    onChange={editFormik.handleChange}
                    value={editFormik.values.phone}
                    name="phone"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={handleEditModalClose}>
                Close
              </Button>
              <Button variant="primary" type="submit" disabled={updateLoading}>
                {updateLoading ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={handleAddModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={addFormik.handleSubmit}>
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="billing-info">
                  <label>First Name</label>
                  <input type="text"
                    onChange={addFormik.handleChange}
                    value={addFormik.values.first_name}
                    name="first_name"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="billing-info">
                  <label>Last Name</label>
                  <input type="text"
                    onChange={addFormik.handleChange}
                    value={addFormik.values.last_name}
                    name="last_name"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="billing-info">
                  <label>Street Address</label>
                  <input type="text"
                    onChange={addFormik.handleChange}
                    value={addFormik.values.street_address}
                    name="street_address"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="billing-info">
                  <label>Apartment</label>
                  <input type="text"
                    onChange={addFormik.handleChange}
                    value={addFormik.values.apartment}
                    name="apartment"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="billing-info">
                  <label>City</label>
                  <input type="text"
                    onChange={addFormik.handleChange}
                    value={addFormik.values.city}
                    name="city"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="billing-info">
                  <label>State</label>
                  <input type="text"
                    onChange={addFormik.handleChange}
                    value={addFormik.values.state}
                    name="state"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="billing-info">
                  <label>Country</label>
                  <input type="text"
                    onChange={addFormik.handleChange}
                    value={addFormik.values.country}
                    name="country"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="billing-info">
                  <label>Postcode</label>
                  <input type="text"
                    onChange={addFormik.handleChange}
                    value={addFormik.values.postcode}
                    name="postcode"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="billing-info">
                  <label>Telephone</label>
                  <input type="text"
                    onChange={addFormik.handleChange}
                    value={addFormik.values.phone}
                    name="phone"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={handleAddModalClose}>
                Close
              </Button>
              <Button variant="primary" type="submit" disabled={createLoading}>
                {createLoading ? "Adding..." : "Add"}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={handleDeleteCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this address?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteAddress} disabled={deleteLoading}>
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Change Password Modal */}
      <Modal show={showPasswordModal} onHide={handlePasswordModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={changePasswordformik.handleSubmit}>
            <div className="billing-info">
              <label>Current Password</label>
              <input type="password"
                onChange={changePasswordformik.handleChange}
                value={changePasswordformik.values.current_password}
                name="current_password"
              />
            </div>
            <div className="billing-info">
              <label>New Password</label>
              <input type="password"
                onChange={changePasswordformik.handleChange}
                value={passwordFormik.values.new_password}
                name="new_password"
              />
            </div>
            <div className="billing-info">
              <label>Confirm Password</label>
              <input type="password"
                onChange={changePasswordformik.handleChange}
                value={changePasswordformik.values.confirm_password}
                name="confirm_password"
              />
            </div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={handlePasswordModalClose}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Change
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};

export default MyAccount;
