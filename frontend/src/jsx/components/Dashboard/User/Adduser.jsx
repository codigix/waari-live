import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { get, post } from "../../../../services/apiServices";
import "react-phone-number-input/style.css";
import ErrorMessageComponent from "../FormErrorComponent/ErrorMessageComponent";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import { Switch } from "@mui/material";
import axios from "axios";
import { NoImage } from "../../../utils/assetsPaths";
import { scrollIntoViewHelper } from "../../../utils/scrollIntoViewHelper";
import BackButton from "../../common/BackButton";

const url = import.meta.env.VITE_WAARI_BASEURL;

// const validationSchema = Yup.object().shape({
// 	userName: Yup.string().required("Name is required"),
// 	email: Yup.string().email("Invalid email").required("Please enter the email"),
// 	password: Yup.string()
// 		.min(6, "Length of the password should be atleast 6 digits")
// 		.matches(
// 			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]+$/,
// 			"Password must contain at least 1 lowercase, 1 uppercase, 1 digit, and 1 special character"
// 		)
// 		.required("Please enter the Password"),
// 	confirmPassword: Yup.string().oneOf(
// 		[Yup.ref("password"), null],
// 		"Password and Confirm Password must match"
// 	),
// 	contact: Yup.string()
// 		.matches(/^\d+$/, "Phone number must be numeric")
// 		.min(10, "Contact must be at least 10 digits long")
// 		.required("Please enter the Phone Number")
// 		.max(10, "Contact must be at at most 10 digits long")
// 		.required("Phone is required"),
// 	roleId: Yup.object().optional(),
// 	positionId: Yup.object().required("Position is required"),
// 	sectorId: Yup.object().optional(),
// 	// .when("positionId", {
// 	// 	is: (position) => position?.value === 2, // Check if positionId has a value of 2
// 	// 	then: Yup.object().required("Sector is required when Position is 2"),
// 	// 	otherwise: Yup.object().nullable(), // Optional when positionId is not 2
// 	// }),
// 	departmentId: Yup.object().required("Department is required"),
// 	address: Yup.string().required("Address is required"),
// 	status: Yup.boolean().required("Status is required"),
// 	establishmentName: Yup.string().required("Establishment Name is required"),
// 	establishmentTypeId: Yup.object().required("Establishment Type is required"),
// 	adharNo: Yup.string()
// 		.matches(
// 			/(^[0-9]{4}[0-9]{4}[0-9]{4}$)|(^[0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|(^[0-9]{4}-[0-9]{4}-[0-9]{4}$)/,
// 			"Invalid Aadhaar number format. Please enter in the format XXXX XXXX XXXX"
// 		)
// 		.required("Aadhaar number is required"),
// 	adharCard: Yup.string().required("Aadhaar Card is required"),
// 	panNo: Yup.string()
// 		.matches(
// 			/^[A-Z]{5}[0-9]{4}[A-Z]$/,
// 			"Invalid PAN number format. Please enter in the format ABCDE1234F"
// 		)
// 		.required("PAN number is required"),
// 	pan: Yup.string().required("Pan Card is required"),
// 	gender: Yup.string().required("Gender is required"),
// 	city: Yup.string().required("City is required"),
// 	pincode: Yup.string()
// 		.required("Pincode is required")
// 		.matches(/^[1-9][0-9]{5}$/, "Pincode must be a 6-digit number"),
// 	state: Yup.string().required("State is required"),
// 	alternatePhone: Yup.string()
// 		.matches(/^\d+$/, "Alternative Phone number must be numeric")
// 		.min(10, "Contact must be at least 10 digits long")
// 		.max(10, "Contact must be at at most 10 digits long"),
// 	shopAct: Yup.string().required("Shop Act is required"),
// 	accName: Yup.string()
// 		.required("Account name is required")
// 		.matches(/^[a-zA-Z\s]+$/, "Invalid Account name"),
// 	accNo: Yup.string()
// 		.required("Account number is required")
// 		.matches(/^\d{9,18}$/, "Account number must be 9 to 18 digits"),
// 	bankName: Yup.string()
// 		.required("Bank name is required")
// 		.matches(/^[a-zA-Z\s]+$/, "Invalid bank name"),
// 	branch: Yup.string()
// 		.required("Branch is required")
// 		.matches(/^[a-zA-Z\s]+$/, "Invalid branch name"),
// 	ifsc: Yup.string()
// 		.required("IFSC code is required")
// 		.matches(/^[A-Za-z]{4}\d{7}$/, "Invalid IFSC code. Format: ABCD0123456"),
// 	cheque: Yup.string().required("cheque is required"),
// 	logo: Yup.string().required("Logo is required"),
// });

