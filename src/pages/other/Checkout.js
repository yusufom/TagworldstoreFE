import { Fragment, useState, useEffect } from "react";
import { Link, Navigate, useLocation, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getDiscountPrice } from "../../helpers/product";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useGetAllCartItemsQuery, useCreateOrderMutation, useStartCreateOrderMutation, useConfirmOrderMutation } from "../../store/apiSlice/cartApiSlice";
import { useGetAllBillingAddressesQuery, useCreateBillingAddressMutation } from "../../store/apiSlice/billingApiSlice";
import { successToast, errorToast } from "../../helpers/toast";
import { countries } from '../../constants';

const Checkout = () => {
  const [selectedAddress, setSelectedAddress] = useState("");
  const [newAddress, setNewAddress] = useState({
    first_name: "",
    last_name: "",
    country: "",
    street_address: "",
    apartment: "",
    city: "",
    state: "",
    postcode: "",
    phone: "",
    email: "",
  });
  const [additionalNote, setAdditionalNote] = useState("");
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const currency = useSelector((state) => state.currency);

  const { data: billingAddresses, isLoading: billingLoading, isError: billingError } = useGetAllBillingAddressesQuery();
  const { data: cartItems, isLoading: cartLoading, isError: cartError } = useGetAllCartItemsQuery();
  const [createBillingAddress] = useCreateBillingAddressMutation();
  const [createOrder, {isLoading: createOrderLoading}] = useCreateOrderMutation();
  const [startCreateOrder, {isLoading: startCreateOrderLoading}] = useStartCreateOrderMutation();
  const [confirmOrder] = useConfirmOrderMutation();

  useEffect(() => {
    const soc = searchParams.get("soc12sde");
    if (soc) {
      const success = Boolean(searchParams.get("success"));
      const cancelled = Boolean(searchParams.get("canceled"));
      if (success) {
        confirmOrder({ order_id: soc, status: "success" }).unwrap()
          .then(() => {
            window.location.href = "/checkout";
            successToast("Order was successfully placed");
          })
          .catch((error) => {
            console.error("Confirm order error:", error);
            errorToast("Failed to confirm order");
          });
      } else if (cancelled) {
        confirmOrder({ order_id: soc, status: "canceled" }).unwrap()
          .then(() => {
            window.location.href = "/checkout";
            successToast("Order was canceled");
          })
          .catch((error) => {
            console.error("Cancel order error:", error);
            errorToast("Failed to cancel order");
          });
      }
    }
  }, [searchParams, confirmOrder]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  const handleCreateOrder = () => {
    const lineItems = cartItems?.map((cartItem) => ({
      price: cartItem.product.stripe_price,
      quantity: cartItem.quantity,
   }));

    const lineItemsID = cartItems?.map((cartItem) => ({
      id: cartItem.id.toString(),
    }));

    const handleOrder = (addressId) => {
      startCreateOrder(lineItemsID).unwrap()
        .then((res) => {
          createOrder({ line_items: lineItems, pkid: res.pkid, address: addressId, note: additionalNote }).unwrap()
            .then((res) => {
              window.location.href = res.url;
            })
            .catch((error) => {
              console.error("Create order error:", error);
              errorToast("Failed to create order");
            });
        })
        .catch((error) => {
          console.error("Start create order error:", error);
          errorToast("Failed to start creating order");
        });
    };

    if (selectedAddress === "new") {
      createBillingAddress(newAddress).unwrap()
        .then((res) => {
          handleOrder(res.id);
        })
        .catch((error) => {
          console.error("Create billing address error:", error);
          errorToast("Failed to create billing address");
        });
    } else {
      handleOrder(selectedAddress);
    }
  };

  let cartTotalPrice = 0;

  console.log(cartItems)

  return (
    <Fragment>
      <SEO titleTemplate="Checkout" description="Checkout page" />
      <LayoutOne headerTop="visible">
        <Breadcrumb pages={[{ label: "Home", path: process.env.PUBLIC_URL + "/" }, { label: "Checkout", path: process.env.PUBLIC_URL + pathname }]} />
        <div className="checkout-area pt-95 pb-100">
          <div className="container">
            {(billingLoading || cartLoading) ? (
              <div className="flone-preloader-wrapper">
                <div className="flone-preloader">
                  <span></span>
                  <span></span>
                </div>
              </div>
            ) : (billingError || cartError) ? (
              <Navigate to="/login-register" />
            ) : (cartItems && cartItems.length >= 1) ? (
              <div className="row">
                <div className="col-lg-7">
                  <div className="billing-info-wrap">
                    <h3>Billing Details</h3>
                    <div className="row">
                      <div className="col-lg-12 mb-20">
                        <label>Select Billing Address</label>
                        <select
                          className="border billing-select"
                          style={{
                            padding: '10px 2px'
                          }}
                          onChange={(e) => setSelectedAddress(e.target.value)}
                          value={selectedAddress}>
                          <option value="">Select Address</option>
                          {billingAddresses?.map((address) => (
                            <option key={address.id} value={address.id}>
                              {`${address.first_name} ${address.last_name} - ${address.street_address}, ${address.city}, ${address.country}`}
                            </option>
                          ))}
                          <option value="new">Add New Address</option>
                        </select>
                      </div>
                      {selectedAddress === "new" && (
                        <>
                          <div className="col-lg-6 col-md-6">
                            <div className="billing-info mb-20">
                              <label>First Name</label>
                              <input type="text" name="first_name" onChange={handleAddressChange} />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="billing-info mb-20">
                              <label>Last Name</label>
                              <input type="text" name="last_name" onChange={handleAddressChange} />
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="billing-select mb-20">
                              <label>Country</label>
                              <select name="country" onChange={handleAddressChange} value={newAddress.country}>
                                <option value="">Select a country</option>
                                {countries.map((country) => (
                                  <option key={country.code} value={country.name}>
                                    {country.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="billing-info mb-20">
                              <label>Street Address</label>
                              <input className="billing-address" placeholder="House number and street name" name="street_address" type="text" onChange={handleAddressChange} />
                              <input placeholder="Apartment, suite, unit etc." name="apartment" type="text" onChange={handleAddressChange} />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="billing-info mb-20">
                              <label>City</label>
                              <input type="text" name="city" onChange={handleAddressChange} />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="billing-info mb-20">
                              <label>State</label>
                              <input type="text" name="state" onChange={handleAddressChange} />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="billing-info mb-20">
                              <label>Postcode</label>
                              <input type="text" name="postcode" onChange={handleAddressChange} />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="billing-info mb-20">
                              <label>Phone</label>
                              <input type="text" name="phone" onChange={handleAddressChange} />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="billing-info mb-20">
                              <label>Email</label>
                              <input type="email" name="email" onChange={handleAddressChange} />
                            </div>
                          </div>
                        </>
                      )}
                      <div className="additional-info-wrap">
                        <h4>Additional information</h4>
                        <div className="additional-info">
                          <label>Order notes</label>
                          <textarea
                            placeholder="Notes about your order, e.g. special notes for delivery."
                            name="message"
                            onChange={(e) => setAdditionalNote(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5">
                  <div className="your-order-area">
                    <h3>Your Order</h3>
                    <div className="your-order-wrap gray-bg-4">
                      <div className="your-order-product-info">
                        <div className="your-order-top">
                          <ul>
                            <li>Product</li>
                            <li>Total</li>
                          </ul>
                        </div>
                        <div className="your-order-middle">
                          <ul>
                            {cartItems.map((cartItem, key) => {
                              const discountedPrice = getDiscountPrice(cartItem.product.price, cartItem.product.discount);
                              const finalProductPrice = (cartItem.product.price * currency.currencyRate).toFixed(2);
                              const finalDiscountedPrice = (discountedPrice * currency.currencyRate).toFixed(2);
                              discountedPrice != null ? (cartTotalPrice += finalDiscountedPrice * cartItem.quantity) : (cartTotalPrice += finalProductPrice * cartItem.quantity);
                              return (
                                <li key={key}>
                                  <span className="order-middle-left">
                                    {cartItem.product.name} X {cartItem.quantity}
                                  </span>{" "}
                                  <span className="order-price">
                                    {discountedPrice !== null ? currency.currencySymbol + finalDiscountedPrice : currency.currencySymbol + finalProductPrice}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        <div className="your-order-bottom">
                          <ul>
                            <li className="your-order-shipping">Shipping</li>
                            <li>Free shipping</li>
                          </ul>
                        </div>
                        <div className="your-order-total">
                          <ul>
                            <li className="order-total">Total</li>
                            <li>{currency.currencySymbol + cartTotalPrice.toFixed(2)}</li>
                          </ul>
                        </div>
                      </div>
                      <div className="payment-method"></div>
                      <div className="place-order mt-25">
                        <button
                          onClick={handleCreateOrder}
                          disabled={(selectedAddress === "new" && !Object.values(newAddress).every(val => val !== "")) || (!selectedAddress)}
                          className="btn-hover">
                          {startCreateOrderLoading ? "Placing Order..." : createOrderLoading ? "Redirecting..." : "Place Order"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cash"></i>
                    </div>
                    <div className="item-empty-area__text">
                      No items found in cart to checkout <br />
                      <Link to={process.env.PUBLIC_URL + "/shop"}>Shop Now</Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Checkout;