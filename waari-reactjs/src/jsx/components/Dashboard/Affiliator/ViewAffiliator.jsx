import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { get, post } from "../../../../services/apiServices";
import { NoImage } from "../../../utils/assetsPaths";
import BackButton from "../../common/BackButton";
const url = import.meta.env.VITE_WAARI_BASEURL;

const validationSchema = Yup.object().shape({
	// Personal Details
	firstName: Yup.string().required("First Name is required"),
	lastName: Yup.string().required("Last Name is required"),
	address: Yup.string().required("Address is required"),
	email: Yup.string().email("Invalid email").required("Please enter the email"),
	phoneNo: Yup.string()
		.matches(/^\d+$/, "Contact number must be numeric")
		.min(10, "Contact must be at least 10 digits long")
		.required("Please enter the Contact Number")
		.max(10, "Contact must be at at most 10 digits long")
		.required("Contact is required"),
	role: Yup.object().required("Role is required"), //1-influencer,2-affiliator

	// Affiliate Details Fields
	commissionValue: Yup.string().when("commissionType", {
		is: (commissionType) => commissionType == 2,
		then: Yup.string()
			.required("Enter The Commission Percentage")
			.matches(
				/^[0-9]{1,3}$/,
				"Commission Percentage must be between 0 and 100"
			)
			.test(
				"max",
				"Commission Percentage must be between 0 and 100",
				(value) => parseInt(value, 10) <= 100
			),
		otherwise: Yup.string().when("commissionType", {
			is: (commissionType) => commissionType == 1,
			then: Yup.string().required("Enter The Commission Amount"),
			otherwise: Yup.string()
				.required("Enter The Commission Amount")
				.max(100)
				.default(1),
		}),
	}),
	maxCommission: Yup.string().when("commissionType", {
		is: (commissionType) => commissionType?.value == 1,
		then: Yup.string().nullable().required("Enter The Max Commission Amount"),
		// otherwise: Yup.string(),
	}),

	accName: Yup.string()
		.required("Account name is required")
		.matches(/^[a-zA-Z\s]+$/, "Invalid Account name"),
	accNo: Yup.string()
		.required("Account number is required")
		.matches(/^\d{9,18}$/, "Account number must be 9 to 18 digits"),
	bankName: Yup.string()
		.required("Bank name is required")
		.matches(/^[a-zA-Z\s]+$/, "Invalid Bank name"),
	branch: Yup.string()
		.required("Branch name is required")
		.matches(/^[a-zA-Z\s]+$/, "Invalid Branch name"),
	ifsc: Yup.string()
		.required("IFSC code is required")
		.matches(/^[A-Za-z]{4}\d{7}$/, "Invalid IFSC code. Format: ABCD0123456"),
	cheque: Yup.string(),

	// Coupon Fields
	couponName: Yup.string().required("Coupon Name is required"),
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

	// social media links fields
	fbLink: Yup.string().url("Invalid URL format"),
	instagramLink: Yup.string().url("Invalid URL format"),
	twitterLink: Yup.string().url("Invalid URL format"),
	otherLink: Yup.string().url("Invalid URL format"),
});

const initialValues = {
	firstName: "",
	lastName: "",
	address: "",
	email: "",
	password: "",
	confirmPassword: "",
	phoneNo: "",
	role: null, //1-influence,2-affiliator

	commissionType: 1,
	commissionValue: "",
	maxCommission: 0,

	accName: "",
	accNo: "",
	bankName: "",
	branch: "",
	ifsc: "",
	cheque: "",

	couponName: "",
	fromDate: "",
	toDate: "",
	discountType: "",
	discountValue: "",
	maxDiscount: 0,
	isType: "",

	fbLink: "",
	instagramLink: "",
	twitterLink: "",
	otherLink: "",
};

