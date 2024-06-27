import { Suspense, lazy } from "react";
import ScrollToTop from "./helpers/scroll-top";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


const HomeFashion = lazy(() => import("./pages/home/HomeFashion"));

const MyAccount = lazy(() => import("./pages/other/MyAccount"));
const LoginRegister = lazy(() => import("./pages/other/LoginRegister"));
const NotFound = lazy(() => import("./pages/other/NotFound"));
const Product = lazy(() => import("./pages/shop-product/Product"));


const Cart = lazy(() => import("./pages/other/Cart"));
const Wishlist = lazy(() => import("./pages/other/Wishlist"));
const ActivateAccount = lazy(() => import("./pages/other/ActivateAccount"));
const Orders = lazy(() => import("./pages/other/Orders"));
// const Compare = lazy(() => import("./pages/other/Compare"));
const Checkout = lazy(() => import("./pages/other/Checkout"));
const Shop = lazy(() => import("./pages/shop/ShopGridStandard"));




function App() {
  return (
    <Router>
      <ScrollToTop>
        <Suspense
          fallback={
            <div className="flone-preloader-wrapper">
              <div className="flone-preloader">
                <span></span>
                <span></span>
              </div>
            </div>
          }
        >
          <Routes>
            <Route
              path={process.env.PUBLIC_URL + "/"}
              element={<HomeFashion />}
            />

            {/* Homepages */}
            <Route
              path={process.env.PUBLIC_URL + "/shop"}
              element={<Shop />}
            />

            <Route
              path={process.env.PUBLIC_URL + "/product/:id"}
              element={<Product />}
            />

            <Route
              path={process.env.PUBLIC_URL + "/my-account"}
              element={<MyAccount />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/login-register"}
              element={<LoginRegister />}
            />

            <Route
              path={process.env.PUBLIC_URL + "/cart"}
              element={<Cart />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/wishlist"}
              element={<Wishlist />}
            />

            <Route
              path={process.env.PUBLIC_URL + "/activate"}
              element={<ActivateAccount />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/my-orders"}
              element={<Orders />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/checkout"}
              element={<Checkout />}
            />


            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ScrollToTop>
    </Router>
  );
}

export default App;
