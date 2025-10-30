import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { get } from "../../../../services/apiServices";
import { toast } from "react-toastify";
import { ErrorComponentArray } from "../FormErrorComponent/ErrorComponentArray";
import { updateFormData } from "../../../../store/actions/FormAction";
import { useSelector, useDispatch } from 'react-redux';
import BackButton from "../../common/BackButton";
const url = import.meta.env.VITE_WAARI_BASEURL;

const guestDetailsObj = {
  familyHeadName: "",
  contact: "",
  gender: "",
  address: "",
  mailId: "",
  dob: "",
  marriageDate: "",
  roomShareType: "",
  roomSharePrice: "",
  adharCard: "",
  adharNo: "",
  panNo: "",
  pan: "",
  passport: "",
  passportNo: "",
  guestId: null
}

const Guestdetails = () => {
  const { guestDetails } = useSelector((state) => state.form.formData || []);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [URLSearchParams, setURLSearchParams] = useSearchParams()
  const navigate = useNavigate();
  const [guestId, setGuestId] = useState(URLSearchParams.get('guestId'));
  const [enqDetailCustomId, setEnqDetailCustomId] = useState(URLSearchParams.get('enquiryDetailCustomId'));
  const [guestCount, setGuestCoung] = useState(parseInt(URLSearchParams.get('guests')));
  const [destinationId, setDestinationId] = useState(parseInt(URLSearchParams.get('destinationId')));
  const [familyHeadName, setFamilyHeadName] = useState((URLSearchParams.get('name')));
  const [loyaltyPoints, setloyaltyPoints] = useState((URLSearchParams.get('loyaltyPoints')));
  const [customEnqId, setCustomEnqId] = useState(id);
  // to get the Skeleton Itinerary end

  const [romesharing, setRomeSharing] = useState([]);
  const getRoomSharing = async () => {
    try {
      const response = await get(
        `/dropdown-final-custom-packages?enquiryCustomId=${customEnqId}`
      );
      setRomeSharing(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRoomSharing();
  }, []);

  useEffect(() => {
    // const textarea = document.getElementById("resizableTextarea");
    // const textarea1 = document.getElementById("resizableTextarea1");
    // const adjustTextareaHeight = () => {
    //   textarea.style.height = "auto"; // Reset height to auto to get the actual scroll height
    //   textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to the scroll height
    //   textarea1.style.height = "auto"; // Reset height to auto to get the actual scroll height
    //   textarea1.style.height = `${textarea1.scrollHeight}px`; // Set the height to the scroll height
    // };
    // textarea.addEventListener("input", adjustTextareaHeight);
    // textarea1.addEventListener("input", adjustTextareaHeight);
    // return () => {
    //   // Clean up the event listener when the component unmounts
    //   textarea.removeEventListener("input", adjustTextareaHeight);
    //   textarea1.removeEventListener("input", adjustTextareaHeight);
    // };
  }, []);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      guestid: guestId || "",
      guestDetails: [
        ...(guestDetails || []).map((item) => ({
          familyHeadName: item.familyHeadName,
          contact: item.contact,
          gender: item.gender,
          address: item.address,
          mailId: item.mailId,
          dob: item.dob,
          marriageDate: item.marriageDate,
          roomShareType: item.roomShareType,
          roomShareTypePrice: item.roomShareTypePrice,
          adharCard: item.adharCard,
          adharNo: item.adharNo,
          panNo: item.panNo,
          pan: item.pan,
          passport: item.passport,
          passportNo: item.passportNo || "",
          guestId: item.guestId,
        })),
        ...Array.from(
          { length: Math.max(0, guestCount - (guestDetails || []).length) },
          () => guestDetailsObj
        ),
      ],
    },
    validationSchema: Yup.object({
      guestDetails: Yup.array().of(
        Yup.object().shape({
          familyHeadName: Yup.string()
            .required("Name of Family Head is required")
            .min(4, "Name should be atleast 4 characters.")
            .max(30, "Name must be at most 30 characters long")
          ,
          contact: Yup.string().required("Contact Number is required")
            .min(10, "Contact must be at least 10 digits long")
            .max(10, "Contact must be at most 10 digits long"),
          address: Yup.string().required("Address is required"),
          gender: Yup.string().required("Gender is required"),
          mailId: Yup.string()
            .email("Invalid email address"),
          dob: Yup.string().required("Date of birth is required"),
          roomShareType: Yup.string().required("Room sharing Id is required"),
          adharCard: Yup.string().required("Aadhar card is required"),
          adharNo: Yup.string()
            .required("Aadhar Number is required")
            .min(12, "Aadhar Number must be at least 12 digits long")
            .max(12, "Aadhar Number must be at most 12 digits long"),
          passport: Yup.string().when([], {
            is: () => destinationId === 2,
            then: Yup.string().required("Passport is required"),
            otherwise: Yup.string(),
          }),
          pan: Yup.string(),
          panNo: Yup.string()
            .min(10, "Pan card number must be at least 10 digits long")
            .max(10, "Pan card number must be at most 10 digits long"),
        })
      ),
    }),

    onSubmit: async (values) => {
      dispatch(updateFormData(values))
      navigate(`/discount-details/${customEnqId}?guestId=${guestId}&destinationId=${destinationId}&enquiryDetailCustomId=${enqDetailCustomId}&guests=${guestCount}&loyaltyPoints=${loyaltyPoints}`)
    },
  });

  //   upload thumbnail file start
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  const getFileLink = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      setIsLoadingImages(true);
      const responseData = await axios.post(
        `
          ${url}/image-upload`,
        formData,
      );
      toast.success(responseData?.data?.message)
      setIsLoadingImages(false);
      return responseData?.data?.image_url;
    } catch (error) {
      setIsLoadingImages(false);
      toast.error(error?.response?.data?.message?.toString())
      console.log(error);
    }
  };
  //   upload thumbnail file end

  // to show billing name as head of family start
  const [showIndex, setShowIndex] = useState([]);

  const handleCheckboxChange = (index) => {
    setShowIndex((prevShowIndex) => {
      const newShowIndex = [...prevShowIndex];
      newShowIndex[index] = !newShowIndex[index];
      return newShowIndex;
    });
    validation.setFieldValue(
      `guestDetails[${index}].address`,
      validation.values.guestDetails[0].address
    );
  };
  // to show billing name as head of family end

  useEffect(() => {
    // While view farmer page is active, the yadi tab must also activated
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
  useEffect(() => {
    validation.values.guestDetails.forEach((item, index) => {
      const textarea5 = document.getElementById(
        `guestDetails[${index}].address`
      );
      textarea5.addEventListener("input", function () {
        this.style.height = "auto"; // Reset height to auto
        this.style.height = this.scrollHeight + "px"; // Set height to scrollHeight
      });
    });
  }, [validation.values.guestDetails]);

  async function getDataFromGuestId() {
    try {
      const result = await get(`guest-info?guestId=${guestId}`)
      const { phone, email, userName, address, gender, marriageDate, passportNo, adharNo, adharCard, panNo, pan, passport, dob } = result.data
      if (result.data) {
        validation.setFieldValue(`guestDetails[0].familyHeadName`, userName || familyHeadName)
        validation.setFieldValue(`guestDetails[0].contact`, phone)
        validation.setFieldValue(`guestDetails[0].gender`, gender)
        validation.setFieldValue(`guestDetails[0].address`, address)
        validation.setFieldValue(`guestDetails[0].mailId`, email)
        validation.setFieldValue(`guestDetails[0].marriageDate`, marriageDate)
        validation.setFieldValue(`guestDetails[0].adharNo`, adharNo)
        validation.setFieldValue(`guestDetails[0].adharCard`, adharCard)
        validation.setFieldValue(`guestDetails[0].panNo`, panNo)
        validation.setFieldValue(`guestDetails[0].pan`, pan)
        validation.setFieldValue(`guestDetails[0].passport`, passport)
        validation.setFieldValue(`guestDetails[0].passportNo`, passportNo)
        validation.setFieldValue(`guestDetails[0].dob`, dob)
        validation.setFieldValue(`guestDetails[0].guestId`, guestId)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (guestDetails == undefined || guestDetails?.length == 0) {
      getDataFromGuestId()
    }
  }, [])
  //get data from email 

  const [nameOptions, setNameOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState({ txt: '', index: 0 });
  // Simulating async data fetching (replace with actual API call)
  const fetchNameOptions = async () => {
    try {
      const response = await get(`guest-email?firstName=${searchTerm.txt}`);
      if (response.data.data.length > 0) {
        setNameOptions(response.data.data);
        validation.setFieldValue(`guestDetails[${searchTerm.index}].familyHeadName`, searchTerm.txt)
      } else {
        validation.setFieldValue(`guestDetails[${searchTerm.index}].familyHeadName`, searchTerm.txt)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleNameChange = (selectedOption, index) => {
    if (selectedOption) {
      validation.setFieldValue(`guestDetails[${index}].familyHeadName`, selectedOption.label);
      getGuestInfoByName(selectedOption.value, index)
    } else {

      validation.setFieldValue(`guestDetails[${index}].mailId`, '');
      validation.setFieldValue(`guestDetails[${index}].familyHeadName`, '')
      validation.setFieldValue(`guestDetails[${index}].address`, '')
      validation.setFieldValue(`guestDetails[${index}].contact`, '')
      validation.setFieldValue(`guestDetails[${index}].passport`, '')
      validation.setFieldValue(`guestDetails[${index}].passportNo`, '')
      validation.setFieldValue(`guestDetails[${index}].panNo`, '')
      validation.setFieldValue(`guestDetails[${index}].pan`, '')
      validation.setFieldValue(`guestDetails[${index}].dob`, '')
      validation.setFieldValue(`guestDetails[${index}].adharNo`, '')
      validation.setFieldValue(`guestDetails[${index}].adharCard`, '')
      validation.setFieldValue(`guestDetails[${index}].marriageDate`, '')
      validation.setFieldValue(`guestDetails[${index}].gender`, '')
    }
  };

  //get guest info by Name
  const getGuestInfoByName = async (guestId, index) => {
    try {
      const result = await get(`guest-info?guestId=${guestId}`)
      const { phone, userName, address, passport, panNo, pan, email, passportNo, adharNo, adharCard, marriageDate, dob, gender } = result.data
      if (result.data) {
        if (destinationId == 1) {
          validation.setFieldError(`guestDetails[${index}].passport`, '')
          validation.setFieldError(`guestDetails[${index}].passportNo`, '')
        } else {
          validation.setFieldValue(`guestDetails[${index}].passport`, passport)
          validation.setFieldValue(`guestDetails[${index}].passportNo`, passportNo)
        }

        validation.setFieldValue(`guestDetails[${index}].mailId`, email ? email : '')
        validation.setFieldValue(`guestDetails[${index}].address`, address ? address : '')
        validation.setFieldValue(`guestDetails[${index}].contact`, phone ? phone : '')
        validation.setFieldValue(`guestDetails[${index}].panNo`, panNo ? panNo : '')
        validation.setFieldValue(`guestDetails[${index}].pan`, pan ? pan : '')
        validation.setFieldValue(`guestDetails[${index}].dob`, dob ? dob : '')
        validation.setFieldValue(`guestDetails[${index}].adharNo`, adharNo ? adharNo : '')
        validation.setFieldValue(`guestDetails[${index}].adharCard`, adharCard ? adharCard : '')
        validation.setFieldValue(`guestDetails[${index}].marriageDate`, marriageDate ? marriageDate : '')
        validation.setFieldValue(`guestDetails[${index}].gender`, gender ? gender : '')
        validation.setFieldValue(`guestDetails[${index}].guestId`, guestId)
      }
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    if (searchTerm.txt.length > 2) {
      // Call the debouncedFetch function
      fetchNameOptions();
    } else {
      // Reset options when search term is less than or equal to 3 characters
      setNameOptions([]);
    }

  }, [searchTerm.txt]);


  console.log(
  "errors", validation.errors
  )

  return (
    <div className="row">
      <div className="col-lg-12" style={{ paddingTop: '40px' }}>
        <div className="card">
          <div className="row page-titles mx-0 fixed-top-breadcrumb">
               <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <BackButton />
                        </li>
              <li className="breadcrumb-item active">
                <Link to="/customizedbooking/booking">Booking</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/customized-tour">Enquiry follow-up</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/guest-details">Guest Details</Link>
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
                  className="card-header"
                  style={{ paddingLeft: "0", paddingBottom: "0.7rem" }}
                >
                  <div className="card-title h5">Guest 1(Family head)</div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">Guest Id</label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="guestid"
                      id="guestid"
                      className="form-control"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.guestid}
                      disabled
                    />
                    {validation.touched.guestid && validation.errors.guestid ? (
                      <span className="error">{validation.errors.guestid}</span>
                    ) : null}
                  </div>
                </div>

                {
                  validation.values.guestDetails.map((item, index) => {
                    return (
                      <>
                      <div key={index}>
                        <div className="row mb-2 form-group">
                          {
                            index == 0 ? null :
                          <div
                            className="card-header"
                            style={{ paddingLeft: "0", paddingBottom: "0.7rem" }}
                          >
                            <div className="card-title h5">Guest {index+1}</div>
                          </div>
                          }
                          <div className="col-md-2">
                            <label className="text-label">
                              Name<span className="error-star">*</span>
                            </label>
                          </div>
                          <div className="col-md-6">
                            {
                              index == 0 ?
                                <input
                                  type="text"
                                  className="form-control"
                                  minLength={10}
                                  maxLength={10}
                                  disabled
                                  id={`guestDetails[0].familyHeadName`}
                                  name={`guestDetails[0].familyHeadName`}
                                  value={
                                    validation.values.guestDetails[0]
                                      ?.familyHeadName
                                  }
                                /> :
                                <>
                                  <Select
                                    options={nameOptions.map(item => ({ value: item.guestId, label: item.guestName }))}
                                    isClearable
                                    isSearchable
                                    onInputChange={(inputValue) => setSearchTerm({ txt: inputValue, index: index })}
                                    onChange={(i) => handleNameChange(i, index)}
                                    value={
                                      nameOptions.find(item => item.guestName == validation.values.guestDetails[index].familyHeadName)
                                        ? nameOptions.find(item => item.guestName == validation.values.guestDetails[index].familyHeadName)
                                        : { value: validation.values.guestDetails[index].familyHeadName, label: validation.values.guestDetails[index].familyHeadName }
                                    }
                                  />
                                  <ErrorComponentArray
                                    touched={validation.touched.guestDetails}
                                    errors={validation.errors.guestDetails}
                                    index={index}
                                    fieldName="familyHeadName"
                                  />
                                </>
                            }
                          </div>

                        </div>

                        <div className="row mb-2 form-group">
                          <div className="col-md-2">
                            <label className="text-label">Gender<span className="error-star">*</span></label>
                          </div>
                          <div className="col-md-6">
                            <div className="d-flex">
                              <div className="form-check">
                                <label className="form-check-label">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name={`guestDetails[${index}].gender`}
                                    value="male"
                                    checked={
                                      validation.values.guestDetails[index]?.gender ===
                                      "male"
                                    }
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                  />
                                  Male</label>
                              </div>
                              <div className="form-check">
                                <label className="form-check-label">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name={`guestDetails[${index}].gender`}
                                    value="female"
                                    checked={
                                      validation.values.guestDetails[index]?.gender ===
                                      "female"
                                    }
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                  />

                                  Female
                                </label>
                              </div>
                              <div className="form-check disabled">
                                <label className="form-check-label">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name={`guestDetails[${index}].gender`}
                                    value="other"
                                    checked={
                                      validation.values.guestDetails[index]?.gender ===
                                      "other"
                                    }
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                  />
                                  Other
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row mb-2 form-group">
                          <div className="col-md-2">
                            <label className="text-label">
                              Contact Number <span className="error-star">*</span>
                            </label>
                          </div>
                          <div className="col-md-6">
                            <input
                              type="text"
                              className="form-control"
                              minLength={10}
                              maxLength={10}
                              id={`guestDetails[${index}].contact`}
                              name={`guestDetails[${index}].contact`}
                              onChange={(e) => {
                                validation.handleChange(e);
                              }}
                              onBlur={validation.handleBlur}
                              value={
                                validation.values.guestDetails[index]
                                  ?.contact
                              }
                            />
                            <ErrorComponentArray
                              touched={validation.touched.guestDetails}
                              errors={validation.errors.guestDetails}
                              index={index}
                              fieldName="contact"
                            />
                          </div>
                        </div>
                        <div className="row mb-2 form-group">
                          <div className="col-md-2">
                            <label className="text-label">
                              Address<span className="error-star">*</span>
                            </label>
                          </div>
                          <div className="col-md-6">
                            <textarea
                              type="text"
                              className="textarea"
                              id={`guestDetails[${index}].address`}
                              name={`guestDetails[${index}].address`}
                              onChange={(e) => {
                                validation.handleChange(e);
                              }}
                              onBlur={validation.handleBlur}
                              value={
                                validation.values.guestDetails[index]
                                  ?.address
                              }
                            />
                            <ErrorComponentArray
                              touched={validation.touched.guestDetails}
                              errors={validation.errors.guestDetails}
                              index={index}
                              fieldName="address"
                            />
                          </div>
                          {index == 0 ? null : <div className="col-sm-4">
                            <div className="form-check mb-2 checkbox-same">
                              <input
                                checked={showIndex[index] || false}
                                onChange={() => handleCheckboxChange(index)}
                                type="checkbox"
                                className="form-check-input "
                                id="check1"
                                value=""
                              />
                              <label className="form-check-label" htmlFor="check1">
                                Same as family head
                              </label>
                            </div>
                          </div>}
                        </div>
                        <div className="row mb-2 form-group">
                          <div className="col-md-2">
                            <label className="text-label">
                              Mail Id
                            </label>
                          </div>
                          <div className="col-md-6">
                            <input
                              type="mail"
                              className="form-control"
                              id={`guestDetails[${index}].mailId`}
                              name={`guestDetails[${index}].mailId`}
                              onChange={(e) => {
                                validation.handleChange(e);
                              }}
                              onBlur={validation.handleBlur}
                              value={
                                validation.values.guestDetails[index]?.mailId ||
                                ""
                              }
                            />

                            <ErrorComponentArray
                              touched={validation.touched.guestDetails}
                              errors={validation.errors.guestDetails}
                              index={index}
                              fieldName="mailId"
                            />
                          </div>
                        </div>
                        <div className="row mb-2 form-group">
                          <div className="col-md-2">
                            <label className="text-label">
                              Date of Birth<span className="error-star">*</span>
                            </label>
                          </div>
                          <div className="col-md-6">
                            <input
                              type="date"
                              className="form-control"
                              max={new Date().toISOString().split("T")[0]}
                              id={`guestDetails[${index}].dob`}
                              name={`guestDetails[${index}].dob`}
                              onChange={(e) => {
                                validation.handleChange(e);
                              }}
                              onBlur={validation.handleBlur}
                              value={
                                validation.values.guestDetails[index]?.dob
                              }
                            />

                            <ErrorComponentArray
                              touched={validation.touched.guestDetails}
                              errors={validation.errors.guestDetails}
                              index={index}
                              fieldName="dob"
                            />
                          </div>
                        </div>
                        <div className="row mb-2 form-group">
                          <div className="col-md-2">
                            <label className="text-label">
                              Date of marriage
                            </label>
                          </div>
                          <div className="col-md-6">
                            <input
                              type="date"
                              className="form-control"
                              id={`guestDetails[${index}].marriageDate`}
                              name={`guestDetails[${index}].marriageDate`}
                              onChange={(e) => {
                                validation.handleChange(e);
                              }}
                              onBlur={validation.handleBlur}
                              value={
                                validation.values.guestDetails[index]
                                  ?.marriageDate
                              }
                            />
                            <ErrorComponentArray
                              touched={validation.touched.guestDetails}
                              errors={validation.errors.guestDetails}
                              index={index}
                              fieldName="marriageDate"
                            />
                          </div>
                        </div>
                        <div className="row mb-2 form-group">
                          <div className="col-md-2">
                            <label className="text-label">
                              Room Sharing Type
                              <span className="error-star">*</span>
                            </label>
                          </div>
                          <div className="col-md-6">
                            <select
                              className="form-control select2"
                              name={`guestDetails[${index}].roomShareType`}
                              onChange={(event) => {
                                const selectedValue = event.target.value;
                                romesharing.find((item) => {
                                  if (item.label == selectedValue) {
                                    validation.setFieldValue(`guestDetails[${index}].roomShareTypePrice`, item.value)
                                  }
                                })

                                validation.setFieldValue(
                                  `guestDetails[${index}].roomShareType`,
                                  selectedValue
                                );
                              }}

                              value={validation.values.guestDetails[index]?.roomShareType}
                            >
                              <option value="0" key={'ioiyu'}>Select</option>
                              {romesharing?.map((cat) => (
                                <option key={index} value={cat.label}>
                                  {cat.label}
                                </option>
                              ))}
                            </select>

                            <ErrorComponentArray
                              touched={validation.touched.guestDetails}
                              errors={validation.errors.guestDetails}
                              index={index}
                              fieldName="roomShareType"
                            />
                          </div>
                        </div>
                        <div className="row mb-2 form-group">
                          <div className="col-md-2">
                            <label className="text-label">
                              Upload Aadhar Card
                              <span className="error-star">*</span>
                            </label>
                          </div>
                          <div className="col-md-6">
                            <div className="Neon Neon-theme-dragdropbox">
                              <input className="file_upload"
                                name={`guestDetails[${index}].adharCard`}
                                accept="image/*" id="filer_input2" type="file" draggable onChange={async (e) => {
                                  const selectedFile = e.target.files[0];
                                  const fileLink = await getFileLink(selectedFile);
                                  validation.setFieldValue(`guestDetails[${index}].adharCard`, fileLink)
                                }} />
                              <div className="Neon-input-dragDrop">
                                {
                                  validation.values.guestDetails.length > 0 && validation.values.guestDetails[index]?.adharCard?.length == 0 ?
                                    <div className="Neon-input-inner ">
                                      <div className="Neon-input-text">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="display-4">
                                          <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM216 408c0 13.3-10.7 24-24 24s-24-10.7-24-24V305.9l-31 31c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l72-72c9.4-9.4 24.6-9.4 33.9 0l72 72c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-31-31V408z" /></svg>
                                      </div>
                                      <a className="Neon-input-choose-btn blue">Drop files here or click to upload.</a>
                                    </div> :
                                    <img src={validation.values.guestDetails[index]?.adharCard} alt="frontImage" width="100%" className="neon-img" />
                                }
                              </div>
                            </div>
                            <ErrorComponentArray
                              touched={validation.touched.guestDetails}
                              errors={validation.errors.guestDetails}
                              index={index}
                              fieldName="adharCard"
                            />
                          </div>

                        </div>
                        <div className="row mb-2 form-group">
                          <div className="col-md-2">
                            <label className="text-label">
                              Aadhar Number<span className="error-star">*</span>
                            </label>
                          </div>
                          <div className="col-md-6">
                            <input
                              type="text"
                              className="form-control"
                              id={`guestDetails[${index}].adharNo`}
                              name={`guestDetails[${index}].adharNo`}
                              onChange={(e) => {
                                validation.handleChange(e);
                              }}
                              onBlur={validation.handleBlur}
                              value={
                                validation.values.guestDetails[index]
                                  ?.adharNo
                              }
                            />
                            <ErrorComponentArray
                              touched={validation.touched.guestDetails}
                              errors={validation.errors.guestDetails}
                              index={index}
                              fieldName="adharNo"
                            />
                          </div>
                        </div>
                        {
                          destinationId === 2 &&
                          <>
                            <div className="row mb-2 form-group">
                              <div className="col-md-2">
                                <label className="text-label">
                                  Upload Passport
                                  <span className="error-star">*</span>
                                </label>
                              </div>
                              <div className="col-md-6">
                                <div className="Neon Neon-theme-dragdropbox">
                                  <input className="file_upload"
                                    name={`guestDetails[${index}].passport`}
                                    accept="image/*" id="filer_input2" type="file" draggable onChange={async (e) => {
                                      const selectedFile = e.target.files[0];
                                      const fileLink = await getFileLink(selectedFile);
                                      validation.setFieldValue(`guestDetails[${index}].passport`, fileLink)
                                    }} />
                                  <div className="Neon-input-dragDrop">
                                    {
                                      validation.values.guestDetails.length > 0 && validation.values.guestDetails[index]?.passport?.length == 0 ?
                                        <div className="Neon-input-inner ">
                                          <div className="Neon-input-text">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="display-4">
                                              <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM216 408c0 13.3-10.7 24-24 24s-24-10.7-24-24V305.9l-31 31c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l72-72c9.4-9.4 24.6-9.4 33.9 0l72 72c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-31-31V408z" /></svg>
                                          </div>
                                          <a className="Neon-input-choose-btn blue">Drop files here or click to upload.</a>
                                        </div> :
                                        <img src={validation.values.guestDetails[index]?.passport} alt="frontImage" width="100%" className="neon-img" />
                                    }
                                  </div>
                                </div>
                                <ErrorComponentArray fieldName={'passport'} key={'passport'} index={index} errors={validation.errors.guestDetails} touched={validation.touched.guestDetails} />
                              </div>
                            </div>
                            <div className="row mb-2 form-group">
                              <div className="col-md-2">
                                <label className="text-label">
                                  Passport Number
                                </label>
                              </div>
                              <div className="col-md-6">
                                <input
                                  type="text"
                                  className="form-control"
                                  id={`guestDetails[${index}].passportNo`}
                                  name={`guestDetails[${index}].passportNo`}
                                  onChange={(e) => {
                                    validation.handleChange(e);
                                  }}
                                  onBlur={validation.handleBlur}
                                  value={
                                    validation.values.guestDetails[index]
                                      ?.passportNo
                                  }
                                />
                              </div>
                            </div>
                          </>
                        }
                        <div className="row mb-2 form-group">
                          <div className="col-md-2">
                            <label className="text-label">
                              Upload PAN
                            </label>
                          </div>
                          <div className="col-md-6">
                            <div className="Neon Neon-theme-dragdropbox">
                              <input className="file_upload"
                                name={`guestDetails[${index}].pan`}
                                accept="image/*" id="filer_input2" type="file" draggable onChange={async (e) => {
                                  const selectedFile = e.target.files[0];
                                  const fileLink = await getFileLink(selectedFile);
                                  validation.setFieldValue(`guestDetails[${index}].pan`, fileLink)
                                }} />
                              <div className="Neon-input-dragDrop">
                                {
                                  validation.values.guestDetails.length > 0 && validation.values.guestDetails[index]?.pan?.length == 0 ?
                                    <div className="Neon-input-inner ">
                                      <div className="Neon-input-text">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="display-4">
                                          <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM216 408c0 13.3-10.7 24-24 24s-24-10.7-24-24V305.9l-31 31c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l72-72c9.4-9.4 24.6-9.4 33.9 0l72 72c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-31-31V408z" /></svg>
                                      </div>
                                      <a className="Neon-input-choose-btn blue">Drop files here or click to upload.</a>
                                    </div> :
                                    <img src={validation.values.guestDetails[index]?.pan} alt="frontImage" width="100%" className="neon-img" />
                                }
                              </div>
                            </div>
                            <ErrorComponentArray fieldName={'pan'} key={'pan'} index={index} errors={validation.errors.guestDetails} touched={validation.touched.guestDetails} />
                          </div>
                        </div>
                        <div className="row mb-2 form-group">
                          <div className="col-md-2">
                            <label className="text-label">
                              PAN Number
                            </label>
                          </div>
                          <div className="col-md-6">
                            <input
                              type="text"
                              className="form-control"
                              id={`guestDetails[${index}].panNo`}
                              name={`guestDetails[${index}].panNo`}
                              onChange={(e) => {
                                validation.handleChange(e);
                              }}
                              onBlur={validation.handleBlur}
                              value={
                                validation.values.guestDetails[index]?.panNo ||
                                ""
                              }
                            />
                            <ErrorComponentArray
                              touched={validation.touched.guestDetails}
                              errors={validation.errors.guestDetails}
                              index={index}
                              fieldName="panNo"
                            />
                          </div>
                        </div>

                      </div>
                        <div className="divider divider-last"></div>
                      </>
                    );
                  })}

                <div className="mb-2 mt-2 row">
                  <div className="col-lg-12 d-flex justify-content-between">
                    <Link
                      to={`/customizedbooking/booking/${customEnqId}`}
                      className="btn btn-back"
                    >
                      Back
                    </Link>
                    <button
                      type="submit"
                      className="btn btn-submit btn-primary"
                      disabled={isLoadingImages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guestdetails;
