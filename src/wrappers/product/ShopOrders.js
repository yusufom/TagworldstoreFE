import PropTypes from "prop-types";
import clsx from "clsx";
import ProductgridList from "./ProductgridList";
import OrdergridList from "./OrdergridList";

const ShopOrders = ({ orders, layout }) => {
  return (
    <div className="shop-bottom-area mt-35">
      <div className={clsx("row", layout)}>
        <OrdergridList orders={orders} spaceBottomClass="mb-25" />
      </div>
    </div>
  );
};

ShopOrders.propTypes = {
  layout: PropTypes.string,
  products: PropTypes.array
};

export default ShopOrders;
