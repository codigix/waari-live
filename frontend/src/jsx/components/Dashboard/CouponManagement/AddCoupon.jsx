import { useFormik } from "formik";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Select from "react-select";
import ErrorMessageComponent from "../../Dashboard/FormErrorComponent/ErrorMessageComponent";
import axios from "axios";
import { toast } from "react-toastify";
import { post } from "../../../../services/apiServices";
const url = import.meta.env.VITE_WAARI_BASEURL;
import Switch from "@mui/material/Switch";
import BackButton from "../../common/BackButton";

// Validation Rules 
const validationSchema = Yup.object().shape({
  couponName: Yup.string().required("Name is required"),
  status: Yup.boolean().required("Status is required"),
  fromDate: Yup.date().required("Validity - From Date is required"),
  toDate: Yup.date().required("Validity - To Date is required"),
  discountValue: Yup.string().when("discountType", {
    is: (discountType) => discountType == 2,
    then: Yup.string()
      .required("Enter The Discount Percentage")
      .matches(/^[0-9]{1,3}$/, "Discount Percentage must be between 0 and 100")
      .test(
        "max",
        "Discount Percentage must be between 0 and 100",
        (value) => parseInt(value, 10) <= 100
      ),
    otherwise: Yup.string().when("discountType", {
      is: (discountType) => discountType == 1,
      then: Yup.string().required("Enter The Discount Amount"),
      otherwise: Yup.string()
        .required("Enter The Discount Amount")
        .max(100)
        .default(1),
    }),
  }),
  maxDiscount: Yup.string().when("discountType", {
    is: (discountType) => discountType?.value == 1,
    then: Yup.string().nullable().required("Enter The Max Discount Amount"),
    // otherwise: Yup.string(),
  }),
});

