import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useLocation } from "react-router-dom";
import { getDiscountPrice } from "../../helpers/product";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { addToCart } from "../../store/slices/cart-slice";
import { deleteFromWishlist, deleteAllFromWishlist } from "../../store/slices/wishlist-slice"
import { useGetAllWishListQuery, useDeleteFromWishListMutation, useClearWishListMutation } from "../../store/apiSlice/productSlice";
import { useAddToCartMutation, useGetAllCartItemsQuery } from "../../store/apiSlice/cartApiSlice";
import { successToast, warningToast } from "../../helpers/toast";

const Wishlist = () => {
  const dispatch = useDispatch();
  let { pathname } = useLocation();

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  )

  const currency = useSelector((state) => state.currency);
  // const { wishlistItems } = useSelector((state) => state.wishlist);
  // const { cartItems } = useSelector((state) => state.cart);

  const { data: wishlistItems, refetch, isLoading: wishlistLoading } = useGetAllWishListQuery(undefined, {
    skip: !isAuthenticated,
  })
  const { data: cartItems, refetch: cartItemsRefetch } = useGetAllCartItemsQuery({ refetchOnMountOrArgChange: true });
  const [deleteFromWishList] = useDeleteFromWishListMutation();
  const [clearWishList] = useClearWishListMutation();

  const [addToCartM, { isLoading }] = useAddToCartMutation();



  if (!isAuthenticated) {
    warningToast("Please login to view wishlist")
    return <Navigate to={"/login-register"} />
  }

  if (wishlistLoading) {
    return (
        <div className="flone-preloader-wrapper">
            <div className="flone-preloader">
                <span></span>
                <span></span>
            </div>
        </div>
    )
}


  return (
    <Fragment>
      <SEO
        titleTemplate="Wishlist"
        description="Wishlist page of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "Wishlist", path: process.env.PUBLIC_URL + pathname }
          ]}
        />
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {wishlistItems && wishlistItems.length >= 1 ? (
              <Fragment>
                <h3 className="cart-page-title">Your wishlist items</h3>
                <div className="row">
                  <div className="col-12">
                    <div className="table-content table-responsive cart-table-content">
                      <table>
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Product Name</th>
                            <th>Unit Price</th>
                            <th>Add To Cart</th>
                            <th>action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {wishlistItems.map((wishlistItem, key) => {
                            const discountedPrice = getDiscountPrice(
                              wishlistItem.price,
                              wishlistItem.discount
                            );
                            const finalProductPrice = (
                              wishlistItem.price * currency.currencyRate
                            ).toFixed(2);
                            const finalDiscountedPrice = (
                              discountedPrice * currency.currencyRate
                            ).toFixed(2);
                            const cartItem = cartItems?.find(
                              item => item.id === wishlistItem.id
                            );
                            return (
                              <tr key={key}>
                                <td className="product-thumbnail">
                                  <Link
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/product/" +
                                      wishlistItem.slug
                                    }
                                  >
                                    <img
                                      className="img-fluid"
                                      src={
                                        process.env.PUBLIC_URL +
                                        wishlistItem.image[0].image
                                      }
                                      alt=""
                                    />
                                  </Link>
                                </td>

                                <td className="product-name text-center">
                                  <Link
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/product/" +
                                      wishlistItem.slug
                                    }
                                  >
                                    {wishlistItem.name}
                                  </Link>
                                </td>

                                <td className="product-price-cart">
                                  {discountedPrice !== null ? (
                                    <Fragment>
                                      <span className="amount old">
                                        {currency.currencySymbol +
                                          finalProductPrice}
                                      </span>
                                      <span className="amount">
                                        {currency.currencySymbol +
                                          finalDiscountedPrice}
                                      </span>
                                    </Fragment>
                                  ) : (
                                    <span className="amount">
                                      {currency.currencySymbol +
                                        finalProductPrice}
                                    </span>
                                  )}
                                </td>

                                <td className="product-wishlist-cart">
                                  {wishlistItem.affiliateLink ? (
                                    <a
                                      href={wishlistItem.affiliateLink}
                                      rel="noopener noreferrer"
                                      target="_blank"
                                    >
                                      {" "}
                                      Buy now{" "}
                                    </a>
                                  ) : wishlistItem.variation &&
                                    wishlistItem.variation.length >= 1 ? (
                                    <Link
                                      to={`${process.env.PUBLIC_URL}/product/${wishlistItem.slug}`}
                                      reloadDocument
                                    >
                                      Select option
                                    </Link>
                                  ) : wishlistItem.stock &&
                                    wishlistItem.stock > 0 ? (
                                    <button
                                      onClick={() =>
                                        // dispatch(addToCart(wishlistItem))
                                        addToCartM({
                                          product: { ...wishlistItem },
                                          quantity: 1,
                                          selected_product_color: "",
                                          selected_product_size: ""
                                        }).unwrap().then(() => { successToast("Added To Cart"); cartItemsRefetch() }).catch(() => { })
                                      }
                                      className={
                                        cartItem !== undefined &&
                                          cartItem.quantity > 0
                                          ? "active"
                                          : ""
                                      }
                                      disabled={
                                        cartItem !== undefined &&
                                        cartItem.quantity > 0
                                      }
                                      title={
                                        wishlistItem !== undefined
                                          ? "Added to cart"
                                          : "Add to cart"
                                      }
                                    >
                                      {cartItem !== undefined &&
                                        cartItem.quantity > 0
                                        ? "Added"
                                        : isLoading ? "Adding" : "Add To Cart"}
                                    </button>
                                  ) : (
                                    <button disabled className="active">
                                      Out of stock
                                    </button>
                                  )}
                                </td>

                                <td className="product-remove">
                                  <button
                                    onClick={() =>
                                      // dispatch(deleteFromWishlist(wishlistItem.id))
                                      deleteFromWishList(wishlistItem.id).then(() => {
                                        refetch()
                                        successToast("Wishlist item deleted successfully")
                                      }).catch(() => { })
                                    }
                                  >
                                    <i className="fa fa-times"></i>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-12">
                    <div className="cart-shiping-update-wrapper">
                      <div className="cart-shiping-update">
                        <Link
                          to={process.env.PUBLIC_URL + "/shop"}
                        >
                          Continue Shopping
                        </Link>
                      </div>
                      <div className="cart-clear">
                        <button onClick={() => clearWishList().unwrap().then(() => {
                          refetch()
                          successToast("Wishlist items cleared successfully")
                        }).catch(() => { })}>
                          Clear Wishlist
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-like"></i>
                    </div>
                    <div className="item-empty-area__text">
                      No items found in wishlist <br />{" "}
                      <Link to={process.env.PUBLIC_URL + "/shop"}>
                        Add Items
                      </Link>
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

export default Wishlist;
