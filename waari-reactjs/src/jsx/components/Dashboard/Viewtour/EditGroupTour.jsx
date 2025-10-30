import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import ErrorMessageComponent from "../../Dashboard/FormErrorComponent/ErrorMessageComponent";
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

function EditGroupTour() {
  const validationSchema = Yup.object().shape({
    nameoftour: Yup.string().min(3).max(50),
    tourcode: Yup.string(),
    tours: Yup.object().nullable(),
    destination: Yup.object().nullable(),
    city: Yup.array().nullable(),
    totalseat: Yup.number(),
    uniqueExperience: Yup.number(),
    tourmanager: Yup.string(),
    managerNo: Yup.string().min(10).max(10),
    detailIntenirary: Yup.array().of(
      Yup.object().shape({
        title: Yup.string(),
        distance: Yup.string(),
        description: Yup.string(),
        nightStayAt: Yup.string(),
        mealTypeId: Yup.array(),
        fromCity: Yup.string(),
        toCity: Yup.string(),
        approxTravelTime: Yup.string(),
        bannerImage: Yup.string(),
        hotelImage: Yup.string(),
        grouptouritineraryimages: Yup.array().of(
          Yup.object().shape({
            itineraryImageName: Yup.string(),
            itineraryImageUrl: Yup.string().url(),
            type: Yup.number().oneOf([0, 1]),
          })
        ),
      })
    ),
    itinerarydate: Yup.array().of(
      Yup.object().shape({
        destination: Yup.string(),
        overnightAt: Yup.string(),
        hotelName: Yup.string(),
        hotelAddress: Yup.string(),
      })
    ),
    roomsharingprice: Yup.array().of(
      Yup.object().shape({
        tourPrice: Yup.number().min(0),
        offerPrice: Yup.number().min(0),
        commissionPrice: Yup.number(),
      })
    ),
    departure: Yup.object().nullable(),
    flights: Yup.array(),
    trains: Yup.array(),
    visaDocuments: Yup.string(),
    visaFee: Yup.string(),
    visaInstruction: Yup.string(),
    visaAlerts: Yup.string(),
    insuranceDetails: Yup.string(),
    euroTrainDetails: Yup.string(),
    nriOriForDetails: Yup.string(),
    startCity: Yup.string(),
    pickUpMeetTime: Yup.string(),
    endCity: Yup.string(),
    dropOffPoint: Yup.string(),
    pickUpMeet: Yup.string(),
    arriveBefore: Yup.string(),
    dropOffTime: Yup.string(),
    bookAfter: Yup.string(),
    inclusions: Yup.array().of(
      Yup.object().shape({
        description: Yup.string(),
      })
    ),
    exclusions: Yup.array().of(
      Yup.object().shape({
        description: Yup.string(),
      })
    ),
    vehicles: Yup.object().nullable(),
    mealplan: Yup.object().nullable(),
    kitchen: Yup.object().nullable(),
    mealtype: Yup.object().nullable(),
    bgImage: Yup.string(),
    websiteBanner: Yup.string(),
    websiteDescription: Yup.string(),
    shopping: Yup.string(),
    weather: Yup.string(),
  });

  const skeletonItineraryObj = {
    destination: "",
    overnightAt: "",
    hotelName: "",
    hotelAddress: "",
  };

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
    grouptouritineraryimages: [
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
      formik.setFieldValue("tourdurationnights", response.data.data.night);
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

      formik.setFieldValue("roomsharingprice", response.data.data.tourPrice);
      if (response.data.data.flightDetails?.length) {
        formik.setFieldValue("flights", response.data.data.flightDetails);
      }
      formik.setFieldValue("trains", response.data.data.trainDetails);
      formik.setFieldValue("startCity", response.data.data.dtod[0].startCity);
      formik.setFieldValue(
        "pickUpMeetTime",
        response.data.data.dtod[0].pickUpMeetTime
      );
      formik.setFieldValue("endCity", response.data.data.dtod[0].endCity);
      formik.setFieldValue(
        "dropOffPoint",
        response.data.data.dtod[0].dropOffPoint
      );
      formik.setFieldValue("pickUpMeet", response.data.data.dtod[0].pickUpMeet);
      formik.setFieldValue(
        "arriveBefore",
        response.data.data.dtod[0].arriveBefore
      );
      formik.setFieldValue(
        "dropOffTime",
        response.data.data.dtod[0].dropOffTime
      );
      formik.setFieldValue("bookAfter", response.data.data.dtod[0].bookAfter);
      formik.setFieldValue("inclusions", response.data.data.inclusions);
      formik.setFieldValue("exclusions", response.data.data.exclusions);
      formik.setFieldValue("note", response.data.data.note);
      formik.setFieldValue("shopping", response.data.data.shopping);
      formik.setFieldValue("weather", response.data.data.weather);
      formik.setFieldValue("visaDocuments", response.data.data.visaDocuments);
      formik.setFieldValue("visaFee", response.data.data.visaFee);
      formik.setFieldValue(
        "visaInstruction",
        response.data.data.visaInstruction
      );
      formik.setFieldValue("visaAlerts", response.data.data.visaAlerts);
      formik.setFieldValue(
        "insuranceDetails",
        response.data.data.insuranceDetails
      );
      formik.setFieldValue(
        "euroTrainDetails",
        response.data.data.euroTrainDetails
      );
      formik.setFieldValue(
        "nriOriForDetails",
        response.data.data.nriOriForDetails
      );

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

  useEffect(() => {
    if (dayDifference) {
      addDetailsItenerary(dayDifference);
    }

    if (dayDifference && toursData.skeletonItinerary?.length) {
      formik.setFieldValue("itinerarydate", toursData.skeletonItinerary);
    }

    if (toursData?.detailedItinerary?.length && dayDifference) {
      formik.setFieldValue("detailIntenirary", toursData.detailedItinerary);
    }

    if (toursData && dayDifference) {
      // Transform the backend data to match the frontend structure
      const transformedImages = toursData.detailedItinerary.map((itinerary) => {
        // Collect images for both types (places and hotels)
        const placeImages =
          toursData.grouptouritineraryimages["0"]?.map((image) => ({
            itineraryImageName: image.itineraryImageName,
            itineraryImageUrl: image.itineraryImageUrl,
            type: image.type,
          })) || [];

        const hotelImages =
          toursData.grouptouritineraryimages["1"]?.map((image) => ({
            itineraryImageName: image.itineraryImageName,
            itineraryImageUrl: image.itineraryImageUrl,
            type: image.type,
          })) || [];

        // Combine both place and hotel images
        const allImages = [...placeImages, ...hotelImages];

        return {
          ...itinerary,
          grouptouritineraryimages: allImages,
        };
      });

      if (transformedImages.length) {
        formik.setFieldValue("detailIntenirary", transformedImages);
      }
    }
  }, [dayDifference, toursData]);
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
    if (
      !isNaN(nightDifference.toString()) &&
      !isNaN(dayDifference.toString())
    ) {
      addDetailsItenerary(dayDifference);
    }
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
    if (
      !isNaN(nightDifference.toString()) &&
      !isNaN(dayDifference.toString())
    ) {
      addDetailsItenerary(dayDifference);
    }
  };
  const addDetailsItenerary = () => {
    formik.setFieldValue(
      "itinerarydate",
      Array.from({ length: dayDifference }, () => ({ ...skeletonItineraryObj }))
    );

    formik.setFieldValue(
      "detailIntenirary",
      Array.from({ length: dayDifference }, () => ({
        ...detailedItineraryObj,
      }))
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

  const handleAddImage = (index) => {
    formik.setFieldValue(
      `detailIntenirary[${index}].grouptouritineraryimages`,
      [
        ...formik.values.detailIntenirary[index].grouptouritineraryimages,
        { itineraryImageName: "", itineraryImageUrl: "", type: 1 }, // default type = 1 (Hotel)
      ]
    );
  };

  const handleRemoveImage = (index, subIndex) => {
    const updatedImages = formik.values.detailIntenirary[
      index
    ].grouptouritineraryimages.filter((_, i) => i !== subIndex);
    formik.setFieldValue(
      `detailIntenirary[${index}].grouptouritineraryimages`,
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
      itinerarydate: [],
      detailIntenirary: [],
      roomsharingprice: [
        {
          roomShareId: 1,
          roomShareName: "Adult Single Sharing",
          tourPrice: "",
          offerPrice: "",
          commissionPrice: "",
        },
        {
          roomShareId: 2,
          roomShareName: "Adult Double Sharing",
          tourPrice: "",
          offerPrice: "",
          commissionPrice: "",
        },
        {
          roomShareId: 3,
          roomShareName: "Adult Triple Sharing",
          tourPrice: "",
          offerPrice: "",
          commissionPrice: "",
        },
        {
          roomShareId: 4,
          roomShareName: "Child with Mattress (5-11)",
          tourPrice: "",
          offerPrice: "",
          commissionPrice: "",
        },
        {
          roomShareId: 5,
          roomShareName: "Child without Mattress (5-11)",
          tourPrice: "",
          offerPrice: "",
          commissionPrice: "",
        },
        {
          roomShareId: 6,
          roomShareName: "Child (2-4)",
          tourPrice: "",
          offerPrice: "",
          commissionPrice: "",
        },
        {
          roomShareId: 7,
          roomShareName: "Infant",
          tourPrice: "",
          offerPrice: "",
          commissionPrice: "",
        },
        {
          roomShareId: 8,
          roomShareName: "Adult Quad Sharing",
          tourPrice: "",
          offerPrice: "",
          commissionPrice: "",
        },
      ],
      flights: [
        {
          journey: "Onward",
          flight: "",
          airline: "",
          class: "",
          from: "",
          fromDate: "",
          fromTime: "",
          to: "",
          toDate: "",
          toTime: "",
          weight: "",
        },
        {
          journey: "Return",
          flight: "",
          airline: "",
          class: "",
          from: "",
          fromDate: "",
          fromTime: "",
          to: "",
          toDate: "",
          toTime: "",
          weight: "",
        },
      ],
      trains: [
        {
          journey: "Onwards",
          trainNo: "",
          trainName: "",
          from: "",
          fromDate: "",
          fromTime: "",
          to: "",
          toDate: "",
          toTime: "",
        },
        {
          journey: "Returns",
          trainNo: "",
          trainName: "",
          from: "",
          fromDate: "",
          fromTime: "",
          to: "",
          toDate: "",
          toTime: "",
        },
      ],
      startCity: "",
      pickUpMeetTime: "",
      endCity: "",
      dropOffPoint: "",
      pickUpMeet: "",
      arriveBefore: "",
      dropOffTime: "",
      bookAfter: "",
      inclusions: [{ description: "" }],
      exclusions: [{ description: "" }],
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
      const newObject = {
        startCity: values.startCity,
        pickUpMeet: values.pickUpMeet,
        pickUpMeetTime: values.pickUpMeetTime,
        arriveBefore: values.arriveBefore,
        endCity: values.endCity,
        dropOffPoint: values.dropOffPoint,
        dropOffTime: values.dropOffTime,
        bookAfter: values.bookAfter,
      };

      const updatedArray = [newObject];
      const itinerarydate = values.itinerarydate.map((item, index) => {
        return {
          ...item,
          date: formatIternaryDate(values.tourstartdate, index),
        };
      });
      const detailsIternary = values.detailIntenirary.map((item, index) => {
        return {
          ...item,
          date: formatIternaryDate(toursData.startDate, index),
          grouptouritineraryimagesList: item.grouptouritineraryimages.map(
            (image) => ({
              itineraryImageName: image.itineraryImageName,
              itineraryImageUrl: image.itineraryImageUrl,
              type: image.type,
            })
          ),
        };
      });

      let data = {
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
        skeletonInteriory: itinerarydate,
        roomsharingprice: values.roomsharingprice,
        traindetails: values.trains,
        flightdetails: values.departure.value == "1" ? [] : values.flights,
        detailedItinerary: detailsIternary,
        inclusions: values.inclusions,
        exclusions: values.exclusions,
        note: values.note,
        d2dtime: updatedArray,
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

        const response = await axios.post(
          `${import.meta.env.VITE_WAARI_BASEURL}/update-group-tour-list?groupTourId=${id}`,
          data,
          { headers: { "Content-Type": "application/json" } }
        );

        console.log(data);
        setIsLoading(false);
        navigate(`/View-group-tour`);
        toast.success(response?.data?.message);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    },
  });

  const handleCheckboxChange = (index, mealType) => {
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
    getVehicleList();
    getMealPlanList();
    getMealTypeList();
    getkitchenList();
    getTourDetails();
  }, []);

  useEffect(() => {
    formik.values.itinerarydate.forEach((item, index) => {
      const textarea5 = document.getElementById(
        `itinerarydate[${index}].hotelAddress`
      );
      textarea5.addEventListener("input", function () {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px"; // Set height to scrollHeight
      });
    });
  }, [formik.values.itinerarydate]);

  useEffect(() => {
    const textarea10 = document.getElementById("weather");
    const textarea11 = document.getElementById("shopping");
    const textarea12 = document.getElementById("websiteDescription");

    const textarea1 = document.getElementById("inclusion");
    const textarea2 = document.getElementById("exclusion");
    const textarea4 = document.getElementById("visaInstruction");
    const textarea8 = document.getElementById("nriOriForDetails");
    const textarea9 = document.getElementById("euroTrainDetails");

    const adjustTextareaHeight = () => {
      textarea10.style.height = "auto";
      textarea10.style.height = `${textarea10.scrollHeight}px`;

      textarea11.style.height = "auto";
      textarea11.style.height = `${textarea11.scrollHeight}px`;

      textarea12.style.height = "auto";
      textarea12.style.height = `${textarea12.scrollHeight}px`;

      textarea1.style.height = "auto";
      textarea1.style.height = `${textarea1.scrollHeight}px`;

      textarea2.style.height = "auto";
      textarea2.style.height = `${textarea2.scrollHeight}px`;
      textarea4.style.height = "auto";
      textarea4.style.height = `${textarea4.scrollHeight}px`;
      textarea8.style.height = "auto";
      textarea8.style.height = `${textarea8.scrollHeight}px`;
      textarea9.style.height = "auto";
      textarea9.style.height = `${textarea9.scrollHeight}px`;
    };
    textarea10?.addEventListener("input", adjustTextareaHeight);
    textarea11?.addEventListener("input", adjustTextareaHeight);
    textarea12?.addEventListener("input", adjustTextareaHeight);

    textarea1?.addEventListener("input", adjustTextareaHeight);
    textarea2?.addEventListener("input", adjustTextareaHeight);
    textarea4?.addEventListener("input", adjustTextareaHeight);
    textarea8?.addEventListener("input", adjustTextareaHeight);
    textarea9?.addEventListener("input", adjustTextareaHeight);

    return () => {
      textarea10?.removeEventListener("input", adjustTextareaHeight);
      textarea11?.removeEventListener("input", adjustTextareaHeight);
      textarea12?.removeEventListener("input", adjustTextareaHeight);

      textarea1?.removeEventListener("input", adjustTextareaHeight);
      textarea2?.removeEventListener("input", adjustTextareaHeight);
      textarea4?.removeEventListener("input", adjustTextareaHeight);
      textarea8?.removeEventListener("input", adjustTextareaHeight);
      textarea9?.removeEventListener("input", adjustTextareaHeight);
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

  const handleAddInclusion = () => {
    formik.setFieldValue("inclusions", [
      ...formik.values.inclusions,
      { description: "" },
    ]);
  };

  const handleRemoveInclusion = (index) => {
    const updatedInclusions = [...formik.values.inclusions];
    updatedInclusions.splice(index, 1);
    formik.setFieldValue("inclusions", updatedInclusions);
  };

  const handleAddExclusion = () => {
    formik.setFieldValue("exclusions", [
      ...formik.values.exclusions,
      { description: "" },
    ]);
  };

  const handleRemoveExclusion = (index) => {
    const updatedExclusions = [...formik.values.exclusions];
    updatedExclusions.splice(index, 1);
    formik.setFieldValue("exclusions", updatedExclusions);
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

      const responseData = await axios.post(
        `${import.meta.env.VITE_WAARI_BASEURL}/user/image-upload`,
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

  console.log("values", formik.values);
  console.log("values", formik.values);

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
              <Link to="javascript:void(0)">Edit Tour</Link>
            </li>
          </ol>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <form onSubmit={formik.handleSubmit} className="needs-validation">
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

                  <div className="col-md-4 col-sm-6 col-lg-3 col-12">
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
                      <label>
                        Tour Start Date<span className="error-star">*</span>
                      </label>
                      <input
                        type="date"
                        id="tourstartdate"
                        name="tourstartdate"
                        className="form-control"
                        min={new Date().toISOString().split("T")[0]}
                        onChange={handleStartDateChange}
                        value={formik.values.tourstartdate}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-lg-3 col-12">
                    <div className="mb-2">
                      <label>
                        Tour End Date<span className="error-star">*</span>
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
                        onChange={handleEndDateChange}
                        value={formik.values.tourenddate}
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
                      <label>Unique Experiences</label>
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
                        Total Seats<span className="error-star">*</span>
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
                        Vehicles<span className="error-star">*</span>
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
                  <div className="col-md-3 col-sm-6 col-lg-2 col-12">
                    <div className="mb-2">
                      <label>
                        Kitchen<span className="error-star">*</span>
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
                        Meal Type<span className="error-star">*</span>
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
            {formik.values.tourdurationdays &&
              formik.values.tourdurationdays > 0 && (
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="skeleton mb-2">
                          <div
                            className="card-header pb-2 pt-2"
                            style={{ paddingLeft: "0px" }}
                          >
                            <div className="card-title h5">
                              Skeleton Itinerary
                            </div>
                          </div>
                          <div className="table-responsive">
                            <table className="table table-bordered   table-responsive-sm table-tour table-gt">
                              <thead>
                                <tr>
                                  <th
                                    className=""
                                    style={{
                                      width: "10%",
                                      cursor: "pointer",
                                    }}
                                  >
                                    Day<span></span>
                                  </th>
                                  <th
                                    className=""
                                    style={{
                                      width: "10%",
                                      cursor: "pointer",
                                    }}
                                  >
                                    Date<span></span>
                                  </th>
                                  <th
                                    className=""
                                    style={{
                                      width: "20%",
                                      cursor: "pointer",
                                    }}
                                  >
                                    Journey/Destination
                                  </th>
                                  <th
                                    className=""
                                    style={{
                                      width: "20%",
                                      cursor: "pointer",
                                    }}
                                  >
                                    Overnight at
                                  </th>
                                  <th
                                    className=""
                                    style={{
                                      width: "20%",
                                      cursor: "pointer",
                                    }}
                                  >
                                    Hotel Name
                                  </th>
                                  <th
                                    className=""
                                    style={{
                                      width: "20%",
                                      cursor: "pointer",
                                    }}
                                  >
                                    Hotel Address
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-600">
                                {formik.values.itinerarydate?.map(
                                  (item, index) => (
                                    <tr>
                                      <td className="px-6 py-2  ">
                                        Day {index + 1}
                                      </td>
                                      <td className="px-6 py-2  ">
                                        {formatIternaryDate(
                                          formik.values.tourstartdate,
                                          index
                                        )}
                                      </td>
                                      <td className="px-6 py-2  ">
                                        <input
                                          type="text"
                                          id={`itinerarydate[${index}].destination`}
                                          name={`itinerarydate[${index}].destination`}
                                          className="form-control"
                                          value={item.destination}
                                          onChange={formik.handleChange}
                                        />
                                        {formik.touched.itinerarydate &&
                                          formik.touched.itinerarydate[index]
                                            ?.destination &&
                                          formik.errors &&
                                          formik.errors.itinerarydate &&
                                          formik.errors.itinerarydate[index]
                                            ?.destination && (
                                            <span className="error">
                                              {
                                                formik.errors.itinerarydate[
                                                  index
                                                ].destination
                                              }
                                            </span>
                                          )}
                                      </td>
                                      <td className="px-6 py-2  ">
                                        <input
                                          type="text"
                                          className="form-control"
                                          id={`itinerarydate[${index}].overnightAt`}
                                          name={`itinerarydate[${index}].overnightAt`}
                                          value={item.overnightAt}
                                          onChange={formik.handleChange}
                                        />
                                        {formik.touched.itinerarydate &&
                                          formik.touched.itinerarydate[index]
                                            ?.overnightAt &&
                                          formik.errors &&
                                          formik.errors.itinerarydate &&
                                          formik.errors.itinerarydate[index]
                                            ?.overnightAt && (
                                            <span className="error">
                                              {
                                                formik.errors.itinerarydate[
                                                  index
                                                ].overnightAt
                                              }
                                            </span>
                                          )}
                                      </td>
                                      <td className="px-6 py-2  ">
                                        <input
                                          type="text"
                                          className="form-control"
                                          id={`itinerarydate[${index}].hotelName`}
                                          name={`itinerarydate[${index}].hotelName`}
                                          value={item.hotelName}
                                          onChange={formik.handleChange}
                                        />
                                        {formik.touched.itinerarydate &&
                                          formik.touched.itinerarydate[index]
                                            ?.hotelName &&
                                          formik.errors &&
                                          formik.errors.itinerarydate &&
                                          formik.errors.itinerarydate[index]
                                            ?.hotelName && (
                                            <span className="error">
                                              {
                                                formik.errors.itinerarydate[
                                                  index
                                                ].hotelName
                                              }
                                            </span>
                                          )}
                                      </td>
                                      <td className="px-6 py-2  ">
                                        <textarea
                                          type="text"
                                          className="textarea"
                                          id={`itinerarydate[${index}].hotelAddress`}
                                          name={`itinerarydate[${index}].hotelAddress`}
                                          value={item.hotelAddress}
                                          onChange={formik.handleChange}
                                        ></textarea>
                                        {formik.touched.itinerarydate &&
                                          formik.touched.itinerarydate[index]
                                            ?.hotelAddress &&
                                          formik.errors &&
                                          formik.errors.itinerarydate &&
                                          formik.errors.itinerarydate[index]
                                            ?.hotelAddress && (
                                            <span className="error">
                                              {
                                                formik.errors.itinerarydate[
                                                  index
                                                ].hotelAddress
                                              }
                                            </span>
                                          )}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
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
                        <table className="table table-bordered table-responsive-sm table-tour table-gt">
                          <thead>
                            <tr>
                              <th
                                style={{
                                  width: "200px",
                                  cursor: "default",
                                }}
                              >
                                Room Sharing
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
                                Sales Commision
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-600">
                            {formik.values.roomsharingprice.map(
                              (room, index) => (
                                <tr key={index}>
                                  <td className="px-6 py-2">
                                    {room.roomShareName}
                                  </td>
                                  <td className="px-6 py-2">
                                    <input
                                      type="number"
                                      min="0"
                                      id={`roomsharingprice[${index}].tourPrice`}
                                      name={`roomsharingprice[${index}].tourPrice`}
                                      className="form-control"
                                      value={room.tourPrice}
                                      onChange={formik.handleChange}
                                    />
                                    {formik.touched.roomsharingprice &&
                                      formik.touched.roomsharingprice[index]
                                        ?.tourPrice &&
                                      formik.errors &&
                                      formik.errors.roomsharingprice &&
                                      formik.errors.roomsharingprice[index]
                                        ?.tourPrice && (
                                        <span className="error">
                                          {
                                            formik.errors.roomsharingprice[
                                              index
                                            ].tourPrice
                                          }
                                        </span>
                                      )}
                                  </td>
                                  <td className="px-6 py-2">
                                    <input
                                      type="number"
                                      min="0"
                                      id={`roomsharingprice[${index}].offerPrice`}
                                      name={`roomsharingprice[${index}].offerPrice`}
                                      className="form-control"
                                      value={room.offerPrice}
                                      onChange={formik.handleChange}
                                    />
                                    {formik.touched.roomsharingprice &&
                                      formik.touched.roomsharingprice[index]
                                        ?.offerPrice &&
                                      formik.errors &&
                                      formik.errors.roomsharingprice &&
                                      formik.errors.roomsharingprice[index]
                                        ?.offerPrice && (
                                        <span className="error">
                                          {
                                            formik.errors.roomsharingprice[
                                              index
                                            ].offerPrice
                                          }
                                        </span>
                                      )}
                                  </td>
                                  <td className="px-6 py-2">
                                    <input
                                      type="number"
                                      min="0"
                                      id={`roomsharingprice[${index}].commissionPrice`}
                                      name={`roomsharingprice[${index}].commissionPrice`}
                                      className="form-control"
                                      value={room.commissionPrice}
                                      onChange={formik.handleChange}
                                    />
                                    {formik.touched.roomsharingprice &&
                                      formik.touched.roomsharingprice[index]
                                        ?.commissionPrice &&
                                      formik.errors &&
                                      formik.errors.roomsharingprice &&
                                      formik.errors.roomsharingprice[index]
                                        ?.commissionPrice && (
                                        <span className="error">
                                          {
                                            formik.errors.roomsharingprice[
                                              index
                                            ].commissionPrice
                                          }
                                        </span>
                                      )}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {formik.values.tourdurationdays &&
              formik.values.tourdurationdays > 0 && (
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
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="row">
                                    <div
                                      className="col-md-5"
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div className="mb-0 me-2">
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
                                  <div className="row mb-2">
                                    <div className="col-md-4 col-sm-6 col-lg-3">
                                      <div className="form-group">
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
                                      {formik.touched.detailIntenirary?.[index]
                                        ?.distance &&
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
                                    <div className="col-md-4 col-sm-6 col-lg-32">
                                      <div className="form-group">
                                        <label>
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
                                      <div className="form-group">
                                        <label>
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
                                      <div className="form-group">
                                        <label>
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
                                            {formik.values.bannerImage
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
                                            {formik.values.hotelImage?.length ==
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

                                  <div
                                    className="form-check form-check-inline d-flex"
                                    style={{ paddingLeft: "0" }}
                                  >
                                    <label
                                      className="form-check-label me-2"
                                      htmlFor="inlineCheckbox1"
                                    >
                                      Night Stay At
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control "
                                      id={`detailIntenirary[${index}].nightStayAt`}
                                      name={`detailIntenirary[${index}].nightStayAt`}
                                      onChange={formik.handleChange}
                                      value={item.nightStayAt}
                                    />
                                  </div>
                                  {formik.touched.detailIntenirary?.[index]
                                    ?.nightStayAt &&
                                  formik.errors.detailIntenirary?.[index]
                                    ?.nightStayAt ? (
                                    <span className="error">
                                      {
                                        formik.errors.detailIntenirary[index]
                                          .nightStayAt
                                      }
                                    </span>
                                  ) : null}
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
                                          Images for Day
                                          {index + 1}:{" "}
                                          <span className="error">
                                            {formik.errors
                                              .grouptouritineraryimages?.[0]
                                              .grouptouritineraryimagesList?.[0]
                                              .itineraryImageUrl ? (
                                              <div className="text-red-500 text-sm mt-1">
                                                (
                                                {
                                                  formik.errors
                                                    .grouptouritineraryimages[0]
                                                    .grouptouritineraryimagesList[0]
                                                    .itineraryImageUrl
                                                }
                                                )
                                              </div>
                                            ) : null}
                                          </span>
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Iterate through images for the day */}
                                  {item.grouptouritineraryimages?.map(
                                    (subItem, subIndex) => (
                                      <div key={subIndex} className="row">
                                        {/* Experience Name Input */}
                                        <div className="col-md-4 col-sm-6 col-lg-3">
                                          <div className="form-group mb-2">
                                            <label>Experience Name</label>
                                            <input
                                              type="text"
                                              className="form-control me-2"
                                              name={`detailIntenirary[${index}].grouptouritineraryimages[${subIndex}].itineraryImageName`}
                                              onChange={formik.handleChange}
                                              value={subItem.itineraryImageName}
                                            />
                                            {formik.touched.detailIntenirary?.[
                                              index
                                            ]?.grouptouritineraryimages?.[
                                              subIndex
                                            ]?.itineraryImageName &&
                                              formik.errors.detailIntenirary?.[
                                                index
                                              ]?.grouptouritineraryimages?.[
                                                subIndex
                                              ]?.itineraryImageName && (
                                                <span className="error">
                                                  {
                                                    formik.errors
                                                      .detailIntenirary[index]
                                                      .grouptouritineraryimages[
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
                                            name={`detailIntenirary[${index}].grouptouritineraryimages[${subIndex}].type`}
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
                                                    `detailIntenirary[${index}].grouptouritineraryimages[${subIndex}].itineraryImageUrl`,
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
                                              .grouptouritineraryimages &&
                                            formik.errors
                                              .grouptouritineraryimages[
                                              index
                                            ] &&
                                            formik.errors
                                              .grouptouritineraryimages[index]
                                              .grouptouritineraryimagesList &&
                                            formik.errors
                                              .grouptouritineraryimages[index]
                                              .grouptouritineraryimagesList[
                                              subIndex
                                            ] &&
                                            formik.errors
                                              .grouptouritineraryimages[index]
                                              .grouptouritineraryimagesList[
                                              subIndex
                                            ].itineraryImageUrl ? (
                                              <div className="text-red-500 text-sm mt-1">
                                                {
                                                  formik.errors
                                                    .grouptouritineraryimages[
                                                    index
                                                  ]
                                                    .grouptouritineraryimagesList[
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
                                          .grouptouritineraryimages?.length >
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

            {/* Iternary Images */}

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
            {formik.values.departure &&
              formik.values.departure?.value != "1" && (
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="skeleton mb-2">
                          <div
                            className="card-header pb-2 pt-2"
                            style={{ paddingLeft: "0px" }}
                          >
                            <div className="card-title h5">Flight Details</div>
                          </div>
                          <div className="table-responsive">
                            <table className="table table-bordered table-responsive-sm table-tour table-gt">
                              <thead>
                                <tr>
                                  <th style={{ width: "8%" }}>
                                    Journey{" "}
                                    <span className="error-star">*</span>
                                  </th>
                                  <th style={{ width: "10%" }}>
                                    Flight No.{" "}
                                    <span className="error-star">*</span>
                                  </th>
                                  <th style={{ width: "8%" }}>
                                    Airlines{" "}
                                    <span className="error-star">*</span>
                                  </th>
                                  <th style={{ width: "8%" }}>
                                    Class <span className="error-star">*</span>
                                  </th>
                                  <th style={{ width: "8%" }}>
                                    From <span className="error-star">*</span>
                                  </th>
                                  <th style={{ width: "8%" }}>
                                    Date <span className="error-star">*</span>
                                  </th>
                                  <th style={{ width: "8%" }}>
                                    Time <span className="error-star">*</span>
                                  </th>
                                  <th style={{ width: "10%" }}>
                                    To <span className="error-star">*</span>
                                  </th>
                                  <th style={{ width: "8%" }}>
                                    Date <span className="error-star">*</span>
                                  </th>
                                  <th style={{ width: "8%" }}>
                                    Time <span className="error-star">*</span>
                                  </th>
                                  <th style={{ width: "8%" }}>
                                    Weight <span className="error-star">*</span>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-600">
                                {formik.values.flights.map((flight, index) => (
                                  <tr key={index}>
                                    <td>{flight.journey}</td>
                                    <td>
                                      <input
                                        type="text"
                                        className="form-control flight_input"
                                        id={`flights[${index}].flight`}
                                        name={`flights[${index}].flight`}
                                        value={flight.flight}
                                        onChange={formik.handleChange}
                                      />
                                      {formik.touched.flights &&
                                        formik.touched.flights[index]?.flight &&
                                        formik.errors &&
                                        formik.errors.flights &&
                                        formik.errors.flights[index]
                                          ?.flight && (
                                          <span className="error">
                                            {
                                              formik.errors.flights[index]
                                                .flight
                                            }
                                          </span>
                                        )}
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        className="form-control flight_input"
                                        id={`flights[${index}].airline`}
                                        name={`flights[${index}].airline`}
                                        value={flight.airline}
                                        onChange={formik.handleChange}
                                      />
                                      {formik.touched.flights &&
                                        formik.touched.flights[index]
                                          ?.airline &&
                                        formik.errors &&
                                        formik.errors.flights &&
                                        formik.errors.flights[index]
                                          ?.airline && (
                                          <span className="error">
                                            {
                                              formik.errors.flights[index]
                                                .airline
                                            }
                                          </span>
                                        )}
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        className="form-control flight_input"
                                        id={`flights[${index}].class`}
                                        name={`flights[${index}].class`}
                                        value={flight.class}
                                        onChange={formik.handleChange}
                                      />
                                      {formik.touched.flights &&
                                        formik.touched.flights[index]?.class &&
                                        formik.errors &&
                                        formik.errors.flights &&
                                        formik.errors.flights[index]?.class && (
                                          <span className="error">
                                            {formik.errors.flights[index].class}
                                          </span>
                                        )}
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        className="form-control flight_input"
                                        id={`flights[${index}].from`}
                                        name={`flights[${index}].from`}
                                        value={flight.from}
                                        onChange={formik.handleChange}
                                      />
                                      {formik.touched.flights &&
                                        formik.touched.flights[index]?.from &&
                                        formik.errors &&
                                        formik.errors.flights &&
                                        formik.errors.flights[index]?.from && (
                                          <span className="error">
                                            {formik.errors.flights[index].from}
                                          </span>
                                        )}
                                    </td>
                                    <td>
                                      <input
                                        type="date"
                                        className="form-control flight_input"
                                        id={`flights[${index}].fromDate`}
                                        name={`flights[${index}].fromDate`}
                                        value={flight.fromDate}
                                        onChange={formik.handleChange}
                                      />
                                      {formik.touched.flights &&
                                        formik.touched.flights[index]
                                          ?.fromDate &&
                                        formik.errors &&
                                        formik.errors.flights &&
                                        formik.errors.flights[index]
                                          ?.fromDate && (
                                          <span className="error">
                                            {
                                              formik.errors.flights[index]
                                                .fromDate
                                            }
                                          </span>
                                        )}
                                    </td>
                                    <td>
                                      <input
                                        type="time"
                                        className="form-control flight_input"
                                        id={`flights[${index}].fromTime`}
                                        name={`flights[${index}].fromTime`}
                                        value={flight.fromTime}
                                        onChange={formik.handleChange}
                                      />
                                      {formik.touched.flights &&
                                        formik.touched.flights[index]
                                          ?.fromTime &&
                                        formik.errors &&
                                        formik.errors.flights &&
                                        formik.errors.flights[index]
                                          ?.fromTime && (
                                          <span className="error">
                                            {
                                              formik.errors.flights[index]
                                                .fromTime
                                            }
                                          </span>
                                        )}
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        className="form-control flight_input"
                                        id={`flights[${index}].to`}
                                        name={`flights[${index}].to`}
                                        value={flight.to}
                                        onChange={formik.handleChange}
                                      />
                                      {formik.touched.flights &&
                                        formik.touched.flights[index]?.to &&
                                        formik.errors &&
                                        formik.errors.flights &&
                                        formik.errors.flights[index]?.to && (
                                          <span className="error">
                                            {formik.errors.flights[index].to}
                                          </span>
                                        )}
                                    </td>
                                    <td>
                                      <input
                                        type="date"
                                        className="form-control flight_input"
                                        id={`flights[${index}].toDate`}
                                        name={`flights[${index}].toDate`}
                                        value={flight.toDate}
                                        onChange={formik.handleChange}
                                      />
                                      {formik.touched.flights &&
                                        formik.touched.flights[index]?.toDate &&
                                        formik.errors &&
                                        formik.errors.flights &&
                                        formik.errors.flights[index]
                                          ?.toDate && (
                                          <span className="error">
                                            {
                                              formik.errors.flights[index]
                                                .toDate
                                            }
                                          </span>
                                        )}
                                    </td>
                                    <td>
                                      <input
                                        type="time"
                                        className="form-control flight_input"
                                        id={`flights[${index}].toTime`}
                                        name={`flights[${index}].toTime`}
                                        value={flight.toTime}
                                        onChange={formik.handleChange}
                                      />
                                      {formik.touched.flights &&
                                        formik.touched.flights[index]?.toTime &&
                                        formik.errors &&
                                        formik.errors.flights &&
                                        formik.errors.flights[index]
                                          ?.toTime && (
                                          <span className="error">
                                            {
                                              formik.errors.flights[index]
                                                .toTime
                                            }
                                          </span>
                                        )}
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        className="form-control flight_input"
                                        id={`flights[${index}].weight`}
                                        name={`flights[${index}].weight`}
                                        value={flight.weight}
                                        onChange={formik.handleChange}
                                      />
                                      {formik.touched.flights &&
                                        formik.touched.flights[index]?.weight &&
                                        formik.errors &&
                                        formik.errors.flights &&
                                        formik.errors.flights[index]
                                          ?.weight && (
                                          <span className="error">
                                            {
                                              formik.errors.flights[index]
                                                .weight
                                            }
                                          </span>
                                        )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            {
              // formik.values.departure && formik.values.departure?.value != "2" &&
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="skeleton mb-2">
                        <div
                          className="card-header pb-2 pt-2"
                          style={{ paddingLeft: "0px" }}
                        >
                          <div className="card-title h5">Train Details</div>
                        </div>
                        <div className="table-responsive">
                          <table className="table table-bordered table-responsive-sm table-tour table-gt">
                            <thead>
                              <tr>
                                <th style={{ width: "8%" }}>
                                  Journey <span className="error-star">*</span>
                                </th>
                                <th style={{ width: "11%" }}>
                                  Train No.{" "}
                                  <span className="error-star">*</span>
                                </th>
                                <th style={{ width: "12%" }}>
                                  Train Name{" "}
                                  <span className="error-star">*</span>
                                </th>
                                <th style={{ width: "12%" }}>
                                  From <span className="error-star">*</span>
                                </th>
                                <th style={{ width: "10%" }}>
                                  Date <span className="error-star">*</span>
                                </th>
                                <th style={{ width: "10%" }}>
                                  Time <span className="error-star">*</span>
                                </th>
                                <th style={{ width: "12%" }}>
                                  To <span className="error-star">*</span>
                                </th>
                                <th style={{ width: "10%" }}>
                                  Date <span className="error-star">*</span>
                                </th>
                                <th style={{ width: "10%" }}>
                                  Time <span className="error-star">*</span>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-600">
                              {formik.values.trains.map((train, index) => (
                                <tr key={index}>
                                  <td>{train.journey}</td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id={`trains[${index}].trainNo`}
                                      name={`trains[${index}].trainNo`}
                                      value={train.trainNo}
                                      onChange={formik.handleChange}
                                    />
                                    {formik.touched.trains &&
                                      formik.touched.trains[index]?.trainNo &&
                                      formik.errors &&
                                      formik.errors.trains &&
                                      formik.errors.trains[index]?.trainNo && (
                                        <span className="error">
                                          {formik.errors.trains[index].trainNo}
                                        </span>
                                      )}
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id={`trains[${index}].trainName`}
                                      name={`trains[${index}].trainName`}
                                      value={train.trainName}
                                      onChange={formik.handleChange}
                                    />
                                    {formik.touched.trains &&
                                      formik.touched.trains[index]?.trainName &&
                                      formik.errors &&
                                      formik.errors.trains &&
                                      formik.errors.trains[index]
                                        ?.trainName && (
                                        <span className="error">
                                          {
                                            formik.errors.trains[index]
                                              .trainName
                                          }
                                        </span>
                                      )}
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id={`trains[${index}].from`}
                                      name={`trains[${index}].from`}
                                      value={train.from}
                                      onChange={formik.handleChange}
                                    />
                                    {formik.touched.trains &&
                                      formik.touched.trains[index]?.from &&
                                      formik.errors &&
                                      formik.errors.trains &&
                                      formik.errors.trains[index]?.from && (
                                        <span className="error">
                                          {formik.errors.trains[index].from}
                                        </span>
                                      )}
                                  </td>
                                  <td>
                                    <input
                                      type="date"
                                      className="form-control"
                                      id={`trains[${index}].fromDate`}
                                      name={`trains[${index}].fromDate`}
                                      value={train.fromDate}
                                      onChange={formik.handleChange}
                                    />
                                    {formik.touched.trains &&
                                      formik.touched.trains[index]?.fromDate &&
                                      formik.errors &&
                                      formik.errors.trains &&
                                      formik.errors.trains[index]?.fromDate && (
                                        <span className="error">
                                          {formik.errors.trains[index].fromDate}
                                        </span>
                                      )}
                                  </td>
                                  <td>
                                    <input
                                      type="time"
                                      className="form-control"
                                      id={`trains[${index}].fromTime`}
                                      name={`trains[${index}].fromTime`}
                                      value={train.fromTime}
                                      onChange={formik.handleChange}
                                    />
                                    {formik.touched.trains &&
                                      formik.touched.trains[index]?.fromTime &&
                                      formik.errors &&
                                      formik.errors.trains &&
                                      formik.errors.trains[index]?.fromTime && (
                                        <span className="error">
                                          {formik.errors.trains[index].fromTime}
                                        </span>
                                      )}
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id={`trains[${index}].to`}
                                      name={`trains[${index}].to`}
                                      value={train.to}
                                      onChange={formik.handleChange}
                                    />
                                    {formik.touched.trains &&
                                      formik.touched.trains[index]?.to &&
                                      formik.errors &&
                                      formik.errors.trains &&
                                      formik.errors.trains[index]?.to && (
                                        <span className="error">
                                          {formik.errors.trains[index].to}
                                        </span>
                                      )}
                                  </td>
                                  <td>
                                    <input
                                      type="date"
                                      className="form-control"
                                      id={`trains[${index}].toDate`}
                                      name={`trains[${index}].toDate`}
                                      value={train.toDate}
                                      onChange={formik.handleChange}
                                    />
                                    {formik.touched.trains &&
                                      formik.touched.trains[index]?.toDate &&
                                      formik.errors &&
                                      formik.errors.trains &&
                                      formik.errors.trains[index]?.toDate && (
                                        <span className="error">
                                          {formik.errors.trains[index].toDate}
                                        </span>
                                      )}
                                  </td>
                                  <td>
                                    <input
                                      type="time"
                                      className="form-control"
                                      id={`trains[${index}].toTime`}
                                      name={`trains[${index}].toTime`}
                                      value={train.toTime}
                                      onChange={formik.handleChange}
                                    />
                                    {formik.touched.trains &&
                                      formik.touched.trains[index]?.toTime &&
                                      formik.errors &&
                                      formik.errors.trains &&
                                      formik.errors.trains[index]?.toTime && (
                                        <span className="error">
                                          {formik.errors.trains[index].toTime}
                                        </span>
                                      )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="skeleton mb-2">
                      {/* <h6 className="pb-2">Suggested Timing for D2D Guests</h6> */}
                      <div
                        className="card-header  pb-2 pt-2"
                        style={{ paddingLeft: "0" }}
                      >
                        <div className="card-title h5">
                          Suggested Timing for D2D Guests
                        </div>
                      </div>
                      <div className="table-responsive">
                        <table className="table header-border  table-bordered table-responsive-sm table-tour table-tour1 table-gt">
                          <thead>
                            <tr>
                              <th
                                className=""
                                style={{
                                  width: "20px",
                                  cursor: "default",
                                }}
                              >
                                Arrival Details
                              </th>
                              <th
                                className=""
                                style={{
                                  width: "20px",
                                  cursor: "default",
                                }}
                              >
                                Arrival
                              </th>
                              <th
                                className=""
                                style={{
                                  width: "20px",
                                  cursor: "default",
                                }}
                              >
                                Departure Details
                              </th>
                              <th
                                className=""
                                style={{
                                  width: "20px",
                                  cursor: "default",
                                }}
                              >
                                Departure
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-600">
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap ">
                                Tour Start City
                                <span className="error-star">*</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap ">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="startCity"
                                  name="startCity"
                                  onChange={formik.handleChange}
                                  value={formik.values.startCity}
                                />
                                <ErrorMessageComponent
                                  errors={formik.errors}
                                  fieldName={"startCity"}
                                  touched={formik.touched}
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap ">
                                Tour End City
                                <span className="error-star">*</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap ">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="endCity"
                                  name="endCity"
                                  onChange={formik.handleChange}
                                  value={formik.values.endCity}
                                />
                                <ErrorMessageComponent
                                  errors={formik.errors}
                                  fieldName={"endCity"}
                                  touched={formik.touched}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap ">
                                Pick-up/Meeting point
                                <span className="error-star">*</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap ">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="pickUpMeet"
                                  name="pickUpMeet"
                                  onChange={formik.handleChange}
                                  value={formik.values.pickUpMeet}
                                />
                                <ErrorMessageComponent
                                  errors={formik.errors}
                                  fieldName={"pickUpMeet"}
                                  touched={formik.touched}
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap ">
                                Drop-off point
                                <span className="error-star">*</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap ">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="dropOffPoint"
                                  name="dropOffPoint"
                                  onChange={formik.handleChange}
                                  value={formik.values.dropOffPoint}
                                />
                                <ErrorMessageComponent
                                  errors={formik.errors}
                                  fieldName={"dropOffPoint"}
                                  touched={formik.touched}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap ">
                                Pick-up/Meeting time
                                <span className="error-star">*</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap ">
                                <input
                                  type="time"
                                  className="form-control"
                                  id="pickUpMeetTime"
                                  name="pickUpMeetTime"
                                  onChange={formik.handleChange}
                                  value={formik.values.pickUpMeetTime}
                                />
                                <ErrorMessageComponent
                                  errors={formik.errors}
                                  fieldName={"pickUpMeetTime"}
                                  touched={formik.touched}
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap ">
                                Drop-off time
                                <span className="error-star">*</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap ">
                                <input
                                  type="time"
                                  className="form-control"
                                  id="dropOffTime"
                                  name="dropOffTime"
                                  onChange={formik.handleChange}
                                  value={formik.values.dropOffTime}
                                />
                                <ErrorMessageComponent
                                  errors={formik.errors}
                                  fieldName={"dropOffTime"}
                                  touched={formik.touched}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap ">
                                Arrive before
                                <span className="error-star">*</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap ">
                                <input
                                  type="time"
                                  className="form-control"
                                  id="arriveBefore"
                                  name="arriveBefore"
                                  onChange={formik.handleChange}
                                  value={formik.values.arriveBefore}
                                />
                                <ErrorMessageComponent
                                  errors={formik.errors}
                                  fieldName={"arriveBefore"}
                                  touched={formik.touched}
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap ">
                                Book flight/train after
                                <span className="error-star">*</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap ">
                                <input
                                  type="time"
                                  className="form-control"
                                  id="bookAfter"
                                  name="bookAfter"
                                  onChange={formik.handleChange}
                                  value={formik.values.bookAfter}
                                />
                                <ErrorMessageComponent
                                  errors={formik.errors}
                                  fieldName={"bookAfter"}
                                  touched={formik.touched}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                              className="btn btn-save btn-primary me-2 "
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
                        {formik.values.inclusions.map((inclusion, index) => (
                          <div className="col-md-12">
                            <div className="mb-2">
                              <label>
                                Description
                                <span className="error-star">*</span>
                              </label>
                              <div className="d-flex gap-2">
                                <input
                                  id={`inclusions[${index}].description`}
                                  name={`inclusions[${index}].description`}
                                  type="text"
                                  min={3}
                                  max={50}
                                  className="form-control"
                                  onChange={formik.handleChange}
                                  value={inclusion.description}
                                />

                                {formik.values.inclusions.length > 1 && (
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
                              {formik.touched.inclusions &&
                                formik.touched.inclusions[index]?.description &&
                                formik.errors &&
                                formik.errors.inclusions &&
                                formik.errors.inclusions[index]
                                  ?.description && (
                                  <span className="error">
                                    {
                                      formik.errors.inclusions[index]
                                        .description
                                    }
                                  </span>
                                )}
                            </div>
                          </div>
                        ))}
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
                        {formik.values.exclusions.map((inclusion, index) => (
                          <div className="col-md-12">
                            <div className="mb-2">
                              <label>
                                Description
                                <span className="error-star">*</span>
                              </label>
                              <div className="d-flex gap-2">
                                <input
                                  id={`exclusions[${index}].description`}
                                  name={`exclusions[${index}].description`}
                                  type="text"
                                  min={3}
                                  max={50}
                                  className="form-control"
                                  onChange={formik.handleChange}
                                  value={inclusion.description}
                                />

                                {formik.values.exclusions.length > 1 && (
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
                              {formik.touched.exclusions &&
                                formik.touched.exclusions[index]?.description &&
                                formik.errors &&
                                formik.errors.exclusions &&
                                formik.errors.exclusions[index]
                                  ?.description && (
                                  <span className="error">
                                    {
                                      formik.errors.exclusions[index]
                                        .description
                                    }
                                  </span>
                                )}
                            </div>
                          </div>
                        ))}
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
                        <div className="card-title h5">Shopping</div>
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
                        <div className="card-title h5">Weather</div>
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
                    <div className="col-md-6">
                      <label className="text-label">
                        Background Image (1080 * 1920)
                        <span className="error-star">*</span>
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
                              const selectedFile = e.target.files[0];
                              const fileLink = await getFileLink(
                                selectedFile,
                                "bgImage"
                              );
                              formik.setFieldValue(`bgImage`, fileLink);
                              e.target.value = "";
                            }}
                          />
                          <div className="Neon-input-dragDrop bg-gt">
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
                        <ErrorMessageComponent
                          errors={formik.errors}
                          fieldName={"bgImage"}
                          touched={formik.touched}
                        />
                      </div>
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
                  <Link
                    to="/View-group-tour"
                    type="submit"
                    className="btn btn-back"
                  >
                    Back
                  </Link>
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

export default EditGroupTour;
