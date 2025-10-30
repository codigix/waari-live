import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import _ from "lodash";
import { get, post } from "../../../../../services/apiServices";
import PopupModal from "../../Popups/PopupModal";
import OfferPopup from "../../Booking/OfferPopup";

const TourCost = ({
	familyHead,
	enquiryId,
	callbackOnSuccess,
	redirectForwandOnSuccess,
}) => {
	const [appliedCoupon, setAppliedCoupon] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const isObjectNotEmpty = !_.isEmpty(appliedCoupon);

	const [alreadyTourCostFilled, setAlreadyTourCostFilled] = useState(true);
	const [loyaltyPoints, setLoyaltyPoints] = useState(true);

	// this if for setting selected applied coupon
	const applyCoupon = (coupon) => {
		setAppliedCoupon({ ...coupon });

		validation.setFieldValue("couponId", coupon.couponId);
	};

	const validation = useFormik({
		// enableReinitialize : use this flag when initial values needs to be changed
		enableReinitialize: true,

		initialValues: {
			tourPrice: "",
			points: parseFloat(familyHead?.loyaltyPoints) == 0 && 0,
			discountprice: "",
			gst: "",
			tcs: "",
			grandtotal: "",
			couponDiscount: "",
			couponId: "",
		},
		validationSchema: Yup.object({
			tourPrice: Yup.string().required("Enter the Tour Price"),
			discountprice: Yup.string().required("Enter the Discount Prices"),
			gst: Yup.string().required("Enter the GST"),
			tcs: Yup.string().when([], {
				is: () => familyHead.destinationId === 2,
				then: Yup.string().required("Tcs is required"),
				otherwise: Yup.string(),
			}),
			grandtotal: Yup.string().required("Enter the Grandtotal"),
		}),

		onSubmit: async (values) => {
			// send data to api

			const data = {
				enquiryGroupId: enquiryId,
				familyHeadGtId: familyHead.familyHeadGtId,
				couponId: values.couponId,
				points: values.points,
			};

			try {
				setIsSubmitting(true);
				const response = await post(`/tour-cost-gt`, data);

				callbackOnSuccess(redirectForwandOnSuccess);

				setIsSubmitting(false);

				toast.success(response?.data?.message);
			} catch (error) {
				setIsSubmitting(false);
				console.log(error);
			}
		},
	});

	const getTourCostDetails = async () => {
		try {
			const response = await get(
				`/get-tour-cost-gt?familyHeadGtId=${familyHead.familyHeadGtId}&enquiryGroupId=${enquiryId}&guestId=${familyHead?.guestId}`
			);

			const data = response.data?.data;

			setAlreadyTourCostFilled(data.isTourCostSubmitted);

			setLoyaltyPoints(data?.loyaltyPoints);

			// set data for all fields

			validation.setFieldValue("tourPrice", Math.ceil(data.tourPrice) || "");
			validation.setFieldValue("points", data.points || "");
			validation.setFieldValue("discountprice", data.discountprice || "");
			validation.setFieldValue("gst", data.gst || "");
			validation.setFieldValue("tcs", data.tcs || "");
			validation.setFieldValue("grandtotal", data.grandtotal || "");
			validation.setFieldValue("couponDiscount", data.couponDiscount || "");
			validation.setFieldValue("couponId", data.couponId || "");
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getTourCostDetails();
	}, []);

	const getAppliedCouponDetails = async () => {
		try {
			const response = await get(
				`/get-coupon-uses-gt?guestId=${familyHead.guestId}&enquiryGroupId=${enquiryId}`
			);

			const data = response.data?.data;

			// set data for all fields
			setAppliedCoupon(data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getAppliedCouponDetails();
	}, []);

	const [isUserExist, setUserIsExist] = useState(false);
	const [showOffer, setShowOffer] = useState(false);

	const guestId = familyHead.guestId;
	//function with try catch
	const checkUserExists = async () => {
		try {
			const response = await get(`exists-user?guestId=${familyHead?.guestId}`);
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
		if (isObjectNotEmpty) {
			// debugger
			validation.setFieldValue("couponId", appliedCoupon.couponId);
			// checking if coupon discount type is in Percentage
			if (Number(appliedCoupon?.discountType) === 2) {
				const maxdiscount = appliedCoupon?.maxDiscount;

				let pp =
					(validation.values?.tourPrice *
						Number(appliedCoupon?.discountValue)) /
					100; // 5% of tour price
				if (pp > maxdiscount) {
					disPer = validation.values?.tourPrice - maxdiscount;
					validation.setFieldValue("couponDiscount", maxdiscount);
				} else {
					disPer = validation.values?.tourPrice - pp;
					validation.setFieldValue("couponDiscount", pp);
				}

				// checking if coupon discount type is in Fixed value
			} else if (Number(appliedCoupon?.discountType) === 1) {
				disPer =
					validation.values?.tourPrice - Number(appliedCoupon?.discountValue);
				validation.setFieldValue(
					"couponDiscount",
					Number(appliedCoupon?.discountValue)
				);
			}
		} else {
			disPer = validation.values?.tourPrice;
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
			(familyHead.destinationId == 1 ? 0 : Number(tcsAmount))
		).toFixed(2);
		validation.setFieldValue("gst", gstAmount);
		validation.setFieldValue("tcs", tcsAmount);
		validation.setFieldValue("grandtotal", Math.ceil(totalAmount));
	}, [
		validation.values.points,
		validation.values.tourPrice,
		isUserExist,
		appliedCoupon,
	]);

	const handleDialogClose = () => {
		setShowOffer(false);
	};

	const handlePointsChange = (event) => {
		const points = event.target.value;

		if (points > parseFloat(familyHead?.loyaltyPoints)) {
			validation.setFieldError(
				"points",
				"Cannot use more than available loyalty points"
			);
		} else if (points > 10000) {
			validation.setFieldError(
				"points",
				"Cannot use more than 10,000 points at one time"
			);
		} else {
			validation.setFieldError("points", "");
			validation.handleChange(event); // Move handleChange inside the else block
		}
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
				className="needs-validation pt-2"
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
							<div className="d-flex" style={{ gap: "4px" }}>
								<input
									className="form-control"
									type="number"
									name="tourPrice"
									onChange={validation.handleChange}
									onBlur={validation.handleBlur}
									value={validation.values.tourPrice}
									disabled
								/>
								<button
									type="button"
									className="btn btn-back sw-btn-prev me-1"
									style={{ fontWeight: "700" }}
									onClick={() => {
										setShowOffer(true);
									}}
								>
									Offers
								</button>
							</div>
							{validation.touched.tourPrice && validation.errors.tourPrice ? (
								<span className="error">{validation.errors.tourPrice}</span>
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
									onChange={handlePointsChange}
									value={validation.values.points}
									disabled={parseFloat(familyHead?.loyaltyPoints) == 0}
								/>
								<span className="error">{validation.errors.points}</span>
							</div>
						</div>
						<div className="col-sm-5">
							<div className="row mb-2">
								<label className="text-label col-sm-4">Points Available</label>
								<div className="col-sm-8">
									<input
										type="text"
										className="form-control"
										disabled
										value={
											alreadyTourCostFilled
												? parseFloat(loyaltyPoints).toFixed(2)
												: isNaN(parseFloat(validation.values.points))
												? parseFloat(familyHead?.loyaltyPoints).toFixed(2)
												: (
														parseFloat(familyHead?.loyaltyPoints) -
														parseFloat(validation.values.points)
												  ).toFixed(2)
										}
									/>
								</div>
							</div>
						</div>
					</div>
				)}
				{isObjectNotEmpty && (
					<div className="row">
						<div className="col-sm-3 mb-2">
							<label className="text-label">Coupon Discount</label>
						</div>
						<div className="col-12 col-md-4 col-sm-6 mb-2">
							<div className="form-group">
								<div className="d-flex" style={{ gap: "4px" }}>
									<input
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
											fontWeight: "900",
											color: "black",
											width: "auto",
											whiteSpace: "nowrap",
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
				{familyHead.destinationId == 2 && (
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
								className="form-control grand-price"
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

				{alreadyTourCostFilled ? (
					""
				) : (
					<div className="text-end toolbar d-flex justify-content-end toolbar-bottom p-2">
						<button
							className="btn btn-primary sw-btn-next ms-1 btn-submit"
							type="submit"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Saving..." : "Save"}
						</button>
					</div>
				)}
			</form>
		</section>
	);
};

export default TourCost;
