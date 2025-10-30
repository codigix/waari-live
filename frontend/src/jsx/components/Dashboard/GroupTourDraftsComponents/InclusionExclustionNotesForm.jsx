import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { get, post } from "../../../../services/apiServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip } from "@mui/material";
import ErrorMessageComponent from "../FormErrorComponent/ErrorMessageComponent";
import { Link, useNavigate } from "react-router-dom";
const url = import.meta.env.VITE_WAARI_BASEURL;

const InclusionExclustionNotesForm = ({ groupTourId, toursData }) => {
    const navigate = useNavigate()
    
    const skeletonValidationSchema = Yup.object().shape({
        inclusions: Yup.array().of(
            Yup.object().shape({
                description: Yup.string().required(
                    "Enter the Inclusion Desription"
                ),
            })
        ),
        exclusions: Yup.array().of(
            Yup.object().shape({
                description: Yup.string().required(
                    "Enter the exclusion Desription"
                ),
            })
        ),
        note: Yup.array().of(
            Yup.object().shape({
                note: Yup.string().required(
                    "Enter the Notes Desription"
                ),
            })
        ),
    });

    const formik = useFormik({
        initialValues: {
            inclusions: [{ description: "" }],
            exclusions: [{ description: "" }],
            note: [{ note: "" }],
        },
        validationSchema: skeletonValidationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            let data = {
                groupTourId: groupTourId,
                inclusions: values.inclusions,
                exclusions: values.exclusions,
                note: values.note,
            };
            try {
                setSubmitting(true);
                const response = await post(`add-group-tour-info`, data);
                toast.success(response?.data?.message);
                navigate("/View-group-tour")
            } catch (error) {
                console.log(error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    useEffect(() => {
        if (toursData && toursData.tourPrice) {
            if (toursData.inclusions.length)
                formik.setFieldValue("inclusions", toursData.inclusions);
            if (toursData.exclusions.length)
                formik.setFieldValue("exclusions", toursData.exclusions);
            if (toursData.note.length)
                formik.setFieldValue("note", toursData.note);
        }
    }, [toursData]);

    const handleAddInclusion = () => {
        formik.setFieldValue("inclusions", [
            ...formik.values.inclusions,
            { description: "" },
        ]);
    };

    const handleRemoveInclusion = (index) => {
        const updatedInclusions = [...formik.values.inclusions];
        updatedInclusions.splice(index, 1);
        formik.setFieldValue("inclusions", updatedInclusions);
    };

    const handleAddExclusion = () => {
        formik.setFieldValue("exclusions", [
            ...formik.values.exclusions,
            { description: "" },
        ]);
    };

    const handleRemoveExclusion = (index) => {
        const updatedExclusions = [...formik.values.exclusions];
        updatedExclusions.splice(index, 1);
        formik.setFieldValue("exclusions", updatedExclusions);
    };

    const handleAddNote = () => {
        formik.setFieldValue("note", [...formik.values.note, { note: "" }]);
    };

    const handleRemoveNote = (index) => {
        const updatedNotes = [...formik.values.note];
        updatedNotes.splice(index, 1);
        formik.setFieldValue("note", updatedNotes);
    };

    console.log("formik.Values", formik.values)
    console.log("formik.Errors", formik.errors)

    return (
        <form className="card">
            <div className="card-body">
                <div className="row">
                    <div className="col-md-12">
                        <div className="inclusion mb-2">
                            <div
                                className="card-header  pb-2 pt-2"
                                style={{ paddingLeft: "0" }}
                            >
                                <div className="card-title h5">
                                    Inclusions
                                    <span className="error-star">*</span>{" "}
                                    <Tooltip title="Add">
                                        <button
                                            type="button"
                                            className="btn btn-save btn-primary me-2 "
                                            onClick={handleAddInclusion}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="1em"
                                                fill="#07"
                                                viewBox="0 0 448 512"
                                            >
                                                <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path>
                                            </svg>
                                        </button>
                                    </Tooltip>
                                </div>
                            </div>

                            <>
                                {formik.values.inclusions.map(
                                    (inclusion, index) => (
                                        <div className="col-md-12">
                                            <div className="mb-2">
                                                <label>
                                                    Description
                                                    <span className="error-star">
                                                        *
                                                    </span>
                                                </label>
                                                <div className="d-flex gap-2">
                                                    <input
                                                        id={`inclusions[${index}].description`}
                                                        name={`inclusions[${index}].description`}
                                                        type="text"
                                                        min={3}
                                                        max={50}
                                                        className="form-control"
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        value={
                                                            inclusion.description
                                                        }
                                                    />

                                                    {formik.values.inclusions
                                                        .length > 1 && (
                                                        <Tooltip title="Delete">
                                                            <button
                                                                type="button"
                                                                className="btn btn-trash bg-yellow"
                                                                onClick={() =>
                                                                    handleRemoveInclusion(
                                                                        index
                                                                    )
                                                                }
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    height="1em"
                                                                    viewBox="0 0 448 512"
                                                                    aria-label="Delete"
                                                                    className=""
                                                                    data-mui-internal-clone-element="true"
                                                                >
                                                                    <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"></path>
                                                                </svg>
                                                            </button>
                                                        </Tooltip>
                                                    )}
                                                </div>
                                                {formik.touched.inclusions &&
                                                    formik.touched.inclusions[
                                                        index
                                                    ]?.description &&
                                                    formik.errors &&
                                                    formik.errors.inclusions &&
                                                    formik.errors.inclusions[
                                                        index
                                                    ]?.description && (
                                                        <span className="error">
                                                            {
                                                                formik.errors
                                                                    .inclusions[
                                                                    index
                                                                ].description
                                                            }
                                                        </span>
                                                    )}
                                            </div>
                                        </div>
                                    )
                                )}
                            </>
                        </div>

                        <div className="exclusion mb-2">
                            <div
                                className="card-header  pb-2 pt-2"
                                style={{ paddingLeft: "0" }}
                            >
                                <div className="card-title h5">
                                    Exclusions
                                    <span className="error-star">*</span>{" "}
                                    <Tooltip title="Add">
                                        <button
                                            type="button"
                                            className="btn btn-save btn-primary me-2 "
                                            onClick={handleAddExclusion}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="1em"
                                                fill="#07"
                                                viewBox="0 0 448 512"
                                            >
                                                <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path>
                                            </svg>
                                        </button>
                                    </Tooltip>
                                </div>
                            </div>
                            <>
                                {formik.values.exclusions.map(
                                    (inclusion, index) => (
                                        <div className="col-md-12">
                                            <div className="mb-2">
                                                <label>
                                                    Description
                                                    <span className="error-star">
                                                        *
                                                    </span>
                                                </label>
                                                <div className="d-flex gap-2">
                                                    <input
                                                        id={`exclusions[${index}].description`}
                                                        name={`exclusions[${index}].description`}
                                                        type="text"
                                                        min={3}
                                                        max={50}
                                                        className="form-control"
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        value={
                                                            inclusion.description
                                                        }
                                                    />

                                                    {formik.values.exclusions
                                                        .length > 1 && (
                                                        <Tooltip title="Delete">
                                                            <button
                                                                type="button"
                                                                className="btn btn-trash bg-yellow"
                                                                onClick={() =>
                                                                    handleRemoveExclusion(
                                                                        index
                                                                    )
                                                                }
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    height="1em"
                                                                    viewBox="0 0 448 512"
                                                                    aria-label="Delete"
                                                                    className=""
                                                                    data-mui-internal-clone-element="true"
                                                                >
                                                                    <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"></path>
                                                                </svg>
                                                            </button>
                                                        </Tooltip>
                                                    )}
                                                </div>
                                                {formik.touched.exclusions &&
                                                    formik.touched.exclusions[
                                                        index
                                                    ]?.description &&
                                                    formik.errors &&
                                                    formik.errors.exclusions &&
                                                    formik.errors.exclusions[
                                                        index
                                                    ]?.description && (
                                                        <span className="error">
                                                            {
                                                                formik.errors
                                                                    .exclusions[
                                                                    index
                                                                ].description
                                                            }
                                                        </span>
                                                    )}
                                            </div>
                                        </div>
                                    )
                                )}
                            </>
                        </div>

                        <div className="notes mb-3">
                            <div
                                className="card-header pb-2 pt-2"
                                style={{ paddingLeft: "0" }}
                            >
                                <div className="card-title h5">
                                    Note<span className="error-star"></span>{" "}
                                    <Tooltip title="Add">
                                        <button
                                            type="button"
                                            className="btn btn-save btn-primary"
                                            onClick={handleAddNote}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="1em"
                                                fill="#07"
                                                viewBox="0 0 448 512"
                                            >
                                                <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path>
                                            </svg>
                                        </button>
                                    </Tooltip>
                                </div>
                            </div>
                            {formik.values.note.map((item, index) => (
                                <div className="mb-2">
                                    <label>Description <span className="error">*</span></label>
                                    <div
                                        className="d-flex gap-2 "
                                        style={{ alignItems: "baseline" }}
                                    >
                                        <textarea
                                            key={index}
                                            type="text"
                                            className="textarea"
                                            id={`note[${index}].note`}
                                            name={`note[${index}].note`}
                                            value={item.note}
                                            onChange={formik.handleChange}
                                        />
                                        {formik.values.note.length > 1 && (
                                            <Tooltip title="Delete">
                                                <button
                                                    type="button"
                                                    className="btn btn-trash bg-yellow"
                                                    onClick={() =>
                                                        handleRemoveNote(index)
                                                    }
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        height="1em"
                                                        viewBox="0 0 448 512"
                                                        aria-label="Delete"
                                                        class=""
                                                        data-mui-internal-clone-element="true"
                                                    >
                                                        <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"></path>
                                                    </svg>
                                                </button>
                                            </Tooltip>
                                        )}
                                    </div>
                                    {formik.touched.note &&
                                                    formik.touched.note[
                                                        index
                                                    ]?.note &&
                                                    formik.errors &&
                                                    formik.errors.note &&
                                                    formik.errors.note[
                                                        index
                                                    ]?.note && (
                                                        <span className="error">
                                                            {
                                                                formik.errors
                                                                    .note[
                                                                    index
                                                                ].note
                                                            }
                                                        </span>
                                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-lg-12">
                            Please fill all the required sections above before saving
                    </div>
                <div className="col-lg-12 d-flex justify-content-between mt-3">
                    <Link
                        to="/view-draft-grouptours-list"
                        type="submit"
                        className="btn btn-back"
                    >
                        Back
                    </Link>
                    <div className="d-flex">
                        <button
                            onClick={formik.handleSubmit}
                            type="button"
                            className="btn btn-submit btn-primary"
                            disabled={formik.isSubmitting}
                        >
                            {formik.isSubmitting ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default InclusionExclustionNotesForm;
