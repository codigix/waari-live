import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { get, post } from "../../../../services/apiServices";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { removeFormData } from "../../../../store/actions/FormAction";
import { ToWords } from "to-words";
import BackButton from "../../common/BackButton";
const Paymentdetails = () => {
  const toWords = new ToWords({
    localeCode: 'en-IN',
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
      currencyOptions: { // can be used to override defaults for the selected locale
        name: 'Rupee',
        plural: 'Rupees',
        symbol: '₹',
        fractionalUnit: {
          name: 'Paisa',
          plural: 'Paise',
          symbol: '',
        },
      }
    }
  });
  const { discountDitails, guestDetails, appliedCoupon } = useSelector((state) => state.form?.formData);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [URLSearchParams, setURLSearchParams] = useSearchParams()
  const [guestId, setGuestId] = useState(URLSearchParams.get('guestId'));
  const [enqDetailCustomId, setEnqDetailCustomId] = useState(URLSearchParams.get('enquiryDetailCustomId'));
  const [guestCount, setGuestCoung] = useState(parseInt(URLSearchParams.get('guests')));
  const [destinationId, setDestinationId] = useState(parseInt(URLSearchParams.get('destinationId')));
  const [loyaltyPoints, setloyaltyPoints] = useState(parseInt(URLSearchParams.get('loyaltyPoints')));
  const [customEnqId, setCustomEnqId] = useState(id);
  const navigate = useNavigate();

  const [sameBillingName, setSameBillingName] = useState(false);
  const [sameAddress, setSameAddress] = useState(false);
  const [sameContact, setSameContact] = useState(false);

  const showSameBillingName = async (event) => {
    if (event.target.checked) {
      validation.setFieldValue("billingname", guestDetails[0]?.familyHeadName);
    } else {
      validation.setFieldValue("billingname", '');
    }
    setSameBillingName(!sameBillingName);
  };
  const showSameAddress = async (event) => {
    if (event.target.checked) {
      validation.setFieldValue("address", guestDetails[0]?.address);
    } else {
      validation.setFieldValue("address", '');
    }
    setSameAddress(!sameAddress);
  };
  const showSameContact = async (event) => {
    if (event.target.checked) {
      validation.setFieldValue("phoneno", guestDetails[0]?.contact);
    } else {
      validation.setFieldValue("phoneno", '');
    }
    setSameContact(!sameContact);
  };

  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    const textarea = document.getElementById("resizableTextarea");

    const adjustTextareaHeight = () => {
      textarea.style.height = "auto"; // Reset height to auto to get the actual scroll height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to the scroll height
    };

    textarea.addEventListener("input", adjustTextareaHeight);

    return () => {
      // Clean up the event listener when the component unmounts
      textarea.removeEventListener("input", adjustTextareaHeight);
    };
  }, []);
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      totaltourprice: Number(discountDitails?.grandtotal),
      billingname: "",
      address: "",
      phoneno: "",
      gstin: "",
      pan: "",
      paymentmode: "",
      onlinemode: "",
      bankname: "",
      chequeno: "",
      dateofpayment: "",
      transactionid: "",
      proof: "",
      balance: discountDitails?.grandtotal,
      amount: "",
    },
    validationSchema: Yup.object({
      totaltourprice: Yup.string(),
      billingname: Yup.string().required("Enter the Name"),
      address: Yup.string().required("Enter the Address"),
      pan: Yup.string()
        .min(10, "Pan card number must be at least 10 characters long")
        .max(10, "Pan card number must be at atmost 10 characters long").required("Enter the Pan Number"),
      paymentmode: Yup.string().required("Select Payment Mode"),
      onlinemode: Yup.string().when('paymentmode', {
        is: (mode) => mode == 1, // Apply validation when paymentMode is 'online'
        then: Yup.string().required("Select The Online Mode"),
        otherwise: Yup.string(),
      }),
      phoneno: Yup.string()
        .min(10, "Phone number must be at least 10 digits long")
        .max(10, "Phone number must be at atmost 10 digits long"),
      bankname: Yup.string().when('paymentmode', {
        is: (mode) => mode == 2, // Apply validation when paymentMode is 'online'
        then: Yup.string().required("Enter The Bank Name"),
        otherwise: Yup.string(),
      }),
      chequeno: Yup.string().when('paymentmode', {
        is: (mode) => mode == 2, // Apply validation when paymentMode is not 'online'
        then: Yup.string().required("Enter The Cheque No."),
        otherwise: Yup.string(),
      }),
      dateofpayment: Yup.string().required("Enter The Date of payment"),

      transactionproof: Yup.string().required("Enter The Transaction Proof"),
      transactionid: Yup.string().when('paymentmode', {
        is: (mode) => mode == 1, // Apply validation when paymentMode is 'online'
        then: Yup.string().required("Enter The Transaction Id"),
        otherwise: Yup.string(),
      }),
      amount: Yup.string().when('totaltourprice', {
        is: (vl) => parseFloat(vl) <= parseFloat(validation.values.amount),
        then: Yup.string().test({
          name: 'amount',
          message: 'Amount should be less than or equal to tour price',
          test: (value) => parseFloat(value) <= parseFloat(validation.values.totaltourprice),
        }),
      }).required("Enter The Amount"),
    }),

    onSubmit: async (values) => {
      // debugger;
      const data = {
        enquiryCustomId: customEnqId,
        customGuestDetails: guestDetails,
        enquiryDetailCustomId: enqDetailCustomId,
        points: discountDitails?.points,
        discountPrice: discountDitails?.discountprice,
        gst: discountDitails?.gst,
        tcs: discountDitails?.tcs,
        grandTotal: discountDitails?.grandtotal,
        billingName: values?.billingname,
        address: values?.address,
        phoneNo: values?.phoneno,
        gstIn: values?.gstin,
        panNo: values?.pan,
        advancePayment: values?.amount,
        balance: parseFloat(discountDitails?.grandtotal) - parseFloat(validation.values.amount),
        paymentModeId: values?.paymentmode,
        bankName: values?.bankname,
        chequeNo: values?.chequeno,
        payDate: values?.dateofpayment,
        transactionId: values?.transactionid,
        transactionProof: imageUrl,
        onlineTypeId: values?.onlinemode,
        couponId: appliedCoupon?.couponId
      }
      try {
        setIsLoading(true)
        const response = await post(`/custom-guest-details`, data)
        toast.success(response?.data?.message)
        navigate(`/customizedbooking/booking/${customEnqId}`)
        setIsLoading(false)
        dispatch(removeFormData())
      } catch (error) {
        setIsLoading(false)
        console.log(error)
      }
    },
  });

  const amountInWords = validation.values.amount ? toWords.convert(validation.values.amount, { currency: true }) : "-";



  // file upload start
  const url = import.meta.env.VITE_WAARI_BASEURL;
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoadingImage, setIsLoadingImages] = useState(false);

  const uploadFile = async (e) => {
    try {
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      setIsLoadingImages(true);

      const responseData = await axios.post(
        `
          ${url}/image-upload`,
        formData,
      );
      setIsLoadingImages(false);
      setImageUrl(responseData?.data?.image_url);
      validation.setFieldValue('transactionproof', e.target.files[0].name)
      toast.success("Image added successfully");
    } catch (error) {
      setIsLoadingImages(false);
      toast.error(error?.response?.data?.message || "something went wrong");
    }
  };


  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height: "34px", // Adjust the height to your preference
    }),
  };

  useEffect(() => {
    // While view farmer page is active, the yadi tab must also activated
    const pathArray = (window.location.href).split("/")
    const path = pathArray[pathArray.length - 1]
    let element = document.getElementById("customized-tour")
    if (element) {
      element.classList.add("mm-active1") // Add the 'active' class to the element
    }
    return () => {
      if (element) {
        element.classList.remove("mm-active1") // remove the 'active' class to the element when change to another page
      }
    }
  }, [])
  return (
    <div className="row">
      <div className="col-lg-12" style={{ paddingTop: '40px' }}>
        <div className="card">
          <div className="row page-titles mx-0 fixed-top-breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <BackButton />
              </li>
              <li className="breadcrumb-item active">
                <Link to="/customizedbooking/booking">Booking</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/customized-tour">Enquiry follow-up</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/payment-details">Payment Details</Link>
              </li>
            </ol>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="basic-form">
              <form
                className="needs-validation"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">
                      Grand Total Tour Price
                      <span className="error-star">*</span>
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="totaltourprice"
                      className="form-control"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.totaltourprice}
                      disabled
                    />
                  </div>
                </div>

                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">
                      Billing Name<span className="error-star">*</span>
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="billingname"
                      className="form-control"
                      required
                      onChange={
                        validation.handleChange
                      }
                      onBlur={validation.handleBlur}
                      value={
                        sameBillingName
                          ? guestDetails[0]?.familyHeadName
                          : validation.values.billingname
                      }
                    />
                    {validation.touched.billingname &&
                      validation.errors.billingname ? (
                      <span className="error">
                        {validation.errors.billingname}
                      </span>
                    ) : null}
                  </div>
                  <div className="col-sm-4">
                    <div className="form-check mb-2">
                      <input
                        onChange={showSameBillingName}
                        type="checkbox"
                        className="form-check-input"
                        id="check1"
                        value=""
                      />
                      <label className="form-check-label" htmlFor="check1">
                        Same as family head
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">Address<span className="error-star">*</span></label>
                  </div>
                  <div className="col-md-6">
                    <textarea
                      type="text"
                      name="address"
                      className="textarea"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={
                        sameAddress
                          ? guestDetails[0]?.address
                          : validation.values.address
                      }
                      id="resizableTextarea"
                    />
                    {validation.touched.address && validation.errors.address ? (
                      <span className="error">{validation.errors.address}</span>
                    ) : null}
                  </div>
                  <div className="col-sm-4">
                    <div className="form-check mb-2">
                      <input
                        onChange={showSameAddress}
                        type="checkbox"
                        className="form-check-input"
                        id="check2"
                        value=""
                      />
                      <label className="form-check-label" htmlFor="check2">
                        Same as family head
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">
                      Phone number
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="tel"
                      name="phoneno"
                      className="form-control"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={
                        sameContact
                          ? guestDetails[0]?.contact
                          : validation.values.phoneno
                      }
                    />
                  </div>
                  <div className="col-sm-4">
                    <div className="form-check mb-2">
                      <input
                        onChange={showSameContact}
                        type="checkbox"
                        className="form-check-input"
                        id="check3"
                        value=""
                      />
                      <label className="form-check-label" htmlFor="check3">
                        Same as family head
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">
                      GSTIN
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="gstin"
                      className="form-control"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.gstin}
                    />
                    {validation.touched.gstin && validation.errors.gstin ? (
                      <span className="error">{validation.errors.gstin}</span>
                    ) : null}
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">
                      PAN number
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="pan"
                      className="form-control"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pan}
                    />
                    {validation.touched.pan && validation.errors.pan ? (
                      <span className="error">{validation.errors.pan}</span>
                    ) : null}
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">
                      Payment mode<span className="error-star">*</span>
                    </label>
                  </div>
                  <div className="col-md-6">
                    {/* <Select
                      styles={customStyles}
                      className="basic-single"
                      classNamePrefix="select"
                      isLoading={isLoading}
                      isClearable={isClearable}
                      isSearchable={isSearchable}
                      name="paymentmode"
                      options={paymentmode}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.paymentmode}
                    /> */}
                    <Select
                      styles={customStyles}
                      className="basic-single"
                      classNamePrefix="select"
                      // isLoading={isLoading}
                      // isClearable={isClearable}
                      // isSearchable={isSearchable}
                      name="paymentmode"
                      options={paymentMode}
                      // onChange={validation.handleChange}
                      // onBlur={validation.handleBlur}
                      // value={validation.values.paymentmode}
                      onChange={(selectedOption) => {
                        validation.setFieldValue(
                          "paymentmode",
                          selectedOption ? selectedOption.value : ""
                        ); // Extract the 'value' property
                        validation.setFieldValue("transactionproof", "")
                      }}
                      onBlur={validation.handleBlur}
                      value={paymentMode.find(
                        (option) =>
                          option.value === validation.values.paymentmode
                      )}
                    />
                    {validation.touched.paymentmode &&
                      validation.errors.paymentmode ? (
                      <span className="error">
                        {validation.errors.paymentmode}
                      </span>
                    ) : null}
                  </div>
                </div>

                {validation.values.paymentmode == 1 && <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">Online Transaction<span className="error-star">*</span></label>
                  </div>
                  <div className="col-md-6">
                    <Select
                      styles={customStyles}
                      className="basic-single"
                      classNamePrefix="select"
                      name="onlinemode"
                      options={onlinemode}
                      onChange={(selectedOption) => {
                        validation.setFieldValue(
                          "onlinemode",
                          selectedOption ? selectedOption.value : ""
                        ); // Extract the 'value' property
                      }}
                      onBlur={validation.handleBlur}
                      value={onlinemode.find(
                        (option) => option.value === validation.values.onlinemode
                      )}
                    />
                    {validation.touched.onlinemode &&
                      validation.errors.onlinemode ? (
                      <span className="error">
                        {validation.errors.onlinemode}
                      </span>
                    ) : null}
                  </div>
                </div>}
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">
                      Amount<span className="error-star">*</span>
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="number"
                      name="amount"
                      className="form-control"
                      onChange={(e) => {
                        if (e.target.value == "") {
                          validation.setFieldValue('balance', parseFloat(discountDitails?.grandtotal))
                        } else {
                          validation.setFieldValue('balance', parseFloat(discountDitails?.grandtotal) - parseFloat(e.target.value))
                        }
                        validation.handleChange(e)
                      }
                      }
                      // onBlur={(e) => {
                      //   validation.setFieldValue('balance', parseFloat(discountDitails?.grandtotal) - parseFloat(e.target.value))
                      //   validation.blur(e)
                      // }
                      // }
                      value={validation.values.amount}
                    />
                    {validation.touched.amount && validation.errors.amount ? (
                      <span className="error">{validation.errors.amount}</span>
                    ) : null}
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">Amount(In words)</label>
                  </div>
                  <div className="col-md-6">
                    <input type="text" name="amount" className="form-control" value={amountInWords} disabled />
                  </div>
                </div>
                {(validation.values.paymentmode == 2) && <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">
                      Bank Name<span className="error-star">*</span>
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="bankname"
                      className="form-control"
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
                </div>}

                {validation.values.paymentmode == 2 && <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">
                      Cheque Number<span className="error-star">*</span>
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="chequeno"
                      className="form-control"
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
                </div>}

                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">
                      Date of payment<span className="error-star">*</span>
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="date"
                      name="dateofpayment"
                      className="form-control"
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
                {validation.values.paymentmode == 1 && <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">
                      Transaction ID<span className="error-star">*</span>
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="transactionid"
                      className="form-control"
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
                </div>}

                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">
                      Transaction Proof<span className="error-star">*</span>
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="file"
                      name="transactionproof"
                      className="form-control"
                      accept="image/*"
                      onChange={uploadFile}
                    />
                    {validation.touched.transactionproof && validation.errors.transactionproof ? (
                      <span className="error">{validation.errors.transactionproof}</span>
                    ) : null}
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">Balance</label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="number"
                      name="balance"
                      className="form-control"
                      value={
                        isNaN(validation.values.balance) ? 0 : parseFloat(validation.values.balance)?.toFixed(2)
                      }
                    />
                  </div>
                </div>
                <div className="mb-2 mt-2 row">
                  <div className="col-lg-12 d-flex justify-content-between">
                    <Link
                      to={`/discount-details/${customEnqId}?guestId=${guestId}&destinationId=${destinationId}&enquiryDetailCustomId=${enqDetailCustomId}&guests=${guestCount}&loyaltyPoints=${loyaltyPoints}`}
                      type="submit"
                      className="btn btn-back"
                    >
                      Back
                    </Link>
                    <button
                      type="submit"
                      className="btn btn-submit btn-primary"
                    >
                      submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paymentdetails;
