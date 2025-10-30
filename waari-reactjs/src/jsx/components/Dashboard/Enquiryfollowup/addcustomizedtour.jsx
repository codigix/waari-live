import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { get, post } from "../../../../services/apiServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorMessageComponent from "../FormErrorComponent/ErrorMessageComponent";
import BackButton from "../../common/BackButton";

const Addcustomizedtour = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [countryId, setCountryId] = useState("");
  const navigate = useNavigate();
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


  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      note: "",
      nextfollowup: "",
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
      nameofcontact: "",
      nameofgroup: "",
      tourstartdate: "",
      tourenddate: "",
      cities: []
    },
    validationSchema: Yup.object({
      nextfollowup: Yup.string().required("Enter The Next Follow Up"),
      // priority: Yup.string().required("Enter The Priority"),
      // guestref: Yup.string().required("Enter The Guest Reference"),
      enquiryref: Yup.string().required("Enter The Enquiry Reference"),
      destination: Yup.string().required("Enter The Destination"),
      departurecountry: Yup.string().required("Country is required"),
      numberoffamilyhead: Yup.string().required(
        "Enter The Number of family Head"
      ),
      mealplan: Yup.string().required("Enter The Meal Plan"),
      // totalextrabed: Yup.string().required("Enter The Extra Bed"),
      totalrooms: Yup.string().required("Enter The Total Rooms"),
      cities: Yup.array().min(1, 'Select at least one city').required('Select Cities'),
      childrenages: Yup.array()
        .when('child', {
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
      // child: Yup.string().required("Enter The Passengers"),
      hotel: Yup.string().required("Enter The Hotels Category"),
      contact: Yup.string()
        .required("Enter The Contact Number")
        .min(10, "Enter valid number")
        .max(10, "Enter valid number"),
      nameofcontact: Yup.string().required("Enter The Name of Contact")
        .min(4, "Name should be atleast 4 characters.")
      ,
      nameofgroup: Yup.string().required("Enter The Name of Group"),
      tourstartdate: Yup.string().required("Enter The Tour Start Date"),
      tourenddate: Yup.string().required("Enter The Tour End Date"),
    }),

    onSubmit: async (values) => {
      let data = {
        groupName: values.nameofgroup,
        contactName: guestId.length > 0 ? guestId : values.nameofcontact,
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
        cities: values.cities.map(item => item.value),
        mailId: values.email,
      };

      try {
        setIsLoading(true);
        const response = await post(`/enquiry-custom-tour`, data);
        setIsLoading(false);
        toast.success(response?.data?.message);
        navigate("/customized-tour");
      } catch (error) {
        setIsLoading(false);
        toast.error(error?.response?.data?.message[0]);
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
  const [cities, setCities] = useState([]);

  const getCity = async () => {
    try {
      const response = await get(`/city-list?countryId=${validation.values.departurecountry}`);
      const mappedData = response.data.data.map((item) => ({
        value: item.citiesId,
        label: (item.citiesName).split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
      }));
      setCities(mappedData);
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    getCity()
  }, [validation.values.departurecountry, validation.values.state, validation.values.destination])

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
          label: item.guestRefId,
        }));
        setGuestEnquiryRef(mappedData);
      } catch (error) {
        console.log(error);
      }
    } else {
      validation.setFieldValue('guestref', '')
    }
  };

  const handleGuestRefChange = (selectedOption) => {
    validation.setFieldValue('guestref', selectedOption.value)
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
    const pathArray = (window.location.href).split("/")
    const path = pathArray[pathArray.length - 1]
    let element = document.getElementById("customized-tour")
    if (element) {
      element.classList.add("mm-active1") // Add the 'active' class to the element
    }
    return () => {
      if (element) {
        element.classList.remove("mm-active1") // remove the 'active' class to the element when change to another page
      }
    }
  }, [])



  // to select the value from input tag start

  const getDestValueFromSelect = async (value) => {
    setCountryId(value);
    validation.setFieldValue(
      "destination",
      value ? value.value : ""
    );
    validation.setFieldValue('cities', [])
    validation.setFieldValue('state', '')
  };
  const getCountryValueFromSelect = async (value) => {
    setCountryId(value);
    validation.setFieldValue(
      "departurecountry",
      value ? value.value : ""
    );
    validation.setFieldValue('cities', [])
    validation.setFieldValue('state', '')
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


  //get data from name

  const [searchTerm, setSearchTerm] = useState('');
  const [guestId, setGuestId] = useState('');
  const [nameOptions, setNameOptions] = useState([]);

  // Simulating async data fetching (replace with actual API call)
  const fetchNameOptions = async () => {
    try {
      const response = await get(`guest-email?guestName=${searchTerm}`);
      if (response.data.data.length > 0) {
        setNameOptions(response.data.data);
        validation.setFieldValue('nameofcontact', searchTerm);
      } else {
        validation.setFieldValue('nameofcontact', searchTerm);
        validation.setFieldValue('contact', '')
        validation.setFieldValue('email', '')
        validation.setFieldValue('enquiryref', '')
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
      validation.setFieldValue('nameofcontact', selectedOption.label);
      setGuestId(selectedOption.value)
      getGuestInfoByName(selectedOption.value)
    } else {
      validation.setFieldValue('email', '');
      validation.setFieldValue('nameofcontact', '')
      validation.setFieldValue('contact', '')
      validation.setFieldValue('enquiryref', '')
    }
  };

  //get guest info by name
  const getGuestInfoByName = async (name) => {
    try {
      const result = await get(`guest-info?guestId=${name}`)
      const { phone, email } = result.data
      if (result.data) {
        validation.setFieldValue('email', email)
        validation.setFieldValue('contact', phone)
        validation.setFieldValue('enquiryref', 8)
      }
    } catch (error) {
      console.log(error);
    }
  }



  return (
    <>
      <div className="row">
        <div className="col-lg-12" style={{ paddingTop: '40px' }}>
          <div className="card">
            <div className="row page-titles mx-0 fixed-top-breadcrumb" >
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <BackButton />
                </li>
                <li className="breadcrumb-item active">
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/customized-tour">Enquiry follow-up</Link>
                </li>
                <li className="breadcrumb-item  ">
                  <Link to="/add-customized-tour">Add Customized Tour</Link>
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
                    <div className="mb-2 col-md-3">
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
                      />
                      {validation.touched.nameofgroup &&
                        validation.errors.nameofgroup ? (
                        <span className="error">
                          {validation.errors.nameofgroup}
                        </span>
                      ) : null}
                    </div>
                    <div className="mb-2 col-md-3">
                      <label>
                        Name of Contact Person<span className="error-star">*</span>
                      </label>
                      <Select
                        options={nameOptions.map(item => ({ value: item.guestId, label: item.guestName }))}
                        isClearable
                        isSearchable
                        name="nameofcontact"
                        onInputChange={(inputValue) => setSearchTerm(inputValue)}
                        onChange={handleNameChange}
                        value={
                          nameOptions.find(item => item.guestName == validation.values.nameofcontact)
                            ? nameOptions.find(item => item.guestName == validation.values.nameofcontact)
                            : { value: validation.values.nameofcontact, label: validation.values.nameofcontact }
                        }
                      />
                      <ErrorMessageComponent errors={validation.errors} fieldName={'nameofcontact'} touched={validation.touched} key={'nameofcontact'} />
                    </div>
                    <div className="mb-2 col-md-3">
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
                      />
                      <ErrorMessageComponent errors={validation.errors} fieldName={'email'} touched={validation.touched} key={'email'} />
                    </div>
                    <div className="mb-2 col-md-3">
                      <label>
                        Contact Number<span className="error-star">*</span>
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        name="contact"
                        minLength={10}
                        maxLength={10}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.contact}
                      />
                      <ErrorMessageComponent errors={validation.errors} fieldName={'contact'} touched={validation.touched} key={'contact'} />
                    </div>

                    <div className="card-header card-header-title">
                      <div className="card-title h5">Tour Details</div>
                    </div>
                    <div className="mb-2 col-md-4">
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
                          (option) =>
                            option.value === validation.values.destination
                        )}
                      />
                      {validation.touched.destination &&
                        validation.errors.destination ? (
                        <span className="error">
                          {validation.errors.destination}
                        </span>
                      ) : null}
                    </div>

                    <div className="mb-2 col-md-4">
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
                        isDisabled={validation.values.destination == "1"}
                      />
                      {validation.touched.departurecountry &&
                        validation.errors.departurecountry && (
                          <span className="error">
                            {validation.errors.departurecountry}
                          </span>
                        )}
                    </div>

                    <div className="mb-2 col-md-4">
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
                            (option) => option.value === validation.values.state) ? state.find(
                              (option) => option.value === validation.values.state) : null
                        }
                      />
                      {validation.touched.state && validation.errors.state ? (
                        <span className="error">{validation.errors.state}</span>
                      ) : null}
                    </div>
                    <div className="mb-2 col-md-6">
                      <label className="form-label">Select Cities<span className="error-star">*</span></label>
                      <Select
                        isMulti
                        styles={customStyles}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        name="cities"
                        options={cities}
                        onChange={(selectedOptions) => validation.setFieldValue('cities', selectedOptions)}
                        onBlur={validation.handleBlur}
                        value={validation.values.cities}
                      />
                      {validation.touched.cities && validation.errors.cities ? (
                        <span className="error">{validation.errors.cities}</span>
                      ) : null}
                    </div>
                    <div className="mb-2 col-md-3">
                      <label>
                        Tour Start Date<span className="error-star">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="tourstartdate"
                        min={new Date().toISOString().split("T")[0]}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.tourstartdate}
                      />
                      {validation.touched.tourstartdate &&
                        validation.errors.tourstartdate ? (
                        <span className="error">
                          {validation.errors.tourstartdate}
                        </span>
                      ) : null}
                    </div>
                    <div className="mb-2 col-md-3">
                      <label>
                        Tour End Date<span className="error-star">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="tourenddate"
                        min={
                          validation.values.tourstartdate
                            ? validation.values.tourstartdate
                            : new Date().toISOString().split("T")[0]
                        }
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.tourenddate}
                      />
                      {validation.touched.tourenddate &&
                        validation.errors.tourenddate ? (
                        <span className="error">
                          {validation.errors.tourenddate}
                        </span>
                      ) : null}
                    </div>

                    <div className="mb-2 col-md-3">
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
                      {validation.touched.duration &&
                        validation.errors.duration ? (
                        <span className="error">
                          {validation.errors.duration}
                        </span>
                      ) : null}
                    </div>


                    <div className="mb-2 col-md-3">
                      <div className="row">
                        <div className="col-sm-6 pax-adults">
                          <label>
                            Pax(Adults)<span className="error-star">*</span>
                          </label>
                          <input
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
                            type="number"
                            name="child"
                            className="form-control w-60"
                            min={0}
                            //onChange={validation.handleChange}
                            onChange={(e) => {
                              validation.handleChange(e);
                              validation.setFieldValue('childrenages', Array.from({ length: e.target.value }))
                            }}
                            onBlur={validation.handleBlur}
                            value={validation.values.child}
                          />
                        </div>
                      </div>
                      {validation.touched.adults && validation.errors.adults ? (
                        <span className="error">{validation.errors.adults}</span>
                      ) : null}
                    </div>
                    {validation.values.childrenages && validation.values.childrenages.length > 0 && (
                      <div className="mb-2 col-md-6">
                        <label>Childrens Ages</label>
                        <div className="child-row">
                          {validation.values.childrenages.map((item, index) => (
                            <React.Fragment key={index}>
                              <div className="child-input">
                                <input
                                  type="number"
                                  className="form-control"
                                  min={0}
                                  max={20} // Added max attribute
                                  name={`childrenages[${index}]`}
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                />

                                {validation.touched?.childrenages &&
                                  validation.errors?.childrenages?.[index] && (
                                    <span className="error">
                                      {validation.errors?.childrenages[index]}
                                    </span>
                                  )}
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mb-2 col-md-3">
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
                          (option) => option.value === validation.values.hotel
                        )}
                      />
                      {validation.touched.hotel && validation.errors.hotel ? (
                        <span className="error">{validation.errors.hotel}</span>
                      ) : null}
                    </div>
                    <div className="mb-2 col-md-3">
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
                    <div className="mb-2 col-md-3">
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
                    </div>
                    <div className="mb-2 col-md-3">
                      <label className="form-label">Meal Plan<span className="error-star">*</span></label>
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
                    <div className="mb-2 col-md-3">
                      <label>Number of Family Heads<span className="error-star">*</span></label>
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
                    <div className="mb-2 col-md-3">
                      <label>Reference<span className="error-star">*</span></label>
                      <Select
                        styles={customStyles}
                        className="basic-single"
                        classNamePrefix="select"
                        name="enquiryref"
                        options={enquiryref}
                        onChange={(selectedOption) => getGuestEnquiryRef(selectedOption)}
                        onBlur={validation.handleBlur}
                        value={enquiryref.find(
                          (option) =>
                            option.value === validation.values.enquiryref
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
                      <div className="mb-2 col-md-3">
                        <label>Guest Reference Id<span className="error-star">*</span></label>
                        <Select
                          styles={customStyles}
                          className="basic-single"
                          classNamePrefix="select"
                          name="guestref"
                          options={guestenquiryref}
                          onChange={(selectedOption) => handleGuestRefChange(selectedOption)}
                          onBlur={validation.handleBlur}
                          value={guestenquiryref.find(
                            (option) =>
                              option.value === validation.values.guestref
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
                    <div className="mb-2 col-md-3">
                      <label className="form-label">
                        Priority
                      </label>
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
                    </div>
                    <div className="mb-2 col-md-3">
                      <label className="form-label">Next Follow-up<span className="error-star">*</span></label>
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
                    <div className="mb-2 col-md-12">
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
                    </div>
                  </div>
                  <div className="mb-2 mt-2 row">
                    <div className="col-lg-12 d-flex justify-content-between">
                      <Link
                        to="/customized-tour"
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
export default Addcustomizedtour;
