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
import Rating from "@mui/material/Rating";
import { getImageSize } from "../../../utils";
import BackButton from "../../common/BackButton";

const url = import.meta.env.VITE_WAARI_BASEURL;

const tourTypeOptions = [
    {
        value: 1,
        label: "GROUP Tour",
    },
    {
        value: 0,
        label: "TAILOR Tour",
    },
];

const validationSchema = Yup.object().shape({
    tourCode: Yup.string()
        .required("Tour code is required")
        .matches(/^[a-zA-Z0-9]+$/, "Tour code must be alphanumeric"),

    // imageUrl: Yup.string()
    //     .required("Image URL is required")
    //     .url("Invalid URL format for the image"),
    imageUrl: Yup.string()
    .nullable()              // allows null
    .notRequired()           // field is optional
    .url("Invalid URL format for the image"),

    title: Yup.string()
        .required("Title is required")
        .max(100, "Title should be at most 100 characters"),

    rating: Yup.number()
        .required("Rating is required")
        .min(1, "Rating must be at least 1")
        .max(5, "Rating must be at most 5"),

    content: Yup.string()
        .required("Content is required")
        .max(500, "Content should be at most 500 characters"),

    customerName: Yup.string()
        .min(3, "Customer name must be at least 3 characters")
        .max(30, "Customer name cannot be longer than 30 characters")
        .required("Customer name is required")
        .matches(/^[a-zA-Z\s]+$/, "Customer name should contain only letters and spaces"),
    type: Yup.object().required("Tour type is required").nullable(),
});

const AddReview = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);

    // this hook is for form validation
    const formik = useFormik({
        initialValues: {
            tourCode: "",
            imageUrl: "",
            title: "",
            rating: 1,
            content: "",
            customerName: "",
            type: null,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
                const data = {
                    tourCode: values.tourCode,
                    // imageUrl: values.imageUrl,
                    ...(values.imageUrl && { imageUrl: values.imageUrl }),
                    title: values.title,
                    rating: values.rating,
                    content: values.content,
                    customerName: values.customerName,
                    type: values.type.value,
                };
                const result = await post(`${import.meta.env.VITE_WAARI_BASEURL}/add-review`, data);
                toast.success(result?.data?.message);
                navigate("/reviews-list");
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.log(error);
            }
        },
    });

    useEffect(() => {
        let element = document.getElementById("reviews-list");
        if (element) {
            element.classList.add("mm-active1"); // Add the 'active' className to the element
        }
        return () => {
            if (element) {
                element.classList.remove("mm-active1"); // remove the 'active' className to the element when change to another page
            }
        };
    }, []);

    const requiredSizeForBgImage = {
        width: 600,
        height: 450,
    };

    const isValidImageSize = (size) => {
        const { width, height } = size;

        // return width === requiredSizeForBgImage.width && height === requiredSizeForBgImage.height;
        return true;
    };

    const getFileLink = async (file) => {
        try {
            const formData = new FormData();
            formData.append("image", file);

            // Perform size validation here
            const imageSize = await getImageSize(file);
            if (!isValidImageSize(imageSize)) {
                toast.error("Invalid image size. Please upload an image with given dimensions");
                return;
            }

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
                <div className="col-lg-12" style={{ paddingTop: '40px' }} >
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
                                    <Link to="/reviews-list">Reviews Information</Link>
                                </li>
                                <li className="breadcrumb-item  ">
                                    <Link to="/add-review">Add Reviews</Link>
                                </li>
                            </ol>
                        </div>
                    </div>
                    {/* form for above filed */}
                    <div className="card">
                        <div className="card-body">
                            <div className="card-header mb-2 p-0">
                                <div className="card-title h5">Add Reviews</div>
                            </div>

                            <form onSubmit={formik.handleSubmit} className="needs-validation">
                                <div className="row">
                                    <div className="col-md-6 col-lg-4 col-sm-6 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Customer Name<span className="error-star">*</span>
                                            </label>
                                            <input
                                                id="customerName"
                                                name="customerName"
                                                type="text"
                                                className="form-control"
                                                onChange={formik.handleChange}
                                                value={formik.values.customerName}
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"customerName"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6 col-lg-4 col-sm-6 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Tour Type<span className="error-star">*</span>
                                            </label>
                                            <Select
                                                id="type"
                                                name="type"
                                                className="basic-single select-role"
                                                classNamePrefix="select"
                                                options={tourTypeOptions}
                                                onChange={(event) =>
                                                    formik.setFieldValue("type", event)
                                                }
                                                value={formik.values.type}
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"type"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6 col-lg-4 col-sm-6 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Tour Code<span className="error-star">*</span>
                                            </label>
                                            <input
                                                id="tourCode"
                                                name="tourCode"
                                                type="text"
                                                className="form-control"
                                                onChange={formik.handleChange}
                                                value={formik.values.tourCode}
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"tourCode"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6 col-lg-6 col-sm-6 col-12">
                                        <label className="text-label">
                                            Upload Image (600 * 450px)
                                            <span className="error-star">*</span>
                                        </label>
                                        <div className="col-md-12">
                                            <div className="Neon Neon-theme-dragdropbox">
                                                <input
                                                    className="file_upload"
                                                    name={`imageUrl`}
                                                    accept="image/*"
                                                    id="filer_input2"
                                                    type="file"
                                                    draggable
                                                    onChange={async (e) => {
                                                        const selectedFile = e.target.files[0];
                                                        const fileLink = await getFileLink(
                                                            selectedFile
                                                        );
                                                        formik.setFieldValue(`imageUrl`, fileLink);
                                                    }}
                                                />
                                                <div className="Neon-input-dragDrop">
                                                    {formik.values.imageUrl?.length == 0 ? (
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
                                                            src={formik.values.imageUrl || NoImage}
                                                            alt="frontImage"
                                                            width="100%"
                                                            className="neon-img"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"imageUrl"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6 col-lg-6 col-sm-6 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Title<span className="error-star">*</span>
                                            </label>
                                            <input
                                                id="title"
                                                name="title"
                                                type="text"
                                                className="form-control"
                                                onChange={formik.handleChange}
                                                value={formik.values.title}
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"title"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>

                                    <div className=" col-12">
                                        <div className="mb-2">
                                            <label>
                                                Write Review<span className="error-star">*</span>
                                            </label>
                                            <textarea
                                                className="textarea"
                                                id="resizableTextarea"
                                                name="content"
                                                value={formik.values.content}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            ></textarea>
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"content"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4 col-lg-3 col-sm-6 col-12">
                                    <div className="mb-2">
                                        <label>
                                            Rating<span className="error-star">*</span>
                                        </label>

                                        <Rating
                                            value={formik.values.rating}
                                            precision={0.5}
                                            onChange={(event, newValue) => {
                                                formik.setFieldValue("rating", newValue);
                                            }}
                                        />

                                        <ErrorMessageComponent
                                            errors={formik.errors}
                                            fieldName={"rating"}
                                            touched={formik.touched}
                                        />
                                    </div>
                                </div>

                                <div className="col-lg-12 d-flex justify-content-between mt-3">
                                    <Link to="/reviews-list" type="button" className="btn btn-back">
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
export default AddReview;