const validationSchema = Yup.object().shape({
  userName: Yup.string().optional(),
  email: Yup.string().email().optional(),
  password: Yup.string().optional(),
  confirmPassword: Yup.string().optional(),
  contact: Yup.string().optional(),
  roleId: Yup.object().optional(),
  positionId: Yup.object().optional(),
  sectorId: Yup.object().optional(),
  departmentId: Yup.object().optional(),
  address: Yup.string().optional(),
  status: Yup.boolean().optional(),
  establishmentName: Yup.string().optional(),
  establishmentTypeId: Yup.object().optional(),
  adharNo: Yup.string().optional(),
  adharCard: Yup.string().optional(),
  panNo: Yup.string().optional(),
  pan: Yup.string().optional(),
  gender: Yup.string().optional(),
  city: Yup.string().optional(),
  pincode: Yup.string().optional(),
  state: Yup.string().optional(),
  alternatePhone: Yup.string().optional(),
  shopAct: Yup.string().optional(),
  accName: Yup.string().optional(),
  accNo: Yup.string().optional(),
  bankName: Yup.string().optional(),
  branch: Yup.string().optional(),
  ifsc: Yup.string().optional(),
  cheque: Yup.string().optional(),
  logo: Yup.string().optional(),
});

const establishmentOption = [
  { value: "1", label: "Proprietorship " },
  { value: "2", label: " Partnership" },
  { value: "3", label: "LLP" },
  { value: "4", label: "Pvt. Ltd." },
];

