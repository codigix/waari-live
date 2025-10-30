import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Link, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { get, post } from "../../../../services/apiServices";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import BackButton from "../../common/BackButton";

const PaymentCustomizedtour = () => {
  const { id, idPayment } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const { permissions } = useSelector((state) => state.auth);

  // file upload start
  const url = import.meta.env.VITE_WAARI_BASEURL;
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoadingImage, setIsLoadingImages] = useState(false);

  const uploadFile = async (e) => {
    try {
      console.log(e.target.files[0]);
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      setIsLoadingImages(true);

      const responseData = await axios.post(
        `${import.meta.env.VITE_WAARI_BASEURL}/user/image-upload
           
`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setIsLoadingImages(false);
      setImageUrl(responseData?.data?.image_url);
      toast.success("Image added successfully");
      validation.setFieldValue("transactionproof", e.target.files[0].name);
    } catch (error) {
      toast.error(error?.response?.data?.message || "something went wrong");
      setIsLoadingImages(false);
    }
  };

  const [paymentMode, setPaymentMode] = useState([]);
  const getPaymentModeId = async () => {
    try {
      const response = await get(`/payment-mode-list`);

      const mappedData = response.data.data.map((item) => ({
        value: item.paymentModeId,
        label: item.paymentModeName,
      }));
      setPaymentMode(mappedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPaymentModeId();
  }, []);

  const [onlinemode, setOnlineMode] = useState([]);
  const getOnlineModeId = async () => {
    try {
      const response = await get(`/online-type-list`);

      const mappedData = response.data.data.map((item) => ({
        value: item.onlineTypeId,
        label: item.onlineTypeName,
      }));
      setOnlineMode(mappedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOnlineModeId();
  }, []);

  const [customizedTourDetail, setCustomizedTourDetail] = useState(null);

  const getCustomTourDetails = async () => {
    try {
      const response = await get(
        `/view-bill-ct?enquiryDetailCustomId=${idPayment}`
      );
      setCustomizedTourDetail(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCustomTourDetails();
  }, []);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      newpaymentamount: "",
      paymentMode: "",
      onlinemode: "",
      bankname: "",
      chequeno: "",
      dateofpayment: "",
      transactionproof: "",
      transactionid: "",
    },
    // validationSchema: Yup.object({
    // 	newpaymentamount: Yup.string()
    // 		.required("Enter The New Payment Amount")
    // 		.test({
    // 			name: "greaterThanBalanceAndPositive",
    // 			test: function (value) {
    // 				const floatValue = parseFloat(value);
    // 				return (
    // 					floatValue <= customizedTourDetail?.balance && floatValue >= 0
    // 				);
    // 			},
    // 			message:
    // 				"New payment amount must be less than or equal to the balance and positive.",
    // 		}),
    // 	paymentMode: Yup.object().required("Select Payment Mode"),
    // 	onlinemode: Yup.object().when("paymentMode", {
    // 		is: (mode) => mode.value == 1, // Apply validation when paymentMode is 'online'
    // 		then: Yup.object().required("Select The Online Mode"),
    // 		otherwise: Yup.object(),
    // 	}),
    // 	bankname: Yup.string().when("paymentMode", {
    // 		is: (mode) => mode.value == 2, // Apply validation when paymentMode is 'online'
    // 		then: Yup.string().required("Enter The Bank Name"),
    // 		otherwise: Yup.string(),
    // 	}),
    // 	chequeno: Yup.string().when("paymentMode", {
    // 		is: (mode) => mode.value == 2, // Apply validation when paymentMode is not 'online'
    // 		then: Yup.string().required("Enter The Cheque No."),
    // 		otherwise: Yup.string(),
    // 	}),
    // 	dateofpayment: Yup.string().required("Enter The Date of payment"),

    // 	transactionproof: Yup.string().required("Upload The Transaction Proof"),
    // 	transactionid: Yup.string().when("paymentMode", {
    // 		is: (mode) => mode.value == 1, // Apply validation when paymentMode is 'online'
    // 		then: Yup.string().required("Enter The Transaction Id"),
    // 		otherwise: Yup.string(),
    // 	}),
    // }),
    validationSchema: Yup.object({
      newpaymentamount: Yup.string(),
      paymentMode: Yup.object(),
      onlinemode: Yup.object(),
      bankname: Yup.string(),
      chequeno: Yup.string(),
      dateofpayment: Yup.string(),
      transactionproof: Yup.string(),
      transactionid: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      const data = {
        enquiryCustomId: id,
        enquiryDetailCustomId: idPayment,
        advancePayment: values.newpaymentamount,
        paymentModeId: values.paymentMode?.value,
        bankName: values.bankname,
        chequeNo: values.chequeno,
        payDate: values.dateofpayment,
        transactionId: values.transactionid,
        transactionProof: imageUrl,
        onlineTypeId: values.onlinemode?.value,
      };
      try {
        setIsLoading(true);
        const response = await post(`receive-bill-ct`, data);
        toast.success(response?.data?.message);
        getCustomTourDetails();
        setIsLoading(false);
        resetForm();
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    },
  });

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height: "34px", // Adjust the height to your preference
    }),
  };
  useEffect(() => {
    // While view farmer page is active, the yadi tab must also activated
    const pathArray = window.location.href.split("/");
    const path = pathArray[pathArray.length - 1];
    let element = document.getElementById("confirm-customized-tour");
    if (element) {
      element.classList.add("mm-active1"); // Add the 'active' class to the element
    }
    return () => {
      if (element) {
        element.classList.remove("mm-active1"); // remove the 'active' class to the element when change to another page
      }
    };
  }, []);

  return (
    <>
      <form
        className="needs-validation"
        onSubmit={(e) => {
          e.preventDefault();
          validation.handleSubmit();
          return false;
        }}
      >
        <div className="card">
          <div className="row page-titles mx-0 mb-2 fixed-top-breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <BackButton />
              </li>
              <li className="breadcrumb-item active">
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/confirm-customized-tour">Confirmed</Link>
              </li>
              <li className="breadcrumb-item  ">
                <Link to="/payment-customized-tour">Received Payment</Link>
              </li>
            </ol>
          </div>
        </div>
        <div className="card">
          <div className="card-header card-header-second">
            <div className="card-title h5">Previous Payments</div>
          </div>
          <div className="card-body">
            <div className="basic-form">
              <div className="mb-2 row">
                <div className="col-md-3">
                  <label className="form-label">Billing Name</label>
                </div>
                <div className="col-md-5">
                  <div className="view-details">
                    <h6>{customizedTourDetail?.billingName}</h6>
                  </div>
                </div>
              </div>
              <div className="mb-2 row">
                <div className="col-md-3">
                  <label className="form-label">Address</label>
                </div>
                <div className="col-md-5">
                  <div className="view-details">
                    <h6>{customizedTourDetail?.address}</h6>
                  </div>
                </div>
              </div>
              <div className="mb-2 row">
                <div className="col-md-3">
                  <label className="form-label">Phone No.</label>
                </div>
                <div className="col-md-5">
                  <div className="view-details">
                    <h6>{customizedTourDetail?.phoneNumber}</h6>
                  </div>
                </div>
              </div>

              <div className="mb-2 row">
                <div className="col-md-3">
                  <label className="form-label">GSTIN</label>
                </div>
                <div className="col-md-5">
                  <div className="view-details">
                    <h6>{customizedTourDetail?.gstIn}</h6>
                  </div>
                </div>
              </div>
              <div className="mb-2 row">
                <div className="col-md-3">
                  <label className="form-label">PAN Number</label>
                </div>
                <div className="col-md-5">
                  <div className="view-details">
                    <h6>{customizedTourDetail?.panNumber}</h6>
                  </div>
                </div>
              </div>
              <div className="mb-2 row">
                <div className="col-md-3">
                  <label className="form-label">Grand Total</label>
                </div>
                <div className="col-md-5">
                  <div className="view-details">
                    <h6>{customizedTourDetail?.grandTotal}</h6>
                  </div>
                </div>
              </div>

              {customizedTourDetail?.advancePayments &&
                customizedTourDetail?.advancePayments.map((item, index) => {
                  return (
                    <>
                      <div className="mb-2 row">
                        <div className="col-md-3">
                          <label className="form-label">
                            Advance {index + 1}
                          </label>
                        </div>
                        <div className="col-md-5">
                          <div className="view-details">
                            <h6>{item?.advancePayment}</h6>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="">
                            <div key={index}>
                              {item.status == 0 ? (
                                <>
                                  <badge className="badge badge-warning">
                                    Pending
                                  </badge>
                                </>
                              ) : (
                                <>
                                  <div className="d-flex  mt-2 mt-lg-0 mt-md-0">
                                    <badge className="badge badge-success">
                                      Confirm
                                    </badge>

                                    {hasComponentPermission(
                                      permissions,
                                      42
                                    ) && (
                                      <Link
                                        to={`/receipt-ct/${item.customPayDetailId}/${idPayment}`}
                                        className="btn btn-secondary add-btn pdf-btn btn-sm"
                                        style={{
                                          height: "32px",
                                          margin: "0px 10px 0px 0px",
                                          lineHeight: "1.2",
                                          padding: "0px",
                                        }}
                                      >
                                        View Receipt
                                      </Link>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              <div className="mb-2 row">
                <div className="col-md-3">
                  <label className="form-label">Balance</label>
                </div>
                <div className="col-md-5">
                  <div className="view-details">
                    <h6>{customizedTourDetail?.balance}</h6>
                  </div>
                </div>
                <div className="col-md-4">
                  {customizedTourDetail?.isPaymentDone &&
                    hasComponentPermission(permissions, 133) && (
                      <div className="col-md-4">
                        <Link
                          to={`/invoice-ct/${id}/${idPayment}`}
                          className="btn btn-secondary add-btn btn-sm"
                          style={{
                            height: "32px",
                            margin: "0px 10px 0px 0px",
                            lineHeight: "1",
                          }}
                        >
                          Invoice
                        </Link>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {hasComponentPermission(permissions, 43) && (
          <div className="card">
            <div className="card-header">
              <div className="card-title h5">New Payment Received</div>
            </div>
            <div className="card-body">
              <div className="mb-2 row">
                <div className="col-md-3">
                  <label className="form-label">
                    New Payment Amount<span className="error-star">*</span>
                  </label>
                </div>
                <div className="col-md-5">
                  <input
                    type="number"
                    className="form-control col-md-6"
                    placeholder=""
                    min="1"
                    step="any"
                    name="newpaymentamount"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.newpaymentamount}
                  />
                  {validation.touched.newpaymentamount &&
                  validation.errors.newpaymentamount ? (
                    <span className="error">
                      {validation.errors.newpaymentamount}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="row mb-2 form-group">
                <div className="col-md-3">
                  <label className="form-label">
                    Payment mode<span className="error-star">*</span>
                  </label>
                </div>
                <div className="col-md-5">
                  <Select
                    styles={customStyles}
                    className="basic-single"
                    classNamePrefix="select"
                    name="paymentMode"
                    onChange={(selectedOption) => {
                      validation.setFieldValue("paymentMode", selectedOption);
                      validation.setFieldValue("onlinemode", "");
                    }}
                    options={paymentMode}
                    onBlur={validation.handleBlur}
                    value={validation.values.paymentMode}
                  />
                  {validation.touched.paymentMode &&
                  validation.errors.paymentMode ? (
                    <span className="error">
                      {validation.errors.paymentMode}
                    </span>
                  ) : null}
                </div>
              </div>

              {validation.values.paymentMode?.value == 1 && (
                <div className="row mb-2 form-group">
                  <div className="col-md-3">
                    <label className="form-label">
                      Online Transaction<span className="error-star">*</span>
                    </label>
                  </div>
                  <div className="col-md-5">
                    <Select
                      styles={customStyles}
                      className="basic-single"
                      classNamePrefix="select"
                      name="onlinemode"
                      options={onlinemode}
                      onChange={(selectedOption) => {
                        validation.setFieldValue("onlinemode", selectedOption); // Extract the 'value' property
                      }}
                      onBlur={validation.handleBlur}
                      value={validation.values.onlinemode}
                    />
                    {validation.touched.onlinemode &&
                    validation.errors.onlinemode ? (
                      <span className="error">
                        {validation.errors.onlinemode}
                      </span>
                    ) : null}
                  </div>
                </div>
              )}

              {validation.values.paymentMode?.value == 2 && (
                <div className="mb-2 row">
                  <div className="col-md-3">
                    <label className="form-label">
                      Bank Name
                      {validation.values.paymentMode?.value == 2 && (
                        <span className="error-star">*</span>
                      )}
                    </label>
                  </div>
                  <div className="col-md-5">
                    <input
                      type="text"
                      className="form-control"
                      name="bankname"
                      placeholder=""
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.bankname}
                    />
                    {validation.touched.bankname &&
                    validation.errors.bankname ? (
                      <span className="error">
                        {validation.errors.bankname}
                      </span>
                    ) : null}
                  </div>
                </div>
              )}

              {validation.values.paymentMode?.value == 2 && (
                <div className="mb-2 row">
                  <div className="col-md-3">
                    <label className="form-label">
                      Cheque No.<span className="error-star">*</span>
                    </label>
                  </div>
                  <div className="col-md-5">
                    <input
                      type="number"
                      className="form-control"
                      name="chequeno"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.chequeno}
                    />
                    {validation.touched.chequeno &&
                    validation.errors.chequeno ? (
                      <span className="error">
                        {validation.errors.chequeno}
                      </span>
                    ) : null}
                  </div>
                </div>
              )}
              <div className="mb-2 row">
                <div className="col-md-3">
                  <label className="form-label">
                    Date of payment<span className="error-star">*</span>
                  </label>
                </div>
                <div className="col-md-5">
                  <input
                    type="date"
                    className="form-control"
                    name="dateofpayment"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.dateofpayment}
                  />
                  {validation.touched.dateofpayment &&
                  validation.errors.dateofpayment ? (
                    <span className="error">
                      {validation.errors.dateofpayment}
                    </span>
                  ) : null}
                </div>
              </div>
              {validation.values.paymentMode?.value == 1 && (
                <div className="mb-2 row">
                  <div className="col-md-3">
                    <label className="form-label">
                      Transaction ID<span className="error-star">*</span>
                    </label>
                  </div>
                  <div className="col-md-5">
                    <input
                      className="form-control"
                      name="transactionid"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.transactionid}
                    />
                    {validation.touched.transactionid &&
                    validation.errors.transactionid ? (
                      <span className="error">
                        {validation.errors.transactionid}
                      </span>
                    ) : null}
                  </div>
                </div>
              )}
              <div className="mb-2 row">
                <div className="col-md-3">
                  <label className="form-label">
                    Transaction Proof<span className="error-star">*</span>
                  </label>
                </div>
                <div className="col-md-5">
                  <input
                    type="file"
                    className="form-control"
                    name="transactionproof"
                    onChange={uploadFile}
                  />
                  {validation.touched.transactionproof &&
                  validation.errors.transactionproof ? (
                    <span className="error">
                      {validation.errors.transactionproof}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="mb-2 mt-3  row">
                <div className="col-lg-12 d-flex justify-content-between">
                  <Link
                    to="/confirm-group-tour"
                    type="submit"
                    className="btn btn-back"
                  >
                    Back
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-submit btn-primary"
                    disabled={isLoadingImage || isLoading}
                  >
                    {isLoading ? "Uploading..." : "Upload Payment"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </>
  );
};
export default PaymentCustomizedtour;
