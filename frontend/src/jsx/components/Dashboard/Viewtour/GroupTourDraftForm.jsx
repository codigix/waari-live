import React, { useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import ErrorMessageComponent from "../FormErrorComponent/ErrorMessageComponent";
import { get, post } from "../../../../services/apiServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NoImage } from "../../../utils/assetsPaths";

// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import { Tooltip } from "@mui/material";
import { scrollIntoViewHelper } from "../../../utils/scrollIntoViewHelper";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toolbarOptions } from "../../../utils/richTextEditorConfig";
import SkeletonIternaryForm from "../GroupTourDraftsComponents/SkeletonItineraryForm";
import AddTourPriceDetailsForm from "../GroupTourDraftsComponents/AddTourPriceDetailsForm";
import DetailInteniraryForm from "../GroupTourDraftsComponents/DetailInteniraryForm";
import TransportDetailsForm from "../GroupTourDraftsComponents/TransportDetailsForm";
import InclusionExclustionNotesForm from "../GroupTourDraftsComponents/InclusionExclustionNotesForm";
import BackButton from "../../common/BackButton";

const url = import.meta.env.VITE_WAARI_BASEURL;

const requiredSizeForBgImage = {
    width: 1080,
    height: 1920,
};
const requiredSizeForBannerImage = {
    width: 1080,
    height: 770,
};
const requiredSizeForHotelImage = {
    width: 500,
    height: 400,
};
const requiredSizeForWebsiteBanner = {
    width: 262,
    height: 521,
};

function formatIternaryDate(date, index) {
    const currentDate = new Date(date);
    currentDate.setDate(Number(currentDate.getDate()) + index); // Calculate date based on the index
    const formattedDate = `${currentDate
        .getDate()
        .toString()
        .padStart(2, "0")}-${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${currentDate.getFullYear()}`;
    return formattedDate;
}

