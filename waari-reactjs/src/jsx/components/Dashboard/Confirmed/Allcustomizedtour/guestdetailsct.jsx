const url = import.meta.env.VITE_WAARI_BASEURL;
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import { ErrorComponentArray } from "../../FormErrorComponent/ErrorComponentArray";
import { get, post } from "../../../../../services/apiServices";

const customStyles = {
	control: (provided, state) => ({
		...provided,
		height: "34px", // Adjust the height to your preference
	}),
};

const initialValuesObject = {
	preFixId: "",
	firstName: "",
	lastName: "",
	address: "",
	adharCard: "",
	adharNo: "",
	contact: "",
	dob: "",
	gender: "",
	mailId: "",
	marriageDate: "",
	pan: "",
	panNo: "",
	passport: "",
	passportNo: "",
	roomShareType: "",
	roomShareTypeLabel: "",
	guestId: null,
	passport_issue_date: "",
    passport_expiry_date: "",
};

// need to have -

const GuestdetailsCT = ({ enquiryId, familyHead }) => {
	// to get the no of iteration start
	const [isLoading, setIsLoading] = useState(false);

	const [romesharing, setRomeSharing] = useState([]);
	const getRoomSharing = async () => {
		try {
			const response = await get(
				`/dropdown-final-custom-packages?enquiryCustomId=${enquiryId}`
			);
			setRomeSharing(response.data.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getRoomSharing();
	}, []);

	const setGuestDetailsValues = (element, index) => {
		const fields = [
			"preFixId",
			"firstName",
			"lastName",
			"address",
			"adharCard",
			"adharNo",
			"contact",
			"dob",
			"gender",
			"mailId",
			"marriageDate",
			"pan",
			"panNo",
			"passport",
			"passportNo",
			"roomShareType",
			"roomShareTypeLabel",
			"guestId",
			"passport_issue_date",
            "passport_expiry_date",
		];

		fields.forEach((field) => {

				validation.setFieldValue(
				`guestDetails[${index}].${field}`,
				element?.[field] ?? ""
			);
		});
	};

	useEffect(() => {
		setGuestDetailsValues(
			{
				guestId: familyHead.guestId,
				preFixId: familyHead.preFixId,
				firstName: familyHead.firstName,
				lastName: familyHead.lastName,
			},
			0
		);
	}, []);

	useEffect(() => {
		const getGuestsDetails = async () => {
			const response = await get(
				`/get-guest-details-ct?enquiryDetailCustomId=${familyHead.enquiryDetailCustomId}&enquiryCustomId=${enquiryId}`
			);

			return response.data?.data;
		};

		const fetchData = async () => {
			let guestDetails = await getGuestsDetails();

			guestDetails[0].preFixId = guestDetails[0].preFixId;

			if (guestDetails?.length > 0) {
				guestDetails.forEach((element, index) => {
					setGuestDetailsValues(element, index);
				});
			} else {
				setGuestDetailsValues(
					{
						guestId: familyHead.guestId,
						preFixId: familyHead.preFixId,
						firstName: familyHead.firstName,
						lastName: familyHead.lastName,
					},
					0
				);
			}
		};

		fetchData();
	}, []);

	const createInitialValues = (length) => {
		const initialValues = {
			guestid: familyHead.guestId,
			guestDetails: Array.from({ length }, () => ({ ...initialValuesObject })),
		};

		return initialValues;
	};

	const validationSchema = Yup.object().shape({
		guestDetails: Yup.array().of(
			Yup.object().shape({
				preFixId: Yup.string(),
				firstName: Yup.string().required(
					"First Name is required"
				),
				lastName: Yup.string().required("Last Name is required"),
				contact: Yup.string()
					.min(10, "Contact must be at least 10 digits long")
					.max(10, "Contact must be at at most 10 digits long"),
				address: Yup.string().required("Address is required"),
				gender: Yup.string().required("Gender is required"),
				mailId: Yup.string().email("Invalid email address"),
				dob: Yup.string().required("Date of birth is required"),
				roomShareType: Yup.string().required("Room sharing Type is required"),
				adharCard: Yup.string().required("Aadhar card is required"),
				adharNo: Yup.string()
					.required("Aadhar Number is required")
					.min(12, "Aadhar Number must be at least 12 digits long")
					.max(12, "Aadhar Number must be at at most 12 digits long"),
				passport: Yup.string().when([], {
					is: () => familyHead.destinationId == 2,
					then: Yup.string().required("Passport is required"),
					otherwise: Yup.string(),
				}),
				passport_issue_date: Yup.string().when([], {
					is: () => familyHead.destinationId == 2,
					then: Yup.string().required("Passport Issue Date is required"),
					otherwise: Yup.string(),
				}),
				passport_expiry_date: Yup.string().when([], {
					is: () => familyHead.destinationId == 2,
					then: Yup.string().required("Passport Expiry Date is required"),
					otherwise: Yup.string(),
				}),
			})
		),
	});

	const validation = useFormik({
		enableReinitialize: true,
		initialValues: createInitialValues(familyHead.paxNo),
		validationSchema,

		// onSubmit: async (values) => {
		// 	let data = {
		// 		enquiryCustomId: enquiryId,
		// 		enquiryDetailCustomId: familyHead.enquiryDetailCustomId,

		// 		guestDetails: values.guestDetails.map((fHead, ind) => ({
		// 			guestId: fHead.guestId,
		// 			preFixId: fHead.preFixId,
		// 			firstName: fHead.firstName,
		// 			lastName: fHead.lastName,
		// 			mailId: fHead.mailId,
		// 			gender: fHead.gender,
		// 			contact: fHead.contact,
		// 			address: fHead.address,
		// 			dob: fHead.dob,
		// 			roomShareType: fHead.roomShareType,
		// 			marriageDate: fHead.marriageDate,
		// 			adharCard: fHead.adharCard,
		// 			adharNo: fHead.adharNo,
		// 			passport: fHead.passport,
		// 			passportNo: fHead.passportNo,
		// 			pan: fHead.pan,
		// 			panNo: fHead.panNo,
		// 		})),
		// 	};

		// 	try {
		// 		console.log("data:", data);
		// 		setIsLoading(true);

		// 		const response = await post(`/guest-details-ct`, data);
		// 		setIsLoading(false);
		// 		toast.success(response?.data?.message);
		// 	} catch (error) {
		// 		setIsLoading(false);
		// 		console.log(error);
		// 	}
		// },
	});
	//   upload thumbnail file start
	const [isLoadingImages, setIsLoadingImages] = useState(false);

	// tourPrice(totalSelectedPrice);

	const scrollToFirstError = () => {
		const errorElement = document.querySelector(".error");

		if (errorElement) {
			errorElement.scrollIntoView({ behavior: "smooth" });
		}
	};

	// to show billing name as head of family start
	const [showIndex, setShowIndex] = useState([]);

	const handleCheckboxChange = (e, index) => {
		const checked = e.target.checked;
		if (checked) {
			validation.setFieldValue(
				`guestDetails[${index}].address`,
				validation.values.guestDetails[0].address
			);
		} else {
			validation.setFieldValue(`guestDetails[${index}].address`, "");
		}

		setShowIndex((prevShowIndex) => {
			const newShowIndex = [...prevShowIndex];
			newShowIndex[index] = !newShowIndex[index];
			return newShowIndex;
		});
	};
	// to show billing name as head of family end

	useEffect(() => {
		validation.values.guestDetails.forEach((item, index) => {
			const textarea5 = document.getElementById(
				`guestDetails[${index}].address`
			);
			textarea5.addEventListener("input", function () {
				this.style.height = "auto"; // Reset height to auto
				this.style.height = this.scrollHeight + "px"; // Set height to scrollHeight
			});
		});
	}, [validation.values.guestDetails]);

	//get data from email

	const [nameOptions, setNameOptions] = useState([]);
	const [searchTerm, setSearchTerm] = useState({ txt: "", index: 0 });
	// Simulating async data fetching (replace with actual API call)
	const fetchNameOptions = async () => {
		try {
			const response = await get(`guest-email?firstName=${searchTerm.txt}`);
			if (response.data.data.length > 0) {
				setNameOptions(response.data.data);
				validation.setFieldValue(
					`guestDetails[${searchTerm.index}].firstName`,
					searchTerm.txt
				);
			} else {
				validation.setFieldValue(
					`guestDetails[${searchTerm.index}].firstName`,
					searchTerm.txt
				);
				// validation.setFieldValue(
				// 	`guestDetails[${searchTerm.index}].lastName`,
				// 	searchTerm.txt
				// );
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleNameChange = (selectedOption, index) => {
		if (selectedOption) {
			validation.setFieldValue(
				`guestDetails[${index}].firstName`,
				selectedOption.label
			);
			getGuestInfoByName(selectedOption.value, index);
		} else {
			validation.setFieldValue(`guestDetails[${index}].mailId`, "");
			validation.setFieldValue(`guestDetails[${index}].preFixId`, "");
			validation.setFieldValue(`guestDetails[${index}].firstName`, "");
			validation.setFieldValue(`guestDetails[${index}].lastName`, "");
			validation.setFieldValue(`guestDetails[${index}].address`, "");
			validation.setFieldValue(`guestDetails[${index}].contact`, "");
			validation.setFieldValue(`guestDetails[${index}].passport`, "");
			validation.setFieldValue(`guestDetails[${index}].passportNo`, "");
			validation.setFieldValue(`guestDetails[${index}].panNo`, "");
			validation.setFieldValue(`guestDetails[${index}].pan`, "");
			validation.setFieldValue(`guestDetails[${index}].dob`, "");
			validation.setFieldValue(`guestDetails[${index}].adharNo`, "");
			validation.setFieldValue(`guestDetails[${index}].adharCard`, "");
			validation.setFieldValue(`guestDetails[${index}].marriageDate`, "");
			validation.setFieldValue(`guestDetails[${index}].gender`, "");
			validation.setFieldValue(`guestDetails[${index}].roomShareType`, "");
			validation.setFieldValue(`guestDetails[${index}].passport_issue_date`, "");
            validation.setFieldValue(`guestDetails[${index}].passport_expiry_date`, "");
		}
	};

	//get guest info by Name
	const getGuestInfoByName = async (guestId, index) => {
		try {
			const result = await get(`guest-info?guestId=${guestId}`);
			const {
				phone,
				userName,
				preFixId,
				lastName,
				address,
				passport,
				panNo,
				pan,
				email,
				passportNo,
				adharNo,
				adharCard,
				marriageDate,
				dob,
				gender,
				passport_issue_date,
				passport_expiry_date
			} = result.data;
			if (result.data) {
				if (familyHead.destinationId == 1) {
					validation.setFieldError(`guestDetails[${index}].passport`, "");
					validation.setFieldError(`guestDetails[${index}].passportNo`, "");
				} else {
					validation.setFieldValue(
						`guestDetails[${index}].passportNo`,
						passport
					);
					validation.setFieldValue(
						`guestDetails[${index}].passportNo`,
						passportNo
					);
					validation.setFieldValue(`guestDetails[${index}].passport_issue_date`, passport_issue_date);
                    validation.setFieldValue(`guestDetails[${index}].passport_expiry_date`, passport_expiry_date);
				}

				validation.setFieldValue(
					`guestDetails[${index}].lastName`,
					lastName ? lastName : ""
				);

				validation.setFieldValue(
					`guestDetails[${index}].preFixId`,
					preFixId ? preFixId : 1
				);

				validation.setFieldValue(
					`guestDetails[${index}].mailId`,
					email ? email : ""
				);
				validation.setFieldValue(
					`guestDetails[${index}].address`,
					address ? address : ""
				);
				validation.setFieldValue(
					`guestDetails[${index}].contact`,
					phone ? phone : ""
				);
				validation.setFieldValue(
					`guestDetails[${index}].panNo`,
					panNo ? panNo : ""
				);
				validation.setFieldValue(`guestDetails[${index}].pan`, pan ? pan : "");
				validation.setFieldValue(`guestDetails[${index}].dob`, dob ? dob : "");
				validation.setFieldValue(
					`guestDetails[${index}].adharNo`,
					adharNo ? adharNo : ""
				);
				validation.setFieldValue(
					`guestDetails[${index}].adharCard`,
					adharCard ? adharCard : ""
				);
				validation.setFieldValue(
					`guestDetails[${index}].marriageDate`,
					marriageDate ? marriageDate : ""
				);
				validation.setFieldValue(
					`guestDetails[${index}].gender`,
					gender ? gender : ""
				);
				validation.setFieldValue(`guestDetails[${index}].roomShareType`, "");
				validation.setFieldValue(`guestDetails[${index}].guestId`, guestId);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (searchTerm.txt.length > 2) {
			// Call the debouncedFetch function

			fetchNameOptions();
		} else {
			// Reset options when search term is less than or equal to 3 characters
			setNameOptions([]);
		}
	}, [searchTerm.txt]);

	const [preFixId, setpreFixId] = useState([]);

	const getPrefixDropDown = async () => {
		try {
			const response = await get(`/dd-prefix`);

			const mappedData = response.data.data.map((item) => ({
				value: item.preFixId,
				label: item.preFixName,
			}));
			setpreFixId(mappedData);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getPrefixDropDown();
	}, []);

	return (
		<section>
			<form className="needs-validation">
				<div className="card-header mb-2 pt-0" style={{ paddingLeft: "0" }}>
					<div className="card-title h5">Guest 1 (Family head)</div>
				</div>
				<div className="row mb-2">
					<div className="col-md-2">
						<label className="text-label">
							Guest Id<span className="error-star">*</span>
						</label>
					</div>
					<div className="col-md-6">
						<input
							disabled
							type="text"
							id={`guestid`}
							name={`guestid`}
							className="form-control"
							onChange={(e) => {
								validation.handleChange(e);
							}}
							onBlur={validation.handleBlur}
							value={validation.values.guestid}
							style={{ backgroundColor: "#f3f3f3" }}
						/>
					</div>
				</div>
				{validation.values.guestDetails &&
					validation.values.guestDetails.map((item, index) => {
						return (
							<>
								{index == 0 ? null : (
									<div
										className="card-header"
										style={{ paddingLeft: "0.7rem", marginBottom: "0.1rem" }}
									>
										<div className="card-title h5">Guest {index + 1}</div>
									</div>
								)}

								<div className="row mb-2 form-group">
									<div className="col-md-2">
										<label className="text-label">
											Name Prefix<span className="error-star">*</span>
										</label>
									</div>

									{index == 0 ? (
										<div className="col-md-6">
											<input
												type="text"
												className="form-control"
												id={`guestDetails[${index}].preFixId`}
												name={`guestDetails[${index}].preFixId`}
												value={familyHead.preFixId ? familyHead.preFixName : ""}
												disabled
												style={{ backgroundColor: "#f3f3f3" }}
											/>
										</div>
									) : (
										<div className="col-md-6">
											<Select
												isDisabled
												styles={customStyles}
												className="basic-single"
												classpreFixId="select"
												options={preFixId}
												onChange={(selectedOption) => {
													validation.setFieldValue(
														`guestDetails[${index}].preFixId`,
														selectedOption ? selectedOption.value : ""
													);
												}}
												onBlur={validation.handleBlur}
												value={preFixId.find(
													(option) =>
														option.value ===
														validation.values.guestDetails[index]?.preFixId
												)}
											/>
										</div>
									)}
								</div>
								<div className="row mb-2 form-group">
									<div className="col-md-2">
										<label className="text-label">
											first Name<span className="error-star">*</span>
										</label>
									</div>
									{index == 0 ? (
										<div className="col-md-6">
											<input
												disabled
												type="text"
												className="form-control"
												id={`guestDetails[${index}].firstName`}
												name={`guestDetails[${index}].firstName`}
												value={familyHead.firstName}
												style={{ backgroundColor: "#f3f3f3" }}
											/>
										</div>
									) : (
										<div className="col-md-6">
											<Select
												isDisabled
												options={nameOptions.map((item) => ({
													value: item.guestId,
													label: item.firstName,
												}))}
												isClearable
												isSearchable
												onInputChange={(inputValue) =>
													setSearchTerm({ txt: inputValue, index: index })
												}
												onChange={(i) => handleNameChange(i, index)}
												value={
													nameOptions.find(
														(item) =>
															item.firstName ==
															validation.values.guestDetails[index].firstName
													)
														? nameOptions.find(
																(item) =>
																	item.firstName ==
																	validation.values.guestDetails[index]
																		.firstName
														  )
														: {
																value:
																	validation.values.guestDetails[index]
																		.firstName,
																label:
																	validation.values.guestDetails[index]
																		.firstName,
														  }
												}
											/>
										</div>
									)}
								</div>

								<div className="row mb-2 form-group">
									<div className="col-md-2">
										<label className="text-label">
											Last Name<span className="error-star">*</span>
										</label>
									</div>
									{index == 0 ? (
										<div className="col-md-6">
											<input
												disabled
												type="text"
												className="form-control"
												name={`guestDetails[${index}].lastName`}
												value={familyHead.lastName}
												onChange={validation.handleChange}
												onBlur={validation.handleBlur}
												style={{ backgroundColor: "#f3f3f3" }}
											/>
										</div>
									) : (
										<div className="col-md-6">
											<input
												disabled
												type="text"
												className="form-control"
												name={`guestDetails[${index}].lastName`}
												value={validation.values.guestDetails[index]?.lastName}
												onChange={validation.handleChange}
												onBlur={validation.handleBlur}
											/>
										</div>
									)}
								</div>

								<div className="row mb-2 form-group">
									<div className="col-md-2">
										<label className="text-label">
											Gender<span className="error-star">*</span>
										</label>
									</div>
									<div className="col-md-6">
										<div className="d-flex">
											<div className="form-check">
												<label className="form-check-label">
													<input
														disabled
														className="form-check-input"
														type="radio"
														name={`guestDetails[${index}].gender`}
														value="male"
														checked={
															validation.values.guestDetails[index]?.gender ===
															"male"
														}
														onChange={validation.handleChange}
														onBlur={validation.handleBlur}
													/>
													Male
												</label>
											</div>
											<div className="form-check">
												<label className="form-check-label">
													<input
														disabled
														className="form-check-input"
														type="radio"
														name={`guestDetails[${index}].gender`}
														value="female"
														checked={
															validation.values.guestDetails[index]?.gender ===
															"female"
														}
														onChange={validation.handleChange}
														onBlur={validation.handleBlur}
													/>
													Female
												</label>
											</div>
											<div className="form-check disabled">
												<label className="form-check-label">
													<input
														disabled
														className="form-check-input"
														type="radio"
														name={`guestDetails[${index}].gender`}
														value="others"
														checked={
															validation.values.guestDetails[index]?.gender ===
															"others"
														}
														onChange={validation.handleChange}
														onBlur={validation.handleBlur}
													/>
													Others
												</label>
											</div>
										</div>
									</div>
								</div>
								<div className="row mb-2 form-group">
									<div className="col-md-2">
										<label className="text-label">
											Contact Number <span className="error-star"></span>
										</label>
									</div>
									<div className="col-md-6">
										<input
											disabled
											type="text"
											className="form-control"
											minLength={10}
											maxLength={10}
											id={`guestDetails[${index}].contact`}
											name={`guestDetails[${index}].contact`}
											onChange={(e) => {
												validation.handleChange(e);
											}}
											onBlur={validation.handleBlur}
											value={validation.values.guestDetails[index]?.contact}
										/>
									</div>
								</div>
								<div className="row mb-2 form-group">
									<div className="col-md-2">
										<label className="text-label">
											Mail Id<span className="error-star"></span>
										</label>
									</div>
									<div className="col-md-6">
										<input
											disabled
											type="text"
											className="form-control"
											id={`guestDetails[${index}].mailId`}
											name={`guestDetails[${index}].mailId`}
											onChange={(e) => {
												validation.handleChange(e);
											}}
											onBlur={validation.handleBlur}
											value={validation.values.guestDetails[index]?.mailId}
										/>
									</div>
								</div>
								<div className="row mb-2 form-group">
									<div className="col-md-2">
										<label className="text-label">
											Address<span className="error-star">*</span>
										</label>
									</div>
									<div className="col-md-6">
										<textarea
											disabled
											type="text"
											className="textarea"
											id={`guestDetails[${index}].address`}
											name={`guestDetails[${index}].address`}
											onChange={(e) => {
												validation.handleChange(e);
											}}
											onBlur={(e) => validation.handleBlur(e)}
											value={
												showIndex[index]
													? validation.values.guestDetails[0]?.address
													: validation.values.guestDetails[index]?.address
											}
										/>
									</div>
									{index == 0 ? null : (
										<div className="col-sm-4">
											<div className="form-check mb-2 checkbox-same">
												<input
													disabled
													checked={showIndex[index] || false}
													onChange={(e) => handleCheckboxChange(e, index)}
													type="checkbox"
													className="form-check-input "
													id="check1"
													value=""
												/>
												<label className="form-check-label" htmlFor="check1">
													Same as family head
												</label>
											</div>
										</div>
									)}
								</div>

								<div className="row mb-2 form-group">
									<div className="col-md-2">
										<label className="text-label">
											Date of birth<span className="error-star">*</span>
										</label>
									</div>
									<div className="col-md-6">
										<input
											disabled
											type="date"
											className="form-control"
											max={new Date().toISOString().split("T")[0]}
											id={`guestDetails[${index}].dob`}
											name={`guestDetails[${index}].dob`}
											onChange={(e) => {
												validation.handleChange(e);
											}}
											onBlur={validation.handleBlur}
											value={validation.values.guestDetails[index]?.dob}
										/>
									</div>
								</div>
								<div className="row mb-2 form-group">
									<div className="col-md-2">
										<label className="text-label">Date of marriage</label>
									</div>
									<div className="col-md-6">
										<input
											disabled
											type="date"
											className="form-control"
											id={`guestDetails[${index}].marriageDate`}
											name={`guestDetails[${index}].marriageDate`}
											onChange={(e) => {
												validation.handleChange(e);
											}}
											onBlur={validation.handleBlur}
											value={
												validation.values.guestDetails[index]?.marriageDate ||
												""
											}
										/>
									</div>
								</div>
								<div className="row mb-2 form-group">
									<div className="col-md-2">
										<label className="text-label">
											Room Sharing Type<span className="error-star">*</span>
										</label>
									</div>
									<div className="col-md-6">
										<select
											id={`guestDetails[${index}].roomShareTypeLabel`}
											name={`guestDetails[${index}].roomShareTypeLabel`}
											className="form-control"
											disabled={true}
											value={
												validation.values.guestDetails[index]
													?.roomShareTypeLabel
											}
										>
											<option value="" label="Select" />
											{romesharing?.map((cat, index) => (
												<option key={cat.label} value={cat.label}>
													{cat.label}
												</option>
											))}
										</select>
									</div>
								</div>
								<div className="row mb-2 form-group">
									<div className="col-md-2">
										<label className="text-label">
											Upload Aadhar Card<span className="error-star">*</span>
										</label>
									</div>
									<div className="col-md-6">
										<div className="Neon Neon-theme-dragdropbox">
											<input
												disabled
												className="file_upload"
												name={`guestDetails[${index}].adharCard`}
												accept="image/*"
												id="filer_input2"
												type="file"
											/>
											<div className="Neon-input-dragDrop">
												{validation.values.guestDetails.length > 0 &&
												validation.values.guestDetails[index]?.adharCard
													?.length == 0 ? (
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
														src={
															validation.values.guestDetails[index]?.adharCard
														}
														alt="frontImage"
														width="100%"
														className="neon-img"
													/>
												)}
											</div>
										</div>
									</div>
								</div>
								<div className="row mb-2 form-group">
									<div className="col-md-2">
										<label className="text-label">
											Aadhar Number<span className="error-star">*</span>
										</label>
									</div>
									<div className="col-md-6">
										<input
											disabled
											type="number"
											className="form-control"
											minLength={12}
											maxLength={12}
											id={`guestDetails[${index}].adharNo`}
											name={`guestDetails[${index}].adharNo`}
											onChange={(e) => {
												validation.handleChange(e);
											}}
											onBlur={validation.handleBlur}
											value={validation.values.guestDetails[index]?.adharNo}
										/>
									</div>
								</div>
								{familyHead.destinationId == 2 && (
									<>
										<div className="row mb-2 form-group">
											<div className="col-md-2">
												<label className="text-label">
													Upload Passport<span className="error-star">*</span>
												</label>
											</div>
											<div className="col-md-6">
												<div className="Neon Neon-theme-dragdropbox">
													<input
														disabled
														className="file_upload"
														name={`guestDetails[${index}].passport`}
														accept="image/*"
														id="filer_input2"
														type="file"
													/>
													<div className="Neon-input-dragDrop">
														{validation.values.guestDetails.length > 0 &&
														validation.values.guestDetails[index]?.passport
															?.length == 0 ? (
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
																src={
																	validation.values.guestDetails[index]
																		?.passport
																}
																alt="frontImage"
																width="100%"
																className="neon-img"
															/>
														)}
													</div>
												</div>
											</div>
										</div>
										<div className="row mb-2 form-group">
											<div className="col-md-2">
												<label className="text-label">Passport Number</label>
											</div>
											<div className="col-md-6">
												<input
													disabled
													type="text"
													className="form-control"
													id={`guestDetails[${index}].passportNo`}
													name={`guestDetails[${index}].passportNo`}
													onChange={(e) => {
														validation.handleChange(e);
													}}
													onBlur={validation.handleBlur}
													value={
														validation.values.guestDetails[index]?.passportNo
													}
												/>
											</div>
										</div>
										<div className="row mb-2 form-group">
                                            <div className="col-md-2">
                                                <label className="text-label">
                                                    Passport Issue Date  <span className="error-star">*</span>
                                                </label>
                                            </div>
                                            <div className="col-md-6">
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    id={`guestDetails[${index}].passport_issue_date`}
                                                    name={`guestDetails[${index}].passport_issue_date`}
                                                    onChange={(e) => {
                                                        validation.handleChange(e);
                                                    }}
                                                    onBlur={validation.handleBlur}
                                                    value={
                                                        validation.values.guestDetails[index]
                                                            ?.passport_issue_date
                                                    }
                                                />
												 <ErrorComponentArray
                                                    fieldName={"passport_issue_date"}
                                                    key={"passport_issue_date"}
                                                    index={index}
                                                    errors={validation.errors.guestDetails}
                                                    touched={validation.touched.guestDetails}
                                                />
                                            </div>
                                        </div>
										<div className="row mb-2 form-group">
                                            <div className="col-md-2">
                                                <label className="text-label">
                                                    Passport Expiry Date  <span className="error-star">*</span>
                                                </label>
                                            </div>
                                            <div className="col-md-6">
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    id={`guestDetails[${index}].passport_expiry_date`}
                                                    name={`guestDetails[${index}].passport_expiry_date`}
                                                    onChange={(e) => {
                                                        validation.handleChange(e);
                                                    }}
                                                    onBlur={validation.handleBlur}
                                                    value={
                                                        validation.values.guestDetails[index]
                                                            ?.passport_expiry_date
                                                    }
                                                />
												 <ErrorComponentArray
                                                    fieldName={"passport_expiry_date"}
                                                    key={"passport_expiry_date"}
                                                    index={index}
                                                    errors={validation.errors.guestDetails}
                                                    touched={validation.touched.guestDetails}
                                                />
                                            </div>
                                        </div>
									</>
								)}
								<div className="row mb-2 form-group">
									<div className="col-md-2">
										<label className="text-label">Upload PAN</label>
									</div>
									<div className="col-md-6">
										<div className="Neon Neon-theme-dragdropbox">
											<input
												disabled
												className="file_upload"
												name={`guestDetails[${index}].pan`}
												accept="image/*"
												id="filer_input2"
												type="file"
											/>
											<div className="Neon-input-dragDrop">
												{validation.values.guestDetails.length > 0 &&
												validation.values.guestDetails[index]?.pan?.length ==
													0 ? (
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
														src={validation.values.guestDetails[index]?.pan}
														alt="frontImage"
														width="100%"
														className="neon-img"
													/>
												)}
											</div>
										</div>
									</div>
								</div>

								<div className="row mb-2 form-group">
									<div className="col-md-2">
										<label className="text-label">PAN Number</label>
									</div>
									<div className="col-md-6">
										<input
											disabled
											type="text"
											className="form-control"
											id={`guestDetails[${index}].panNo`}
											name={`guestDetails[${index}].panNo`}
											onChange={(e) => {
												validation.handleChange(e);
											}}
											onBlur={validation.handleBlur}
											value={validation.values.guestDetails[index]?.panNo}
										/>
									</div>
								</div>

								<div className="divider divider-last"></div>
							</>
						);
					})}
			</form>
		</section>
	);
};

export default GuestdetailsCT;
