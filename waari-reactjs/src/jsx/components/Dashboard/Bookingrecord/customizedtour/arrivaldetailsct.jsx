import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Arrivaldetailsct = () => {
    const guesttype = [
        { value: '1', label: 'D2D' },
        { value: '2', label: 'Air' },
        { value: '3', label: 'Flight' }
    ]
    const modeoftravel = [
        { value: '1', label: 'Train' },
        { value: '2', label: 'Air' },
        { value: '3', label: 'Flight' }
    ]

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            height: "34px", // Adjust the height to your preference
        }),
    };


    return (
        <>
           <div className="basic-form">
                        <form className="needs-validation">

                            <div className="row">
                                <div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
                                    <label>
                                        First Name of Family head<span className="error-star">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder=""
                                        name="familyhead"
                                    />
                                </div>
                                <div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
                                    <label>
                                        Last Name<span className="error-star">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder=""
                                        name="familyhead"
                                    />
                                </div>
                                <div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
                                    <label>
                                        Tour Name<span className="error-star">*</span>
                                    </label>
                                     <input
                                        type="text"
                                        className="form-control"
                                        placeholder=""
                                        name="tourname"
                                    />
                                </div>
                                <div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
                                    <label>
                                        Tour code<span className="error-star">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        placeholder=""
                                        name="tourcode"
                                    />
                                </div>
                                <div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
                                    <label>
                                        Guest type<span className="error-star">*</span>
                                    </label>
                                    <Select
                                        styles={customStyles}
                                        className="basic-single"
                                        classNamePrefix="select"
                                        name="gusettype"
                                        options={guesttype}
                                    />
                                </div>

                                <div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
                                    <label className="form-label">
                                        Contact Number<span className="error-star">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="contactno"
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
                                    <label>
                                        Mode of travel (D2D guest)<span className="error-star">*</span>
                                    </label>
                                    <Select
                                        styles={customStyles}
                                        className="basic-single"
                                        classNamePrefix="select"
                                        name="modeoftravel"
                                        options={modeoftravel}
                                    />
                                </div>
                                <div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
                                    <label className="form-label">
                                    Time of arrival at meeting point<span className="error-star">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        name="contactno"
                                        className="form-control"
                                    />
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
                                    >
                                         Save And Continue
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
        </>
    )
};
export default Arrivaldetailsct;