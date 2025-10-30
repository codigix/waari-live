import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackButton from "../../common/BackButton"

import { get, post } from "../../../../services/apiServices";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import ErrorMessageComponent from "../FormErrorComponent/ErrorMessageComponent";
import { set } from "lodash";
const Coupon = () => {
    const options = [
        { value: '1', label: 'Fixed Amount' },
        { value: '2', label: 'percentage' },
      ]
      
      const paymentmode = [
        { value: '1', label: 'Cash' },
        { value: '2', label: 'Cheque' },
        { value: '3', label: 'Internet Banking' },
        { value: '4', label: 'UPI' },
      ]
    const [isClearable, setIsClearable] = useState(true);
    const [isSearchable, setIsSearchable] = useState(true);
    useEffect(() => {
        let element = document.getElementById("group-tour")
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

                                <li className="breadcrumb-item  ">
                                    <Link to="/coupon">Coupon</Link>
                                </li>
                            </ol>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <div className="basic-form">
                                <form className="needs-validation" >
                                    <div className="card-header" style={{ paddingLeft: "0" }}>
                                        <div className="card-title h5">Coupon Details</div>
                                    </div>
                                    <div className="row">
                                        <div className="mb-2 col-md-8">
                                            <label className="form-label">Coupon Name<span className="error-star"></span></label>
                                            <input type="text" className="form-control" placeholder="" name="Coupon Name" value="" />
                                        </div>
                                        <div className="mb-2 col-md-4">
                                            <label className="form-label">Start Date<span className="error-star"></span></label>
                                            <input type="date" className="form-control" placeholder="" name="Start Date" value="" />
                                        </div>
                                        <div className="mb-2 col-md-4">
                                            <label className="form-label">Validity  Date<span className="error-star"></span></label>
                                            <input type="date" className="form-control" placeholder="" name="Validity  Date" value="" />
                                        </div>
                                        <div className="mb-2 col-md-4">
                                            <label className="form-label">Status<span className="error-star"></span></label>
                                            <div className="d-flex" style={{ gap: "10px" }}>
                                                <div className="filled-in chk-col-primary">
                                                    <input className="form-check-input" type="radio" name="isActive" id="yes" value="1" />
                                                <label className="form-check-label" htmlFor="yes" style={{ marginTop: "0" }}>Active</label>
                                                </div>
                                                <div className="filled-in chk-col-primary">
                                                    <input className="form-check-input" type="radio" name="isActive" id="No" value="0" />
                                                    <label className="form-check-label" htmlFor="No" style={{ marginTop: "0" }}>Deactive</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-2 col-md-4">
                                            <label className="form-label">Discount Type<span className="error-star"></span></label>
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                isClearable={isClearable}
                                                 isSearchable={isSearchable}
                                                options={options}
                                            />
                                        </div>
                                        <div className="mb-2 col-md-4">
                                            <label className="form-label">Discount Value<span className="error-star"></span></label>
                                            <input type="number" className="form-control" placeholder="" name="Discount value" value="" />
                                        </div>
                                        <div className="mb-2 col-md-4">
                                            <label className="form-label">Maximum Discount Limit<span className="error-star"></span></label>
                                            <input type="number" className="form-control" placeholder="" name="Maximum Discount Limit" value="" />
                                        </div>
                                        <div className="mb-2 col-md-4">
                                            <label className="form-label">Commission Amount<span className="error-star"></span></label>
                                            <input type="number" className="form-control" placeholder="" name="Commission Amount" value="" />
                                        </div>
                                    
                                        <div className="card-header card-header-title"><div className="card-title h5">Payment Details</div></div>
                                        <div className="mb-2 col-md-4">
                                            <label className="form-label">Payment Mode<span className="error-star"></span></label>
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                isClearable={isClearable}
                                                 isSearchable={isSearchable}
                                                options={paymentmode}
                                            />
                                        </div>
                                        <div className="mb-2 col-md-4">
                                            <label className="form-label">UPI ID<span className="error-star"></span></label>
                                            <input type="text" className="form-control" placeholder="" name="UPI ID" value="" />
                                        </div>
                                        <div className="mb-2 col-md-4">
                                            <label className="form-label">Amount<span className="error-star"></span></label>
                                            <input type="text" className="form-control" placeholder="" name="Amount" value="" />
                                        </div>
                                        <div className="mb-2 col-md-4">
                                            <label className="form-label">Cheque<span className="error-star"></span></label>
                                            <input type="text" className="form-control" placeholder="" name="Amount" value="" />
                                        </div>
                                    </div>
                                    <div className="mb-2 mt-2 row">
                                        <div className="col-lg-12 d-flex justify-content-end">
                                            {/* <Link
                                                to="/group-tour"
                                                type="submit"
                                                className="btn btn-back"
                                            >
                                                Back
                                            </Link> */}
                                            <button
                                                type="submit"
                                                className="btn btn-submit btn-primary"

                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Coupon;