function AddCoupon() {
  const navigate = useNavigate();
  const tokenId = localStorage.getItem("token");
  const [isLoading, setIsLoading] = React.useState(false);

  // this hook is for form validation
  const formik = useFormik({
    initialValues: {
      couponName: "",
      fromDate: "",
      toDate: "",
      discountType: 1,
      discountValue: "",
      status: 1,
      maxDiscount: 0,
      isType: 1, 
    },
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      try {
        setIsLoading(true);

        if (values.discountType == 2) {
          // Set a new field with key 'fixedDiscount' and value from discountValue
          formik.setFieldValue("maxDiscount", values.maxDiscount);
        }

        const data = {
          couponName: values.couponName,
          fromDate: values.fromDate,
          toDate: values.toDate,
          discountType: values.discountType,
          discountValue: values.discountValue,
          status: values.status ? 1 : 0,
          isType: values.isType
        };

        if (values.discountType == 2) {
          data.maxDiscount = values.maxDiscount;
        }

        const result = await post("add-coupons", data);
        toast.success(result?.data?.message);

        navigate("/coupon-list");
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    },
  });
  // console.table(formik.values);

  // If To toDate is Earlier than fromDate then set toDate to empty
  const handleDateChangeFrom = (e) => {
    formik.setFieldValue("fromDate", e.target.value)
    if(formik.values.toDate && (new Date(e.target.value)>new Date(formik.values.toDate))){
          formik.setFieldValue('toDate', '');
    }
  };

  const handleDateChangeto = (e) => {
    formik.setFieldValue("toDate", e.target.value)
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-12" style={{ paddingTop: '40px' }}>
          <div className="card">
            <div className="row page-titles mx-0 fixed-top-breadcrumb">
                 <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <BackButton />
                        </li>
                <li className="breadcrumb-item active">
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/coupon-list">Coupon Information</Link>
                </li>
                <li className="breadcrumb-item  ">
                  <Link to="/add-coupon">Add Coupon</Link>
                </li>
              </ol>
            </div>
          </div>
          {/* form for above filed */}
          <div className="card">
          <div className="card-body"> 
            <div className="card-header mb-2 pt-0" style={{paddingLeft:"0"}}>
              <div className="card-title h5">Add Coupon</div>
            </div>
          
              <form onSubmit={formik.handleSubmit} className="needs-validation">
                <div className="row">
                  <div className="col-md-4 col-lg-3 col-sm-6 col-12">
                    <div className="mb-2">
                      <label>
                        Coupon Name<span className="error-star">*</span>
                      </label>
                      <input
                        id="couponName"
                        name="couponName"
                        type="text"
                        className="form-control"
                        value={formik.values.couponName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"couponName"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 col-lg-3 col-sm-6 col-12">
                    <div className="mb-2">
                      <label>
                        Discount Amount<span className="error-star">*</span>
                      </label>
                      <input
                        id="discountValue"
                        name="discountValue"
                        type="number"
                        className="form-control"
                        value={formik.values.discountValue}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"discountValue"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 col-lg-3 col-sm-6 col-12">
                    <div className="mb-3">
                      <label className="form-label">Coupon For</label>
                      <div className="d-flex align-items-center">
                      <div className="filled-in chk-col-primary d-flex align-items-center me-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="isType"
                          id="allUsers"
                          value={1}
                          checked={formik.values.isType == 1}
                          onChange={formik.handleChange}
                        />
                        <label className="form-check-label" htmlFor="allUsers">
                          All Users
                        </label>
                      </div>
                      <div className="filled-in chk-col-primary d-flex align-items-center me-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="isType"
                          id="newUsers"
                          value={2}
                          checked={formik.values.isType == 2}
                          onChange={formik.handleChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="newUsers"
                        >
                          New Users
                        </label>
                      </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4 col-lg-3 col-sm-6 col-12">
                    <div className="mb-3">
                      <label className="form-label">Discount Type</label>
                      <div className="d-flex align-items-center">
                      <div className="filled-in chk-col-primary d-flex align-items-center me-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="discountType"
                          id="fixed"
                          value={1}
                          checked={formik.values.discountType == 1}
                          onChange={formik.handleChange}
                        />
                        <label className="form-check-label" htmlFor="fixed">
                          Fixed
                        </label>
                      </div>
                      <div className="filled-in chk-col-primary d-flex align-items-center me-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="discountType"
                          id="percentage"
                          value={2}
                          checked={formik.values.discountType == 2}
                          onChange={formik.handleChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="percentage"
                        >
                          Percentage
                        </label>
                      </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4 col-lg-3 col-sm-6 col-12">
                    <div className="mb-2">
                      <label>
                        Coupon Validity From
                        <span className="error-star">*</span>
                      </label>
                      <input
                        type="date"
                        name="fromDate"
                        className="form-control"
                        min={new Date().toISOString().split("T")[0]}
                        onChange={handleDateChangeFrom}
                        value={formik.values.fromDate}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 col-lg-3 col-sm-6 col-12">
                    <div className="mb-2">
                      <label>
                        Coupon Validity to<span className="error-star">*</span>
                      </label>
                      <input
                        type="date"
                        id="toDate"
                        name="toDate"
                        min={formik.values.fromDate && new Date(formik.values.fromDate).toISOString().split("T")[0]}
                        className="form-control"
                        onChange={handleDateChangeto}
                        value={formik.values.toDate}
                      />
                    </div>
                  </div>

                  {formik.values.discountType == 2 && (
                    <div className="col-md-4 col-lg-3 col-sm-6 col-12">
                      <div className="mb-2">
                        <label>
                          Max Discount<span className="error-star">*</span>
                        </label>
                        <input
                          id="maxDiscount"
                          name="maxDiscount"
                          type="number"
                          className="form-control"
                          value={formik.values.maxDiscount}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        <ErrorMessageComponent
                          errors={formik.errors}
                          fieldName={"maxDiscount"}
                          touched={formik.touched}
                        />
                      </div>
                    </div>
                  )}

                  <div className="col-md-4 col-lg-4 col-sm-6 col-12">
                    <div className="mb-2">
                      <label>
                        Status<span className="error-star">*</span>
                      </label>
                      <div>
                      <Switch
                        name="status"
                        checked={formik.values.status ? true : false}
                        onChange={(event) =>
                          formik.setFieldValue("status", event.target.checked)
                        }
                        inputProps={{ "aria-label": "controlled" }}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"status"}
                        touched={formik.touched}
                      />
                    </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 d-flex justify-content-between mt-3">
                  <Link
                    to="/coupon-list"
                    type="submit"
                    className="btn btn-back"
                  >
                    Back
                  </Link>
                  <div className="d-flex">
                    <button
                      type="submit"
                      className="btn btn-submit btn-primary"
                    >
                      {isLoading ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddCoupon;
