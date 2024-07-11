import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { getDiscountPrice } from "../../helpers/product";
import ProductImageGallery from "../../components/product/ProductImageGallery";
import ProductDescriptionInfo from "../../components/product/ProductDescriptionInfo";
import ProductImageGallerySideThumb from "../../components/product/ProductImageGallerySideThumb";
import ProductImageFixed from "../../components/product/ProductImageFixed";
import { useGetAllCartItemsQuery } from "../../store/apiSlice/cartApiSlice";
import { useGetAllWishListQuery } from "../../store/apiSlice/productSlice";
import React from "react";

const ProductImageDescription = ({ spaceTopClass, spaceBottomClass, galleryType, product }) => {
  const { isAuthenticated } = useSelector(
    (state) => state.auth
  )

  const currency = useSelector((state) => state.currency);
  // const { cartItems } = useSelector((state) => state.cart);
  const { storewishlistItems } = useSelector((state) => state.wishlist);
  const { data: wishlistItems, refetch: wishListItemsRefetch } = useGetAllWishListQuery(undefined, {
    skip: !isAuthenticated,
  })

  // const { compareItems } = useSelector((state) => state.compare);
  const wishlistItem = isAuthenticated ? wishlistItems?.find(item => item.id === product.id) : storewishlistItems?.find(item => item.id === product.id);
  // const compareItem = compareItems.find(item => item.id === product.id);
  // const { data: cartItems, refetch } = useGetAllCartItemsQuery({ refetchOnMountOrArgChange: true });
  const { cartItems: reduxCartItems } = useSelector((state) => state.cart);
  const { data: apiCartItems, refetch } = useGetAllCartItemsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const cartItems = isAuthenticated ? apiCartItems : reduxCartItems;

  const discountedPrice = getDiscountPrice(product.price, product.discount);
  const finalProductPrice = +(product.price * currency.currencyRate).toFixed(2);
  const finalDiscountedPrice = +(
    discountedPrice * currency.currencyRate
  ).toFixed(2);

  return (
    <div className={clsx("shop-area", spaceTopClass, spaceBottomClass)}>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-6">
            {/* product image gallery */}
            {galleryType === "leftThumb" ? (
              <ProductImageGallerySideThumb
                product={product}
                thumbPosition="left"
              />
            ) : galleryType === "rightThumb" ? (
              <ProductImageGallerySideThumb product={product} />
            ) : galleryType === "fixedImage" ? (
              <ProductImageFixed product={product} />
            ) : (
              <ProductImageGallery product={product} />
            )}
          </div>
          <div className="col-lg-6 col-md-6">
            {/* product description info */}
            <ProductDescriptionInfo
              product={product}
              discountedPrice={discountedPrice}
              currency={currency}
              finalDiscountedPrice={finalDiscountedPrice}
              finalProductPrice={finalProductPrice}
              cartItems={cartItems}
              wishlistItem={wishlistItem}
              wishListItemsRefetch={wishListItemsRefetch}
              // compareItem={compareItem}
              refetch={refetch}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

ProductImageDescription.propTypes = {
  galleryType: PropTypes.string,
  product: PropTypes.shape({}),
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string,
};

export default ProductImageDescription;