function GroupTourDraftForm() {
    const tourMainValidationSchema = Yup.object().shape({
        nameoftour: Yup.string()
            .min(3)
            .max(50)
            .required("Tour Name is required"),
        tourcode: Yup.string().required("Tour Code is required"),
        tours: Yup.object().nullable().required("Tour Type is required"),
        destination: Yup.object()
            .nullable()
            .required("Destination is required"),
        city: Yup.array().nullable().required("city is required"),
        totalseat: Yup.number().required("Total Seats is required"),
        uniqueExperience: Yup.number(),
        tourmanager: Yup.string().required("Tour manager is required"),
        tourstartdate: Yup.string().required("Tour Start Date is required"),
        tourenddate: Yup.string().required("Tour End Date is required"),
        vehicles: Yup.object().nullable().required("Vehicles is required"),
        mealplan: Yup.object().nullable().required("Meal Plan is required"),
        kitchen: Yup.object().nullable().required("Kitchen is required"),
        mealtype: Yup.object().nullable().required("Meal Type is required"),

        managerNo: Yup.string()
            .required("Tour Manager Number is required")
            .min(10, "Please enter correct contact number")
            .max(10, "Please enter correct contact number"),
        bgImage: Yup.string().required(
            "Backround image is required (1080 x 1920 size required)"
        ),
        websiteBanner: Yup.string().required(
            "Website banner image is required (262 x 521 size required)"
        ),
        websiteDescription: Yup.string().required(
            "Website Description is required"
        ),
        shopping: Yup.string().required("Shopping is required"),
        weather: Yup.string().required("Weather is required"),

        departure: Yup.object().nullable().required("Departure is required"),

        detailIntenirary: Yup.array().of(
            Yup.object().shape({
                title: Yup.string().required("Location is required"),
                distance: Yup.string().required("Distance is required"),
                description: Yup.string().required("Description is required"),
                nightStayAt: Yup.string().required("Stay at is required"),
                mealTypeId: Yup.array().required("Meal Type is required"),
                fromCity: Yup.string().required("From City Image is required"),
                toCity: Yup.string().required("To City is required"),
                approxTravelTime: Yup.string().required(
                    "Approx Travel Time is required"
                ),
                bannerImage: Yup.string().required(
                    "Banner Image is required ( 1080 x 770 size required)"
                ),
                hotelImage: Yup.string().required(
                    "Hotel Image is required (500 x 400 size required)"
                ),
            })
        ),
    });

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            height: "34px", // Adjust the height to your preference
        }),
    };
    //for meal checkboxes
    const mealsList = ["Breakfast", "Lunch", "Dinner"];
    const [tourTypeOptions, setTourTypeOptions] = useState([]);
    const navigate = useNavigate();
    const [destinationOptions, setDestinationOptions] = useState([]);
    const [departureOptions, setDepartureOptions] = useState([]);
    const [countryOptions, setcountryOptions] = useState([]);
    const [stateOptions, setStateOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [vehiclesOptions, setVehiclesOptions] = useState([]);
    const [mealPlanOptions, setMealPlanOptions] = useState([]);
    const [mealTypeOptions, setMealTypeOptions] = useState([]);
    const [kitchenOptions, setKitchenOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [dayDifference, setDayDifference] = useState(0);
    const [toursData, setToursData] = useState(null);

    const { id } = useParams();

    const getTourDetails = async () => {
        try {
            const response = await get(`/edit-data-gt?groupTourId=${id}`);
            const length = parseInt(response.data.data.days);
            setDayDifference(length);
            //set data for all fields
            setToursData(response.data.data);
            formik.setFieldValue("nameoftour", response.data.data.tourName);
            formik.setFieldValue("tourcode", response.data.data.tourCode);
            formik.setFieldValue("tours", {
                value: response.data.data.tourTypeId,
                label: response.data.data.tourTypeName,
            });
            formik.setFieldValue("destination", {
                value: response.data.data.destinationId,
                label: response.data.data.destinationName,
            });
            formik.setFieldValue("departure", {
                value: response.data.data.departureTypeId,
                label: response.data.data.departureName,
            });
            formik.setFieldValue("country", {
                value: response.data.data.countryId,
                label: response.data.data.countryName,
            });
            formik.setFieldValue("state", {
                value: response.data.data.stateId,
                label: response.data.data.stateName,
            });
            formik.setFieldValue("tourstartdate", response.data.data.startDate);
            formik.setFieldValue("tourenddate", response.data.data.endDate);
            formik.setFieldValue(
                "tourdurationnights",
                response.data.data.night
            );
            formik.setFieldValue("tourdurationdays", response.data.data.days);
            formik.setFieldValue("totalseat", response.data.data.totalSeats);
            formik.setFieldValue(
                "uniqueExperience",
                response.data.data.uniqueExperience
            );
            formik.setFieldValue("vehicles", {
                value: response.data.data.vehicleId,
                label: response.data.data.vehicleName,
            });
            formik.setFieldValue("mealplan", {
                value: response.data.data.mealPlanId,
                label: response.data.data.mealPlanName,
            });
            formik.setFieldValue("kitchen", {
                value: response.data.data.kitchenId,
                label: response.data.data.kitchenName,
            });
            formik.setFieldValue("mealtype", {
                value: response.data.data.mealTypeId,
                label: response.data.data.mealTypeName,
            });
            formik.setFieldValue(
                "city",
                response.data.data.city.map((m) => ({
                    value: m.citiesId,
                    label: m.citiesName,
                }))
            );
            formik.setFieldValue("tourmanager", response.data.data.tourManager);
            formik.setFieldValue("managerNo", response.data.data.managerNo);

            formik.setFieldValue(
                "roomsharingprice",
                response.data.data.tourPrice
            );
            formik.setFieldValue("flights", response.data.data.flightDetails);
            formik.setFieldValue("trains", response.data.data.trainDetails);

            formik.setFieldValue("shopping", response.data.data.shopping);
            formik.setFieldValue("weather", response.data.data.weather);

            getDeparturList(response.data.data.destinationId);
            getCountryList(response.data.data.destinationId);
            getStateList(response.data.data.countryId);
            getCityList({
                stateId: response.data.data.stateId,
                countryId: response.data.data.countryId,
            });

            formik.setFieldValue("bgImage", response.data.data.bgImage || "");
            formik.setFieldValue(
                "websiteBanner",
                response.data.data.websiteBanner || ""
            );
            formik.setFieldValue(
                "websiteDescription",
                response.data.data.websiteDescription || ""
            );
        } catch (error) {
            console.log(error);
        }
    };

    const getTourTypeList = async () => {
        try {
            const response = await get(`/tour-type-list`);
            setTourTypeOptions(
                response.data.data.map((m) => ({
                    value: m.tourTypeId,
                    label: m.tourTypeName,
                }))
            );
        } catch (error) {
            console.log(error);
        }
    };

    //handle destination change
    const handleTourType = (val) => {
        formik.setFieldValue("tours", val);
    };

    //get destination list
    const getDestinationList = async () => {
        try {
            const response = await get(`/destination-list`);
            setDestinationOptions(
                response.data.data.map((m) => ({
                    value: m.destinationId,
                    label: m.destinationName,
                }))
            );
        } catch (error) {
            console.log(error);
        }
    };

    //handle destination change
    const handleDestinationChange = (val) => {
        formik.setFieldValue("destination", val);
        formik.setFieldValue("departure", null);
        formik.setFieldValue("state", null);
        formik.setFieldValue("city", null);
        getDeparturList(val.value);
        getCountryList(val.value);
        setStateOptions([]);
        setCityOptions([]);
    };

    //get departure list
    const getDeparturList = async (destinationId) => {
        try {
            const response = await get(
                `/departure-type-list?destinationId=${destinationId}`
            );
            setDepartureOptions(
                response.data.data.map((m) => ({
                    value: m.departureTypeId,
                    label: m.departureName,
                }))
            );
        } catch (error) {
            console.log(error);
        }
    };

    //handle depatrture change
    const handleDepartureChange = (val) => {
        formik.setFieldValue("departure", val);
    };

    //get country list
    const getCountryList = async (destinationId) => {
        try {
            const response = await get(
                `/country?destinationId=${destinationId}`
            );
            setcountryOptions(
                response.data.message.map((m) => ({
                    value: m.countryId,
                    label: m.countryName,
                }))
            );

            if (destinationId == 1) {
                const mapData = response.data.message.map((m) => ({
                    value: m.countryId,
                    label: m.countryName,
                }));
                formik.setFieldValue(
                    "country",
                    mapData.find((item) => item.value == 1)
                );
                getStateList(1);
                getCityList({ stateId: "", countryId: 1 });
            }
        } catch (error) {
            console.log(error);
        }
    };

    //handle country change
    const handleCountryChange = (val) => {
        formik.setFieldValue("country", val);
        formik.setFieldValue("state", null);
        getStateList(val.value);
        getCityList({ stateId: "", countryId: val.value });
    };

    //get state data
    const getStateList = async (countryId) => {
        try {
            const response = await get(`/state-list?countryId=${countryId}`);
            setStateOptions(
                response.data.data.map((m) => ({
                    label: m.stateName,
                    value: m.stateId,
                }))
            );
        } catch (error) {
            console.log(error);
        }
    };

    //handle country change
    const handleStateChange = (val) => {
        formik.setFieldValue("state", val);
        formik.setFieldValue("city", null);
        getCityList({ stateId: val.value, countryId: "" });
    };
    //get city data
    const getCityList = async (ids) => {
        try {
            const response = await get(
                `/city-list?stateId=${ids.stateId}&countryId=${ids.countryId}`
            );
            setCityOptions(
                response.data.data.map((m) => ({
                    label: m.citiesName,
                    value: m.citiesId,
                }))
            );
        } catch (error) {
            console.log(error);
        }
    };

    //handle country change
    const handleCityChange = (val) => {
        formik.setFieldValue("city", val);
    };

    // Function to handle changes in the start date
    const handleStartDateChange = (e) => {
        formik.handleChange(e); // Let Formik handle the change event

        // Make Tour End Date Empty When Start Date is Is Bigger than End Date
        if (
            formik.values.tourenddate &&
            new Date(e.target.value) > new Date(formik.values.tourenddate)
        ) {
            formik.setFieldValue("tourenddate", "");
            formik.setFieldValue("tourdurationnights", "");
            formik.setFieldValue("tourdurationdays", "");
            return;
        }

        const startDate = new Date(e.target.value);
        const endDate = new Date(formik.values.tourenddate);

        // Calculate night and day differences
        const nightDifference = Math.floor(
            (endDate - startDate) / (24 * 3600 * 1000)
        );
        const dayDifference = nightDifference + 1; // Add 1 to include the start date

        // Set the calculated values
        formik.setFieldValue(
            "tourdurationnights",
            isNaN(nightDifference.toString()) ? "" : nightDifference.toString()
        );
        formik.setFieldValue(
            "tourdurationdays",
            isNaN(dayDifference.toString()) ? "" : dayDifference.toString()
        );
    };

    // Function to handle changes in the end date
    const handleEndDateChange = (e) => {
        formik.handleChange(e); // Let Formik handle the change event
        const startDate = new Date(formik.values.tourstartdate);
        const endDate = new Date(e.target.value);

        // Calculate night and day differences
        const nightDifference = Math.floor(
            (endDate - startDate) / (24 * 3600 * 1000)
        );
        const dayDifference = nightDifference + 1; // Add 1 to include the end date

        // Set the calculated values
        formik.setFieldValue(
            "tourdurationnights",
            isNaN(nightDifference.toString()) ? "" : nightDifference.toString()
        );
        formik.setFieldValue(
            "tourdurationdays",
            isNaN(dayDifference.toString()) ? "" : dayDifference.toString()
        );
    };

    //get vehicle listing
    const getVehicleList = async () => {
        try {
            const response = await get(`/vehicle-listing`);
            setVehiclesOptions(
                response.data.data.map((m) => ({
                    label: m.vehicleName,
                    value: m.vehicleId,
                }))
            );
        } catch (error) {
            console.log(error);
        }
    };
    //get mealPlan listing
    const getMealPlanList = async () => {
        try {
            const response = await get(`/meal-plan-list`);
            setMealPlanOptions(
                response.data.data.map((m) => ({
                    label: m.mealPlanName,
                    value: m.mealPlanId,
                }))
            );
        } catch (error) {
            console.log(error);
        }
    };
    //get mealPlan listing
    const getMealTypeList = async () => {
        try {
            const response = await get(`/meal-type-list`);
            setMealTypeOptions(
                response.data.data.map((m) => ({
                    label: m.mealTypeName,
                    value: m.mealTypeId,
                }))
            );
        } catch (error) {
            console.log(error);
        }
    };
    //get kitchen listing
    const getkitchenList = async () => {
        try {
            const response = await get(`/kitchen-list`);
            setKitchenOptions(
                response.data.data.map((m) => ({
                    label: m.kitchenName,
                    value: m.kitchenId,
                }))
            );
        } catch (error) {
            console.log(error);
        }
    };

    const formik = useFormik({
        initialValues: {
            nameoftour: "",
            tourcode: "",
            tours: null,
            destination: null,
            departure: null,
            country: null,
            state: null,
            tourstartdate: "",
            tourenddate: "",
            tourdurationnights: "",
            tourdurationdays: "",
            totalseat: "",
            uniqueExperience: "",
            vehicles: null,
            mealplan: null,
            kitchen: null,
            mealtype: null,
            city: [],
            tourmanager: "",
            managerNo: "",

            bgImage: "",
            websiteBanner: "",
            websiteDescription: "",
            shopping: "",
            weather: "",
        },
        tourMainValidationSchema: tourMainValidationSchema,
        onSubmit: async (values) => {
            let data = {
                groupTourId: id,
                tourTypeId: values.tours.value,
                tourName: values.nameoftour,
                tourCode: values.tourcode,
                departureTypeId: values.departure.value,
                countryId: values.country.value,
                stateId: values.state.value,
                destinationId: values.destination.value,
                startDate: values.tourstartdate,
                endDate: values.tourenddate,
                night: values.tourdurationnights,
                days: values.tourdurationdays,
                cityId: values.city.map((item) => item.value),
                totalSeats: values.totalseat,
                uniqueExperience: values.uniqueExperience,
                vehicleId: values.vehicles.value,
                mealPlanId: values.mealplan.value,
                kitchenId: values.kitchen.value,
                mealTypeId: values.mealtype.value,
                tourManager: values.tourmanager,
                managerNo: values.managerNo,

                bgImage: values.bgImage,
                websiteBanner: values.websiteBanner,
                websiteDescription: values.websiteDescription,
                shopping: values.shopping,
                weather: values.weather,
            };
            try {
                setIsLoading(true);
                const response = await post(`add-tour-details`, data);

                // getTourDetails()

                setIsLoading(false);
                toast.success(response?.data?.message);
            } catch (error) {
                setIsLoading(false);
                console.log(error);
            }
        },
    });

    useEffect(() => {
        getTourTypeList();
        getDestinationList();
        getVehicleList();
        getMealPlanList();
        getMealTypeList();
        getkitchenList();
        getTourDetails();
    }, []);

    useEffect(() => {
        const textarea10 = document.getElementById("weather");
        const textarea11 = document.getElementById("shopping");
        const textarea12 = document.getElementById("websiteDescription");

        const adjustTextareaHeight = () => {
            textarea10.style.height = "auto";
            textarea10.style.height = `${textarea10.scrollHeight}px`;

            textarea11.style.height = "auto";
            textarea11.style.height = `${textarea11.scrollHeight}px`;

            textarea12.style.height = "auto";
            textarea12.style.height = `${textarea12.scrollHeight}px`;
        };

        textarea10?.addEventListener("input", adjustTextareaHeight);
        textarea11?.addEventListener("input", adjustTextareaHeight);
        textarea12?.addEventListener("input", adjustTextareaHeight);

        return () => {
            textarea10?.removeEventListener("input", adjustTextareaHeight);
            textarea11?.removeEventListener("input", adjustTextareaHeight);
            textarea12?.removeEventListener("input", adjustTextareaHeight);
        };
    }, []);

    useEffect(() => {
        // console.log(window.location.href.split("/"));
        const pathArray = window.location.href.split("/");
        const path = pathArray[pathArray.length - 1];
        // console.log(path);
        let element = document.getElementById("view-draft-grouptours-list");
        // console.log(element);
        if (element) {
            element.classList.add("mm-active1");
        }
        return () => {
            if (element) {
                element.classList.remove("mm-active1");
            }
        };
    }, []);

    const [isLoadingImage, setIsLoadingImage] = useState(false);

    const getFileLink = async (file, fieldName) => {
        try {
            const formData = new FormData();
            formData.append("image", file);

            // Perform size validation here
            const imageSize = await getImageSize(file);
            if (!isValidImageSize(imageSize, fieldName)) {
                toast.error(
                    "Invalid image size. Please upload an image with given dimensions"
                );
                return;
            }

            setIsLoadingImage(true);

            const responseData = await axios.post(
                `${url}/image-upload`,
                formData
            );

            toast.success("File uploaded successfully");

            setIsLoadingImage(false);

            return responseData?.data?.image_url;
        } catch (error) {
            setIsLoadingImage(false);
            toast.error(error?.response?.data?.message?.toString());
            console.log(error);
        }
    };

    // Helper function to get image size
    const getImageSize = (file) => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => {
                resolve({ width: image.width, height: image.height });
            };
            image.onerror = reject;
            image.src = URL.createObjectURL(file);
        });
    };

    // Helper function to validate image size
    const isValidImageSize = (size, fieldName) => {
        const { width, height } = size;

        if (fieldName === "bgImage") {
            return (
                width === requiredSizeForBgImage.width &&
                height === requiredSizeForBgImage.height
            );
        } else if (fieldName === "bannerImage") {
            return (
                width === requiredSizeForBannerImage.width &&
                height === requiredSizeForBannerImage.height
            );
        } else if (fieldName === "hotelImage") {
            return (
                width === requiredSizeForHotelImage.width &&
                height === requiredSizeForHotelImage.height
            );
        } else if (fieldName === "websiteBanner") {
            return (
                width === requiredSizeForWebsiteBanner.width &&
                height === requiredSizeForWebsiteBanner.height
            );
        } else return true;
    };

    useEffect(() => {
        if (!formik.isSubmitting) {
            if (Object.keys(formik.errors).length) {
                scrollIntoViewHelper(formik.errors);
            }
        }
    }, [formik.isSubmitting]);

    return (
        <>
            <div className="card"  style={{ marginBottom: '40px' }}>
                <div className="row page-titles mx-0 fixed-top-breadcrumb">
                       <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <BackButton />
                        </li>
                        <li className="breadcrumb-item active">
                            <Link to="/dashboard">Dashboard</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="/view-draft-grouptours-list">View Tour</Link>
                        </li>
                        <li className="breadcrumb-item  ">
                            <Link to="javascript:void(0)">Edit Tour</Link>
                        </li>
                    </ol>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <form className="needs-validation">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title h5">
                                    Tour Details
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-5 col-sm-6 col-lg-6 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Tour Name
                                                <span className="error-star">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                id="nameoftour"
                                                name="nameoftour"
                                                type="text"
                                                min={3}
                                                max={50}
                                                className="form-control"
                                                onChange={formik.handleChange}
                                                value={formik.values.nameoftour}
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"nameoftour"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-sm-6 col-lg-3 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Tour Code
                                                <span className="error-star">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                id="tourcode"
                                                name="tourcode"
                                                type="text"
                                                className="form-control"
                                                onChange={formik.handleChange}
                                                value={formik.values.tourcode}
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"tourcode"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-sm-6 col-lg-3 col-12">
                                        <div className="mb-2">
                                            <label htmlFor="tours">
                                                Tour Type
                                                <span className="error-star">
                                                    *
                                                </span>
                                            </label>
                                            <Select
                                                styles={customStyles}
                                                id="tours"
                                                name="tours"
                                                className="basic-single"
                                                classNamePrefix="select"
                                                options={tourTypeOptions}
                                                onChange={handleTourType}
                                                value={formik.values.tours}
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"tours"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-sm-6 col-lg-3 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Destination
                                                <span className="error-star">
                                                    *
                                                </span>
                                            </label>
                                            <Select
                                                styles={customStyles}
                                                id="destination"
                                                name="destination"
                                                className="basic-single"
                                                classNamePrefix="select"
                                                options={destinationOptions}
                                                onChange={
                                                    handleDestinationChange
                                                }
                                                value={
                                                    formik.values.destination
                                                }
                                                isDisabled
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"destination"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-sm-6 col-lg-3 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Departure
                                                <span className="error-star">
                                                    *
                                                </span>
                                            </label>
                                            <Select
                                                styles={customStyles}
                                                id="departure"
                                                name="departure"
                                                className="basic-single"
                                                classNamePrefix="select"
                                                options={departureOptions}
                                                onChange={handleDepartureChange}
                                                value={formik.values.departure}
                                                isDisabled
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"departure"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-sm-6 col-lg-3 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Country
                                                <span className="error-star">
                                                    *
                                                </span>
                                            </label>
                                            <Select
                                                id="country"
                                                name="country"
                                                className="basic-single"
                                                classNamePrefix="select"
                                                options={countryOptions}
                                                onChange={handleCountryChange}
                                                value={formik.values.country}
                                                isDisabled
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"country"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-sm-6 col-lg-3 col-12">
                                        <div className="mb-2">
                                            <label> State</label>
                                            <Select
                                                id="state"
                                                name="state"
                                                className="basic-single"
                                                classNamePrefix="select"
                                                options={stateOptions}
                                                onChange={handleStateChange}
                                                value={formik.values.state}
                                                isDisabled
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"state"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-sm-6 col-lg-3 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Tour Start Date
                                                <span className="error-star">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="date"
                                                id="tourstartdate"
                                                name="tourstartdate"
                                                className="form-control bg-light text-muted"
                                                min={
                                                    new Date()
                                                        .toISOString()
                                                        .split("T")[0]
                                                }
                                                onChange={handleStartDateChange}
                                                value={
                                                    formik.values.tourstartdate
                                                }
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-sm-6 col-lg-3 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Tour End Date
                                                <span className="error-star">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="date"
                                                id="tourenddate"
                                                name="tourenddate"
                                                className="form-control bg-light text-muted"
                                                min={
                                                    formik.values
                                                        .tourstartdate &&
                                                    new Date(
                                                        formik.values.tourstartdate
                                                    )
                                                        .toISOString()
                                                        .split("T")[0]
                                                }
                                                onChange={handleEndDateChange}
                                                value={
                                                    formik.values.tourenddate
                                                }
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-sm-6 col-lg-3 col-12">
                                        <div className="mb-2">
                                            <div className="row">
                                                <div className="col-sm-6 pax-adults">
                                                    <label>
                                                        Duration(Nights)
                                                        <span className="error-star">
                                                            *
                                                        </span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control w-60 bg-light text-muted"
                                                        disabled
                                                        name="tourdurationnights"
                                                        value={
                                                            formik.values
                                                                .tourdurationnights
                                                        }
                                                    />
                                                </div>
                                                <div className="col-sm-6 pax-child">
                                                    <label>
                                                        Duration(Days)
                                                        <span className="error-star">
                                                            *
                                                        </span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control w-60 bg-light text-muted"
                                                        disabled
                                                        name="tourdurationdays"
                                                        value={
                                                            formik.values
                                                                .tourdurationdays
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3 col-sm-6 col-lg-2 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Unique Experiences{" "}
                                               
                                            </label>
                                            <input
                                                type="number"
                                                id="uniqueExperience"
                                                name="uniqueExperience"
                                                min={"0"}
                                                onWheel={(e) =>
                                                    e.preventDefault()
                                                }
                                                className="form-control"
                                                onChange={formik.handleChange}
                                                value={
                                                    formik.values
                                                        .uniqueExperience
                                                }
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"uniqueExperience"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-sm-12 col-lg-10 col-12">
                                        <div className="mb-2">
                                            <label>
                                                City
                                                <span className="error-star">
                                                    *
                                                </span>
                                            </label>
                                            <Select
                                                styles={{
                                                    ...customStyles,
                                                    control: (base, state) => ({
                                                        ...base,
                                                        backgroundColor:
                                                            "#f8f9fa", // Light gray background for disabled
                                                        cursor: "not-allowed",
                                                        opacity:
                                                            state.isDisabled
                                                                ? 0.7
                                                                : 1,
                                                    }),
                                                }}
                                                isMulti
                                                id="city"
                                                name="city"
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                options={cityOptions}
                                                onChange={handleCityChange}
                                                value={formik.values.city}
                                                isDisabled={true} // Disable the select dropdown
                                                isClearable={false}
                                                hideSelectedOptions
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"city"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-3 col-sm-6 col-lg-2 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Total Seats
                                                <span className="error-star">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="number"
                                                id="totalseat"
                                                min={"0"}
                                                name="totalseat"
                                                className="form-control"
                                                onChange={formik.handleChange}
                                                value={formik.values.totalseat}
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"totalseat"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3 col-sm-6 col-lg-2 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Vehicles
                                                <span className="error-star">
                                                    *
                                                </span>
                                            </label>
                                            <Select
                                                styles={customStyles}
                                                id="vehicles"
                                                name="vehicles"
                                                className="basic-single"
                                                classNamePrefix="select"
                                                options={vehiclesOptions}
                                                onChange={(val) =>
                                                    formik.setFieldValue(
                                                        "vehicles",
                                                        val
                                                    )
                                                }
                                                value={formik.values.vehicles}
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"vehicles"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3 col-sm-6 col-lg-2 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Meal Plan
                                                <span className="error-star">
                                                    *
                                                </span>
                                            </label>
                                            <Select
                                                styles={customStyles}
                                                id="mealplan"
                                                name="mealplan"
                                                className="basic-single"
                                                classNamePrefix="select"
                                                options={mealPlanOptions}
                                                onChange={(val) =>
                                                    formik.setFieldValue(
                                                        "mealplan",
                                                        val
                                                    )
                                                }
                                                value={formik.values.mealplan}
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"mealplan"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3 col-sm-6 col-lg-2 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Kitchen
                                                <span className="error-star">
                                                    *
                                                </span>
                                            </label>{" "}
                                            <Select
                                                styles={customStyles}
                                                id="kitchen"
                                                name="kitchen"
                                                className="basic-single"
                                                classNamePrefix="select"
                                                options={kitchenOptions}
                                                onChange={(val) =>
                                                    formik.setFieldValue(
                                                        "kitchen",
                                                        val
                                                    )
                                                }
                                                value={formik.values.kitchen}
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"kitchen"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3 col-sm-6 col-lg-2 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Meal Type
                                                <span className="error-star">
                                                    *
                                                </span>
                                            </label>
                                            <Select
                                                styles={customStyles}
                                                id="mealtype"
                                                name="mealtype"
                                                className="basic-single"
                                                classNamePrefix="select"
                                                options={mealTypeOptions}
                                                onChange={(val) =>
                                                    formik.setFieldValue(
                                                        "mealtype",
                                                        val
                                                    )
                                                }
                                                value={formik.values.mealtype}
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"mealtype"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3 col-sm-6 col-lg-2 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Tour Manager Name
                                                <span className="error-star">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="tourmanager"
                                                name="tourmanager"
                                                onChange={formik.handleChange}
                                                value={
                                                    formik.values.tourmanager
                                                }
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"tourmanager"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3 col-sm-6 col-lg-2 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Tour Manager Number
                                                <span className="error-star">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="managerNo"
                                                name="managerNo"
                                                onChange={formik.handleChange}
                                                value={formik.values.managerNo}
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"managerNo"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>
                                    <div className="notes mb-3">
                                        <div
                                            className="card-header pb-2 pt-2"
                                            style={{ paddingLeft: "0" }}
                                        >
                                            <div className="card-title h5">
                                                Weather
                                            </div>
                                        </div>
                                        <textarea
                                            type="text"
                                            className="textarea"
                                            id="weather"
                                            name="weather"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.weather}
                                        />
                                        <ErrorMessageComponent
                                            errors={formik.errors}
                                            fieldName={"weather"}
                                            touched={formik.touched}
                                        />
                                    </div>
                                    <div className="notes mb-3">
                                        <div
                                            className="card-header pb-2 pt-2"
                                            style={{ paddingLeft: "0" }}
                                        >
                                            <div className="card-title h5">
                                                Website Description (Overview){" "}
                                                <span className="error-star">
                                                    *
                                                </span>
                                            </div>
                                        </div>
                                        <textarea
                                            type="text"
                                            className="textarea"
                                            id="websiteDescription"
                                            name="websiteDescription"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={
                                                formik.values.websiteDescription
                                            }
                                        />
                                        <ErrorMessageComponent
                                            errors={formik.errors}
                                            fieldName={"websiteDescription"}
                                            touched={formik.touched}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="text-label">
                                            Background Image (1080 * 1920)
                                            <span className="error-star">
                                                *
                                            </span>
                                        </label>
                                        <div className="col-md-12">
                                            <div className="Neon Neon-theme-dragdropbox">
                                                <input
                                                    className="file_upload"
                                                    name={`bgImage`}
                                                    accept="image/*"
                                                    id="filer_input2"
                                                    type="file"
                                                    draggable
                                                    onChange={async (e) => {
                                                        const selectedFile =
                                                            e.target.files[0];
                                                        const fileLink =
                                                            await getFileLink(
                                                                selectedFile,
                                                                "bgImage"
                                                            );
                                                        formik.setFieldValue(
                                                            `bgImage`,
                                                            fileLink
                                                        );
                                                        e.target.value = "";
                                                    }}
                                                />
                                                <div className="Neon-input-dragDrop bg-gt">
                                                    {formik.values.bgImage
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
                                                                Drop files here
                                                                or click to
                                                                upload.
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <img
                                                            src={
                                                                formik.values
                                                                    .bgImage ||
                                                                NoImage
                                                            }
                                                            alt="frontImage"
                                                            width="100%"
                                                            className="neon-img"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"bgImage"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="text-label">
                                            Website Banner Image (262 * 521)
                                            <span className="error-star">
                                                *
                                            </span>
                                        </label>
                                        <div className="col-md-12">
                                            <div className="Neon Neon-theme-dragdropbox bg-gt">
                                                <input
                                                    className="file_upload"
                                                    name={`websiteBanner`}
                                                    accept="image/*"
                                                    id="filer_input2"
                                                    type="file"
                                                    draggable
                                                    onChange={async (e) => {
                                                        const selectedFile =
                                                            e.target.files[0];
                                                        const fileLink =
                                                            await getFileLink(
                                                                selectedFile,
                                                                "websiteBanner"
                                                            );
                                                        formik.setFieldValue(
                                                            `websiteBanner`,
                                                            fileLink
                                                        );
                                                        e.target.value = "";
                                                    }}
                                                />
                                                <div className="Neon-input-dragDrop">
                                                    {formik.values.websiteBanner
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
                                                                Drop files here
                                                                or click to
                                                                upload.
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <img
                                                            src={
                                                                formik.values
                                                                    .websiteBanner ||
                                                                NoImage
                                                            }
                                                            alt="frontImage"
                                                            width="100%"
                                                            className="neon-img"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"websiteBanner"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12 d-flex justify-content-end mt-3">
                                    <div className="d-flex">
                                        <button
                                            onClick={formik.handleSubmit}
                                            type="submit"
                                            className="btn btn-submit btn-primary"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Iternary Images */}

                        <SkeletonIternaryForm
                            groupTourId={id}
                            tourdurationdays={formik.values.tourdurationdays}
                            toursData={toursData}
                            dayDifference={dayDifference}
                        />

                        {/* Room Sharing Price Table Form */}

                        <AddTourPriceDetailsForm
                            groupTourId={id}
                            toursData={toursData}
                        />

                        <DetailInteniraryForm
                            groupTourId={id}
                            tourdurationdays={formik.values.tourdurationdays}
                            toursData={toursData}
                            dayDifference={dayDifference}
                        />

                        <TransportDetailsForm
                            groupTourId={id}
                            toursData={toursData}
                            destinationId={toursData?.destinationId || ""}
                            departureTypeId={toursData?.departureTypeId || ""}
                        />

                        <InclusionExclustionNotesForm
                            groupTourId={id}
                            toursData={toursData}
                        />
                    </form>
                </div>
            </div>
        </>
    );
}

export default GroupTourDraftForm;
