import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import ProductGridListSingle from "../../components/product/ProductGridListSingle";
import { useGetAllWishListQuery } from "../../store/apiSlice/productSlice";
import { useGetAllCartItemsQuery } from "../../store/apiSlice/cartApiSlice";

const ProductGridList = ({
  products,
  spaceBottomClass
}) => {
  const currency = useSelector((state) => state.currency);
  const isAuthenticated = useSelector((state) => state.auth);

  // const { wishlistItems } = useSelector((state) => state.wishlist);
  // const { reduxCartItems } = useSelector((state) => state.compare);
  const { data: wishlistItems, refetch: wishListItemsRefetch } = useGetAllWishListQuery(undefined, {
    skip: !isAuthenticated,
  })
  const { cartItems: reduxCartItems } = useSelector((state) => state.cart);
  const { data: apiCartItems, refetch } = useGetAllCartItemsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const cartItems = isAuthenticated ? apiCartItems : reduxCartItems;
  return (
    <Fragment>
      {products?.length > 0 ?
        products?.map(product => {
          return (
            <div className="col-xl-4 col-sm-6" key={product.id}>
              <ProductGridListSingle
                spaceBottomClass={spaceBottomClass}
                product={product}
                currency={currency}
                cartItem={
                  cartItems?.find(cartItem => cartItem.id === product.id)
                }
                wishlistItem={
                  wishlistItems?.find(
                    wishlistItem => wishlistItem.id === product.id
                  )
                }
                wishListItemsRefetch={wishListItemsRefetch}
                refetch={refetch}
              // compareItem={
              //   compareItems.find(
              //     compareItem => compareItem.id === product.id
              //   )
              // }
              />
            </div>
          );
        }) :
        <div className="row">
          <div className="col-lg-12">
            <div className="item-empty-area text-center">
              <div className="item-empty-area__icon mb-30">
                <i className="pe-7s-like"></i>
              </div>
              <div className="item-empty-area__text">
                Sorry, this catalogue is empty <br />{" "}
              </div>
            </div>
          </div>
        </div>
      }
    </Fragment>
  );
};

ProductGridList.propTypes = {
  products: PropTypes.array,
  spaceBottomClass: PropTypes.string,
};

export default ProductGridList;
