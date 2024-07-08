import PropTypes from "prop-types";
import clsx from "clsx";
import {
  getIndividualCategories,
  getIndividualTags,
  getIndividualColors,
  getProductsIndividualSizes
} from "../../helpers/product";
import ShopSearch from "../../components/product/ShopSearch";
import ShopCategories from "../../components/product/ShopCategories";
import ShopColor from "../../components/product/ShopColor";
import ShopSize from "../../components/product/ShopSize";
import ShopTag from "../../components/product/ShopTag";

const ShopSidebar = ({ products, getSortParams, sideSpaceClass, setSearchTerm }) => {
  const uniqueCategories = getIndividualCategories(products);
  const uniqueColors = getIndividualColors(products);
  const uniqueSizes = getProductsIndividualSizes(products);
  const uniqueTags = getIndividualTags(products);

  return (
    <div className={clsx("sidebar-style", sideSpaceClass)}>
      {/* shop search */}
      <ShopSearch getSortParams={getSortParams} setSearchTerm={setSearchTerm} />

      {/* filter by categories */}
      <ShopCategories
        categories={uniqueCategories}
        getSortParams={getSortParams}
        setSearchTerm={setSearchTerm}
      />

      {/* filter by color */}
      <ShopColor colors={uniqueColors} getSortParams={getSortParams} setSearchTerm={setSearchTerm} />

      {/* filter by size */}
      <ShopSize sizes={uniqueSizes} getSortParams={getSortParams} setSearchTerm={setSearchTerm} />

      {/* filter by tag */}
      <ShopTag tags={uniqueTags} getSortParams={getSortParams} setSearchTerm={setSearchTerm} />
    </div>
  );
};

ShopSidebar.propTypes = {
  getSortParams: PropTypes.func,
  products: PropTypes.array,
  sideSpaceClass: PropTypes.string
};

export default ShopSidebar;
