import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Link, useLocation, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { get, post } from "../../../../services/apiServices";
import axios from "axios";
import { toast } from "react-toastify";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import { useSelector } from "react-redux";
import BackButton from "../../common/BackButton";

const PaymentGrouptour = () => {
  const [isLoading, setIsLoading] = useState(false);
  // file upload start
  const url = import.meta.env.VITE_WAARI_BASEURL;
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoadingImage, setIsLoadingImages] = useState(false);
  const { permissions } = useSelector((state) => state.auth);

  const uploadFile = async (e) => {
    try {
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      setIsLoadingImages(true);

      const responseData = await axios.post(
        `
          ${url}/image-upload`,
        formData
      );
      setIsLoadingImages(false);
      setImageUrl(responseData?.data?.image_url);
      validation.setFieldValue(
        "transactionproof",
        responseData?.data?.image_url
      );
      toast.success("Image added successfully");
    } catch (error) {
      setIsLoadingImages(false);
      toast.error(error?.response?.data?.message || "something went wrong");
    }
  };
  // file upload end

  const { id } = useParams();

  // to get the group tour bill details start
  const [groupTourBillDetails, setGroupTourBillDetails] = useState([]);
  const getGroupTourBillDetails = async () => {
    try {
      const response = await get(`/view-bill-group-tour?enquiryGroupId=${id}`);
      setGroupTourBillDetails(response?.data?.data);
      // console.log(response)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGroupTourBillDetails();
  }, []);

  // to get the group tour bill details end

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
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
    //   newpaymentamount: Yup.string().required("Enter The New Payment Amount"),
    //   paymentMode: Yup.object().required("Select Payment Mode"),
    //   onlinemode: Yup.object().when('paymentMode', {
    //     is: (mode) => mode.value == 1, // Apply validation when paymentMode is 'online'
    //     then: Yup.object().required("Select The Online Mode"),
    //     otherwise: Yup.object(),
    //   }),
    //   bankname: Yup.string().when('paymentMode', {
    //     is: (mode) => mode.value == 2, // Apply validation when paymentMode is 'online'
    //     then: Yup.string().required("Enter The Bank Name"),
    //     otherwise: Yup.string(),
    //   }),
    //   chequeno: Yup.string().when('paymentMode', {
    //     is: (mode) => mode.value == 2, // Apply validation when paymentMode is not 'online'
    //     then: Yup.string().required("Enter The Cheque No."),
    //     otherwise: Yup.string(),
    //   }),
    //   dateofpayment: Yup.string().required("Enter The Date of payment"),

    //   transactionproof: Yup.string().required("Upload The Transaction Proof"),
    //   transactionid: Yup.string().when('paymentMode', {
    //     is: (mode) => mode.value == 1, // Apply validation when paymentMode is 'online'
    //     then: Yup.string().required("Enter The Transaction Id"),
    //     otherwise: Yup.string(),
    //   })
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
      let data = {
        enquiryGroupId: id,
        advancePayment: values.newpaymentamount,
        paymentModeId: values.paymentMode?.value,
        bankName: values.bankname,
        chequeNo: values.chequeno,
        paymentDate: values.dateofpayment,
        transactionId: values.transactionid,
        transactionProof: imageUrl,
        onlineTypeId: values.onlinemode?.value,
      };

      try {
        setIsLoading(true);
        const response = await post(`receivebill-group-tour`, data);
        console.log(response);
        toast.success(response?.data?.message);
        getGroupTourBillDetails();
        setIsLoading(false);
        resetForm();
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    },
  });
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
    let element = document.getElementById("confirm-group-tour");
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
        <div className="card" style={{ marginBottom: "40px" }}>
          <div className="row page-titles mx-0 fixed-top-breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <BackButton />
              </li>
              <li className="breadcrumb-item active">
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/confirm-group-tour">Confirmed</Link>
              </li>
              <li className="breadcrumb-item  ">
                <Link to="/payment-group-tour">Received Payment</Link>
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
                    <h6>{groupTourBillDetails?.billingName}</h6>
                  </div>
                </div>
              </div>
              <div className="mb-2 row">
                <div className="col-md-3">
                  <label className="form-label">Address</label>
                </div>
                <div className="col-md-5">
                  <div className="view-details">
                    <h6>{groupTourBillDetails?.address}</h6>
                  </div>
                </div>
              </div>
              <div className="mb-2 row">
                <div className="col-md-3">
                  <label className="form-label">Phone No.</label>
                </div>
                <div className="col-md-5">
                  <div className="view-details">
                    <h6>{groupTourBillDetails?.phoneNumber}</h6>
                  </div>
                </div>
              </div>

              <div className="mb-2 row">
                <div className="col-md-3">
                  <label className="form-label">GSTIN</label>
                </div>
                <div className="col-md-5">
                  <div className="view-details">
                    <h6>{groupTourBillDetails?.gstIn}</h6>
                  </div>
                </div>
              </div>
              <div className="mb-2 row">
                <div className="col-md-3">
                  <label className="form-label">PAN Number</label>
                </div>
                <div className="col-md-5">
                  <div className="view-details">
                    <h6>{groupTourBillDetails?.panNumber}</h6>
                  </div>
                </div>
              </div>
              <div className="mb-2 row">
                <div className="col-md-3">
                  <label className="form-label">Grand Total</label>
                </div>
                <div className="col-md-5">
                  <div className="view-details">
                    <h6>{groupTourBillDetails?.grandTotal}</h6>
                  </div>
                </div>
              </div>

              {groupTourBillDetails?.advancePayments &&
                groupTourBillDetails?.advancePayments.map((item, index) => {
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
                                      39
                                    ) && (
                                      <Link
                                        to={`/receipt/${id}/${item.groupPaymentDetailId}`}
                                        className="btn btn-secondary add-btn btn-sm"
                                        style={{
                                          height: "32px",
                                          margin: "0px 10px 0px 0px",
                                          lineHeight: "1",
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
                    <h6>{groupTourBillDetails?.balance}</h6>
                  </div>
                </div>
                <div className="col-md-4">
                  {groupTourBillDetails?.isPaymentDone &&
                    hasComponentPermission(permissions, 132) && (
                      <div className="col-md-4">
                        <Link
                          to={`/invoice/${id}`}
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
        {!groupTourBillDetails?.isPaymentDone &&
          hasComponentPermission(permissions, 40) && (
            <div className="card">
              <div className="card-header card-header-second">
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
                      options={paymentMode}
                      onChange={(selectedOption) => {
                        validation.setFieldValue("paymentMode", selectedOption);
                        validation.setFieldValue("onlinemode", "");
                      }}
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
                {validation.values.paymentMode.value == 1 && (
                  <div className="row mb-2 form-group">
                    <div className="col-md-3">
                      {
                        <label className="form-label">
                          Online Transaction
                          <span className="error-star">*</span>
                        </label>
                      }
                    </div>
                    <div className="col-md-5">
                      <Select
                        styles={customStyles}
                        className="basic-single"
                        classNamePrefix="select"
                        name="onlinemode"
                        options={onlinemode}
                        onChange={(selectedOption) => {
                          validation.setFieldValue(
                            "onlinemode",
                            selectedOption
                          ); // Extract the 'value' property
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
                      accept="image/*"
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
                {isLoadingImage ? "Loading.." : ""}

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
export default PaymentGrouptour;
