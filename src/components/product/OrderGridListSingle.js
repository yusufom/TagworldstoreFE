import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import OrderModal from "../order/OrderModal";

const OrderGridListSingle = ({
  order,
  currency,
  spaceBottomClass
}) => {
  const dispatch = useDispatch();
  const [modalShow, setModalShow] = useState(false);
  return (
    <Fragment>

      <div className="shop-list-wrap mb-30 mt-30">
        <div className="row">
          <div className="col-xl-12">
            <div className="order-list-content">
              <p>
                Order ID:
                <h3>
                  <Link to={'#'}>
                    {order.pkid}
                  </Link>
                </h3>
              </p>

              <p>Payment Status: {order.is_paid ? "Paid" : (
                "Pending"
              )}</p>
              <p>Amount: #50</p>

              <div className="shop-list-actions d-flex align-items-center">
                <div className="shop-list-btn btn-hover">
                  <button className="active" onClick={() => setModalShow(true)}>
                    View Items
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* order modal */}
      <OrderModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        order={order}
        currency={currency}
      // compareItem={compareItem}
      />

      < hr />
    </Fragment>
  );
};

OrderGridListSingle.propTypes = {
  cartItem: PropTypes.shape({}),
  compareItem: PropTypes.shape({}),
  currency: PropTypes.shape({}),
  product: PropTypes.shape({}),
  spaceBottomClass: PropTypes.string,
  wishlistItem: PropTypes.shape({})
};

export default OrderGridListSingle;
