import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { post } from "../../../../services/apiServices";
import ErrorMessageComponent from "../FormErrorComponent/ErrorMessageComponent";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { NoImage } from "../../../utils/assetsPaths";
import { scrollIntoViewHelper } from "../../../utils/scrollIntoViewHelper";
import BackButton from "../../common/BackButton";
const url = import.meta.env.VITE_WAARI_BASEURL;

const validationSchema = Yup.object().shape({
	// Personal Details
	firstName: Yup.string().required("First Name is required"),
	lastName: Yup.string().required("Last Name is required"),
	address: Yup.string().required("Address is required"),
	email: Yup.string().email("Invalid email").required("Please enter the email"),
	password: Yup.string()
		.min(6, "Length of the password should be atleast 6 digits")
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]+$/,
			"Password must contain at least 1 lowercase, 1 uppercase, 1 digit, and 1 special character"
		)
		.required("Please enter the Password"),
	confirmPassword: Yup.string().oneOf(
		[Yup.ref("password"), null],
		"Password and Confirm Password must match"
	),
	phoneNo: Yup.string()
		.matches(/^\d+$/, "Contact number must be numeric")
		.min(10, "Contact must be at least 10 digits long")
		.required("Please enter the Contact Number")
		.max(10, "Contact must be at at most 10 digits long")
		.required("Contact is required"),
	role: Yup.object().required("Role is required").nullable(), //1-influencer,2-affiliator

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
	discountType: 1,
	discountValue: "",
	maxDiscount: 0,
	isType: 1,

	fbLink: "",
	instagramLink: "",
	twitterLink: "",
	otherLink: "",
};

