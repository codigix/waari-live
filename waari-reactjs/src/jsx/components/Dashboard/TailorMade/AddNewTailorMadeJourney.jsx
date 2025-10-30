import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import ErrorMessageComponent from "../FormErrorComponent/ErrorMessageComponent";
import { get, post } from "../../../../services/apiServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NoImage } from "../../../utils/assetsPaths";
import { scrollIntoViewHelper } from "../../../utils/scrollIntoViewHelper";
import axios from "axios";
import { Tooltip } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toolbarOptions } from "../../../utils/richTextEditorConfig";
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

function AddNewTailorMadeJourney() {
  // const validationSchema = Yup.object().shape({
  //     tourdurationnights:  Yup.number().required("Total Duration Nights is required"),
  //     tourdurationdays:  Yup.number().required("Total Duration Days is required").min(1, "Minimum 1 day duration is required"),
  //     nameoftour: Yup.string().min(3).max(50).required("Tour Name is required"),
  //     tourcode: Yup.string().required("Tour Code is required"),
  //     tours: Yup.object().nullable().required("Tour Type is required"),
  //     destination: Yup.object().nullable().required("Destination is required"),
  //     city: Yup.array().nullable().required("city is required"),
  //     uniqueExperience: Yup.number(),

  //     detailIntenirary: Yup.array().of(
  //         Yup.object().shape({
  //             title: Yup.string().required("Location is required"),
  //             distance: Yup.string().required("Distance is required"),
  //             description: Yup.string().required("Description is required"),
  //             nightStayAt: Yup.string().required("Stay at is required"),
  //             mealTypeId: Yup.array().required("Meal Type is required"),
  //             fromCity: Yup.string().required("From City is required"),
  //             toCity: Yup.string().required("To City is required"),
  //             approxTravelTime: Yup.string().required("Approx Travel Time is required"),
  //             bannerImage: Yup.string().required(
  //                 "Banner Image is required ( 1080 x 770 size required)"
  //             ),
  //             hotelImage: Yup.string().required(
  //                 "Hotel Image is required (500 x 400 size required)"
  //             ),
  //             tailorMadeitineraryimages: Yup.array()
  //                 .of(
  //                     Yup.object().shape({
  //                         itineraryImageName: Yup.string().required(
  //                             "Itinerary Image Name is required"
  //                         ),
  //                         itineraryImageUrl: Yup.string()
  //                             .url("Must be a valid URL")
  //                             .required("Itinerary Image URL is required"),
  //                         type: Yup.number()
  //                             .oneOf([0, 1], "Type must be 0 (Place) or 1 (Hotel)")
  //                             .required("Image type is required"),
  //                     })
  //                 )
  //                 .min(1, "At least one itinerary image is required in each list"),
  //         })
  //     ),

  //     hotelprice: Yup.array()
  //         .of(
  //             Yup.object().shape({
  //                 type: Yup.number()
  //                     .oneOf(
  //                         [0, 1, 2],
  //                         "Type must be 0 (Deluxe), 1 (Super Deluxe), or 2 (Premium)"
  //                     )
  //                     .required("Hotel Type is required"),
  //                 hotels: Yup.array()
  //                     .of(
  //                         Yup.object().shape({
  //                             hotelName: Yup.string().required("Hotel Name is required"),
  //                             tourPrice: Yup.number()
  //                                 .min(0, "Tour Price must be greater than or equal to 0")
  //                                 .required("Tour Price is required"),
  //                             offerPrice: Yup.number()
  //                                 .min(0, "Offer Price must be greater than or equal to 0")
  //                                 .required("Offer Price is required"),
  //                             commissionPrice: Yup.number()
  //                                 .min(0, "Commission Price must be greater than or equal to 0")
  //                                 .required("Commission Price is required"),
  //                         })
  //                     )
  //                     .min(1, "At least one hotel must be provided for each type"),
  //             })
  //         )
  //         .min(1, "At least one hotel price type is required"),

  //     departure: Yup.object().nullable().required("Departure is required"),

  //     visaDocuments: Yup.string().when("destination", {
  //         is: (destination) => destination?.value == "2",
  //         then: Yup.string().required("Enter The Visa Documents"),
  //         otherwise: Yup.string(),
  //     }),

  //     visaFee: Yup.string().when("destination", {
  //         is: (destination) => destination?.value == "2",
  //         then: Yup.string().required("Enter The Visa Fees"),
  //         otherwise: Yup.string(),
  //     }),

  //     visaInstruction: Yup.string().when("destination", {
  //         is: (destination) => destination?.value == "2",
  //         then: Yup.string().required("Enter The Visa Instructions"),
  //         otherwise: Yup.string(),
  //     }),

  //     visaAlerts: Yup.string().when("destination", {
  //         is: (destination) => destination?.value == "2",
  //         then: Yup.string().required("Enter The Visa Alerts"),
  //         otherwise: Yup.string(),
  //     }),

  //     insuranceDetails: Yup.string().when("destination", {
  //         is: (destination) => destination?.value == "2",
  //         then: Yup.string().required("Enter The Insurance Details"),
  //         otherwise: Yup.string(),
  //     }),

  //     euroTrainDetails: Yup.string().when("destination", {
  //         is: (destination) => destination?.value == "2",
  //         then: Yup.string().required("Enter The Euro Train Details"),
  //         otherwise: Yup.string(),
  //     }),

  //     nriOriForDetails: Yup.string().when("destination", {
  //         is: (destination) => destination?.value == "2",
  //         then: Yup.string().required("Enter The NRI/OCI/Foreign Details"),
  //         otherwise: Yup.string(),
  //     }),

  //     tailormadeinclusions: Yup.array().of(
  //         Yup.object().shape({
  //             description: Yup.string().required("Enter the Inclusion Description"),
  //         })
  //     ),
  //     tailormadeexclusions: Yup.array().of(
  //         Yup.object().shape({
  //             description: Yup.string().required("Enter the Exclusion Description"),
  //         })
  //     ),
  //     mealplan: Yup.object().nullable().required("Meal Plan is required"),

  //     // new Added fields
  //     bgImage: Yup.string().required("Backround image is required (1080 x 1920 size required)"),
  //     websiteBanner: Yup.string().required(
  //         "Website banner image is required (262 x 521 size required)"
  //     ),
  //     websiteDescription: Yup.string().required("Website Description is required"),
  //     shopping: Yup.string().required("Shopping is required"),
  //     weather: Yup.string().required("Weather is req

  const validationSchema = Yup.object().shape({
    tourdurationnights: Yup.number().nullable(),
    tourdurationdays: Yup.number().nullable().min(0),
    nameoftour: Yup.string().nullable(),
    tourcode: Yup.string().nullable(),
    tours: Yup.object().nullable(),
    destination: Yup.object().nullable(),
    city: Yup.array().nullable(),
    uniqueExperience: Yup.number().nullable(),

    detailIntenirary: Yup.array()
      .of(
        Yup.object().shape({
          title: Yup.string().nullable(),
          distance: Yup.string().nullable(),
          description: Yup.string().nullable(),
          nightStayAt: Yup.string().nullable(),
          mealTypeId: Yup.array().nullable(),
          fromCity: Yup.string().nullable(),
          toCity: Yup.string().nullable(),
          approxTravelTime: Yup.string().nullable(),
          bannerImage: Yup.string().nullable(),
          hotelImage: Yup.string().nullable(),
          tailorMadeitineraryimages: Yup.array()
            .of(
              Yup.object().shape({
                itineraryImageName: Yup.string().nullable(),
                itineraryImageUrl: Yup.string()
                  .url("Must be a valid URL")
                  .nullable(),
                type: Yup.number().oneOf([0, 1]).nullable(),
              })
            )
            .nullable(),
        })
      )
      .nullable(),

    hotelprice: Yup.array()
      .of(
        Yup.object().shape({
          type: Yup.number().oneOf([0, 1, 2]).nullable(),
          hotels: Yup.array()
            .of(
              Yup.object().shape({
                hotelName: Yup.string().nullable(),
                tourPrice: Yup.number().min(0).nullable(),
                offerPrice: Yup.number().min(0).nullable(),
                commissionPrice: Yup.number().min(0).nullable(),
              })
            )
            .nullable(),
        })
      )
      .nullable(),

    departure: Yup.object().nullable(),

    visaDocuments: Yup.string().nullable(),
    visaFee: Yup.string().nullable(),
    visaInstruction: Yup.string().nullable(),
    visaAlerts: Yup.string().nullable(),
    insuranceDetails: Yup.string().nullable(),
    euroTrainDetails: Yup.string().nullable(),
    nriOriForDetails: Yup.string().nullable(),

    tailormadeinclusions: Yup.array()
      .of(
        Yup.object().shape({
          description: Yup.string().nullable(),
        })
      )
      .nullable(),

    tailormadeexclusions: Yup.array()
      .of(
        Yup.object().shape({
          description: Yup.string().nullable(),
        })
      )
      .nullable(),

    mealplan: Yup.object().nullable(),

    // New added fields
    bgImage: Yup.string().nullable(),
    websiteBanner: Yup.string().nullable(),
    websiteDescription: Yup.string().nullable(),
    shopping: Yup.string().nullable(),
    weather: Yup.string().nullable(),
  });

  const editorRef = useRef(null);

  const detailedItineraryObj = {
    title: "",
    distance: "",
    description: "",
    nightStayAt: "",
    mealTypeId: [],
    fromCity: "",
    toCity: "",
    approxTravelTime: "",
    bannerImage: "",
    hotelImage: "",
    tailorMadeitineraryimages: [
      {
        itineraryImageName: "",
        itineraryImageUrl: "",
        type: 1,
      },
    ],
  };

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
  const [mealPlanOptions, setMealPlanOptions] = useState([]);
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

  // Handle city change
  const handleCityChange = (val) => {
    formik.setFieldValue("city", val);

    // Define the hotel price types (fixed 3 types)
    const hotelTypes = [0, 1, 2]; // 0: Deluxe, 1: Super Deluxe, 2: Premium

    // Create hotelprice array, where each type will have a hotels array of length equal to the number of cities
    const updatedHotelPrice = hotelTypes.map((type) => ({
      type, // Fixed types 0, 1, 2
      hotels: val.map(() => ({
        hotelName: "",
        tourPrice: 0,
        offerPrice: 0,
        commissionPrice: 0,
      })),
    }));

    // Set the hotelprice field with updated values
    formik.setFieldValue("hotelprice", updatedHotelPrice);
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

  const handleAddImage = (index) => {
    formik.setFieldValue(
      `detailIntenirary[${index}].tailorMadeitineraryimages`,
      [
        ...formik.values.detailIntenirary[index].tailorMadeitineraryimages,
        { itineraryImageName: "", itineraryImageUrl: "", type: 1 }, // default type = 1 (Hotel)
      ]
    );
  };

  const handleRemoveImage = (index, subIndex) => {
    const updatedImages = formik.values.detailIntenirary[
      index
    ].tailorMadeitineraryimages.filter((_, i) => i !== subIndex);
    formik.setFieldValue(
      `detailIntenirary[${index}].tailorMadeitineraryimages`,
      updatedImages
    );
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
      tourdurationnights: "",
      tourdurationdays: "",
      uniqueExperience: "",
      mealplan: null,
      mealtype: null,
      city: [],

      // itinerarydate: [],
      detailIntenirary: [],
      hotelprice: [
        {
          type: 0, // Deluxe
          hotels: [], // Populate dynamically based on the number of cities
        },
        {
          type: 1, // Super Deluxe
          hotels: [], // Populate dynamically based on the number of cities
        },
        {
          type: 2, // Premium
          hotels: [], // Populate dynamically based on the number of cities
        },
      ],

      tailormadeinclusions: [{ description: "" }],
      tailormadeexclusions: [{ description: "" }],
      note: [{ note: "" }],
      visaDocuments: "",
      visaFee: "",
      visaInstruction: "",
      visaAlerts: "",
      insuranceDetails: "",
      euroTrainDetails: "",
      nriOriForDetails: "",
      bgImage: "",
      websiteBanner: "",
      websiteDescription: "",
      shopping: "",
      weather: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Handle form submission

      const detailsIternary = values.detailIntenirary.map((item, index) => {
        return {
          ...item,
          // date: formatIternaryDate(values.tourstartdate, index),
          tailormadeitineraryimagesList: item.tailorMadeitineraryimages.map(
            (image) => ({
              itineraryImageName: image.itineraryImageName,
              itineraryImageUrl: image.itineraryImageUrl,
              type: image.type,
            })
          ),
        };
      });

      let data = {
        hotelprice: values.hotelprice,
        tourTypeId: values.tours.value,
        tourName: values.nameoftour,
        tourCode: values.tourcode,
        departureTypeId: values.departure.value,
        countryId: values.country.value,
        stateId: values.state ? values.state.value : null,
        destinationId: values.destination.value,
        night: values.tourdurationnights,
        days: values.tourdurationdays,
        cityId: values.city.map((item) => item.value),
        uniqueExperience: values.uniqueExperience,
        mealPlanId: values.mealplan.value,

        detailIntenirary: detailsIternary,
        tailormadeinclusions: values.tailormadeinclusions,
        tailormadeexclusions: values.tailormadeexclusions,
        note: values.note,
        visaDocuments: values.visaDocuments,
        visaFee: values.visaFee,
        visaInstruction: values.visaInstruction,
        visaAlerts: values.visaAlerts,
        insuranceDetails: values.insuranceDetails,
        euroTrainDetails: values.euroTrainDetails,
        nriOriForDetails: values.nriOriForDetails,
        bgImage: values.bgImage,
        websiteBanner: values.websiteBanner,
        websiteDescription: values.websiteDescription,
        shopping: values.shopping,
        weather: values.weather,
      };

      try {
        setIsLoading(true);
        const response = await post(`add-tailor-made`, data);
        setIsLoading(false);
        toast.success(response?.data?.message);
        navigate(`/tailormade-tours`);
      } catch (error) {
        setIsLoading(false);
        toast.error(error?.response?.data?.message);
      }
    },
  });

  const handleCheckboxChange = (index, mealType) => {
    debugger;
    formik.setFieldValue(
      `detailIntenirary[${index}].mealTypeId`,
      formik.values.detailIntenirary[index]?.mealTypeId.includes(mealType)
        ? formik.values.detailIntenirary[index].mealTypeId.filter(
            (item) => item !== mealType
          )
        : [...formik.values.detailIntenirary[index].mealTypeId, mealType]
    );
  };

  useEffect(() => {
    getTourTypeList();
    getDestinationList();
    getMealPlanList();
  }, []);

  useEffect(() => {
    const textarea10 = document.getElementById("weather");
    const textarea11 = document.getElementById("shopping");
    const textarea4 = document.getElementById("visaInstruction");
    const textarea8 = document.getElementById("nriOriForDetails");
    const textarea9 = document.getElementById("euroTrainDetails");
    const textarea12 = document.getElementById("websiteDescription");

    // const textarea5 =
    // 	data.length > 0 ? document.getElementById("itinerarydescription1") : "";

    const adjustTextareaHeight = () => {
      textarea10.style.height = "auto";
      textarea10.style.height = `${textarea10.scrollHeight}px`;

      textarea11.style.height = "auto";
      textarea11.style.height = `${textarea11.scrollHeight}px`;

      textarea12.style.height = "auto";
      textarea12.style.height = `${textarea12.scrollHeight}px`;

      textarea4.style.height = "auto";
      textarea4.style.height = `${textarea4.scrollHeight}px`;
      textarea8.style.height = "auto";
      textarea8.style.height = `${textarea8.scrollHeight}px`;
      textarea9.style.height = "auto";
      textarea9.style.height = `${textarea9.scrollHeight}px`;

      // textarea5.style.height = "auto";
      // textarea5.style.height = `${textarea5.scrollHeight}px`;
    };

    textarea10?.addEventListener("input", adjustTextareaHeight);
    textarea11?.addEventListener("input", adjustTextareaHeight);
    textarea12?.addEventListener("input", adjustTextareaHeight);

    textarea4?.addEventListener("input", adjustTextareaHeight);
    textarea8?.addEventListener("input", adjustTextareaHeight);
    textarea9?.addEventListener("input", adjustTextareaHeight);

    // data.length > 0 &&
    // 	textarea5?.addEventListener("input", adjustTextareaHeight);
    return () => {
      textarea10?.removeEventListener("input", adjustTextareaHeight);
      textarea11?.removeEventListener("input", adjustTextareaHeight);
      textarea12?.removeEventListener("input", adjustTextareaHeight);
      textarea4?.removeEventListener("input", adjustTextareaHeight);
      textarea8?.removeEventListener("input", adjustTextareaHeight);
      textarea9?.removeEventListener("input", adjustTextareaHeight);

      // data.length > 0 &&
      // 	textarea5?.removeEventListener("input", adjustTextareaHeight);
    };
  }, []);

  useEffect(() => {
    formik.values.note.forEach((item, index) => {
      const textarea = document.getElementById(`note[${index}].note`);
      textarea.addEventListener("input", function () {
        this.style.height = "auto"; // Reset height to auto
        this.style.height = this.scrollHeight + "px"; // Set height to scrollHeight
      });
    });
  }, [formik.values.note]);

  useEffect(() => {
    // console.log(window.location.href.split("/"));
    const pathArray = window.location.href.split("/");
    const path = pathArray[pathArray.length - 1];
    // console.log(path);
    let element = document.getElementById("tailormade-tours");
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

  const handleAddInclusion = () => {
    formik.setFieldValue("tailormadeinclusions", [
      ...formik.values.tailormadeinclusions,
      { description: "" },
    ]);
  };

  const handleRemoveInclusion = (index) => {
    const updatedInclusions = [...formik.values.tailormadeinclusions];
    updatedInclusions.splice(index, 1);
    formik.setFieldValue("tailormadeinclusions", updatedInclusions);
  };

  const handleAddExclusion = () => {
    formik.setFieldValue("tailormadeexclusions", [
      ...formik.values.tailormadeexclusions,
      { description: "" },
    ]);
  };

  const handleRemoveExclusion = (index) => {
    const updatedExclusions = [...formik.values.tailormadeexclusions];
    updatedExclusions.splice(index, 1);
    formik.setFieldValue("tailormadeexclusions", updatedExclusions);
  };

  const handleAddNote = () => {
    formik.setFieldValue("note", [...formik.values.note, { note: "" }]);
  };

  const handleRemoveNote = (index) => {
    const updatedNotes = [...formik.values.note];
    updatedNotes.splice(index, 1);
    formik.setFieldValue("note", updatedNotes);
  };

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

      const responseData = await axios.post(`${url}/image-upload`, formData);

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

  console.log("formik.values", formik.values);
  console.log("formik.errors", formik.errors);

  const handleDaysChange = (e) => {
    const days = e.target.value;

    formik.setFieldValue("tourdurationdays", days);

    // if (!isNaN(nightDifference.toString()) && !isNaN(dayDifference.toString())) {
    if (!isNaN(days.toString())) {
      const length = days;

      formik.setFieldValue(
        "detailIntenirary",
        Array.from({ length }, () => ({ ...detailedItineraryObj }))
      );
    }
  };

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
              <Link to="/tailormade-tours">View Tour</Link>
            </li>
            <li className="breadcrumb-item  ">
              <Link to="/add-new-tailor-made">Add Tour</Link>
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
                        Tour Name<span className="error-star">*</span>
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
                        Tour Code<span className="error-star">*</span>
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
                        Tour Type<span className="error-star">*</span>
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
                        Destination<span className="error-star">*</span>
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
                        Departure<span className="error-star">*</span>
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
                        Country<span className="error-star">*</span>
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
                      <div className="row">
                        <div className="col-sm-6 pax-adults">
                          <label>
                            Duration(Nights)
                            <span className="error-star">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control w-60"
                            value={formik.values.tourdurationnights}
                            onChange={formik.handleChange}
                            name="tourdurationnights"
                          />
                          <ErrorMessageComponent
                            errors={formik.errors}
                            fieldName={"tourdurationnights"}
                            touched={formik.touched}
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
                            value={formik.values.tourdurationdays}
                            onChange={handleDaysChange}
                            name="tourdurationdays"
                          />
                          <ErrorMessageComponent
                            errors={formik.errors}
                            fieldName={"tourdurationdays"}
                            touched={formik.touched}
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
                        City<span className="error-star">*</span>
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
                        Meal Plan<span className="error-star">*</span>
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
                </div>
              </div>
            </div>

            {formik.values?.city?.length > 0 ? (
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="tourprice mb-2">
                        <div
                          className="card-header pb-2 pt-2"
                          style={{ paddingLeft: "0px" }}
                        >
                          <div className="card-title h5">
                            Tour price and discounts
                          </div>
                        </div>
                        <div className="table-responsive">
                          {formik.values.hotelprice.map((type, typeIndex) => (
                            <div key={typeIndex} className="mb-4">
                              <div className="h6">
                                {type.type === 0
                                  ? "Deluxe"
                                  : type.type === 1
                                  ? "Super Deluxe"
                                  : "Premium"}
                              </div>
                              <table className="table table-bordered table-responsive-sm table-tour table-gt">
                                <thead>
                                  <tr>
                                    <th
                                      style={{
                                        width: "200px",
                                        cursor: "default",
                                        textAlign: "left",
                                      }}
                                    >
                                      Hotel Name
                                    </th>
                                    <th
                                      style={{
                                        width: "100px",
                                        cursor: "default",
                                      }}
                                    >
                                      Tour Price
                                    </th>
                                    <th
                                      style={{
                                        width: "100px",
                                        cursor: "default",
                                      }}
                                    >
                                      Offer Price
                                    </th>
                                    <th
                                      style={{
                                        width: "100px",
                                        cursor: "default",
                                      }}
                                    >
                                      Sales Commission
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-600">
                                  {type.hotels.map((hotel, hotelIndex) => (
                                    <tr key={hotelIndex}>
                                      <td className="px-6 py-2">
                                        <input
                                          type="text"
                                          id={`hotelprice[${typeIndex}].hotels[${hotelIndex}].hotelName`}
                                          name={`hotelprice[${typeIndex}].hotels[${hotelIndex}].hotelName`}
                                          className="form-control"
                                          value={hotel.hotelName}
                                          onChange={formik.handleChange}
                                          onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.hotelprice?.[typeIndex]
                                          ?.hotels?.[hotelIndex]?.hotelName &&
                                          formik.errors.hotelprice?.[typeIndex]
                                            ?.hotels?.[hotelIndex]
                                            ?.hotelName && (
                                            <p className="error">
                                              {
                                                formik.errors.hotelprice[
                                                  typeIndex
                                                ].hotels[hotelIndex].hotelName
                                              }
                                            </p>
                                          )}
                                      </td>
                                      <td className="px-6 py-2">
                                        <input
                                          type="number"
                                          min="0"
                                          id={`hotelprice[${typeIndex}].hotels[${hotelIndex}].tourPrice`}
                                          name={`hotelprice[${typeIndex}].hotels[${hotelIndex}].tourPrice`}
                                          className="form-control"
                                          value={hotel.tourPrice}
                                          onChange={formik.handleChange}
                                          onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.hotelprice?.[typeIndex]
                                          ?.hotels?.[hotelIndex]?.tourPrice &&
                                          formik.errors.hotelprice?.[typeIndex]
                                            ?.hotels?.[hotelIndex]
                                            ?.tourPrice && (
                                            <p className="error">
                                              {
                                                formik.errors.hotelprice[
                                                  typeIndex
                                                ].hotels[hotelIndex].tourPrice
                                              }
                                            </p>
                                          )}
                                      </td>
                                      <td className="px-6 py-2">
                                        <input
                                          type="number"
                                          min="0"
                                          id={`hotelprice[${typeIndex}].hotels[${hotelIndex}].offerPrice`}
                                          name={`hotelprice[${typeIndex}].hotels[${hotelIndex}].offerPrice`}
                                          className="form-control"
                                          value={hotel.offerPrice}
                                          onChange={formik.handleChange}
                                          onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.hotelprice?.[typeIndex]
                                          ?.hotels?.[hotelIndex]?.offerPrice &&
                                          formik.errors.hotelprice?.[typeIndex]
                                            ?.hotels?.[hotelIndex]
                                            ?.offerPrice && (
                                            <p className="error">
                                              {
                                                formik.errors.hotelprice[
                                                  typeIndex
                                                ].hotels[hotelIndex].offerPrice
                                              }
                                            </p>
                                          )}
                                      </td>
                                      <td className="px-6 py-2">
                                        <input
                                          type="number"
                                          min="0"
                                          id={`hotelprice[${typeIndex}].hotels[${hotelIndex}].commissionPrice`}
                                          name={`hotelprice[${typeIndex}].hotels[${hotelIndex}].commissionPrice`}
                                          className="form-control"
                                          value={hotel.commissionPrice}
                                          onChange={formik.handleChange}
                                          onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.hotelprice?.[typeIndex]
                                          ?.hotels?.[hotelIndex]
                                          ?.commissionPrice &&
                                          formik.errors.hotelprice?.[typeIndex]
                                            ?.hotels?.[hotelIndex]
                                            ?.commissionPrice && (
                                            <p className="error">
                                              {
                                                formik.errors.hotelprice[
                                                  typeIndex
                                                ].hotels[hotelIndex]
                                                  .commissionPrice
                                              }
                                            </p>
                                          )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            {formik.values.tourdurationdays &&
              Number(formik.values.tourdurationdays) > 0 && (
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="detailsitinerary mb-2">
                          <div
                            className="card-header  pb-2 pt-2"
                            style={{ paddingLeft: "0" }}
                          >
                            <div className="card-title h5">
                              Detailed Itinerary
                            </div>
                          </div>
                          {formik.values.detailIntenirary?.map(
                            (item, index) => (
                              <div className="mb-2 row">
                                <div className="col-md-12">
                                  <div className="row mb-3">
                                    <div
                                      className="col-md-5"
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div className="mb-0">
                                        <label
                                          style={{
                                            color: "#024670",
                                            fontWeight: "600",
                                            whiteSpace: "nowrap",
                                          }}
                                        >
                                          Day {index + 1} :{" "}
                                        </label>{" "}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row ">
                                    <div className="col-md-4 col-sm-6 col-lg-3">
                                      <div className="form-group mb-2">
                                        <label>
                                          Location Name{" "}
                                          <span className="error-star">*</span>
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control me-2"
                                          id={`detailIntenirary-[${index}].title`}
                                          name={`detailIntenirary[${index}].title`}
                                          onChange={formik.handleChange}
                                          value={item.title}
                                        />
                                        {formik.touched.detailIntenirary &&
                                          formik.touched.detailIntenirary[index]
                                            ?.title &&
                                          formik.errors &&
                                          formik.errors.detailIntenirary &&
                                          formik.errors.detailIntenirary[index]
                                            ?.title && (
                                            <span className="error">
                                              {
                                                formik.errors.detailIntenirary[
                                                  index
                                                ].title
                                              }
                                            </span>
                                          )}
                                      </div>
                                    </div>
                                    <div className="col-md-4 col-sm-6 col-lg-3">
                                      <div className="form-group mb-2">
                                        <label>
                                          Distance{" "}
                                          <span className="error-star">*</span>
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control me-2"
                                          id={`detailIntenirary[${index}].distance`}
                                          name={`detailIntenirary[${index}].distance`}
                                          onChange={formik.handleChange}
                                          value={item.distance}
                                        />
                                        {formik.touched.detailIntenirary?.[
                                          index
                                        ]?.distance &&
                                        formik.errors.detailIntenirary?.[index]
                                          ?.distance ? (
                                          <span className="error">
                                            {
                                              formik?.errors?.detailIntenirary[
                                                index
                                              ].distance
                                            }
                                          </span>
                                        ) : null}
                                      </div>
                                    </div>
                                    <div className="col-md-4 col-sm-6 col-lg-3">
                                      <div className="form-group mb-2">
                                        <label className="d-flex">
                                          From City
                                          <span className="error-star">*</span>
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control me-2"
                                          id={`detailIntenirary-[${index}].fromCity`}
                                          name={`detailIntenirary[${index}].fromCity`}
                                          onChange={formik.handleChange}
                                          value={item.fromCity}
                                        />
                                        {formik.touched.detailIntenirary &&
                                          formik.touched.detailIntenirary[index]
                                            ?.fromCity &&
                                          formik.errors &&
                                          formik.errors.detailIntenirary &&
                                          formik.errors.detailIntenirary[index]
                                            ?.fromCity && (
                                            <span className="error">
                                              {
                                                formik.errors.detailIntenirary[
                                                  index
                                                ].fromCity
                                              }
                                            </span>
                                          )}
                                      </div>
                                    </div>

                                    <div className="col-md-4 col-sm-6 col-lg-3">
                                      <div className="form-group mb-2">
                                        <label className="d-flex">
                                          To City{" "}
                                          <span className="error-star">*</span>
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control me-2"
                                          id={`detailIntenirary-[${index}].toCity`}
                                          name={`detailIntenirary[${index}].toCity`}
                                          onChange={formik.handleChange}
                                          value={item.toCity}
                                        />
                                        {formik.touched.detailIntenirary &&
                                          formik.touched.detailIntenirary[index]
                                            ?.toCity &&
                                          formik.errors &&
                                          formik.errors.detailIntenirary &&
                                          formik.errors.detailIntenirary[index]
                                            ?.toCity && (
                                            <span className="error">
                                              {
                                                formik.errors.detailIntenirary[
                                                  index
                                                ].toCity
                                              }
                                            </span>
                                          )}
                                      </div>
                                    </div>

                                    <div className="col-md-4 col-sm-6 col-lg-3">
                                      <div className="form-group mb-2">
                                        <label className="d-flex">
                                          Travel time (Approx.){" "}
                                          <span className="error-star">*</span>
                                        </label>

                                        <input
                                          type="time"
                                          className="form-control flight_input"
                                          id={`detailIntenirary-[${index}].approxTravelTime`}
                                          name={`detailIntenirary[${index}].approxTravelTime`}
                                          value={item.approxTravelTime}
                                          onChange={formik.handleChange}
                                        />

                                        {formik.touched.detailIntenirary &&
                                          formik.touched.detailIntenirary[index]
                                            ?.approxTravelTime &&
                                          formik.errors &&
                                          formik.errors.detailIntenirary &&
                                          formik.errors.detailIntenirary[index]
                                            ?.approxTravelTime && (
                                            <span className="error">
                                              {
                                                formik.errors.detailIntenirary[
                                                  index
                                                ].approxTravelTime
                                              }
                                            </span>
                                          )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="row mb-2">
                                    <div className="col-md-6">
                                      <label className="text-label">
                                        Banner Image (1080 * 770)
                                        <span className="error-star">*</span>
                                      </label>
                                      <div className="col-md-12">
                                        <div className="Neon Neon-theme-dragdropbox itinerary-img">
                                          <input
                                            className="file_upload"
                                            name={`bannerImage`}
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
                                                  "bannerImage"
                                                );
                                              formik.setFieldValue(
                                                `detailIntenirary[${index}].bannerImage`,
                                                fileLink
                                              );
                                              e.target.value = "";
                                            }}
                                          />
                                          <div className="Neon-input-dragDrop">
                                            {formik.values.detailIntenirary[
                                              index
                                            ].bannerImage?.length == 0 ? (
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
                                                  Drop files here or click to
                                                  upload.
                                                </a>
                                              </div>
                                            ) : (
                                              <img
                                                src={
                                                  formik.values
                                                    .detailIntenirary[index]
                                                    .bannerImage || NoImage
                                                }
                                                alt="frontImage"
                                                width="100%"
                                                className="neon-img"
                                              />
                                            )}
                                          </div>
                                        </div>
                                        {formik.touched.detailIntenirary &&
                                          formik.touched.detailIntenirary[index]
                                            ?.bannerImage &&
                                          formik.errors &&
                                          formik.errors.detailIntenirary &&
                                          formik.errors.detailIntenirary[index]
                                            ?.bannerImage && (
                                            <span className="error">
                                              {
                                                formik.errors.detailIntenirary[
                                                  index
                                                ].bannerImage
                                              }
                                            </span>
                                          )}
                                      </div>
                                    </div>

                                    <div className="col-md-6">
                                      <label className="text-label">
                                        Hotel Image (500 * 400)
                                        <span className="error-star">*</span>
                                      </label>
                                      <div className="col-md-12">
                                        <div className="Neon Neon-theme-dragdropbox itinerary-img">
                                          <input
                                            className="file_upload"
                                            name={`hotelImage`}
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
                                                  "hotelImage"
                                                );
                                              formik.setFieldValue(
                                                `detailIntenirary[${index}].hotelImage`,
                                                fileLink
                                              );
                                              e.target.value = "";
                                            }}
                                          />
                                          <div className="Neon-input-dragDrop">
                                            {formik.values.detailIntenirary[
                                              index
                                            ].hotelImage?.length == 0 ? (
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
                                                  Drop files here or click to
                                                  upload.
                                                </a>
                                              </div>
                                            ) : (
                                              <img
                                                src={
                                                  formik.values
                                                    .detailIntenirary[index]
                                                    .hotelImage || NoImage
                                                }
                                                alt="frontImage"
                                                width="100%"
                                                className="neon-img"
                                              />
                                            )}
                                          </div>
                                        </div>
                                        {formik.touched.detailIntenirary &&
                                          formik.touched.detailIntenirary[index]
                                            ?.hotelImage &&
                                          formik.errors &&
                                          formik.errors.detailIntenirary &&
                                          formik.errors.detailIntenirary[index]
                                            ?.hotelImage && (
                                            <span className="error">
                                              {
                                                formik.errors.detailIntenirary[
                                                  index
                                                ].hotelImage
                                              }
                                            </span>
                                          )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-md-12">
                                  <label>
                                    Description{" "}
                                    <span className="error-star">*</span>
                                  </label>
                                  <ReactQuill
                                    name={`detailIntenirary[${index}].description`}
                                    modules={{
                                      toolbar: toolbarOptions,
                                    }}
                                    theme="snow"
                                    value={item.description}
                                    onChange={(data) => {
                                      formik.setFieldTouched(
                                        `detailIntenirary[${index}].description`,
                                        true
                                      );
                                      formik.setFieldValue(
                                        `detailIntenirary[${index}].description`,
                                        data
                                      );
                                    }}
                                  />

                                  {formik.touched.detailIntenirary?.[index]
                                    ?.description &&
                                  formik.errors.detailIntenirary?.[index]
                                    ?.description ? (
                                    <span className="error">
                                      {
                                        formik.errors.detailIntenirary[index]
                                          .description
                                      }
                                    </span>
                                  ) : null}
                                </div>
                                <div className="col-md-3 mt-2">
                                  <label style={{ fontWeight: "600" }}>
                                    Meals
                                  </label>
                                  <div className="d-flex">
                                    {mealsList.map((mealType) => (
                                      <label key={mealType} className="me-3">
                                        <input
                                          type="checkbox"
                                          className="me-2"
                                          value={mealType}
                                          id={`detailIntenirary-${index}-mealTypeId-${mealType}`}
                                          name={`detailIntenirary[${index}].mealTypeId`}
                                          checked={formik.values.detailIntenirary[
                                            index
                                          ]?.mealTypeId?.includes(mealType)}
                                          onChange={() =>
                                            handleCheckboxChange(
                                              index,
                                              mealType
                                            )
                                          }
                                        />
                                        {mealType}
                                      </label>
                                    ))}
                                  </div>
                                </div>
                                <div className="col-md-5 mt-2">
                                  <label style={{ fontWeight: "600" }}>
                                    Stay <span className="error-star">*</span>
                                  </label>

                                  <div className="form-group d-flex">
                                    <label
                                      className="form-check-label me-2"
                                      htmlFor="inlineCheckbox1"
                                    >
                                      Night Stay At
                                    </label>
                                    <div className="d-block">
                                      <input
                                        type="text"
                                        className="form-control "
                                        id={`detailIntenirary[${index}].nightStayAt`}
                                        name={`detailIntenirary[${index}].nightStayAt`}
                                        onChange={formik.handleChange}
                                        value={item.nightStayAt}
                                      />
                                      {formik.touched.detailIntenirary?.[index]
                                        ?.nightStayAt &&
                                      formik.errors.detailIntenirary?.[index]
                                        ?.nightStayAt ? (
                                        <span className="error">
                                          {
                                            formik.errors.detailIntenirary[
                                              index
                                            ].nightStayAt
                                          }
                                        </span>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>

                                {/* Handling Images inside Each Itinerary Item */}
                                <div className="col-md-12">
                                  <div className="row mb-3">
                                    <div
                                      className="col-md-5"
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div className="mb-0">
                                        <label
                                          style={{
                                            color: "#024670",
                                            fontWeight: "600",
                                            whiteSpace: "nowrap",
                                          }}
                                        >
                                          Images for Day {index + 1}:
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Iterate through images for the day */}
                                  {item.tailorMadeitineraryimages?.map(
                                    (subItem, subIndex) => (
                                      <div key={subIndex} className="row">
                                        {/* Experience Name Input */}
                                        <div className="col-md-4 col-sm-6 col-lg-3">
                                          <div className="form-group mb-2">
                                            <label>
                                              Experience Name{" "}
                                              <span className="error">*</span>
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control me-2"
                                              name={`detailIntenirary[${index}].tailorMadeitineraryimages[${subIndex}].itineraryImageName`}
                                              onChange={formik.handleChange}
                                              value={subItem.itineraryImageName}
                                            />
                                            {formik.touched.detailIntenirary?.[
                                              index
                                            ]?.tailorMadeitineraryimages?.[
                                              subIndex
                                            ]?.itineraryImageName &&
                                              formik.errors.detailIntenirary?.[
                                                index
                                              ]?.tailorMadeitineraryimages?.[
                                                subIndex
                                              ]?.itineraryImageName && (
                                                <span className="error">
                                                  {
                                                    formik.errors
                                                      .detailIntenirary[index]
                                                      .tailorMadeitineraryimages[
                                                      subIndex
                                                    ].itineraryImageName
                                                  }
                                                </span>
                                              )}
                                          </div>
                                        </div>

                                        {/* Image Type Selector (Hotel or Place) */}
                                        <div className="flex flex-col space-y-2 col-md-4 col-sm-6 col-lg-3">
                                          <label className="font-medium text-sm text-gray-700">
                                            Image For:
                                          </label>
                                          <select
                                            name={`detailIntenirary[${index}].tailorMadeitineraryimages[${subIndex}].type`}
                                            value={subItem.type}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="p-2 border rounded-md shadow-sm"
                                          >
                                            <option value={1}>Hotel</option>
                                            <option value={0}>Place</option>
                                          </select>
                                        </div>

                                        <div className="col-md-6">
                                          <label className="text-label">
                                            Experience Image{" "}
                                            <span className="error-star">
                                              *
                                            </span>
                                          </label>
                                          <div className="col-md-12">
                                            <div className="Neon Neon-theme-dragdropbox itinerary-img">
                                              <input
                                                className="file_upload"
                                                accept="image/*"
                                                type="file"
                                                onChange={async (e) => {
                                                  const selectedFile =
                                                    e.target.files[0];
                                                  const fileLink =
                                                    await getFileLink(
                                                      selectedFile,
                                                      "itineraryImageUrl"
                                                    );
                                                  formik.setFieldValue(
                                                    `detailIntenirary[${index}].tailorMadeitineraryimages[${subIndex}].itineraryImageUrl`,
                                                    fileLink
                                                  );
                                                  e.target.value = "";
                                                }}
                                              />
                                              <div className="Neon-input-dragDrop">
                                                {subItem.itineraryImageUrl ? (
                                                  <img
                                                    src={
                                                      subItem.itineraryImageUrl ||
                                                      NoImage
                                                    }
                                                    alt="frontImage"
                                                    width="100%"
                                                    className="neon-img"
                                                  />
                                                ) : (
                                                  <div className="Neon-input-inner">
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
                                                      Drop files here or click
                                                      to upload.
                                                    </a>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                          <span className="error">
                                            {formik.errors
                                              .tailorMadeitineraryimages &&
                                            formik.errors
                                              .tailorMadeitineraryimages[
                                              index
                                            ] &&
                                            formik.errors
                                              .tailorMadeitineraryimages[index]
                                              .tailorMadeitineraryimagesList &&
                                            formik.errors
                                              .tailorMadeitineraryimages[index]
                                              .tailorMadeitineraryimagesList[
                                              subIndex
                                            ] &&
                                            formik.errors
                                              .tailorMadeitineraryimages[index]
                                              .tailorMadeitineraryimagesList[
                                              subIndex
                                            ].itineraryImageUrl ? (
                                              <div className="text-red-500 text-sm mt-1">
                                                {
                                                  formik.errors
                                                    .tailorMadeitineraryimages[
                                                    index
                                                  ]
                                                    .tailorMadeitineraryimagesList[
                                                    subIndex
                                                  ].itineraryImageUrl
                                                }
                                              </div>
                                            ) : null}
                                          </span>
                                        </div>
                                        <div className="col-md-12">
                                          <div className="divider"></div>
                                        </div>

                                        {/* Cancel Icon for Removing */}
                                        {formik.values.detailIntenirary[index]
                                          .tailorMadeitineraryimages?.length >
                                          1 && (
                                          <div className="col-md-12 text-end">
                                            <Tooltip title="Delete">
                                              <button
                                                type="button"
                                                className="btn btn-trash bg-yellow"
                                                onClick={() =>
                                                  handleRemoveImage(
                                                    index,
                                                    subIndex
                                                  )
                                                }
                                              >
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  height="1em"
                                                  viewBox="0 0 448 512"
                                                  aria-label="Delete"
                                                  className=""
                                                  data-mui-internal-clone-element="true"
                                                >
                                                  <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"></path>
                                                </svg>
                                              </button>
                                            </Tooltip>
                                          </div>
                                        )}
                                      </div>
                                    )
                                  )}
                                  <div className="col-md-12 text-end">
                                    <Tooltip title="Add">
                                      <button
                                        type="button"
                                        className="btn btn-save btn-primary mt-5"
                                        onClick={() => handleAddImage(index)}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          height="1em"
                                          fill="#07"
                                          viewBox="0 0 448 512"
                                        >
                                          <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path>
                                        </svg>
                                      </button>
                                    </Tooltip>
                                  </div>
                                </div>

                                <div className="col-md-12">
                                  <div className="divider"></div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {formik.values.destination?.value == "2" && (
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="skeleton mb-2">
                        <div
                          className="card-header  pb-2 pt-2"
                          style={{ paddingLeft: "0" }}
                        >
                          <div className="card-title h5">Visa Details</div>
                        </div>
                        <div className="row">
                          <div className="col-md-6 mb-2">
                            <label>
                              Visa Document Required
                              <span className="error-star">*</span>
                            </label>
                            <div className="">
                              <input
                                className="form-control"
                                type="text"
                                id="visaDocuments"
                                name="visaDocuments"
                                onChange={formik.handleChange}
                                value={formik.values.visaDocuments}
                              />
                              <ErrorMessageComponent
                                errors={formik.errors}
                                fieldName={"visaDocuments"}
                                touched={formik.touched}
                              />
                            </div>
                          </div>

                          <div className="col-md-6 mb-2">
                            <label>
                              Visa Fees
                              <span className="error-star">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="visaFee"
                              name="visaFee"
                              onChange={formik.handleChange}
                              value={formik.values.visaFee}
                            />
                            <ErrorMessageComponent
                              errors={formik.errors}
                              fieldName={"visaFee"}
                              touched={formik.touched}
                            />
                          </div>

                          <div className="col-md-6 mb-2">
                            <label>
                              Visa Instructions
                              <span className="error-star">*</span>
                            </label>
                            <textarea
                              type="text"
                              className="textarea"
                              id="visaInstruction"
                              name="visaInstruction"
                              onChange={formik.handleChange}
                              value={formik.values.visaInstruction}
                            />
                            <ErrorMessageComponent
                              errors={formik.errors}
                              fieldName={"visaInstruction"}
                              touched={formik.touched}
                            />
                          </div>

                          <div className="col-md-6 mb-2">
                            <label>
                              Visa Alerts
                              <span className="error-star">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="visaAlerts"
                              name="visaAlerts"
                              onChange={formik.handleChange}
                              value={formik.values.visaAlerts}
                            />
                            <ErrorMessageComponent
                              errors={formik.errors}
                              fieldName={"visaAlerts"}
                              touched={formik.touched}
                            />
                          </div>

                          <div className="col-md-6 mb-2">
                            <label>
                              Insurance Details
                              <span className="error-star">*</span>
                            </label>
                            <div className="">
                              <input
                                className="form-control"
                                type="text"
                                id="insuranceDetails"
                                name="insuranceDetails"
                                onChange={formik.handleChange}
                                value={formik.values.insuranceDetails}
                              />
                              <ErrorMessageComponent
                                errors={formik.errors}
                                fieldName={"insuranceDetails"}
                                touched={formik.touched}
                              />
                            </div>
                          </div>

                          <div className="col-md-6 mb-2">
                            <label>
                              Euro Start Train Details
                              <span className="error-star">*</span>
                            </label>
                            <textarea
                              type="text"
                              className="textarea"
                              id="euroTrainDetails"
                              name="euroTrainDetails"
                              onChange={formik.handleChange}
                              value={formik.values.euroTrainDetails}
                            />
                            <ErrorMessageComponent
                              errors={formik.errors}
                              fieldName={"euroTrainDetails"}
                              touched={formik.touched}
                            />
                          </div>

                          <div className="col-md-6 mb-2">
                            <label>
                              NRI/OCI/Foreign Details
                              <span className="error-star">*</span>
                            </label>
                            <textarea
                              type="text"
                              className="textarea"
                              id="nriOriForDetails"
                              name="nriOriForDetails"
                              onChange={formik.handleChange}
                              value={formik.values.nriOriForDetails}
                            />
                            <ErrorMessageComponent
                              errors={formik.errors}
                              fieldName={"nriOriForDetails"}
                              touched={formik.touched}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="inclusion mb-2">
                      <div
                        className="card-header  pb-2 pt-2"
                        style={{ paddingLeft: "0" }}
                      >
                        <div className="card-title h5">
                          Inclusions<span className="error-star">*</span>{" "}
                          <Tooltip title="Add">
                            <button
                              type="button"
                              className="btn btn-save btn-primary"
                              onClick={handleAddInclusion}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="1em"
                                fill="#07"
                                viewBox="0 0 448 512"
                              >
                                <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path>
                              </svg>
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                      <>
                        {formik.values.tailormadeinclusions.map(
                          (inclusion, index) => (
                            <div className="col-md-12">
                              <div className="mb-2">
                                <label>Description</label>
                                <div
                                  className="d-flex gap-2 "
                                  style={{
                                    alignItems: "baseline",
                                  }}
                                >
                                  <input
                                    id={`tailormadeinclusions[${index}].description`}
                                    name={`tailormadeinclusions[${index}].description`}
                                    type="text"
                                    min={3}
                                    max={50}
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    value={inclusion.description}
                                  />

                                  {formik.values.tailormadeinclusions.length >
                                    1 && (
                                    <Tooltip title="Delete">
                                      <button
                                        type="button"
                                        className="btn btn-trash bg-yellow"
                                        onClick={() =>
                                          handleRemoveInclusion(index)
                                        }
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          height="1em"
                                          viewBox="0 0 448 512"
                                          aria-label="Delete"
                                          className=""
                                          data-mui-internal-clone-element="true"
                                        >
                                          <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"></path>
                                        </svg>
                                      </button>
                                    </Tooltip>
                                  )}
                                </div>
                                {formik.touched.tailormadeinclusions &&
                                  formik.touched.tailormadeinclusions[index]
                                    ?.description &&
                                  formik.errors &&
                                  formik.errors.tailormadeinclusions &&
                                  formik.errors.tailormadeinclusions[index]
                                    ?.description && (
                                    <span className="error">
                                      {
                                        formik.errors.tailormadeinclusions[
                                          index
                                        ].description
                                      }
                                    </span>
                                  )}
                              </div>
                            </div>
                          )
                        )}
                      </>
                    </div>

                    <div className="exclusion mb-2">
                      <div
                        className="card-header  pb-2 pt-2"
                        style={{ paddingLeft: "0" }}
                      >
                        <div className="card-title h5">
                          Exclusions<span className="error-star">*</span>{" "}
                          <Tooltip title="Add">
                            <button
                              type="button"
                              className="btn btn-save btn-primary me-2 "
                              onClick={handleAddExclusion}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="1em"
                                fill="#07"
                                viewBox="0 0 448 512"
                              >
                                <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path>
                              </svg>
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                      <>
                        {formik.values.tailormadeexclusions.map(
                          (inclusion, index) => (
                            <div className="col-md-12">
                              <div className="mb-2">
                                <label>Description</label>
                                <div
                                  className="d-flex gap-2 "
                                  style={{
                                    alignItems: "baseline",
                                  }}
                                >
                                  <input
                                    id={`tailormadeexclusions[${index}].description`}
                                    name={`tailormadeexclusions[${index}].description`}
                                    type="text"
                                    min={3}
                                    max={50}
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    value={inclusion.description}
                                  />

                                  {formik.values.tailormadeexclusions.length >
                                    1 && (
                                    <Tooltip title="Delete">
                                      <button
                                        type="button"
                                        className="btn btn-trash bg-yellow"
                                        onClick={() =>
                                          handleRemoveExclusion(index)
                                        }
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          height="1em"
                                          viewBox="0 0 448 512"
                                          aria-label="Delete"
                                          className=""
                                          data-mui-internal-clone-element="true"
                                        >
                                          <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"></path>
                                        </svg>
                                      </button>
                                    </Tooltip>
                                  )}
                                </div>
                                {formik.touched.tailormadeexclusions &&
                                  formik.touched.tailormadeexclusions[index]
                                    ?.description &&
                                  formik.errors &&
                                  formik.errors.tailormadeexclusions &&
                                  formik.errors.tailormadeexclusions[index]
                                    ?.description && (
                                    <span className="error">
                                      {
                                        formik.errors.tailormadeexclusions[
                                          index
                                        ].description
                                      }
                                    </span>
                                  )}
                              </div>
                            </div>
                          )
                        )}
                      </>
                    </div>

                    <div className="notes mb-3">
                      <div
                        className="card-header pb-2 pt-2"
                        style={{ paddingLeft: "0" }}
                      >
                        <div className="card-title h5">
                          Note<span className="error-star"></span>{" "}
                          <Tooltip title="Add">
                            <button
                              type="button"
                              className="btn btn-save btn-primary"
                              onClick={handleAddNote}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="1em"
                                fill="#07"
                                viewBox="0 0 448 512"
                              >
                                <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path>
                              </svg>
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                      {formik.values.note.map((item, index) => (
                        <div className="mb-2">
                          <label>Description</label>
                          <div
                            className="d-flex gap-2 "
                            style={{ alignItems: "baseline" }}
                          >
                            <textarea
                              key={index}
                              type="text"
                              className="textarea"
                              id={`note[${index}].note`}
                              name={`note[${index}].note`}
                              value={item.note}
                              onChange={formik.handleChange}
                            />
                            {formik.values.note.length > 1 && (
                              <Tooltip title="Delete">
                                <button
                                  type="button"
                                  className="btn btn-trash bg-yellow"
                                  onClick={() => handleRemoveNote(index)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="1em"
                                    viewBox="0 0 448 512"
                                    aria-label="Delete"
                                    class=""
                                    data-mui-internal-clone-element="true"
                                  >
                                    <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"></path>
                                  </svg>
                                </button>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

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
                    onClick={() => navigate("/tailormade-tours")}
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

export default AddNewTailorMadeJourney;