const ViewAffiliator = () => {
	const { id } = useParams();

	// Get users data from api
	const getUsersDetails = async () => {
		try {
			const result = await get(`view-influencer-affiliate?id=${id}`);
			const {
				firstName,
				lastName,
				address,
				email,
				phoneNo,
				role, //1-influence,2-affiliator

				commissionValue,
				commissionType,
				maxCommission,

				accName,
				accNo,
				bankName,
				branch,
				ifsc,
				cheque,

				couponName,
				fromDate,
				toDate,
				discountType,
				discountValue,
				maxDiscount,
				isType,

				fbLink,
				instagramLink,
				twitterLink,
				otherLink,
			} = result?.data?.data;

			formik.setFieldValue("firstName", firstName);
			formik.setFieldValue("lastName", lastName);
			formik.setFieldValue("email", email);
			formik.setFieldValue("phoneNo", phoneNo);
			
			const roleIdOption = options.find((item) => item.value == role);
			formik.setFieldValue("role", roleIdOption);
			formik.setFieldValue("address", address);

			formik.setFieldValue("commissionType", commissionType);
			formik.setFieldValue(
				"commissionValue",
				Number(commissionValue).toFixed()
			);
			formik.setFieldValue("maxCommission", Number(maxCommission).toFixed());

			formik.setFieldValue("accName", accName);
			formik.setFieldValue("accNo", accNo);
			formik.setFieldValue("bankName", bankName);
			formik.setFieldValue("branch", branch);
			formik.setFieldValue("ifsc", ifsc);
			formik.setFieldValue("cheque", cheque || "");
			formik.setFieldValue("couponName", couponName);
			formik.setFieldValue("fromDate", fromDate);
			formik.setFieldValue("toDate", toDate);
			formik.setFieldValue("discountType", discountType);
			formik.setFieldValue("discountValue", Number(discountValue).toFixed());
			formik.setFieldValue("maxDiscount", Number(maxDiscount).toFixed());
			formik.setFieldValue("isType", isType);
			formik.setFieldValue("fbLink", fbLink || "-");
			formik.setFieldValue("instagramLink", instagramLink || "-");
			formik.setFieldValue("twitterLink", twitterLink || "-");
			formik.setFieldValue("otherLink", otherLink || "-");
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getUsersDetails();
	}, []);

	const options = [
		{ value: "1", label: "Influencer" },
		{ value: "2", label: "Affiliator" },
	];

	const customStyles = {
		control: (provided, state) => ({
			...provided,
			height: "34px", // Adjust the height to your preference
		}),
	};

	// this hook is for form validation
	const formik = useFormik({
		initialValues,
		validationSchema,
	});

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
								<li className="breadcrumb-item  ">
									<Link to="/affiliator-influencers">Affiliator</Link>
								</li>

								<li className="breadcrumb-item  ">
									<Link to={"/view-affiliator/" + id}>View Affiliator</Link>
								</li>
							</ol>
						</div>
					</div>
					<div className="card">
						<div className="card-body">
							<div className="basic-form">
								<form className="needs-validation">
									<div
										className="card-header mb-2 pt-0"
										style={{ paddingLeft: "0" }}
									>
										<div className="card-title h5">View Affiliator</div>
									</div>
									<div className="row">
										<div className="mb-2  col-md-4 col-lg-4 col-sm-6 col-12">
											<label className="form-label">
												First Name<span className="error-star">*</span>
											</label>
											<input
												className="form-control"
												name="firstName"
												value={formik.values.firstName}
												disabled
											/>
										</div>

										<div className="mb-2 col-md-4 col-lg-4 col-sm-6 col-12">
											<label className="form-label">
												Last Name<span className="error-star">*</span>
											</label>
											<input
												className="form-control"
												name="lastName"
												value={formik.values.lastName}
												disabled
											/>
										</div>

										<div className="mb-2  col-md-4 col-lg-4 col-sm-6 col-12">
											<label className="form-label">
												Roles<span className="error-star">*</span>
											</label>
											<Select
												isDisabled
												className="basic-single"
												classNamePrefix="select"
												isSearchable={true}
												name="role"
												value={formik.values.role}
												options={options}
											/>
										</div>

										<div className="mb-2 col-md-3 col-lg-3 col-sm-6 col-12">
											<label className="form-label">
												Email Id<span className="error-star">*</span>
											</label>
											<input
												type="email"
												className="form-control"
												name="email"
												value={formik.values.email}
												disabled
											/>
										</div>

										<div className="mb-2  col-md-3 col-lg-3 col-sm-6 col-12">
											<label className="form-label">
												Contact Number<span className="error-star">*</span>
											</label>
											<input
												type="tel"
												className="form-control"
												name="phoneNo"
												minLength={10}
												maxLength={10}
												value={formik.values.phoneNo}
												disabled
											/>
										</div>

										<div className="col-md-6 col-lg-6 col-sm-6 col-12">
											<div className="mb-2">
												<label>
													Address<span className="error-star">*</span>
												</label>
												<textarea
													className="textarea"
													id="address"
													name="address"
													value={formik.values.address}
													disabled
												></textarea>
											</div>
										</div>

										<div className="card-header card-header-title">
											<div className="card-title h5">
												Affiliate Coupon Code Details
											</div>
										</div>

										<div className="col-md-3 col-lg-3 col-sm-6 col-12">
											<div className="mb-2">
												<label>
													Coupon Name<span className="error-star">*</span>
												</label>
												<input
													id="couponName"
													name="couponName"
													className="form-control"
													value={formik.values.couponName}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													disabled
												/>
											</div>
										</div>

										<div className="col-md-3 col-lg-3 col-sm-6 col-12">
											<div className="mb-3">
												<label className="form-label">Coupon For</label>
												<div className="d-flex" style={{ gap: "10px" }}>
													<div
														className="filled-in chk-col-primary d-flex"
														style={{ alignContent: "center" }}
													>
														<input
															className="form-check-input"
															type="radio"
															name="isType"
															id="allUsers"
															value={1}
															checked={formik.values.isType == 1}
															onChange={formik.handleChange}
															style={{ marginRight: "3px" }}
															disabled
														/>
														<label
															className="form-check-label m-0"
															htmlFor="allUsers"
														>
															All Users
														</label>
													</div>
													<div
														className="filled-in chk-col-primary d-flex"
														style={{ alignContent: "center" }}
													>
														<input
															className="form-check-input"
															type="radio"
															name="isType"
															id="newUsers"
															value={2}
															checked={formik.values.isType == 2}
															onChange={formik.handleChange}
															style={{ marginRight: "3px" }}
															disabled
														/>
														<label
															className="form-check-label m-0"
															htmlFor="newUsers"
														>
															New Users
														</label>
													</div>
												</div>
											</div>
										</div>

										<div className="col-md-3 col-lg-3 col-sm-6 col-12">
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
													value={formik.values.fromDate}
													disabled
												/>
											</div>
										</div>

										<div className="col-md-3 col-lg-3 col-sm-6 col-12">
											<div className="mb-2">
												<label>
													Coupon Validity to
													<span className="error-star">*</span>
												</label>
												<input
													type="date"
													id="toDate"
													name="toDate"
													min={
														formik.values.fromDate &&
														new Date(formik.values.fromDate)
															.toISOString()
															.split("T")[0]
													}
													className="form-control"
													value={formik.values.toDate}
													disabled
												/>
											</div>
										</div>

										<div className="card-header card-header-title">
											<div className="card-title h5">
												Guest Discount Details
											</div>
										</div>

										<div className="col-md-3 col-lg-3 col-sm-6 col-12">
											<div className="mb-3">
												<label className="form-label">Discount Type</label>
												<div className="d-flex" style={{ gap: "10px" }}>
													<div
														className="filled-in chk-col-primary d-flex"
														style={{ alignContent: "center" }}
													>
														<input
															className="form-check-input"
															type="radio"
															name="discountType"
															id="fixed"
															value={1}
															checked={formik.values.discountType == 1}
															onChange={formik.handleChange}
															style={{ marginRight: "3px" }}
															disabled
														/>
														<label
															className="form-check-label m-0"
															htmlFor="fixed"
														>
															Fixed
														</label>
													</div>
													<div
														className="filled-in chk-col-primary  d-flex "
														style={{ alignContent: "center" }}
													>
														<input
															className="form-check-input"
															type="radio"
															name="discountType"
															id="percentage"
															value={2}
															checked={formik.values.discountType == 2}
															onChange={formik.handleChange}
															style={{ marginRight: "3px" }}
															disabled
														/>
														<label
															className="form-check-label m-0"
															htmlFor="percentage"
														>
															Percentage
														</label>
													</div>
												</div>
											</div>
										</div>

										<div className="col-md-3 col-lg-3 col-sm-6 col-12">
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
													disabled
												/>
											</div>
										</div>

										{formik.values.discountType == 2 && (
											<div className="col-md-3 col-lg-3 col-sm-6 col-12">
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
														disabled
													/>
												</div>
											</div>
										)}

										<div className="card-header card-header-title">
											<div className="card-title h5">
												Affilate Commission Details
											</div>
										</div>

										<div className="col-md-3 col-lg-3 col-sm-6 col-12">
											<div className="mb-3">
												<label className="form-label">Commission Type</label>
												<div className="d-flex" style={{ gap: "10px" }}>
													<div
														className="filled-in chk-col-primary d-flex"
														style={{ alignContent: "center" }}
													>
														<input
															className="form-check-input"
															type="radio"
															name="commissionType"
															id="commissionFixed"
															value={1}
															checked={formik.values.commissionType == 1}
															onChange={formik.handleChange}
															style={{ marginRight: "3px" }}
															disabled
														/>
														<label
															className="form-check-label m-0"
															htmlFor="commissionFixed"
														>
															Fixed
														</label>
													</div>
													<div
														className="filled-in chk-col-primary  d-flex "
														style={{ alignContent: "center" }}
													>
														<input
															className="form-check-input"
															type="radio"
															name="commissionType"
															id="commissionPercentage"
															value={2}
															checked={formik.values.commissionType == 2}
															onChange={formik.handleChange}
															style={{ marginRight: "3px" }}
															disabled
														/>
														<label
															className="form-check-label m-0"
															htmlFor="commissionPercentage"
														>
															Percentage
														</label>
													</div>
												</div>
											</div>
										</div>

										<div className="col-md-3 col-lg-3 col-sm-6 col-12">
											<div className="mb-2">
												<label>
													Commission Amount<span className="error-star">*</span>
												</label>
												<input
													id="commissionValue"
													name="commissionValue"
													type="number"
													className="form-control"
													value={formik.values.commissionValue}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													disabled
												/>
											</div>
										</div>

										{formik.values.commissionType == 2 && (
											<div className="col-md-3 col-lg-3 col-sm-6 col-12">
												<div className="mb-2">
													<label>
														Max Commission<span className="error-star">*</span>
													</label>
													<input
														id="maxCommission"
														name="maxCommission"
														type="number"
														className="form-control"
														value={formik.values.maxCommission}
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														disabled
													/>
												</div>
											</div>
										)}

										<div className="card-header card-header-title">
											<div className="card-title h5">
												Affilate (banking) Details
											</div>
										</div>

										<div className="col-md-4 col-lg-3 col-sm-6 col-12">
											<div className="mb-2">
												<label>
													A/C Name<span className="error-star">*</span>
												</label>
												<input
													id="accName"
													name="accName"
													className="form-control"
													value={formik.values.accName}
													disabled
												/>
											</div>
										</div>

										<div className="col-md-4 col-lg-3 col-sm-6 col-12">
											<div className="mb-2">
												<label>
													A/C No<span className="error-star">*</span>
												</label>
												<input
													id="accNo"
													name="accNo"
													className="form-control"
													value={formik.values.accNo}
													disabled
												/>
											</div>
										</div>

										<div className="col-md-4 col-lg-2 col-sm-6 col-12">
											<div className="mb-2">
												<label>
													Bank Name<span className="error-star">*</span>
												</label>
												<input
													id="bankName"
													name="bankName"
													className="form-control"
													value={formik.values.bankName}
													disabled
												/>
											</div>
										</div>

										<div className="col-md-4 col-lg-2 col-sm-6 col-12 ">
											<div className="mb-2">
												<label>
													Branch<span className="error-star">*</span>
												</label>
												<input
													id="branch"
													name="branch"
													className="form-control"
													value={formik.values.branch}
													disabled
												/>
											</div>
										</div>

										<div className="col-md-4 col-lg-2 col-sm-6 col-12">
											<div className="mb-2">
												<label>
													IFSC<span className="error-star">*</span>
												</label>
												<input
													id="ifsc"
													name="ifsc"
													className="form-control"
													value={formik.values.ifsc}
													disabled
												/>
											</div>
										</div>

										<div className="col-md-7 col-lg-7 col-sm-12  col-12">
											<label className="text-label">
												Upload Cheque<span className="error-star"></span>
											</label>
											<div className="col-md-12">
												<div className="Neon Neon-theme-dragdropbox">
													<input
														className="file_upload"
														name={`cheque`}
														accept="image/*"
														id="filer_input2"
														type="file"
														disabled
													/>
													<div className="Neon-input-dragDrop">
														{formik.values.cheque?.length == 0 ? (
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
																src={formik.values.cheque}
																alt="frontImage"
																width="100%"
																className="neon-img"
															/>
														)}
													</div>
												</div>
											</div>
										</div>

										<div className="card-header card-header-title">
											<div className="card-title h5">Social Media Links</div>
										</div>

										<div className="mb-2 col-md-4 col-lg-4 col-sm-6 col-12">
											<label className="form-label">
												Facebook<span className="error-star"></span>
											</label>
											<input
												className="form-control"
												name="fbLink"
												value={formik.values.fbLink}
												disabled
											/>
										</div>

										<div className="mb-2 col-md-4 col-lg-4 col-sm-6 col-12">
											<label className="form-label">
												Instagram<span className="error-star"></span>
											</label>
											<input
												className="form-control"
												name="instagramLink"
												value={formik.values.instagramLink}
												disabled
											/>
										</div>

										<div className="mb-2 col-md-4 col-lg-4 col-sm-6 col-12">
											<label className="form-label">
												Twitter<span className="error-star"></span>
											</label>
											<input
												className="form-control"
												name="twitterLink"
												value={formik.values.twitterLink}
												disabled
											/>
										</div>

										<div className="mb-2 col-md-4 col-lg-4 col-sm-6 col-12">
											<label className="form-label">
												Others<span className="error-star"></span>
											</label>
											<input
												className="form-control"
												name="otherLink"
												value={formik.values.otherLink}
												disabled
											/>
										</div>

										{/*  */}
									</div>
								</form>
							</div>
							<div className="mb-2 mt-2 row">
								<div className="col-lg-12 d-flex justify-content-start">
									<Link
										to="/affiliator-influencers"
										type="submit"
										className="btn btn-back"
									>
										Back
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default ViewAffiliator;
