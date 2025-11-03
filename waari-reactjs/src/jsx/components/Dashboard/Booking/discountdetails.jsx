import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { get } from "../../../../services/apiServices";
import PopupModal from "../Popups/PopupModal";
import OfferPopup from "./OfferPopup";

const StepThree = ({
  tourPrice,
  moveToStep3,
  updateData4,
  moveToStep2,
  destinationId,
  guestData,
  sharedData,
  appliedCoupon,
  applyCoupon
}) => {

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      tourprice: tourPrice ? Math.ceil(tourPrice) : "",
      points: parseFloat(guestData?.loyaltyPoints) == 0 && 0,
      discountprice: "",
      gst: "",
      tcs: "",
      grandtotal: "",
      couponDiscount: "",
      couponId: ""
    },
    validationSchema: Yup.object({
      tourprice: Yup.string().required("Enter the Tour Price"),
      discountprice: Yup.string().required("Enter the Discount Prices"),
      gst: Yup.string().required("Enter the GST"),
      tcs: Yup.string().when([], {
        is: () => destinationId === 2,
        then: Yup.string().required("Tcs is required"),
        otherwise: Yup.string(),
      }),
      grandtotal: Yup.string().required("Enter the Grandtotal"),
    }),

    onSubmit: async (values) => {
      updateData4(values);
      moveToStep3();
    },
  });


  const [isUserExist, setUserIsExist] = useState(false);
  const [showOffer, setShowOffer] = useState(false);

  // console.log("Discount Details Data", validation.values);

  const guestId = sharedData?.guestDetails[0].guestId;
  //function with try catch
  const checkUserExists = async () => {
    try {
      const response = await get(`exists-user?guestId=${guestData?.guestId}`);
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
    if (appliedCoupon) {
      // debugger
      validation.setFieldValue("couponId", appliedCoupon.couponId)
      // checking if coupon discount type is in Percentage
      if (Number(appliedCoupon?.discountType) === 2) {
        const maxdiscount = appliedCoupon?.maxDiscount;
        let pp = (tourPrice * Number(appliedCoupon?.discountValue)) / 100; // 5% of tour price
        if (pp > maxdiscount) {
          disPer = tourPrice - maxdiscount;
          validation.setFieldValue("couponDiscount", maxdiscount);
        } else {
          disPer = tourPrice - pp;
          validation.setFieldValue("couponDiscount", pp);
        }

        // checking if coupon discount type is in Fixed value
      } else if (Number(appliedCoupon?.discountType) === 1) {
        disPer = tourPrice - Number(appliedCoupon?.discountValue);
        validation.setFieldValue(
          "couponDiscount",
          Number(appliedCoupon?.discountValue)
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
    validation.setFieldValue("grandtotal",  Math.ceil(totalAmount));
  }, [validation.values.points, isUserExist, appliedCoupon]);

  const handleDialogClose = () => {
    setShowOffer(false);
  };

  return (
    <section>
      {showOffer && (
        <PopupModal open={true} onDialogClose={handleDialogClose}>
          <OfferPopup
            guestId={guestId}
            onClose={handleDialogClose}
            applyCoupon={applyCoupon}
          />
        </PopupModal>
      )}
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
              <div className="d-flex">
                <input
                  className="form-control"
                  type="number"
                  name="tourprice"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.tourprice}
                  disabled
                  style={{ width: "50%" }}
                />
                <button
                  type="button"
                  className="btn btn-back sw-btn-prev me-1"
                  style={{marginLeft: "50px", fontWeight: 700}}
                  onClick={() => {
                    setShowOffer(true);
                  }}
                >
                  Offers
                </button>
              </div>
              {validation.touched.tourprice && validation.errors.tourprice ? (
                <span className="error">{validation.errors.tourprice}</span>
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
                    if (
                      validation.values.points >
                      parseFloat(guestData?.loyaltyPoints)
                    ) {
                      validation.setFieldValue(
                        "points",
                        parseFloat(guestData?.loyaltyPoints)
                      );
                    } else {
                      validation.setFieldValue("points", e.target.value);
                    }
                    validation.handleBlur(e);
                  }}
                  value={validation.values.points}
                  disabled={parseFloat(guestData?.loyaltyPoints) == 0}
                />
                {validation.touched.points && validation.errors.points ? (
                  <span className="error">{validation.errors.points}</span>
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
                      ? parseFloat(guestData?.loyaltyPoints)
                      : parseFloat(guestData?.loyaltyPoints) -
                        parseFloat(validation.values.points)
                  }
                />
              </div>
            </div>
          </div>
        )}
        {appliedCoupon && (
          <div className="row">
            <div className="col-sm-3 mb-2">
              <label className="text-label">Coupon Discount</label>
            </div>
            <div className="col-12 col-md-4 col-sm-6 mb-2">
              <div className="form-group">
                <div className="d-flex">
                  <input
                    style={{ width: "50%" }}
                    className="form-control"
                    type="number"
                    name="couponDiscount"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.couponDiscount}
                    disabled
                  />
                  <span
                    style={{
                      marginLeft: "50px",
                      fontWeight: "900",
                      color: "black",
                    }}
                    className="btn btn-success"
                  >
                    {appliedCoupon.couponName}
                  </span>
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
        )}
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
                <span className="error">{validation.errors.discountprice}</span>
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
              {validation.touched.grandtotal && validation.errors.grandtotal ? (
                <span className="error">{validation.errors.grandtotal}</span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="text-end toolbar d-flex justify-content-between toolbar-bottom p-2">
          <button
            type="button"
            className="btn btn-back sw-btn-prev me-1"
            onClick={() => moveToStep2(1)}
          >
            Prev
          </button>
          <button
            className="btn btn-primary sw-btn-next ms-1 btn-submit"
            // onClick={() => setGoSteps(2)}
            type="submit"
          >
            Next
          </button>
        </div>
      </form>
    </section>
  );
};

export default StepThree;
