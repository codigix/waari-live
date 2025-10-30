import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { get, post } from "../../../../../services/apiServices";
import ErrorMessageComponent from "../../FormErrorComponent/ErrorMessageComponent";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip } from "@mui/material";
import EditPackageDataPopup from "../../common/EditPackageDataPopup";
import PopupModal from "../../Popups/PopupModal";
import { hasComponentPermission } from "../../../../auth/PrivateRoute";
import { useSelector } from "react-redux";

const Journeyct = ({ enquiryId }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [areFamilyHeadsDataSubmitting, setAreFamilyHeadsDataSubmitting] =
		useState(false);

	const [countryId, setCountryId] = useState("");
	const navigate = useNavigate();
	const [cities, setCities] = useState([]);
	const [dataToPatch, setDataToPatch] = useState(null);
const {permissions} = useSelector(state => state.auth)
	//get data for edit
	const getEditData = async () => {
		try {
			const result = await get(`get-enquiry-ct?enquiryCustomId=${enquiryId}`);
			setDataToPatch(result.data);
			setCalculatedDays(result.data.days);

			let familyDetailsObj = {
				namePreFix: "",
				firstName: "",
				lastName: "",
				paxPerHead: "",
			};

			// if (Number(result.data.familyHeadNo) === 0) {
			const dataa = Array.from(
				{ length: Number(result.data.familyHeadNo) },
				() => ({
					...familyDetailsObj,
				})
			);

			familyHeadsFormik.setFieldValue("familyHeads", dataa);
			getFamilyHeads();
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

			// nameofcontact: dataToPatch?.contactName ? dataToPatch?.contactName : "",
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


	//GET GUEST REFERENCE
	const [guestenquiryref, setGuestEnquiryRef] = useState([]);

	const getGuestEnquiryRef = async (selectedOption) => {
		validation.setFieldValue(
			"enquiryref",
			selectedOption ? selectedOption.value : ""
		);
		if (selectedOption.value == 9) {
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
		} else {
			validation.setFieldValue("guestref", "");
		}
	};

	const handleGuestRefChange = (selectedOption) => {
		validation.setFieldValue("guestref", selectedOption.value);
	};

	const getFamilyHeads = async () => {
		try {
			const response = await get(
				`/familyHead-list-ct?enquiryCustomId=${enquiryId}`
			);

			// set data for all fields
			const familyHeadsData = response.data.data;

			const finalData = familyHeadsData.map((fHead) => ({
				guestId: fHead.guestId,
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

	const familyHeadsFormik = useFormik({
		initialValues: {
			familyHeads: [],
		},
		validationSchema: Yup.object({
			familyHeads: Yup.array().of(
				Yup.object().shape({
					namePreFix: Yup.string().required("Prefix is Required"),
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

	});



	// to get package list start
	const [packageList, setPackageList] = useState([]);

	const getPackageList = async () => {
		try {
			setIsLoading(true);
			const response = await get(`package-list?enquiryCustomId=${enquiryId}`);
			setPackageList(response?.data?.data);

		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getPackageList();
	}, []);

    // Edit Finalied Package
    const [editPackagePopup, setEditPackagePopup] = useState(false);
    const [editPackageData, setEditPackageData] = useState(null);

    function handleDialogClose2() {
        setEditPackagePopup(false);
    }

	return (
		<>
            {editPackagePopup && (
                <PopupModal open={true} onDialogClose={handleDialogClose2}>
                    <EditPackageDataPopup
                        editPackageData={editPackageData}
                        onClose={handleDialogClose2}
                        enquiryId={enquiryId}
                        getPackageList={getPackageList}
                    />
                </PopupModal>
            )}

			<div className="card">
				<div className="card-body">
					<div className="basic-form">
						<form
							className="needs-validation"
						>
							<div className="card-header mb-2 pt-0" style={{ paddingLeft: "0" }}>
								<div className="card-title h5">Old Packages Details</div>
							</div>
							<div className="row mt-3">
								{packageList.length > 0 ?
									packageList?.map((item, index) => {
										return (
											<>
												<div className="col-md-6 col-lg-3 col-sm-12">
													<div className="packages-details">
														<div className="row">
															<div className="col-md-12">
																<div className="mb-2 d-flex" style={{ justifyContent: "space-between" }}>
																	<label className="form-label d-flex align-items-center p-1" style={{ fontWeight: "600" }}>
																		Packages Option {index + 1}
																	</label>
																	<Tooltip title="View PDF">
																	<Link
																		className="document-link ms-2 me-2"
																		to={item?.package}
																		target="_blank"
																	>
																		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1.2rem" height="1.1rem" style={{fill:"#059299"}}>
																		<path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg>
																	</Link>
																	</Tooltip>
																</div>

																<div className="package-form">
																	<div className="form-group  d-flex justify-content-between">
																		<label className="form-label d-flex align-items-center   p-1">
																			Adults
																		</label>
																		<h6
																			className="packages-text text-nowrap"

																		>
																			₹ {item?.adult}
																		</h6>
																	</div>
																	<div className="form-group  d-flex justify-content-between">
																		<label className="form-label d-flex align-items-center   p-1">
																			Extra Bed
																		</label>
																		<h6
																			className="packages-text text-nowrap"

																		>
																			₹ {item?.extraBed}
																		</h6>
																	</div>
																	<div className="form-group  d-flex justify-content-between">
																		<label className="form-label d-flex align-items-center   p-1">
																			Child Without Bed
																		</label>
																		<h6
																			className="packages-text text-nowrap"

																		>
																			₹ {item?.childWithout}
																		</h6>
																	</div>

																	<div className="mb-2 d-flex justify-content-end">
																		
																		{
																			item.isFinal == 1 && <div>
																				<button
																				type="button"
																				className="btn pdf-btn btn-secondary btn-submit btn-sm"
																				style={{ height: "32px", lineHeight: "1", margin: " 0px 10px 0px 0px" }}
																			>
																				Finalized
																			</button>
																			{
																			hasComponentPermission(permissions, 300) &&	<button type="button">
																				<div className="btn-edit-user ">
																					<Tooltip
																						title="Edit"
																						onClick={() => (
																							setEditPackagePopup(
																								true
																							),
																							setEditPackageData(
																								item
																							)
																						)}
																					>
																						<svg
																							xmlns="http://www.w3.org/2000/svg"
																							classname="svg-edit"
																							height="1em"
																							viewBox="0 0 512 512"
																						>
																							<path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" />
																						</svg>
																					</Tooltip>
																				</div>
																			</button>
																			}
																			</div>
																		}
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</>
										);
									}) : <div className="col-md-12">
									<div className="packages-details text-center">
										<p  className="mb-0">No data available</p>
										</div>
									</div>}
							</div >


						</form>
					</div>
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
							<div className="card-header pt-0 mb-2" style={{ paddingLeft: "0" }}>
								<div className="card-title h5">Journey Details</div>
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
										isDisabled
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
									/>
								</div>

								<div className="mb-2  col-lg-2 col-md-4 col-sm-6 col-xs-6">
									<label className="form-label">
										Select Country<span className="error-star">*</span>
									</label>
									<Select
										isDisabled
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
									// isDisabled={validation.values.destination == "1"}
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
												type="text"
												name="days"
												className="form-control w-60"
												value={calcutedDays == 0 ? 0 : calcutedDays}
												disabled
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
										<div className="mb-2 col-md-6">
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
								<div className="mb-2 col-md-3">
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
								<div className="mb-2 col-md-3">
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
											disabled
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
						</form>
					</div>
				</div>
			</div>

			{/* Family Heads Form */}
			{familyHeadsFormik.values.familyHeads?.length > 0 &&
				namePreFix.length > 0 && (
					<form
						className="needs-validation"
					>
						<div className="card">
							<div className="card-body">
								<div className="table-responsive">
									<table className="table table-bordered table-responsive-sm table-tour">
										<thead>
											<th style={{ width: "10%" }}>Sr.</th>
											<th style={{ width: "10%" }}>Guest Id</th>
											<th style={{ width: "75%" }}>Name of family head</th>
											<th style={{ width: "15%" }}>Number of pax</th>
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
																		<div className="col-md-12 col-12">
																			<input
																				type="text"
																				className="form-control"
																				name={`familyHeads[${index}].guestId`}
																				value={familyHead.guestId}
																				onChange={
																					familyHeadsFormik.handleChange
																				}
																				onBlur={familyHeadsFormik.handleBlur}
																				disabled
																			/>
																		</div>
																	</td>
																<td>
																	<div className="family-packages">
																		<div className="family-1">
																			<Select
																				isDisabled
																				styles={customStyles}
																				className="basic-single"
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
																				onBlur={familyHeadsFormik.handleBlur}
																				value={namePreFix.find(
																					(option) =>
																						option.value ==
																						familyHead.namePreFix
																				)}
																			/>

																			{familyHeadsFormik.touched
																				.familyHeads &&
																				familyHeadsFormik.touched.familyHeads[
																					index
																				]?.namePreFix &&
																				familyHeadsFormik.errors &&
																				familyHeadsFormik.errors
																					.familyHeads &&
																				familyHeadsFormik.errors.familyHeads[
																					index
																				]?.namePreFix && (
																					<span className="error">
																						{
																							familyHeadsFormik.errors
																								.familyHeads[index].namePreFix
																						}
																					</span>
																				)}
																		</div>

																		<div className="family-2">
																			<input
																				disabled
																				type="text"
																				className="form-control"
																				placeholder="First Name"
																				name={`familyHeads[${index}].firstName`}
																				value={familyHead.firstName}
																				onChange={
																					familyHeadsFormik.handleChange
																				}
																			/>
																			{familyHeadsFormik.touched
																				.familyHeads &&
																				familyHeadsFormik.touched.familyHeads[
																					index
																				]?.firstName &&
																				familyHeadsFormik.errors &&
																				familyHeadsFormik.errors
																					.familyHeads &&
																				familyHeadsFormik.errors.familyHeads[
																					index
																				]?.firstName && (
																					<span className="error">
																						{
																							familyHeadsFormik.errors
																								.familyHeads[index].firstName
																						}
																					</span>
																				)}
																		</div>

																		<div className="family-3">
																			<input
																				disabled
																				type="text"
																				className="form-control"
																				name={`familyHeads[${index}].lastName`}
																				value={familyHead.lastName}
																				placeholder="Last Name"
																				onChange={
																					familyHeadsFormik.handleChange
																				}
																				onBlur={familyHeadsFormik.handleBlur}
																			/>
																			{familyHeadsFormik.touched
																				.familyHeads &&
																				familyHeadsFormik.touched.familyHeads[
																					index
																				]?.lastName &&
																				familyHeadsFormik.errors &&
																				familyHeadsFormik.errors
																					.familyHeads &&
																				familyHeadsFormik.errors.familyHeads[
																					index
																				]?.lastName && (
																					<span className="error">
																						{
																							familyHeadsFormik.errors
																								.familyHeads[index].lastName
																						}
																					</span>
																				)}
																		</div>
																	</div>
																</td>

																<td>
																	<div className="col-md-12 col-12">
																		<input
																			disabled
																			placeholder="Number Of Pax"
																			type="text"
																			className="form-control"
																			name={`familyHeads[${index}].paxPerHead`}
																			value={familyHead.paxPerHead}
																			onChange={
																				familyHeadsFormik.handleChange
																			}
																			onBlur={familyHeadsFormik.handleBlur}
																		/>
																		{familyHeadsFormik.touched.familyHeads &&
																			familyHeadsFormik.touched.familyHeads[
																				index
																			]?.paxPerHead &&
																			familyHeadsFormik.errors &&
																			familyHeadsFormik.errors.familyHeads &&
																			familyHeadsFormik.errors.familyHeads[
																				index
																			]?.paxPerHead && (
																				<span className="error">
																					{
																						familyHeadsFormik.errors
																							.familyHeads[index].paxPerHead
																					}
																				</span>
																			)}
																	</div>
																</td>

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
					</form>
				)}
		</>
	);
};
export default Journeyct;
