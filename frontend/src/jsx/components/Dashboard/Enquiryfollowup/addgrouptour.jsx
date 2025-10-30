import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { get, post } from "../../../../services/apiServices";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import ErrorMessageComponent from "../FormErrorComponent/ErrorMessageComponent";
import BackButton from "../../common/BackButton";

const Addgrouptourr = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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
        label: item.guestRefId,
      }));
      setGuestEnquiryRef(mappedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGuestEnquiryRef();
  }, []);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      nextfollowup: "",
      priority: "",
      guestenquiryref: "",
      enquiryref: "",
      adults: "",
      childs: "",
      email: "",
      tourname: "",
      contact: "",
      nameofguest: "",
      tourName: "",
    },
    validationSchema: Yup.object({
      nextfollowup: Yup.string().required("Enter The Next Follow Up"),
      guestenquiryref: Yup.string().when("enquiryref", {
        is: (enquiryref) => enquiryref == 9,
        then: Yup.string().required("Enter the Guest Enquiry Reference"),
        otherwise: Yup.string(),
      }),
      enquiryref: Yup.string().required("Enter the Enquiry Reference"),
      adults: Yup.string().required("Enter The Adults"),
      email: Yup.string().email("Please enter valid email address"),
      tourname: Yup.string().required("Enter Tour name"),
      contact: Yup.string()
        .required("Enter the Contact Number")
        .min(10, "Please enter correct contact number")
        .max(10, "Please enter correct contact number"),
      nameofguest: Yup.string()
        .required("Enter the Name of Guest")
        .min(4, "Name should be atleast 4 characters."),
    }),

    onSubmit: async (values) => {
      let data = {
        guestName: guestId.length > 0 ? guestId : values.nameofguest,
        countryCode: String(countryCode),
        contact: values.contact,
        mail: values.email,
        adults: values.adults,
        child: values.childs,
        nextFollowUp: values.nextfollowup,
        enquiryReferId: values.enquiryref,
        priorityId: values.priority,
        groupTourId: values.tourname,
        guestRefId: values.guestenquiryref,
      };

      console.log("data", data);
      if (Number(values.adults) + Number(values.childs) <= 6) {
        try {
          setIsLoading(true);

          const response = await post(`/enquiry-group-tour`, data, {
            headers: {
              token: 25, // this token must have permission 25
            },
          });
          console.log("Response:", response);

          setIsLoading(false);

          toast.success(response?.data?.message);
          navigate("/group-tour");
        } catch (error) {
          setIsLoading(false);
          toast.error(error?.response?.data?.message[0]);
          console.log(error);
        }
      } else {
        toast.error("Pax size cannot be more then 6 people");
      }
    },
  });

  // countryCode start
  const [countryCode, setCountryCode] = useState("+91");

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

  // Simulating async data fetching (replace with actual API call)
  const fetchNameOptions = async () => {
    try {
      const response = await get(`guest-email?guestName=${searchTerm}`);
      if (response.data.data.length > 0) {
        setNameOptions(response.data.data);
        validation.setFieldValue("nameofguest", searchTerm);
      } else {
        setNameOptions([]);
        validation.setFieldValue("nameofguest", searchTerm);
        setGuestId("");
        validation.setFieldValue("contact", "");
        validation.setFieldValue("email", "");
        validation.setFieldValue("enquiryref", "");
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
      validation.setFieldValue("nameofguest", selectedOption.label);
      setGuestId(selectedOption.value);
      getGuestInfoByName(selectedOption.value);
    } else {
      validation.setFieldValue("email", "");
      validation.setFieldValue("nameofguest", "");
      validation.setFieldValue("contact", "");
      validation.setFieldValue("enquiryref", "");
    }
  };

  //get guest info by name
  const getGuestInfoByName = async (name) => {
    try {
      const result = await get(`guest-info?guestId=${name}`);
      const { phone, email } = result.data;
      if (result.data) {
        validation.setFieldValue("email", email);
        validation.setFieldValue("contact", phone);
        validation.setFieldValue("enquiryref", 8);
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
  return (
    <>
      <div className="row">
        <div className="col-lg-12" style={{ paddingTop: "40px" }}>
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
                  <Link to="/group-tour">Enquiry follow-up</Link>
                </li>
                <li className="breadcrumb-item  ">
                  <Link to="/add-group-tour">Add Group Tour</Link>
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
                    <div className="card-title h5">Personal Details</div>
                  </div>
                  <div className="row">
                    <div className="mb-2 col-md-6">
                      <label>
                        Name of Guest<span className="error-star">*</span>
                      </label>
                      <Select
                        options={nameOptions.map((item) => ({
                          value: item.guestId,
                          label: item.guestName,
                        }))}
                        isClearable
                        isSearchable
                        name="nameofguest"
                        onInputChange={(inputValue) =>
                          setSearchTerm(inputValue)
                        }
                        onChange={handleNameChange}
                        value={
                          nameOptions.find(
                            (item) =>
                              item.guestName == validation.values.nameofguest
                          )
                            ? nameOptions.find(
                                (item) =>
                                  item.guestName ==
                                  validation.values.nameofguest
                              )
                            : {
                                value: validation.values.nameofguest,
                                label: validation.values.nameofguest,
                              }
                        }
                      />
                      <ErrorMessageComponent
                        errors={validation.errors}
                        fieldName={"nameofguest"}
                        touched={validation.touched}
                        key={"nameofguest"}
                      />
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
                      <ErrorMessageComponent
                        errors={validation.errors}
                        fieldName={"email"}
                        touched={validation.touched}
                        key={"email"}
                      />
                    </div>
                    <div className="mb-2 col-md-3">
                      <label className="form-label">
                        Contact No.<span className="error-star">*</span>
                      </label>
                      <div className="d-flex" style={{ gap: "5px" }}>
                        <PhoneInput
                          international
                          defaultCountry="IN"
                          value={countryCode}
                          name="countryCode"
                          maxLength={0}
                          onChange={setCountryCode}
                        />
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
                    <div className="mb-2 col-md-4">
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
                            option.value === validation.values.tourName
                        )}
                      />
                      <ErrorMessageComponent
                        errors={validation.errors}
                        fieldName={"tourname"}
                        touched={validation.touched}
                        key={"tourname"}
                      />
                    </div>
                    <div className="mb-2 col-md-4">
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

                    <div className="mb-2 col-md-4">
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
                      />
                      <ErrorMessageComponent
                        errors={validation.errors}
                        fieldName={"enquiryref"}
                        touched={validation.touched}
                        key={"enquiryref"}
                      />
                    </div>
                    {validation?.values?.enquiryref == 9 && (
                      <div className="mb-2 col-md-4">
                        <label>
                          Guest Reference Id
                          <span className="error-star">*</span>
                        </label>
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
                        />
                        <ErrorMessageComponent
                          errors={validation.errors}
                          fieldName={"guestenquiryref"}
                          touched={validation.touched}
                          key={"guestenquiryref"}
                        />
                      </div>
                    )}
                    <div className="mb-2 col-md-4">
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
                      />
                    </div>
                    <div className="mb-2 col-md-4">
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
                  </div>
                  <div className="mb-2 mt-2 row">
                    <div className="col-lg-12 d-flex justify-content-between">
                      <Link
                        to="/group-tour"
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
export default Addgrouptourr;
