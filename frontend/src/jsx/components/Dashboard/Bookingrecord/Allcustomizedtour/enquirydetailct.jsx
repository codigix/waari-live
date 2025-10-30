import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { get, post } from "../../../../../services/apiServices";
import ErrorMessageComponent from "../../FormErrorComponent/ErrorMessageComponent";
import "react-toastify/dist/ReactToastify.css";

const Enquirydetailct = () => {
	const { id } = useParams();
	const [isLoading, setIsLoading] = useState(false);
	const [countryId, setCountryId] = useState("");
	const navigate = useNavigate();
	const [cities, setCities] = useState([]);
	const [dataToPatch, setDataToPatch] = useState(null);

	//get data for edit
	const getEditData = async () => {
		try {
			const result = await get(`get-enquiry-ct?enquiryCustomId=${id}`);
			setDataToPatch(result.data);
			setCalculatedDays(result.data.days);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getEditData();
	}, []);

	const [destination, setDestination] = useState([]);
	const getDestinationId = async () => {
		try {
			const response = await get(`/destination-list`);

			const mappedData = response.data.data.map((item) => ({
				value: item.destinationId,
				label: item.destinationName,
			}));
			setDestination(mappedData);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getDestinationId();
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

	const [hotel, setHotel] = useState([]);

	const getHotel = async () => {
		try {
			const response = await get(`/dropdown-hotel-cat`);

			const mappedData = response.data.data.map((item) => ({
				value: item.hotelCatId,
				label: item.hotelCatName,
			}));
			setHotel(mappedData);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getHotel();
	}, []);

	const [mealplan, setMealPlan] = useState([]);

	const getMealPlanId = async () => {
		try {
			const response = await get(`/meal-plan-list`);

			const mappedData = response.data.data.map((item) => ({
				value: item.mealPlanId,
				label: item.mealPlanName,
			}));
			setMealPlan(mappedData);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getMealPlanId();
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

	const validation = useFormik({
		// enableReinitialize : use this flag when initial values needs to be changed
		enableReinitialize: true,

		initialValues: {
			note: dataToPatch?.notes ? dataToPatch?.notes : "",
			nextfollowup: dataToPatch?.nextFollowUp ? dataToPatch?.nextFollowUp : "",
			priority: dataToPatch?.priorityId ? dataToPatch?.priorityId : "",
			guestref: dataToPatch?.guestRefId ? dataToPatch?.guestRefId : "",
			destination: dataToPatch?.destinationId ? dataToPatch?.destinationId : "",
			enquiryref: dataToPatch?.enquiryReferId
				? dataToPatch?.enquiryReferId
				: "",
			numberoffamilyhead: dataToPatch?.familyHeadNo
				? dataToPatch?.familyHeadNo
				: "",
			mealplan: dataToPatch?.mealPlanId ? dataToPatch?.mealPlanId : "",
			totalextrabed: dataToPatch?.extraBed ? dataToPatch?.extraBed : "",
			totalrooms: dataToPatch?.rooms ? dataToPatch?.rooms : "",
			childrenages: dataToPatch?.age || [],
			adults: dataToPatch?.adults ? dataToPatch?.adults : "",
			child: dataToPatch?.child ? dataToPatch?.child : "",
			hotel: dataToPatch?.hotelCatId ? dataToPatch?.hotelCatId : "",
			nights: dataToPatch?.nights ? dataToPatch?.nights : "",
			days: dataToPatch?.days ? dataToPatch?.days : "",
			state: dataToPatch?.stateId ? dataToPatch?.stateId : "",
			departurecountry: dataToPatch?.countryId ? dataToPatch?.countryId : "", // It's not clear where this value comes from in your object
			contact: dataToPatch?.contact ? dataToPatch?.contact : "",

			nameofcontact: dataToPatch?.contactName ? dataToPatch?.contactName : "",
			namePreFix: dataToPatch?.preFixId ? dataToPatch?.preFixId : "",
			fullName: dataToPatch?.fullName ? dataToPatch?.fullName : "",

			nameofgroup: dataToPatch?.groupName ? dataToPatch?.groupName : "",
			tourstartdate: dataToPatch?.startDate ? dataToPatch?.startDate : "",
			tourenddate: dataToPatch?.endDate ? dataToPatch?.endDate : "",
			cities: dataToPatch?.cities
				? cities.filter((option) => {
						const parsedCities = JSON.parse(dataToPatch?.cities || "[]");
						return (
							Array.isArray(parsedCities) && parsedCities.includes(option.value)
						);
				  })
				: [],
		},
		validationSchema: Yup.object({
			nextfollowup: Yup.string().required("Enter The Next Follow Up"),

			enquiryref: Yup.string().required("Enter The Enquiry Reference"),
			destination: Yup.string().required("Enter The Destination"),
			departurecountry: Yup.string().required("Country is required"),
			numberoffamilyhead: Yup.string().required(
				"Enter The Number of family Head"
			),
			mealplan: Yup.string().required("Enter The Meal Plan"),
			totalrooms: Yup.string().required("Enter The Total Rooms"),
			cities: Yup.array()
				.min(1, "Select at least one city")
				.required("Select Cities"),
			childrenages: Yup.array().when("child", {
				is: (value) => value > 0,
				then: Yup.array()
					.of(
						Yup.number()
							.typeError("Age must be a number")
							.required("Age is required")
							.min(1, "Age must be at least 1")
							.max(18, "Age cannot exceed 18")
					)
					.required("At least one child age is required"),
				else: Yup.array().notRequired(),
			}),

			adults: Yup.string().required("Enter The Passengers"),
			hotel: Yup.string().required("Enter The Hotels Category"),
			contact: Yup.string()
				.required("Enter The Contact")
				.min(10, "Enter valid number")
				.max(10, "Enter valid number"),
			// nameofcontact: Yup.string()
			// .required("Enter The Name of Contact")
			// .min(4, "Name should be atleast 4 characters."),
			fullName: Yup.string().required("Enter Full Name"),
			nameofgroup: Yup.string().required("Enter The Name of Group"),
			tourstartdate: Yup.string().required("Enter The Tour Start Date"),
			tourenddate: Yup.string().required("Enter The Tour End Date"),
		}),

		onSubmit: async (values) => {
			let data = {
				groupName: values.nameofgroup,
				fullName: values.fullName,
				destinationId: values.destination,
				contact: values.contact,
				startDate: values.tourstartdate,
				endDate: values.tourenddate,
				stateId: Number(values.state),
				nights: calcutedDays - 1,
				days: calcutedDays,
				hotelCatId: values.hotel,
				adults: values.adults,
				child: values.child,
				age: values.childrenages,
				rooms: values.totalrooms,
				extraBed: values.totalextrabed,
				mealPlanId: values.mealplan,
				familyHeadNo: values.numberoffamilyhead,
				priorityId: values.priority,
				nextFollowUp: values.nextfollowup,
				enquiryReferId: values.enquiryref,
				guestRefId: values.guestref,
				notes: values.note,
				countryId: Number(values.departurecountry),
				cities: values.cities.map((item) => item.value),
				enquiryCustomId: id,
			};

			try {
				setIsLoading(true);
				const response = await post(`/update-enquiry-custom-details`, data);
				setIsLoading(false);
				toast.success(response?.data?.message);
				navigate("/customized-tour");
			} catch (error) {
				setIsLoading(false);
				console.log(error);
			}
		},
	});

	const [state, setDepartureState] = useState([]);
	const getDepartureStateTypeId = async () => {
		try {
			const data = {
				countryId:
					validation?.values?.destination == "1" ? "1" : countryId?.value,
			};
			const response = await get(`/state-list`, data);
			const mappedData = response.data.data.map((item) => ({
				value: item.stateId,
				label: item.stateName,
			}));
			setDepartureState(mappedData);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getDepartureStateTypeId();
	}, [countryId, validation?.values?.destination]);

	/* get city from api */

	const getCity = async () => {
		try {
			const response = await get(
				`/city-list?countryId=${validation.values.departurecountry}`
			);
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
	}, [
		validation.values.departurecountry,
		validation.values.state,
		validation.values.destination,
	]);

	/* end get city from api */

	const [departureCountry, setDepartureCountry] = useState([]);
	const getDepartureCountry = async () => {
		try {
			const response = await get(
				`/country?destinationId=${validation?.values?.destination}`
			);
			const mappedData = response.data.message.map((item) => ({
				value: item.countryId,
				label: item.countryName
					.split(" ")
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(" "),
			}));
			setDepartureCountry(mappedData);
			if (validation.values.destination == "1") {
				validation.setFieldValue("departurecountry", mappedData[0].value);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getDepartureCountry();
	}, [validation?.values?.destination]);

	const [calcutedDays, setCalculatedDays] = useState(0);
	const dayNightCal = async () => {
		if (validation.values.tourstartdate && validation.values.tourenddate) {
			const startDateObj = new Date(validation.values.tourstartdate);
			const endDateObj = new Date(validation.values.tourenddate);

			const timeDifference = endDateObj - startDateObj;
			const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
			setCalculatedDays(daysDifference + 1);
		}
	};

	useEffect(() => {
		dayNightCal();
	}, [validation.values]);

	const customStyles = {
		control: (provided, state) => ({
			...provided,
			height: "34px", // Adjust the height to your preference
		}),
	};
	useEffect(() => {
		// While view farmer page is active, the yadi tab must also activated
		const pathArray = window.location.href.split("/");
		const path = pathArray[pathArray.length - 1];
		let element = document.getElementById("customized-tour");
		if (element) {
			element.classList.add("mm-active1"); // Add the 'active' class to the element
		}
		return () => {
			if (element) {
				element.classList.remove("mm-active1"); // remove the 'active' class to the element when change to another page
			}
		};
	}, []);

	// to select the value from input tag start

	const getDestValueFromSelect = async (value) => {
		setCountryId(value);
		validation.setFieldValue("destination", value ? value.value : "");
		validation.setFieldValue("cities", []);
		validation.setFieldValue("state", "");
		setDataToPatch((r) => ({
			...r,
			destinationId: value.value,
			cities: "[]",
			state: "",
		}));
	};

	const getCountryValueFromSelect = async (value) => {
		setCountryId(value);
		validation.setFieldValue("departurecountry", value ? value.value : "");
		validation.setFieldValue("cities", []);
		validation.setFieldValue("state", "");
		setDataToPatch((r) => ({
			...r,
			countryId: value.value,
			cities: "[]",
			state: "",
		}));
	};

	// to select the value from input tag end
	useEffect(() => {
		const textarea = document.getElementById("notes");

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

	//GET GUEST REFERENCE
	const [guestenquiryref, setGuestEnquiryRef] = useState([]);

	const getGuestEnquiryRef = async () => {
		try {
			const response = await get(`/dropdown-guest-refId`);
			const mappedData = response.data.data.map((item) => ({
				value: item.guestRefId,
				label: item.firstName + " " + item.lastName + " ( " + item.guestRefId + " ) "
			}));
			setGuestEnquiryRef(mappedData);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getGuestEnquiryRef();
	}, []);

	const handleGuestRefChange = (selectedOption) => {
		validation.setFieldValue("guestref", selectedOption.value);
	};

	return (
		<>
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
							<div
								className="card-header mb-2 pt-0"
								style={{ paddingLeft: "0" }}
							>
								<div className="card-title h5">Enquiry Details</div>
							</div>
							<div className="row">
								<div className="mb-2 col-lg-4 col-md-6 col-sm-6 col-xs-6">
									<label className="form-label">
										Group name<span className="error-star">*</span>
									</label>
									<input
										type="text"
										className="form-control"
										placeholder=""
										name="nameofgroup"
										onChange={validation.handleChange}
										onBlur={validation.handleBlur}
										value={validation.values.nameofgroup}
										disabled
									/>
								</div>


								<div className="mb-2 col-lg-4 col-md-6 col-sm-6 col-xs-6">
									<label>
										Full Name
										<span className="error-star">*</span>
									</label>
									<input
										disabled
										type="text"
										className="form-control"
										placeholder="Full Name"
										name="fullName"
										value={validation.values.fullName}
										onChange={validation.handleChange}
										onBlur={validation.handleBlur}
									/>
								</div>

								<div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
									<label>
										Contact Number<span className="error-star">*</span>
									</label>
									<input
										disabled
										type="tel"
										className="form-control"
										name="contact"
										minLength={10}
										maxLength={10}
										onChange={validation.handleChange}
										onBlur={validation.handleBlur}
										value={validation.values.contact}
									/>
								</div>
								<div className="card-header card-header-title">
									<div className="card-title h5">Tour Details</div>
								</div>
								<div className="mb-2 col-lg-2 col-md-4 col-sm-6 col-xs-6">
									<label className="form-label">
										Select Destination<span className="error-star">*</span>
									</label>
									<Select
										styles={customStyles}
										className="basic-single"
										classNamePrefix="select"
										name="destination"
										options={destination}
										onChange={(e) => getDestValueFromSelect(e)}
										onBlur={validation.handleBlur}
										value={destination.find(
											(option) => option.value === validation.values.destination
										)}
										isDisabled
									/>
								</div>

								<div className="mb-2 col-lg-2 col-md-4 col-sm-6 col-xs-6">
									<label className="form-label">
										Select Country<span className="error-star">*</span>
									</label>
									<Select
										styles={customStyles}
										id="country"
										name="departurecountry"
										className="basic-single"
										classNamePrefix="select"
										options={departureCountry}
										onChange={(e) => getCountryValueFromSelect(e)}
										onBlur={validation.handleBlur}
										value={
											departureCountry.find(
												(option) =>
													option.value === validation.values.departurecountry
											)
												? departureCountry.find(
														(option) =>
															option.value ===
															validation.values.departurecountry
												  )
												: null
										}
										isDisabled
									/>
								</div>

								<div className="mb-2 col-lg-2 col-md-4 col-sm-6 col-xs-6">
									<label className="form-label">Select State</label>
									<Select
										isDisabled
										styles={customStyles}
										className="basic-single"
										classNamePrefix="select"
										name="state"
										options={state}
										onChange={(selectedOption) => {
											validation.setFieldValue("state", selectedOption.value); // Extract the 'value' property
											setDataToPatch((r) => ({
												...r,
												state: selectedOption.value,
												cities: "[]",
											}));
										}}
										onBlur={validation.handleBlur}
										value={
											state.find(
												(option) => option.value === validation.values.state
											)
												? state.find(
														(option) => option.value === validation.values.state
												  )
												: null
										}
									/>
								</div>
								<div className="mb-2 col-lg-6 col-md-8 col-sm-6 col-xs-6">
									<label className="form-label">
										Select Cities<span className="error-star">*</span>
									</label>
									<Select
										isDisabled
										isMulti
										styles={customStyles}
										className="basic-multi-select"
										classNamePrefix="select"
										name="cities"
										options={cities}
										onChange={(selectedOptions) =>
											validation.setFieldValue("cities", selectedOptions)
										}
										onBlur={validation.handleBlur}
										value={validation.values.cities}
									/>
								</div>
								<div className="mb-2 col-lg-3 col-md-4 col-sm-6 col-xs-6">
									<label>
										Tour Start Date<span className="error-star">*</span>
									</label>
									<input
										disabled
										type="date"
										className="form-control"
										name="tourstartdate"
										min={new Date().toISOString().split("T")[0]}
										onChange={validation.handleChange}
										onBlur={validation.handleBlur}
										value={validation.values.tourstartdate}
									/>
								</div>
								<div className="mb-2 col-lg-3 col-md-4 col-sm-6 col-xs-6">
									<label>
										Tour End Date<span className="error-star">*</span>
									</label>
									<input
										disabled
										type="date"
										className="form-control"
										name="tourenddate"
										min={new Date().toISOString().split("T")[0]}
										onChange={validation.handleChange}
										onBlur={validation.handleBlur}
										value={validation.values.tourenddate}
									/>
								</div>

								<div className="mb-2 col-lg-3 col-md-4 col-sm-6 col-xs-6">
									<div className="row">
										<div className="col-sm-6 pax-adults">
											<label>
												Durations(Nights)
												<span className="error-star">*</span>
											</label>
											<input
												disabled
												type="number"
												name="nights"
												min={0}
												className="form-control w-60"
												value={calcutedDays == 0 ? 0 : calcutedDays - 1}
												// onChange={validation.handleChange}
												// onBlur={validation.handleBlur}
												// value={validation.values.nights}
											/>
										</div>
										<div className="col-sm-6 pax-child">
											<label>
												Durations(Days)<span className="error-star">*</span>
											</label>
											<input
												disabled
												type="text"
												name="days"
												className="form-control w-60"
												value={calcutedDays == 0 ? 0 : calcutedDays}
												// onChange={validation.handleChange}
												// onBlur={validation.handleBlur}
												// value={validation.values.days}
											/>
										</div>
									</div>
								</div>

								<div className="mb-2 col-lg-3 col-md-4 col-sm-6 col-xs-6">
									<div className="row">
										<div className="col-sm-6 pax-adults">
											<label>
												Pax(Adults)<span className="error-star">*</span>
											</label>
											<input
												disabled
												type="number"
												name="adults"
												className="form-control w-60"
												min={0}
												onChange={validation.handleChange}
												onBlur={validation.handleBlur}
												value={validation.values.adults}
											/>
										</div>

										<div className="col-sm-6 pax-child">
											<label>Pax(Childrens)</label>
											<input
												disabled
												type="number"
												name="child"
												className="form-control w-60"
												min={0}
												//onChange={validation.handleChange}
												onChange={(e) => {
													validation.handleChange(e);
													validation.setFieldValue(
														"childrenages",
														Array.from({ length: e.target.value })
													);
												}}
												onBlur={validation.handleBlur}
												value={validation.values.child}
											/>
										</div>
									</div>
								</div>
								{validation.values.childrenages &&
									validation.values.childrenages.length > 0 && (
										<div className="mb-2 col-lg-6 col-md-6 col-sm-6 col-xs-6">
											<label>Childrens Ages</label>
											<div className="child-row">
												{validation.values.childrenages.map((item, index) => (
													<React.Fragment key={index}>
														<div className="child-input">
															<input
																disabled
																type="number"
																className="form-control"
																min={0}
																max={20} // Added max attribute
																name={`childrenages[${index}]`}
																onChange={validation.handleChange}
																onBlur={validation.handleBlur}
																value={item}
															/>
														</div>
													</React.Fragment>
												))}
											</div>
										</div>
									)}

								<div className="mb-2 col-lg-3 col-md-4 col-sm-6 col-xs-6">
									<label className="form-label">
										{" "}
										Hotel Category<span className="error-star">*</span>
									</label>
									<Select
										isDisabled
										styles={customStyles}
										className="basic-single"
										classNamePrefix="select"
										// isLoading={isLoading}
										// isClearable={isClearable}
										// isSearchable={isSearchable}
										name="hotel"
										options={hotel}
										// onChange={validation.handleChange}
										// onBlur={validation.handleBlur}
										// value={validation.values.hotel}
										onChange={(selectedOption) => {
											validation.setFieldValue(
												"hotel",
												selectedOption ? selectedOption.value : ""
											); // Extract the 'value' property
										}}
										onBlur={validation.handleBlur}
										value={hotel.find(
											(option) => option.value === validation.values.hotel
										)}
									/>
								</div>
								<div className="mb-2 col-lg-3 col-md-4 col-sm-6 col-xs-6">
									<label>
										{" "}
										Total rooms required
										<span className="error-star">*</span>
									</label>
									<input
										disabled
										type="number"
										name="totalrooms"
										className="form-control"
										min={0}
										onChange={validation.handleChange}
										onBlur={validation.handleBlur}
										value={validation.values.totalrooms}
									/>
								</div>
								<div className="mb-2 col-lg-3 col-md-4 col-sm-6 col-xs-6">
									<label>Total extra bed required</label>
									<input
										disabled
										type="number"
										name="totalextrabed"
										className="form-control"
										min={0}
										onChange={validation.handleChange}
										onBlur={validation.handleBlur}
										value={validation.values.totalextrabed}
									/>
								</div>
								<div className="mb-2 col-lg-3 col-md-4 col-sm-6 col-xs-6">
									<label className="form-label">
										Meal Plan<span className="error-star">*</span>
									</label>
									<Select
										isDisabled
										styles={customStyles}
										className="basic-single"
										classNamePrefix="select"
										// isLoading={isLoading}
										// isClearable={isClearable}
										// isSearchable={isSearchable}
										name="mealplan"
										options={mealplan}
										// onChange={validation.handleChange}
										// onBlur={validation.handleBlur}
										// value={validation.values.mealplan}
										onChange={(selectedOption) => {
											validation.setFieldValue(
												"mealplan",
												selectedOption ? selectedOption.value : ""
											); // Extract the 'value' property
										}}
										onBlur={validation.handleBlur}
										value={mealplan.find(
											(option) => option.value === validation.values.mealplan
										)}
									/>
								</div>
								<div className="mb-2 col-lg-3 col-md-4 col-sm-6 col-xs-6">
									<label>
										Number of Family Heads<span className="error-star">*</span>
									</label>
									<input
										disabled
										type="number"
										className="form-control"
										name="numberoffamilyhead"
										min={0}
										onChange={validation.handleChange}
										onBlur={validation.handleBlur}
										value={validation.values.numberoffamilyhead}
									/>
								</div>
								<div className="mb-2 col-lg-3 col-md-4 col-sm-6 col-xs-6">
									<label>
										Reference<span className="error-star">*</span>
									</label>
									<Select
										isDisabled
										styles={customStyles}
										className="basic-single"
										classNamePrefix="select"
										name="enquiryref"
										options={enquiryref}
										onChange={(selectedOption) =>
											getGuestEnquiryRef(selectedOption)
										}
										onBlur={validation.handleBlur}
										value={enquiryref.find(
											(option) => option.value === validation.values.enquiryref
										)}
									/>
								</div>
								{validation?.values?.enquiryref == 9 && (
									<div className="mb-2 col-lg-3 col-md-4 col-sm-6 col-xs-6">
										<label>Guest Reference Id<span className="error-star">*</span></label>
										<Select
											isDisabled
											styles={customStyles}
											className="basic-single"
											classNamePrefix="select"
											name="guestref"
											options={guestenquiryref}
											onChange={(selectedOption) =>
												handleGuestRefChange(selectedOption)
											}
											onBlur={validation.handleBlur}
											value={guestenquiryref.find(
												(option) => option.value === validation.values.guestref
											)}
										/>
									</div>
								)}
								<div className="mb-2 col-lg-3 col-md-4 col-sm-6 col-xs-6">
									<label className="form-label">Priority</label>
									<Select
										isDisabled
										styles={customStyles}
										className="basic-single"
										classNamePrefix="select"
										// isLoading={isLoading}
										// isClearable={isClearable}
										// isSearchable={isSearchable}
										name="priority"
										options={priority}
										// onChange={validation.handleChange}
										// onBlur={validation.handleBlur}
										// value={validation.values.priority}
										onChange={(selectedOption) => {
											validation.setFieldValue(
												"priority",
												selectedOption ? selectedOption.value : ""
											); // Extract the 'value' property
										}}
										onBlur={validation.handleBlur}
										value={priority.find(
											(option) => option.value === validation.values.priority
										)}
									/>
								</div>
								<div className="mb-2 col-lg-3 col-md-4 col-sm-6 col-xs-6">
									<label className="form-label">
										Next Follow-up<span className="error-star">*</span>
									</label>
									<input
										disabled
										type="date"
										className="form-control"
										name="nextfollowup"
										min={new Date().toISOString().split("T")[0]}
										onChange={validation.handleChange}
										onBlur={validation.handleBlur}
										value={validation.values.nextfollowup}
									/>
								</div>
								<div className="mb-2 col-md-12">
									<label className="form-label">Notes</label>
									<textarea
										disabled
										type="text"
										className="textarea"
										id="notes"
										name="note"
										rows={2}
										onChange={validation.handleChange}
										onBlur={validation.handleBlur}
										value={validation.values.note}
									/>
								</div>
							</div>
							<div className="mb-2 mt-2 row">
								<div className="col-lg-12 d-flex justify-content-between">
									<Link
										to="/all-booking-custom-tour-new"
										type="submit"
										className="btn btn-back"
									>
										Back
									</Link>
									{/* <button
										type="submit"
										className="btn btn-submit btn-primary"
										disabled={isLoading}
									>
										{isLoading ? "Submitting" : "Submit"}
									</button> */}
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};
export default Enquirydetailct;
