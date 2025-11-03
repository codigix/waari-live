import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { get, post } from "../../../../services/apiServices";
import ErrorMessageComponent from "../FormErrorComponent/ErrorMessageComponent";
import BackButton from "../../common/BackButton";

const AssigncustomizedtourNew = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [countryId, setCountryId] = useState("");
    const [destination, setDestination] = useState([]);
    const [assignUsersDropdown, setAssignUsersDropdown] = useState([]);
    const navigate = useNavigate();
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
            note: "",
            nextfollowup: "",
            nextFollowUpTime: "",
            priority: "",
            email: "",
            guestref: "",
            destination: "",
            enquiryref: "",
            numberoffamilyhead: "",
            mealplan: "",
            totalextrabed: "",
            totalrooms: "",
            childrenages: [],
            adults: "",
            child: "",
            hotel: "",
            // noofnights: "",
            nights: "",
            days: "",
            state: "",
            departurecountry: "",
            contact: "",
            // nameofcontact: "",
            fullName: "",
            nameofgroup: "",
            tourstartdate: "",
            tourenddate: "",
            // cities: [],
            assignTo: "",
        },
        validationSchema: Yup.object({

              // cities: Yup.array()
            // 	.min(1, "Select at least one city")
            // 	.required("Select Cities"),
            
            // enquiryref: Yup.string().required("Enter The Enquiry Reference"),
            // guestref: Yup.string().when("enquiryref", {
            // 	is: (enquiryref) => enquiryref == 9,
            // 	then: Yup.string().required("Enter the Guest Enquiry Reference"),
            // 	otherwise: Yup.string(),
            // }),
            // destination: Yup.string().required("Enter The Destination"),
            // departurecountry: Yup.string().required("Country is required"),
          
            // childrenages: Yup.array().when("child", {
            // 	is: (value) => value > 0,
            // 	then: Yup.array()
            // 		.of(
            // 			Yup.number()
            // 				.typeError("Age must be a number")
            // 				.required("Age is required")
            // 				.min(1, "Age must be at least 1")
            // 				.max(18, "Age cannot exceed 18")
            // 		)
            // 		.required("At least one child age is required"),
            // 	else: Yup.array().notRequired(),
            // }),

            // adults: Yup.string().required("Enter The Passengers"),
            hotel: Yup.string().required("Enter The Hotels Category"),
            // contact: Yup.string()
            // 	.required("Enter The Contact Number")
            // 	.min(10, "Enter valid number")
            // 	.max(10, "Enter valid number"),
            // fullName: Yup.string().required("Enter Full Name"),
            // nameofgroup: Yup.string().required("Enter The Name of Group"),
            tourstartdate: Yup.string().required("Enter The Tour Start Date"),
            tourenddate: Yup.string().required("Enter The Tour End Date"),

            nextfollowup: Yup.string().required("Next Follow Up date is required"),
            nextFollowUpTime: Yup.string().required("Follow time is required"),
            numberoffamilyhead: Yup.string().required("Enter The Number of family Head"),
            hotel: Yup.string().required("Enter The Hotels Category"),
            totalrooms: Yup.string().required("Enter The Total Rooms"),
            mealplan: Yup.string().required("Enter The Meal Plan"),
            assignTo: Yup.string().required("Enter The Assign To"),
        }),

        onSubmit: async (values) => {
            let data = {
                // groupName: values.nameofgroup,
                // fullName: values.fullName,
                // destinationId: values.destination,
                // contact: values.contact,
                // startDate: values.tourstartdate,
                // endDate: values.tourenddate,
                // stateId: Number(values.state),
                // nights: calcutedDays - 1,
                // days: calcutedDays,
                // hotelCatId: values.hotel,
                // adults: values.adults,
                // child: values.child,
                // age: values.childrenages,
                // rooms: values.totalrooms,
                // extraBed: values.totalextrabed,
                // mealPlanId: values.mealplan,
                // familyHeadNo: values.numberoffamilyhead,
                // priorityId: values.priority,
                // nextFollowUp: values.nextfollowup,
                // nextFollowUpTime: values.nextFollowUpTime,
                // enquiryReferId: values.enquiryref,
                // guestRefId: values.guestref,
                // notes: values.note,
                // countryId: Number(values.departurecountry),
                // cities: values.cities.map((item) => item.value),
                // mailId: values.email,

                nextFollowUp: values.nextfollowup,
                nextFollowUpTime: values.nextFollowUpTime,
                mealPlanId: values.mealplan,
                hotelCatId: values.hotel,
                familyHeadNo: values.numberoffamilyhead,
                rooms: values.totalrooms,
                assignTo: values.assignTo,
                // rooms: values.totalrooms,
            };

            try {
                setIsLoading(true);
                const response = await post(`/assign-user-to-plan-enq-ct`, {...data, planEnqId: id });
                setIsLoading(false);
                toast.success(response?.data?.message);
                navigate("/presale-customized-tour-new");
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
                countryId: validation?.values?.destination == "1" ? "1" : countryId?.value,
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
    // const [cities, setCities] = useState([]);

    // const getCity = async () => {
    //     try {
    //         const response = await get(
    //             `/city-list?countryId=${validation.values.departurecountry}`
    //         );
    //         const mappedData = response.data.data.map((item) => ({
    //             value: item.citiesId,
    //             label: item.citiesName
    //                 .split(" ")
    //                 .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    //                 .join(" "),
    //         }));
    //         setCities(mappedData);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    // useEffect(() => {
    //     getCity();
    // }, [
    //     validation.values.departurecountry,
    //     validation.values.state,
    //     validation.values.destination,
    // ]);

    /* end get city from api */

    const [departureCountry, setDepartureCountry] = useState([]);

    const getDepartureCountry = async () => {
        try {
            const response = await get(`/country?destinationId=${validation?.values?.destination}`);
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

    //GET GUEST REFERENCE
    const [guestenquiryref, setGuestEnquiryRef] = useState([]);

    const getGuestEnquiryRef = async (selectedOption) => {
        validation.setFieldValue("enquiryref", selectedOption ? selectedOption.value : "");
        if (selectedOption.value == 9) {
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
        } else {
            validation.setFieldValue("guestref", "");
        }
    };

    const handleGuestRefChange = (selectedOption) => {
        validation.setFieldValue("guestref", selectedOption.value);
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
        let element = document.getElementById("presale-customized-tour-new");
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
        // validation.setFieldValue("cities", []);
        validation.setFieldValue("state", "");
    };
    const getCountryValueFromSelect = async (value) => {
        setCountryId(value);
        validation.setFieldValue("departurecountry", value ? value.value : "");
        // validation.setFieldValue("cities", []);
        validation.setFieldValue("state", "");
    };

    // to select the value from input tag end
    useEffect(() => {
        const textarea = document.getElementById("notes");

        const adjustTextareaHeight = () => {
            textarea.style.height = "auto"; // Reset height to auto to get the actual scroll height
            textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to the scroll height
        };

        textarea?.addEventListener("input", adjustTextareaHeight);

        return () => {
            // Clean up the event listener when the component unmounts
            textarea?.removeEventListener("input", adjustTextareaHeight);
        };
    }, []);

    //get data for edit
    const getEditData = async () => {
        try {
            const result = await get(`view-plan-enq-users-data-ct?planEnqId=${id}`);
            const data = result.data.data;

            validation.setFieldValue("fullName", data.firstName);
            validation.setFieldValue("nameofgroup", data.groupName);
            validation.setFieldValue("groupName", data.groupName);
            validation.setFieldValue("contact", data.contactNo);
            validation.setFieldValue("destination", data.destinationId);
            validation.setFieldValue("departurecountry", data.countryId);
            validation.setFieldValue("state", data.stateId);
            validation.setFieldValue("tourstartdate", data.startDate);
            validation.setFieldValue("tourenddate", data.endDate);
            validation.setFieldValue("adults", data.noOfTravelPeople);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getEditData();
    }, []);

    console.log("errors", validation.errors)

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
                                    <Link to="/presale-customized-tour-new">Enquiry follow-up</Link>
                                </li>
                                <li className="breadcrumb-item  ">
                                    <Link to="#">Assign Customized Tour</Link>
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
                                        <div className="card-title h5">Details</div>
                                    </div>
                                    <div className="row">
                                        <div className="mb-2 col-lg-4 col-md-6 col-sm-6 col-12">
                                            <label className="form-label">
                                                Group name<span className="error-star">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control bg-light"
                                                placeholder=""
                                                name="nameofgroup"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.nameofgroup}
                                                disabled
                                            />
                                            {validation.touched.nameofgroup &&
                                            validation.errors.nameofgroup ? (
                                                <span className="error">
                                                    {validation.errors.nameofgroup}
                                                </span>
                                            ) : null}
                                        </div>

                                        <div className="mb-2 col-lg-4 col-md-6 col-sm-6 col-12">
                                            <label>
                                                Full Name
                                                <span className="error-star">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control  bg-light"
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

                              
                                        <div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-12">
                                            <label>
                                                Contact Number<span className="error-star">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                className="form-control  bg-light"
                                                name="contact"
                                                minLength={10}
                                                maxLength={10}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.contact}
                                                disabled
                                            />
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
                                        <div className="mb-2  col-lg-2 col-md-4 col-sm-6 col-12">
                                            <label className="form-label">
                                                Select Destination
                                                <span className="error-star">*</span>
                                            </label>
                                            <Select
                                                styles={customStyles}
                                                className="basic-single bg-light"
                                                classNamePrefix="select"
                                                name="destination"
                                                options={destination}
                                                onChange={(e) => getDestValueFromSelect(e)}
                                                onBlur={validation.handleBlur}
                                                value={destination.find(
                                                    (option) =>
                                                        option.value ===
                                                        validation.values.destination
                                                )}
                                                isDisabled
                                            />
                                            {validation.touched.destination &&
                                            validation.errors.destination ? (
                                                <span className="error">
                                                    {validation.errors.destination}
                                                </span>
                                            ) : null}
                                        </div>

                                        <div className="mb-2 col-lg-2 col-md-4 col-sm-6 col-12">
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
                                                            option.value ===
                                                            validation.values.departurecountry
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
                                            {validation.touched.departurecountry &&
                                                validation.errors.departurecountry && (
                                                    <span className="error">
                                                        {validation.errors.departurecountry}
                                                    </span>
                                                )}
                                        </div>

                                        <div className="mb-2 col-lg-2 col-md-4 col-sm-6 col-12">
                                            <label className="form-label">Select State</label>
                                            <Select
                                                styles={customStyles}
                                                className="basic-single"
                                                classNamePrefix="select"
                                                name="state"
                                                options={state}
                                                onChange={(selectedOption) => {
                                                    validation.setFieldValue(
                                                        "state",
                                                        selectedOption.value
                                                    ); // Extract the 'value' property
                                                }}
                                                onBlur={validation.handleBlur}
                                                value={
                                                    state.find(
                                                        (option) =>
                                                            option.value === validation.values.state
                                                    )
                                                        ? state.find(
                                                              (option) =>
                                                                  option.value ===
                                                                  validation.values.state
                                                          )
                                                        : null
                                                }
                                                isDisabled
                                            />
                                            {validation.touched.state && validation.errors.state ? (
                                                <span className="error">
                                                    {validation.errors.state}
                                                </span>
                                            ) : null}
                                        </div>
                                        {/* <div className="mb-2 col-lg-6 col-md-8 col-sm-12 col-12">
                                            <label className="form-label">
                                                Select Cities<span className="error-star">*</span>
                                            </label>
                                            <Select
                                                isMulti
                                                styles={customStyles}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                name="cities"
                                                options={cities}
                                                onChange={(selectedOptions) =>
                                                    validation.setFieldValue(
                                                        "cities",
                                                        selectedOptions
                                                    )
                                                }
                                                onBlur={validation.handleBlur}
                                                value={validation.values.cities}
                                            />
                                            {validation.touched.cities &&
                                            validation.errors.cities ? (
                                                <span className="error">
                                                    {validation.errors.cities}
                                                </span>
                                            ) : null}
                                        </div> */}
                                        <div className="mb-2 col-lg-3 col-md-4 col-sm-6 col-12">
                                            <label>
                                                Tour Start Date<span className="error-star">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control  bg-light"
                                                name="tourstartdate"
                                                min={new Date().toISOString().split("T")[0]}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.tourstartdate}
                                                disabled
                                            />
                                            {validation.touched.tourstartdate &&
                                            validation.errors.tourstartdate ? (
                                                <span className="error">
                                                    {validation.errors.tourstartdate}
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className="mb-2 col-lg-3 col-md-4  col-sm-6 col-12">
                                            <label>
                                                Tour End Date<span className="error-star">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control  bg-light"
                                                name="tourenddate"
                                                min={
                                                    validation.values.tourstartdate
                                                        ? validation.values.tourstartdate
                                                        : new Date().toISOString().split("T")[0]
                                                }
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.tourenddate}
                                                disabled
                                            />
                                            {validation.touched.tourenddate &&
                                            validation.errors.tourenddate ? (
                                                <span className="error">
                                                    {validation.errors.tourenddate}
                                                </span>
                                            ) : null}
                                        </div>

                                        <div className="mb-2 col-lg-3 col-md-4 col-sm-6 col-12">
                                            <div className="row">
                                                <div className="col-sm-6 pax-adults">
                                                    <label>
                                                        Durations(Nights)
                                                        <span className="error-star">*</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="nights"
                                                        min={0}
                                                        className="form-control  bg-light w-60"
                                                        value={
                                                            calcutedDays == 0 ? 0 : calcutedDays - 1
                                                        }
                                                        disabled
                                                        // onChange={validation.handleChange}
                                                        // onBlur={validation.handleBlur}
                                                        // value={validation.values.nights}
                                                    />
                                                </div>
                                                <div className="col-sm-6 pax-child">
                                                    <label>
                                                        Durations(Days)
                                                        <span className="error-star">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="days"
                                                        className="form-control  bg-light w-60"
                                                        value={calcutedDays == 0 ? 0 : calcutedDays}
                                                        disabled
                                                        // onChange={validation.handleChange}
                                                        // onBlur={validation.handleBlur}
                                                        // value={validation.values.days}
                                                    />
                                                </div>
                                            </div>
                                            {validation.touched.duration &&
                                            validation.errors.duration ? (
                                                <span className="error">
                                                    {validation.errors.duration}
                                                </span>
                                            ) : null}
                                        </div>

                                        <div className="mb-2 col-lg-3 col-md-4 col-sm-6 col-12">
                                            <div className="row">
                                                <div className="col-sm-6 pax-adults">
                                                    <label>
                                                        Pax(Adults)
                                                        <span className="error-star">*</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="adults"
                                                        className="form-control  bg-light w-60"
                                                        min={0}
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.adults}
                                                        disabled
                                                    />
                                                </div>

                                                
                                            </div>
                                            {validation.touched.adults &&
                                            validation.errors.adults ? (
                                                <span className="error">
                                                    {validation.errors.adults}
                                                </span>
                                            ) : null}
                                        </div>
                                      

                                        <div className="mb-2 col-lg-3 col-md-4 col-sm-6 col-12">
                                            <label className="form-label">
                                                {" "}
                                                Hotel Category<span className="error-star">*</span>
                                            </label>
                                            <Select
                                                styles={customStyles}
                                                className="basic-single"
                                                classNamePrefix="select"
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
                                                    (option) =>
                                                        option.value === validation.values.hotel
                                                )}
                                            />
                                            {validation.touched.hotel && validation.errors.hotel ? (
                                                <span className="error">
                                                    {validation.errors.hotel}
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className="mb-2 col-lg-3 col-md-4 col-sm-6 col-12">
                                            <label>
                                                {" "}
                                                Total rooms required
                                                <span className="error-star">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="totalrooms"
                                                className="form-control"
                                                min={0}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.totalrooms}
                                            />
                                            {validation.touched.totalrooms &&
                                            validation.errors.totalrooms ? (
                                                <span className="error">
                                                    {validation.errors.totalrooms}
                                                </span>
                                            ) : null}
                                        </div>
                                        {/* <div className="mb-2 col-lg-3 col-md-4 col-sm-6 col-12">
                                            <label>Total extra bed required</label>
                                            <input
                                                type="number"
                                                name="totalextrabed"
                                                className="form-control"
                                                min={0}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.totalextrabed}
                                            />
                                            {validation.touched.totalextrabed &&
                                            validation.errors.totalextrabed ? (
                                                <span className="error">
                                                    {validation.errors.totalextrabed}
                                                </span>
                                            ) : null}
                                        </div> */}
                                        <div className="mb-2 col-lg-3 col-md-4 col-sm-6 col-12">
                                            <label className="form-label">
                                                Meal Plan<span className="error-star">*</span>
                                            </label>
                                            <Select
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
                                                    (option) =>
                                                        option.value === validation.values.mealplan
                                                )}
                                            />
                                            {validation.touched.mealplan &&
                                            validation.errors.mealplan ? (
                                                <span className="error">
                                                    {validation.errors.mealplan}
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className="mb-2 col-lg-3 col-md-4 col-sm-6 col-12">
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
                                        {/* <div className="mb-2 col-lg-3 col-md-4 col-sm-6 col-12">
                                            <label>
                                                Reference<span className="error-star">*</span>
                                            </label>
                                            <Select
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
                                                    (option) =>
                                                        option.value ===
                                                        validation.values.enquiryref
                                                )}
                                            />
                                            {validation.touched.enquiryref &&
                                            validation.errors.enquiryref ? (
                                                <span className="error">
                                                    {validation.errors.enquiryref}
                                                </span>
                                            ) : null}
                                        </div>
                                        {validation?.values?.enquiryref == 9 && (
                                            <div className="mb-2 col-lg-3 col-md-4 col-sm-6 col-12">
                                                <label>
                                                    Guest Reference Id
                                                    <span className="error-star">*</span>
                                                </label>
                                                <Select
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
                                                        (option) =>
                                                            option.value ===
                                                            validation.values.guestref
                                                    )}
                                                />
                                                {validation.touched.guestref &&
                                                validation.errors.guestref ? (
                                                    <span className="error">
                                                        {validation.errors.guestref}
                                                    </span>
                                                ) : null}
                                            </div>
                                        )}
                                        <div className="mb-2 col-lg-3 col-md-4 col-sm-6 col-12">
                                            <label className="form-label">Priority</label>
                                            <Select
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
                                                    (option) =>
                                                        option.value === validation.values.priority
                                                )}
                                            />
                                        </div> */}
                                        <div className="mb-2 col-lg-3 col-md-4 col-sm-6 col-12">
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
                                        {/* <div className="mb-2 col-lg-12 col-md-12 col-sm-12 col-12">
                                            <label className="form-label">Notes</label>
                                            <textarea
                                                type="text"
                                                className="textarea"
                                                id="notes"
                                                name="note"
                                                rows={2}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.note}
                                            />
                                        </div> */}

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
                                                to="/presale-customized-tour-new"
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
export default AssigncustomizedtourNew;
