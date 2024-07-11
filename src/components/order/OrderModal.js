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
                  <p>Price: {item?.product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

OrderModal.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number,
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
          image: PropTypes.string,
        })
      })
    )
  }),
  currency: PropTypes.shape({}),
  show: PropTypes.bool,
  onHide: PropTypes.func
};

export default OrderModal;
