import { Fragment, useState, useEffect } from 'react';
import Paginator from 'react-hooks-paginator';
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom"
import { getSortedProducts } from '../../helpers/product';
import SEO from "../../components/seo";
import LayoutOne from '../../layouts/LayoutOne';
import Breadcrumb from '../../wrappers/breadcrumb/Breadcrumb';
import ShopSidebar from '../../wrappers/product/ShopSidebar';
import ShopTopbar from '../../wrappers/product/ShopTopbar';
import ShopProducts from '../../wrappers/product/ShopProducts';
import { apiSlice } from '../../store/api';
import { useGetUserOrdersQuery } from '../../store/apiSlice/cartApiSlice';
import ShopOrders from '../../wrappers/product/ShopOrders';




const Orders = () => {
    const [layout, setLayout] = useState('list');
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentData, setCurrentData] = useState([]);
    const { data: orders, isLoading } = useGetUserOrdersQuery({ refetchOnMountOrArgChange: true });


    const pageLimit = 10;
    let { pathname } = useLocation();

    useEffect(() => {
        setCurrentData(orders?.slice(offset, offset + pageLimit));
    }, [offset, orders]);

    if (isLoading) {
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
                titleTemplate="Order Page"
                description="Order page of tagworld eCommerce shop."
            />

            <LayoutOne headerTop="visible">
                {/* breadcrumb */}
                <Breadcrumb
                    pages={[
                        { label: "Home", path: process.env.PUBLIC_URL + "/" },
                        { label: "Order", path: process.env.PUBLIC_URL + pathname }
                    ]}
                />

                <div className="shop-area pt-95 pb-100">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-3 order-2 order-lg-1">
                                {/* shop sidebar */}
                            </div>
                            <div className="col-lg-9 order-1 order-lg-2">
                                {/* shop topbar default */}

                                {/* shop page content default */}
                                <ShopOrders layout={layout} orders={currentData} />

                                {/* shop product pagination */}
                                <div className="pro-pagination-style text-center mt-30">

                                    <Paginator
                                        totalRecords={orders?.length}
                                        pageLimit={pageLimit}
                                        pageNeighbours={2}
                                        setOffset={setOffset}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                        pageContainerClass="mb-0 mt-0"
                                        pagePrevText="«"
                                        pageNextText="»"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </LayoutOne>
        </Fragment>
    )
}


export default Orders;