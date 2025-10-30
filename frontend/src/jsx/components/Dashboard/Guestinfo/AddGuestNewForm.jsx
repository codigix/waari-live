import { useFormik } from "formik";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Select from "react-select";
import ErrorMessageComponent from "../../Dashboard/FormErrorComponent/ErrorMessageComponent";
import axios from "axios";
import { toast } from "react-toastify";
import { get, post } from "../../../../services/apiServices";
import { NoImage } from "../../../utils/assetsPaths";
import {scrollIntoViewHelper} from "../../../utils/scrollIntoViewHelper";
import BackButton from "../../common/BackButton";
const url = import.meta.env.VITE_WAARI_BASEURL;

const validationSchema = Yup.object().shape({
	firstName: Yup.string().required("Enter First Name"),
	lastName: Yup.string().required("Enter Last Name"),
	email: Yup.string().email("Invalid email"),
	phone: Yup.string()
		.matches(/^\d+$/, "Phone number must be numeric")
		.min(10, "Contact must be at least 10 digits long")
		.max(10, "Contact must be at at most 10 digits long")
		.required("Phone is required"),
	dob: Yup.date().required("Date of Birth is required"),
	dom: Yup.date(),
	adharNo: Yup.string().matches(/^\d{12}$/, "Aadhar number must be 12 digits"),
	adhar: Yup.string(),
	pan: Yup.string(),
	passport: Yup.string(),
	panNo: Yup.string().matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN number"),
	passportNo: Yup.string(),
	cardId: Yup.object().required("Loyalty card is required"),
	loyaltyPoint: Yup.number(),
});

const loyaltyCardOption = [
	{ value: "1", label: "Silver" },
	{ value: "2", label: "Gold" },
	{ value: "3", label: "Platinum" },
	{ value: "4", label: "Diamond" },
];


const customStyles = {
    control: (provided, state) => ({
        ...provided,
        height: "34px", // Adjust the height to your preference
    }),
};

