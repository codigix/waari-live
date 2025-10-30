import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import BackButton from "../../common/BackButton";

const Addguest = () => {
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const romesharing = [
    { value: "Adult single sharing", label: "Adult single sharing" },
    { value: "Adult double sharing", label: "Adult double sharing" },
    { value: "Adult triple sharing ", label: "Adult triple sharing " },
    {
      value: "Child with Mattress (5-11 yrs.)",
      label: "Child with Mattress (5-11 yrs.)",
    },
    {
      value: "Child without Mattress (5-11 yrs.)",
      label: "Child without Mattress (5-11 yrs.)",
    },
    { value: "Child (2-4 yrs.)", label: "Child (2-4 yrs.)" },
    { value: "Infant", label: "Infant" },
    { value: "Adult quad sharing ", label: "Adult quad sharing " },
  ];
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      namefamilyhead: "",
      guestid: "",
      contact: "",
      address: "",
      mail: "",
      dob: "",
      dom: "",
      romesharing: "",
      aadhar: "",
      uploadpassport: "",
      namefamilyhead1: "",
      guestid1: "",
      contact1: "",
      address1: "",
      mail1: "",
      dob1: "",
      dom1: "",
      romesharing1: "",
      aadhar1: "",
      uploadpassport1: "",
    },
    validationSchema: Yup.object({
      namefamilyhead: Yup.string().required("Enter the Name of Family Head"),
      guestid: Yup.string().required("Enter the Guest Id"),
      contact: Yup.string().required("Enter the Contact Number"),
      address: Yup.string().required("Enter the Address"),
      mail: Yup.string().required("Enter the mail Id"),
      dob: Yup.string().required("Enter Your Date of Birth"),
      dom: Yup.string().required("Enter Your Date of marriage"),
      romesharing: Yup.string().required("Select the Rooms Type"),
      aadhar: Yup.string().required("Upload your Aadhar card"),
      uploadpassport: Yup.string().required("Upload your passport"),
      namefamilyhead1: Yup.string().required("Enter the Name of Family Head"),
      contact1: Yup.string().required("Enter the Contact Number"),
      address1: Yup.string().required("Enter the Address"),
      mail1: Yup.string().required("Enter the mail Id"),
      dob1: Yup.string().required("Enter Your Date of Birth"),
      dom1: Yup.string().required("Enter Your Date of marriage"),
      romesharing1: Yup.string().required("Select the Rooms Type"),
      aadhar1: Yup.string().required("Upload your Aadhar card"),
      uploadpassport1: Yup.string().required("Upload your passport"),
    }),

    onSubmit: async (values) => {
      let data = {
        namefamilyhead: Yup.namefamilyhead,
        guestid: Yup.guestid,
        contact: Yup.contact,
        address: Yup.address,
        mail: Yup.mail,
        dob: Yup.dob,
        dom: Yup.dom,
        romesharing: Yup.romesharing,
        aadhar: Yup.aadhar,
        uploadpassport: Yup.uploadpassport,
        namefamilyhead1: Yup.namefamilyhead1,
        contact1: Yup.contact1,
        address1: Yup.address1,
        mail1: Yup.mail1,
        dob1: Yup.dob1,
        dom1: Yup.dom1,
        romesharing1: Yup.romesharing1,
        aadhar1: Yup.aadhar1,
        uploadpassport1: Yup.uploadpassport1,
      };
    },
  });
  useEffect(() => {
    const textarea = document.getElementById('resizableTextarea');
    const textarea1 = document.getElementById('resizableTextarea1');
    const adjustTextareaHeight = () => {
      textarea.style.height = 'auto'; // Reset height to auto to get the actual scroll height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to the scroll height
      textarea1.style.height = 'auto'; // Reset height to auto to get the actual scroll height
      textarea1.style.height = `${textarea1.scrollHeight}px`; // Set the height to the scroll height
    };

    textarea.addEventListener('input', adjustTextareaHeight);
    textarea1.addEventListener('input', adjustTextareaHeight);
    return () => {
      // Clean up the event listener when the component unmounts
      textarea.removeEventListener('input', adjustTextareaHeight);
      textarea1.removeEventListener('input', adjustTextareaHeight);
    };
  }, []);

  useEffect(() => {
    // While view farmer page is active, the yadi tab must also activated
    // console.log((window.location.href).split("/"))
    const pathArray = (window.location.href).split("/") 
    const path = pathArray[pathArray.length-1]
    // console.log(path)
    let element = document.getElementById("guest-list")
    // console.log(element)
    if (element) {
      element.classList.add("mm-active1") // Add the 'active' class to the element
    }
    return () => {
      if (element) {
        element.classList.remove("mm-active1") // remove the 'active' class to the element when change to another page
      }
    }
  }, [])
  return (
    <section>
      <div className="row">
        <div className="col-lg-12" style={{ paddingTop: '40px' }}>
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
                  <Link to="#">Guest Information</Link>
                </li>
                <li className="breadcrumb-item  ">
                  <Link to="/add-guest">Add Guest</Link>
                </li>
              </ol>
            </div>
            <form
              className="needs-validation"
              onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
                return false;
              }}
            >
              <div className="card-body">
                <h6 className="pb-2">Guest1(Family head) </h6>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">Name of Family Head</label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="namefamilyhead"
                      className="form-control"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.namefamilyhead}
                    />
                    {validation.touched.namefamilyhead &&
                    validation.errors.namefamilyhead ? (
                      <span className="error">
                        {validation.errors.namefamilyhead}
                      </span>
                    ) : null}
                  </div>
                  <div className="col-md-4 row">
                    <div className="col-md-3">
                      <label className="text-label">Guest Id</label>
                    </div>
                    <div className="col-md-8">
                      <input
                        type="text"
                        name="guestid"
                        className="form-control"
                       onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.guestid}
                      />
                      {validation.touched.guestid &&
                      validation.errors.guestid ? (
                        <span className="error">
                          {validation.errors.guestid}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">Gender<span className="error-star">*</span></label>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender"
                          value="male"
                          checked="checked"
                        />
                        <label className="form-check-label">Male</label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender"
                          value="female"
                        />
                        <label className="form-check-label">Female</label>
                      </div>
                      <div className="form-check disabled">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender"
                          value="others"
                          disabled=""
                        />
                        <label className="form-check-label">Others</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">Contact number</label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="tel"
                      name="contact"
                      className="form-control"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.contact}
                    />
                    {validation.touched.contact && validation.errors.contact ? (
                      <span className="error">{validation.errors.contact}</span>
                    ) : null}
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">Address</label>
                  </div>
                  <div className="col-md-6">
                    <textarea
                      type="text"
                      name="address"
                      className="textarea"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.address}
                      id="resizableTextarea"
                    />
                    {validation.touched.address && validation.errors.address ? (
                      <span className="error">{validation.errors.address}</span>
                    ) : null}
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">Mail Id</label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="mail"
                      name="mail"
                      className="form-control"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.mail}
                    />
                    {validation.touched.mail && validation.errors.mail ? (
                      <span className="error">{validation.errors.mail}</span>
                    ) : null}
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">Date of birth</label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="date"
                      name="dob"
                      className="form-control"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.dob}
                    />
                    {validation.touched.dob && validation.errors.dob ? (
                      <span className="error">{validation.errors.dob}</span>
                    ) : null}
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">Date of marriage</label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="date"
                      name="dom"
                      className="form-control"
                       onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.dom}
                    />
                    {validation.touched.dom && validation.errors.dom ? (
                      <span className="error">{validation.errors.dom}</span>
                    ) : null}
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">Room Sharing Type</label>
                  </div>
                  <div className="col-md-6">
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      isLoading={isLoading}
                      isClearable={isClearable}
                      isSearchable={isSearchable}
                      name="romesharing"
                      options={romesharing}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.romesharing}
                    />
                    {validation.touched.romesharing &&
                    validation.errors.romesharing ? (
                      <span className="error">
                        {validation.errors.romesharing}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">
                      Upload Aadhar Card<span className="text-danger">*</span>
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input type="file" name="aadhar" className="form-control" />
                    {validation.touched.aadhar && validation.errors.aadhar ? (
                      <span className="error">{validation.errors.aadhar}</span>
                    ) : null}
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">Upload Passport</label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="file"
                      name="uploadpassport"
                      className="form-control"
                       onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.uploadpassport}
                    />
                    {validation.touched.uploadpassport &&
                    validation.errors.uploadpassport ? (
                      <span className="error">
                        {validation.errors.uploadpassport}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="divider"></div>
                {/* Guest 2 */}
                <h6 className="pb-2">Guest 2</h6>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">Name of Family Head</label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="namefamilyhead1"
                      className="form-control"
                       onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.namefamilyhead1}
                    />
                    {validation.touched.namefamilyhead1 &&
                    validation.errors.namefamilyhead1 ? (
                      <span className="error">
                        {validation.errors.namefamilyhead1}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">Gender</label>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender1"
                          value="male1"
                          checked="checked"
                        />
                        <label className="form-check-label">Male</label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender1"
                          value="female1"
                        />
                        <label className="form-check-label">Female</label>
                      </div>
                      <div className="form-check disabled">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender1"
                          value="others1"
                          disabled=""
                        />
                        <label className="form-check-label">Others</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">Contact number</label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="tel"
                      name="contact1"
                      className="form-control"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.contact1}
                    />
                    {validation.touched.contact1 && validation.errors.contact1 ? (
                      <span className="error">{validation.errors.contact1}</span>
                    ) : null}
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">Address</label>
                  </div>
                  <div className="col-md-6">
                    <textarea
                      type="text"
                      name="address1"
                      className="textarea"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.address1}
                      id="resizableTextarea1"
                    />
                    {validation.touched.address && validation.errors.address1 ? (
                      <span className="error">{validation.errors.address1}</span>
                    ) : null}
                  </div>
                  <div className="col-sm-4">
                    <div className="form-check mb-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="check1"
                      />

                      <label className="form-check-label" htmlFor="check1">
                        Same as family head
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">Mail Id</label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="mail"
                      name="mail1"
                      className="form-control"
                       onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.mail1}
                    />
                    {validation.touched.mail1 && validation.errors.mail1 ? (
                      <span className="error">{validation.errors.mail1}</span>
                    ) : null}
                  </div>
                  <div className="col-sm-4">
                    <div className="form-check mb-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="check1"
                        value=""
                      />
                      <label className="form-check-label" htmlFor="check1">
                        Same as family head
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">Date of birth</label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="date"
                      name="dob1"
                      className="form-control"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.dob1}
                    />
                    {validation.touched.dob && validation.errors.dob1 ? (
                      <span className="error">{validation.errors.dob1}</span>
                    ) : null}
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">Date of marriage</label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="date"
                      name="dom1"
                      className="form-control"
                        onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.dom1}
                    />
                    {validation.touched.dom && validation.errors.dom1 ? (
                      <span className="error">{validation.errors.dom1}</span>
                    ) : null}
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">Room Sharing Type</label>
                  </div>
                  <div className="col-md-6">
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      isLoading={isLoading}
                      isClearable={isClearable}
                      isSearchable={isSearchable}
                      name="romesharing1"
                      options={romesharing}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.romesharing1}
                    />
                    {validation.touched.romesharing1 &&
                    validation.errors.romesharing1 ? (
                      <span className="error">
                        {validation.errors.romesharing1}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">
                      Upload Aadhar Card<span className="text-danger">*</span>
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="file"
                      name="aadhar1"
                      className="form-control"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.aadhar1}
                    />
                    {validation.touched.aadhar1 && validation.errors.aadhar1 ? (
                      <span className="error">{validation.errors.aadhar1}</span>
                    ) : null}
                  </div>
                </div>
                <div className="row mb-2 form-group">
                  <div className="col-md-2">
                    <label className="text-label">Upload Passport</label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="file"
                      name="uploadpassport1"
                      className="form-control"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.uploadpassport1}
                    />
                    {validation.touched.uploadpassport1 &&
                    validation.errors.uploadpassport1 ? (
                      <span className="error">
                        {validation.errors.uploadpassport1}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="mb-3 row">
                  <div className="col-lg-12 d-flex justify-content-end">
                    <button
                      type="submit"
                      className="btn btn-submit btn-primary"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Addguest;
