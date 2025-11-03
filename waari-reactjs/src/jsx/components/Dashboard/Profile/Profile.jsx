import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import { get, post } from "../../../../services/apiServices";
import ErrorMessageComponent from "../FormErrorComponent/ErrorMessageComponent";
import PopupModal from "../Popups/PopupModal";
import ChangePasswordPopup from "./ChangePasswordPopup";
import { useSelector } from "react-redux";
import { NoImage } from "../../../utils/assetsPaths";
import BackButton from "../../common/BackButton";

const url = import.meta.env.VITE_WAARI_BASEURL;

// const validationSchema = Yup.object().shape({
// 	userName: Yup.string().required("Name is required"),
// 	email: Yup.string().email("Invalid email").required("Please enter the email"),
// 	phone: Yup.string()
// 		.matches(/^\d+$/, "Phone number must be numeric")
// 		.min(10, "Contact must be at least 10 digits long")
// 		.required("Please enter the Phone Number")
// 		.max(10, "Contact must be at at most 10 digits long")
// 		.required("Phone is required"),
// 	address: Yup.string().required("Address is required"),
// 	establishmentName: Yup.string().required("Establishment Name is required"),
// 	establishmentTypeId: Yup.object().required("Establishment Type is required"),
// 	adharNo: Yup.string()
// 		.matches(
// 			/(^[0-9]{4}[0-9]{4}[0-9]{4}$)|(^[0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|(^[0-9]{4}-[0-9]{4}-[0-9]{4}$)/,
// 			"Invalid Aadhaar number format. Please enter in the format XXXX XXXX XXXX"
// 		)
// 		.required("Aadhaar number is required"),
// 	adharCard: Yup.string().required("Aadhaar Card is required"),
// 	panNo: Yup.string()
// 		.matches(
// 			/^[A-Z]{5}[0-9]{4}[A-Z]$/,
// 			"Invalid PAN number format. Please enter in the format ABCDE1234F"
// 		)
// 		.required("PAN number is required"),
// 	pan: Yup.string().required("Pan Card is required"),
// 	city: Yup.string().required("City is required"),
// 	pincode: Yup.string()
// 		.required("Pincode is required")
// 		.matches(/^[1-9][0-9]{5}$/, "Pincode must be a 6-digit number"),
// 	state: Yup.string().required("State is required"),
// 	alternatePhone: Yup.string()
// 		.matches(/^\d+$/, "Alternative Phone number must be numeric")
// 		.min(10, "Contact must be at least 10 digits long")
// 		.max(10, "Contact must be at at most 10 digits long"),
// 	shopAct: Yup.string(),
// 	accName: Yup.string()
// 		.required("Account name is required")
// 		.matches(/^[a-zA-Z\s]+$/, "Invalid Account name"),
// 	accNo: Yup.string()
// 		.required("Account number is required")
// 		.matches(/^\d{9,18}$/, "Account number must be 9 to 18 digits"),
// 	bankName: Yup.string()
// 		.required("Bank name is required")
// 		.matches(/^[a-zA-Z\s]+$/, "Invalid Bank name"),
// 	branch: Yup.string()
// 		.required("Branch name is required")
// 		.matches(/^[a-zA-Z\s]+$/, "Invalid Branch name"),
// 	ifsc: Yup.string()
// 		.required("IFSC code is required")
// 		.matches(/^[A-Za-z]{4}\d{7}$/, "Invalid IFSC code. Format: ABCD0123456"),
// 	cheque: Yup.string(),
// 	logo: Yup.string(),
// });
const validationSchema = Yup.object().shape({
	userName: Yup.string(),
	email: Yup.string(),
	phone: Yup.string(),
	address: Yup.string(),
	establishmentName: Yup.string(),
	establishmentTypeId: Yup.object(),
	adharNo: Yup.string(),
	adharCard: Yup.string(),
	panNo: Yup.string(),
	pan: Yup.string(),
	city: Yup.string(),
	pincode: Yup.string(),
	state: Yup.string(),
	alternatePhone: Yup.string(),
	shopAct: Yup.string(),
	accName: Yup.string(),
	accNo: Yup.string(),
	bankName: Yup.string(),
	branch: Yup.string(),
	ifsc: Yup.string(),
	cheque: Yup.string(),
	logo: Yup.string(),
});


