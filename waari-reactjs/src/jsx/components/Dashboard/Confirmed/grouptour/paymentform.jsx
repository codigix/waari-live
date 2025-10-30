import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { get, post } from "../../../../../services/apiServices";
import axios from "axios";
import { toast } from "react-toastify";
import { hasComponentPermission } from "../../../../auth/PrivateRoute";
import { useSelector } from "react-redux";

const PaymentForm = ({
  familyHead,
  enquiryId,
  grandTotal,
  advancePayment,
  balance,
  handleRerender,
}) => {
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  // file upload start
  const url = import.meta.env.VITE_WAARI_BASEURL;
  const [imageUrl, setImageUrl] = useState(null);

  const { permissions } = useSelector((state) => state.auth);

  const getFileLink = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const responseData = await axios.post(
        `
              ${url}/image-upload`,
        formData
      );
      toast.success("File uploaded successfully");
      return responseData?.data?.image_url;
    } catch (error) {
      toast.error(error?.response?.data?.message?.toString());
      console.log(error);
    }
  };
  // file upload end

  // to get the group tour bill details start
  const [groupTourBillDetails, setGroupTourBillDetails] = useState([]);

  const getGroupTourBillDetails = async () => {
    try {
      const response = await get(
        `/view-bill-group-tour?familyHeadGtId=${familyHead.familyHeadGtId}`
      );
      setGroupTourBillDetails(response?.data?.data);
      // console.log(response)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGroupTourBillDetails();
  }, []);

  const [cardTypeDropDown, setCardTypeDropDown] = useState([]);
  const getCardTypeDropDownList = async () => {
    try {
      const response = await get(`/card-type-list`);

      const mappedData = response.data.data.map((item) => ({
        value: item.cardTypeId,
        label: item.cardTypeName,
      }));
      setCardTypeDropDown(mappedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCardTypeDropDownList();
  }, []);

  // to get the group tour bill details end

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      newpaymentamount: "",
      paymentMode: "",
      onlinemode: "",

      cardType: "", // Debit or Credit Card Type

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
    // 			name: "positiveAndAboveZero",
    // 			test: function (value) {
    // 				const floatValue = parseFloat(value);
    // 				return floatValue > 0; // Check if the value is positive and above 0
    // 			},
    // 			message: "New payment amount must be positive and above 0.",
    // 		}),
    // 	paymentMode: Yup.object().required("Select Payment Mode"),
    // 	onlinemode: Yup.object().when("paymentMode", {
    // 		is: (mode) => mode?.value == 1, // Apply validation when paymentMode is 'online'
    // 		then: Yup.object().required("Select The Online Mode"),
    // 		otherwise: Yup.object(),
    // 	}),

    //     // New Validations for Card Type
    //     cardType: Yup.string().when("paymentMode", {
    //         is: (mode) => mode?.value == 4, // Apply validation when paymentMode is 'Cards'
    //         then: Yup.string().required("Select The Card Type"),
    //         otherwise: Yup.string(),
    //     }),

    // 	bankname: Yup.string().when("paymentMode", {
    // 		is: (mode) => mode?.value == 2, // Apply validation when paymentMode is 'online'
    // 		then: Yup.string().required("Enter The Bank Name"),
    // 		otherwise: Yup.string(),
    // 	}),
    // 	chequeno: Yup.string().when("paymentMode", {
    // 		is: (mode) => mode?.value == 2, // Apply validation when paymentMode is not 'online'
    // 		then: Yup.string().required("Enter The Cheque No."),
    // 		otherwise: Yup.string(),
    // 	}),
    // 	dateofpayment: Yup.string().required("Enter The Date of payment"),

    // 	transactionproof: Yup.string().required("Upload The Transaction Proof"),
    // 	transactionid: Yup.string().when("paymentMode", {
    // 		is: (mode) => mode?.value == 1, // Apply validation when paymentMode is 'online'
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
      let data = {
        enquiryGroupId: enquiryId,
        familyHeadGtId: familyHead.familyHeadGtId,

        advancePayment: values.newpaymentamount,
        paymentModeId: values.paymentMode?.value,
        bankName: values.bankname,
        chequeNo: values.chequeno,
        paymentDate: values.dateofpayment,
        transactionId: values.transactionid,
        transactionProof: values?.transactionproof,
        onlineTypeId: values.onlinemode?.value,

        cardTypeId: values?.cardType,
      };

      try {
        setIsLoading(true);
        const response = await post(`receivebill-group-tour`, data);
        toast.success(response?.data?.message);
        getGroupTourBillDetails();
        setIsLoading(false);
        resetForm();
        handleRerender();

        const imageInput = document.getElementById("transactionProof");
        if (imageInput) {
          imageInput.value = ""; // Resetting the value of the input field
        }
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
        className="needs-validation "
        onSubmit={(e) => {
          e.preventDefault();
          validation.handleSubmit();
          return false;
        }}
      >
        <div className="card-header mb-2 p-0 card-header-second">
          <div className="card-title h5">Previous Payments</div>
        </div>
        <div className="col-lg-12 mt-2">
          <div className="tour-part">
            <div className="row">
              <div className="col-md-3">
                <label>
                  Tour Cost<span className="error-star">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  name="tourcost"
                  value={grandTotal}
                  disabled
                  style={{
                    border: "1px solid #076fb0",
                    color: "#076fb0",
                    fontWeight: "600",
                  }}
                />
              </div>
              <div className="col-md-3">
                <label>
                  Paid<span className="error-star">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  name="paid"
                  value={advancePayment}
                  disabled
                  style={{
                    border: "1px solid #299e4a",
                    color: "#299e4a",
                    fontWeight: "600",
                  }}
                />
              </div>
              <div className="col-md-3">
                <label>
                  Balance<span className="error-star">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  name="balance"
                  value={balance}
                  disabled
                  style={{
                    border: "1px solid #ff0000",
                    color: "#ff0000",
                    fontWeight: "600",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

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
                <h6 style={{ color: "#299e4a" }}>
                  {groupTourBillDetails?.grandTotal}
                </h6>
              </div>
            </div>
          </div>

          {groupTourBillDetails?.advancePayments &&
            groupTourBillDetails?.advancePayments.map((item, index) => {
              return (
                <>
                  <div className="mb-2 row">
                    <div className="col-md-3">
                      <label className="form-label">Advance {index + 1}</label>
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
                              <badge className="badge light badge-warning">
                                Pending
                              </badge>
                              <badge className="badge badge-warning">
                                {item.receiptNo}
                              </badge>
                            </>
                          ) : (
                            <>
                              <div className="d-flex  mt-2 mt-lg-0 mt-md-0">
                                <badge className="badge light badge-success">
                                  Confirm
                                </badge>

                                {
                                  <Link
                                    to={`/receipt/${familyHead.familyHeadGtId}/${item.groupPaymentDetailId}`}
                                    className="btn btn-secondary add-btn btn-sm"
                                    style={{
                                      height: "32px",
                                      margin: "0px 10px 0px 0px",
                                      lineHeight: "1",
                                    }}
                                  >
                                    View Receipt
                                  </Link>
                                }
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
                <h6 style={{ color: "#ff0000" }}>
                  {groupTourBillDetails?.balance}
                </h6>
              </div>
            </div>
            <div className="col-md-4">
              {groupTourBillDetails?.isPaymentDone && (
                <div className="col-md-4">
                  <Link
                    to={`/invoice/${familyHead.familyHeadGtId}`}
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

        {!groupTourBillDetails?.isPaymentDone &&
          hasComponentPermission(permissions, 160) && (
            <>
              <div className="card-header mb-2 p-0 card-header-second">
                <div className="card-title h5">New Payment Received</div>
              </div>

              <div className="mb-2 row">
                <div className="col-md-3">
                  <label className="form-label">
                    New Payment Amount<span className="error-star">*</span>
                  </label>
                </div>
                <div className="col-md-5">
                  <input
                    className="form-control col-md-6"
                    placeholder=""
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
                    className="basic-single select-role"
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
                        Online Transaction<span className="error-star">*</span>
                      </label>
                    }
                  </div>
                  <div className="col-md-5">
                    <Select
                      styles={customStyles}
                      className="basic-single select-role"
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

              {/* ---------------------------------------------------- Shows Dropdown to choose debit or credit card */}

              {validation.values.paymentMode.value == 4 && (
                <div className="row mb-2 form-group">
                  <div className="col-md-3">
                    <label className="text-label">
                      Card Type<span className="error-star">*</span>
                    </label>
                  </div>
                  <div className="col-md-5">
                    <Select
                      styles={customStyles}
                      className="basic-single"
                      classNamePrefix="select"
                      name="cardType"
                      options={cardTypeDropDown}
                      onChange={(selectedOption) => {
                        validation.setFieldValue(
                          "cardType",
                          selectedOption ? selectedOption.value : ""
                        ); // Extract the 'value' property
                      }}
                      onBlur={validation.handleBlur}
                      value={cardTypeDropDown.find(
                        (option) => option.value === validation.values.cardType
                      )}
                    />
                    {validation.touched.cardType &&
                    validation.errors.cardType ? (
                      <span className="error">
                        {validation.errors.cardType}
                      </span>
                    ) : null}
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- When Selected Credit or Debit Card - Then Shows Card Fields */}

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
                  <label className="text-label">
                    Transaction Proof<span className="error-star">*</span>
                  </label>
                </div>
                <div className="col-md-5">
                  <div className="Neon Neon-theme-dragdropbox cheque-upload">
                    <input
                      className="file_upload"
                      name={`transactionproof`}
                      accept="image/*"
                      id="filer_input2"
                      type="file"
                      draggable
                      onChange={async (e) => {
                        const selectedFile = e.target.files[0];
                        const fileLink = await getFileLink(selectedFile);
                        validation.setFieldValue(`transactionproof`, fileLink);
                        e.target.value = "";
                      }}
                    />
                    <div className="Neon-input-dragDrop">
                      {validation.values.transactionproof?.length == 0 ? (
                        <div className="Neon-input-inner ">
                          <div className="Neon-input-text">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 384 512"
                              className="display-4"
                            >
                              <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM216 408c0 13.3-10.7 24-24 24s-24-10.7-24-24V305.9l-31 31c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l72-72c9.4-9.4 24.6-9.4 33.9 0l72 72c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-31-31V408z" />
                            </svg>
                          </div>
                          <a className="Neon-input-choose-btn blue">
                            Drop files here or click to upload.
                          </a>
                        </div>
                      ) : (
                        <img
                          src={validation.values.transactionproof || NoImage}
                          alt="frontImage"
                          width="100%"
                          className="neon-img"
                        />
                      )}
                    </div>
                  </div>
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
                    disabled={isLoading}
                  >
                    {isLoading ? "Uploading..." : "Upload Payment"}
                  </button>
                </div>
              </div>
            </>
          )}
      </form>
    </>
  );
};
export default PaymentForm;
