import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import ErrorMessageComponent from "../../Dashboard/FormErrorComponent/ErrorMessageComponent";
import { get, post } from "../../../../services/apiServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NoImage } from "../../../utils/assetsPaths";
import { scrollIntoViewHelper } from "../../../utils/scrollIntoViewHelper";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import { getImageSize } from "../../../utils/index";
import BackButton from "../../common/BackButton";

const url = import.meta.env.VITE_WAARI_BASEURL;

const requiredSizeForBgImage = {
  width: 1080,
  height: 1920,
};

const requiredSizeForWebsiteBanner = {
  width: 262,
  height: 521,
};

function AddNewGroupTour() {
  //     const validationSchema = Yup.object().shape({
  //         nameoftour: Yup.string()
  //             .min(3)
  //             .max(50)
  //             .required("Tour Name is required"),
  //         tourcode: Yup.string().required("Tour Code is required"),
  //         tours: Yup.object().nullable().required("Tour Type is required"),
  //         destination: Yup.object()
  //             .nullable()
  //             .required("Destination is required"),
  //         city: Yup.array().nullable().required("city is required"),
  //         totalseat: Yup.number().required("Total Seats is required"),
  //         uniqueExperience: Yup.number(),
  //         tourmanager: Yup.string().required("Tour manager is required"),
  //         tourstartdate: Yup.string().required("Tour Start Date is required"),
  //         tourenddate: Yup.string().required("Tour End Date is required"),
  //         managerNo: Yup.string()
  //             .required("Tour Manager Number is required")
  //             .min(10, "Please enter correct contact number")
  //             .max(10, "Please enter correct contact number"),

  //         departure: Yup.object().nullable().required("Departure is required"),

  //         vehicles: Yup.object().nullable().required("Vehicles is required"),
  //         mealplan: Yup.object().nullable().required("Meal Plan is required"),
  //         kitchen: Yup.object().nullable().required("Kitchen is required"),
  //         mealtype: Yup.object().nullable().required("Meal Type is required"),

  //         // new Added fields
  //         bgImage: Yup.string().required(
  //             "Backround image is required (1080 x 1920 size required)"
  //         ),
  //         websiteBanner: Yup.string().required(
  //             "Website banner image is required (262 x 521 size required)"
  //         ),
  //         websiteDescription: Yup.string().required(
  //             "Website Description is required"
  //         ),
  //         shopping: Yup.string().required("Shopping is required"),
  //         weather: Yup.string().required("Weather is required"),
  //     });

  const validationSchema = Yup.object().shape({
    nameoftour: Yup.string().nullable(),
    tourcode: Yup.string().nullable(),
    tours: Yup.object().nullable(),
    destination: Yup.object().nullable(),
    city: Yup.array().nullable(),
    totalseat: Yup.number().nullable(),
    uniqueExperience: Yup.number().nullable(),
    tourmanager: Yup.string().nullable(),
    tourstartdate: Yup.string().nullable(),
    tourenddate: Yup.string().nullable(),
    managerNo: Yup.string().nullable(),
    departure: Yup.object().nullable(),
    vehicles: Yup.object().nullable(),
    mealplan: Yup.object().nullable(),
    kitchen: Yup.object().nullable(),
    mealtype: Yup.object().nullable(),
    bgImage: Yup.string().nullable(),
    websiteBanner: Yup.string().nullable(),
    websiteDescription: Yup.string().nullable(),
    shopping: Yup.string().nullable(),
    weather: Yup.string().nullable(),
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
  const [kitchenOptions, setKitchenOptions] = useState([]);
  const [mealTypeOptions, setMealTypeOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //get tour type
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
      const response = await get(`/country?destinationId=${destinationId}`);
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
      } else {
        formik.setFieldValue("country", null);
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
        `/city-list?stateId=&countryId=${ids.countryId}`
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
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Handle form submission

      try {
        const formData = new FormData();

        formData.append("tourName", values.nameoftour);
        formData.append("tourCode", values.tourcode);
        formData.append("tourTypeId", values.tours?.value || "");
        formData.append("destinationId", values.destination?.value || "");
        formData.append("departureTypeId", values.departure?.value || "");
        formData.append("countryId", values.country?.value || "");
        formData.append("stateId", values.state?.value || "");
        formData.append("startDate", values.tourstartdate);
        formData.append("endDate", values.tourenddate);
        formData.append("night", values.tourdurationnights);
        formData.append("days", values.tourdurationdays);
        formData.append(
          "cityId",
          JSON.stringify(values.city.map((c) => c.value))
        );
        formData.append("totalSeats", values.totalseat);
        formData.append("uniqueExperience", values.uniqueExperience);
        formData.append("vehicleId", values.vehicles?.value || "");
        formData.append("mealPlanId", values.mealplan?.value || "");
        formData.append("kitchenId", values.kitchen?.value || "");
        formData.append("mealTypeId", values.mealtype?.value || "");
        formData.append("tourManager", values.tourmanager || "");

        formData.append("managerNo", values.managerNo);
        formData.append("shopping", values.shopping);
        formData.append("weather", values.weather);
        formData.append("websiteDescription", values.websiteDescription);

        if (values.bgImage instanceof File)
          formData.append("bgImage", values.bgImage);
        if (values.websiteBanner instanceof File)
          formData.append("websiteBanner", values.websiteBanner);

        const response = await fetch(
          `${import.meta.env.VITE_WAARI_BASEURL}/add-tour-details`,
          {
            method: "POST",
            body: formData, // multipart/form-data automatically
          }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "API failed");
        toast.success(data.message);
        navigate(`/group-tour-draft/${data.groupTourId}`);
      } catch (error) {
        toast.error(error.message);
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
  }, []);

  useEffect(() => {
    const textarea1 = document.getElementById("weather");
    const textarea2 = document.getElementById("shopping");
    const textarea3 = document.getElementById("websiteDescription");

    // const textarea5 =
    // 	data.length > 0 ? document.getElementById("itinerarydescription1") : "";

    const adjustTextareaHeight = () => {
      textarea1.style.height = "auto";
      textarea1.style.height = `${textarea1.scrollHeight}px`;

      textarea2.style.height = "auto";
      textarea2.style.height = `${textarea2.scrollHeight}px`;

      textarea3.style.height = "auto";
      textarea3.style.height = `${textarea3.scrollHeight}px`;
    };

    textarea1?.addEventListener("input", adjustTextareaHeight);
    textarea2?.addEventListener("input", adjustTextareaHeight);
    textarea3?.addEventListener("input", adjustTextareaHeight);

    // data.length > 0 &&
    // 	textarea5?.addEventListener("input", adjustTextareaHeight);
    return () => {
      textarea1?.removeEventListener("input", adjustTextareaHeight);
      textarea2?.removeEventListener("input", adjustTextareaHeight);
      textarea3?.removeEventListener("input", adjustTextareaHeight);
    };
  }, []);

  useEffect(() => {
    // console.log(window.location.href.split("/"));
    const pathArray = window.location.href.split("/");
    const path = pathArray[pathArray.length - 1];
    // console.log(path);
    let element = document.getElementById("View-group-tour");
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
        `${import.meta.env.VITE_WAARI_BASEURL}/user/image-upload
           
`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
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

  const isValidImageSize = (size, fieldName) => {
    const { width, height } = size;
    console.log(`Checking ${fieldName} → ${width}x${height}`);

    if (fieldName === "bgImage") {
      return (
        width >= requiredSizeForBgImage.width &&
        height >= requiredSizeForBgImage.height
      );
    } else if (fieldName === "websiteBanner") {
      return (
        width >= requiredSizeForWebsiteBanner.width &&
        height >= requiredSizeForWebsiteBanner.height
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

  console.log("formik.values", formik.values);
  console.log("formik.errors", formik.errors);

  return (
    <>
      <div className="card" style={{ marginBottom: "40px" }}>
        <div className="row page-titles mx-0 fixed-top-breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <BackButton />
            </li>
            <li className="breadcrumb-item active">
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/View-group-tour">View Tour</Link>
            </li>
            <li className="breadcrumb-item  ">
              <Link to="/add-new-group-tour">Add Tour</Link>
            </li>
          </ol>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit();
              return false;
            }}
            className="needs-validation"
          >
            <div className="card">
              <div className="card-header">
                <div className="card-title h5">Tour Details</div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-5 col-sm-6 col-lg-6 col-12">
                    <div className="mb-2">
                      <label>
                        Tour Name
                        <span className="error-star">*</span>
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
                        <span className="error-star">*</span>
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

                  <div className="col-md-3 col-sm-6 col-lg-3 col-12">
                    <div className="mb-2">
                      <label htmlFor="tours">
                        Tour Type
                        <span className="error-star">*</span>
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
                        <span className="error-star">*</span>
                      </label>
                      <Select
                        styles={customStyles}
                        id="destination"
                        name="destination"
                        className="basic-single"
                        classNamePrefix="select"
                        options={destinationOptions}
                        onChange={handleDestinationChange}
                        value={formik.values.destination}
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
                        <span className="error-star">*</span>
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
                        <span className="error-star">*</span>
                      </label>
                      <Select
                        id="country"
                        name="country"
                        className="basic-single"
                        classNamePrefix="select"
                        options={countryOptions}
                        onChange={handleCountryChange}
                        value={formik.values.country}
                        isDisabled={formik.values.destination?.value == 1}
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
                        <span className="error-star">*</span>
                      </label>
                      <input
                        type="date"
                        id="tourstartdate"
                        name="tourstartdate"
                        className="form-control"
                        min={new Date().toISOString().split("T")[0]}
                        value={formik.values.tourstartdate}
                        onChange={handleStartDateChange}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"tourstartdate"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-lg-3 col-12">
                    <div className="mb-2">
                      <label>
                        Tour End Date
                        <span className="error-star">*</span>
                      </label>
                      <input
                        type="date"
                        id="tourenddate"
                        name="tourenddate"
                        className="form-control"
                        min={
                          formik.values.tourstartdate &&
                          new Date(formik.values.tourstartdate)
                            .toISOString()
                            .split("T")[0]
                        }
                        value={formik.values.tourenddate}
                        onChange={handleEndDateChange}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"tourenddate"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-lg-3 col-12">
                    <div className="mb-2">
                      <div className="row">
                        <div className="col-sm-6 pax-adults">
                          <label>
                            Duration(Nights)
                            <span className="error-star">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control w-60"
                            disabled
                            name="tourdurationnights"
                            value={formik.values.tourdurationnights}
                          />
                        </div>
                        <div className="col-sm-6 pax-child">
                          <label>
                            Duration(Days)
                            <span className="error-star">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control w-60"
                            disabled
                            name="tourdurationdays"
                            value={formik.values.tourdurationdays}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3 col-sm-6 col-lg-2 col-12">
                    <div className="mb-2">
                      <label>Unique Experiences </label>
                      <input
                        type="number"
                        id="uniqueExperience"
                        name="uniqueExperience"
                        min={"0"}
                        onWheel={(e) => e.preventDefault()}
                        className="form-control"
                        onChange={formik.handleChange}
                        value={formik.values.uniqueExperience}
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
                        <span className="error-star">*</span>
                      </label>
                      <Select
                        styles={customStyles}
                        isMulti
                        id="city"
                        name="city"
                        className="basic-multi-select"
                        classNamePrefix="select"
                        options={cityOptions}
                        onChange={handleCityChange}
                        value={formik.values.city}
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
                        <span className="error-star">*</span>
                      </label>
                      <input
                        type="number"
                        id="totalseat"
                        name="totalseat"
                        min={"0"}
                        onWheel={(e) => e.preventDefault()}
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
                        <span className="error-star">*</span>
                      </label>
                      <Select
                        styles={customStyles}
                        id="vehicles"
                        name="vehicles"
                        className="basic-single"
                        classNamePrefix="select"
                        options={vehiclesOptions}
                        onChange={(val) =>
                          formik.setFieldValue("vehicles", val)
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
                        <span className="error-star">*</span>
                      </label>
                      <Select
                        styles={customStyles}
                        id="mealplan"
                        name="mealplan"
                        className="basic-single"
                        classNamePrefix="select"
                        options={mealPlanOptions}
                        onChange={(val) =>
                          formik.setFieldValue("mealplan", val)
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
                        <span className="error-star">*</span>
                      </label>{" "}
                      <Select
                        styles={customStyles}
                        id="kitchen"
                        name="kitchen"
                        className="basic-single"
                        classNamePrefix="select"
                        options={kitchenOptions}
                        onChange={(val) => formik.setFieldValue("kitchen", val)}
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
                        <span className="error-star">*</span>
                      </label>
                      <Select
                        styles={customStyles}
                        id="mealtype"
                        name="mealtype"
                        className="basic-single"
                        classNamePrefix="select"
                        options={mealTypeOptions}
                        onChange={(val) =>
                          formik.setFieldValue("mealtype", val)
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
                        <span className="error-star">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="tourmanager"
                        name="tourmanager"
                        onChange={formik.handleChange}
                        value={formik.values.tourmanager}
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
                        <span className="error-star">*</span>
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
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="notes mb-3">
                      <div
                        className="card-header pb-2 pt-2"
                        style={{ paddingLeft: "0" }}
                      >
                        <div className="card-title h5">
                          Shopping <span className="error-star">*</span>
                        </div>
                      </div>
                      <textarea
                        type="text"
                        className="textarea"
                        id="shopping"
                        name="shopping"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.shopping}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"shopping"}
                        touched={formik.touched}
                      />
                    </div>

                    <div className="notes mb-3">
                      <div
                        className="card-header pb-2 pt-2"
                        style={{ paddingLeft: "0" }}
                      >
                        <div className="card-title h5">
                          Weather <span className="error-star">*</span>
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
                          <span className="error-star">*</span>
                        </div>
                      </div>
                      <textarea
                        type="text"
                        className="textarea"
                        id="websiteDescription"
                        name="websiteDescription"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.websiteDescription}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"websiteDescription"}
                        touched={formik.touched}
                      />
                    </div>

                    <div v className="col-md-6">
                      <label className="text-label">
                        Background Image (1080 * 1920)
                        <span className="error-star">*</span>
                      </label>
                      <div className="col-md-12">
                        <div className="Neon Neon-theme-dragdropbox bg-gt">
                          <input
                            className="file_upload"
                            name={`bgImage`}
                            accept="image/*"
                            id="filer_input2"
                            type="file"
                            draggable
                            onChange={async (e) => {
                              const selectedFile = e.target.files[0];
                              const fileLink = await getFileLink(
                                selectedFile,
                                "bgImage"
                              );
                              formik.setFieldValue(`bgImage`, fileLink);
                              e.target.value = "";
                            }}
                          />
                          <div className="Neon-input-dragDrop">
                            {formik.values.bgImage?.length == 0 ? (
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
                                src={formik.values.bgImage || NoImage}
                                alt="frontImage"
                                width="100%"
                                className="neon-img"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"bgImage"}
                        touched={formik.touched}
                      />
                    </div>

                    <div v className="col-md-6">
                      <label className="text-label">
                        Website Banner Image (262 * 521)
                        <span className="error-star">*</span>
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
                              const selectedFile = e.target.files[0];
                              const fileLink = await getFileLink(
                                selectedFile,
                                "websiteBanner"
                              );
                              formik.setFieldValue(`websiteBanner`, fileLink);
                              e.target.value = "";
                            }}
                          />
                          <div className="Neon-input-dragDrop">
                            {formik.values.websiteBanner?.length == 0 ? (
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
                                src={formik.values.websiteBanner || NoImage}
                                alt="frontImage"
                                width="100%"
                                className="neon-img"
                              />
                            )}
                          </div>
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
                <div className="col-lg-12 d-flex justify-content-between mt-3">
                  <button
                    onClick={() => navigate("/View-group-tour")}
                    type="button"
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
                      {isLoading ? "Submitting" : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddNewGroupTour;