const establishmentOption = [
	{ value: "1", label: "Proprietorship " },
	{ value: "2", label: " Partnership" },
	{ value: "3", label: "LLP" },
	{ value: "4", label: "Pvt. Ltd." },
];

function Profile() {
	const { userId } = useSelector((state) => state.auth);

	const [isLoading, setIsLoading] = React.useState(false);
	const [showChangePassModal, setShowChangePassModal] = useState(false);
	const navigate = useNavigate();

	// Get sales profile data from api
	const getSalesProfileDetails = async () => {
		try {
			const result = await get(`/user/user-profile?userId=${userId}`);
			const {
				userName,
				email,
				contact,
				address,
				establishmentName,
				establishmentTypeId,
				adharCard,
				city,
				pincode,
				state,
				alternatePhone,
				shopAct,
				accName,
				accNo,
				bankName,
				branch,
				ifsc,
				cheque,
				logo,
				adharNo,
				pan,
				panNo,
			} = result?.data?.data;
			formik.setFieldValue("userName", userName);
			formik.setFieldValue("email", email);
			formik.setFieldValue("phone", contact);
			formik.setFieldValue("address", address);
			formik.setFieldValue("establishmentName", establishmentName);
			const establishmentTypeIdOption = establishmentOption.find(
				(item) => item.value == establishmentTypeId
			);
			formik.setFieldValue(
				"establishmentTypeId",
				establishmentTypeIdOption || ""
			);
			formik.setFieldValue("adharNo", adharNo || "");
			formik.setFieldValue("adharCard", adharCard || "");
			formik.setFieldValue("panNo", panNo || "");
			formik.setFieldValue("pan", pan || "");
			formik.setFieldValue("city", city || "");
			formik.setFieldValue("pincode", pincode || "");
			formik.setFieldValue("state", state || "");
			formik.setFieldValue("alternatePhone", alternatePhone || "");
			formik.setFieldValue("shopAct", shopAct || "");
			formik.setFieldValue("accName", accName || "");
			formik.setFieldValue("accNo", accNo || "");
			formik.setFieldValue("bankName", bankName || "");
			formik.setFieldValue("branch", branch || "");
			formik.setFieldValue("ifsc", ifsc || "");
			formik.setFieldValue("cheque", cheque || "");
			formik.setFieldValue("logo", logo || "");
		} catch (error) {
			console.log(error);
		}
	};

	// close show change password popup
	const handleDialogClose = () => {
		setShowChangePassModal(false);
	};

	// This hook is for handling validations
	const formik = useFormik({
		initialValues: {
			userName: "",
			email: "",
			phone: "",
			address: "",
			establishmentName: "",
			establishmentTypeId: "",
			adharNo: "",
			adharCard: "",
			panNo: "",
			pan: "",
			city: "",
			pincode: "",
			state: "",
			alternatePhone: "",
			shopAct: "",
			accName: "",
			accNo: "",
			bankName: "",
			branch: "",
			ifsc: "",
			cheque: "",
			logo: "",
		},
		validationSchema: validationSchema,
		onSubmit: async (values) => {

			try {
				setIsLoading(true);
				const data = {
					userId: userId,
					userName: values.userName,
					// Email is Commented Because, It should not be editable
					// email: values.email,
					phone: values.phone,
					// role is Hard coded , Just to show but change is now allowed
					address: values.address,
					establishmentName: values.establishmentName,
					establishmentTypeId: values.establishmentTypeId?.value,
					adharNo: Number(values.adharNo),
					adharCard: values.adharCard,
					panNo: values.panNo,
					pan: values.pan,
					city: values.city,
					pincode: Number(values.pincode),
					state: values.state,
					alternatePhone: values.alternatePhone,
					shopAct: values.shopAct,
					accName: values.accName,
					accNo: values.accNo,
					bankName: values.bankName,
					branch: values.branch,
					ifsc: values.ifsc,
					cheque: values.cheque,
					logo: values.logo,
				};
				const result = await post("user/edit-user-profile", data);
				console.log("result", result);
				toast.success(result?.data?.message);
				setIsLoading(false);
			} catch (error) {
				setIsLoading(false);
				console.log(error);
			}
		},
	});

	const getFileLink = async (file) => {
		try {
			const formData = new FormData();
			formData.append("image", file);
			const responseData = await axios.post(
				`${import.meta.env.VITE_WAARI_BASEURL}/user/image-upload`,
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
		getSalesProfileDetails();
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

	return (
		<>
			{showChangePassModal && (
				<PopupModal open={true} onDialogClose={handleDialogClose}>
					<ChangePasswordPopup onClose={handleDialogClose} />
				</PopupModal>
			)}
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
									<Link to="#">Profile</Link>
								</li>
							</ol>
						</div>
					</div>
					{/* form for above filed */}
					<div className="card">
						<div className="card-header">
							<div className="card-title h5">View / Edit Profile</div>
							<div style={{ marginLeft: "20px" }}>
								<button
									className="btn btn-back"
									onClick={() => setShowChangePassModal(true)}
								>
									Change Password
								</button>
							</div>
						</div>
						<div className="card-body">
							<form onSubmit={formik.handleSubmit} className="needs-validation">
								<div className="row">
									<div className="col-md-8">
										<div className="mb-2">
											<label>
												Name<span className="error-star">*</span>
											</label>
											<input
												id="userName"
												name="userName"
												type="text"
												className="form-control"
												onChange={formik.handleChange}
												value={formik.values.userName}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"userName"}
												touched={formik.touched}
											/>
										</div>
									</div>

									<div className="col-md-4">
										<div className="mb-2">
											<label>Email</label>
											<input
												type="text"
												id="email"
												name="email"
												onWheel={(e) => e.preventDefault()}
												className="form-control"
												onChange={formik.handleChange}
												disabled={true}
												value={formik.values.email}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"email"}
												touched={formik.touched}
											/>
										</div>
									</div>
									<div className="col-md-3">
										<div className="mb-2">
											<label>
												Phone<span className="error-star">*</span>
											</label>
											<input
												type="text"
												className="form-control"
												id="phone"
												name="phone"
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												min={10}
												max={10}
												value={formik.values.phone}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"phone"}
												touched={formik.touched}
											/>
										</div>
									</div>
									<div className="col-md-6">
										<div className="mb-2">
											<label>
												Address<span className="error-star">*</span>
											</label>
											<textarea
												className="textarea"
												id="resizableTextarea"
												name="address"
												rows="1"
												value={formik.values.address}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
											></textarea>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"address"}
												touched={formik.touched}
											/>
										</div>
									</div>

									<div className="col-md-3">
										<div className="mb-2">
											<label>
												Establishment Name<span className="error-star">*</span>
											</label>
											<input
												id="establishmentName"
												name="establishmentName"
												type="text"
												className="form-control"
												onChange={formik.handleChange}
												value={formik.values.establishmentName}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"establishmentName"}
												touched={formik.touched}
											/>
										</div>
									</div>

									<div className="col-md-3">
										<div className="mb-2">
											<label>
												Establishment Type<span className="error-star">*</span>
											</label>
											<Select
												id="establishmentTypeId"
												name="establishmentTypeId"
												className="basic-single select-role"
												classNamePrefix="select"
												options={establishmentOption}
												onChange={(event) =>
													formik.setFieldValue("establishmentTypeId", event)
												}
												value={formik.values.establishmentTypeId}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"establishmentTypeId"}
												touched={formik.touched}
											/>
										</div>
									</div>

									<div className="col-md-3">
										<div className="mb-2">
											<label>
												City<span className="error-star">*</span>
											</label>
											<input
												id="city"
												name="city"
												type="text"
												className="form-control"
												onChange={formik.handleChange}
												value={formik.values.city}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"city"}
												touched={formik.touched}
											/>
										</div>
									</div>

									<div className="col-md-3">
										<div className="mb-2">
											<label>
												Pin Code<span className="error-star">*</span>
											</label>
											<input
												id="pincode"
												name="pincode"
												className="form-control"
												onChange={formik.handleChange}
												value={formik.values.pincode?.toString()}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"pincode"}
												touched={formik.touched}
											/>
										</div>
									</div>

									<div className="col-md-3">
										<div className="mb-2">
											<label>
												State<span className="error-star">*</span>
											</label>
											<input
												id="state"
												name="state"
												type="text"
												className="form-control"
												onChange={formik.handleChange}
												value={formik.values.state}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"state"}
												touched={formik.touched}
											/>
										</div>
									</div>

									<div className="col-md-3">
										<div className="mb-2">
											<label>Alternate Phone</label>
											<input
												id="alternatePhone"
												name="alternatePhone"
												type="text"
												className="form-control"
												onChange={formik.handleChange}
												value={formik.values.alternatePhone}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"alternatePhone"}
												touched={formik.touched}
											/>
										</div>
									</div>

									<div className="col-md-3">
										<div className="mb-2">
											<label>
												Aadhaar No<span className="error-star">*</span>
											</label>
											<input
												id="adharNo"
												name="adharNo"
												type="text"
												className="form-control"
												onChange={formik.handleChange}
												value={formik.values.adharNo}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"adharNo"}
												touched={formik.touched}
											/>
										</div>
									</div>

									<div className="col-md-3">
										<div className="mb-2">
											<label>
												Pan No<span className="error-star">*</span>
											</label>
											<input
												id="panNo"
												name="panNo"
												type="text"
												className="form-control"
												onChange={formik.handleChange}
												value={formik.values.panNo}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"panNo"}
												touched={formik.touched}
											/>
										</div>
									</div>

									<div className="col-md-6">
										<label className="text-label">
											Upload Aadhaar Card<span className="error-star">*</span>
										</label>
										<div className="col-md-12">
											<div className="Neon Neon-theme-dragdropbox">
												<input
													className="file_upload"
													name={`adharCard`}
													accept="image/*"
													id="filer_input2"
													type="file"
													draggable
													onChange={async (e) => {
														const selectedFile = e.target.files[0];
														const fileLink = await getFileLink(selectedFile);
														formik.setFieldValue(`adharCard`, fileLink);
													}}
												/>
												<div className="Neon-input-dragDrop">
													{formik.values.adharCard?.length == 0 ? (
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
															src={formik.values.adharCard || NoImage}
															alt="frontImage"
															width="100%"
															className="neon-img"
														/>
													)}
												</div>
											</div>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"adharCard"}
												touched={formik.touched}
											/>
										</div>
									</div>

									<div className="col-md-6">
										<label className="text-label">
											Upload Pan Card<span className="error-star">*</span>
										</label>
										<div className="col-md-12">
											<div className="Neon Neon-theme-dragdropbox">
												<input
													className="file_upload"
													name={`pan`}
													accept="image/*"
													id="filer_input2"
													type="file"
													draggable
													onChange={async (e) => {
														const selectedFile = e.target.files[0];
														const fileLink = await getFileLink(selectedFile);
														formik.setFieldValue(`pan`, fileLink);
													}}
												/>
												<div className="Neon-input-dragDrop">
													{formik.values.pan?.length == 0 ? (
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
															src={formik.values.pan || NoImage}
															alt="frontImage"
															width="100%"
															className="neon-img"
														/>
													)}
												</div>
											</div>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"pan"}
												touched={formik.touched}
											/>
										</div>
									</div>

									<div className="col-md-3">
										<div className="mb-2">
											<label>
												A/C Name<span className="error-star">*</span>
											</label>
											<input
												id="accName"
												name="accName"
												type="text"
												className="form-control"
												onChange={formik.handleChange}
												value={formik.values.accName}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"accName"}
												touched={formik.touched}
											/>
										</div>
									</div>

									<div className="col-md-3">
										<div className="mb-2">
											<label>
												A/C No<span className="error-star">*</span>
											</label>
											<input
												id="accNo"
												name="accNo"
												type="text"
												className="form-control"
												onChange={formik.handleChange}
												value={formik.values.accNo}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"accNo"}
												touched={formik.touched}
											/>
										</div>
									</div>

									<div className="col-md-3">
										<div className="mb-2">
											<label>
												Bank Name<span className="error-star">*</span>
											</label>
											<input
												id="bankName"
												name="bankName"
												type="text"
												className="form-control"
												onChange={formik.handleChange}
												value={formik.values.bankName}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"bankName"}
												touched={formik.touched}
											/>
										</div>
									</div>

									<div className="col-md-3">
										<div className="mb-2">
											<label>
												Branch<span className="error-star">*</span>
											</label>
											<input
												id="branch"
												name="branch"
												type="text"
												className="form-control"
												onChange={formik.handleChange}
												value={formik.values.branch}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"branch"}
												touched={formik.touched}
											/>
										</div>
									</div>

									<div className="col-md-3">
										<div className="mb-2">
											<label>
												IFSC<span className="error-star">*</span>
											</label>
											<input
												id="ifsc"
												name="ifsc"
												type="text"
												className="form-control"
												onChange={formik.handleChange}
												value={formik.values.ifsc}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"ifsc"}
												touched={formik.touched}
											/>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-md-6">
										<label className="text-label">
											Upload Cheque<span className="error-star">*</span>
										</label>
										<div className="col-md-12">
											<div className="Neon Neon-theme-dragdropbox">
												<input
													className="file_upload"
													name={`cheque`}
													accept="image/*"
													id="filer_input2"
													type="file"
													draggable
													onChange={async (e) => {
														const selectedFile = e.target.files[0];
														const fileLink = await getFileLink(selectedFile);
														formik.setFieldValue(`cheque`, fileLink);
													}}
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
															src={formik.values.cheque || NoImage}
															alt="frontImage"
															width="100%"
															className="neon-img"
														/>
													)}
												</div>
											</div>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"cheque"}
												touched={formik.touched}
											/>
										</div>
									</div>
									<div className="col-md-6">
										<label className="text-label">
											Upload Shop Act<span className="error-star">*</span>
										</label>
										<div className="col-md-12">
											<div className="Neon Neon-theme-dragdropbox">
												<input
													className="file_upload"
													name={`shopAct`}
													accept="image/*"
													id="filer_input2"
													type="file"
													draggable
													onChange={async (e) => {
														const selectedFile = e.target.files[0];
														const fileLink = await getFileLink(selectedFile);
														formik.setFieldValue(`shopAct`, fileLink);
													}}
												/>
												<div className="Neon-input-dragDrop">
													{formik.values.shopAct?.length == 0 ? (
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
															src={formik.values.shopAct || NoImage}
															alt="frontImage"
															width="100%"
															className="neon-img"
														/>
													)}
												</div>
											</div>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"shopAct"}
												touched={formik.touched}
											/>
										</div>
									</div>

									<div className="col-md-6">
										<label className="text-label">
											Upload Logo<span className="error-star">*</span>
										</label>
										<div className="col-md-12">
											<div className="Neon Neon-theme-dragdropbox">
												<input
													className="file_upload"
													name={`logo`}
													accept="image/*"
													id="filer_input2"
													type="file"
													draggable
													onChange={async (e) => {
														const selectedFile = e.target.files[0];
														const fileLink = await getFileLink(selectedFile);
														formik.setFieldValue(`logo`, fileLink);
													}}
												/>
												<div className="Neon-input-dragDrop">
													{formik.values.logo?.length == 0 ? (
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
															src={formik.values.logo || NoImage}
															alt="frontImage"
															width="100%"
															className="neon-img"
														/>
													)}
												</div>
											</div>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"logo"}
												touched={formik.touched}
											/>
										</div>
									</div>
								</div>
								<div className="col-lg-12 d-flex justify-content-between mt-3">
									<button
										type="button"
										onClick={() => navigate(-1)}
										className="btn btn-back"
									>
										Back
									</button>
									<div className="d-flex">
										<button
											type="submit"
											className="btn btn-submit btn-primary"
											disabled={isLoading}
										>
											{isLoading ? "Submitting..." : "Submit"}
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Profile;
