import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import MenuCart from "./sub-components/MenuCart";
import { useGetAllCartItemsQuery } from "../../store/apiSlice/cartApiSlice";
import { useGetAllWishListQuery } from "../../store/apiSlice/productSlice";
import { unauthenticate } from "../../store/slices/auth-slice";
import { useFormik } from 'formik';
import React from "react";

const IconGroup = ({ iconWhiteClass }) => {
  const dispatch = useDispatch();
  const handleClick = e => {
    e.currentTarget.nextSibling.classList.toggle("active");
  };

  const formik = useFormik(
    {
      initialValues: { "search": "" },
      validationSchema: "",
      enableReinitialize: true,
      onSubmit: async (values) => {
        window.location.href = `/shop?search=${values.search}`
      }
    }
  )

  const triggerMobileMenu = () => {
    const offcanvasMobileMenu = document.querySelector(
      "#offcanvas-mobile-menu"
    );
    offcanvasMobileMenu.classList.add("active");
  };
  const { isAuthenticated } = useSelector(
    (state) => state.auth
  )
  // const { compareItems } = useSelector((state) => state.compare);
  // const { wishlistItems } = useSelector((state) => state.wishlist);
  const { data: wishlistItems } = useGetAllWishListQuery(undefined, {
    skip: !isAuthenticated,
  })

  // const { cartItems } = useSelector((state) => state.cart);
  // const { data: cartItems } = useGetAllCartItemsQuery({ refetchOnMountOrArgChange: true });


  const { cartItems: cartItemsNotAuth } = useSelector((state) => state.cart);
  const { data: cartItemsAuth } = useGetAllCartItemsQuery(undefined, {
    skip: !isAuthenticated,
  });


  const cartItems = isAuthenticated ? cartItemsAuth : cartItemsNotAuth;






  return (
    <div className={clsx("header-right-wrap", iconWhiteClass)} >
      <div className="same-style header-search d-none d-lg-block">
        <button className="search-active" onClick={e => handleClick(e)}>
          <i className="pe-7s-search" />
        </button>
        <div className="search-content">
          <form method="POST">
            <input type="text" placeholder="Search" onChange={formik.handleChange}
              value={formik.values.search}
              name={'search'} />
            <button className="button-search" onClick={formik.handleSubmit}>
              <i className="pe-7s-search" />
            </button>
          </form>
        </div>
      </div>
      <div className="same-style account-setting d-none d-lg-block">
        <button
          className="account-setting-active"
          onClick={e => handleClick(e)}
        >
          <i className="pe-7s-user-female" />
        </button>
        <div className="account-dropdown">
          <ul>
            {!isAuthenticated ?
              <>
                <li>
                  <Link to={process.env.PUBLIC_URL + "/login-register"}>Login</Link>
                </li>
                <li>
                  <Link to={process.env.PUBLIC_URL + "/login-register"}>
                    Register
                  </Link>
                </li>
              </>
              : null
            }
            {isAuthenticated ?
              <>
                <li>
                  <Link to={process.env.PUBLIC_URL + "/my-account"}>
                    my account
                  </Link>
                </li>
                <li className="cursor-pointer">
                  <Link to={'/login-register'} onClick={() => {
                    dispatch(unauthenticate())

                  }} className="text-red-500 ">
                    log out
                  </Link>
                </li>
              </>
              : null
            }

          </ul>
        </div>
      </div>
      <div className="same-style header-compare">
        {/* <Link to={process.env.PUBLIC_URL + "/compare"}>
          <i className="pe-7s-shuffle" />
          <span className="count-style">
            {compareItems && compareItems.length ? compareItems.length : 0}
          </span>
        </Link> */}
      </div>
      <div className="same-style header-wishlist">
        <Link to={process.env.PUBLIC_URL + "/wishlist"}>
          <i className="pe-7s-like" />
          <span className="count-style">
            {wishlistItems && wishlistItems.length ? wishlistItems.length : 0}
          </span>
        </Link>
      </div>
      <div className="same-style cart-wrap d-none d-lg-block">
        <button className="icon-cart" onClick={e => handleClick(e)}>
          <i className="pe-7s-shopbag" />
          <span className="count-style">
            {cartItems && cartItems.length ? cartItems.length : 0}
          </span>
        </button>
        {/* menu cart */}
        <MenuCart />
      </div>
      <div className="same-style cart-wrap d-block d-lg-none">
        <Link className="icon-cart" to={process.env.PUBLIC_URL + "/cart"}>
          <i className="pe-7s-shopbag" />
          <span className="count-style">
            {cartItems && cartItems.length ? cartItems.length : 0}
          </span>
        </Link>
      </div>
      <div className="same-style mobile-off-canvas d-block d-lg-none">
        <button
          className="mobile-aside-button"
          onClick={() => triggerMobileMenu()}
        >
          <i className="pe-7s-menu" />
        </button>
      </div>
    </div>
  );
};

IconGroup.propTypes = {
  iconWhiteClass: PropTypes.string,
};



export default IconGroup;
