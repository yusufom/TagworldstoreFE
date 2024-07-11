import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import ProductGridListSingle from "../../components/product/ProductGridListSingle";
import { useGetAllWishListQuery } from "../../store/apiSlice/productSlice";
import { useGetAllCartItemsQuery } from "../../store/apiSlice/cartApiSlice";
import OrderGridListSingle from "../../components/product/OrderGridListSingle";
import { Link } from "react-router-dom";

const OrdergridList = ({
  orders,
  spaceBottomClass
}) => {
  const currency = useSelector((state) => state.currency);
  console.log(orders)

  return (
    <Fragment>
      <h1>My Orders</h1>
      {orders?.length === 0 ?
        <div className="row">
          <div className="col-lg-12">
            <div className="item-empty-area text-center">
              <div className="item-empty-area__icon mb-30">
                <i className="pe-7s-like"></i>
              </div>
              <div className="item-empty-area__text">
                No items found in order <br />{" "}
                <Link to={process.env.PUBLIC_URL + "/shop"}>
                  Shop
                </Link>
              </div>
            </div>
          </div>
        </div> :
        orders?.map(order => {
          return (
            <div className="col-xl-12 col-sm-12" key={order.id}>
              <OrderGridListSingle
                spaceBottomClass={spaceBottomClass}
                order={order}
                currency={currency}
              />
            </div>
          );
        })}
    </Fragment>
  );
};

OrdergridList.propTypes = {
  products: PropTypes.array,
  spaceBottomClass: PropTypes.string,
};

export default OrdergridList;
