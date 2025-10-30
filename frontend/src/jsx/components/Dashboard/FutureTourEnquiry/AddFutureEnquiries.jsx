import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { get, post } from "../../../../services/apiServices";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import ErrorMessageComponent from "../FormErrorComponent/ErrorMessageComponent";
import BackButton from "../../common/BackButton";

const customStyles = {
	control: (provided, state) => ({
		...provided,
		height: "34px", // Adjust the height to your preference
	}),
};

const AddFutureEnquiries = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	const validation = useFormik({
		// enableReinitialize : use this flag when initial values needs to be changed
		enableReinitialize: true,

		initialValues: {
			name: "",
			phoneNo: "",
			email: "",
			address: "",
			startDate: "",
			endDate: "",
			city: [],
		},
		validationSchema: Yup.object({
			name: Yup.string().required("Please enter name"),
			phoneNo: Yup.string()
				.required("Enter the Contact Number")
				.min(10, "Please enter correct contact number")
				.max(10, "Please enter correct contact number"),
			email: Yup.string().email("Please enter valid email address").required("Please enter email Address"),
			address: Yup.string().required("Please enter Address"),
			startDate: Yup.string().required("Please enter Start Date"),
			endDate: Yup.string().required("Please enter End Date"),
			city: Yup.array()
				.min(1, "Select at least one city")
				.required("Select Cities"),
		}),

		onSubmit: async (values) => {
			let data = {
				name: values.name,
				phoneNo: values.phoneNo,
				email: values.email,
				address: values.address,
				startDate: values.startDate,
				endDate: values.endDate,
				city: values.city.map((item) => item.label),
			};

			try {
				setIsLoading(true);
				const response = await post(`/future-tour-enquiry-details`, data);
				setIsLoading(false);
				toast.success(response?.data?.message);
				navigate(-1);
			} catch (error) {
				setIsLoading(false);
				console.log(error);
			}
		},
	});

	/* get city from api */
	const [cities, setCities] = useState([]);

	const getCity = async () => {
		try {
			const response = await get(`/city-list`);
			const mappedData = response.data.data.map((item) => ({
				value: item.citiesId,
				label: item.citiesName
					.split(" ")
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(" "),
			}));
			setCities(mappedData);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getCity();
	}, []);

	useEffect(() => {
		let element = document.getElementById("my-future-tour-enquiries");
		if (element) {
			element.classList.add("mm-active1"); // Add the 'active' class to the element
		}
		return () => {
			if (element) {
				element.classList.remove("mm-active1"); // remove the 'active' class to the element when change to another page
			}
		};
	}, []);

	useEffect(() => {
		const textarea = document.getElementById("address");

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
			<div className="row">
				<div className="col-lg-12">
					<div className="card">
						<div className="row page-titles mb-0 mx-0">
							   <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <BackButton />
                        </li>
								<li className="breadcrumb-item active">
									<Link to="/dashboard">Dashboard</Link>
								</li>
								<li className="breadcrumb-item">
									<Link to="/all-future-tour-enquiries">Enquiry follow-up</Link>
								</li>
								<li className="breadcrumb-item  ">
									<Link to="/add-future-tour-enquiries">Add Group Tour</Link>
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
									<div className="card-header" style={{ paddingLeft: "0" }}>
										<div className="card-title h5">Personal Details</div>
									</div>
									<div className="row">
										<div className="mb-2 col-md-8 col-sm-6 col-lg-6 col-12">
											<label className="form-label">
												Name<span className="error-star"></span>
											</label>
											<input
												type="text"
												className="form-control"
												placeholder=""
												name="name"
												onChange={validation.handleChange}
												onBlur={validation.handleBlur}
												value={validation.values.name}
											/>
											<ErrorMessageComponent
												errors={validation.errors}
												fieldName={"name"}
												touched={validation.touched}
												key={"name"}
											/>
										</div>

										<div className="mb-2 col-md-4 col-sm-6 col-lg-3 col-12">
											<label className="form-label">
												Contact No.<span className="error-star">*</span>
											</label>
											<div className="d-flex">
												<input
													type="tel"
													className="form-control"
													placeholder=""
													name="phoneNo"
													minLength={10}
													maxLength={10}
													onChange={validation.handleChange}
													onBlur={validation.handleBlur}
													value={validation.values.phoneNo}
												/>
											</div>
											<ErrorMessageComponent
												errors={validation.errors}
												fieldName={"phoneNo"}
												touched={validation.touched}
												key={"phoneNo"}
											/>
										</div>

										<div className="mb-2 col-md-4 col-sm-6 col-lg-3 col-12">
											<label className="form-label">
												Mail Id<span className="error-star">*</span>
											</label>
											<input
												type="text"
												className="form-control"
												placeholder=""
												name="email"
												onChange={validation.handleChange}
												onBlur={validation.handleBlur}
												value={validation.values.email}
											/>
											<ErrorMessageComponent
												errors={validation.errors}
												fieldName={"email"}
												touched={validation.touched}
												key={"email"}
											/>
										</div>

										<div className="col-md-4 col-sm-6 col-lg-2 col-12">
											<div className="mb-2">
												<label>
													Start Date<span className="error-star">*</span>
												</label>
												<input
													type="date"
													id="startDate"
													name="startDate"
													className="form-control"
													min={new Date().toISOString().split("T")[0]}
													onChange={validation.handleChange}
												/>
												<ErrorMessageComponent
													errors={validation.errors}
													fieldName={"startDate"}
													touched={validation.touched}
													key={"startDate"}
												/>
											</div>
										</div>
										<div className="col-md-4 col-sm-6 col-lg-2 col-12">
											<div className="mb-2">
												<label>
													End Date<span className="error-star">*</span>
												</label>
												<input
													type="date"
													id="endDate"
													name="endDate"
													className="form-control"
													onChange={validation.handleChange}
												/>
												<ErrorMessageComponent
													errors={validation.errors}
													fieldName={"endDate"}
													touched={validation.touched}
													key={"endDate"}
												/>
											</div>
										</div>

										<div className="col-md-12 col-sm-12 col-lg-8 col-12 mb-2">
											<label className="form-label">
												Select Cities<span className="error-star">*</span>
											</label>
											<Select
												isMulti
												styles={customStyles}
												className="basic-multi-select"
												classNamePrefix="select"
												name="city"
												options={cities}
												onChange={(selectedOptions) =>
													validation.setFieldValue("city", selectedOptions)
												}
												onBlur={validation.handleBlur}
												value={validation.values.city}
											/>
											{validation.touched.city && validation.errors.city ? (
												<span className="error">
													{validation.errors.city}
												</span>
											) : null}
										</div>

										<div className="col-md-12 col-sm-12 col-lg-6 col-12 mb-2">
											<label>
												Address
												<span className="error-star">*</span>
											</label>
											<textarea
												type="text"
												className="textarea"
												id="address"
												name="address"
												onChange={validation.handleChange}
												value={validation.values.address}
											/>
											<ErrorMessageComponent
												errors={validation.errors}
												fieldName={"address"}
												touched={validation.touched}
											/>
										</div>
									</div>
									<div className="mb-2 mt-2 row">
										<div className="col-lg-12 d-flex justify-content-between">
											<button
												onClick={() => navigate(-1)}
												type="button"
												className="btn btn-back"
											>
												Back
											</button>
											<button
												type="submit"
												className="btn btn-submit btn-primary"
												disabled={isLoading}
											>
												{isLoading ? "Submitting" : "Submit"}
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
export default AddFutureEnquiries;

// {
//   "name" : "dawdwa",
//   "city" : [
//       "axcz","manali", "dasdvc"
//   ],
//   "phoneNo" : 1234567890,
//   "address" : "cvxcv bhilai",
//   "email" : "asd@gmail.com",
//   "startDate" : "2024-06-13",
//   "endDate" : "2024-07-13",
//   "status" : 1
// }
