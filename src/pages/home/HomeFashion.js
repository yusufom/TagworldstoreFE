import { Fragment } from "react";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import HeroSliderOne from "../../wrappers/hero-slider/HeroSliderOne";
// import FeatureIcon from "../../wrappers/feature-icon/FeatureIcon";
import TabProduct from "../../wrappers/product/TabProduct";
import BannerOne from "../../wrappers/banner/BannerOne";


// import BlogFeatured from "../../wrappers/blog-featured/BlogFeatured";

const HomeFashion = () => {



  return (
    <Fragment>
      <SEO
        titleTemplate="Tagworld Home"
        description="Tagworld Store"
      />
      <LayoutOne
        headerContainerClass="container-fluid"
        headerPaddingClass="header-padding-1"
      >
        {/* hero slider */}
        <HeroSliderOne />

        {/* featured icon */}
        <BannerOne spaceTopClass="pt-60" spaceBottomClass="pb-65" />
        {/* <FeatureIcon spaceTopClass="pt-100" spaceBottomClass="pb-60" /> */}

        {/* tab product */}


        <TabProduct spaceBottomClass="pb-60" category="fashion" />
        {/* blog featured */}
        {/* <BlogFeatured spaceBottomClass="pb-55" /> */}
      </LayoutOne>
    </Fragment>
  );
};

export default HomeFashion;
