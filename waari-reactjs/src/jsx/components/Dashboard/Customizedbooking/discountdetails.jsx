import React, { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { updateFormData } from "../../../../store/actions/FormAction";
import { get } from "../../../../services/apiServices";
import PopupModal from "../Popups/PopupModal";
import OfferPopup from "./OfferPopup";
import BackButton from "../../common/BackButton";

const Discountdetails = () => {
  const formData = useSelector((state) => state);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [showOffer, setShowOffer] = useState(false);
  // const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [URLSearchParams, setURLSearchParams] = useSearchParams();
  const [guestId, setGuestId] = useState(URLSearchParams.get("guestId"));
  const [enqDetailCustomId, setEnqDetailCustomId] = useState(
    URLSearchParams.get("enquiryDetailCustomId")
  );
  const [guestCount, setGuestCoung] = useState(
    parseInt(URLSearchParams.get("guests"))
  );
  const [destinationId, setDestinationId] = useState(
    parseInt(URLSearchParams.get("destinationId"))
  );
  const [loyaltyPoints, setloyaltyPoints] = useState(
    parseInt(URLSearchParams.get("loyaltyPoints"))
  );

  const [customEnqId, setCustomEnqId] = useState(id);
  const navigate = useNavigate();

  // const [prevData, setPrevData] = useState([...location?.state?.id]);
  const [tourPrice, setTourPrice] = useState(
    formData?.form?.formData?.guestDetails?.reduce(
      (acc, obj) => acc + parseInt(obj.roomShareTypePrice),
      0
    )
  );

  // validation rules
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      tourprice: tourPrice ? tourPrice : "",
      points: "",
      discountprice: "",
      gst: "",
      tcs: "",
      grandtotal: "",
      couponDiscount: "",
      couponId: "",
    },
    validationSchema: Yup.object({
      tourprice: Yup.string(),
      points: Yup.string(),
      discountprice: Yup.string(),
      gst: Yup.string(),
      tcs: Yup.string(),
      grandtotal: Yup.string(),
    }),

    onSubmit: async (values) => {
      dispatch(
        updateFormData({
          guestDetails: formData.form.formData.guestDetails,
          discountDitails: values,
          appliedCoupon: formData.form.formData.appliedCoupon,
        })
      );
      navigate(
        `/payment-details/${customEnqId}?guestId=${guestId}&destinationId=${destinationId}&enquiryDetailCustomId=${enqDetailCustomId}&guests=${guestCount}&loyaltyPoints=${loyaltyPoints}`
      );
    },
  });

  // to show points available end
  const [isUserExist, setUserIsExist] = useState(false);
  //function with try catch
  const checkUserExists = async () => {
    try {
      const response = await get(`exists-user?guestId=${guestId}`);
      setUserIsExist(response.data.isExist);
    } catch (error) {
      setUserIsExist(false);
      console.log(error);
    }
  };

  useEffect(() => {
    checkUserExists();
  }, []);

  useEffect(() => {
    let disPer = 0;
    if (formData?.form?.formData?.appliedCoupon) {
      // debugger
      validation.setFieldValue("couponId", formData?.form?.formData?.appliedCoupon.couponId);
      // checking if coupon discount type is in Percentage
      if (Number(formData?.form?.formData?.appliedCoupon?.discountType) === 2) {
        const maxdiscount = formData?.form?.formData?.appliedCoupon?.maxDiscount;
        let pp = (tourPrice * Number(formData?.form?.formData?.appliedCoupon?.discountValue)) / 100; // 5% of tour price
        if (pp > maxdiscount) {
          disPer = tourPrice - maxdiscount;
          validation.setFieldValue("couponDiscount", maxdiscount);
        } else {
          disPer = tourPrice - pp;
          validation.setFieldValue("couponDiscount", pp);
        }

        // checking if coupon discount type is in Fixed value
      } else if (Number(formData?.form?.formData?.appliedCoupon?.discountType) === 1) {
        disPer = tourPrice - Number(formData?.form?.formData?.appliedCoupon?.discountValue);
        validation.setFieldValue(
          "couponDiscount",
          Number(formData?.form?.formData?.appliedCoupon?.discountValue)
        );
      }
    } else {
      disPer = tourPrice;
    }
    const discountprice = isNaN(disPer - validation.values.points)
      ? disPer
      : (disPer - validation.values.points).toFixed(2);

    validation.setFieldValue("discountprice", discountprice);

    const gstAmount = ((5 / 100) * discountprice).toFixed(2);
    const tcsAmount = (
      (5 / 100) *
      (Number(discountprice) + Number(gstAmount))
    ).toFixed(2);
    const totalAmount = (
      Number(discountprice) +
      Number(gstAmount) +
      (destinationId == 1 ? 0 : Number(tcsAmount))
    ).toFixed(2);
    validation.setFieldValue("gst", gstAmount);
    validation.setFieldValue("tcs", tcsAmount);
    validation.setFieldValue("grandtotal", Math.ceil(totalAmount));
  }, [validation.values.points, isUserExist, formData?.form?.formData?.appliedCoupon]);

  useEffect(() => {
    // While view farmer page is active, the yadi tab must also activated
    const pathArray = window.location.href.split("/");
    const path = pathArray[pathArray.length - 1];
    console.log(path);
    let element = document.getElementById("customized-tour");
    // console.log(element);
    if (element) {
      element.classList.add("mm-active1"); // Add the 'active' class to the element
    }
    return () => {
      if (element) {
        element.classList.remove("mm-active1"); // remove the 'active' class to the element when change to another page
      }
    };
  }, []);

  // to set Selected coupon in state
  const applyCoupon = (coupon) => {
    dispatch(
      updateFormData({
        guestDetails: formData.form.formData.guestDetails,
        appliedCoupon: coupon,
        discountDitails: formData.form.formData.discountDitails
      })
    );
    // setAppliedCoupon({ ...coupon });
  };


  // to close coupon offers popup
  const handleDialogClose = () => {
    setShowOffer(false);
  };

  return (
    <div className="row">
      {showOffer && (
        <PopupModal open={true} onDialogClose={handleDialogClose}>
          <OfferPopup
            guestId={guestId}
            onClose={handleDialogClose}
            applyCoupon={applyCoupon}
          />
        </PopupModal>
      )}
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
                <Link to="/discount-details">Discount Details</Link>
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
                <div className="row">
                  <div className="col-sm-3 mb-2">
                    <label className="text-label">Tour Price</label>
                  </div>
                  <div className="col-12 col-md-4 col-sm-6 mb-2">
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="number"
                        name="tourprice"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.tourprice}
                        disabled
                      />
                      {validation.touched.tourprice &&
                        validation.errors.tourprice ? (
                        <span className="error">
                          {validation.errors.tourprice}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-3 mb-2">
                    <label className="text-label">CouponDiscount</label>
                  </div>
                  <div className="col-12 col-md-4 col-sm-6 mb-2">
                    <div className="form-group">
                      <div className="d-flex">
                        <input
                          className="form-control"
                          type="number"
                          name="couponDiscount"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.couponDiscount}
                          disabled
                          style={{ width: "50%" }}
                        />
                        <button
                          type="button"
                          className="btn btn-back sw-btn-prev me-1"
                          style={{ marginLeft: "50px", fontWeight: 700 }}
                          onClick={() => {
                            setShowOffer(true);
                          }}
                        >
                          Offers
                        </button>
                      </div>
                      {validation.touched.couponDiscount &&
                        validation.errors.couponDiscount ? (
                        <span className="error">
                          {validation.errors.couponDiscount}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                {isUserExist && (
                  <div className="row">
                    <div className="col-sm-3 mb-2">
                      <label className="text-label">Points</label>
                    </div>
                    <div className="col-12 col-md-4 col-sm-6 mb-2">
                      <div className="form-group">
                        <input
                          className="form-control"
                          type="number"
                          name="points"
                          onChange={validation.handleChange}
                          onBlur={(e) => {
                            if (validation.values.points > loyaltyPoints) {
                              validation.setFieldValue("points", loyaltyPoints);
                            } else {
                              validation.setFieldValue(
                                "points",
                                e.target.value
                              );
                            }
                            validation.handleBlur(e);
                          }}
                          value={validation.values.points}
                          disabled={loyaltyPoints == 0}
                        />
                        {validation.touched.points &&
                          validation.errors.points ? (
                          <span className="error">
                            {validation.errors.points}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-sm-3">
                      <div className="form-check mb-2">
                        <label className="text-label">Points Available</label>
                        <input
                          type="text"
                          className="form-control"
                          disabled
                          value={
                            isNaN(parseFloat(validation.values.points))
                              ? loyaltyPoints
                              : loyaltyPoints -
                              parseFloat(validation.values.points)
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* {!isUserExist && (
                  <div className="row">
                    <div className="col-sm-3 mb-2">
                      <label className="text-label">First visit discount</label>
                    </div>
                    <div className="col-12 col-md-4 col-sm-6 mb-2">
                      <div className="form-group">
                        <input
                          className="form-control"
                          type="number"
                          name="discount"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.discount}
                          disabled
                        />
                        {validation.touched.discount &&
                        validation.errors.discount ? (
                          <span className="error">
                            {validation.errors.discount}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )} */}

                <div className="row">
                  <div className="col-sm-3 mb-2">
                    <label className="text-label">Discounted Price</label>
                  </div>
                  <div className="col-12 col-md-4 col-sm-6 mb-2">
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="number"
                        name="discountprice"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.discountprice}
                        disabled
                      />
                      {validation.touched.discountprice &&
                        validation.errors.discountprice ? (
                        <span className="error">
                          {validation.errors.discountprice}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-3 mb-2">
                    <label className="text-label">GST 5%</label>
                  </div>
                  <div className="col-12 col-md-4 col-sm-6 mb-2">
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="number"
                        name="gst"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.gst}
                        disabled
                      />
                      {validation.touched.gst && validation.errors.gst ? (
                        <span className="error">{validation.errors.gst}</span>
                      ) : null}
                    </div>
                  </div>
                </div>
                {destinationId == 2 && (
                  <div className="row">
                    <div className="col-sm-3 mb-2">
                      <label className="text-label">TCS</label>
                    </div>
                    <div className="col-12 col-md-4 col-sm-6 mb-2">
                      <div className="form-group">
                        <input
                          className="form-control"
                          type="number"
                          name="tcs"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.tcs}
                          disabled
                        />
                        {validation.touched.tcs && validation.errors.tcs ? (
                          <span className="error">{validation.errors.tcs}</span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}
                <div className="row">
                  <div className="col-sm-3 mb-2">
                    <label className="text-label">GRAND TOTAL</label>
                  </div>
                  <div className="col-12 col-md-4 col-sm-6 mb-2">
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="number"
                        name="grandtotal"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.grandtotal}
                        disabled
                      />
                      {validation.touched.grandtotal &&
                        validation.errors.grandtotal ? (
                        <span className="error">
                          {validation.errors.grandtotal}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="mb-2 mt-2 row">
                  <div className="col-lg-12 d-flex justify-content-start">
                    <Link
                      to={`/guest-details/${customEnqId}?guestId=${guestId}&destinationId=${destinationId}&enquiryDetailCustomId=${enqDetailCustomId}&guests=${guestCount}&loyaltyPoints=${loyaltyPoints}`}
                      type="submit"
                      className="btn btn-back"
                    >
                      Back
                    </Link>
                  </div>
                  <div className="col-lg-12 d-flex justify-content-end">
                    <button
                      type="submit"
                      className="btn btn-submit btn-primary"
                    >
                      Next
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

export default Discountdetails;