function AddGuestNewForm() {

	const navigate = useNavigate();
	const tokenId = localStorage.getItem("token");

	const [isLoading, setIsLoading] = React.useState(false);

	const [namePreFix, setNamePreFix] = React.useState([]);

	const getPrefixDropDown = async () => {
		try {
			const response = await get(`/dd-prefix`);

			const mappedData = response.data.data.map((item) => ({
				value: item.preFixId,
				label: item.preFixName,
			}));
			setNamePreFix(mappedData);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getPrefixDropDown();
	}, []);

	const formik = useFormik({
		initialValues: {
			namePreFix: "",
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			dob: "",
			dom: "",
			adharNo: "",
			adhar: "",
			pan: "",
			panNo: "",
			passport: "",
			passportNo: "",
			cardId: "",
			loyaltyPoint: "",
		},
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			try {
				setIsLoading(true);
				const data = {
                    preFixId: values.namePreFix,
                    firstName: values.firstName,
                    lastName: values.lastName,
					email: values.email,
					phone: values.phone,
					dob: values.dob,
					dom: values.dom,
					adharNo: values.adharNo,
					adhar: values.adhar,
					pan: values.pan,
					panNo: values.panNo,
					passport: values.passport,
					passportNo: values.passportNo,
					cardId: values.cardId?.value,
					loyaltyPoint: values.loyaltyPoint,
				};
				const result = await post("add-users", data);
				toast.success(result?.data?.message);
				navigate("/guest-list");
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
		
		if (!formik.isSubmitting) {
			if (Object.keys(formik.errors).length) {
				scrollIntoViewHelper(formik.errors)
			}
		}
		
	}, [formik.isSubmitting])
	useEffect(() => {
		// While view farmer page is active, the yadi tab must also activated
		// console.log(window.location.href.split("/"));
		const pathArray = window.location.href.split("/");
		const path = pathArray[pathArray.length - 1];
		// console.log(path);
		let element = document.getElementById("guest-list");
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
								<li className="breadcrumb-item">
									<Link to="/guest-list">Guest Information</Link>
								</li>
								<li className="breadcrumb-item  ">
									<Link to="#">Add Guest</Link>
								</li>
							</ol>
						</div>
					</div>
					{/* form for above filed */}
					<div className="card">
						<div className="card-header">
							<div className="card-title h5">Add Guest</div>
						</div>
						<div className="card-body">
							<form onSubmit={formik.handleSubmit} className="needs-validation">
								<div className="row">
									<div className="col-md-6 col-sm-12">
									<div className="row">
									<div className="col-md-3 col-lg-3 col-sm-3 pax-adults">
										<div className="mb-2">
											<label>
												Prefix Name<span className="error-star">*</span>
											</label>
											<Select
												styles={customStyles}
												className="basic-single basic-salution"
												classNamePrefix="select"
												options={namePreFix}
												onChange={(selectedOption) => {
													formik.setFieldValue(
														"namePreFix",
														selectedOption ? selectedOption.value : ""
													);
												}}
												onBlur={formik.handleBlur}
												value={namePreFix.find(
													(option) =>
														option.value === formik.values.namePreFix
												)}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"name"}
												touched={formik.touched}
											/>
										</div>
                                    </div>
                                    
                                    <div className="col-md-5 col-lg-5 col-sm-5 pax-child pax-adults">
											<label>
												First Name
												<span className="error-star">*</span>
											</label>
											<input
												type="text"
												className="form-control"
												name="firstName"
												value={formik.values.firstName}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"firstName"}
												touched={formik.touched}
												key={"firstName"}
											/>
                                    </div>
                                    <div className=" col-md-4 col-lg-4 col-sm-4 pax-child">
											<label>
												Last Name
												<span className="error-star">*</span>
											</label>
											<input
												type="text"
												className="form-control"
												name="lastName"
												value={formik.values.lastName}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"lastName"}
												touched={formik.touched}
												key={"lastName"}
											/>
                                    </div>
									</div>
									</div>
									<div className="col-md-6 col-lg-3 col-sm-6 col-12">
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
												minLength={10}
												maxLength={10}
												value={formik.values.phone}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"phone"}
												touched={formik.touched}
											/>
										</div>
									</div>

									<div className="col-md-6 col-lg-3 col-sm-6 col-12">
										<div className="mb-2">
											<label>Email</label>
											<input
												type="text"
												id="email"
												name="email"
												min={"0"}
												onWheel={(e) => e.preventDefault()}
												className="form-control"
												onChange={formik.handleChange}
												value={formik.values.email}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"email"}
												touched={formik.touched}
											/>
										</div>
									</div>
									<div className="col-md-6 col-lg-3 col-sm-6 col-12">
										<div className="mb-2">
											<label>
												DOB<span className="error-star">*</span>
											</label>
											<input
												type="date"
												id="dob"
												name="dob"
												onWheel={(e) => e.preventDefault()}
												className="form-control"
												onChange={formik.handleChange}
												value={formik.values.dob}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"dob"}
												touched={formik.touched}
											/>
										</div>
									</div>
									<div className="col-md-6 col-lg-3 col-sm-6 col-12">
										<div className="mb-2">
											<label>Date of marriage</label>
											<input
												type="date"
												id="dom"
												name="dom"
												onWheel={(e) => e.preventDefault()}
												className="form-control"
												onChange={formik.handleChange}
												value={formik.values.dom}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"dom"}
												touched={formik.touched}
											/>
										</div>
									</div>
									<div className="col-md-6 col-lg-3 col-sm-6 col-12">
										<div className="mb-2">
											<label>Aadhar Number</label>
											<input
												type="text"
												id="adharNo"
												name="adharNo"
												onWheel={(e) => e.preventDefault()}
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
									<div className="col-md-6 col-lg-3 col-sm-6 col-12">
										<div className="mb-2">
											<label>Pan Number</label>
											<input
												type="text"
												id="panNo"
												name="panNo"
												onWheel={(e) => e.preventDefault()}
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
									
									<div className="col-md-6 col-lg-3 col-sm-6 col-12">
										<div className="mb-2">
											<label>Passport Number</label>
											<input
												type="text"
												id="passportNo"
												name="passportNo"
												className="form-control"
												onChange={formik.handleChange}
												value={formik.values.passportNo}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"passportNo"}
												touched={formik.touched}
											/>
										</div>
									</div>
									
									<div className="col-md-6 col-lg-3 col-sm-6 col-12">
										<div className="mb-2">
											<label>
												Loyality Card<span className="error-star">*</span>
											</label>
											<Select
												id="cardId"
												name="cardId"
												className="basic-single select-role"
												classNamePrefix="select"
												options={loyaltyCardOption}
												onChange={(event) =>
													formik.setFieldValue("cardId", event)
												}
												value={formik.values.cardId}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"cardId"}
												touched={formik.touched}
											/>
										</div>
									</div>
									<div className="col-md-6 col-lg-3 col-sm-12 col-12">
										<div className="mb-2">
											<label>Loyality points</label>
											<input
												type="number"
												id="loyaltyPoint"
												name="loyaltyPoint"
												onWheel={(e) => e.preventDefault()}
												className="form-control"
												onChange={formik.handleChange}
												value={formik.values.loyaltyPoint}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"loyaltyPoint"}
												touched={formik.touched}
											/>
										</div>
									</div>
									<div className="col-md-12 col-lg-6 col-sm-12 col-12">
											<label className="text-label">
												Aadhaar Image<span className="error-star"></span>
											</label>
											<div className="col-md-12">
												<div className="Neon Neon-theme-dragdropbox cheque-upload">
													<input
														className="file_upload"
														name={`adhar`}
														accept="image/*"
														id="filer_input2"
														type="file"
														draggable
														onChange={async (e) => {
															const selectedFile = e.target.files[0];
															const fileLink = await getFileLink(selectedFile);
															formik.setFieldValue(`adhar`, fileLink);
															e.target.value = ""
														}}
													/>
													<div className="Neon-input-dragDrop">
														{formik.values.adhar?.length == 0 ? (
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
																src={formik.values.adhar || NoImage}
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
	
									<div className="col-md-12 col-lg-6 col-sm-12 col-12">
											<label className="text-label">
												Pan Card Image<span className="error-star"></span>
											</label>
											<div className="col-md-12">
												<div className="Neon Neon-theme-dragdropbox cheque-upload">
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
															e.target.value = ""
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
													fieldName={"cheque"}
													touched={formik.touched}
												/>
											</div>
										</div>
									<div className="col-md-12 col-lg-6 col-sm-12 col-12">
											<label className="text-label">
												Passport Image<span className="error-star"></span>
											</label>
											<div className="col-md-12">
												<div className="Neon Neon-theme-dragdropbox cheque-upload">
													<input
														className="file_upload"
														name={`passport`}
														accept="image/*"
														id="filer_input2"
														type="file"
														draggable
														onChange={async (e) => {
															const selectedFile = e.target.files[0];
															const fileLink = await getFileLink(selectedFile);
															formik.setFieldValue(`passport`, fileLink);
															e.target.value = ""
														}}
													/>
													<div className="Neon-input-dragDrop">
														{formik.values.passport?.length == 0 ? (
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
																src={formik.values.passport || NoImage}
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

								
								</div>
								<div className="col-lg-12 d-flex justify-content-between mt-3">
									<Link to="/guest-list" type="submit" className="btn btn-back">
										Back
									</Link>
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

export default AddGuestNewForm;
