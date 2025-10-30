import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { get, post } from "../../../../../services/apiServices";
import "react-phone-number-input/style.css";
import ErrorMessageComponent from "../../FormErrorComponent/ErrorMessageComponent";
import BackButton from "../../../common/BackButton";

const AddEnquiryGT = () => {
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
      namePreFix: "",
      firstName: "",
      lastName: "",
      groupName: "",
      tourName: "",
      numberoffamilyhead: "",
    },
    // validationSchema: Yup.object({
    // 	nextfollowup: Yup.string().required("Enter The Next Follow Up"),
    // 	firstName: Yup.string().required("Enter First Name"),
    // 	lastName: Yup.string().required("Enter Last Name"),
    // 	groupName: Yup.string().required("Enter Group Name"),
    // 	guestenquiryref: Yup.string().when("enquiryref", {
    // 		is: (enquiryref) => enquiryref == 9,
    // 		then: Yup.string().required("Enter the Guest Enquiry Reference"),
    // 		otherwise: Yup.string(),
    // 	}),
    // 	numberoffamilyhead: Yup.string().required(
    // 		"Enter The Number of family Head"
    // 	),
    // 	enquiryref: Yup.string().required("Enter the Enquiry Reference"),
    // 	adults: Yup.string().required("Enter The Adults"),
    // 	email: Yup.string().email("Please enter valid email address"),
    // 	tourname: Yup.string().required("Enter Tour name"),
    // 	contact: Yup.string()
    // 		.required("Enter the Contact Number")
    // 		.min(10, "Please enter correct contact number")
    // 		.max(10, "Please enter correct contact number"),
    // 	groupName: Yup.string().required("Enter the Group Name"),
    // }),
    validationSchema: Yup.object({
      nextfollowup: Yup.string(),
      firstName: Yup.string(),
      lastName: Yup.string(),
      groupName: Yup.string(),
      guestenquiryref: Yup.string(),
      numberoffamilyhead: Yup.string(),
      enquiryref: Yup.string(),
      adults: Yup.string(),
      email: Yup.string().email("Please enter a valid email address"),
      tourname: Yup.string(),
      contact: Yup.string()
        .min(10, "Please enter a correct contact number")
        .max(10, "Please enter a correct contact number"),
    }),

    onSubmit: async (values) => {
      let data = {
        nextFollowUp: values.nextfollowup,
        preFixId: values.namePreFix,
        firstName: guestId.length > 0 ? guestId : values.firstName,
        lastName: values.lastName,
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
      };

            

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
      const response = await get(`guest-email?firstName=${searchTerm}`);
      if (response.data.data.length > 0) {
        setNameOptions(response.data.data);
        validation.setFieldValue("firstName", searchTerm);
      } else {
        setNameOptions([]);
        validation.setFieldValue("firstName", searchTerm);

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
      validation.setFieldValue("firstName", selectedOption.label);
      setGuestId(selectedOption.value);
      getGuestInfoByName(selectedOption.value);
    } else {
      validation.setFieldValue("firstName", "");
      validation.setFieldValue("lastName", "");
      validation.setFieldValue("email", "");
      validation.setFieldValue("contact", "");
      validation.setFieldValue("enquiryref", "");
    }
  };

  //get guest info by name
  const getGuestInfoByName = async (name) => {
    try {
      const result = await get(`guest-info?guestId=${name}`);
      const { preFixId, lastName, phone, email } = result.data;

      if (result.data) {
        validation.setFieldValue("namePreFix", preFixId ? preFixId : 1);
        validation.setFieldValue("lastName", lastName);
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
    let element = document.getElementById("group-tour-new");
    if (element) {
      element.classList.add("mm-active1"); // Add the 'active' className to the element
    }
    return () => {
      if (element) {
        element.classList.remove("mm-active1"); // remove the 'active' className to the element when change to another page
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
                  <Link to="/group-tour-new">Enquiry follow-up</Link>
                </li>
                <li className="breadcrumb-item  ">
                  <Link to="/add-enquiry-git">Add Group Tour</Link>
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
                  <div
                    className="card-header pt-0 mb-2"
                    style={{ paddingLeft: "0" }}
                  >
                    <div className="card-title h5">Enquiry Details</div>
                  </div>
                  <div className="row">
                    <div className="mb-2 col-lg-4 col-md-6 col-sm-6 col-xs-6">
                      <label>
                        Name of Group<span className="error-star">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder=""
                        name="groupName"
                        value={validation.values.groupName}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
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
                        Name
                        <span className="error-star">*</span>
                      </label>
                      <div className="row">
                        <div
                          className="col-md-4 col-lg-4 col-sm-4  col-5 "
                          style={{ paddingRight: "7px" }}
                        >
                          <Select
                            styles={customStyles}
                            className="basic-single basic-salution"
                            classNamePrefix="select"
                            options={namePreFix}
                            onChange={(selectedOption) => {
                              validation.setFieldValue(
                                "namePreFix",
                                selectedOption ? selectedOption.value : ""
                              );
                            }}
                            onBlur={validation.handleBlur}
                            value={namePreFix.find(
                              (option) =>
                                option.value === validation.values.namePreFix
                            )}
                          />
                          <ErrorMessageComponent
                            errors={validation.errors}
                            fieldName={"namePreFix"}
                            touched={validation.touched}
                            key={"namePreFix"}
                          />
                        </div>

                        <div
                          className="col-md-8 col-lg-8 col-sm-8 col-7  "
                          style={{ paddingLeft: "7px" }}
                        >
                          <Select
                            options={nameOptions.map((item) => ({
                              value: item.guestId,
                              label: item.firstName,
                            }))}
                            isClearable
                            isSearchable
                            name="firstName"
                            placeholder="First Name"
                            onInputChange={(inputValue) =>
                              setSearchTerm(inputValue)
                            }
                            onChange={handleNameChange}
                            value={
                              nameOptions.find(
                                (item) =>
                                  item.firstName == validation.values.firstName
                              )
                                ? nameOptions.find(
                                    (item) =>
                                      item.firstName ==
                                      validation.values.firstName
                                  )
                                : {
                                    value: validation.values.firstName,
                                    label: validation.values.firstName,
                                  }
                            }
                          />
                          <ErrorMessageComponent
                            errors={validation.errors}
                            fieldName={"firstName"}
                            touched={validation.touched}
                            key={"firstName"}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-2 col-lg-4 col-md-6 col-sm-6 col-xs-6">
                      <label>
                        Last Name
                        <span className="error-star">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="lastName"
                        value={validation.values.lastName}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                      />
                      <ErrorMessageComponent
                        errors={validation.errors}
                        fieldName={"lastName"}
                        touched={validation.touched}
                        key={"lastName"}
                      />
                    </div>
                    <div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
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
                    </div>

                    <div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
                      <label className="form-label">
                        Contact No.<span className="error-star">*</span>
                      </label>
                      <div className="d-flex">
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
                    <div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
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
                      <div className="mb-2  col-lg-3 col-md-6 col-sm-6 col-xs-6">
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

                    <div className="mb-2  col-lg-3 col-md-6 col-sm-6 col-xs-6">
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
                  </div>

                  <div className="mb-2 mt-2 row">
                    <div className="col-lg-12 d-flex justify-content-between">
                      <Link
                        to="/group-tour-new"
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
export default AddEnquiryGT;
