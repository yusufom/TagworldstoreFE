import { useFormik } from 'formik';


const ShopSearch = ({ getSortParams }) => {

  const formik = useFormik(
    {
      initialValues: { "search": "" },
      validationSchema: "",
      enableReinitialize: true,
      onSubmit: async (values) => {
        getSortParams("name", values.search)
      }
    }
  )
  return (
    <div className="sidebar-widget">
      <h4 className="pro-sidebar-title">Search </h4>
      <div className="pro-sidebar-search mb-50 mt-25">
        <form className="pro-sidebar-search-form" action="#">
          <input type="text" placeholder="Search here..." onChange={formik.handleChange}
            value={formik.values.search}
            name={'search'} />
          <button onClick={formik.handleSubmit}>
            <i className="pe-7s-search" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShopSearch;
