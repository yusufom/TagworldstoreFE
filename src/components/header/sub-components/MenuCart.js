import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getDiscountPrice } from "../../../helpers/product";
import { deleteFromCart as notAuthDeleteFromCart } from "../../../store/slices/cart-slice";
import { useDeleteFromCartMutation, useGetAllCartItemsQuery } from "../../../store/apiSlice/cartApiSlice";
import { errorToast, successToast } from "../../../helpers/toast";

const MenuCart = () => {
  const dispatch = useDispatch();
  const currency = useSelector((state) => state.currency);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [deleteFromCart, { isLoading: deleteFromCartLoading, error: deleteFromCartError }] = useDeleteFromCartMutation();

  let cartTotalPrice = 0;
  const { cartItems: cartItemsNotAuth } = useSelector((state) => state.cart);
  const { data: cartItemsAuth, refetch } = useGetAllCartItemsQuery({ refetchOnMountOrArgChange: true });

  const cartItems = isAuthenticated ? cartItemsAuth : cartItemsNotAuth;

  return (
    <div className="shopping-cart-content">
      {cartItems && cartItems.length > 0 ? (
        <Fragment>
          <ul>
            {cartItems?.map((item) => {
              const discountedPrice = getDiscountPrice(
                item.product.price,
                item.product.discount
              );
              const finalProductPrice = (
                item.product.price * currency.currencyRate
              ).toFixed(2);
              const finalDiscountedPrice = (
                discountedPrice * currency.currencyRate
              ).toFixed(2);

              discountedPrice != null
                ? (cartTotalPrice += finalDiscountedPrice * item.quantity)
                : (cartTotalPrice += finalProductPrice * item.quantity);

              return (
                <li className="single-shopping-cart" key={item.id}>
                  <div className="shopping-cart-img">
                    <Link to={process.env.PUBLIC_URL + "/product/" + item.id}>
                      <img
                        alt=""
                        src={item?.product?.image?.[0]?.image || ""}
                        className="img-fluid"
                      />
                    </Link>
                  </div>
                  <div className="shopping-cart-title">
                    <h4>
                      <Link
                        to={process.env.PUBLIC_URL + "/product/" + item.product.id}
                      >
                        {" "}
                        {item?.product?.name}{" "}
                      </Link>
                    </h4>
                    <h6>Qty: {item.quantity}</h6>
                    <span>
                      {discountedPrice !== null
                        ? currency.currencySymbol + finalDiscountedPrice
                        : currency.currencySymbol + finalProductPrice}
                    </span>
                    {item.selectedProductColor &&
                      item.selectedProductSize ? (
                      <div className="cart-item-variation">
                        <span>Color: {item.selected_product_color}</span>
                        <span>Size: {item.selected_product_size}</span>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="shopping-cart-delete">
                    <button onClick={() => isAuthenticated ? deleteFromCart(item.id).unwrap()
                      .then(() => {
                        successToast("Item deleted successfully")
                        refetch();
                      })
                      .catch(() => {
                        errorToast("Something went wrong");
                      }) : dispatch(notAuthDeleteFromCart(item.id))}>
                      <i className="fa fa-times-circle" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="shopping-cart-total">
            <h4>
              Total :{" "}
              <span className="shop-total">
                {currency.currencySymbol + cartTotalPrice.toFixed(2)}
              </span>
            </h4>
          </div>
          <div className="shopping-cart-btn btn-hover text-center">
            <Link className="default-btn" to={process.env.PUBLIC_URL + "/cart"}>
              view cart
            </Link>
            {isAuthenticated ?
              <Link
                className="default-btn"
                to={process.env.PUBLIC_URL + "/checkout"}
              >
                checkout
              </Link> :
              <Link
                className="default-btn"
                to={process.env.PUBLIC_URL + "/login-register"}
              >
                checkout
              </Link>
            }

          </div>
        </Fragment>
      ) : (
        <p className="text-center">No items added to cart</p>
      )}
    </div>
  );
};

export default MenuCart;
