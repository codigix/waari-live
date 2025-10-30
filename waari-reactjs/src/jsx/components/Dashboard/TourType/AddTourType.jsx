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

const validationSchema = Yup.object().shape({
    tourTypeImage: Yup.string()
        .required("Image URL is required")
        .url("Invalid URL format for the image"),
    tourTypeName: Yup.string().required("Tour Type Name is required"),
});

const AddTourType = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);

    // this hook is for form validation
    const formik = useFormik({
        initialValues: {
            tourTypeImage: "",
            tourTypeName: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
                const data = {
                    tourTypeImage: values.tourTypeImage,
                    tourTypeName: values.tourTypeName,
                };
                const result = await post(`add-tour-type`, data);
                toast.success(result?.data?.message);
                navigate("/tour-type-list");
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.log(error);
            }
        },
    });

    useEffect(() => {
        let element = document.getElementById("tour-type-list");
        if (element) {
            element.classList.add("mm-active1"); // Add the 'active' className to the element
        }
        return () => {
            if (element) {
                element.classList.remove("mm-active1"); // remove the 'active' className to the element when change to another page
            }
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
                                    <Link to="/tour-type-list">Tour Type Sections</Link>
                                </li>
                                <li className="breadcrumb-item  ">
                                    <Link to="javascript:void(0)">Add Tour Type</Link>
                                </li>
                            </ol>
                        </div>
                    </div>


                    {/* form for above filed */}
                    <div className="card">
                        <div className="card-body">
                            <div className="card-header mb-2 p-0">
                                <div className="card-title h5">Add Tour Type</div>
                            </div>

                            <form onSubmit={formik.handleSubmit} className="needs-validation">
                                <div className="row">
                                    <div className="col-md-8 col-lg-6 col-sm-6 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Tour Type Name<span className="error-star">*</span>
                                            </label>
                                            <input
                                                id="tourTypeName"
                                                name="tourTypeName"
                                                type="text"
                                                className="form-control"
                                                onChange={formik.handleChange}
                                                value={formik.values.tourTypeName}
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"tourTypeName"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-12 col-lg-6 col-sm-12 col-12">
                                        <label className="text-label">
                                            Upload Image<span className="error-star">*</span>
                                        </label>
                                        <div className="col-md-12">
                                            <div className="Neon Neon-theme-dragdropbox">
                                                <input
                                                    className="file_upload"
                                                    name={`tourTypeImage`}
                                                    accept="image/*"
                                                    id="filer_input2"
                                                    type="file"
                                                    draggable
                                                    onChange={async (e) => {
                                                        const selectedFile = e.target.files[0];
                                                        const fileLink = await getFileLink(
                                                            selectedFile
                                                        );
                                                        formik.setFieldValue(
                                                            `tourTypeImage`,
                                                            fileLink
                                                        );
                                                    }}
                                                />
                                                <div className="Neon-input-dragDrop">
                                                    {formik.values.tourTypeImage?.length == 0 ? (
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
                                                            src={
                                                                formik.values.tourTypeImage ||
                                                                NoImage
                                                            }
                                                            alt="frontImage"
                                                            width="100%"
                                                            className="neon-img"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"tourTypeImage"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-12 d-flex justify-content-between mt-3">
                                    <Link
                                        to="/tour-type-list"
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
export default AddTourType;
