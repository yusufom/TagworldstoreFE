import PropTypes from "prop-types";
import clsx from "clsx";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { useGetReviewQuery, useAddReviewMutation } from "../../store/apiSlice/productSlice";
import { useSelector } from "react-redux";
import { useFormik } from 'formik';
import { errorToast, successToast } from "../../helpers/toast";


const ProductDescriptionTab = ({ spaceBottomClass, productFullDesc, product_id }) => {
  const { isAuthenticated } = useSelector(
    (state) => state.auth
  )

  const { data, refetch } = useGetReviewQuery(product_id)
  const [addReview] = useAddReviewMutation()
  console.log("reviews", data)

  const formik = useFormik(
    {
      initialValues: { "product": product_id || "", "review": "", rating: 4 },
      validationSchema: "",
      enableReinitialize: true,
      onSubmit: async (values) => {
        addReview(values)
          .unwrap()
          .then((res) => {
            successToast(res?.message || "Your review has been added successfully.")
            refetch()
          })
          .catch(error => {
            console.error('Error in userLogin:', error);
            errorToast("Something went wrong, please try again later");
          });
        formik.resetForm()
      }
    }
  )

  return (
    <div className={clsx("description-review-area", spaceBottomClass)}>
      <div className="container">
        <div className="description-review-wrapper">
          <Tab.Container defaultActiveKey="productDescription">
            <Nav variant="pills" className="description-review-topbar">
              {/* <Nav.Item>
                <Nav.Link eventKey="additionalInfo">
                  Additional Information
                </Nav.Link>
              </Nav.Item> */}
              <Nav.Item>
                <Nav.Link eventKey="productDescription">Description</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="productReviews">Reviews({data?.length})</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content className="description-review-bottom">
              {/* <Tab.Pane eventKey="additionalInfo">
                <div className="product-anotherinfo-wrapper">
                  <ul>
                    <li>
                      <span>Weight</span> 400 g
                    </li>
                    <li>
                      <span>Dimensions</span>10 x 10 x 15 cm{" "}
                    </li>
                    <li>
                      <span>Materials</span> 60% cotton, 40% polyester
                    </li>
                    <li>
                      <span>Other Info</span> American heirloom jean shorts pug
                      seitan letterpress
                    </li>
                  </ul>
                </div>
              </Tab.Pane> */}
              <Tab.Pane eventKey="productDescription">
                {productFullDesc}
              </Tab.Pane>
              <Tab.Pane eventKey="productReviews">
                <div className="row">
                  <div className={isAuthenticated ? "col-lg-7" : "col-lg-12"}>
                    <div className="review-wrapper">
                      {data?.length > 0 ?

                        data?.map((review, index) => {
                          return (
                            <div className="single-review">

                              <div className="review-content">
                                <div className="review-top-wrap">
                                  <div className="review-left">
                                    <div className="review-name">
                                      <h4>{review.customer}</h4>
                                    </div>
                                    <div className="review-rating">
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star" />
                                    </div>
                                  </div>
                                  <div className="review-left">
                                    <button>Reply</button>
                                  </div>
                                </div>
                                <div className="review-bottom">
                                  <p>
                                    {review.review}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )

                        })
                        :
                        <p>No reviews yet</p>
                      }

                      {/* <div className="single-review">

                        <div className="review-content">
                          <div className="review-top-wrap">
                            <div className="review-left">
                              <div className="review-name">
                                <h4>White Lewis</h4>
                              </div>
                              <div className="review-rating">
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                              </div>
                            </div>
                            <div className="review-left">
                              <button>Reply</button>
                            </div>
                          </div>
                          <div className="review-bottom">
                            <p>
                              Vestibulum ante ipsum primis aucibus orci
                              luctustrices posuere cubilia Curae Suspendisse
                              viverra ed viverra. Mauris ullarper euismod
                              vehicula. Phasellus quam nisi, congue id nulla.
                            </p>
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>
                  {isAuthenticated &&
                    <div className="col-lg-5">
                      <div className="ratting-form-wrapper pl-50">
                        <h3>Add a Review</h3>
                        <div className="ratting-form">
                          <form >
                            <div className="star-box">
                              <span>Your rating:</span>
                              <div className="ratting-star">
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                              </div>
                            </div>
                            <div className="row">

                              <div className="col-md-12">
                                <div className="rating-form-style form-submit">
                                  <textarea
                                    placeholder="Message"
                                    defaultValue={""}
                                    type="password"
                                    onChange={formik.handleChange}
                                    value={formik.values.review}
                                    name={'review'}
                                  />
                                  <input type="submit" defaultValue="Submit" onClick={(e) => {
                                    e.preventDefault()
                                    formik.handleSubmit()

                                  }} />
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  }

                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </div>
  );
};

ProductDescriptionTab.propTypes = {
  productFullDesc: PropTypes.string,
  spaceBottomClass: PropTypes.string
};

export default ProductDescriptionTab;
