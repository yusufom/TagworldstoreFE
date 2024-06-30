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
  const { data: wishlistItems, refetch: wishListItemsRefetch } = useGetAllWishListQuery()
  const { cartItems:reduxCartItems } = useSelector((state) => state.cart);
  const { data: apiCartItems, refetch } = useGetAllCartItemsQuery({ refetchOnMountOrArgChange: true });

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
            // compareItem={
            //   compareItems.find(
            //     compareItem => compareItem.id === product.id
            //   )
            // }
            />
          </div>
        );
      }) :
      <div className="text-center">Sorry, this catalogue is empty</div>
    }
    </Fragment>
  );
};

ProductGridList.propTypes = {
  products: PropTypes.array,
  spaceBottomClass: PropTypes.string,
};

export default ProductGridList;
