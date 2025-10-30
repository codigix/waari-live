import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { get, post } from "../../../../services/apiServices";
import "react-phone-number-input/style.css";
import ErrorMessageComponent from "../FormErrorComponent/ErrorMessageComponent";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { NoImage } from "../../../utils/assetsPaths";
import { scrollIntoViewHelper } from "../../../utils/scrollIntoViewHelper";
import BackButton from "../../common/BackButton";

const url = import.meta.env.VITE_WAARI_BASEURL;

const autoResize = (textarea) => {
    textarea.style.height = "auto"; // Reset height
    textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height
};

const validationSchema = Yup.object().shape({
    cityName: Yup.string()
        .trim()
        .required("City Name is required")
        .min(2, "City Name must be at least 2 characters long")
        .max(30, "City Name cannot exceed 30 characters"), // Reduced max limit
    address: Yup.string()
        .trim()
        .required("Address is required")
        .min(5, "Address must be at least 5 characters long")
        .max(200, "Address cannot exceed 200 characters"),
    officeTiming: Yup.string()
        .trim()
        .required("Office Timing is required")
        .min(5, "Office Timing must be at least 5 characters long")
        .max(100, "Office Timing cannot exceed 100 characters"), // Added min and max
    contactNo: Yup.string()
        .trim()
        .required("Contact Number is required")
        .matches(
            /^[6-9]\d{9}$/,
            "Contact Number must be a valid 10-digit Indian number starting with 6-9"
        ), // Validates Indian phone numbers
    email: Yup.string()
        .trim()
        .required("Email is required")
        .email("Invalid email address"),
})
const AddSalesOffice = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // this hook is for form validation
    const formik = useFormik({
        initialValues: {
            cityName: "",
            address: "",
            officeTiming: "",
            contactNo: "",
            email: "",

        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
            
                const result = await post(`add-office-details`, values);
                toast.success(result?.data?.message);
                navigate("/sales-offices-list");
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.log(error);
            }
        },
    });

    useEffect(() => {
        let element = document.getElementById("sales-offices-list");
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
        if (!formik.isSubmitting) {
            if (Object.keys(formik.errors).length) {
                scrollIntoViewHelper(formik.errors);
            }
        }
    }, [formik.isSubmitting]);


    return (
        <>
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
                                    <Link to="/sales-offices-list">Sales Office</Link>
                                </li>
                                <li className="breadcrumb-item  ">
                                    <Link to="javascript:void(0)">Add Sales Office</Link>
                                </li>
                            </ol>
                        </div>
                    </div>

                    
                    {/* form for above filed */}
                    <div className="card">
                        <div className="card-body">
                            <div className="card-header mb-2 p-0">
                                <div className="card-title h5">Add Sales Office</div>
                            </div>

                            <form onSubmit={formik.handleSubmit} className="needs-validation">
                                <div className="row">

                                    <div className="col-md-6 col-lg-4 col-sm-6 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Office City Location Name<span className="error-star">*</span>
                                            </label>
                                            <input
                                                id="cityName"
                                                name="cityName"
                                                type="text"
                                                className="form-control"
                                                onChange={formik.handleChange}
                                                value={formik.values.cityName}
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"cityName"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-6 col-lg-4 col-sm-6 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Address<span className="error-star">*</span>
                                            </label>
                                            <textarea
                                                id="address"
                                                name="address"
                                                type="text"
                                                className="form-control"
                                                value={formik.values.address}
                                                onChange={formik.handleChange}
                                                onInput={(e) => autoResize(e.target)}
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"address"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-6 col-lg-4 col-sm-6 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Office Timing<span className="error-star">*</span>
                                            </label>
                                            <input
                                                id="contactNo"
                                                name="officeTiming"
                                                type="text"
                                                className="form-control"
                                                onChange={formik.handleChange}
                                                value={formik.values.officeTiming}
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"officeTiming"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-4 col-sm-6 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Contact<span className="error-star">*</span>
                                            </label>
                                            <input
                                                id="contactNo"
                                                name="contactNo"
                                                type="number"
                                                className="form-control"
                                                onChange={formik.handleChange}
                                                value={formik.values.contactNo}
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"contactNo"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6 col-lg-4 col-sm-6 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Email<span className="error-star">*</span>
                                            </label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="text"
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

                               
                                </div>

                                <div className="col-lg-12 d-flex justify-content-between mt-3">
                                    <Link
                                        to="/sales-offices-list"
                                        type="button"
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
export default AddSalesOffice;
