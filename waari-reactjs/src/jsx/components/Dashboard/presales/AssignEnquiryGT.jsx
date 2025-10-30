import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { get, post } from "../../../../services/apiServices";
import "react-phone-number-input/style.css";
import ErrorMessageComponent from "../FormErrorComponent/ErrorMessageComponent";
import BackButton from "../../common/BackButton";

const AssignEnquiryGT = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	const [tourName, setTourName] = useState([]);
    const [assignUsersDropdown, setAssignUsersDropdown] = useState([]);
	const { id } = useParams();

    const getAssignUsersList = async () => {
        try {
            const response = await get(`/get-assign-to-users-list`);

            const mappedData = response.data.data.map((item) => ({
                value: item.userId,
                label: item.userName,
            }));
            setAssignUsersDropdown(mappedData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAssignUsersList();
    }, []);

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
				label: item.firstName + " " + item.lastName + " ( " + item.guestRefId + " ) ",
			}));
			
			setGuestEnquiryRef(mappedData);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getGuestEnquiryRef();
	}, []);

	const getEditData = async () => {
		try {
			const response = await get(`/view-plan-enq-users-data-gt?planEnqId=${id}`);
			const data = response.data.data
			
			validation.setFieldValue("fullName", data.firstName)
			validation.setFieldValue("contact", data.contactNo)
			validation.setFieldValue("tourname", data.groupTourId)
			validation.setFieldValue("groupName", data.groupName)
			validation.setFieldValue("adults", data.noOfTravelPeople)
			validation.setFieldValue("enquiryref", data.hearAbout)

		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getEditData();
	}, []);


	const validation = useFormik({
		// enableReinitialize : use this flag when initial values needs to be changed
		enableReinitialize: true,

		initialValues: {
			nextfollowup: "",
			nextFollowUpTime: "",
			priority: "",
			guestenquiryref: "",
			enquiryref: "",
			adults: "",
			childs: "",
			email: "",
			tourname: "",
			contact: "",
			fullName: "",
			groupName: "",
			numberoffamilyhead: "",
            assignTo: "",
		},
		validationSchema: Yup.object({
			nextfollowup: Yup.string().required("Next Follow Up date is required"),
			nextFollowUpTime: Yup.string().required("Follow time is required"),
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
			contact: Yup.string()
			.required("Enter the Contact Number")
			.min(10, "Please enter correct contact number")
			.max(10, "Please enter correct contact number"),
			assignTo: Yup.string().required("Select the user to assign"),
		}),

		onSubmit: async (values) => {
			let data = {
				nextFollowUp: values.nextfollowup,
				nextFollowUpTime: values.nextFollowUpTime,
				fullName: values.fullName,
				contact: values.contact,
				mail: values.email,
				adults: values.adults,
				child: values.childs,
				enquiryReferId: values.enquiryref,
				priorityId: values.priority,
				groupTourId: values.tourname,
				guestRefId: values.guestenquiryref,
				groupName: values.groupName,
				familyHeadNo: values.numberoffamilyhead,
				assignTo: values.assignTo,
			};

			if (Number(values.adults) + Number(values.childs) <= 6) {
				try {
					setIsLoading(true);
					const response = await post(`/assign-user-to-plan-enq-gt`, {...data, planEnqId: id });
					setIsLoading(false);
					toast.success(response?.data?.message);
					navigate("/presale-group-tour-new");
				} catch (error) {
					setIsLoading(false);
					console.log(error);
				}
			} else {
				toast.error("Pax size cannot be more then 6 people");
			}
		},
	});


	const customStyles = {
		control: (provided, state) => ({
			...provided,
			height: "34px", // Adjust the height to your preference
		}),
	};

	//get data from name

	const [searchTerm, setSearchTerm] = useState("");
	const [guestId, setGuestId] = useState("");
	const [nameOptions, setNameOptions] = useState([]);

	

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
		let element = document.getElementById("presale-group-tour-new");
		if (element) {
			element.classList.add("mm-active1"); // Add the 'active' className to the element
		}
		return () => {
			if (element) {
				element.classList.remove("mm-active1"); // remove the 'active' className to the element when change to another page
			}
		};
	}, []);

	console.log("validatoin", validation.values)


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
									<Link to="/presale-group-tour-new">Enquiry follow-up</Link>
								</li>
								<li className="breadcrumb-item  ">
									<Link to="#">Assign Group Tour</Link>
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
									<div className="card-header pt-0 mb-2" style={{ paddingLeft: "0" }}>
										<div className="card-title h5">Enquiry Details</div>
									</div>
									<div className="row">
										<div className="mb-2 col-lg-4 col-md-6 col-sm-6 col-xs-6">
											<label>
												Name of Group<span className="error-star">*</span>
											</label>
											<input
												type="text"
												className="form-control bg-light"
												placeholder=""
												name="groupName"
												value={validation.values.groupName}
												onChange={validation.handleChange}
												onBlur={validation.handleBlur}
												disabled
									
											/>
											<ErrorMessageComponent
												errors={validation.errors}
												fieldName={"groupName"}
												touched={validation.touched}
												key={"groupName"}
											/>
										</div>

									
										<div className="mb-2 col-lg-4 col-md-6 col-sm-6 col-xs-6">
											<label>
												Full Name
												<span className="error-star">*</span>
											</label>
											<input
												type="text"
												className="form-control bg-light"
												name="fullName"
												value={validation.values.fullName}
												onChange={validation.handleChange}
												onBlur={validation.handleBlur}
												disabled
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
												Contact No.<span className="error-star">*</span>
											</label>
											<div className="d-flex">
												<input
													type="tel"
													className="form-control bg-light"
													placeholder=""
													name="contact"
													minLength={10}
													maxLength={10}
													onChange={validation.handleChange}
													onBlur={validation.handleBlur}
													value={validation.values.contact}
													disabled
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
												name="tourname"
												options={tourName}
												onChange={(selectedOption) => {
													validation.setFieldValue(
														"tourname",
														selectedOption ? selectedOption.value : ""
													);
													getAvailableSeates(selectedOption.value);
												}}
												onBlur={validation.handleBlur}
												value={tourName.find(
													(option) =>
														option.value === validation.values.tourname
												)}
												isDisabled
											/>
											<ErrorMessageComponent
												errors={validation.errors}
												fieldName={"tourname"}
												touched={validation.touched}
												key={"tourname"}
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
														className="form-control w-60 bg-light"
														max={6}
														min={1}
														onChange={validation.handleChange}
														onBlur={validation.handleBlur}
														value={validation.values.adults}
														disabled
													/>
													<ErrorMessageComponent
														errors={validation.errors}
														fieldName={"adults"}
														touched={validation.touched}
														key={"adults"}
													/>
												</div>
												
											</div>
										</div>

										<div className="mb-2  col-lg-3 col-md-6 col-sm-6 col-xs-6">
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
																option.value == validation.values.enquiryref
														)
														: null
												}
												isDisabled
											/>
											<ErrorMessageComponent
												errors={validation.errors}
												fieldName={"enquiryref"}
												touched={validation.touched}
												key={"enquiryref"}
											/>
										</div>

										<div className="mb-2  col-lg-3 col-md-6 col-sm-6 col-xs-6">
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
											/>
											{validation.touched.numberoffamilyhead &&
												validation.errors.numberoffamilyhead ? (
												<span className="error">
													{validation.errors.numberoffamilyhead}
												</span>
											) : null}
										</div>

										
										

									

										<div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
											<label className="form-label">
												Next Follow-up<span className="error-star">*</span>
											</label>
											<input
												type="date"
												className="form-control"
												name="nextfollowup"
												min={new Date().toISOString().split("T")[0]}
												onChange={validation.handleChange}
												onBlur={validation.handleBlur}
												value={validation.values.nextfollowup}
											/>
											{validation.touched.nextfollowup &&
												validation.errors.nextfollowup ? (
												<span className="error">
													{validation.errors.nextfollowup}
												</span>
											) : null}
										</div>

										<div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
											<label className="form-label">
												Follow-up Time<span className="error-star">*</span>
											</label>
											<input
												type="time"
												className="form-control"
												name="nextFollowUpTime"
												min={new Date().toISOString().split("T")[0]}
												onChange={validation.handleChange}
												onBlur={validation.handleBlur}
												value={validation.values.nextFollowUpTime}
											/>
											{validation.touched.nextFollowUpTime &&
												validation.errors.nextFollowUpTime ? (
												<span className="error">
													{validation.errors.nextFollowUpTime}
												</span>
											) : null}
										</div>

										<div className="mb-2 col-lg-3 col-md-4 col-sm-6 col-12">
                                            <label className="form-label">
                                                {" "}
                                                Assign To<span className="error-star">*</span>
                                            </label>
                                            <Select
                                                styles={customStyles}
                                                className="basic-single"
                                                classNamePrefix="select"
                                                name="assignTo"
                                                options={assignUsersDropdown}
                                                // onChange={validation.handleChange}
                                                // onBlur={validation.handleBlur}
                                                // value={validation.values.assignTo}
                                                onChange={(selectedOption) => {
                                                    validation.setFieldValue(
                                                        "assignTo",
                                                        selectedOption ? selectedOption.value : ""
                                                    ); // Extract the 'value' property
                                                }}
                                                onBlur={validation.handleBlur}
                                                value={assignUsersDropdown.find(
                                                    (option) =>
                                                        option.value === validation.values.assignTo
                                                )}
                                            />
                                            {validation.touched.assignTo &&
                                            validation.errors.assignTo ? (
                                                <span className="error">
                                                    {validation.errors.assignTo}
                                                </span>
                                            ) : null}
                                        </div>
										
									</div>

									<div className="mb-2 mt-2 row">
										<div className="col-lg-12 d-flex justify-content-between">
											<Link
												to="/presale-group-tour-new"
												type="submit"
												className="btn btn-back"
											>
												Back
											</Link>
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
export default AssignEnquiryGT;