const AddAffiliator = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate(false);

	const options = [
		{ value: "1", label: "Affiliator" },
		{ value: "2", label: "Influencer" },
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

		onSubmit: async (values) => {
			try {
				setIsSubmitting(true);

				if (values.discountType == 2) {
					// Set a new field with key 'fixedDiscount' and value from discountValue
					formik.setFieldValue("maxDiscount", values.maxDiscount);
				}

				const data = {
					firstName: values.firstName,
					lastName: values.lastName,
					address: values.address,
					email: values.email,
					password: values.password,
					phoneNo: values.phoneNo,
					role: values.role.value,

					accName: values.accName,
					accNo: values.accNo,
					bankName: values.bankName,
					branch: values.branch,
					ifsc: values.ifsc,
					cheque: values.cheque,

					couponName: values.couponName,
					fromDate: values.fromDate,
					toDate: values.toDate,
					discountType: values.discountType,
					discountValue: values.discountValue,
					status: values.status ? 1 : 0,
					isType: values.isType,

					commissionType: values.commissionType,
					commissionValue: values.commissionValue,

					fbLink: values.fbLink,
					instagramLink: values.instagramLink,
					twitterLink: values.twitterLink,
					otherLink: values.otherLink,
				};

				if (values.discountType == 2) {
					data.maxDiscount = values.maxDiscount;
				}

				if (values.commissionType == 2) {
					data.maxCommission = values.maxCommission;
				}

				const result = await post("add-influencer-affiliate", data);
				toast.success(result?.data?.message);

				navigate("/affiliator-influencers");
				setIsSubmitting(false);
			} catch (error) {
				setIsSubmitting(false);
				console.log(error);
			}
		},
	});

	// If To toDate is Earlier than fromDate then set toDate to empty
	const handleDateChangeFrom = (e) => {
		formik.setFieldValue("fromDate", e.target.value);
		if (
			formik.values.toDate &&
			new Date(e.target.value) > new Date(formik.values.toDate)
		) {
			formik.setFieldValue("toDate", "");
		}
	};

	const handleDateChangeto = (e) => {
		formik.setFieldValue("toDate", e.target.value);
	};

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

	useEffect(() => {
		const textarea = document.getElementById("address");

		const adjustTextareaHeight = () => {
			textarea.style.height = "35px"; // Reset height to auto to get the actual scroll height
			textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to the scroll height
		};

		textarea.addEventListener("input", adjustTextareaHeight);

		return () => {
			// Clean up the event listener when the component unmounts
			textarea.removeEventListener("input", adjustTextareaHeight);
		};
	}, []);

	useEffect(() => {
		if (!formik.isSubmitting) {
			if (Object.keys(formik.errors).length) {
				scrollIntoViewHelper(formik.errors);
			}
		}
	}, [formik.isSubmitting]);

	return (
		<>
			<div className="row">
				<div className="col-lg-12 " style={{ paddingTop: '40px' }}>
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
									<Link to="/add-affiliator">Add Affiliator</Link>
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
										formik.handleSubmit();
										return false;
									}}
								>
									<div
										className="card-header mb-2 pt-0"
										style={{ paddingLeft: "0" }}
									>
										<div className="card-title h5">Add Affiliator</div>
									</div>
									<div className="row">
										<div className="mb-2 col-md-4 col-lg-4 col-sm-6 col-12">
											<label className="form-label">
												First Name<span className="error-star">*</span>
											</label>
											<input
												className="form-control"
												name="firstName"
												value={formik.values.firstName}
												{...formik.getFieldProps("firstName")}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"firstName"}
												touched={formik.touched}
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
												{...formik.getFieldProps("lastName")}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"lastName"}
												touched={formik.touched}
											/>
										</div>

										<div className="mb-2 col-md-4 col-lg-4 col-sm-6 col-12">
											<label className="form-label">
												Roles<span className="error-star">*</span>
											</label>
											<Select
												className="basic-single"
												classNamePrefix="select"
												isSearchable={true}
												name="role"
												value={formik.values.role}
												onChange={(e) => formik.setFieldValue("role", e)}
												options={options}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"role"}
												touched={formik.touched}
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
												{...formik.getFieldProps("phoneNo")}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"phoneNo"}
												touched={formik.touched}
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
												{...formik.getFieldProps("email")}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"email"}
												touched={formik.touched}
											/>
										</div>
										<div className="col-md-3 col-lg-3 col-sm-6 col-12 ">
											<div className="mb-2">
												<label>
													Password<span className="error-star">*</span>
												</label>
												<input
													id="password"
													name="password"
													className="form-control"
													value={formik.values.password}
													{...formik.getFieldProps("password")}
												/>
												<ErrorMessageComponent
													errors={formik.errors}
													fieldName={"password"}
													touched={formik.touched}
												/>
											</div>
										</div>

										<div className="col-md-3 col-lg-3 col-sm-6 col-12 ">
											<div className="mb-2">
												<label>
													Confirm Password<span className="error-star">*</span>
												</label>
												<input
													id="confirmPassword"
													name="confirmPassword"
													className="form-control"
													value={formik.values.confirmPassword}
													{...formik.getFieldProps("confirmPassword")}
												/>
												<ErrorMessageComponent
													errors={formik.errors}
													fieldName={"confirmPassword"}
													touched={formik.touched}
												/>
											</div>
										</div>

										<div className="col-md-6 col-lg-6 col-sm-6 col-12 ">
											<div className="mb-2">
												<label>
													Address<span className="error-star">*</span>
												</label>
												<textarea
													className="textarea"
													id="address"
													name="address"
													value={formik.values.address}
													{...formik.getFieldProps("address")}
												></textarea>
												<ErrorMessageComponent
													errors={formik.errors}
													fieldName={"address"}
													touched={formik.touched}
												/>
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
												/>
												<ErrorMessageComponent
													errors={formik.errors}
													fieldName={"couponName"}
													touched={formik.touched}
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
													onChange={handleDateChangeFrom}
												/>
												<ErrorMessageComponent
													errors={formik.errors}
													fieldName={"fromDate"}
													touched={formik.touched}
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
													onChange={handleDateChangeto}
												/>
												<ErrorMessageComponent
													errors={formik.errors}
													fieldName={"toDate"}
													touched={formik.touched}
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
												/>
												<ErrorMessageComponent
													errors={formik.errors}
													fieldName={"discountValue"}
													touched={formik.touched}
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
													/>
													<ErrorMessageComponent
														errors={formik.errors}
														fieldName={"maxDiscount"}
														touched={formik.touched}
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
												/>
												<ErrorMessageComponent
													errors={formik.errors}
													fieldName={"commissionValue"}
													touched={formik.touched}
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
													/>
													<ErrorMessageComponent
														errors={formik.errors}
														fieldName={"maxCommission"}
														touched={formik.touched}
													/>
												</div>
											</div>
										)}

										<div className="card-header card-header-title">
											<div className="card-title h5">
												Affilate Banking Details
											</div>
										</div>

										<div className="col-md-3 col-lg-3 col-sm-6 col-12 ">
											<div className="mb-2">
												<label>
													A/C Name<span className="error-star">*</span>
												</label>
												<input
													id="accName"
													name="accName"
													className="form-control"
													value={formik.values.accName}
													{...formik.getFieldProps("accName")}
												/>
												<ErrorMessageComponent
													errors={formik.errors}
													fieldName={"accName"}
													touched={formik.touched}
												/>
											</div>
										</div>

										<div className="col-md-3 col-lg-3 col-sm-6 col-12 ">
											<div className="mb-2">
												<label>
													A/C No<span className="error-star">*</span>
												</label>
												<input
													id="accNo"
													name="accNo"
													className="form-control"
													value={formik.values.accNo}
													{...formik.getFieldProps("accNo")}
												/>
												<ErrorMessageComponent
													errors={formik.errors}
													fieldName={"accNo"}
													touched={formik.touched}
												/>
											</div>
										</div>

										<div className="col-md-2 col-lg-2 col-sm-6 col-12">
											<div className="mb-2">
												<label>
													Bank Name<span className="error-star">*</span>
												</label>
												<input
													id="bankName"
													name="bankName"
													className="form-control"
													value={formik.values.bankName}
													{...formik.getFieldProps("bankName")}
												/>
												<ErrorMessageComponent
													errors={formik.errors}
													fieldName={"bankName"}
													touched={formik.touched}
												/>
											</div>
										</div>

										<div className="col-md-2 col-lg-2 col-sm-6 col-12 ">
											<div className="mb-2">
												<label>
													Branch<span className="error-star">*</span>
												</label>
												<input
													id="branch"
													name="branch"
													className="form-control"
													value={formik.values.branch}
													{...formik.getFieldProps("branch")}
												/>
												<ErrorMessageComponent
													errors={formik.errors}
													fieldName={"branch"}
													touched={formik.touched}
												/>
											</div>
										</div>

										<div className="col-md-2 col-lg-2 col-sm-6 col-12">
											<div className="mb-2">
												<label>
													IFSC<span className="error-star">*</span>
												</label>
												<input
													id="ifsc"
													name="ifsc"
													className="form-control"
													value={formik.values.ifsc}
													{...formik.getFieldProps("ifsc")}
												/>
												<ErrorMessageComponent
													errors={formik.errors}
													fieldName={"ifsc"}
													touched={formik.touched}
												/>
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
												{...formik.getFieldProps("fbLink")}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"fbLink"}
												touched={formik.touched}
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
												{...formik.getFieldProps("instagramLink")}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"instagramLink"}
												touched={formik.touched}
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
												{...formik.getFieldProps("twitterLink")}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"twitterLink"}
												touched={formik.touched}
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
												{...formik.getFieldProps("otherLink")}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"otherLink"}
												touched={formik.touched}
											/>
										</div>

										{/*  */}
									</div>
									<div className="mb-2 mt-2 row">
										<div className="col-lg-12 d-flex justify-content-between">
											<Link
												to="/affiliator-influencers"
												type="submit"
												className="btn btn-back"
											>
												Back
											</Link>
											<button
												disabled={isSubmitting}
												type="submit"
												className="btn btn-submit btn-primary"
											>
												Submit
											</button>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default AddAffiliator;
