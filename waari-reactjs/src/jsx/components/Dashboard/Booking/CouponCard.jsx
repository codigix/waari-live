import "./coupon-card.css";
import logo from "../../../../assets/images/logo.png";

const CouponCard = ({ coupon, applyCoupon, onClose }) => {
  const handleApply = () => {
    applyCoupon(coupon);
    onClose();
  };

  return (
    <>
      <div className="coupon-container">
        <div className="coupon-card">
          <img src={logo} className="logo" />
          <h3>
            {Number(coupon?.discountValue)?.toFixed(2)}
            {Number(coupon.discountType) === 1 ? " Rs" : " %"} flat off
          </h3>
          <div className="coupon-row">
            <span id="cpnCode">{coupon?.couponName}</span>
            <button id="cpnBtn" onClick={handleApply}>
              Apply Code
            </button>
          </div>

          <p>Valid Till: {coupon.toDate}</p>
          <div className="circle1"></div>
          <div className="circle2"></div>
        </div>
      </div>
    </>
  );
};

export default CouponCard;
