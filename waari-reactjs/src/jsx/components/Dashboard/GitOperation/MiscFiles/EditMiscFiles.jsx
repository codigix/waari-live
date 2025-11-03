import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { get, post } from "../../../../../services/apiServices";
const url = import.meta.env.VITE_WAARI_BASEURL;

// Helper Function to Upload Image and Get URL
const getFileLink = async (file) => {
    try {
        const formData = new FormData();
        formData.append("image", file);

        const responseData = await axios.post(`${url}/image-upload`, formData);
        toast.success("File uploaded successfully");
        return responseData?.data?.image_url;
    } catch (error) {
        toast.error(error?.response?.data?.message?.toString() || "Failed to upload image");
        console.error(error);
        return null;
    }
};

// Validation Schema
const validationSchema = Yup.object().shape({
    busListUrl: Yup.array().min(1, "At least one Bus List image is required"),
    airTicketsUrl: Yup.array().min(1, "At least one Air Tickets image is required"),
    flightTicketsUrl: Yup.array().min(1, "At least one Flight Tickets image is required"),
    othersUrl: Yup.array().min(1, "At least one Others image is required"),
});

const EditMiscFiles = ({ editId, handleSucessEdit }) => {
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            busListUrl: [],
            airTicketsUrl: [],
            flightTicketsUrl: [],
            othersUrl: [],
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
                // API Call to Submit URLs
                const response = await post("/update-gt-miscellaneous-files-details", {
                    ...values,
                    miscellaneousFilesId: editId,
                });
                toast.success("Miscellaneous files Updated successfully");
                handleSucessEdit(true);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.error(error);
            }
        },
    });

    const handleFileUpload = async (event, fieldName) => {
        const files = Array.from(event.target.files);
        const uploadedUrls = [];
        for (const file of files) {
            const fileLink = await getFileLink(file);
            if (fileLink) {
                uploadedUrls.push(fileLink);
            }
        }
        // Update Formik Field Value with Uploaded URLs
        formik.setFieldValue(fieldName, [...uploadedUrls]);
    };

    const getData = async () => {
        try {
            const result = await get(
                `edit-gt-miscellaneous-files-details?miscellaneousFilesId=${editId}`
            );
            const { busListUrl, airTicketsUrl, flightTicketsUrl, othersUrl } = result?.data?.data;

            // Prefill form fields with the response data
            formik.setFieldValue("busListUrl", JSON.parse(busListUrl) || []);
            formik.setFieldValue("airTicketsUrl", JSON.parse(airTicketsUrl) || []);
            formik.setFieldValue("flightTicketsUrl", JSON.parse(flightTicketsUrl) || []);
            formik.setFieldValue("othersUrl", JSON.parse(othersUrl) || []);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        let element = document.getElementById(`git-operation-tours-list`);
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
        <form className="card p-4" onSubmit={formik.handleSubmit}>
            <div className="row">
                {/* Bus List Images */}
                <div className="col-12 col-md-6 mb-4">
                    <label htmlFor="busListUrl">Bus List Images</label>
                    <input
                        id="busListUrl"
                        name="busListUrl"
                        type="file"
                        className="form-control"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "busListUrl")}
                    />
                    {formik.values.busListUrl.length > 0 && (
                        <ul>
                            {formik.values.busListUrl.map((url, index) => (
                                <li key={index}>
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className=""
                                    >
                                        {url}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                    {formik.touched.busListUrl && formik.errors.busListUrl && (
                        <div className="text-danger">{formik.errors.busListUrl}</div>
                    )}
                </div>

                {/* Air Tickets Images */}
                <div className="col-12 col-md-6 mb-4">
                    <label htmlFor="airTicketsUrl">Air Tickets Images</label>
                    <input
                        id="airTicketsUrl"
                        name="airTicketsUrl"
                        type="file"
                        className="form-control"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "airTicketsUrl")}
                    />
                    {formik.values.airTicketsUrl.length > 0 && (
                        <ul>
                            {formik.values.airTicketsUrl.map((url, index) => (
                                <li key={index}>
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className=""
                                    >
                                        {url}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                    {formik.touched.airTicketsUrl && formik.errors.airTicketsUrl && (
                        <div className="text-danger">{formik.errors.airTicketsUrl}</div>
                    )}
                </div>

                {/* Flight Tickets Images */}
                <div className="col-12 col-md-6 mb-4">
                    <label htmlFor="flightTicketsUrl">Flight Tickets Images</label>
                    <input
                        id="flightTicketsUrl"
                        name="flightTicketsUrl"
                        type="file"
                        className="form-control"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "flightTicketsUrl")}
                    />
                    {formik.values.flightTicketsUrl.length > 0 && (
                        <ul>
                            {formik.values.flightTicketsUrl.map((url, index) => (
                                <li key={index}>
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className=""
                                    >
                                        {url}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                    {formik.touched.flightTicketsUrl && formik.errors.flightTicketsUrl && (
                        <div className="text-danger">{formik.errors.flightTicketsUrl}</div>
                    )}
                </div>

                {/* Others Images */} 
                <div className="col-12 col-md-6 mb-4">
                    <label htmlFor="othersUrl">Others Images</label>
                    <input
                        id="othersUrl"
                        name="othersUrl"
                        type="file"
                        className="form-control"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "othersUrl")}
                    />
                    {formik.values.othersUrl.length > 0 && (
                        <ul>
                            {formik.values.othersUrl.map((url, index) => (
                                <li key={index}>
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className=""
                                    >
                                        {url}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                    {formik.touched.othersUrl && formik.errors.othersUrl && (
                        <div className="text-danger">{formik.errors.othersUrl}</div>
                    )}
                </div>
            </div>

            {/* Submit Button */}
            <div className="col-lg-12 d-flex justify-content-between mt-3">
                <div onClick={handleSucessEdit} type="button" className="btn btn-back">
                    Back
                </div>
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
    );
};

export default EditMiscFiles;
