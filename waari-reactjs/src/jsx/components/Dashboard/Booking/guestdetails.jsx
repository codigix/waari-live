import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { get } from "../../../../services/apiServices";
import { toast } from "react-toastify";
import { ErrorComponentArray } from "../FormErrorComponent/ErrorComponentArray";
import Select from "react-select";
const url = import.meta.env.VITE_WAARI_BASEURL;

const initialValuesObject = {
  familyHeadName: "",
  address: "",
  adharCard: "",
  adharNo: "",
  contact: "",
  dob: "",
  gender: "",
  mailId: "",
  marriageDate: "",
  pan: "",
  panNo: "",
  passport: "",
  passportNo: "",
  roomShareId: "",
  guestId: null,
};


const Guestdetails = ({
  moveToStep2,
  moveToStep1,
  dataLength,
  updateData3,
  tourPrice,
  roomSharedId,
  destinationId,
  guestData,
  sharedData,
}) => {
  // to get the no of iteration start
  const [romesharing, setRomeSharing] = useState([]);

  const getRoomSharing = async () => {
    try {
      const response = await get(
        `/dropdownRoomPrice?enquiryGroupId=${roomSharedId}`
      );
      const mappedData = response.data.data.map((item) => ({
        value: item.roomShareId,
        label: item.roomShareName,
        price: item.offerPrice,
      }));
      setRomeSharing(mappedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRoomSharing();
  }, []);

  const setGuestDetailsValues = (element, index) => {
    const fields = [
      "familyHeadName",
      "address",
      "adharCard",
      "adharNo",
      "contact",
      "dob",
      "gender",
      "mailId",
      "marriageDate",
      "pan",
      "panNo",
      "passport",
      "passportNo",
      "roomShareId",
      "guestId",
    ];

    fields.forEach((field) => {
      validation.setFieldValue(`guestDetails[${index}].${field}`, element?.[field] ?? "");
    });
  };

  useEffect(() => {
    if (sharedData?.guestDetails?.length > 0) {
      sharedData?.guestDetails.forEach((element, index) => {
        setGuestDetailsValues(element, index);
      });
    } else {
      setGuestDetailsValues(guestData, 0);
    }
  }, []);



  const createInitialValues = (length) => {
    const initialValues = {
      guestid: guestData.guestId,
      guestDetails: Array.from({ length }, () => ({ ...initialValuesObject })),
    };

    return initialValues;
  };

  const validationSchema = Yup.object().shape({
    guestDetails: Yup.array().of(
      Yup.object().shape({
        familyHeadName: Yup.string()
          .required("Name of Family Head is required")
          .min(4, "Name should be atleast 4 characters.")
          .max(30, "Name must be at most 30 characters long"),
        contact: Yup.string()
          .min(10, "Contact must be at least 10 digits long")
          .max(10, "Contact must be at at most 10 digits long"),
        address: Yup.string().required("Address is required"),
        gender: Yup.string().required("Gender is required"),
        mailId: Yup.string()
          .email("Invalid email address"),
        dob: Yup.string().required("Date of birth is required"),
        roomShareId: Yup.string().required("Room sharing Id is required"),
        adharCard: Yup.string().required("Aadhar card is required"),
        adharNo: Yup.string()
          .required("Aadhar Number is required")
          .min(12, "Aadhar Number must be at least 12 digits long")
          .max(12, "Aadhar Number must be at at most 12 digits long"),
        passport: Yup.string().when([], {
          is: () => destinationId == 2,
          then: Yup.string().required("Passport is required"),
          otherwise: Yup.string(),
        }),
    
      })
    ),
  });

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: createInitialValues(dataLength),
    validationSchema,
    onSubmit: async (values) => {
      updateData3(values);
      moveToStep2();
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
      toast.success("File uploaded successfully");
      setIsLoadingImages(false);
      return responseData?.data?.image_url;
    } catch (error) {
      setIsLoadingImages(false);
      toast.error(error?.response?.data?.message?.toString())
      console.log(error);
    }
  };
  //   upload thumbnail file end
  const totalSelectedPrice = validation.values.guestDetails.reduce(
    (total, value, index) => {
      const selectedOption = romesharing.find((option) => {
        return option.value == value.roomShareId;
      });
      return (
        Number(total) + (selectedOption ? Number(selectedOption.price) : 0)
      );
    },
    0
  );

  tourPrice(totalSelectedPrice);

  const scrollToFirstError = () => {
    const errorElement = document.querySelector(".error");

    if (errorElement) {
      errorElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // to show billing name as head of family start
  const [showIndex, setShowIndex] = useState([]);

  const handleCheckboxChange = (e,index) => {
     const checked = e.target.checked;
     if(checked){
      validation.setFieldValue(
        `guestDetails[${index}].address`,
        validation.values.guestDetails[0].address
      );
      }else{
        validation.setFieldValue(
          `guestDetails[${index}].address`,
          ''
        );
      }
      

    setShowIndex((prevShowIndex) => {
      const newShowIndex = [...prevShowIndex];
      newShowIndex[index] = !newShowIndex[index];
      return newShowIndex;
    });
  };
  // to show billing name as head of family end

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

  //get data from email 

  const [nameOptions, setNameOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState({ txt: '', index: 0 });
  // Simulating async data fetching (replace with actual API call)
  const fetchNameOptions = async () => {
    try {
      const response = await get(`guest-email?guestName=${searchTerm.txt}`);
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
      validation.setFieldValue(`guestDetails[${index}].roomShareId`, '')
    }
  };

  //get guest info by Name
  const getGuestInfoByName = async (guestId, index) => {
    try {
      const result = await get(`guest-info?guestId=${guestId}`)
      const { phone, userName, address, passport, panNo, pan, email,passportNo, adharNo, adharCard, marriageDate, dob, gender } = result.data
      if (result.data) {
        if (destinationId == 1) {
          validation.setFieldError(`guestDetails[${index}].passport`, '')
          validation.setFieldError(`guestDetails[${index}].passportNo`, '')
        } else {
          validation.setFieldValue(`guestDetails[${index}].passportNo`, passport)
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
        validation.setFieldValue(`guestDetails[${index}].roomShareId`, '')
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

  return (
    <section>
      <form
        className="needs-validation"
        onSubmit={(e) => {
          e.preventDefault();
          validation.handleSubmit();
          scrollToFirstError();
          return false;
        }}
      >
        <div className="card-header" style={{ paddingLeft: "0" }}>
          <div className="card-title h5">Guest 1 (Family head)</div>
        </div>
        <div className="row mb-2">
          <div className="col-md-2">
            <label className="text-label">
              Guest Id<span className="error-star">*</span>
            </label>
          </div>
          <div className="col-md-6">
            <input
              type="text"
              id={`guestid`}
              name={`guestid`}
              className="form-control"
              onChange={(e) => {
                validation.handleChange(e);
              }}
              onBlur={validation.handleBlur}
              value={validation.values.guestid}
              disabled
            />
          </div>
        </div>
        {validation.values.guestDetails &&
          validation.values.guestDetails.map((item, index) => {
            return (
              <>
              {
                index == 0 ? null : 
                <div className="card-header" style={{ paddingLeft: "0.7rem" ,marginBottom:"0.1rem"}}>
                <div className="card-title h5">Guest {index+1}</div>
              </div>
              }
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">
                      Guest Name<span className="error-star">*</span>
                    </label>
                  </div>
                  {
                    index == 0 ?
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          id={`guestDetails[${index}].familyHeadName`}
                          name={`guestDetails[${index}].familyHeadName`}
                          value={validation.values.guestDetails[index]?.familyHeadName}
                          disabled
                        />
                      </div> :
                      <div className="col-md-6">
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
                        <ErrorComponentArray fieldName={'familyHeadName'} key={'familyHeadName'} index={index} errors={validation.errors.guestDetails} touched={validation.touched.guestDetails} />
                      </div>
                  }
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
                          Male
                        </label>
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
                            value="others"
                            checked={
                              validation.values.guestDetails[index]?.gender ===
                              "others"
                            }
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                          />
                          Others
                        </label>
                      </div>
                    </div>
                    <ErrorComponentArray fieldName={'gender'} key={'gender'} index={index} errors={validation.errors.guestDetails} touched={validation.touched.guestDetails} />
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">
                      Contact Number <span className="error-star"></span>
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
                        validation.values.guestDetails[index]?.contact
                      }

                    />
                    <ErrorComponentArray fieldName={'contact'} key={'contact'} index={index} errors={validation.errors.guestDetails} touched={validation.touched.guestDetails} />
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">
                      Mail Id<span className="error-star"></span>
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      id={`guestDetails[${index}].mailId`}
                      name={`guestDetails[${index}].mailId`}
                      onChange={(e) => {
                        validation.handleChange(e);
                      }}
                      onBlur={validation.handleBlur}
                      value={validation.values.guestDetails[index]?.mailId}
                    />
                    <ErrorComponentArray fieldName={'mailId'} key={'mailId'} index={index} errors={validation.errors.guestDetails} touched={validation.touched.guestDetails} />
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
                      onBlur={(e) => validation.handleBlur(e)}
                      value={
                        showIndex[index] ? validation.values.guestDetails[0]?.address : validation.values.guestDetails[index]?.address
                      }
                    />
                    <ErrorComponentArray fieldName={'address'} key={'address'} index={index} errors={validation.errors.guestDetails} touched={validation.touched.guestDetails} />
                  </div>
                  {index == 0 ? null : (
                    <div className="col-sm-4">
                      <div className="form-check mb-2 checkbox-same">
                        <input
                          checked={showIndex[index] || false}
                          onChange={(e) => handleCheckboxChange(e,index)}
                          type="checkbox"
                          className="form-check-input "
                          id="check1"
                          value=""
                        />
                        <label className="form-check-label" htmlFor="check1">
                          Same as family head
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">
                      Date of birth<span className="error-star">*</span>
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
                      value={validation.values.guestDetails[index]?.dob}
                    />
                    <ErrorComponentArray fieldName={'dob'} key={'dob'} index={index} errors={validation.errors.guestDetails} touched={validation.touched.guestDetails} />
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">Date of marriage</label>
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
                        validation.values.guestDetails[index]?.marriageDate ||
                        ""
                      }
                    />
                    <ErrorComponentArray fieldName={'marriageDate'} key={'marriageDate'} index={index} errors={validation.errors.guestDetails} touched={validation.touched.guestDetails} />
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">
                      Room Sharing Type<span className="error-star">*</span>
                    </label>
                  </div>
                  <div className="col-md-6">
                    <select
                      id={`guestDetails[${index}].roomShareId`}
                      name={`guestDetails[${index}].roomShareId`}
                      className="form-control"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.guestDetails[index]?.roomShareId}
                    >
                      <option value="" label="Select" />
                      {romesharing?.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <ErrorComponentArray
                      fieldName="roomShareId"
                      key="roomShareId"
                      index={index}
                      touched={validation.touched.guestDetails}
                      errors={validation.errors.guestDetails}
                    />
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">
                      Upload Aadhar Card<span className="error-star">*</span>
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
                    <ErrorComponentArray fieldName={'adharCard'} key={'adharCard'} index={index} errors={validation.errors.guestDetails} touched={validation.touched.guestDetails} />
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
                      type="number"
                      className="form-control"
                      minLength={12}
                      maxLength={12}
                      id={`guestDetails[${index}].adharNo`}
                      name={`guestDetails[${index}].adharNo`}
                      onChange={(e) => {
                        validation.handleChange(e);
                      }}
                      onBlur={validation.handleBlur}
                      value={
                        validation.values.guestDetails[index]?.adharNo
                      }
                    />
                    <ErrorComponentArray fieldName={'adharNo'} key={'adharNo'} index={index} errors={validation.errors.guestDetails} touched={validation.touched.guestDetails} />
                  </div>
                </div>
                {destinationId == 2 && (
                  <>
                  <div className="row mb-2 form-group">
                    <div className="col-md-2">
                      <label className="text-label">
                        Upload Passport<span className="error-star">*</span>
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
                        validation.values.guestDetails[index]?.passportNo
                      }
                    />
                  </div>
                </div>
                  </>
                )}
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">Upload PAN</label>
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
                    <label className="text-label">PAN Number</label>
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
                      value={validation.values.guestDetails[index]?.panNo}
                    />
                    <ErrorComponentArray fieldName={'panNo'} key={'panNo'} index={index} errors={validation.errors.guestDetails} touched={validation.touched.guestDetails} />
                  </div>
                </div>

                <div className="divider divider-last"></div>
              </>
            );
          })}

        <div className="text-end toolbar d-flex justify-content-between toolbar-bottom p-2">
          <button
            type="button"
            className="btn btn-back sw-btn-prev me-1"
            onClick={() => moveToStep1()}
          >
            Prev
          </button>
          <button
            className="btn btn-primary sw-btn-next ms-1 btn-submit"
            type="submit"
            disabled={isLoadingImages}
          >
            Next
          </button>
        </div>
      </form>
    </section>
  );
};

export default Guestdetails;
