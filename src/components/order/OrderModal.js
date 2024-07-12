import { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useGetAllCartItemsQuery } from "../../store/apiSlice/cartApiSlice";

function OrderModal({ order, currency, show, onHide }) {
  const dispatch = useDispatch();
  const { data: cartItems } = useGetAllCartItemsQuery({ refetchOnMountOrArgChange: true });

  const onCloseModal = () => {
    onHide();
  };

  const placeholderImage = "https://via.placeholder.com/100?text=No+Image";

  return (
    <Modal show={show} onHide={onCloseModal} className="order-details-modal-wrapper">
      <Modal.Header closeButton></Modal.Header>
      <div className="modal-body">
        <div className="order-details-content">
          <h2>Order Details</h2>
          <p>Order ID: {order?.pkid}</p>
          <p>Order Date: {new Date(order?.ordered_date).toLocaleDateString()}</p>
          <p>Status: {order.status}</p>
          <p>Payment Status: {order?.is_paid ? "Paid" : "Not Paid"}</p>
          <div className="order-items">
            {order?.items?.map((item, index) => (
              <div className="order-item" key={index}>
                <div className="order-item-image">
                  <img
                    src={item?.product?.image ? item.product.image[0].image : placeholderImage}
                    alt="Product"
                    style={{ maxHeight: "100px" }}
                    className="img-fluid"
                  />
                </div>
                <div className="order-item-details">
                  <p>Product ID: {item?.product.id}</p>
                  <p>Color: {item?.selected_product_color}</p>
                  <p>Size: {item?.selected_product_size}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: £{item?.product.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="shipping-address">
            <h3>Shipping Address</h3>
            <p><strong>Name:</strong> {order.shipping_address.first_name} {order.shipping_address.last_name}</p>
            <p><strong>Street Address:</strong> {order.shipping_address.street_address}</p>
            <p><strong>Apartment:</strong> {order.shipping_address.apartment}</p>
            <p><strong>City:</strong> {order.shipping_address.city}</p>
            <p><strong>State:</strong> {order.shipping_address.state}</p>
            <p><strong>Country:</strong> {order.shipping_address.country}</p>
            <p><strong>PostCode:</strong> {order.shipping_address.postcode}</p>
            <p><strong>Phone:</strong> {order.shipping_address.phone}</p>
            <p><strong>Email:</strong> {order.shipping_address.email}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

OrderModal.propTypes = {
  order: PropTypes.shape({
    pkid: PropTypes.string,
    ordered_date: PropTypes.string,
    is_paid: PropTypes.bool,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        ordered: PropTypes.bool,
        quantity: PropTypes.number,
        selected_product_color: PropTypes.string,
        selected_product_size: PropTypes.string,
        product: PropTypes.shape({
          id: PropTypes.number,
          image: PropTypes.arrayOf(
            PropTypes.shape({
              image: PropTypes.string
            })
          ),
          price: PropTypes.string
        })
      })
    ),
    shipping_address: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      street_address: PropTypes.string,
      apartment: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      country: PropTypes.string,
      postcode: PropTypes.string,
      phone: PropTypes.string,
      email: PropTypes.string
    })
  }),
  currency: PropTypes.shape({}),
  show: PropTypes.bool,
  onHide: PropTypes.func
};

export default OrderModal;
