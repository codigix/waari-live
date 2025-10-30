import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";
import { post } from "../../services/apiServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login } from "../../store/actions/authActions";

// image
import loginbg from "../../images/pic1.png";

function OTPVerify(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { state } = useLocation();
    const email = state.email;

    const [isLoading, setIsLoading] = useState(false);

    const validation = useFormik({
        enableReinitialize: true,

        initialValues: {
            email: email || "",
            otp: "",
        },

        validationSchema: Yup.object({
            email: Yup.string().email("Please enter valid email address").required(),
            otp: Yup.string()
                .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
                .required("Please enter the OTP"),
        }),

        onSubmit: async (values) => {
            try {
                const data = {
                    email: email,
                    otp: values.otp,
                };

                setIsLoading(true);
                const response = await post(`/verify-otp`, data);

                if (response && response?.status === 200) {
                    dispatch(
                        login(
                            response?.data?.token,
                            response?.data?.permissions,
                            response?.data?.roleId,
                            response?.data?.userId
                        )
                    );
                    toast.success("Login successful");
                    navigate("/dashboard");
                }
            } catch (error) {
                console.log(error?.response?.data?.message[0]);
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <div className="authincation d-flex flex-column flex-lg-row flex-column-fluid">
            <div className="login-aside text-center  d-flex flex-column flex-row-auto">
                <div className="d-flex flex-column-auto flex-column pt-lg-40 pt-15">
                    <div className="text-center mb-4 pt-5">
                        <img
                            src={import.meta.env.VITE_WAARI_LOGO_PATH}
                            alt=""
                            className="login-logo"
                        />
                    </div>
                    <h3 className="mb-2">Welcome back!</h3>
                    {/* <p>
            User Experience & Interface Design <br />
            Strategy SaaS Solutions
          </p> */}
                </div>
                <div
                    className="aside-image"
                    style={{ backgroundImage: "url(" + loginbg + ")" }}
                ></div>
            </div>
            <div className="container flex-row-fluid d-flex flex-column justify-content-center position-relative overflow-hidden p-7 mx-auto">
                <div className="d-flex justify-content-center h-100 align-items-center">
                    <div className="authincation-content style-2">
                        <div className="row no-gutters">
                            <div className="col-xl-12 tab-content">
                                <div
                                    id="sign-in"
                                    className="auth-form   form-validation"
                                >
                                    {props.errorMessage && (
                                        <div className="bg-red-300 text-red-900 border border-red-900 p-1 my-2">
                                            {props.errorMessage}
                                        </div>
                                    )}
                                    {props.successMessage && (
                                        <div className="bg-green-300 text-green-900 border border-green-900 p-1 my-2">
                                            {props.successMessage}
                                        </div>
                                    )}

                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            validation.handleSubmit();
                                            return false;
                                        }}
                                        className="login-form shadow-md rounded-lg  mb-4"
                                    >
                                        <h3 className="text-center mb-4 text-black">
                                            Verify OTP
                                        </h3>

                                        <div className="form-group mb-3">
                                            <label
                                                className="mb-1"
                                                htmlFor="val-email"
                                            >
                                                <strong>Email</strong>
                                            </label>
                                            <div>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="form-control bg-light"
                                                    placeholder="Type Your Email Address"
                                                    onChange={
                                                        validation.handleChange
                                                    }
                                                    onBlur={
                                                        validation.handleBlur
                                                    }
                                                    value={
                                                        validation.values.email
                                                    }
                                                    disabled
                                                />
                                            </div>
                                            {validation.touched.email &&
                                            validation.errors.email ? (
                                                <span className="error">
                                                    {validation.errors.email}
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className="form-group mb-3">
                                            <label
                                                className="mb-1"
                                                htmlFor="val-email"
                                            >
                                                <strong>OTP</strong>
                                            </label>
                                            <div>
                                                <input
                                                    type="number"
                                                    name="otp"
                                                    className="form-control"
                                                    placeholder="Enter 6 digits OTP"
                                                    onChange={
                                                        validation.handleChange
                                                    }
                                                    onWheel={(e) =>
                                                        e.target.blur()
                                                    } // Prevent scroll increment/decrement
                                                    onBlur={
                                                        validation.handleBlur
                                                    }
                                                    value={
                                                        validation.values.otp
                                                    }
                                                />
                                            </div>
                                            {validation.touched.otp &&
                                            validation.errors.otp ? (
                                                <span className="error">
                                                    {validation.errors.otp}
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className="bg-blue-100 text-blue-900 border border-blue-900 p-2 rounded mb-3">
                                            We have sent a 6-digit OTP to your
                                            registered email address. Please
                                            enter it below to verify your
                                            account.
                                        </div>
                                        <div className="text-center form-group mb-3">
                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-submit btn-block"
                                                disabled={isLoading}
                                            >
                                                {isLoading
                                                    ? "Verifing..."
                                                    : "Verify"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OTPVerify;
