import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { get, post } from "../../../../../services/apiServices";
import "react-phone-number-input/style.css";
import ErrorMessageComponent from "../../FormErrorComponent/ErrorMessageComponent";
import { useDispatch } from "react-redux";
import {
	updateFamilyHeadDataCompletionStatus,
	updateGroupNameGT,
} from "../../../../../store/actions/groupTourAction";

const Journeys = ({ enquiryId }) => {
	const dispatch = useDispatch();
	const [length, setLength] = useState(0);
	const [isEnquiryNonEditable, setIsEnquiryNonEditable] = useState(false);

	let familyDetailsObj = {
		namePreFix: "",
		firstName: "",
		lastName: "",
		paxPerHead: "",
	};

	const getEnquiryDetails = async () => {
		try {
			const response = await get(
				`/enqGroup-details?enquiryGroupId=${enquiryId}`
			);

			// set data for all fields
			validation.setFieldValue("priority", response.data.priorityId || "");
			validation.setFieldValue(
				"enquiryref",
				response.data.enquiryReferId || ""
			);
			validation.setFieldValue(
				"guestenquiryref",
				response.data.guestRefId || ""
			);
			validation.setFieldValue("adults", response.data.adults || "");
			validation.setFieldValue("childs", response.data.child || "");
			validation.setFieldValue("email", response.data.email || "");
			validation.setFieldValue("contact", response.data.contact || "");
			validation.setFieldValue("fullName", response.data.fullName || "");
			validation.setFieldValue("groupName", response.data.groupName || "");
			validation.setFieldValue("tourName", response.data.groupTourId || "");
			validation.setFieldValue(
				"numberoffamilyhead",
				response.data.familyHeadNo || ""
			);

			setIsEnquiryNonEditable(response.data.isEnquiryNonEditable);

			setLength(response.data.familyHeadNo);

			// if (Number(response.data.familyHeadNo) === 0) {
			const dataa = Array.from(
				{ length: Number(response.data.familyHeadNo) },
				() => ({
					...familyDetailsObj,
				})
			);

			familyHeadsFormik.setFieldValue("familyHeads", dataa);
			getFamilyHeads();
			// }
		} catch (error) {
			console.log(error);
		}
	};

	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [areFamilyHeadsDataSubmitting, setAreFamilyHeadsDataSubmitting] =
		useState(false);

	const [tourName, setTourName] = useState([]);

	const getTourName = async () => {
		try {
			const response = await get(`/group-tour-dropdown`);

			const mappedData = response.data.data.map((item) => ({
				value: item.groupTourId,
				label: item.tourName,
			}));
			setTourName(mappedData);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getTourName();
	}, []);

	const [priority, setPrioritt] = useState([]);

	const getPrioritt = async () => {
		try {
			const response = await get(`/priority-list`);

			const mappedData = response.data.data.map((item) => ({
				value: item.priorityId,
				label: item.priorityName,
			}));

			setPrioritt(mappedData);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getPrioritt();
	}, []);

	const [namePreFix, setNamePreFix] = useState([]);

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

	const [enquiryref, setEnquiryRef] = useState([]);

	const getEnquiryRef = async () => {
		try {
			const response = await get(`/enquiry-reference-list`);
			const mappedData = response.data.data.map((item) => ({
				value: item.enquiryReferId,
				label: item.enquiryReferName,
			}));
			setEnquiryRef(mappedData);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getEnquiryRef();
	}, []);

	const [guestenquiryref, setGuestEnquiryRef] = useState([]);

	const getGuestEnquiryRef = async () => {
		try {
			const response = await get(`/dropdown-guest-refId`);
			const mappedData = response.data.data.map((item) => ({
				value: item.guestRefId,
				label: item.firstName + " " + item.lastName +  " ( " + item.guestRefId + " ) ",
			}));
			setGuestEnquiryRef(mappedData);
		} catch (error) {
			console.log(error);
		}
	};
	// debugger
	useEffect(() => {
		getGuestEnquiryRef();
	}, []);

	const validation = useFormik({
		// enableReinitialize : use this flag when initial values needs to be changed
		enableReinitialize: true,

		initialValues: {
			priority: "",
			guestenquiryref: "",
			enquiryref: "",
			adults: "",
			childs: "",
			email: "",
			contact: "",
			fullName: "",
			groupName: "",
			tourName: "",
			numberoffamilyhead: "",
		},
		validationSchema: Yup.object({
			fullName: Yup.string().required("Enter Full Name"),
			groupName: Yup.string().required("Enter Group Name"),
			guestenquiryref: Yup.string().when("enquiryref", {
				is: (enquiryref) => enquiryref == 9,
				then: Yup.string().required("Enter the Guest Enquiry Reference"),
				otherwise: Yup.string(),
			}),
			numberoffamilyhead: Yup.string().required(
				"Enter The Number of family Head"
			),
			enquiryref: Yup.string().required("Enter the Enquiry Reference"),
			adults: Yup.string().required("Enter The Adults"),
			email: Yup.string().email("Please enter valid email address"),
			tourName: Yup.string().required("Enter Tour name"),
			contact: Yup.string()
				.required("Enter the Contact Number")
				.min(10, "Please enter correct contact number")
				.max(10, "Please enter correct contact number"),
		}),

		onSubmit: async (values) => {
			let data = {
				enquiryGroupId: enquiryId,
				fullName: values.fullName,
				contact: values.contact,
				mail: values.email,
				adults: values.adults,
				child: values.childs,
				enquiryReferId: values.enquiryref,
				priorityId: values.priority,
				groupTourId: values.tourName,
				guestRefId: values.guestenquiryref,
				groupName: values.groupName,
				familyHeadNo: values.numberoffamilyhead,
			};

			if (Number(values.adults) + Number(values.childs) <= 6) {
				try {
					setIsSubmitting(true);
					const response = await post(`/update-enq-group-tour`, data);
					setIsSubmitting(false);
					toast.success(response?.data?.message);

					dispatch(updateGroupNameGT(values.groupName));

					getEnquiryDetails();

					familyHeadsFormik.resetForm();

					// navigate(`/enquiry/${enquiryId}?activeTab=booking`);
				} catch (error) {
					setIsSubmitting(false);
					console.log(error);
				}
			} else {
				toast.error("Pax size cannot be more then 6 people");
			}
		},
	});

	useEffect(() => {
		getEnquiryDetails();
	}, [validation.values.namePreFix]);

	const customStyles = {
		control: (provided, state) => ({
			...provided,
			height: "34px", // Adjust the height to your preference
		}),
	};

	//get data from name

	const [familyHeadIndex, setFamilyHeadIndex] = useState(0);

	const familyHeadsFormik = useFormik({
		initialValues: {
			familyHeads: [],
		},
		validationSchema: Yup.object({
			familyHeads: Yup.array().of(
				Yup.object().shape({
					namePreFix: Yup.string().required("Name Prefix is Required"),
					firstName: Yup.string().required("Enter First Name"),
					lastName: Yup.string().required("Enter Last Name"),
					paxPerHead: Yup.string()
					.required("Enter Number of Pax")
					.test({
						name: "positiveAndAboveZero",
						test: function (value) {
							const floatValue = parseFloat(value);
							return floatValue > 0; // Check if the value is positive and above 0
						},
						message: "Pax No. must be valid & above 0",
					}),
				})
			),
		}),

		onSubmit: async (values) => {
			let data = {
				enquiryGroupId: enquiryId,
				familyHead: values.familyHeads.map((fHead) => ({
					preFixId: fHead.namePreFix,
					firstName: fHead.firstName,
					lastName: fHead.lastName,
					guestId: fHead.guestId,
					paxPerHead: fHead.paxPerHead,
				})),
			};

			try {
				setAreFamilyHeadsDataSubmitting(true);

				const response = await post(`/familyhead-details-gt`, data);

				dispatch(updateFamilyHeadDataCompletionStatus(true));

				toast.success(response?.data?.message);
				navigate(`/enquiry/${enquiryId}?activeTab=booking`);
			} catch (error) {
				console.log(error);
			} finally {
				setAreFamilyHeadsDataSubmitting(false);
			}
		},
	});

	const [searchTerm, setSearchTerm] = useState("");
	const [nameOptions, setNameOptions] = useState([]);

	// Simulating async data fetching (replace with actual API call)
	const fetchNameOptions = async () => {
		try {
			const response = await get(`guest-email?firstName=${searchTerm}`);
			if (response.data.data.length > 0) {
				setNameOptions(response.data.data);

				familyHeadsFormik.setFieldValue(
					`familyHeads[${familyHeadIndex}].firstName`,
					searchTerm
				);
			} else {
				setNameOptions([]);
				familyHeadsFormik.setFieldValue(
					`familyHeads[${familyHeadIndex}].firstName`,
					searchTerm
				);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (searchTerm.length > 2) {
			// Call the debouncedFetch function
			fetchNameOptions();
		} else {
			// Reset options when search term is less than or equal to 3 characters
			setNameOptions([]);
		}
	}, [searchTerm]);

	const handleNameChange = (selectedOption) => {
		if (selectedOption) {
			familyHeadsFormik.setFieldValue(
				`familyHeads[${familyHeadIndex}].firstName`,
				selectedOption.label
			);
			familyHeadsFormik.setFieldValue(
				`familyHeads[${familyHeadIndex}].guestId`,
				selectedOption.value
			);

			getGuestInfoByName(selectedOption.value);
		} else {
			familyHeadsFormik.setFieldValue(
				`familyHeads[${familyHeadIndex}].firstName`,
				""
			);
			familyHeadsFormik.setFieldValue(
				`familyHeads[${familyHeadIndex}].lastName`,
				""
			);
			familyHeadsFormik.setFieldValue(
				`familyHeads[${familyHeadIndex}].guestId`,
				""
			);
		}
	};

	//get guest info by name
	const getGuestInfoByName = async (name) => {
		try {
			const result = await get(`guest-info?guestId=${name}`);
			const { preFixId, lastName } = result.data;

			if (result.data) {
				familyHeadsFormik.setFieldValue(
					`familyHeads[${familyHeadIndex}].namePreFix`,
					preFixId ? preFixId : 1
				);
				familyHeadsFormik.setFieldValue(
					`familyHeads[${familyHeadIndex}].lastName`,
					lastName
				);
			}
		} catch (error) {
			console.log(error);
		}
	};

	// to get available seats left for trip starts

	const getAvailableSeates = (tourId) => {
		try {
			console.log(tourId);
		} catch (error) {
			console.log(error);
		}
	};
	// to get available seats left for trip end

	useEffect(() => {
		let element = document.getElementById("group-tour");
		if (element) {
			element.classList.add("mm-active1"); // Add the 'active' class to the element
		}
		return () => {
			if (element) {
				element.classList.remove("mm-active1"); // remove the 'active' class to the element when change to another page
			}
		};
	}, []);

	const getFamilyHeads = async () => {
		try {
			const response = await get(
				`/familyHead-list-gt?enquiryGroupId=${enquiryId}`
			);

			// set data for all fields
			const familyHeadsData = response.data.data;

			const finalData = familyHeadsData.map((fHead) => ({
				namePreFix: fHead.preFixId,
				firstName: fHead.firstName,
				lastName: fHead.lastName,
				paxPerHead: fHead.paxPerHead,
			}));

			if (familyHeadsData.length !== 0) {
				familyHeadsFormik.setFieldValue("familyHeads", finalData);
			}
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<>
			<div className="row">
				<div className="col-lg-12">
					<div className="card">
						<div className="card-body">
							<div className="basic-form">
								<div
									className="needs-validation"
									// onSubmit={(e) => {
									// 	e.preventDefault();
									// 	validation.handleSubmit();
									// 	return false;
									// }}
								>
									<div
										className="card-header pt-0 mb-2"
										style={{ paddingLeft: "0" }}
									>
										<div className="card-title h5">Journeys</div>
									</div>
									<div className="row">
										<div className="mb-2 col-lg-4 col-md-6 col-sm-6 col-xs-6">
											<label>
												Name of Group<span className="error-star">*</span>
											</label>
											<input
												type="text"
												className="form-control"
												placeholder=""
												name="groupName"
												value={validation.values.groupName}
												onChange={validation.handleChange}
												onBlur={validation.handleBlur}
												disabled={isEnquiryNonEditable}
												style={{
													backgroundColor: isEnquiryNonEditable
														? "#f3f3f3"
														: "",
												}}
											/>
											<ErrorMessageComponent
												errors={validation.errors}
												fieldName={"groupName"}
												touched={validation.touched}
												key={"groupName"}
											/>
										</div>


										<div className="col-lg-4 col-md-6 col-sm-6 col-xs-6">
											<label>
												Full Name
												<span className="error-star">*</span>
											</label>
											<input
												type="text"
												className="form-control"
												name="fullName"
												value={validation.values.fullName}
												onChange={validation.handleChange}
												onBlur={validation.handleBlur}
												disabled={isEnquiryNonEditable}
												style={{
													backgroundColor: isEnquiryNonEditable
														? "#f3f3f3"
														: "",
												}}
											/>
											<ErrorMessageComponent
												errors={validation.errors}
												fieldName={"fullName"}
												touched={validation.touched}
												key={"fullName"}
											/>
										</div>
										<div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
											<label className="form-label">
												Mail Id<span className="error-star"></span>
											</label>
											<input
												type="text"
												className="form-control"
												placeholder=""
												name="email"
												onChange={validation.handleChange}
												onBlur={validation.handleBlur}
												value={validation.values.email}
												disabled={isEnquiryNonEditable}
												style={{
													backgroundColor: isEnquiryNonEditable
														? "#f3f3f3"
														: "",
												}}
											/>
										</div>

										<div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
											<label className="form-label">
												Contact No.<span className="error-star">*</span>
											</label>
											<div className="d-flex">
												<input
													type="tel"
													className="form-control"
													placeholder=""
													name="contact"
													minLength={10}
													maxLength={10}
													onChange={validation.handleChange}
													onBlur={validation.handleBlur}
													value={validation.values.contact}
													disabled={isEnquiryNonEditable}
													style={{
														backgroundColor: isEnquiryNonEditable
															? "#f3f3f3"
															: "",
													}}
												/>
											</div>
											<ErrorMessageComponent
												errors={validation.errors}
												fieldName={"contact"}
												touched={validation.touched}
												key={"contact"}
											/>
										</div>

										<div className="card-header card-header-title">
											<div className="card-title h5">Tour Details</div>
										</div>
										<div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
											<label className="form-label">
												Tour Name<span className="error-star">*</span>
											</label>
											<Select
												styles={customStyles}
												className="basic-single"
												classNamePrefix="select"
												name="tourName"
												options={tourName}
												onChange={(selectedOption) => {
													validation.setFieldValue(
														"tourName",
														selectedOption ? selectedOption.value : ""
													);
													getAvailableSeates(selectedOption.value);
												}}
												onBlur={validation.handleBlur}
												value={tourName.find(
													(option) =>
														option.value === validation.values.tourName
												)}
												isDisabled={isEnquiryNonEditable}
											/>
											<ErrorMessageComponent
												errors={validation.errors}
												fieldName={"tourName"}
												touched={validation.touched}
												key={"tourName"}
											/>
										</div>
										<div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
											<div className="row">
												<div className="col-sm-6 pax-adults">
													<label>
														Pax(Adults)<span className="error-star">*</span>
													</label>
													<input
														type="number"
														name="adults"
														className="form-control w-60"
														max={6}
														min={1}
														onChange={validation.handleChange}
														onBlur={validation.handleBlur}
														value={validation.values.adults}
														disabled={isEnquiryNonEditable}
														style={{
															backgroundColor: isEnquiryNonEditable
																? "#f3f3f3"
																: "",
														}}
													/>
													<ErrorMessageComponent
														errors={validation.errors}
														fieldName={"adults"}
														touched={validation.touched}
														key={"adults"}
													/>
												</div>
												<div className="col-sm-6 pax-child">
													<label>Pax(Children)</label>
													<input
														type="number"
														name="childs"
														className="form-control w-60"
														onChange={validation.handleChange}
														onBlur={validation.handleBlur}
														value={validation.values.childs}
														disabled={isEnquiryNonEditable}
														style={{
															backgroundColor: isEnquiryNonEditable
																? "#f3f3f3"
																: "",
														}}
													/>
													<ErrorMessageComponent
														errors={validation.errors}
														fieldName={"childs"}
														touched={validation.touched}
														key={"childs"}
													/>
												</div>
											</div>
										</div>

										<div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
											<label>
												Number of Family Heads
												<span className="error-star">*</span>
											</label>
											<input
												type="number"
												className="form-control"
												name="numberoffamilyhead"
												min={0}
												onChange={validation.handleChange}
												onBlur={validation.handleBlur}
												value={validation.values.numberoffamilyhead}
												disabled={isEnquiryNonEditable}
												style={{
													backgroundColor: isEnquiryNonEditable
														? "#f3f3f3"
														: "",
												}}
												ś
											/>
											{validation.touched.numberoffamilyhead &&
											validation.errors.numberoffamilyhead ? (
												<span className="error">
													{validation.errors.numberoffamilyhead}
												</span>
											) : null}
										</div>

										<div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
											<label>
												Enquiry Reference<span className="error-star">*</span>
											</label>
											<Select
												styles={customStyles}
												className="basic-single"
												classNamePrefix="select"
												name="enquiryref"
												options={enquiryref}
												onChange={(selectedOption) => {
													validation.setFieldValue(
														"enquiryref",
														selectedOption ? selectedOption.value : ""
													);
													if (selectedOption.value != 9) {
														validation.setFieldValue("guestenquiryref", "");
													}
												}}
												onBlur={validation.handleBlur}
												value={
													validation.values.enquiryref
														? enquiryref.find(
																(option) =>
																	option.value === validation.values.enquiryref
														  )
														: null
												}
												isDisabled={isEnquiryNonEditable}
											/>
											<ErrorMessageComponent
												errors={validation.errors}
												fieldName={"enquiryref"}
												touched={validation.touched}
												key={"enquiryref"}
											/>
										</div>
										{validation?.values?.enquiryref == 9 && (
											<div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
												<label>Guest Reference Id<span className="error-star">*</span></label>
												<Select
													styles={customStyles}
													className="basic-single"
													classNamePrefix="select"
													name="guestenquiryref"
													options={guestenquiryref}
													onChange={(selectedOption) => {
														validation.setFieldValue(
															"guestenquiryref",
															selectedOption ? selectedOption.value : ""
														);
													}}
													onBlur={validation.handleBlur}
													value={guestenquiryref.find(
														(option) =>
															option.value === validation.values.guestenquiryref
													)}
													isDisabled={isEnquiryNonEditable}
												/>
												<ErrorMessageComponent
													errors={validation.errors}
													fieldName={"guestenquiryref"}
													touched={validation.touched}
													key={"guestenquiryref"}
												/>
											</div>
										)}

										<div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
											<label className="form-label">Priority</label>
											<Select
												styles={customStyles}
												className="basic-single"
												classNamePrefix="select"
												name="priority"
												options={priority}
												onChange={(selectedOption) => {
													validation.setFieldValue(
														"priority",
														selectedOption ? selectedOption.value : ""
													);
												}}
												onBlur={validation.handleBlur}
												value={priority.find(
													(option) =>
														option.value === validation.values.priority
												)}
												isDisabled={isEnquiryNonEditable}
											/>
										</div>
									</div>
									<div className="mb-2 mt-2 row">
										<div className="col-lg-12 d-flex justify-content-end">
											<button
												type="button"
												onClick={validation.handleSubmit}
												className="btn btn-submit btn-primary"
												disabled={isSubmitting || isEnquiryNonEditable}
											>
												{isSubmitting ? "Saving..." : "Save"}
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Family Heads Form */}
					{familyHeadsFormik.values.familyHeads?.length > 0 &&
						namePreFix.length > 0 && (
							<div
								className="needs-validation"
								// onSubmit={(e) => {
								// 	e.preventDefault();
								// 	familyHeadsFormik.handleSubmit();
								// 	return false;
								// }}
							>
								<div className="card">
									<div className="card-body">
										<div className="table-responsive">
											<table className="table table-bordered table-responsive-sm table-tour">
												<thead>
													<th style={{width:"10%"}}>Sr.</th>
													<th style={{width:"60%"}}>Name of family head</th>
													<th style={{width:"15%"}}>Number of pax</th>
													<th style={{width:"15%"}}></th>
												</thead>
												<tbody>
													<>
														{familyHeadsFormik.values.familyHeads?.length > 0 &&
														namePreFix.length > 0
															? familyHeadsFormik.values?.familyHeads.map(
																	(familyHead, index) => (
																		<tr key={index}>
																			<td>{index + 1}</td>
																			<td>
																				<div className="family-packages">
																				<div className="family-1">
																						<Select
																							styles={customStyles}
																							className="basic-single select-salution basic-width1"
																							classNamePrefix="select"
																							options={namePreFix}
																							id={`familyHeads[${index}].namePreFix`}
																							name={`familyHeads[${index}].namePreFix`}
																							onChange={(selectedOption) => {
																								familyHeadsFormik.setFieldValue(
																									`familyHeads[${index}].namePreFix`,

																									selectedOption
																										? selectedOption.value
																										: ""
																								);
																							}}
																							onBlur={
																								familyHeadsFormik.handleBlur
																							}
																							value={namePreFix.find(
																								(option) =>
																									option.value ==
																									familyHead.namePreFix
																							)}
																						/>

																						{familyHeadsFormik.touched
																							.familyHeads &&
																							familyHeadsFormik.touched
																								.familyHeads[index]
																								?.namePreFix &&
																							familyHeadsFormik.errors &&
																							familyHeadsFormik.errors
																								.familyHeads &&
																							familyHeadsFormik.errors
																								.familyHeads[index]
																								?.namePreFix && (
																								<span className="error error-1">
																									{
																										familyHeadsFormik.errors
																											.familyHeads[index]
																											.namePreFix
																									}
																								</span>
																							)}
																					</div>
																					<div className="family-2">
																						<Select
																							className="basic-single select-salution basic-width"
																							options={nameOptions.map(
																								(item) => ({
																									value: item.guestId,
																									label: item.firstName,
																								})
																							)}
																							isClearable
																							isSearchable
																							menuPlacement="top"
																							name={`familyHeads[${index}].firstName`}
																							placeholder="First Name"
																							onInputChange={(inputValue) => {
																								setSearchTerm(inputValue);
																								setFamilyHeadIndex(index);
																							}}
																							onChange={handleNameChange}
																							value={
																								nameOptions.find(
																									(item) =>
																										item.firstName ==
																										familyHead.firstName
																								)
																									? nameOptions.find(
																											(item) =>
																												item.firstName ==
																												familyHead.firstName
																									  )
																									: {
																											value:
																												familyHead.firstName,
																											label:
																												familyHead.firstName,
																									  }
																							}
																						/>

																						{familyHeadsFormik.touched
																							.familyHeads &&
																							familyHeadsFormik.touched
																								.familyHeads[index]
																								?.firstName &&
																							familyHeadsFormik.errors &&
																							familyHeadsFormik.errors
																								.familyHeads &&
																							familyHeadsFormik.errors
																								.familyHeads[index]
																								?.firstName && (
																								<span className="error error-1">
																									{
																										familyHeadsFormik.errors
																											.familyHeads[index]
																											.firstName
																									}
																								</span>
																							)}
																					</div>
																					<div className="family-3">
																						<input
																							type="text"
																							className="form-control"
																							name={`familyHeads[${index}].lastName`}
																							value={familyHead.lastName}
																							placeholder="Last Name"
																							onChange={
																								familyHeadsFormik.handleChange
																							}
																							onBlur={
																								familyHeadsFormik.handleBlur
																							}
																						/>
																						{familyHeadsFormik.touched
																							.familyHeads &&
																							familyHeadsFormik.touched
																								.familyHeads[index]?.lastName &&
																							familyHeadsFormik.errors &&
																							familyHeadsFormik.errors
																								.familyHeads &&
																							familyHeadsFormik.errors
																								.familyHeads[index]
																								?.lastName && (
																								<span className="error">
																									{
																										familyHeadsFormik.errors
																											.familyHeads[index]
																											.lastName
																									}
																								</span>
																							)}
																					</div>
																				</div>
																				
																			</td>

																			<td>
																				<div className="col-md-12 col-12" style={{textAlign:"left"}}>
																					<input
																						placeholder="Number Of Pax"
																						type="text"
																						className="form-control"
																						name={`familyHeads[${index}].paxPerHead`}
																						value={familyHead.paxPerHead}
																						onChange={
																							familyHeadsFormik.handleChange
																						}
																						onBlur={
																							familyHeadsFormik.handleBlur
																						}
																					/>
																					{familyHeadsFormik.touched
																						.familyHeads &&
																						familyHeadsFormik.touched
																							.familyHeads[index]?.paxPerHead &&
																						familyHeadsFormik.errors &&
																						familyHeadsFormik.errors
																							.familyHeads &&
																						familyHeadsFormik.errors
																							.familyHeads[index]
																							?.paxPerHead && (
																							<span className="error">
																								{
																									familyHeadsFormik.errors
																										.familyHeads[index]
																										.paxPerHead
																								}
																							</span>
																						)}
																				</div>
																			</td>

																			{index === 0 ? (
																				<td
																					rowSpan={
																						familyHeadsFormik.values.familyHeads
																							?.length
																					}
																				>
																					<button
																						type="button"
																						onClick={
																							familyHeadsFormik.handleSubmit
																						}
																						disabled={
																							areFamilyHeadsDataSubmitting
																						}
																						className="btn btn-primary filter-btn mt-0"
																					>
																						{areFamilyHeadsDataSubmitting
																							? "Submitting"
																							: "Submit"}
																					</button>
																				</td>
																			) : (
																				""
																			)}
																		</tr>
																	)
															  )
															: ""}
													</>
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
						)}
				</div>
			</div>
		</>
	);
};
export default Journeys;