const Adduser = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [roleOptions, setRoleOptions] = useState([]);
  const [positionOptions, setPositionOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [sectorOptions, setSectorOptions] = useState([]);

  const fetchDropdownOptions = async (endpoint, mapFields) => {
    try {
      const response = await get(endpoint);
      return response.data?.data?.map((item) => ({
        value: item[mapFields.value],
        label: item[mapFields.label],
      }));
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  useEffect(() => {
    const fetchOptions = async () => {
      const roleOptions = await fetchDropdownOptions(`/dropdown-roles`, {
        value: "roleId",
        label: "roleName",
      });
      const positionOptions = await fetchDropdownOptions(
        `/dropdown-positions`,
        { value: "positionId", label: "positionName" }
      );
      const departmentOptions = await fetchDropdownOptions(
        `/dropdown-department`,
        { value: "departmentId", label: "departmentName" }
      );

      setRoleOptions(roleOptions);
      setPositionOptions(positionOptions);
      setDepartmentOptions(departmentOptions);
    };

    fetchOptions();
  }, []);

  const getSectorOptions = async () => {
    try {
      const response = await get(`/dropdown-sector`);
      const mappedData = response.data?.data?.map((item) => ({
        value: item.sectorId,
        label: item.sectorName,
      }));
      setSectorOptions(mappedData);
    } catch (error) {
      console.log(error);
    }
  };

  // this hook is for form validation
  const formik = useFormik({
    initialValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      contact: "",
      roleId: "",
      positionId: "",
      departmentId: "",
      sectorId: "",
      address: "",
      status: true,
      establishmentName: "",
      establishmentTypeId: "",
      adharNo: "",
      adharCard: "",
      panNo: "",
      pan: "",
      gender: "",
      city: "",
      pincode: "",
      state: "",
      alternatePhone: "",
      shopAct: "",
      accName: "",
      accNo: "",
      bankName: "",
      branch: "",
      ifsc: "",
      cheque: "",
      logo: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);

        // Ensure firstName and lastName always have a value
        const nameParts = values.userName.trim().split(" ");
        const firstName = nameParts[0] || "NA"; // default to "NA"
        const lastName = nameParts.slice(1).join(" ") || "NA"; // default to "NA"

        const data = {
          firstName,
          lastName,

          userName: values.userName || "",
          email: values.email || "",
          password: values.password || "",
          contact: values.contact || "",

          roleId: values.roleId?.value || null,
          departmentId: values.departmentId?.value || null,
          positionId: values.positionId?.value || null,
          sectorId: values.sectorId?.value || null,
          address: values.address || "",
          status: values.status ? 1 : 0,
          establishmentName: values.establishmentName || "",
          establishmentTypeId: values.establishmentTypeId?.value || null,
          adharNo: values.adharNo ? Number(values.adharNo) : null,
          adharCard: values.adharCard || "",
          panNo: values.panNo || "",
          pan: values.pan || "",
          city: values.city || "",
          pincode: values.pincode ? Number(values.pincode) : null,
          state: values.state || "",
          alternatePhone: values.alternatePhone || "",
          shopAct: values.shopAct || "",
          accName: values.accName || "",
          accNo: values.accNo || "",
          bankName: values.bankName || "",
          branch: values.branch || "",
          ifsc: values.ifsc || "",
          cheque: values.cheque || "",
          logo: values.logo || "",
          gender: values.gender || "",
        };

        const result = await post("add-user", data);
        toast.success(result?.data?.message);
        navigate("/users-list");
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    },
  });

  console.log("validation", formik.values);

  useEffect(() => {
    let element = document.getElementById("users-list");
    if (element) {
      element.classList.add("mm-active1"); // Add the 'active' className to the element
    }
    return () => {
      if (element) {
        element.classList.remove("mm-active1"); // remove the 'active' className to the element when change to another page
      }
    };
  }, []);

  useEffect(() => {
    const textarea = document.getElementById("resizableTextarea");

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

  const getFileLink = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const responseData = await axios.post(
        `
          ${url}/image-upload`,
        formData
      );
      toast.success("File uploaded successfully");
      return responseData?.data?.image_url;
    } catch (error) {
      toast.error(error?.response?.data?.message?.toString());
      console.log(error);
    }
  };

  useEffect(() => {
    const textarea = document.getElementById("resizableTextarea");

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

  useEffect(() => {
    if (!formik.isSubmitting) {
      if (Object.keys(formik.errors).length) {
        scrollIntoViewHelper(formik.errors);
      }
    }
  }, [formik.isSubmitting]);

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
                  <Link to="/users-list">users Information</Link>
                </li>
                <li className="breadcrumb-item  ">
                  <Link to="/add-user">Add Users</Link>
                </li>
              </ol>
            </div>
          </div>
          {/* form for above filed */}
          <div className="card">
            <div className="card-body">
              <div className="card-header mb-2 p-0">
                <div className="card-title h5">Add Users</div>
              </div>

              <form onSubmit={formik.handleSubmit} className="needs-validation">
                <div className="row">
                  <div className=" col-xl-4 col-lg-6 col-md-6  col-12">
                    <div className="mb-2">
                      <label>
                        User Name<span className="error-star">*</span>
                      </label>
                      <input
                        id="userName"
                        name="userName"
                        type="text"
                        className="form-control"
                        onChange={formik.handleChange}
                        value={formik.values.userName}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"userName"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>

                  <div className="col-xl-4 col-lg-6 col-md-6  col-12 ">
                    <div className="mb-2">
                      <label>
                        Email <span className="error-star">*</span>{" "}
                      </label>
                      <input
                        type="text"
                        id="email"
                        name="email"
                        min={"0"}
                        onWheel={(e) => e.preventDefault()}
                        className="form-control"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"email"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-6  col-12">
                    <div className="mb-2">
                      <label>
                        Password<span className="error-star">*</span>
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="text"
                        className="form-control"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"password"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>

                  <div className="col-xl-4 col-lg-6 col-md-6  col-12 ">
                    <div className="mb-2">
                      <label>
                        Confirm Password<span className="error-star">*</span>
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="text"
                        className="form-control"
                        onChange={formik.handleChange}
                        value={formik.values.confirmPassword}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"confirmPassword"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>

                  <div className="col-xl-4 col-lg-6 col-md-6  col-12">
                    <div className="mb-2">
                      <label>
                        Phone<span className="error-star">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="contact"
                        name="contact"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        min={10}
                        max={10}
                        value={formik.values.contact}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"contact"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>

                  <div className="col-xl-4 col-lg-6 col-md-6  col-12">
                    <div className="mb-2">
                      <label>Alternate Phone</label>
                      <input
                        id="alternatePhone"
                        name="alternatePhone"
                        type="text"
                        className="form-control"
                        onChange={formik.handleChange}
                        value={formik.values.alternatePhone}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"alternatePhone"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-6  col-12">
                    <div className="row mb-2 form-group">
                      <div className="col-md-12">
                        <label className="text-label">
                          Gender<span className="error-star">*</span>
                        </label>
                      </div>
                      <div className="col-md-12">
                        <div className="d-flex">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              id="male"
                              type="radio"
                              name="gender"
                              value="male"
                              checked={formik.values.gender == "male"}
                              onChange={formik.handleChange}
                            />
                            <label className="form-check-label" htmlFor="male">
                              Male
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              id="female"
                              type="radio"
                              name="gender"
                              value="female"
                              checked={formik.values.gender == "female"}
                              onChange={formik.handleChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="female"
                            >
                              Female
                            </label>
                          </div>
                          <div className="form-check disabled">
                            <input
                              className="form-check-input"
                              id="others"
                              type="radio"
                              name="gender"
                              value="others"
                              checked={formik.values.gender == "others"}
                              onChange={formik.handleChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="others"
                            >
                              others
                            </label>
                          </div>
                        </div>
                        <ErrorMessageComponent
                          errors={formik.errors}
                          fieldName={"gender"}
                          touched={formik.touched}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-6  col-12">
                    <div className="mb-2">
                      <label>
                        Role<span className="error-star">*</span>
                      </label>
                      <Select
                        id="roleId"
                        name="roleId"
                        className="basic-single select-role"
                        classNamePrefix="select"
                        options={roleOptions}
                        onChange={(event) =>
                          formik.setFieldValue("roleId", event)
                        }
                        value={formik.values.roleId}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"roleId"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>

                  <div className="col-xl-4 col-lg-6 col-md-6  col-12">
                    <div className="mb-2">
                      <label>
                        Position<span className="error-star">*</span>
                      </label>
                      <Select
                        id="positionId"
                        name="positionId"
                        className="basic-single absolute z-10"
                        classNamePrefix="select"
                        options={positionOptions}
                        onChange={(event) => {
                          formik.setFieldValue("positionId", event);
                          event.value == 2 ? getSectorOptions() : "";
                        }}
                        value={formik.values.positionId}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"positionId"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>

                  <div className="col-xl-4 col-lg-6 col-md-6  col-12">
                    <div className="mb-2">
                      <label>
                        Department<span className="error-star">*</span>
                      </label>
                      <Select
                        id="departmentId"
                        name="departmentId"
                        className="basic-single"
                        classNamePrefix="select"
                        options={departmentOptions}
                        onChange={(event) =>
                          formik.setFieldValue("departmentId", event)
                        }
                        value={formik.values.departmentId}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"departmentId"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>

                  <div className="col-xl-4 col-lg-6 col-md-6  col-12">
                    <div className="mb-2">
                      <label>Status</label>
                      <div>
                        <Switch
                          name="status"
                          checked={formik.values.status}
                          onChange={(event) =>
                            formik.setFieldValue("status", event.target.checked)
                          }
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      </div>
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"status"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>

                  <div className="col-xl-4 col-lg-6 col-md-6  col-12">
                    <div className="mb-2">
                      <label>
                        Establishment Name<span className="error-star">*</span>
                      </label>
                      <input
                        id="establishmentName"
                        name="establishmentName"
                        type="text"
                        className="form-control"
                        onChange={formik.handleChange}
                        value={formik.values.establishmentName}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"establishmentName"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>

                  <div className="col-xl-4 col-lg-6 col-md-6  col-12">
                    <div className="mb-2">
                      <label>
                        Establishment Type<span className="error-star">*</span>
                      </label>
                      <Select
                        id="establishmentTypeId"
                        name="establishmentTypeId"
                        className="basic-single"
                        classNamePrefix="select"
                        options={establishmentOption}
                        onChange={(event) =>
                          formik.setFieldValue("establishmentTypeId", event)
                        }
                        value={formik.values.establishmentTypeId}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"establishmentTypeId"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>

                  <div className="col-xl-4 col-lg-6 col-md-6  col-12">
                    <div className="mb-2">
                      <label>
                        Address<span className="error-star">*</span>
                      </label>
                      <textarea
                        className="textarea"
                        id="resizableTextarea"
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      ></textarea>
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"address"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-6  col-12">
                    <div className="mb-2">
                      <label>
                        City<span className="error-star">*</span>
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        className="form-control"
                        onChange={formik.handleChange}
                        value={formik.values.city}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"city"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>

                  <div className="col-xl-4 col-lg-6 col-md-6  col-12">
                    <div className="mb-2">
                      <label>
                        Pin Code<span className="error-star">*</span>
                      </label>
                      <input
                        id="pincode"
                        name="pincode"
                        className="form-control"
                        onChange={formik.handleChange}
                        value={formik.values.pincode.toString()}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"pincode"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>

                  <div className="col-xl-4 col-lg-6 col-md-6  col-12">
                    <div className="mb-2">
                      <label>
                        State<span className="error-star">*</span>
                      </label>
                      <input
                        id="state"
                        name="state"
                        type="text"
                        className="form-control"
                        onChange={formik.handleChange}
                        value={formik.values.state}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"state"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>

                  {formik.values.positionId?.value == 2 ? (
                    <div className="col-md-4 col-sm-6 col-lg-3 col-12">
                      <div className="mb-2">
                        <label>
                          Sector<span className="error-star">*</span>
                        </label>
                        <Select
                          id="sectorId"
                          name="sectorId"
                          className="basic-single select-role"
                          classNamePrefix="select"
                          options={sectorOptions}
                          onChange={(event) =>
                            formik.setFieldValue("sectorId", event)
                          }
                          value={formik.values.sectorId}
                        />
                        <ErrorMessageComponent
                          errors={formik.errors}
                          fieldName={"sectorId"}
                          touched={formik.touched}
                        />
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  <div className="col-xl-4 col-lg-6 col-md-6  col-12">
                    <div className="mb-2">
                      <label>
                        Aadhaar No<span className="error-star">*</span>
                      </label>
                      <input
                        id="adharNo"
                        name="adharNo"
                        type="text"
                        className="form-control"
                        onChange={formik.handleChange}
                        value={formik.values.adharNo}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"adharNo"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>

                  <div className="col-xl-4 col-lg-6 col-md-6  col-12">
                    <div className="mb-2">
                      <label>
                        Pan No<span className="error-star">*</span>
                      </label>
                      <input
                        id="panNo"
                        name="panNo"
                        type="text"
                        className="form-control"
                        onChange={formik.handleChange}
                        value={formik.values.panNo}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"panNo"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>

                  <div className="col-md-12 col-sm-12 col-xl-4 col-12">
                    <label className="text-label">
                      Upload Aadhaar Card<span className="error-star">*</span>
                    </label>
                    <div className="col-md-12">
                      <div className="Neon Neon-theme-dragdropbox">
                        <input
                          className="file_upload"
                          name={`adharCard`}
                          accept="image/*"
                          id="filer_input2"
                          type="file"
                          draggable
                          onChange={async (e) => {
                            const selectedFile = e.target.files[0];
                            const fileLink = await getFileLink(selectedFile);
                            formik.setFieldValue(`adharCard`, fileLink);
                          }}
                        />
                        <div className="Neon-input-dragDrop">
                          {formik.values.adharCard?.length == 0 ? (
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
                              src={formik.values.adharCard || NoImage}
                              alt="frontImage"
                              width="100%"
                              className="neon-img"
                            />
                          )}
                        </div>
                      </div>
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"adharCard"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>

                  <div className="col-md-12  col-xl-4 col-12">
                    <label className="text-label">
                      Upload Pan Card<span className="error-star">*</span>
                    </label>
                    <div className="col-md-12">
                      <div className="Neon Neon-theme-dragdropbox">
                        <input
                          className="file_upload"
                          name={`pan`}
                          accept="image/*"
                          id="filer_input2"
                          type="file"
                          draggable
                          onChange={async (e) => {
                            const selectedFile = e.target.files[0];
                            const fileLink = await getFileLink(selectedFile);
                            formik.setFieldValue(`pan`, fileLink);
                          }}
                        />
                        <div className="Neon-input-dragDrop">
                          {formik.values.pan?.length == 0 ? (
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
                              src={formik.values.pan || NoImage}
                              alt="frontImage"
                              width="100%"
                              className="neon-img"
                            />
                          )}
                        </div>
                      </div>
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"pan"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>

                  <div className="col-xl-4 col-lg-6 col-md-6  col-12">
                    <div className="mb-2">
                      <label>
                        A/C Name<span className="error-star">*</span>
                      </label>
                      <input
                        id="accName"
                        name="accName"
                        type="text"
                        className="form-control"
                        onChange={formik.handleChange}
                        value={formik.values.accName}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"accName"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>

                  <div className="col-xl-4 col-lg-6 col-md-6  col-12">
                    <div className="mb-2">
                      <label>
                        A/C No<span className="error-star">*</span>
                      </label>
                      <input
                        id="accNo"
                        name="accNo"
                        type="text"
                        className="form-control"
                        onChange={formik.handleChange}
                        value={formik.values.accNo}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"accNo"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>

                  <div className="col-xl-4 col-lg-6 col-md-6  col-12">
                    <div className="mb-2">
                      <label>
                        Bank Name<span className="error-star">*</span>
                      </label>
                      <input
                        id="bankName"
                        name="bankName"
                        type="text"
                        className="form-control"
                        onChange={formik.handleChange}
                        value={formik.values.bankName}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"bankName"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>

                  <div className="col-xl-4 col-lg-6 col-md-6  col-12">
                    <div className="mb-2">
                      <label>
                        Branch<span className="error-star">*</span>
                      </label>
                      <input
                        id="branch"
                        name="branch"
                        type="text"
                        className="form-control"
                        onChange={formik.handleChange}
                        value={formik.values.branch}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"branch"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>

                  <div className="col-xl-4 col-lg-6 col-md-6  col-12">
                    <div className="mb-2">
                      <label>
                        IFSC<span className="error-star">*</span>
                      </label>
                      <input
                        id="ifsc"
                        name="ifsc"
                        type="text"
                        className="form-control"
                        onChange={formik.handleChange}
                        value={formik.values.ifsc}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"ifsc"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>

                  <div className="col-xl-4  col-12">
                    <label className="text-label">
                      Upload Shop Act<span className="error-star">*</span>
                    </label>
                    <div className="col-md-12">
                      <div className="Neon Neon-theme-dragdropbox">
                        <input
                          className="file_upload"
                          name={`shopAct`}
                          accept="image/*"
                          id="filer_input2"
                          type="file"
                          draggable
                          onChange={async (e) => {
                            const selectedFile = e.target.files[0];
                            const fileLink = await getFileLink(selectedFile);
                            formik.setFieldValue(`shopAct`, fileLink);
                          }}
                        />
                        <div className="Neon-input-dragDrop">
                          {formik.values.shopAct?.length == 0 ? (
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
                              src={formik.values.shopAct || NoImage}
                              alt="frontImage"
                              width="100%"
                              className="neon-img"
                            />
                          )}
                        </div>
                      </div>
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"shopAct"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>

                  <div className="col-xl-4  col-12">
                    <label className="text-label">
                      Upload Cheque<span className="error-star">*</span>
                    </label>
                    <div className="col-md-12">
                      <div className="Neon Neon-theme-dragdropbox">
                        <input
                          className="file_upload"
                          name={`cheque`}
                          accept="image/*"
                          id="filer_input2"
                          type="file"
                          draggable
                          onChange={async (e) => {
                            const selectedFile = e.target.files[0];
                            const fileLink = await getFileLink(selectedFile);
                            formik.setFieldValue(`cheque`, fileLink);
                          }}
                        />
                        <div className="Neon-input-dragDrop">
                          {formik.values.cheque?.length == 0 ? (
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
                              src={formik.values.cheque || NoImage}
                              alt="frontImage"
                              width="100%"
                              className="neon-img"
                            />
                          )}
                        </div>
                      </div>
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"cheque"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>

                  <div className="col-xl-4 col-12">
                    <label className="text-label">
                      Upload Logo<span className="error-star">*</span>
                    </label>
                    <div className="col-md-12">
                      <div className="Neon Neon-theme-dragdropbox">
                        <input
                          className="file_upload"
                          name={`logo`}
                          accept="image/*"
                          id="filer_input2"
                          type="file"
                          draggable
                          onChange={async (e) => {
                            const selectedFile = e.target.files[0];
                            const fileLink = await getFileLink(selectedFile);
                            formik.setFieldValue(`logo`, fileLink);
                          }}
                        />
                        <div className="Neon-input-dragDrop">
                          {formik.values.logo?.length == 0 ? (
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
                              src={formik.values.logo || NoImage}
                              alt="frontImage"
                              width="100%"
                              className="neon-img"
                            />
                          )}
                        </div>
                      </div>
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"logo"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 d-flex justify-content-between mt-3">
                  <Link to="/users-list" type="submit" className="btn btn-back">
                    Back
                  </Link>
                  <div className="d-flex">
                    <button
                      type="submit"
                      className="btn btn-submit btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Adduser;
