import { Link } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import { get } from "../../../../services/apiServices";
import CouponCard from "./CouponCard";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

function OfferPopup({ guestId, onClose, applyCoupon }) {
  const [couponsData, setCouponsData] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(false);

  const getAllCoupons = async () => {
    try {
      setCouponsLoading(true);
      const response = await get(`active-coupon-list?guestId=${guestId}`);
      setCouponsData(response?.data?.data);
      setCouponsLoading(false);
    } catch (error) {
      setCouponsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const message =
        "You have unsaved changes. Are you sure you want to leave?";
      event.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    getAllCoupons();
  }, []);
  return (
    <div>
      <h6 className="modal-h6">Offers</h6>
      <div>

        <div className="basic-card">
          {couponsLoading ? (
            <SkeletonTheme
              baseColor="#076fb00f"
              highlightColor="#076fb059"
              height={150}
              width={400}
            >
              <Skeleton count={2} />
            </SkeletonTheme>
          ) : (
            couponsData.length > 0 ? couponsData.map((coupon, index) => (
              <div key={coupon.couponId} className="basic-form">
                <CouponCard
                  coupon={coupon}
                  applyCoupon={applyCoupon}
                  onClose={onClose}
                />
              </div>
            )) : <div style={{fontWeight: "bold"}}>No Coupons Found</div>
          )}

        </div>
      </div>

      <div className="d-flex justify-content-center mt-3 mb-2">
        <button
          className="btn  pdf-btn filter-btn btn-sm "
          style={{ height: "32px", lineHeight: "1", margin: "0 10px 0 0" }}
          onClick={() => onClose(false)}
        >
          Close
        </button>
        {/* <button
          className="btn pdf-btn  btn-submit btn-sm"
          style={{ height: "32px", lineHeight: "1", margin: "0" }}
          onClick={() => onClose(true)}
        >
          Yes
        </button> */}
      </div>
    </div>
  );
}

export default OfferPopup;
